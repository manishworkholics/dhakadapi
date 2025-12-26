import ContactModel from "./Contact.model.js";


export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: "Name, Phone & Message are required" });
    }

    await ContactModel.create({ name, email, phone, subject, message });

    res.json({ success: true, message: "Message submitted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
