import { sendOtpService, verifyOtpService, registerUserService, emailLoginService, resendOtpService, verifyEmailOtpService, resendEmailOtpService, emailOtpService } from "./auth.service.js";

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

    const { user } = await emailLoginService(email, password);

    // Send verification OTP to email
    const otp = await emailOtpService(email);

    res.status(200).json({
      success: true,
      message: "Login successful. OTP sent to email for verification.",
      user: { id: user._id, name: user.name, email: user.email },
      debugOtp: otp // ⚠ Only during testing, remove before production
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
