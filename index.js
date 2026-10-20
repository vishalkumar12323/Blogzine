import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { config } from "dotenv";
import { connectDB } from "./db/connection.js";
import { router } from "./routes/user.js";
import { blog } from "./routes/blog.js";
import { Blog } from "./models/blogSchema.js";
import { authenticate } from "./middleware/auth.js";
import { User } from "./models/userSchema.js";

// Load environment variables
config();

// Set up Express app
const app = express();
const port = 8080;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set view engine and views path
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));


// Routes
app.use("/", router);
app.get("/", authenticate, async (req, res) => {
  const user = await User.findOne({_id: req?.user?._id});
  const blogs = await Blog.find({ createdBy: req?.user?._id || null });
  console.log({blogs})
  res.render("index", { user: user, blogs: blogs });
});
app.use("/", blog);

// Connect to the database
connectDB(process.env.MONGODB_URL).then(() =>
  console.log("Connected to the database")
);

// Start the server
app.listen(port, () => console.log(`Server started on port: ${port}`));
