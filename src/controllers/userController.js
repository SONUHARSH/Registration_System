
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = async (user) => {
  try {
    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

const Userregister = async (req, res) => {
  const { name, email, mobile, avatar, password, description } = req.body;

  //console.log('Request body:', req.body);

  if ([name, email, mobile, password].some((field) => field?.trim() === "")) {
    return res.status(400).json(
      new ApiResponse(400, null, "All fields are required", false)
    );
  }

  try {
    //console.log('Checking for existing user with email:', email);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    //console.log('Existing user found:', existingUser);

    if (existingUser) {
      return res.status(400).json(
        new ApiResponse(400, null, 'User already exists', false)
      );
    }

    const newUser = new User({
      name,
      email,
      mobile,
      avatar,
      password,
      description,
      tokens: []
    });

    //console.log('New user created:', newUser);

    // Save the new user to the database
    const user = await newUser.save();
    //console.log('New user saved:', user);

    // Generate a token for the user
    const token = await generateToken(user);
    //console.log('Generated token', token);

    // Add the token to the user's tokens 
    user.tokens.push(token);
    //console.log('User tokens updated:', user.tokens);

    // Save the updated user information to the database
    await user.save();
    //console.log('User with tokens saved:', user);

    res.status(201).json(
      new ApiResponse(201, { user, token }, "User registered successfully", true)
    );
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json(
      new ApiResponse(500, null, "Something went wrong while registering the user", false)
    );
  }
};   

const Userlogin = async (req, res) => {
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
        Userregister,
        Userlogin,
        getSessionDetails
}
