import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "../../../entities/tag/api/tagsApi";
import { tagsKeys } from "../../../shared/api/queryKeys";

/**
 * 태그 리스트 조회
 *
 * 캐싱 전략:
 * - staleTime: Infinity - 태그는 거의 변경되지 않는 정적 데이터
 * - gcTime: 1시간 - 메모리에 오래 보관하여 재사용
 * - refetchOnWindowFocus: false - 불필요한 재조회 방지
 * - refetchOnMount: false - 마운트 시 재조회 방지
 */
export const useTags = () => {
  return useQuery({
    queryKey: tagsKeys.list(),
    queryFn: async () => {
      const data = await tagsApi.getTags();
      return data;
    },
    staleTime: Infinity, // stale 처리 안 함
    gcTime: 1000 * 60 * 60, // 1시간
    refetchOnWindowFocus: false, // 탭 복귀 시 재조회 안 함
    refetchOnMount: false, // 컴포넌트 마운트 시 재조회 안 함
  });
};
