const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const clerkAuth = require('../middleware/clerkAuth');

// Define a simple Post model if not already present
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// GET all posts
router.get('/', clerkAuth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ created_at: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create a new post
router.post('/', clerkAuth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = new Post({ title, description });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;