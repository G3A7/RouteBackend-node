import bcrypt from "bcryptjs";

export const comparePass = async (password, hashPass) => {
  return await bcrypt.compare(password, hashPass);
};
