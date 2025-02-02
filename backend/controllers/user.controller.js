import express from 'express';
import User from "../models/user.model.js";

export const getAllUsersForSidebar = async (req, res) => {
    
    try{
        const loggedInUser = req.user._id;

        const filterdUsers = await User.find({ _id: { $ne: loggedInUser } }).select('-password');

        if(filterdUsers){
            res.status(200).json(filterdUsers);
        }
    }
    catch(error){
        console.log(`Error in getAllUsersForSidebar: ${error}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

