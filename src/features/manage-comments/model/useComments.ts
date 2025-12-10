import { useState } from "react";
import type { Comment } from "../../../entities/comment";
import { commentsApi } from "../../../entities/comment/api/commentsApi";

export const useComments = () => {
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  const fetchComments = async (postId: number) => {
    if (comments[postId]) {
      return;
    }

    try {
      const data = await commentsApi.getComments(postId);

      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };

  const deleteComment = async (id: number, postId: number) => {
    try {
      await commentsApi.deleteComment(id);

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  const likeComment = async (id: number, postId: number) => {
    try {
      const currentLikes = comments[postId].find((c) => c.id === id)!.likes;
      const data = await commentsApi.likeComment(id, currentLikes + 1);

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: currentLikes + 1 } : comment,
        ),
      }));
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
    }
  };

  // 댓글 추가
  const addComment = async (comment: { body: string; postId: number; userId: number }) => {
    try {
      const data = await commentsApi.addComment(comment);
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }));
      return data;
    } catch (error) {
      console.error("댓글 추가 오류:", error);
      throw error;
    }
  };

  // 댓글 수정
  const updateComment = async (id: number, body: string, postId: number) => {
    try {
      const data = await commentsApi.updateComment(id, body);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? data : comment)),
      }));
      return data;
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      throw error;
    }
  };

  return {
    comments,
    fetchComments,
    deleteComment,
    likeComment,
    addComment,
    updateComment,
    setComments,
  };
};
