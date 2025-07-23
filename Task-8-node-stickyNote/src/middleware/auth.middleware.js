import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ message: "Token  is Required" });
    const decode = jwt.verify(token, process.env.JWTSECRETKEY);
    if (!decode) return res.status(401).json({ message: "Token  is Invalid" });

    const user = await User.findById(decode.id).select("-password");

    if (!user) return res.status(404).json({ message: "user Not Found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("error in middleWare Auth", error);
    return res.status(500).json({ message: error });
  }
};
