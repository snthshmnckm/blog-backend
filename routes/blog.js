const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const Blog = require('../models/Blog');

// Create a new blog post
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  const newBlog = new Blog({
    title,
    content,
    author: req.user._id,
  });

  try {
    const savedBlog = await newBlog.save();
    res.json(savedBlog);
  } catch (err) {
    res.status(400).json({ message: 'Error creating blog post' });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching blogs' });
  }
});

// Update a blog post (only author can update)
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized' });

    blog.title = title;
    blog.content = content;
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: 'Error updating blog post' });
  }
});

// Delete a blog post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized' });

    await blog.remove();
    res.json({ message: 'Blog post deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting blog post' });
  }
});

module.exports = router;

