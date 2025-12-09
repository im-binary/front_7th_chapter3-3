import { useDialogState, useFormState } from "../../../shared/hooks";
import { useCommentSubmit } from "./useCommentSubmit";
import { Comment } from "../../../entities/comment";

interface AddCommentForm {
  body: string;
  userId: number;
}

interface UseAddCommentFeatureProps {
  onSuccess: (newComment: Comment) => void;
}

/**
 * 댓글 추가 기능 조합 훅
 *
 * 책임:
 * - 추가 다이얼로그 상태 관리 (useDialogState)
 * - 추가 폼 데이터 관리 (useFormState)
 * - API 호출 로직 (useCommentSubmit)
 *
 * 의존성:
 * - shared/hooks/useDialogState - 다이얼로그 열기/닫기
 * - shared/hooks/useFormState - 폼 데이터 관리
 * - features/add-comment/model/useCommentSubmit - API 호출
 */
export const useAddCommentFeature = ({ onSuccess }: UseAddCommentFeatureProps) => {
  const dialog = useDialogState();
  const form = useFormState<AddCommentForm>({
    body: "",
    userId: 1,
  });

  const { submitComment } = useCommentSubmit();

  const openAddDialog = () => {
    form.resetForm();
    dialog.openDialog();
  };

  const handleSubmit = (postId: number) => {
    submitComment(
      {
        body: form.formData.body,
        postId,
        userId: form.formData.userId,
      },
      (newComment: Comment) => {
        dialog.closeDialog();
        form.resetForm();
        onSuccess(newComment);
      },
      (error: unknown) => {
        console.error("댓글 추가 실패:", error);
      },
    );
  };

  return {
    // 다이얼로그 상태
    isOpen: dialog.open,
    openAddDialog,
    closeDialog: dialog.closeDialog,

    // 폼 상태
    formData: form.formData,
    updateField: form.updateField,

    // 제출
    handleSubmit,
  };
};
