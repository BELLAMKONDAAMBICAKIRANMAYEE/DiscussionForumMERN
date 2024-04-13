import http from "./httpService";
import { api } from "../config.js";

export function createpost(postbody) {
  console.log(api.postsEndPoint); // Ensure this prints the correct endpoint
  return http.post(api.postsEndPoint + '/create', { // Add a slash before 'create'
    title: postbody.title,
    description: postbody.description,
    tags: postbody.tags
  });
}
