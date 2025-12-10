import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../../../entities/user/api/usersApi";
import { usersKeys } from "../../../shared/api/queryKeys";

/**
 * 사용자 상세 조회
 *
 * 캐싱 전략:
 * - staleTime: 10분 (사용자 정보는 자주 변경되지 않음)
 */
export const useUserDetail = (userId: number | null) => {
  return useQuery({
    queryKey: usersKeys.detail(userId!),
    queryFn: async () => {
      const data = await usersApi.getUser(userId!);
      return data;
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 1000 * 60 * 10, // 10분
  });
};
