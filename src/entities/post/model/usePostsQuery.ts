import { useState, useEffect } from "react";
import { postsApi, type Post } from "../index";
import { usersApi, type User } from "../../user";
import { useLoadingState } from "../../../shared/hooks";

interface UsePostsQueryProps {
  limit: number;
  skip: number;
  searchQuery?: string;
  selectedTag?: string;
}

/**
 * 게시물 데이터 fetching hook
 * 단일 책임: API에서 데이터 가져오기만 담당
 */
export const usePostsQuery = ({ limit, skip, searchQuery, selectedTag }: UsePostsQueryProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const { loading, startLoading, stopLoading } = useLoadingState();

  // 일반 게시물 가져오기
  const fetchPosts = async (): Promise<void> => {
    startLoading();
    try {
      const [postsData, usersData] = await Promise.all([postsApi.getPosts(limit, skip), usersApi.getUsers()]);

      const postsWithUsers: Post[] = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    } finally {
      stopLoading();
    }
  };

  // 게시물 검색
  const searchPosts = async (query: string): Promise<void> => {
    startLoading();
    try {
      const data = await postsApi.searchPosts(query);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    } finally {
      stopLoading();
    }
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string): Promise<void> => {
    startLoading();
    try {
      const [postsData, usersData] = await Promise.all([postsApi.getPostsByTag(tag), usersApi.getUsers()]);

      const postsWithUsers: Post[] = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    } finally {
      stopLoading();
    }
  };

  // 자동 데이터 로딩
  useEffect(() => {
    if (searchQuery) {
      searchPosts(searchQuery);
    } else if (selectedTag && selectedTag !== "all") {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, skip, searchQuery, selectedTag]);

  return {
    posts,
    setPosts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
  };
};
