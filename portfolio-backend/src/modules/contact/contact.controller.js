import { sendContactEmail } from "./contact.service.js";

export const contactController = async (req, res) => {
  try {
    const result = await sendContactEmail(req.body);
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};