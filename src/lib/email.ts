import sgMail from '@sendgrid/mail'
import type { EmailTemplate } from '@/types'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailOptions {
  to: string
  template: keyof typeof emailTemplates
  data: any // Relaxed type to allow different template data shapes
}

export async function sendEmail({ to, template, data }: EmailOptions): Promise<void> {
  try {
    const templateResult = emailTemplates[template](data);
    const { subject, html, text } = templateResult;
    const msg = {
      to,
      from: process.env.EMAIL_FROM || 'noreply@predicts.com',
      subject,
      html,
      ...(text ? { text } : {}),
    };
    await sgMail.send(msg)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Failed to send email')
  }
}

const emailStyles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;',
  header:
    'background-color: #1a365d; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;',
  content:
    'background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 5px 5px;',
  button:
    'display: inline-block; background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;',
  footer: 'text-align: center; margin-top: 20px; color: #718096; font-size: 14px;',
}

const baseTemplate = (content: string) => `
  <div style="${emailStyles.container}">
    ${content}
    <div style="${emailStyles.footer}">
      <p>© ${new Date().getFullYear()} Predicts. All rights reserved.</p>
    </div>
  </div>
`

export const emailTemplates = {
  welcome: (data: { name: string }) => ({
    subject: 'Welcome to Predicts!',
    text: `Welcome ${data.name}! We're excited to have you on board.`,
    html: `
      <div>
        <h1>Welcome to Predicts!</h1>
        <p>Hi ${data.name},</p>
        <p>We're excited to have you join our community of football prediction enthusiasts.</p>
        <p>Get started by exploring our predictions and packages.</p>
      </div>
    `,
  }),

  passwordReset: (data: { resetLink: string }) => ({
    subject: 'Reset Your Password',
    text: `Click here to reset your password: ${data.resetLink}`,
    html: `
      <div>
        <h1>Reset Your Password</h1>
        <p>Click the button below to reset your password:</p>
        <a href="${data.resetLink}" style="
          background-color: #1a56db;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
        ">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  }),

  paymentConfirmation: (data: { name: string, amount: number, package: string }) => ({
    subject: 'Payment Confirmation',
    text: `Payment of $${data.amount} for ${data.package} has been received.`,
    html: `
      <div>
        <h1>Payment Confirmation</h1>
        <p>Hi ${data.name},</p>
        <p>We've received your payment of $${data.amount} for ${data.package}.</p>
        <p>Your VIP access will be activated once the payment is verified.</p>
      </div>
    `,
  }),

  vipActivated: (data: { name: string, package: string, expiryDate: string }) => ({
    subject: 'VIP Access Activated',
    text: `Hi ${data.name}, your VIP access for ${data.package} has been activated and is valid until ${data.expiryDate}. Enjoy exclusive predictions and features!`,
    html: `
      <div>
        <h1>VIP Access Activated</h1>
        <p>Hi ${data.name},</p>
        <p>Your VIP access for ${data.package} has been activated.</p>
        <p>Your subscription is valid until ${data.expiryDate}.</p>
        <p>Enjoy exclusive predictions and features!</p>
      </div>
    `,
  }),

  predictionUpdate: (data: { name: string, prediction: string, status: string }) => ({
    subject: 'Prediction Update',
    text: `Hi ${data.name}, your prediction "${data.prediction}" has been ${data.status}. Check your dashboard for more details.`,
    html: `
      <div>
        <h1>Prediction Update</h1>
        <p>Hi ${data.name},</p>
        <p>Your prediction "${data.prediction}" has been ${data.status}.</p>
        <p>Check your dashboard for more details.</p>
      </div>
    `,
  }),

  paymentSubmitted: (data: { name: string }) => ({
    subject: 'Payment Confirmation Received',
    text: `Dear ${data.name}, we have received your payment confirmation. Our team will review it shortly. You will receive another email once the review is complete.`,
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>Payment Confirmation Received</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${data.name},</p>
        <p>We have received your payment confirmation. Our team will review it shortly.</p>
        <p>You will receive another email once the review is complete.</p>
      </div>
    `),
  }),

  paymentApproved: (data: { name: string, package: string, expiryDate: string }) => ({
    subject: 'Payment Approved - VIP Access Granted',
    text: `Dear ${data.name}, your payment has been approved and VIP access granted for package ${data.package} until ${data.expiryDate}.`,
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>Payment Approved!</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${data.name},</p>
        <p>Your payment has been approved and VIP access has been granted.</p>
        <p><strong>Package:</strong> ${data.package}</p>
        <p><strong>Expires:</strong> ${data.expiryDate}</p>
      </div>
    `),
  }),

  paymentDeclined: (data: { name: string, reason: string }) => ({
    subject: 'Payment Confirmation Declined',
    text: `Dear ${data.name}, your payment confirmation has been declined for the following reason: ${data.reason}. Please submit a new payment confirmation with the correct information.`,
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>Payment Declined</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${data.name},</p>
        <p>Your payment confirmation has been declined for the following reason:</p>
        <p style="color: #e53e3e;">${data.reason}</p>
        <p>Please submit a new payment confirmation with the correct information.</p>
      </div>
    `),
  }),

  subscriptionExpiring: (data: { name: string, package: string, daysRemaining: number, expiryDate: string, renewalUrl: string }) => ({
    subject: `Your VIP Access Expires in ${data.daysRemaining} ${data.daysRemaining === 1 ? 'Day' : 'Days'}`,
    text: `Dear ${data.name}, your VIP access for ${data.package} will expire in ${data.daysRemaining} ${data.daysRemaining === 1 ? 'day' : 'days'}. Expiry Date: ${data.expiryDate}. Renew at: ${data.renewalUrl}`,
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>VIP Access Expiring Soon</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${data.name},</p>
        <p>Your VIP access for <strong>${data.package}</strong> will expire in ${data.daysRemaining} ${data.daysRemaining === 1 ? 'day' : 'days'}.</p>
        <p><strong>Expiry Date:</strong> ${data.expiryDate}</p>
        <a href="${data.renewalUrl}" style="${emailStyles.button}">Renew Your Subscription</a>
      </div>
    `),
  }),

  subscriptionExpired: (data: { name: string, renewalUrl: string }) => ({
    subject: 'Your VIP Access Has Expired',
    text: `Dear ${data.name}, your VIP access has expired. To continue enjoying our premium features, please renew your subscription: ${data.renewalUrl}`,
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>VIP Access Expired</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${data.name},</p>
        <p>Your VIP access has expired. To continue enjoying our premium features, please renew your subscription.</p>
        <a href="${data.renewalUrl}" style="${emailStyles.button}">Renew Now</a>
      </div>
    `),
  }),
}