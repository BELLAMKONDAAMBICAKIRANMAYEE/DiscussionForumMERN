const mongoose = require("mongoose");
const { User } = require("./user");
const Joi = require("joi");
const { tagSchema } = require("./tag");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 80,
  },
  tags: {
    type: [tagSchema],
    validate: {
      validator: function (a) {
        return a && a.length >= 0;
      },
    },
    required: true,
    default: [] // Add a default empty array for tags
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (userId) {
        const user = await User.findById(userId);
        return user !== null;
      },
      message: "Invalid author ID"
    }
  },
  views: {
    type: Number,
    default: 1,
    min: 1,
  },
  upvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().required().min(10).max(80),
    description: Joi.string().required().min(5).max(1024),
    tags: Joi.array().items(Joi.string()).min(1).required(), // Validate tags array
    author: Joi.string().required().pattern(new RegExp("^[0-9a-fA-F]{24}$")), // Validate author ObjectId
  });
  return schema.validate(post);
}

async function createPost(postData) {
  const { error } = validatePost(postData);
  if (error) throw new Error(error.details[0].message);

  const { title, description, tags, author } = postData;

  const post = new Post({
    title,
    description,
    tags, // Array of tag IDs
    author, // User ID
  });

  await post.save();
  console.log('Post created successfully:', post);
}


async function listPosts() {
  const posts = await Post.find().populate('author');
  console.log(posts);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.createPost = createPost;
exports.listPosts = listPosts;
