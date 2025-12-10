export const postsKeys = {
  // 모든 posts 쿼리
  all: ["posts"] as const,

  // 리스트 쿼리들
  lists: () => [...postsKeys.all, "list"] as const,
  list: (params: { skip: number; limit: number; sortBy?: string; sortOrder?: string }) =>
    [...postsKeys.lists(), params] as const,

  // 검색 쿼리들
  searches: () => [...postsKeys.all, "search"] as const,
  search: (query: string) => [...postsKeys.searches(), query] as const,

  // 태그별 쿼리들
  byTags: () => [...postsKeys.all, "byTag"] as const,
  byTag: (tag: string) => [...postsKeys.byTags(), tag] as const,

  // 개별 게시글
  details: () => [...postsKeys.all, "detail"] as const,
  detail: (id: number) => [...postsKeys.details(), id] as const,
} as const;

export const commentsKeys = {
  all: ["comments"] as const,

  // 게시글별 댓글 리스트
  lists: () => [...commentsKeys.all, "list"] as const,
  byPost: (postId: number) => [...commentsKeys.lists(), postId] as const,

  // 개별 댓글
  details: () => [...commentsKeys.all, "detail"] as const,
  detail: (id: number) => [...commentsKeys.details(), id] as const,
} as const;

export const tagsKeys = {
  all: ["tags"] as const,

  // 태그 리스트 (staleTime: Infinity - 거의 변경되지 않음)
  lists: () => [...tagsKeys.all, "list"] as const,
  list: () => [...tagsKeys.lists()] as const,
} as const;

export const usersKeys = {
  all: ["users"] as const,

  // 개별 사용자
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,

  // 사용자의 게시글들
  posts: (userId: number) => [...usersKeys.detail(userId), "posts"] as const,
} as const;
