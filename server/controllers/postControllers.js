const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content ) {
      return res.status(400).json({ message: 'Content or image is required' });
    }

    const newPost = new Post({
      postedBy: req.user,  // User info from middleware
      content,
      
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// Get all posts
const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('postedBy', 'username profilePicture')  // Populate user details
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
};

// Get a single post by ID
const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('postedBy', 'username')  // Populate user details
      .populate({
        path: 'comments',
        populate: {
          path: 'user',  // Populate the user info in each comment
          select: 'username',
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Couldn\'t find the post' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

// Get all comments for a specific post
const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Add a comment to a post
const comment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const newComment = {
      user: req.user,  // User from the token
      content,
    };

    const post = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true }  // Return updated post
    ).populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Could not find the post' });
    }

    // Check if the logged-in user is the owner of the post
    if (post.postedBy.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // Delete the post if the user is the owner
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

module.exports = { createPost, getAllPost, getSinglePost, deletePost, getComments, comment };
