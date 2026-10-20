import express from "express";
import multer from "multer";
import { storage2 } from "../services/file-handle.js";
import {login, logout, signup} from "../controllers/user.js"

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: storage2 });


router.get("/signup", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", upload.single("profileImage"), signup);

router.post("/login", login);

router.get("/logout", logout);

export { router };
