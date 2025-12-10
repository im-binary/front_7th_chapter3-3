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

  return {
    comments,
    fetchComments,
    deleteComment,
    likeComment,
    setComments,
  };
};
