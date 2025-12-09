// Tags API
export const tagsApi = {
  // 태그 목록 가져오기
  getTags: async () => {
    const response = await fetch("/api/posts/tags");
    return response.json();
  },
};
