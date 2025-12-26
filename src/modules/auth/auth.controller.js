import { sendOtpService, verifyOtpService, registerUserService, emailLoginService, resendOtpService, verifyEmailOtpService, resendEmailOtpService, emailOtpService } from "./auth.service.js";
import User from "./auth.model.js";
import { sendSMS, sendMail } from "../../utils/sendOtp.js";
import bcrypt from "bcrypt";

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const data = await sendOtpService(phone);
    res.status(200).json({ success: true, message: "OTP sent successfully", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP are required" });

    const { user, token } = await verifyOtpService(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const data = await resendOtpService(phone);

    res.status(200).json({
      success: true,
      message: "OTP re-sent successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, createdfor, password } = req.body;
    if (!email || !password || !phone)
      return res.status(400).json({ message: "Email and password are required" });

    const { user, token } = await registerUserService(name, email, phone, createdfor, password);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      // token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, createdfor: user.createdfor },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const { user, token } = await emailLoginService(email, password);

    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    // ⛔ If email NOT verified → Send OTP FIRST
    if (!user.emailVerified) {
      const otp = await emailOtpService(email);

      return res.status(200).json({
        success: true,
        requiresVerification: true,
        message: "OTP sent to email for verification.",
        user: {
          _id: user._id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
        debugOtp: otp,  // ⚠ only for testing
      });
    }

    // 🎉 Email already verified → Direct Login
    return res.status(200).json({
      success: true,
      requiresVerification: false,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      }
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const { user, token } = await verifyEmailOtpService(email, otp);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = await resendEmailOtpService(email);

    res.status(200).json({
      success: true,
      message: "OTP re-sent to email",
      debugOtp: otp // remove in production
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};




// forget password code 



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });
    const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
    const otp = generateOTP();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendMail({
      email,
      subject: "Reset Password - Dhakad Matrimony",
      message: `
      <h2 style="color:#D4AF37;">Dhakad Matrimony</h2>
      <p>Your OTP for resetting password is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
      `
    });

    res.status(200).json({
      success: true,
      message: "OTP sent for password reset",
      debugOtp: otp
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email & OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (user.resetOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.resetOtpExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    // mark verified -> allow reset password
    user.resetOtpVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP Verified! Now set new password"
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ message: "Email & new password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (!user.resetOtpVerified)
      return res.status(403).json({ message: "OTP not verified" });

    user.password = await bcrypt.hash(newPassword, 10);

    // clear fields
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.resetOtpVerified = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful, now login"
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
