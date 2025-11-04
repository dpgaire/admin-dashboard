// services/qrAPI.js
export const generateQrCode = async (text) => {
  // If your backend just returns the text:
  return { data: { qrText: text } };
  
  // Or call real API:
  // return axios.post('/api/qr', { text });
};