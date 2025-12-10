import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, NewPost } from "../../../entities/post";
import type { User } from "../../../entities/user";
import { postsApi } from "../../../entities/post/api/postsApi";
import { usersApi } from "../../../entities/user/api/usersApi";
import { postsKeys } from "../../../shared/api/queryKeys";

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
  });
};

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
    staleTime: 1000 * 60 * 3,
  });
};

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
      queryClient.setQueriesData({ queryKey: postsKeys.all }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.filter((post: Post) => post.id !== id),
          total: old.total - 1,
        };
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
    onSettled: () => {
      // 성공/실패 여부와 관계없이 서버 데이터로 재조회
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
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

      queryClient.setQueriesData({ queryKey: postsKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: [optimisticPost, ...old.posts],
          total: old.total + 1,
        };
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
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
      queryClient.setQueriesData({ queryKey: postsKeys.all }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.map((p: Post) => (p.id === id ? { ...p, ...post } : p)),
        };
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
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
  });
};
