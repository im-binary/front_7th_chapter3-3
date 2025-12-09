import { commentsApi, type NewComment, type Comment } from "../../../entities/comment";

export const useCommentSubmit = () => {
  const submitComment = async (
    formData: NewComment,
    onSuccess?: (comment: Comment) => void,
    onError?: (error: unknown) => void,
  ) => {
    if (!formData.postId) {
      throw new Error("postId is required");
    }

    try {
      const data = await commentsApi.addComment({
        body: formData.body,
        postId: formData.postId,
        userId: formData.userId,
      });
      onSuccess?.(data);
      return data;
    } catch (error) {
      console.error("댓글 추가 오류:", error);
      onError?.(error);
      throw error;
    }
  };

  return { submitComment };
};
