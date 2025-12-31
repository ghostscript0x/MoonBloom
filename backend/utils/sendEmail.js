const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const sendEmail = async (options) => {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('Gmail credentials not configured');
      throw new Error('Email configuration missing');
    }

    // Create a transporter with TLS enabled
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false, // For development
      },
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development',
    });

    // Verify transporter configuration
    await transporter.verify();

    // Read logo
    let logoBase64 = '';
    try {
      const logoPath = path.join(__dirname, '../icon-512.png');
      logoBase64 = fs.readFileSync(logoPath).toString('base64');
    } catch (logoError) {
      console.warn('Logo file not found, proceeding without logo');
    }

    // Get template
    const template = getEmailTemplate(options.template, options.data, logoBase64, options);

    // Define email options
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Moon Bloom'} <${process.env.GMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: template,
    };

    console.log(`Sending ${options.template} email to ${options.email}`);

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const getEmailTemplate = (templateName, data, logoBase64, options) => {
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  const templates = {
    welcome: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Moon Bloom</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px 30px; text-align: center; }
          .logo { width: 80px; height: 80px; border-radius: 50%; background: white; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
          .logo img { width: 60px; height: 60px; border-radius: 50%; }
          .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f9fafb; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .footer a { color: #8b5cf6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoDataUrl}" alt="Moon Bloom Logo">
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Moon Bloom! 🌸</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Thank you for joining Moon Bloom, your gentle companion for understanding and tracking your menstrual cycle.</p>
            <p>We're excited to support you on this journey of self-care and wellness. Your privacy and comfort are our top priorities.</p>
            <a href="${process.env.CLIENT_URL}" class="button">Start Your Journey</a>
            <p>With love,<br>The Moon Bloom Team 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${data.email}. If you didn't create an account, please ignore this email.</p>
            <p><a href="${process.env.CLIENT_URL}/privacy">Privacy Policy</a> | <a href="${process.env.CLIENT_URL}/support">Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    passwordReset: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Moon Bloom</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px 30px; text-align: center; }
          .logo { width: 80px; height: 80px; border-radius: 50%; background: white; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
          .logo img { width: 60px; height: 60px; border-radius: 50%; }
          .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
          .otp-box { background-color: #f3f4f6; border: 2px dashed #8b5cf6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #8b5cf6; letter-spacing: 4px; font-family: 'Courier New', monospace; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .footer { background-color: #f9fafb; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .footer a { color: #8b5cf6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoDataUrl}" alt="Moon Bloom Logo">
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We received a request to reset your password for your Moon Bloom account. Use the verification code below to reset your password:</p>

            <div class="otp-box">
              <p style="margin: 0 0 10px; color: #6b7280;">Your 6-digit verification code:</p>
              <div class="otp-code">${data.otp}</div>
            </div>

            <div class="warning">
              <strong>Important:</strong> This code will expire in 10 minutes. If you didn't request this reset, please ignore this email and ensure your account is secure.
            </div>

            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>With care,<br>The Moon Bloom Team 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${options.email}. If you didn't request a password reset, please contact us immediately.</p>
            <p><a href="${process.env.CLIENT_URL}/privacy">Privacy Policy</a> | <a href="${process.env.CLIENT_URL}/support">Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    'password-reset': `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Moon Bloom</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px 30px; text-align: center; }
          .logo { width: 80px; height: 80px; border-radius: 50%; background: white; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
          .logo img { width: 60px; height: 60px; border-radius: 50%; }
          .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .footer { background-color: #f9fafb; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .footer a { color: #8b5cf6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoDataUrl}" alt="Moon Bloom Logo">
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We received a request to reset your password for your Moon Bloom account. Click the button below to reset your password:</p>

            <a href="${data.resetUrl}" class="button">Reset Your Password</a>

            <div class="warning">
              <strong>Important:</strong> This link will expire in 10 minutes. If you didn't request this reset, please ignore this email and ensure your account is secure.
            </div>

            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; color: #6b7280;">${data.resetUrl}</p>

            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>With care,<br>The Moon Bloom Team 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${options.email}. If you didn't request a password reset, please contact us immediately.</p>
            <p><a href="${process.env.CLIENT_URL}/privacy">Privacy Policy</a> | <a href="${process.env.CLIENT_URL}/support">Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    otp: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Moon Bloom</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px 30px; text-align: center; }
          .logo { width: 80px; height: 80px; border-radius: 50%; background: white; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
          .logo img { width: 60px; height: 60px; border-radius: 50%; }
          .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
          .otp-box { background-color: #f3f4f6; border: 2px dashed #8b5cf6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #8b5cf6; letter-spacing: 4px; font-family: 'Courier New', monospace; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .footer { background-color: #f9fafb; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .footer a { color: #8b5cf6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoDataUrl}" alt="Moon Bloom Logo">
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Welcome to Moon Bloom! To complete your account setup and start your wellness journey, please verify your email address using the code below:</p>

            <div class="otp-box">
              <p style="margin: 0 0 10px; color: #6b7280;">Your 6-digit verification code:</p>
              <div class="otp-code">${data.otp}</div>
            </div>

            <div class="warning">
              <strong>Important:</strong> This code will expire in 10 minutes. Please enter it in the app to activate your account.
            </div>

            <p>Once verified, you'll have full access to personalized cycle tracking, insights, and wellness features designed just for you.</p>
            <p>With care,<br>The Moon Bloom Team 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${options.email}. If you didn't create an account, please ignore this email.</p>
            <p><a href="${process.env.CLIENT_URL}/privacy">Privacy Policy</a> | <a href="${process.env.CLIENT_URL}/support">Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return templates[templateName] || templates.welcome;
};

module.exports = sendEmail;