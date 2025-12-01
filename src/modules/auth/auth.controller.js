import { sendOtpService, verifyOtpService, registerUserService, emailLoginService,resendOtpService } from "./auth.service.js";

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
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
