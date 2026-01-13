import User from "./auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwtHelper.js";
import { sendSMS, sendMail } from "../../utils/sendOtp.js";

const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

export const sendOtpService = async (phone) => {
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone, otp, otpExpiry });
  } else {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  }

  try {
    const smsResponse = await sendSMS(phone, `Your OTP is ${otp}`);

    return {
      phone,
      smsStatus: "SENT",
      smsResponse, // 👈 TEMP DEBUG
    };
  } catch (err) {
    return {
      phone,
      smsStatus: "FAILED",
      error: err.message,
    };
  }
};


export const resendOtpService = async (phone) => {
  const user = await User.findOne({ phone });
  if (!user) throw new Error("User not found");

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
  await user.save();

  // Send SMS
  // await sendSms(phone, `Your new OTP is: ${otp}`);

  return { phone, otp };
};



export const verifyOtpService = async (phone, otp) => {
  const user = await User.findOne({ phone });
  if (!user) throw new Error("User not found");

  if (user.isBlocked) {
    throw new Error("Your account is blocked. Please contact support.");
  }

  const isExpired = user.otpExpiry < new Date();
  if (isExpired) throw new Error("OTP expired");
  if (user.otp !== otp) throw new Error("Invalid OTP");

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const token = generateToken(user._id);
  return { user, token };
};



// Register new user
export const registerUserService = async (name, email, phone, createdfor, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    createdfor,
    password: hashedPassword,
    isVerified: true, // since it’s manual signup
  });

  const token = generateToken(user._id);
  return { user, token };
};



export const emailLoginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (user.isBlocked) {
    throw new Error("Your account is blocked. Please contact support.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id);
  return { user, token };
};


export const emailOtpService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = generateOTP();

  user.emailOtp = otp;
  user.emailOtpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Dhakad Matrimony - Email Verification</title>
  </head>
  <body style="background-color: #f5f5f5; padding: 0; margin: 0; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background: white; margin-top: 20px; border-radius: 10px; padding: 30px; box-shadow: 0px 3px 8px rgba(0,0,0,0.1);">
            
            <tr>
              <td align="center">
                <h2 style="color: #D4AF37; font-size: 28px; margin: 0;">Dhakad Matrimony</h2>
                <p style="color: #888; font-size: 14px; margin-top: 5px;">Connecting Hearts, Creating Futures ❤️</p>
              </td>
            </tr>

            <tr>
              <td style="padding: 20px 0;">
                <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
                  Hi <strong>${user.name || "User"}</strong>,
                </p>
                <p style="font-size: 15px; color: #555;">
                  Thank you for choosing <strong>Dhakad Matrimony</strong>.  
                  To verify your email and secure your account, please use the OTP below:
                </p>

                <div style="text-align: center; margin: 25px auto;">
                  <span style="display: inline-block; padding: 15px 30px; background: #D4AF37; color: white; font-size: 26px; letter-spacing: 5px; border-radius: 8px;">
                    <strong>${otp}</strong>
                  </span>
                </div>

                <p style="font-size: 14px; color: #777; text-align: center;">
                  This OTP will expire in <strong>5 minutes</strong>.  
                </p>

                <p style="font-size: 14px; color: #888; margin-top: 25px;">
                  If you didn't request this, please ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top: 25px; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #999;">
                  © ${new Date().getFullYear()} Dhakad Matrimony. All Rights Reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  await sendMail({
    email,
    subject: "Your Dhakad Matrimony – Email Verification OTP",
    message: htmlTemplate,
  });

  return otp;
};


// export const verifyEmailOtpService = async (email, otp) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found");

//   if (user.emailOtp !== otp || Date.now() > user.emailOtpExpires) {
//     throw new Error("Invalid or expired OTP");
//   }

//   user.emailVerified = true;
//   user.emailOtp = null;
//   user.emailOtpExpires = null;
//   await user.save();

//   const token = generateToken(user._id);
//   return { user, token };
// };


export const verifyEmailOtpService = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.emailOtp || !user.emailOtpExpires) {
    throw new Error("No OTP request found");
  }

  if (Date.now() > user.emailOtpExpires) {
    throw new Error("OTP expired");
  }

  if (String(user.emailOtp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  // ✅ mark verified
  user.emailVerified = true;
  user.emailOtp = null;
  user.emailOtpExpires = null;

  await user.save();

  const token = generateToken(user._id);

  return { user, token };
};


export const resendEmailOtpService = async (email) => {
  return await emailOtpService(email);
};