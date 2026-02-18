-- Create bank_accounts table for storing user bank details
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('bank', 'upi')),
  account_holder_name TEXT NOT NULL,
  -- Bank account fields
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  -- UPI fields
  upi_id TEXT,
  -- Status
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create withdrawal_requests table
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id),
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id),
  amount NUMERIC NOT NULL CHECK (amount >= 500),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  processed_at TIMESTAMP WITH TIME ZONE,
  transaction_reference TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Bank accounts policies
CREATE POLICY "Users can view their own bank accounts"
ON public.bank_accounts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bank accounts"
ON public.bank_accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts"
ON public.bank_accounts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts"
ON public.bank_accounts FOR DELETE
USING (auth.uid() = user_id);

-- Withdrawal requests policies
CREATE POLICY "Users can view their own withdrawal requests"
ON public.withdrawal_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own withdrawal requests"
ON public.withdrawal_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all bank accounts"
ON public.bank_accounts FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage all withdrawal requests"
ON public.withdrawal_requests FOR ALL
USING (public.is_admin());

-- Trigger for updated_at on bank_accounts
CREATE TRIGGER update_bank_accounts_updated_at
BEFORE UPDATE ON public.bank_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to process withdrawal
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_wallet_id UUID,
  p_bank_account_id UUID,
  p_amount NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_balance NUMERIC;
  v_withdrawal_id UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Check wallet belongs to user and has sufficient balance
  SELECT balance INTO v_balance
  FROM wallets
  WHERE id = p_wallet_id AND user_id = v_user_id;
  
  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;
  
  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  IF p_amount < 500 THEN
    RAISE EXCEPTION 'Minimum withdrawal amount is ₹500';
  END IF;
  
  -- Check bank account belongs to user
  IF NOT EXISTS (SELECT 1 FROM bank_accounts WHERE id = p_bank_account_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'Bank account not found';
  END IF;
  
  -- Create withdrawal request
  INSERT INTO withdrawal_requests (user_id, wallet_id, bank_account_id, amount)
  VALUES (v_user_id, p_wallet_id, p_bank_account_id, p_amount)
  RETURNING id INTO v_withdrawal_id;
  
  -- Deduct from wallet balance
  UPDATE wallets
  SET balance = balance - p_amount,
      total_withdrawn = total_withdrawn + p_amount,
      updated_at = now()
  WHERE id = p_wallet_id;
  
  -- Create transaction record
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, description, status, reference_type, reference_id)
  VALUES (p_wallet_id, v_user_id, 'withdrawal', p_amount, 'Withdrawal request', 'pending', 'withdrawal', v_withdrawal_id::text);
  
  RETURN v_withdrawal_id;
END;
$$;