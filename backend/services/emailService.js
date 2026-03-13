const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const FROM = process.env.EMAIL_FROM || `FitForge <${process.env.EMAIL_USER}>`;

// Send OTP email for forgot password
async function sendPasswordResetOTP(to, otp, userName = '') {
  try {
    const info = await transporter.sendMail({
      from: FROM,
      to,
      subject: 'FitForge Password Reset OTP',
      html: `
        <!DOCTYPE html><html><head><meta charset="utf-8">
        <style>
          body{font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px}
          .header{background:#B4F405;color:#000;padding:28px;text-align:center;border-radius:10px 10px 0 0}
          .header h1{margin:0;font-size:24px}
          .content{background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px}
          .otp-box{background:#fff;border:2px solid #B4F405;border-radius:10px;padding:24px;text-align:center;margin:24px 0}
          .otp-code{font-size:40px;font-weight:bold;letter-spacing:10px;color:#111}
          .warning{background:#fff3cd;border:1px solid #ffc107;padding:14px;border-radius:6px;margin:20px 0;font-size:13px}
          .footer{text-align:center;margin-top:24px;color:#999;font-size:12px}
        </style></head>
        <body>
          <div class="header"><h1>🔒 Password Reset</h1></div>
          <div class="content">
            <p>Hello${userName ? ` ${userName}` : ''},</p>
            <p>You requested to reset your FitForge password.</p>
            <div class="otp-box">
              <p style="margin:0 0 8px;color:#555;font-size:14px;">Your OTP code is</p>
              <div class="otp-code">${otp}</div>
              <p style="margin:10px 0 0;color:#888;font-size:13px;">This code will expire in <strong>5 minutes</strong>.</p>
            </div>
            <div class="warning">⚠️ If you did not request this, please ignore this email.</div>
            <p>Stay strong! 💪<br>— The FitForge Team</p>
          </div>
          <div class="footer">© 2026 FitForge</div>
        </body></html>
      `,
    });

    console.log(`✅ OTP email sent to ${to}: ${info.messageId}`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error('❌ sendPasswordResetOTP error:', err.message);
    return { success: false, message: err.message };
  }
}

// Send workout reminder email
async function sendWorkoutReminder(to, workoutName, workoutDetails = null) {
  try {
    const info = await transporter.sendMail({
      from: FROM,
      to,
      subject: 'Workout Reminder 💪',
      html: `
        <!DOCTYPE html><html><head><meta charset="utf-8">
        <style>
          body{font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px}
          .header{background:linear-gradient(135deg,#B4F405 0%,#8BC34A 100%);color:#000;padding:28px;text-align:center;border-radius:10px 10px 0 0}
          .header h1{margin:0;font-size:24px}
          .content{background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px}
          .workout-box{background:#fff;padding:20px;margin:20px 0;border-radius:8px;border-left:4px solid #B4F405}
          .workout-name{font-size:22px;font-weight:bold;color:#222}
          .motivational{background:#fff;padding:14px;margin:20px 0;border-radius:8px;border:2px solid #B4F405;text-align:center;font-style:italic;color:#555}
          .footer{text-align:center;margin-top:24px;color:#999;font-size:12px}
        </style></head>
        <body>
          <div class="header"><h1>🏋️ Workout Reminder</h1></div>
          <div class="content">
            <p>Hello,</p>
            <p>It's time for your scheduled workout.</p>
            <div class="workout-box">
              <div class="workout-name">${workoutName}</div>
              ${workoutDetails ? `<p style="margin-top:8px;color:#555;">${workoutDetails}</p>` : ''}
            </div>
            <div class="motivational">"Stay consistent and keep progressing!"</div>
            <p style="text-align:center"><strong>You got this! 🔥</strong></p>
          </div>
          <div class="footer">© 2026 FitForge</div>
        </body></html>
      `,
    });

    console.log(`✅ Reminder email sent to ${to}: ${info.messageId}`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error('❌ sendWorkoutReminder error:', err.message);
    return { success: false, message: err.message };
  }
}

module.exports = { sendPasswordResetOTP, sendWorkoutReminder };
