import { useState } from "react";
import { postsApi, type NewPost, type Post } from "../../../entities/post";

export const useAddPost = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewPost>({
    title: "",
    body: "",
    userId: 1,
  });

  const handleSubmit = async (onSuccess?: (post: Post) => void) => {
    try {
      const data = await postsApi.addPost(formData);
      setOpen(false);
      setFormData({ title: "", body: "", userId: 1 });
      onSuccess?.(data);
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  return {
    open,
    setOpen,
    formData,
    setFormData,
    handleSubmit,
  };
};
