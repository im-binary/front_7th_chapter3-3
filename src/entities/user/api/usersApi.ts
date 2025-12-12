import { User, UsersResponse } from "../model/types";
import { API_BASE_URL } from "../../../shared/lib";

// Users API
export const usersApi = {
  // 사용자 목록 가져오기
  getUsers: async (): Promise<UsersResponse> => {
    const response = await fetch(`${API_BASE_URL}/users?limit=0&select=username,image`);
    return response.json();
  },

  // 사용자 상세 정보 가져오기
  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },
};
