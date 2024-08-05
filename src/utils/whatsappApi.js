import 'dotenv/config';
import axios from 'axios';

const token = process.env.WHATSAPP_TOKEN;
const url = 'https://graph.facebook.com/v20.0/380637661797975/messages';
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

export const sendWhatsAppOTP = async (contact, otp) => {
    console.log('token', token)
    const data = {
        messaging_product: 'whatsapp',
        to: contact,
        type: 'template',
        template: {
            name: 'auth_otp',
            language: {
                code: 'en_US'
            },
            components: [
                {
                    type: 'body',
                    parameters: [
                        {
                            type: 'text',
                            text: otp
                        }
                    ]
                },
                {
                    type: 'button',
                    sub_type: 'url',
                    index: '0',
                    parameters: [
                        {
                            type: 'text',
                            text: otp
                        }
                    ]
                }
            ]
        }
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};

export const sendEmergencyMessage = async () => {
    const response = await axios.post(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`);
    return response.data;
}


export const sendNewContactMessage = async (contact, name) => {
    console.log('token', token)
    const data = {
        messaging_product: 'whatsapp',
        to: contact,
        type: 'template',
        template: {
            name: 'new_contact',
            language: {
                code: 'en'
            },
            components: [
                {
                    type: 'body',
                    parameters: [
                        {
                            type: 'text',
                            text: name
                        }
                    ]
                },
            ]
        }
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};