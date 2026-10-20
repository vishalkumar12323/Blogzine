import { Blog } from "../models/blogSchema.js";

// show create blog page.
const newBlog = (req, res) => {
  if(req.user) {
    res.render("new", { user: req.user });
    return;
  }
  res.redirect("/login");
  return;
};

const viewUpdatedBlog = async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById({ _id: id });
  res.render("edit", { blog: blog, user: req.user });
};

// create new blog post.
const postNewBlog = async (req, res) => {
  const blog = req.body;
  if (!blog) return res.redirect("/new");
  try {
    const newBlog = new Blog({
      title: blog.title,
      content: blog.content,
      coverImage: `uploads/blog-img/${req.file.filename}`,
      createdBy: req.user._id,
    });
    if (newBlog) {
      await newBlog.save();
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
    res.redirect("/new");
  }
};

// update existing blog.
const updateBlog = async (req, res) => {
  const id = req.params.id;
  const existingBlog = await Blog.findById({ _id: id });
  try {
    await Blog.findByIdAndUpdate(
      { _id: id },
      {
        title: req.body.title || existingBlog.title,
        content: req.body.content || existingBlog.content,
        coverImage:
          `uploads/blog-img/${req.file.filename}` || existingBlog.coverImage,
      }
    );
    res.redirect("/");
  } catch (e) {
    console.log("update blog error", e);
    res.redirect(`/${id}`);
  }
};

// delete existing blog.
const deleteBlog = async (req, res) => {
  const id = req.params.id;
  try {
    await Blog.findByIdAndDelete({ _id: id });
    res.redirect("/");
  } catch (e) {
    console.log("delete blog error", e);
    res.redirect("/");
  }
};

// view full blog.
const viewBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById({ _id: id });
  res.render("view", { blog: blog, user: req.user });
};
export {
  postNewBlog,
  deleteBlog,
  newBlog,
  updateBlog,
  viewBlog,
  viewUpdatedBlog,
};
