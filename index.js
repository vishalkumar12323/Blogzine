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
app.get("/api/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/", router);
app.get("/", authenticate, async (req, res) => {
  const blogs = await Blog.find({ createdBy: req?.user?._id || null });
  res.render("index", { user: req?.user, blogs: blogs });
});
app.use("/", blog);

// Connect to the database
const MONGODB_URL = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;
connectDB(MONGODB_URL).then(() =>
  console.log("Connected to the database")
).catch((err) => {
  console.log(`Error while connecting to DB: `, err);
})

// Start the server
app.listen(port, () => console.log(`Server started on port: ${port}`));
