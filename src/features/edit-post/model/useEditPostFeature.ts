import { useDialogState, useFormState } from "../../../shared/hooks";
import { usePostUpdate } from "./usePostUpdate";
import { Post } from "../../../entities/post";

interface EditPostForm {
  title: string;
  body: string;
}

interface UseEditPostFeatureProps {
  onSuccess: (updatedPost: Post) => void;
}

/**
 * 게시물 수정 기능 조합 훅
 *
 * 책임:
 * - 수정 다이얼로그 상태 관리 (useDialogState)
 * - 수정 폼 데이터 관리 (useFormState)
 * - API 호출 로직 (usePostUpdate)
 *
 * 의존성:
 * - shared/hooks/useDialogState - 다이얼로그 열기/닫기
 * - shared/hooks/useFormState - 폼 데이터 관리
 * - features/edit-post/model/usePostUpdate - API 호출
 */
export const useEditPostFeature = ({ onSuccess }: UseEditPostFeatureProps) => {
  const dialog = useDialogState();
  const form = useFormState<EditPostForm>({
    title: "",
    body: "",
  });

  const { updatePost } = usePostUpdate();

  const openEditDialog = (post: Post) => {
    form.updateForm({
      title: post.title,
      body: post.body,
    });
    dialog.openDialog();
  };

  const handleSubmit = (postId: number) => {
    updatePost(
      postId,
      {
        title: form.formData.title,
        body: form.formData.body,
      },
      (updatedPost: Post) => {
        dialog.closeDialog();
        form.resetForm();
        onSuccess(updatedPost);
      },
      (error: unknown) => {
        console.error("게시물 수정 실패:", error);
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
