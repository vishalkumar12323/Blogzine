import {User} from "../models/userSchema.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {name, username, email, password} = req.body;
    const userProfileImageURL = `uploads/users/${req?.file?.filename}`;

    console.log({name, username, email, password, userProfileImageURL})
    if(!name || !username || !email || !password) {
        res.redirect("/signup");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, username, email, password: hashedPassword, userProfileImageURL});
    await user.save();

    // res.status(200).json({name, username, email, password});
    res.redirect("/login");
    return;
};

export const login = (req, res) => {

};

export const logout = (req, res) => {

};