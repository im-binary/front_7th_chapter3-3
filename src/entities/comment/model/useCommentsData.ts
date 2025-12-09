import { useState } from "react";
import { commentsApi, type Comment } from "../index";

export const useCommentsData = () => {
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  // 댓글 가져오기
  const fetchComments = async (postId: number): Promise<void> => {
    if (comments[postId]) return;
    try {
      const data = await commentsApi.getComments(postId);
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };

  // 댓글 추가
  const addComment = async (comment: Comment) => {
    setComments((prev) => ({
      ...prev,
      [comment.postId]: [...(prev[comment.postId] || []), comment],
    }));
  };

  // 댓글 업데이트
  const updateComment = async (updatedComment: Comment) => {
    setComments((prev) => ({
      ...prev,
      [updatedComment.postId]: prev[updatedComment.postId].map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    }));
  };

  // 댓글 삭제
  const deleteComment = async (commentId: number, postId: number) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((comment) => comment.id !== commentId),
    }));
  };

  // 댓글 좋아요
  const likeComment = async (commentId: number, postId: number) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].map((comment) =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
      ),
    }));
  };

  return {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  };
};
