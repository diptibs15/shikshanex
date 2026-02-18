import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, ArrowDownToLine, History, Loader2, CreditCard } from 'lucide-react';
import WithdrawalDialog from '@/components/wallet/WithdrawalDialog';
 
 interface WalletData {
   id: string;
   balance: number;
   total_earned: number;
   total_withdrawn: number;
 }
 
 interface Transaction {
   id: string;
   type: string;
   amount: number;
   description: string | null;
   status: string;
   created_at: string;
 }
 
const WalletCard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [bankAccountCount, setBankAccountCount] = useState(0);
 
   useEffect(() => {
     const fetchWallet = async () => {
       if (!user) return;
 
       try {
         // Try to get existing wallet
         let { data: walletData, error } = await supabase
           .from('wallets')
           .select('*')
           .eq('user_id', user.id)
           .single();
 
         if (error && error.code === 'PGRST116') {
           // No wallet exists, create one
           const { data: newWallet } = await supabase
             .from('wallets')
             .insert({ user_id: user.id })
             .select()
             .single();
           walletData = newWallet;
         }
 
         if (walletData) {
           setWallet(walletData);
 
           // Fetch recent transactions
           const { data: txData } = await supabase
             .from('wallet_transactions')
             .select('*')
             .eq('wallet_id', walletData.id)
             .order('created_at', { ascending: false })
             .limit(5);
 
          if (txData) {
              setTransactions(txData);
            }
          }

          // Fetch bank accounts count
          const { count } = await supabase
            .from('bank_accounts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          setBankAccountCount(count || 0);
        } catch (error) {
          console.error('Error fetching wallet:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchWallet();
    }, [user]);

  const refetchWallet = async () => {
    if (!user || !wallet) return;
    
    const { data: walletData } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (walletData) {
      setWallet(walletData);
    }

    const { data: txData } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (txData) {
      setTransactions(txData);
    }
  };
 
   if (loading) {
     return (
       <Card className="shadow-card">
         <CardContent className="flex items-center justify-center h-48">
           <Loader2 className="h-6 w-6 animate-spin text-primary" />
         </CardContent>
       </Card>
     );
   }
 
   const canWithdraw = wallet && wallet.balance >= 500;
   const nextWithdrawDate = new Date();
   nextWithdrawDate.setDate(5);
   if (new Date().getDate() > 5) {
     nextWithdrawDate.setMonth(nextWithdrawDate.getMonth() + 1);
   }
 
   return (
     <Card className="shadow-card">
       <CardHeader className="pb-3">
         <CardTitle className="flex items-center gap-2 text-lg">
           <Wallet className="h-5 w-5 text-primary" />
           My Wallet
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         {/* Balance */}
         <div className="bg-gradient-to-r from-hr to-hr/80 rounded-xl p-4 text-white">
           <p className="text-sm text-white/70">Available Balance</p>
           <p className="text-3xl font-bold">₹{wallet?.balance?.toLocaleString() || 0}</p>
         </div>
 
         {/* Stats */}
         <div className="grid grid-cols-2 gap-3">
           <div className="bg-muted/50 rounded-lg p-3">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <TrendingUp className="h-4 w-4" />
               Total Earned
             </div>
             <p className="font-semibold text-healthcare mt-1">₹{wallet?.total_earned?.toLocaleString() || 0}</p>
           </div>
           <div className="bg-muted/50 rounded-lg p-3">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <ArrowDownToLine className="h-4 w-4" />
               Withdrawn
             </div>
             <p className="font-semibold mt-1">₹{wallet?.total_withdrawn?.toLocaleString() || 0}</p>
           </div>
         </div>
 
          {/* Withdraw Button */}
          <Button
            variant="outline"
            className="w-full"
            disabled={!canWithdraw}
            onClick={() => setShowWithdrawal(true)}
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            {canWithdraw ? 'Withdraw Funds' : `Min ₹500 required`}
          </Button>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              {bankAccountCount} linked account{bankAccountCount !== 1 ? 's' : ''}
            </span>
            <span>
              Next: {nextWithdrawDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
 
         {/* Recent Transactions */}
         {transactions.length > 0 && (
           <div className="pt-3 border-t">
             <div className="flex items-center gap-2 text-sm font-medium mb-3">
               <History className="h-4 w-4" />
               Recent Transactions
             </div>
             <div className="space-y-2">
               {transactions.map((tx) => (
                 <div key={tx.id} className="flex items-center justify-between text-sm">
                   <div>
                     <p className="font-medium">{tx.description || tx.type}</p>
                     <p className="text-xs text-muted-foreground">
                       {new Date(tx.created_at).toLocaleDateString()}
                     </p>
                   </div>
                   <Badge variant={tx.type === 'earning' ? 'default' : 'secondary'}>
                     {tx.type === 'earning' ? '+' : '-'}₹{tx.amount}
                   </Badge>
                 </div>
               ))}
              </div>
            </div>
          )}

          {/* Withdrawal Dialog */}
          {wallet && (
            <WithdrawalDialog
              open={showWithdrawal}
              onOpenChange={setShowWithdrawal}
              walletId={wallet.id}
              balance={wallet.balance}
              onSuccess={() => {
                setShowWithdrawal(false);
                refetchWallet();
              }}
            />
          )}
        </CardContent>
      </Card>
    );
  };

export default WalletCard;