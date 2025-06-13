import sgMail from '@sendgrid/mail'
import type { EmailTemplate } from '@/types'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailOptions {
  to: string
  template: EmailTemplate
  data: Record<string, any>
}

export async function sendEmail({ to, template, data }: EmailOptions): Promise<void> {
  try {
    const { subject, html, text } = emailTemplates[template](data)
    
    const msg = {
      to,
      from: process.env.EMAIL_FROM || 'noreply@predicts.com',
      subject,
      text,
      html,
    }

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
    text: `Your VIP access for ${data.package} has been activated until ${data.expiryDate}.`,
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
    text: `Your prediction "${data.prediction}" has been ${data.status}.`,
    html: `
      <div>
        <h1>Prediction Update</h1>
        <p>Hi ${data.name},</p>
        <p>Your prediction "${data.prediction}" has been ${data.status}.</p>
        <p>Check your dashboard for more details.</p>
      </div>
    `,
  }),

  paymentSubmitted: (username: string) => ({
    subject: 'Payment Confirmation Received',
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>Payment Confirmation Received</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${username},</p>
        <p>We have received your payment confirmation. Our team will review it shortly.</p>
        <p>You will receive another email once the review is complete.</p>
      </div>
    `),
  }),

  paymentApproved: (username: string, packageName: string, expirationDate: string) => ({
    subject: 'Payment Approved - VIP Access Granted',
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>Payment Approved!</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${username},</p>
        <p>Your payment has been approved and VIP access has been granted.</p>
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Expires:</strong> ${expirationDate}</p>
      </div>
    `),
  }),

  paymentDeclined: (username: string, reason: string) => ({
    subject: 'Payment Confirmation Declined',
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>Payment Declined</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${username},</p>
        <p>Your payment confirmation has been declined for the following reason:</p>
        <p style="color: #e53e3e;">${reason}</p>
        <p>Please submit a new payment confirmation with the correct information.</p>
      </div>
    `),
  }),

  subscriptionExpiring: (
    username: string,
    packageName: string,
    daysRemaining: number,
    expiryDate: string,
    renewalUrl: string
  ) => ({
    subject: `Your VIP Access Expires in ${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'}`,
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>VIP Access Expiring Soon</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${username},</p>
        <p>Your VIP access for <strong>${packageName}</strong> will expire in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}.</p>
        <p><strong>Expiry Date:</strong> ${expiryDate}</p>
        <a href="${renewalUrl}" style="${emailStyles.button}">Renew Your Subscription</a>
      </div>
    `),
  }),

  subscriptionExpired: (username: string, renewalUrl: string) => ({
    subject: 'Your VIP Access Has Expired',
    html: baseTemplate(`
      <div style="${emailStyles.header}">
        <h1>VIP Access Expired</h1>
      </div>
      <div style="${emailStyles.content}">
        <p>Dear ${username},</p>
        <p>Your VIP access has expired. To continue enjoying our premium features, please renew your subscription.</p>
        <a href="${renewalUrl}" style="${emailStyles.button}">Renew Now</a>
      </div>
    `),
  }),
}
