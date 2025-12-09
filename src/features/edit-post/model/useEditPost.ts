import { useState } from "react";
import { postsApi, type Post } from "../../../entities/post";

export const useEditPost = () => {
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openDialog = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleSubmit = async (onSuccess?: (post: Post) => void) => {
    if (!selectedPost) return;

    try {
      await postsApi.updatePost(selectedPost.id, {
        title: selectedPost.title,
        body: selectedPost.body,
      });
      setOpen(false);
      onSuccess?.(selectedPost);
    } catch (error) {
      console.error("게시물 수정 오류:", error);
    }
  };

  return {
    open,
    setOpen,
    selectedPost,
    setSelectedPost,
    openDialog,
    handleSubmit,
  };
};
