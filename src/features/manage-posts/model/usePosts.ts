import { useState } from "react";
import type { Post, NewPost } from "../../../entities/post";
import type { User } from "../../../entities/user";
import { postsApi } from "../../../entities/post/api/postsApi";
import { usersApi } from "../../../entities/user/api/usersApi";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (limit: number, skip: number) => {
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([postsApi.getPosts(limit, skip), usersApi.getUsers()]);

      const postsWithUsers = postsResponse.posts.map((post: Post) => ({
        ...post,
        author: usersResponse.users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsResponse.total);
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query: string) => {
    if (!query) {
      return;
    }
    setLoading(true);
    try {
      const data = await postsApi.searchPosts(query);

      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsByTag = async (tag: string, limit = 10, skip = 0) => {
    if (!tag || tag === "all") {
      return;
    }
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        postsApi.getPostsByTag(tag, limit, skip),
        usersApi.getUsers(),
      ]);

      const postsWithUsers = postsResponse.posts.map((post: Post) => ({
        ...post,
        author: usersResponse.users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsResponse.total);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await postsApi.deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
    }
  };

  // 게시물 추가
  const addPost = async (newPost: NewPost) => {
    try {
      const data = await postsApi.addPost(newPost);
      setPosts([data, ...posts]);
      return data;
    } catch (error) {
      console.error("게시물 추가 오류:", error);
      throw error;
    }
  };

  // 게시물 수정
  const updatePost = async (id: number, post: { title: string; body: string }) => {
    try {
      const data = await postsApi.updatePost(id, post);
      setPosts(posts.map((p) => (p.id === data.id ? data : p)));
      return data;
    } catch (error) {
      console.error("게시물 수정 오류:", error);
      throw error;
    }
  };

  // 검색 핸들러
  const handleSearch = async (query: string, limit: number, skip: number) => {
    if (query) {
      await searchPosts(query);
    } else {
      await fetchPosts(limit, skip);
    }
  };

  // 태그 변경 핸들러
  const handleTagChange = async (tag: string, limit: number, skip: number) => {
    if (tag && tag !== "all") {
      await fetchPostsByTag(tag, limit, skip);
    } else {
      await fetchPosts(limit, skip);
    }
  };

  return {
    posts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    deletePost,
    addPost,
    updatePost,
    handleSearch,
    handleTagChange,
    setPosts,
  };
};
