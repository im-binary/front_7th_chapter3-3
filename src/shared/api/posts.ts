// Posts API
export const postsApi = {
  // 게시물 목록 가져오기
  getPosts: async (limit: number, skip: number) => {
    const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
    return response.json();
  },

  // 게시물 검색
  searchPosts: async (query: string) => {
    const response = await fetch(`/api/posts/search?q=${query}`);
    return response.json();
  },

  // 태그별 게시물 가져오기
  getPostsByTag: async (tag: string) => {
    const response = await fetch(`/api/posts/tag/${tag}`);
    return response.json();
  },

  // 게시물 추가
  addPost: async (post: { title: string; body: string; userId: number }) => {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  // 게시물 수정
  updatePost: async (id: number, post: { title: string; body: string }) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  // 게시물 삭제
  deletePost: async (id: number) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};
