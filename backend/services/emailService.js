import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create Nodemailer Transporter
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Fallback to test ethereal account for development
  const testAccount = await nodemailer.createTestAccount()
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })
}

// Send Order Confirmation Receipt Email
export const sendOrderReceiptEmail = async ({
  customerEmail,
  customerName,
  orderId,
  storeName,
  items,
  totalAmount,
  paymentMode,
  paymentId,
  address,
}) => {
  try {
    const transporter = await createTransporter()

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name} (x${item.quantity})</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>`
      )
      .join('')

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0;">OmniMarket Multi-Tenant</h2>
          <p style="color: #6b7280; font-size: 13px;">Official Order Confirmation & Payment Invoice</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="color: #15803d; margin: 0 0 4px 0; font-size: 16px;">✓ Payment Verified (${paymentMode})</h3>
          <p style="margin: 0; font-size: 13px; color: #166534;">Your order from <strong>${storeName}</strong> is confirmed and dispatched.</p>
        </div>

        <table style="width: 100%; font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; padding: 4px 0;">Order ID:</td>
            <td style="text-align: right; font-weight: bold;">${orderId}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 4px 0;">Razorpay / Transaction ID:</td>
            <td style="text-align: right; font-family: monospace;">${paymentId || 'VERIFIED-GATEWAY'}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 4px 0;">Delivery Address:</td>
            <td style="text-align: right;">${address}</td>
          </tr>
        </table>

        <h4 style="margin: 16px 0 8px 0; font-size: 14px; border-bottom: 2px solid #2563eb; padding-bottom: 4px;">Items Summary</h4>
        <table style="width: 100%; font-size: 13px; margin-bottom: 20px;">
          ${itemsHtml}
          <tr>
            <td style="padding: 12px 0; font-size: 16px; font-weight: bold;">Total Paid</td>
            <td style="padding: 12px 0; font-size: 16px; font-weight: bold; text-align: right; color: #2563eb;">₹${totalAmount.toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
          Thank you for shopping at OmniMarket Verified Stores Network.
        </p>
      </div>
    `

    const info = await transporter.sendMail({
      from: `"OmniMarket Orders" <${process.env.FROM_EMAIL || 'no-reply@omnimarket.io'}>`,
      to: customerEmail || 'customer@example.com',
      subject: `Order Confirmed #${orderId} from ${storeName}`,
      html: htmlContent,
    })

    console.log(`[Nodemailer] Order receipt email dispatched to ${customerEmail}. Message ID: ${info.messageId}`)
    return info
  } catch (error) {
    console.warn(`[Nodemailer] Email dispatch skipped/simulated: ${error.message}`)
  }
}

// Send OTP Verification Email
export const sendOTPEmail = async (email, otp, targetName) => {
  try {
    const transporter = await createTransporter()

    const info = await transporter.sendMail({
      from: `"OmniMarket Security" <${process.env.FROM_EMAIL || 'security@omnimarket.io'}>`,
      to: email,
      subject: `Your Login OTP Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 450px;">
          <h3>OmniMarket Verification Code</h3>
          <p>Your one-time authentication code for <strong>${targetName}</strong> is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2563eb; padding: 12px 0;">${otp}</div>
          <p style="font-size: 12px; color: #6b7280;">Valid for 5 minutes. Do not share this code.</p>
        </div>
      `,
    })

    console.log(`[Nodemailer] OTP code ${otp} dispatched to ${email}.`)
    return info
  } catch (error) {
    console.warn(`[Nodemailer] OTP email dispatch simulation: ${error.message}`)
  }
}
