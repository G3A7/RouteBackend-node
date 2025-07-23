import CryptoJS from "crypto-js";
export const encryptPone = (phone) => {
  return CryptoJS.AES.encrypt(phone, process.env.JWTSECRETKEY).toString();
};
