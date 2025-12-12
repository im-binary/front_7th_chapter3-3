import { Comment, CommentsResponse } from "../model/types";
import { API_BASE_URL } from "../../../shared/lib";

// Comments API
export const commentsApi = {
  // 댓글 가져오기
  getComments: async (postId: number): Promise<CommentsResponse> => {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    return response.json();
  },

  // 댓글 추가
  addComment: async (comment: { body: string; postId: number; userId: number }): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    return response.json();
  },

  // 댓글 수정
  updateComment: async (id: number, body: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    return response.json();
  },

  // 댓글 삭제
  deleteComment: async (id: number): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // 댓글 좋아요
  likeComment: async (id: number, likes: number): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes }),
    });
    return response.json();
  },
};
