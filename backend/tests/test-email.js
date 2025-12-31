const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🚀 Testing Moon Bloom Email Configuration...\n');

  // Check if credentials are set
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error('❌ Error: GMAIL_USER or GMAIL_PASS not found in .env file');
    console.log('Please set these in your backend/.env file:');
    console.log('GMAIL_USER=your-email@gmail.com');
    console.log('GMAIL_PASS=your-16-char-app-password');
    return;
  }

    console.log(`📧 Testing email from: ${process.env.GMAIL_USER}`);
    console.log(`📨 Sending test email to: abdulquddusinda@gmail.com`);
    console.log(`🔐 Using app password: ${process.env.GMAIL_PASS.substring(0, 4)}****\n`);

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
      debug: true,
      logger: true,
    });

    console.log('🔍 Verifying transporter configuration...');

    // Verify connection
    await transporter.verify();
    console.log('✅ Transporter verification successful!\n');

    // Test email content
    const testEmail = {
      from: `Moon Bloom Test <${process.env.GMAIL_USER}>`,
      to: 'abdulquddusinda@gmail.com',
      subject: '🧪 Moon Bloom Email Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Email Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .success { color: #22c55e; font-size: 24px; }
            .code { background: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Email Test Successful!</h1>
          <p><strong>Moon Bloom Email Configuration is working perfectly!</strong></p>
          <p>This confirms that:</p>
          <ul>
            <li>✅ Gmail SMTP connection established</li>
            <li>✅ TLS encryption enabled</li>
            <li>✅ Authentication successful</li>
            <li>✅ Email sending capability confirmed</li>
          </ul>
          <p><strong>Test completed at:</strong> ${new Date().toLocaleString()}</p>
          <div class="code">
            <strong>Gmail User:</strong> ${process.env.GMAIL_USER}<br>
            <strong>SMTP Host:</strong> smtp.gmail.com<br>
            <strong>Port:</strong> 587 (TLS)<br>
            <strong>Status:</strong> ✅ Working
          </div>
          <p>🎉 You can now use OTP verification and welcome emails in Moon Bloom!</p>
        </body>
        </html>
      `,
    };

    console.log('📤 Sending test email...');

    // Send test email
    const info = await transporter.sendMail(testEmail);

    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    console.log('\n📬 Check abdulquddusinda@gmail.com inbox for the test email.');
    console.log('📝 If you don\'t see it, check the spam folder.');
    console.log('\n🎉 Moon Bloom email system is ready to go!');

  } catch (error) {
    console.error('\n❌ ERROR: Email test failed!');
    console.error('Error details:', error.message);

    console.log('\n🔧 Troubleshooting:');
    console.log('1. ✅ Check if 2-Factor Authentication is enabled on your Gmail account');
    console.log('2. ✅ Verify you\'re using the 16-character app password (not your regular password)');
    console.log('3. ✅ Make sure the app password was generated for "Moon Bloom"');
    console.log('4. ✅ Check your internet connection');
    console.log('5. ✅ Try regenerating the app password');

    console.log('\n📞 Gmail App Password Setup:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Step Verification');
    console.log('3. Click "App passwords"');
    console.log('4. Select "Mail" → "Other (custom name)"');
    console.log('5. Enter "Moon Bloom" and generate password');
  }
}

// Run the test
testEmail();