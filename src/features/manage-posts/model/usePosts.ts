import { useState } from "react";
import type { Post } from "../../../entities/post";
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

  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      return;
    }
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([postsApi.getPostsByTag(tag), usersApi.getUsers()]);

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

  return {
    posts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    deletePost,
    setPosts,
  };
};
