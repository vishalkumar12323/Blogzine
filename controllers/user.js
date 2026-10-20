import "dotenv/config";
import {User} from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

export const signup = async (req, res) => {
    const {name, email, password} = req.body;
    const userProfileImageURL = `uploads/users/${req?.file?.filename}`;

    if(!name || !email || !password) {
        res.redirect("/signup");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword, userProfileImageURL});
    await user.save();

    res.redirect("/login");
    return;
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    // console.log({email, password});
    if(!email || !password) {
        res.redirect("/login");
        return;
    }
    const existingUser = await User.findOne({email: email}).exec();
    if(!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        res.redirect("/login");
        return;
    }
    const token = jsonwebtoken.sign(
        {_id: existingUser._id, email: existingUser.email},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect("/");
    return;
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: false,
        maxAge: 0
    });
    res.redirect("/login");
    return;
};