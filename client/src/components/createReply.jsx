import React from "react";
import Joi from "joi-browser";
import { ToastContainer } from "react-toastify";
import Form from "./common/form";
import { createreply } from "../services/replyCreateService";
import { Redirect } from "react-router-dom";

class PostReply extends Form {
  state = {
    data: {
      comment: "",
    },
    errors: {},
    redirect: false, // Add redirect state
  };

  schema = {
    comment: Joi.string().required().min(5).label("Comment"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await createreply(data, this.props.id);
      this.setState({ redirect: true }); // Set redirect to true upon successful reply
    } catch (ex) {}
  };

  render() {
    const { data, errors, redirect } = this.state;

    // Redirect to the post page upon successful reply
    if (redirect) {
      return <Redirect to={`/post/${this.props.id}`} />;
    }

    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container col-lg-6 shadow-lg p-3 mt-5 bg-body rounded">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="comment">Post Reply</label>
              <textarea
                className="border border-primary form-control"
                style={{ height: 150 }}
                value={data.comment}
                onChange={this.handleChange}
                name="comment"
                id="comment" // Corrected the id
              />
              {errors.comment && ( // Display error for comment field
                <div className="alert-info">{errors.comment}</div>
              )}
              <div className="text-center">
                <button
                  className="btn btn-primary mt-4"
                  disabled={this.validate()}
                >
                  Post Reply
                </button>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default PostReply;
