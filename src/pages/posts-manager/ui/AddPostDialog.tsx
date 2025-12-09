import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui";
import type { NewPost } from "../../../entities/post";

interface AddPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: NewPost;
  onPostChange: (post: NewPost) => void;
  onSubmit: () => void;
}

export const AddPostDialog = ({ open, onOpenChange, post, onPostChange, onSubmit }: AddPostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post.title}
            onChange={(e) => onPostChange({ ...post, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={post.body}
            onChange={(e) => onPostChange({ ...post, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={post.userId}
            onChange={(e) => onPostChange({ ...post, userId: Number(e.target.value) })}
          />
          <Button onClick={onSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
