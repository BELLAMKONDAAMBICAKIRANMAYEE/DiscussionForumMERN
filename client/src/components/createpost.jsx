// NewPost.js
import React from "react";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import Input from "./common/input";
import Form from "./common/form";
import { createpost } from "../services/postCreateService";

class NewPost extends Form {
  state = {
    data: { title: "", description: "", tags: [] },
    errors: {},
    tags: ["barbie", "mickeymouse", "doraemon"], // Random tags added
  };

  schema = {
    title: Joi.string().required().min(10).label("Title"),
    description: Joi.string().required().min(5).label("Description"),
    tags: Joi.array().required().label("Tags"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const { user } = this.props;
      if (!user) {
        // Handle case where user information is not available
        return;
      }
      const author = user._id; // Assuming the user prop contains author information with the _id field
      await createpost({ ...data, author }); // Include author information in the post data
      toast.success("Post created successfully!");
      // Redirect or do something else after successful submission
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Failed to create post: " + ex.response.data);
      }
    }
  };
  

  handleTagChange = (tag) => {
    const { data } = this.state;
    const newTags = [...data.tags];
    const index = newTags.indexOf(tag);
    if (index === -1) newTags.push(tag);
    else newTags.splice(index, 1);
    this.setState({ data: { ...data, tags: newTags } });
  };

  render() {
    const { data, tags } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container-lg">
          <h1 className="text-center m-2">Create a New Discussion</h1>
          <div
            className="container m-4 p-4 rounded"
            style={{ backgroundColor: "#F1F1F1" }}
          >
            <form onSubmit={this.handleSubmit}>
              <Input
                value={data.title}
                onChange={this.handleChange}
                label="Title"
                name="title"
                type="text"
                error={this.state.errors.title}
              />
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  value={data.description}
                  onChange={this.handleChange}
                  name="description"
                  type="description"
                  id="description"
                  className="form-control"
                />
                {this.state.errors.description && (
                  <div className="alert-info">
                    {this.state.errors.description}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="tags">Related Tags</label>
                <br />
                {tags.map((tag) => (
                  <React.Fragment key={tag}>
                    <label className="mr-3 ml-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={() => this.handleTagChange(tag)}
                        checked={data.tags.includes(tag)}
                      />
                      {tag}
                    </label>
                  </React.Fragment>
                ))}
                {this.state.errors.tags && (
                  <div className="alert-info">{this.state.errors.tags}</div>
                )}
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary mt-4"
                  disabled={this.validate()}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewPost;
