import axios from "axios";
import nodemailer from "nodemailer"

export const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};



export const sendSMS = async (phone, message) => {
    try {
        const response = await axios.get(process.env.SMS_API_URL, {
            params: {
                authkey: process.env.SMS_AUTH_KEY,
                mobiles: `91${phone}`,
                message,
                sender: process.env.SMS_SENDER_ID,
                route: process.env.SMS_ROUTE,
                DLT_TE_ID: process.env.DLT_TEMPLATE_ID,
                response: "json",
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.Description ||
            error.response?.data ||
            error.message
        );
    }
};
