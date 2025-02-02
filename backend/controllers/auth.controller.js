import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({message: "Password and confirm password do not match"});
        }

        const user  = await User.findOne({username});
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // profile pic
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            password : hashedPassword,
            gender,
            profilePic : gender === 'male' ? boyProfilePic : girlProfilePic
        });

        if(newUser){
            generateToken(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                message: "User created successfully",
                _id : newUser._id,
                fullname : newUser.fullname,
                username : newUser.username
            });
        }


    } catch (error) {
        console.log("error in signup controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    
    try{
        const { username, password } = req.body;

        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordValid = bcrypt.compare(password, user?.password || '');
        if(!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            message: "Login successful",
            _id : user._id,
            fullname : user.fullname,
            username : user.username,
            profilePic : user.profilePic
        });
    }
    catch(error){
        console.log("error in login controller", error);
        res.status(500).json({message: "Internal server error"});
    }


}

export const logout = (req, res) => {
    try{
        res.cookie('jwt', '', {maxAge: 0});
        res.status(200).json({message: "Logout successful"});
    }
    catch(error){
        console.log("error in logout controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

