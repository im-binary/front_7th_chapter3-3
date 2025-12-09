import { type Post } from "../index";

/**
 * 게시물 로컬 상태 CRUD hook
 * 단일 책임: 로컬 posts 배열 업데이트만 담당
 */
export const usePostsMutation = (posts: Post[], setPosts: (posts: Post[]) => void) => {
  // 게시물 추가
  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
  };

  // 게시물 업데이트
  const updatePost = (updatedPost: Post) => {
    setPosts(
      posts.map((post) =>
        post.id === updatedPost.id ? { ...post, title: updatedPost.title, body: updatedPost.body } : post,
      ),
    );
  };

  // 게시물 삭제
  const deletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return {
    addPost,
    updatePost,
    deletePost,
  };
};
