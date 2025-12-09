import { postsApi, type NewPost, type Post } from "../../../entities/post";

/**
 * 게시물 추가 API 호출 hook
 * 단일 책임: 게시물 추가 API 호출만 담당
 */
export const usePostSubmit = () => {
  const submitPost = async (
    formData: NewPost,
    onSuccess?: (post: Post) => void,
    onError?: (error: unknown) => void,
  ) => {
    try {
      const data = await postsApi.addPost(formData);
      onSuccess?.(data);
      return data;
    } catch (error) {
      console.error("게시물 추가 오류:", error);
      onError?.(error);
      throw error;
    }
  };

  return { submitPost };
};
