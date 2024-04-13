const mongoose = require('mongoose');
const Joi = require("joi");

// Define the tag schema
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25
  },
  used: {
    type: Number,
    default: 0
  }
});

// Define the Tag model
const Tag = mongoose.model("Tag", tagSchema);

// Validate tag input data
function validateTag(tag) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(25).required().trim().label('Tag Name')
  });

  return schema.validate(tag, { abortEarly: false }); // Abort on first error and return all errors
}

// Export the tagSchema, validateTag function, and Tag model
module.exports = {
  tagSchema: tagSchema,
  validateTag: validateTag,
  Tag: Tag
};
