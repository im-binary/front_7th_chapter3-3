import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui";
import { NewComment } from "../../../shared/types";

interface AddCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: NewComment;
  onCommentChange: (comment: NewComment) => void;
  onSubmit: () => void;
}

export const AddCommentDialog = ({ open, onOpenChange, comment, onCommentChange, onSubmit }: AddCommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={comment.body}
            onChange={(e) => onCommentChange({ ...comment, body: e.target.value })}
          />
          <Button onClick={onSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
