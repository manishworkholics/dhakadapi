import User from "./auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwtHelper.js";

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

  console.log(`📲 OTP sent to ${phone}: ${otp}`);
  return { phone };
};

// export const verifyOtpService = async (phone, otp) => {
//   const user = await User.findOne({ phone });
//   if (!user) throw new Error("User not found");

//   const isExpired = user.otpExpiry < new Date();
//   if (isExpired) throw new Error("OTP expired");
//   if (user.otp !== otp) throw new Error("Invalid OTP");

//   user.isVerified = true;
//   user.otp = null;
//   user.otpExpiry = null;
//   await user.save();

//   const token = generateToken(user._id);

//   return { user, token };
// };

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
export const registerUserService = async (name, email,phone,createdfor, password) => {
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

// Email login
// export const emailLoginService = async (email, password) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("Invalid credentials");

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) throw new Error("Invalid credentials");

//   const token = generateToken(user._id);
//   return { user, token };
// };


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

