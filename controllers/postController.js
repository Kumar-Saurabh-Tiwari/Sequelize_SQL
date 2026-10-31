const { User, Post } = require('../models');

const postController = {
  // Create a new post for a specific user
  createPost: async (req, res) => {
    try {
      const { title, content, userId } = req.body;
      const newPost = await Post.create({ title, content, userId });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Retrieve all posts for a specific user
  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const userWithPosts = await User.findByPk(userId, {
        include: [Post] // Includes the associated posts
      });
      
      if (!userWithPosts) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(userWithPosts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = postController;