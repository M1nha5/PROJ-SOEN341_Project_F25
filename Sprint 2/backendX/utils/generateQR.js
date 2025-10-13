// utils/generateQR.js
const QRCode = require("qrcode");

const generateQR = async (text) => {
    try {
        return await QRCode.toDataURL(text); // returns base64 image string
    } catch (err) {
        console.error("QR generation failed:", err);
        return null;
    }
};

module.exports = generateQR;
