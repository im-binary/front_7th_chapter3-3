import { useState, useCallback } from "react";
import { commentsApi, type Comment } from "../index";

/**
 * 댓글 데이터 fetching hook
 * 단일 책임: API에서 댓글 가져오기만 담당
 */
export const useCommentsQuery = () => {
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  const fetchComments = useCallback(
    async (postId: number): Promise<void> => {
      // 이미 로드된 댓글은 다시 가져오지 않음 (캐싱)
      if (comments[postId]) return;

      try {
        const data = await commentsApi.getComments(postId);
        setComments((prev) => ({ ...prev, [postId]: data.comments }));
      } catch (error) {
        console.error("댓글 가져오기 오류:", error);
      }
    },
    [comments],
  );

  return {
    comments,
    setComments,
    fetchComments,
  };
};
