const express = require("express");
const router = express.Router();
const { Post, validatePost } = require("../models/post");
const { Tag } = require("../models/tag");
const auth = require("../middleware/auth");

router.post("/create", auth, async (req, res) => {
  try {
    // Validate the request body
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Extract necessary data from the request body
    const { title, description, tags, author } = req.body;

    // Create a new post instance
    const post = new Post({
      title,
      description,
      tags,
      author, // Ensure that the author information is included
    });

    // Save the new post to the database
    await post.save();

    // Send success response
    res.status(201).send("Post created successfully");
  } catch (error) {
    // Handle errors
    console.error("Error creating post:", error);
    res.status(500).send("An internal server error occurred");
  }
});



module.exports = router;
