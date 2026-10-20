import express from "express";
import multer from "multer";
import { storage1 } from "../services/file-handle.js";
import {
  postNewBlog,
  deleteBlog,
  newBlog,
  updateBlog,
  viewBlog,
  viewUpdatedBlog,
} from "../controllers/blog.js";
import {authenticate} from "../middleware/auth.js"

const blog = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: storage1 });

blog.route("/new").get(authenticate, newBlog);

blog.route("/new").post(upload.single("coverImage"), authenticate, postNewBlog);

blog
  .route("/edit/:id")
  .get(authenticate, viewUpdatedBlog)
  .post(upload.single("coverImage"), updateBlog);

blog.route("/:id").get(authenticate, viewBlog);

blog.route("/delete/:id").get(authenticate, deleteBlog);

export { blog };
