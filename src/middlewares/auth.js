
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
       
        try {

          const token = req.header('Authorization').replace('Bearer ', '');
          //console.log(token);
          if(!token) {
                throw new ApiError(401, "Unauthorized request");
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findOne({ _id: decoded.id, 'tokens': token });
      
          if (!user) {
            throw new ApiError(401, "Invalid Access Token");
          }
      
          req.token = token;
          req.user = user;
          next();

        } catch (error) {
                throw new ApiError(401, error?.message || "Invalid access token")
        }

}
