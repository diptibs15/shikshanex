import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Smartphone, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BankAccountForm from './BankAccountForm';

interface BankAccount {
  id: string;
  account_type: string;
  account_holder_name: string;
  bank_name: string | null;
  account_number: string | null;
  upi_id: string | null;
  is_primary: boolean;
}

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletId: string;
  balance: number;
  onSuccess: () => void;
}

const WithdrawalDialog = ({
  open,
  onOpenChange,
  walletId,
  balance,
  onSuccess,
}: WithdrawalDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  useEffect(() => {
    if (open && user) {
      fetchBankAccounts();
    }
  }, [open, user]);

  const fetchBankAccounts = async () => {
    if (!user) return;
    setFetchingAccounts(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setBankAccounts(data || []);
      if (data && data.length > 0) {
        setSelectedAccount(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setFetchingAccounts(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !selectedAccount || !amount) return;

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 500) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum withdrawal amount is ₹500',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawAmount > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You cannot withdraw more than your available balance',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('request_withdrawal', {
        p_wallet_id: walletId,
        p_bank_account_id: selectedAccount,
        p_amount: withdrawAmount,
      });

      if (error) throw error;

      setStep('success');
      toast({
        title: 'Withdrawal Requested',
        description: `₹${withdrawAmount.toLocaleString()} withdrawal request submitted successfully.`,
      });
    } catch (error: any) {
      console.error('Error requesting withdrawal:', error);
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Failed to process withdrawal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess();
    }
    setStep('select');
    setAmount('');
    setShowAddAccount(false);
    onOpenChange(false);
  };

  const getAccountDisplay = (account: BankAccount) => {
    if (account.account_type === 'upi') {
      return account.upi_id;
    }
    const maskedNumber = account.account_number
      ? '****' + account.account_number.slice(-4)
      : '';
    return `${account.bank_name} - ${maskedNumber}`;
  };

  const nextWithdrawDate = new Date();
  nextWithdrawDate.setDate(5);
  if (new Date().getDate() > 5) {
    nextWithdrawDate.setMonth(nextWithdrawDate.getMonth() + 1);
  }
  const canWithdrawNow = new Date().getDate() <= 7 || new Date().getDate() >= 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showAddAccount ? 'Add Payment Account' : 'Withdraw Funds'}
          </DialogTitle>
          <DialogDescription>
            {showAddAccount
              ? 'Add a bank account or UPI ID to receive payments'
              : step === 'success'
              ? 'Your withdrawal request has been submitted'
              : 'Withdraw your earnings to your bank account or UPI'}
          </DialogDescription>
        </DialogHeader>

        {showAddAccount ? (
          <BankAccountForm
            onSuccess={() => {
              setShowAddAccount(false);
              fetchBankAccounts();
            }}
            onCancel={() => setShowAddAccount(false)}
          />
        ) : step === 'success' ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-healthcare" />
            <div className="text-center">
              <p className="font-semibold text-lg">Withdrawal Requested!</p>
              <p className="text-muted-foreground text-sm mt-1">
                ₹{parseFloat(amount).toLocaleString()} will be transferred within 3-5 business days
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : step === 'confirm' ? (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Withdrawal Amount</span>
                <span className="font-semibold">₹{parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transfer To</span>
                <span className="font-medium">
                  {bankAccounts.find((a) => a.id === selectedAccount)?.account_type === 'upi'
                    ? 'UPI'
                    : 'Bank Account'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account</span>
                <span className="font-medium">
                  {getAccountDisplay(
                    bankAccounts.find((a) => a.id === selectedAccount)!
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 text-accent-foreground mt-0.5 shrink-0" />
              <p>Processing time: 3-5 business days. Amount will be deducted immediately.</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Available Balance */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">₹{balance.toLocaleString()}</p>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Withdrawal Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount (min ₹500)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={500}
                max={balance}
              />
              <p className="text-xs text-muted-foreground">
                Minimum withdrawal: ₹500
              </p>
            </div>

            {/* Select Account */}
            <div className="space-y-2">
              <Label>Select Payment Account</Label>
              {fetchingAccounts ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : bankAccounts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    No payment accounts added yet
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddAccount(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Account
                  </Button>
                </div>
              ) : (
                <RadioGroup
                  value={selectedAccount}
                  onValueChange={setSelectedAccount}
                  className="space-y-2"
                >
                  {bankAccounts.map((account) => (
                    <div key={account.id}>
                      <RadioGroupItem
                        value={account.id}
                        id={account.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={account.id}
                        className="flex items-center gap-3 rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                      >
                        {account.account_type === 'upi' ? (
                          <Smartphone className="h-5 w-5 text-primary" />
                        ) : (
                          <Building2 className="h-5 w-5 text-primary" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {account.account_holder_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getAccountDisplay(account)}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddAccount(true)}
                    className="w-full mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Account
                  </Button>
                </RadioGroup>
              )}
            </div>

            {/* Submit Button */}
            {bankAccounts.length > 0 && (
              <Button
                onClick={() => setStep('confirm')}
                disabled={!selectedAccount || !amount || parseFloat(amount) < 500}
                className="w-full"
              >
                Continue
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
