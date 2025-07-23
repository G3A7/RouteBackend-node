import User from "../model/user.model.js";
import { encryptPone } from "../utils/encrypt.js";
import { generateToken } from "../utils/generateToken.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    if (!name || !email || !password || !phone || !age)
      return res.status(400).json({ message: "all Fields Required" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Email must be valid" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be greater than  6" });

    if (!/^0(10|11|12|15)[0-9]{8}$/.test(phone))
      return res.status(400).json({ message: "Phone must be Valid" });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already Exists." });

    const newUser = new User({ ...req.body, phone: encryptPone(phone) });
    await newUser.save();

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "user Add Successfullly",
    });
  } catch (error) {
    console.log("error in Signup", error);
    res.status(500).json({ message: error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Email must be valid" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be greater than  6" });

    const user = await User.findOne({ email });
    if (!(user && user.comparePassword(password)))
      return res.status(400).json({ message: "Email Or Password Is Correct" });

    const token = generateToken(user._id);
    res.status(200).json({
      statusCode: 200,
      status: "success",
      messga: "Login Successfully",
      token,
    });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ message: error });
  }
};

export const update = async (req, res) => {
  try {
    const { user } = req;

    //  تاكيد مني 😎
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let { email, name, phone, age, password } = req.body;

    if (password) {
      return res
        .status(400)
        .json({ message: "يابني انت اهبل مفيش تعديل باسورد هنا " });
    }
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return res.status(400).json({ message: "Email must be valid" });

      const userEmail = await User.findOne({ email });
      if (userEmail) {
        return res.status(400).json({ message: "Email Is Already Existing" });
      }
    }

    if (phone) {
      if (!/^0(10|11|12|15)[0-9]{8}$/.test(phone)) {
        return res.status(400).json({ message: "Phone must be Valid" });
      }
      phone = encryptPone(phone);
      // tricks
      req.body.phone = phone;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { ...req.body },
      {
        new: true,
      }
    ).select("-password -__v");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "user Updated",
      updatedUser,
    });
  } catch (error) {
    console.log("error in Update", error);
    res.status(500).json({ message: error });
  }
};

export const deleteUs = async (req, res) => {
  try {
    const { user } = req;
    //  تاكيد مني 😎
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(user._id);

    // تاكيد مني 😎
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    console.log("error in Delete", error);
    res.status(500).json({ message: error });
  }
};

export const authMe = async (req, res) => {
  try {
    const {user} = req;

    if (!user) {
      return res.status(404).json({ messge: "user Not  Found" });
    }
    return res.status(200).json({ statusCode: 200, status: "success", user });
  } catch (error) {
    console.log("error in AuthME", error);
    res.status(500).json({ message: error });
  }
};
