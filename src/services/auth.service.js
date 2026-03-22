import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (data) => {
  const existingUser = await User.findOne({email:data.email})
  if(existingUser){
    return{
      code:404,
      message:"user already exists"
    }
  }
  const hashed = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashed,
  });

  return {
    code: 200,
    message:"Registered Successfully",
    user
  };
};

export const loginUser = async (data) => {
  const user = await User.findOne({ email: data.email });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id);

  return { 
    code:200,
    message:"Login Successfully",
    token,
    user };
};