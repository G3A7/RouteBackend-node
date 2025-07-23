import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../model/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { FAIL, SUCCESS } from "../../utils/constant.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { decreptPhone, encryptPhone } from "../../utils/encryptPhone.js";
import { generateToken } from "../../utils/generateToken.js";
import { comparePass } from "../../utils/comparePass.js";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";
export const singup = asyncHandler(async (req, res) => {
  const { name, email, password, gender, phone, cpassword, age } = req.body;

  if (!name || !email || !password || !cpassword || !phone || !age || !gender) {
    throw new ApiError("Please fill all the fields", 400, FAIL);
  }

  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|eg)$/.test(email)
  ) {
    throw new ApiError("Invalid email", 400, FAIL);
  }

  const userFound = await User.findOne({ email });
  if (userFound) {
    throw new ApiError("email Exists", 400, FAIL);
  }
  if (password.length < 6) {
    throw new ApiError(
      "Password must be at least 7 characters long",
      400,
      FAIL
    );
  }
  if (password != cpassword) {
    throw new ApiError("password not Match", 400, FAIL);
  }

  if (!/^01[0125][0-9]{8}$/.test(phone)) {
    throw new ApiError("Invalid Phone Number", 400, FAIL);
  }

  const hashPass = await hashPassword(password, 10);
  req.body.password = hashPass;
  const phoneEncrypt = encryptPhone(phone);
  req.body.phone = phoneEncrypt;

  const user = new User(req.body);

  // انا اللي عايز يكون الاثنين ليهم نفس ال secrete key
  const token = generateToken(user._id, "1d");
  const refreshToken = generateToken(user._id, "1y");

  const link = `http://localhost:3000/api/v1/auth/confirm/${token}`;
  const isSend = await sendEmail({
    email,
    html: `<a href=${link}>Clicl Here</a>`,
  });
  if (!isSend) {
    throw new ApiError("Failed to send email", 400, FAIL);
  }

  await user.save();

  return res.status(200).json({
    message: "user Created",
    user,
    status: SUCCESS,
    token,
    refreshToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Please fill all the fields", 400, FAIL);
  }

  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|eg)$/.test(email)
  ) {
    throw new ApiError("Invalid email", 400, FAIL);
  }

  if (password.length < 6) {
    throw new ApiError(
      "Password must be at least 7 characters long",
      400,
      FAIL
    );
  }

  const userFound = await User.findOne({ email, confirmed: true });
  if (!userFound) {
    throw new ApiError("User not found", 404, FAIL);
  }

  if (!comparePass(password, userFound.password)) {
    throw new ApiError("password not Match", 400, FAIL);
  }

  const token = generateToken(userFound._id, "1d");

  return res
    .status(200)
    .json({ message: "login Success", status: SUCCESS, token });
});

// before this check auth
export const getAuth = asyncHandler(async (req, res) => {
  let { user } = req;
  if (!user) {
    throw new ApiError("User not found", 404, FAIL);
  }

  const phone = decreptPhone(user.phone);
  user = { ...user, phone };
  res.status(200).json({ message: SUCCESS, user, status: SUCCESS });
});

export const confirm = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    throw new ApiError("token not found", 404, FAIL);
  }
  const decode = jwt.verify(token, process.env.JWTSECRETKEY);
  if (!decode) {
    throw new ApiError("token not valid", 404, FAIL);
  }

  const user = await User.findOne({ _id: decode.id, confirmed: false });
  if (!user) {
    throw new ApiError("User not found", 404, FAIL);
  }

  user.confirmed = true;
  await user.save();

  res.status(200).json({ message: SUCCESS, status: SUCCESS });
});
