import {User} from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

export const signup = async (req, res) => {
    const {name, username, email, password} = req.body;
    const userProfileImageURL = `uploads/users/${req?.file?.filename}`;

    if(!name || !username || !email || !password) {
        res.redirect("/signup");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, username, email, password: hashedPassword, userProfileImageURL});
    await user.save();

    res.redirect("/login");
    return;
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.redirect("/login");
        return;
    }
    const existingUser = await User.findOne({email});
    if(!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        res.redirect("/login");
        return;
    }
    const token = jsonwebtoken.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect("/")
};

export const logout = (req, res) => {

};