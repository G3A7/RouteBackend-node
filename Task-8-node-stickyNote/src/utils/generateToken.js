import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWTSECRETKEY, {
    expiresIn: "1h", // 60 * 60
  });
};
