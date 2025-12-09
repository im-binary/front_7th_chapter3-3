import { useEffect } from "react";
import { type Post } from "../index";

interface UsePostsSortProps {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  sortBy: string;
  sortOrder: string;
}

/**
 * 게시물 정렬 hook
 * 단일 책임: 게시물 정렬만 담당
 */
export const usePostsSort = ({ posts, setPosts, sortBy, sortOrder }: UsePostsSortProps) => {
  const sortPosts = () => {
    if (!sortBy) return;

    const sortedPosts = [...posts].sort((a, b) => {
      const aValue = a[sortBy as keyof Post];
      const bValue = b[sortBy as keyof Post];

      if (aValue === undefined || bValue === undefined) return 0;

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setPosts(sortedPosts);
  };

  useEffect(() => {
    if (sortBy && posts.length > 0) {
      sortPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  return { sortPosts };
};
