import jsonwebtoken from "jsonwebtoken";
import {User} from "../models/userSchema.js"

export const authenticate =  async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.redirect("/login");
            return;
        }
        const decode = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decode._id});
        req.user = user;
        next();
        return;
    } catch (error) {
        res.redirect("/login")
        return;
    }
}