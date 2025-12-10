import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, NewPost } from "../../../entities/post";
import type { User } from "../../../entities/user";
import { postsApi } from "../../../entities/post/api/postsApi";
import { usersApi } from "../../../entities/user/api/usersApi";
import { postsKeys } from "../../../shared/api/queryKeys";

/**
 * Posts 조회 (페이지네이션)
 *
 * 캐싱 전략:
 * - staleTime: 2분 - 게시글은 자주 변경되지 않지만 새 글이 추가될 수 있음
 * - gcTime: 5분 - 페이지별로 캐시 유지 (사용자가 앞뒤 페이지 이동 시 즉시 표시)
 * - refetchOnWindowFocus: true - 탭 복귀 시 최신 데이터 확인
 */
export const usePosts = (limit: number, skip: number) => {
  return useQuery({
    queryKey: postsKeys.list({ skip, limit }),
    queryFn: async () => {
      const [postsResponse, usersResponse] = await Promise.all([postsApi.getPosts(limit, skip), usersApi.getUsers()]);

      const postsWithUsers = postsResponse.posts.map((post: Post) => ({
        ...post,
        author: usersResponse.users.find((user: User) => user.id === post.userId),
      }));

      return {
        posts: postsWithUsers,
        total: postsResponse.total,
      };
    },
    staleTime: 1000 * 60 * 2, // 2분
    gcTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * Posts 검색
 *
 * 캐싱 전략:
 * - staleTime: 1분 - 검색 결과는 빠르게 stale 처리
 * - enabled: query 있을 때만 실행
 * - 검색어별로 별도 캐시 유지
 */
export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: postsKeys.search(query),
    queryFn: async () => {
      const data = await postsApi.searchPosts(query);
      return {
        posts: data.posts,
        total: data.total,
      };
    },
    enabled: !!query,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 3, // 3분
  });
};

/**
 * 태그별 Posts 조회
 *
 * 캐싱 전략:
 * - staleTime: 2분 - 일반 목록과 동일
 * - enabled: tag가 'all'이 아닐 때만 실행
 * - 태그별로 독립적인 캐시 유지
 */
export const usePostsByTag = (tag: string, limit = 10, skip = 0) => {
  return useQuery({
    queryKey: postsKeys.byTag(tag),
    queryFn: async () => {
      const [postsResponse, usersResponse] = await Promise.all([
        postsApi.getPostsByTag(tag, limit, skip),
        usersApi.getUsers(),
      ]);

      const postsWithUsers = postsResponse.posts.map((post: Post) => ({
        ...post,
        author: usersResponse.users.find((user: User) => user.id === post.userId),
      }));

      return {
        posts: postsWithUsers,
        total: postsResponse.total,
      };
    },
    enabled: !!tag && tag !== "all",
    staleTime: 1000 * 60 * 2, // 2분
    gcTime: 1000 * 60 * 5, // 5분
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onMutate: async (id) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: postsKeys.all });

      // 이전 데이터 백업
      const previousPosts = queryClient.getQueriesData({ queryKey: postsKeys.all });

      // 낙관적 업데이트: 모든 posts 쿼리에서 해당 post 제거
      queryClient.setQueriesData({ queryKey: postsKeys.all }, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        if ("posts" in old && Array.isArray(old.posts) && "total" in old) {
          return {
            ...old,
            posts: old.posts.filter((post: Post) => post.id !== id),
            total: (old.total as number) - 1,
          };
        }
        return old;
      });

      return { previousPosts };
    },
    onError: (_err, _id, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};

export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: NewPost) => postsApi.addPost(newPost),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() });

      const previousPosts = queryClient.getQueriesData({ queryKey: postsKeys.lists() });

      // 임시 ID로 낙관적 업데이트 (실제 ID는 서버에서 받음)
      const optimisticPost: Post = {
        ...newPost,
        id: Date.now(), // 임시 ID
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
      };

      queryClient.setQueriesData({ queryKey: postsKeys.lists() }, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        if ("posts" in old && Array.isArray(old.posts) && "total" in old) {
          return {
            ...old,
            posts: [optimisticPost, ...old.posts],
            total: (old.total as number) + 1,
          };
        }
        return old;
      });

      return { previousPosts };
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: { title: string; body: string } }) => postsApi.updatePost(id, post),
    onMutate: async ({ id, post }) => {
      await queryClient.cancelQueries({ queryKey: postsKeys.all });

      const previousPosts = queryClient.getQueriesData({ queryKey: postsKeys.all });

      // 낙관적 업데이트: 제목과 본문만 즉시 변경
      queryClient.setQueriesData({ queryKey: postsKeys.all }, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        if ("posts" in old && Array.isArray(old.posts)) {
          return {
            ...old,
            posts: old.posts.map((p: Post) => (p.id === id ? { ...p, ...post } : p)),
          };
        }
        return old;
      });

      return { previousPosts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};
