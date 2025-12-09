import { useDialogState, useFormState } from "../../../shared/hooks";
import { useCommentUpdate } from "./useCommentUpdate";
import { Comment } from "../../../entities/comment";

interface EditCommentForm {
  body: string;
}

interface UseEditCommentFeatureProps {
  onSuccess: (updatedComment: Comment) => void;
}

/**
 * 댓글 수정 기능 조합 훅
 *
 * 책임:
 * - 수정 다이얼로그 상태 관리 (useDialogState)
 * - 수정 폼 데이터 관리 (useFormState)
 * - API 호출 로직 (useCommentUpdate)
 *
 * 의존성:
 * - shared/hooks/useDialogState - 다이얼로그 열기/닫기
 * - shared/hooks/useFormState - 폼 데이터 관리
 * - features/edit-comment/model/useCommentUpdate - API 호출
 */
export const useEditCommentFeature = ({ onSuccess }: UseEditCommentFeatureProps) => {
  const dialog = useDialogState();
  const form = useFormState<EditCommentForm>({
    body: "",
  });

  const { updateComment } = useCommentUpdate();

  const openEditDialog = (comment: Comment) => {
    form.updateForm({
      body: comment.body,
    });
    dialog.openDialog();
  };

  const handleSubmit = (commentId: number) => {
    updateComment(
      commentId,
      form.formData.body,
      (updatedComment: Comment) => {
        dialog.closeDialog();
        form.resetForm();
        onSuccess(updatedComment);
      },
      (error: unknown) => {
        console.error("댓글 수정 실패:", error);
      },
    );
  };

  return {
    // 다이얼로그 상태
    isOpen: dialog.open,
    openEditDialog,
    closeDialog: dialog.closeDialog,

    // 폼 상태
    formData: form.formData,
    updateField: form.updateField,

    // 제출
    handleSubmit,
  };
};
