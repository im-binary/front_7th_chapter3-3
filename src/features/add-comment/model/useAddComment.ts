import { useState } from "react";
import { commentsApi, type NewComment, type Comment } from "../../../entities/comment";

export const useAddComment = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewComment>({
    body: "",
    postId: null,
    userId: 1,
  });

  const openDialog = (postId: number) => {
    setFormData((prev) => ({ ...prev, postId }));
    setOpen(true);
  };

  const handleSubmit = async (onSuccess?: (comment: Comment) => void) => {
    if (!formData.postId) return;

    try {
      const data = await commentsApi.addComment({
        body: formData.body,
        postId: formData.postId,
        userId: formData.userId,
      });
      setOpen(false);
      setFormData({ body: "", postId: null, userId: 1 });
      onSuccess?.(data);
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  return {
    open,
    setOpen,
    formData,
    setFormData,
    openDialog,
    handleSubmit,
  };
};
