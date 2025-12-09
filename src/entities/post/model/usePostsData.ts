import { useState, useEffect } from "react";
import { postsApi, type Post } from "../index";
import { usersApi, type User } from "../../user";

interface UsePostsDataProps {
  limit: number;
  skip: number;
  searchQuery?: string;
  selectedTag?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const usePostsData = ({ limit, skip, searchQuery, selectedTag, sortBy, sortOrder }: UsePostsDataProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 게시물 가져오기
  const fetchPosts = async (): Promise<void> => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  // 게시물 검색
  const searchPosts = async (): Promise<void> => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const data = await postsApi.searchPosts(searchQuery);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string): Promise<void> => {
    if (!tag || tag === "all") {
      fetchPosts();
      return;
    }
    setLoading(true);
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
      setLoading(false);
    }
  };

  // 게시물 추가
  const addPost = async (post: Post) => {
    setPosts([post, ...posts]);
  };

  // 게시물 업데이트
  const updatePost = async (updatedPost: Post) => {
    setPosts(
      posts.map((post) =>
        post.id === updatedPost.id ? { ...post, title: updatedPost.title, body: updatedPost.body } : post,
      ),
    );
  };

  // 게시물 삭제
  const deletePost = async (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // 정렬 적용
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

  // 검색 쿼리나 태그가 변경되면 데이터 다시 가져오기
  useEffect(() => {
    if (searchQuery) {
      searchPosts();
    } else if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, skip, searchQuery, selectedTag]);

  // 정렬 옵션이 변경되면 정렬 적용
  useEffect(() => {
    if (sortBy) {
      sortPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  return {
    posts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    addPost,
    updatePost,
    deletePost,
  };
};
