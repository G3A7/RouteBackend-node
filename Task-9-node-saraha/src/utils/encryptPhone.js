import CryptoJS from "crypto-js";
export const encryptPhone = (phone) => {
  return CryptoJS.AES.encrypt(phone, process.env.JWTSECRETKEY).toString();
};

export const decreptPhone = (phone) => {
  var bytes = CryptoJS.AES.decrypt(phone, process.env.JWTSECRETKEY);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
