import { mongoose, findOrCreate } from "../import/import.js";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    userProfileImageURL: {
        type: String,
        default: '/uploads/user-profile.svg'
    },
    googleId: {
        type: String,
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate);
const User = new mongoose.model('user', userSchema);

export { User };