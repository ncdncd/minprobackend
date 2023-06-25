const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");
const { Sequelize } = require('sequelize');


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
        sortBy: req.query.sort || "createdAt",
        sortOrder: req.query.order || "desc",
        category: req.query.category || undefined,
        keywords: req.query.keywords || undefined,
        title: req.query.title || undefined,
      };
  
      try {
        let where = {};
  
        if (pagination.search) {
          where[db.Sequelize.Op.or] = [
            {
              "$user.username$": {
                [db.Sequelize.Op.like]: `%${pagination.search}%`,
              },
            },
            { keywords: { [db.Sequelize.Op.like]: `%${pagination.search}%` } },
            { title: { [db.Sequelize.Op.like]: `%${pagination.search}%` } },
            { contentBlog: { [db.Sequelize.Op.like]: `%${pagination.search}%` } },
          ];
        }
  
        if (pagination.category) {
          where.category = pagination.category;
        }
  
        if (pagination.keywords) {
          where.keywords = { [db.Sequelize.Op.like]: `%${pagination.keywords}%` };
        }
  
        if (pagination.title) {
          where.title = { [db.Sequelize.Op.like]: `%${pagination.title}%` };
        }
    const { count, rows } = await Blog.findAndCountAll({
          where,
          include: [{ model: db.User, attributes: ["username"], as: "User" }],
          order: [[pagination.sortBy, pagination.sortOrder]],
          limit: pagination.perPage,
          offset: (pagination.page - 1) * pagination.perPage,
        });
  
        if (pagination.search && count === 0) {
          return res.status(404).send({
            message: "No blogs found matching the search query.",
          });
        }
  
        const totalPages = Math.ceil(count / pagination.perPage);
  
        res.send({
          message: "Successfully retrieved blogs.",
          pagination: {
            page: pagination.page,
            perPage: pagination.perPage,
            totalPages: totalPages,
            totalData: count,
          },
          data: rows,
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message: "An error occurred while processing the request.",
          error: error.message,
        });
      }
    },


  async getMyBlog(req, res) {
    const authorId = req.user.id;
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: Number(req.query.perPage) || 10,
        search: req.query.search || undefined,
        sortBy: req.query.sort || "createdAt",
        sortOrder: req.query.order || "desc",
        category: req.query.category || undefined,
        keywords: req.query.keywords || undefined,
        title: req.query.title || undefined,
      };
  
      try {
        let where = { authorId };
  
        if (pagination.search) {
          where[db.Sequelize.Op.or] = [
            {
              "$user.username$": {
                [db.Sequelize.Op.like]: `%${pagination.search}%`,
              },
            },
            { keywords: { [db.Sequelize.Op.like]: `%${pagination.search}%` } },
            { title: { [db.Sequelize.Op.like]: `%${pagination.search}%` } },
            { contentBlog: { [db.Sequelize.Op.like]: `%${pagination.search}%` } },
          ];
        }
  
        if (pagination.category) {
          where.category = pagination.category;
        }
  
        if (pagination.keywords) {
          where.keywords = { [db.Sequelize.Op.like]: `%${pagination.keywords}%` };
        }
  
        if (pagination.title) {
          where.title = { [db.Sequelize.Op.like]: `%${pagination.title}%` };
        }
    const { count, rows } = await Blog.findAndCountAll({
          where,
          include: [{ model: db.User, attributes: ["username"], as: "User" }],
          order: [[pagination.sortBy, pagination.sortOrder]],
          limit: pagination.perPage,
          offset: (pagination.page - 1) * pagination.perPage,
        });
  
        if (pagination.search && count === 0) {
          return res.status(404).send({
            message: "No blogs found matching the search query.",
          });
        }
  
        const totalPages = Math.ceil(count / pagination.perPage);
  
        res.send({
          message: "Successfully retrieved blogs.",
          pagination: {
            page: pagination.page,
            perPage: pagination.perPage,
            totalPages: totalPages,
            totalData: count,
          },
          data: rows,
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message: "An error occurred while processing the request.",
          error: error.message,
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


  async getLikedBlog(req, res) {
    const userId = req.user.id;
    try {
      const blogData = await db.Like.findAll({
        where: {
          userId,
        },
        include: db.Blog,
      });

      res.status(200).send({
        message: "get liked blog successfull",
        blogData,
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error",
        errors: error.message,
      });
    }
  },

  async singlePageBlog(req, res) {

    const blogId = req.params.id
    
    try {

      const isExist = await db.Blog.findOne({
        where: { id: blogId },
      });
      if (!isExist) {
        return res.status(404).send({
          message: "blog not found",
        });
      }

      const singlePage = await db.Blog.findOne({ 
            where: { id: blogId },
        });

      res.status(201).send({
        message: "single page displayed",
        data: singlePage
      });
    } catch (errors) {
      res.status(500).send({
        message: "fatal error on server",
        errors,
      });
    }
  },

  async getMostFavorite(req, res) {
    
    try {
        const mostLike = await db.Like.findAll({
        attributes: ['blogId',
        [Sequelize.fn('COUNT', Sequelize.col('blogId')), 'likeCount'],
        ],
        include:[{
            model: db.Blog,
            attributes: ['id', 'title', 'category'],
            as:'Blog',
            include:[{
                model: db.User,
                attributes: ['username']
            }]
            }],
        group:['blogId'],
        order:[[db.Sequelize.literal("likeCount"), "DESC"]],
        limit: 10,
      });

      res.status(201).send({
        message: "most favorite blog displayed",
        data: mostLike
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        errors: error.message,
      });
    }
  },

  async deleteBlogPost(req, res) {
    const userId = req.user.id;
    const deleteId = req.params.id;
    try {

        const isExist = await db.Blog.findOne({
            where: { id: deleteId },
          });
          if (!isExist) {
            return res.status(404).send({
              message: "blog not found",
            });
          }

        const blogAuthorId = await Blog.findOne({
            where: {id: deleteId },
        }) 

        const blogUserId = blogAuthorId.dataValues.authorId

        if(userId !== blogUserId){
            return res.status(500).send({
                message: "cannot delete post that is not yours",
            })
        }

      const deleteBlog = await Blog.destroy({ 
        where: {id: deleteId}
        });

      res.status(201).send({
        message: "delete blog successful",
      });
    } catch (errors) {
      res.status(500).send({
        message: "fatal error on server",
        errors,
      });
    }
  },

  async unlikeBlogPost(req, res) {
    const userId = req.user.id;
    const unlikeId = req.params.id;
    try {

        const isExist = await db.Blog.findOne({
            where: { id: unlikeId },
          });
          if (!isExist) {
            return res.status(404).send({
              message: "blog not found",
            });
          }

          const isLikeExist = await db.Like.findOne({
            where: { blogId: unlikeId },
          });
          if (!isLikeExist) {
            return res.status(404).send({
              message: "blog have not been liked",
            });
          }

        const blogAuthorId = await db.Like.findOne({
            where: {blogId: unlikeId },
        }) 

        const blogUserId = blogAuthorId.dataValues.userId

        if(userId !== blogUserId){
            return res.status(500).send({
                message: "cannot unlike that is not yours",
            })
        }

      const deleteBlog = await db.Like.destroy({ 
        where: {blogId: unlikeId}
        });

      res.status(201).send({
        message: "blog unliked",
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        errors: error.message,
      });
    }
  },

}