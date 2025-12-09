import { postsApi, type Post } from "../../../entities/post";

/**
 * 게시물 수정 API 호출 hook
 * 단일 책임: 게시물 수정 API 호출만 담당
 */
export const usePostUpdate = () => {
  const updatePost = async (
    postId: number,
    data: { title: string; body: string },
    onSuccess?: (post: Post) => void,
    onError?: (error: unknown) => void,
  ) => {
    try {
      await postsApi.updatePost(postId, data);
      onSuccess?.({ ...data, id: postId } as Post);
    } catch (error) {
      console.error("게시물 수정 오류:", error);
      onError?.(error);
      throw error;
    }
  };

  return { updatePost };
};
