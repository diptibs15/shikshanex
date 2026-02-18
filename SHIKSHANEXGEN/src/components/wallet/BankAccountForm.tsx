import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, Smartphone } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const bankAccountSchema = z.object({
  accountType: z.enum(['bank', 'upi']),
  accountHolderName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional(),
}).refine((data) => {
  if (data.accountType === 'bank') {
    return data.bankName && data.accountNumber && data.ifscCode;
  }
  return true;
}, {
  message: 'Bank name, account number, and IFSC code are required for bank accounts',
  path: ['bankName'],
}).refine((data) => {
  if (data.accountType === 'upi') {
    return data.upiId && data.upiId.includes('@');
  }
  return true;
}, {
  message: 'Valid UPI ID is required (e.g., name@upi)',
  path: ['upiId'],
});

type FormData = z.infer<typeof bankAccountSchema>;

interface BankAccountFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BankAccountForm = ({ onSuccess, onCancel }: BankAccountFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      accountType: 'upi',
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
    },
  });

  const accountType = form.watch('accountType');

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('bank_accounts').insert({
        user_id: user.id,
        account_type: data.accountType,
        account_holder_name: data.accountHolderName,
        bank_name: data.accountType === 'bank' ? data.bankName : null,
        account_number: data.accountType === 'bank' ? data.accountNumber : null,
        ifsc_code: data.accountType === 'bank' ? data.ifscCode : null,
        upi_id: data.accountType === 'upi' ? data.upiId : null,
        is_primary: true,
      });

      if (error) throw error;

      toast({
        title: 'Account Added',
        description: 'Your payment account has been added successfully.',
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding account:', error);
      toast({
        title: 'Error',
        description: 'Failed to add payment account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="upi"
                      id="upi"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="upi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Smartphone className="mb-3 h-6 w-6" />
                      UPI
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="bank"
                      id="bank"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="bank"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Building2 className="mb-3 h-6 w-6" />
                      Bank Account
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {accountType === 'upi' && (
          <FormField
            control={form.control}
            name="upiId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID</FormLabel>
                <FormControl>
                  <Input placeholder="yourname@upi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {accountType === 'bank' && (
          <>
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., State Bank of India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SBIN0001234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BankAccountForm;
