import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { FAIL } from "../utils/constant.js";
import User from "../model/user.model.js";

export const authMiddleWare = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    throw new ApiError("token Required", 400, FAIL);
  }
  if (!token.startsWith("Berear")) {
    throw new ApiError("Invalid token format", 400, FAIL);
  }
  token = token.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWTSECRETKEY);
  if (!decode) {
    throw new ApiError("Invalid token", 400, FAIL);
  }
  const user = await User.findById(decode.id).lean().select("-password -__V");
  if (!user) {
    throw new ApiError("User not found", 404, FAIL);
  }
  req.user = user;
  next();
});
