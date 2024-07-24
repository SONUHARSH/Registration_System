
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateToken = async (user) => {
        try {
          const payload = {
            id: user._id,
            email: user.email,
          }
      
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
          return token;
        } catch (error) {

                throw new ApiError(500, "Something went wrong while generating token")
        }
}

const register = async (req, res) => {
  const { name, email, mobile, avatar, password, description } = req.body;

  if (
        [name, email, mobile, password, avatar, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

  const createUser = async (req, res) => {
        const { name, email, mobile, avatar, password, description } = req.body;
      
        const newUser = new User({
          name,
          email,
          mobile,
          avatar,
          password,
          description,
        });
      
        try {

           // Save the new user to the database
          const user = await newUser.save()
      
          // Generate a token for the user
          const token = await generateToken(user)
      
          // Add the token to the user's tokens 
          user.tokens.push(token)
      
          // Save the updated user information to the database
          await user.save()
      
          res.status(201).json(
                new ApiResponse(201, { user, token }, "User registered Successfully")
          )
        } catch (error) {

                throw new ApiError(500, "Something went wrong while registering the user")
            }
   }

}
      

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
      
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new ApiError(400, "Invalid password");
    }

    const token = await generateToken(user);

    user.tokens.push(token);
    await user.save();

    res.status(200).json(
      new ApiResponse(200, { user, token }, 'Login successful'));

  } catch (error) {

        throw new ApiError(500, null, "Login failed");
    
  }
}

const getSessionDetails = async (req, res) => {
  
  try {

    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ApiError(404, "User not found")

    }

    return res.status(201).json(
        new ApiResponse(200, { user }, "User is available")
    )

  } catch (error) {
        throw new ApiError(500, null, "Session details not found")
    
  }
}

export {
        generateToken,
        register,
        login,
        getSessionDetails
}
