import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import passport from "passport";
import { config } from "dotenv";
import { connectDB } from "./db/connection.js";
import { router } from "./routes/user.js";
import { blog } from "./routes/blog.js";
import { Blog } from "./models/blogSchema.js";
import { authenticate } from "./services/authentication.js";

// Load environment variables
config();

// Set up Express app
const app = express();
const port = 8080;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Set view engine and views path
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
authenticate();

// Routes
app.use("/", router);
app.get("/", async (req, res) => {
  const blogs = await Blog.find({ createdBy: req?.user?._id || null });
  res.render("index", { user: req.user, blogs: blogs });
});
app.use("/", blog);

// Connect to the database
connectDB("mongodb://127.0.0.1:27017/Blogger").then(() =>
  console.log("Connected to the database")
);

// Start the server
app.listen(port, () => console.log(`Server started on port: ${port}`));
