// Users API
export const usersApi = {
  // 사용자 목록 가져오기
  getUsers: async () => {
    const response = await fetch("/api/users?limit=0&select=username,image");
    return response.json();
  },

  // 사용자 상세 정보 가져오기
  getUser: async (id: number) => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  },
};
