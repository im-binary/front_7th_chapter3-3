import { Post, PostsResponse, NewPost } from "../model/types";
import { API_BASE_URL } from "../../../shared/lib";

// Posts API
export const postsApi = {
  // 게시물 목록 가져오기
  getPosts: async (limit: number, skip: number): Promise<PostsResponse> => {
    const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`);
    return response.json();
  },

  // 게시물 검색
  searchPosts: async (query: string): Promise<PostsResponse> => {
    const response = await fetch(`${API_BASE_URL}/posts/search?q=${query}`);
    return response.json();
  },

  // 태그별 게시물 가져오기
  getPostsByTag: async (tag: string, limit = 10, skip = 0): Promise<PostsResponse> => {
    const response = await fetch(`${API_BASE_URL}/posts/tag/${tag}?limit=${limit}&skip=${skip}`);
    return response.json();
  },

  // 게시물 추가
  addPost: async (post: NewPost): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  // 게시물 수정
  updatePost: async (id: number, post: { title: string; body: string }): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  // 게시물 삭제
  deletePost: async (id: number): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};
