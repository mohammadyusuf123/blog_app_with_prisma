import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user:process.env.GMAIL_USER ,
    pass: process.env.GMAIL_APP_PASSWORD ,
  },
});
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user:{
         additionalFields: {
          role: { type: "string", defaultValue: "user",required: false },
          phone: { type: "string", required: false },
          status: { type: "string", defaultValue: "active", required: false },
         }
    },
      emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification: true
  },
emailVerification: {
  sendOnSignUp: true,
    sendVerificationEmail:  async( { user, url, token }: { user: any; url: string; token: string }, request: any) => {
      try {
        console.log(`Verification URL: ${url}`, token, user);
      const VerificationUrl = `${process.env.APP_URL}/verify/${token}`
     const info = await transporter.sendMail({
    from: `"Your Company" <${process.env.GMAIL_USER}>`, // sender address
    to: user.email,
    subject: "Please verify your email address",
    html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .email-container {
            background: white;
            max-width: 600px;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }

        .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 32px;
        }

        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }

        .message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .button-container {
            text-align: center;
            margin-bottom: 30px;
        }

        .divider {
            border-top: 1px solid #e0e0e0;
            margin: 30px 0;
        }

        .alternative {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }

        .code-box {
            background: #f5f5f5;
            border: 2px dashed #ccc;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }

        .verification-code {
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
        }

        .footer {
            background: #f9f9f9;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }

        .footer-text {
            font-size: 14px;
            color: #999;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .footer-links {
            margin-top: 15px;
        }

        .footer-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        .warning {
            font-size: 13px;
            color: #999;
            font-style: italic;
            margin-top: 20px;
        }

        @media (max-width: 640px) {
            .header h1 {
                font-size: 24px;
            }

            .content {
                padding: 30px 20px;
            }

            .verify-button {
                display: block;
                padding: 14px 30px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">✉️</div>
            <h1>Verify Your Email</h1>
            <p>One more step to get started</p>
        </div>

        <div class="content">
            <div class="greeting">Hello, ${user.name}</div>
            
            <div class="message">
                Thank you for signing up! We're excited to have you on board. To complete your registration and access all features, please verify your email address by clicking the button below.
            </div>

            <div class="button-container">
                <a href="${VerificationUrl}" class="verify-button">Verify Email Address</a>

            </div>

            <div class="divider"></div>

            

            <div class="warning">
                This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </div>
        </div>

        <div class="footer">
            <div class="footer-text">
                Need help? Contact our support team or visit our help center.
            </div>
            <div class="footer-links">
                <a href="#">Help Center</a>
                <a href="#">Contact Support</a>
                <a href="#">Privacy Policy</a>
            </div>
            <div class="footer-text" style="margin-top: 20px;">
                © 2024 Your Company. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
  },
});