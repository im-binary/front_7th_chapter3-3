import { useDialogState } from "../../../shared/hooks/useDialogState";
import { useFormState } from "../../../shared/hooks/useFormState";
import { type NewPost, type Post } from "../../../entities/post";
import { usePostSubmit } from "./usePostSubmit";

const initialFormData: NewPost = {
  title: "",
  body: "",
  userId: 1,
};

/**
 * 게시물 추가 feature hook (조합)
 * 작은 hooks들을 조합하여 완전한 기능 제공
 */
export const useAddPostFeature = () => {
  const dialog = useDialogState();
  const form = useFormState<NewPost>(initialFormData);
  const { submitPost } = usePostSubmit();

  const handleSubmit = async (onSuccess?: (post: Post) => void) => {
    await submitPost(
      form.formData,
      (post) => {
        dialog.closeDialog();
        form.resetForm();
        onSuccess?.(post);
      },
      (error) => {
        console.error("제출 실패:", error);
      },
    );
  };

  return {
    // Dialog 상태
    ...dialog,
    // Form 상태
    ...form,
    // 제출 로직
    handleSubmit,
  };
};
