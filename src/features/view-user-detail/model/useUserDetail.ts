import { useState } from "react";
import type { User } from "../../../entities/user";
import { usersApi } from "../../../entities/user/api/usersApi";

export const useUserDetail = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUser = async (userId: number) => {
    try {
      const userData = await usersApi.getUser(userId);

      setSelectedUser(userData);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

  return {
    selectedUser,
    fetchUser,
    setSelectedUser,
  };
};
