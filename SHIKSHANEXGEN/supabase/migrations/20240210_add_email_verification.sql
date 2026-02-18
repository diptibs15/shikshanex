-- Add email_verified column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Create email_verification_tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(10) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT token_not_empty CHECK (token != '')
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);

-- Create index on token for token lookup
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);

-- Create index on expires_at for cleanup
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

-- Enable RLS on email_verification_tokens
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own verification tokens
CREATE POLICY "Users can read their own tokens" ON email_verification_tokens
  FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to insert tokens
CREATE POLICY "Service role can insert tokens" ON email_verification_tokens
  FOR INSERT WITH CHECK (true);

-- Allow service role to delete tokens
CREATE POLICY "Service role can delete tokens" ON email_verification_tokens
  FOR DELETE USING (true);
