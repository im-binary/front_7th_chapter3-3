import { useState } from "react";
import { commentsApi, type Comment } from "../../../entities/comment";

export const useEditComment = () => {
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const openDialog = (comment: Comment) => {
    setSelectedComment(comment);
    setOpen(true);
  };

  const handleSubmit = async (onSuccess?: (comment: Comment) => void) => {
    if (!selectedComment) return;

    try {
      const data = await commentsApi.updateComment(selectedComment.id, selectedComment.body);
      setOpen(false);
      onSuccess?.(data);
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
  };

  return {
    open,
    setOpen,
    selectedComment,
    setSelectedComment,
    openDialog,
    handleSubmit,
  };
};
