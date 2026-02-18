import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  fullName: string;
  verificationToken: string;
  verificationUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, verificationToken, verificationUrl } = await req.json() as EmailRequest;

    // Get Gmail credentials from environment
    const gmailEmail = Deno.env.get('GMAIL_EMAIL');
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailEmail || !gmailPassword) {
      throw new Error('Gmail credentials not configured');
    }

    // Send email using Gmail SMTP
    const client = new SmtpClient();

    await client.connectTLS({
      hostname: 'smtp.gmail.com',
      port: 465,
      username: gmailEmail,
      password: gmailPassword,
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
            .code { background: #fff; padding: 20px; text-align: center; border: 2px solid #667eea; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ShikshaNex - Email Verification</h1>
            </div>
            <div class="content">
              <p>Hi ${fullName},</p>
              <p>Welcome to ShikshaNex! Please verify your email address to complete your signup.</p>
              
              <div class="code">${verificationToken}</div>
              
              <p>Or click the button below to verify your email:</p>
              
              <a href="${verificationUrl}" class="button">Verify Email</a>
              
              <p>This link will expire in 24 hours.</p>
              
              <p>If you didn't create this account, please ignore this email.</p>
              
              <div class="footer">
                <p>ShikshaNex Student Portal</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await client.send({
      from: gmailEmail,
      to: email,
      subject: 'Verify your ShikshaNex email',
      content: htmlContent,
      html: htmlContent,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
