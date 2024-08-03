export const sendWhatsAppOTP = async () => {
    const response = await axios.post(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`);
    return response.data;
}

export const sendEmergencyMessage = async () => {
    const response = await axios.post(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`);
    return response.data;
}

const authBody = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "<CUSTOMER_PHONE_NUMBER>",
    "type": "template",
    "template": {
        "name": "<TEMPLATE_NAME>",
        "language": {
            "code": "<TEMPLATE_LANGUAGE_CODE>"
        },
        "components": [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": "<ONE-TIME PASSWORD>"
                    }
                ]
            },
            {
                "type": "button",
                "sub_type": "url",
                "index": "0",
                "parameters": [
                    {
                        "type": "text",
                        "text": "<ONE-TIME PASSWORD>"
                    }
                ]
            }
        ]
    }
}