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

  async getBlog(req, res) {
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: Number(req.query.perPage) || 10,
        search: req.query.search || undefined,
      };
    try {
        const where = { authorId };
      if (pagination.search) {
        where.contentBlog = {
          [db.Sequelize.Op.like]: `%${pagination.search}%`,
        };
      }
      const results = await db.Blog.findAll({
        include: [
          {
            model: db.User,
            attributes: ["username"],
          },
        ],
      });
      res.send({ message: "success get all blog post", data: results });
    } catch (errors) {
      res.status(500).send({
        message: "fatal error on server",
        errors,
      });
    }
  },

  async getMyBlog(req, res) {
    const authorId = req.user.id;
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 10,
      search: req.query.search || undefined,
    //   sortBy: req.query.sortBy,
    };
    try {
      const where = { authorId };
      if (pagination.search) {
        where.contentBlog = {
          [db.Sequelize.Op.like]: `%${pagination.search}%`,
        };
      }
    //   const order = []; // generate order/sorting
    //   for (const sort in pagination.sortBy) {
    //     order.push([sort, pagination.sortBy[sort]]);
    //   }

      console.log(order)

      const results = await db.Blog.findAll({
        where,
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
        // order,
      });

      const countData = await db.Blog.count({ where });
      pagination.totalData = countData;
      res.send({
        message: "successfully got my blog",
        pagination,
        data: results,
      });
    } catch (errors) {
      res.status(500).send({
        message: "fatal error on server",
        errors: errors.message,
      });
    }
  },

  async likeBlog(req, res) {

    const blogId = Number(req.params.id)
    const userId = req.user.id
    
    try {

      const isExist = await db.Blog.findOne({
        where: { id: blogId },
      });
      if (!isExist) {
        return res.status(404).send({
          message: "blog not found",
        });
      }

      const isLiked = await db.Like.findOne({
        where: { [db.Sequelize.Op.and]: [{ userId }, { blogId }] },
      });
      if (isLiked) {
        return res.status(400).send({
          message: "you've already liked this blog",
        });
      }

      const newLike = await db.Like.create({ 

        blogId,
        userId,

        });

      res.status(201).send({
        message: "blog liked",
        data: newLike
      });
    } catch (errors) {
      res.status(500).send({
        message: "fatal error on server",
        errors,
      });
    }
  },

  async likeBlog(req, res) {

    const blogId = Number(req.params.id)
    const userId = req.user.id
    
    try {

      const isExist = await db.Blog.findOne({
        where: { id: blogId },
      });
      if (!isExist) {
        return res.status(404).send({
          message: "blog not found",
        });
      }

      const isLiked = await db.Like.findOne({
        where: { [db.Sequelize.Op.and]: [{ userId }, { blogId }] },
      });
      if (isLiked) {
        return res.status(400).send({
          message: "you've already liked this blog",
        });
      }

      const newLike = await db.Like.create({ 

        blogId,
        userId,

        });

      res.status(201).send({
        message: "blog liked",
        data: newLike
      });
    } catch (errors) {
      res.status(500).send({
        message: "fatal error on server",
        errors,
      });
    }
  },
}