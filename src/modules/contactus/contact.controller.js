import validator from "validator";
import ContactModel from "./Contact.model.js";


// export const submitContact = async (req, res) => {
//   try {
//     const { name, email, phone, subject, message } = req.body;

//     if (!name || !phone || !message) {
//       return res.status(400).json({ success: false, message: "Name, Phone & Message are required" });
//     }

//     await ContactModel.create({ name, email, phone, subject, message });

//     res.json({ success: true, message: "Message submitted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Trim inputs
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPhone = phone?.trim();
    const trimmedSubject = subject?.trim();
    const trimmedMessage = message?.trim();

    // Required fields validation
    if (!trimmedName || !trimmedPhone || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone & Message are required",
      });
    }

    // Name validation (2–50 characters)
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 to 50 characters",
      });
    }

    // Email validation (optional but if provided must be valid)
    if (trimmedEmail && !validator.isEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Phone validation (Indian mobile: exactly 10 digits, starts with 6-9)
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits and start with 6-9",
      });
    }

    // Message validation (10–1000 characters)
    if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message must be between 10 to 1000 characters",
      });
    }

    // Save to DB
    await ContactModel.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    return res.status(200).json({
      success: true,
      message: "Message submitted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const getAllContact = async (req, res) => {
  try {
    const list = await ContactModel.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
