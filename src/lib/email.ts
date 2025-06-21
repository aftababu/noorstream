import nodemailer from 'nodemailer';

// Create a transporter based on environment
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.NODE_ENV === 'production',
});

// Email templates
const emailTemplates = {
  verification: (token: string) => ({
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Verify your email address</h1>
        <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the link below:</p>
        <a 
          href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}" 
          style="display: inline-block; background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;"
        >
          Verify Email Address
        </a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
    `,
  })
};

/**
 * Send a verification email to a new user
 */
export async function sendVerificationEmail(email: string, token: string) {
  const { subject, html } = emailTemplates.verification(token);

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html,
  });
}