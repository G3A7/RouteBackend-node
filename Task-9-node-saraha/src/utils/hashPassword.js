import bcrypt from "bcryptjs";

export const hashPassword = async (password, salt) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
