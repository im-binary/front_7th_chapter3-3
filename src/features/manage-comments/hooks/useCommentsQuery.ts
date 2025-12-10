import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../../../entities/comment/api/commentsApi";
import { commentsKeys } from "../../../shared/api/queryKeys";

/**
 * 게시글별 댓글 조회
 *
 * 캐싱 전략:
 * - staleTime: 30초 - 댓글은 실시간성이 중요 (추가/수정/삭제 빈번)
 * - gcTime: 3분 - 짧은 시간 동안만 캐시 유지
 */
export const useComments = (postId: number) => {
  return useQuery({
    queryKey: commentsKeys.byPost(postId),
    queryFn: async () => {
      const data = await commentsApi.getComments(postId);
      return data.comments;
    },
    enabled: !!postId,
    staleTime: 1000 * 30, // 30초
    gcTime: 1000 * 60 * 3, // 3분
    refetchOnWindowFocus: true, // 탭 복귀 시 최신 댓글 확인
  });
};

/**
 * 댓글 삭제 Mutation
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.all });
    },
  });
};

/**
 * 댓글 좋아요 Mutation
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentLikes }: { id: number; currentLikes: number }) =>
      commentsApi.likeComment(id, currentLikes + 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.all });
    },
  });
};

/**
 * 댓글 추가 Mutation
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: { body: string; postId: number; userId: number }) => commentsApi.addComment(comment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.byPost(data.postId) });
    },
  });
};

/**
 * 댓글 수정 Mutation
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string; postId: number }) => commentsApi.updateComment(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.byPost(variables.postId) });
    },
  });
};
