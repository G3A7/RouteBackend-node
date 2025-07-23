import jwt from "jsonwebtoken";
export const generateToken = (id, time) => {
  return jwt.sign({ id }, process.env.JWTSECRETKEY, {
    expiresIn: time, // token expires in 1 day
  });
};
