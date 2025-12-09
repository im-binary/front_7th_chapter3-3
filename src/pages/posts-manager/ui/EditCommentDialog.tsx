import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui";
import { Comment } from "../../../shared/types";

interface EditCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: Comment | null;
  onCommentChange: (comment: Comment) => void;
  onSubmit: () => void;
}

export const EditCommentDialog = ({
  open,
  onOpenChange,
  comment,
  onCommentChange,
  onSubmit,
}: EditCommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={comment?.body || ""}
            onChange={(e) => onCommentChange({ ...comment!, body: e.target.value })}
          />
          <Button onClick={onSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
