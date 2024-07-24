
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from bcrypt

const userSchema = new Schema(
        {
                name: {
                        type: String,
                        require: true,
                        unique: true,
                        lowercase: true,
                        trim: true,
                },
                email: {
                        type: String,
                        require: true,
                        unique: true,
                        lowercase: true,
                        trim: true,
                },
                mobile: {
                        type: Number,
                        require: true

                },
                pessword: {
                        type: String,
                        require: [true, 'Password is require']
                },
                avatar: {
                        type: String

                },
                description: {
                        type: String
        
                }
        }
)

userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();
    
        this.password = await bcrypt.hash(this.password, 10)
        next()
})

userSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)

