import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Optional: Verify transporter config on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email config error:', error);
  } else {
    console.log('✅ Ready to send emails');
  }
});

// Send verification email
export const sendVerificationEmail = async (email, code) => {
  try {
    // In development, log the verification code to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`Verification code for ${email}: ${code}`);
      return true;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1E40AF; text-align: center;">Email Verification</h2>
          <p>Thank you for registering with our platform. Please use the following code to verify your email address:</p>
          <div style="background-color: #F3F4F6; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="margin: 0; color: #1E40AF; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
          <hr style="border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="font-size: 12px; color: #6B7280; text-align: center;">© ${new Date().getFullYear()} Investment Platform</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌Error sending verification email:", error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    // In development, log the reset URL to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password reset URL for ${email}: ${resetUrl}`);
      return true;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1E40AF; text-align: center;">Password Reset</h2>
          <p>You requested a password reset. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <hr style="border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="font-size: 12px; color: #6B7280; text-align: center;">© ${new Date().getFullYear()} Investment Platform</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};