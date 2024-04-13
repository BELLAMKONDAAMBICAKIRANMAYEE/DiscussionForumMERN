import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination";
import ListGroup from "./listgroup";
import Posts from "./posts";
import { paginate } from "../utils/paginate";
import { api } from "../config.js";
import http from "../services/httpService";
import Jumbotron from "./common/jumbotron";

class Dashboard extends Component {
  state = {
    allposts: [],
    currentPage: 1,
    pageSize: 4,
    tags: [],
    selectedTag: { _id: "1", name: "All Posts" },
  };

  async componentDidMount() {
    try {
      const { data: allposts } = await http.get(api.postsEndPoint);
      const { data: tags } = await http.get(api.tagsEndPoint);

      this.setState({
        allposts: [...allposts],
        tags: [{ _id: "1", name: "All Posts" }, ...tags],
      });
    } catch (ex) {
      console.error("Error fetching data:", ex);
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handlePostDelete = async (post) => {
    const originalPosts = this.state.allposts;
    const updatedPosts = originalPosts.filter((p) => p._id !== post._id);
    this.setState({ allposts: updatedPosts });

    try {
      await http.delete(api.postsEndPoint + "/" + post._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        alert("This post has already been deleted.");
      }
      this.setState({ allposts: originalPosts });
    }
  };

  handleTagSelect = (tag) => {
    this.setState({ selectedTag: tag, currentPage: 1 });
  };

  getPosts() {
    const { allposts, selectedTag } = this.state;
    const filtered = allposts.filter(
      (post) =>
        selectedTag._id === "1" ||
        post.tags.some((tag) => tag.name === selectedTag.name)
    );
    return filtered;
  }

  render() {
    const { user } = this.props;
    const { allposts, pageSize, currentPage, tags, selectedTag } = this.state;
    const filtered = this.getPosts();
    const posts = paginate(filtered, currentPage, pageSize);

    return (
      <React.Fragment>
        <Jumbotron />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex w-100 justify-content-between m-3">
                Showing {filtered.length} posts.
                {user && (
                  <Link to="/new-post">
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ marginBottom: 20 }}
                    >
                      New Post
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <Posts posts={posts} onDelete={this.handlePostDelete} />
            </div>
            <div className="col-3">
              <ListGroup
                items={tags}
                selectedTag={selectedTag}
                onTagSelect={this.handleTagSelect}
              />
            </div>
          </div>
          <Pagination
            itemCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
