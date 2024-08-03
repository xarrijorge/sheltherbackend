export const sendWhatsAppOTP = async () => {
    const response = await axios.post(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`);
    return response.data;
}

export const sendEmergencyMessage = async () => {
    const response = await axios.post(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`);
    return response.data;
}