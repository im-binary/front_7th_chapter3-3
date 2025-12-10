import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../../../entities/user/api/usersApi";
import { usersKeys } from "../../../shared/api/queryKeys";

/**
 * 사용자 상세 조회
 *
 * 캐싱 전략:
 * - staleTime: 5분 - 사용자 정보는 자주 변경되지 않음
 * - gcTime: 10분 - 여러 페이지에서 재사용 가능하도록 충분히 보관
 */
export const useUserDetail = (userId: number | null) => {
  return useQuery({
    queryKey: usersKeys.detail(userId!),
    queryFn: async () => {
      const data = await usersApi.getUser(userId!);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};
