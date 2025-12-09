import { type Comment } from "../index";

/**
 * 댓글 로컬 상태 CRUD hook
 * 단일 책임: 로컬 comments 상태 업데이트만 담당
 */
export const useCommentsMutation = (
  comments: Record<number, Comment[]>,
  setComments: (comments: Record<number, Comment[]>) => void,
) => {
  // 댓글 추가
  const addComment = (comment: Comment) => {
    setComments({
      ...comments,
      [comment.postId]: [...(comments[comment.postId] || []), comment],
    });
  };

  // 댓글 업데이트
  const updateComment = (updatedComment: Comment) => {
    setComments({
      ...comments,
      [updatedComment.postId]: comments[updatedComment.postId].map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    });
  };

  // 댓글 삭제
  const deleteComment = (commentId: number, postId: number) => {
    setComments({
      ...comments,
      [postId]: comments[postId].filter((comment) => comment.id !== commentId),
    });
  };

  // 댓글 좋아요
  const likeComment = (commentId: number, postId: number) => {
    setComments({
      ...comments,
      [postId]: comments[postId].map((comment) =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
      ),
    });
  };

  return {
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  };
};
