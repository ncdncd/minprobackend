const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");

const { Blog } = db;

module.exports = {
 
  async createBlogPost(req, res) {
    const authorId = req.user.id;
    const { title, contentBlog, videBlog, keywords, country, category } = req.body;
    const imgBlog = setFromFileNameToDBValue(req.file.filename);
    try {
      const newBlogPost = await Blog.create({ 
        title, contentBlog, videBlog, keywords, country, category,
        authorId,
        imgBlog,
        });
      res.status(201).send({
        message: "post blog successful",
        data: newBlogPost,
      });
    } catch (errors) {
      res.status(500).send({
        message: "fatal error on server",
        errors,
      });
    }
  },
}