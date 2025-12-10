import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "../../../entities/tag/api/tagsApi";
import { tagsKeys } from "../../../shared/api/queryKeys";

/**
 * 태그 리스트 조회
 *
 * 캐싱 전략:
 * - staleTime: Infinity (태그는 거의 변경되지 않음)
 * - gcTime: 1시간 (메모리에 오래 보관)
 */
export const useTags = () => {
  return useQuery({
    queryKey: tagsKeys.list(),
    queryFn: async () => {
      const data = await tagsApi.getTags();
      return data;
    },
    staleTime: Infinity, // 태그는 거의 변경되지 않으므로 무한대로 설정
    gcTime: 1000 * 60 * 60, // 1시간
  });
};
