import { commentsApi, type Comment } from "../../../entities/comment";

/**
 * 댓글 수정 API 호출 hook
 * 단일 책임: 댓글 수정 API 호출만 담당
 */
export const useCommentUpdate = () => {
  const updateComment = async (
    commentId: number,
    body: string,
    onSuccess?: (comment: Comment) => void,
    onError?: (error: unknown) => void,
  ) => {
    try {
      const data = await commentsApi.updateComment(commentId, body);
      onSuccess?.(data);
      return data;
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      onError?.(error);
      throw error;
    }
  };

  return { updateComment };
};
