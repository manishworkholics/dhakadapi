import axios from "axios";

// export const sendSMS = async (phone, message) => {
//   try {
//     const response = await axios.get(process.env.SMS_API_URL, {
//       params: {
//         authkey: process.env.SMS_AUTH_KEY,
//         mobiles: phone,
//         message,
//         sender: process.env.SMS_SENDER_ID,
//         route: process.env.SMS_ROUTE,
//         country: 91,
//         DLT_TE_ID: process.env.DLT_TEMPLATE_ID,
//         response: "json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("SMS ERROR:", error.response?.data || error.message);
//     throw new Error("SMS sending failed");
//   }
// };


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
