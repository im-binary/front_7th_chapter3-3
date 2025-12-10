import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../../../entities/comment/api/commentsApi";
import { commentsKeys } from "../../../shared/api/queryKeys";
import type { Comment } from "../../../entities/comment";

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
    onMutate: async (id) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: commentsKeys.all });

      // 이전 데이터 백업
      const previousComments = queryClient.getQueriesData({ queryKey: commentsKeys.all });

      // 낙관적 업데이트: 댓글 즉시 제거
      queryClient.setQueriesData({ queryKey: commentsKeys.all }, (old: unknown) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter((comment: Comment) => comment.id !== id);
        }
        return old;
      });

      return { previousComments };
    },
    onError: (_err, _id, context) => {
      // 에러 발생 시 롤백
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
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
    onMutate: async ({ id, currentLikes }) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: commentsKeys.all });

      // 이전 데이터 백업
      const previousComments = queryClient.getQueriesData({ queryKey: commentsKeys.all });

      // 낙관적 업데이트: 좋아요 수 즉시 증가
      queryClient.setQueriesData({ queryKey: commentsKeys.all }, (old: unknown) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((comment: Comment) => (comment.id === id ? { ...comment, likes: currentLikes + 1 } : comment));
        }
        return old;
      });

      return { previousComments };
    },
    onError: (_err, _variables, context) => {
      // 에러 발생 시 롤백
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
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
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: commentsKeys.byPost(newComment.postId) });

      const previousComments = queryClient.getQueryData(commentsKeys.byPost(newComment.postId));

      // 임시 댓글로 낙관적 업데이트
      const optimisticComment = {
        id: Date.now(),
        body: newComment.body,
        postId: newComment.postId,
        userId: newComment.userId,
        likes: 0,
        user: {
          id: newComment.userId,
          username: "You",
        },
      };

      queryClient.setQueryData(commentsKeys.byPost(newComment.postId), (old: unknown) => {
        if (!old) return [optimisticComment];
        if (Array.isArray(old)) {
          return [...old, optimisticComment];
        }
        return old;
      });

      return { previousComments, postId: newComment.postId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousComments && context?.postId) {
        queryClient.setQueryData(commentsKeys.byPost(context.postId), context.previousComments);
      }
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
    onMutate: async ({ id, body, postId }) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: commentsKeys.byPost(postId) });

      // 이전 데이터 백업
      const previousComments = queryClient.getQueryData(commentsKeys.byPost(postId));

      // 낙관적 업데이트: 댓글 내용 즉시 변경
      queryClient.setQueryData(commentsKeys.byPost(postId), (old: unknown) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((comment: Comment) => (comment.id === id ? { ...comment, body } : comment));
        }
        return old;
      });

      return { previousComments, postId };
    },
    onError: (_err, _variables, context) => {
      // 에러 발생 시 롤백
      if (context?.previousComments && context?.postId) {
        queryClient.setQueryData(commentsKeys.byPost(context.postId), context.previousComments);
      }
    },
  });
};
