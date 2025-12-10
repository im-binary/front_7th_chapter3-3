import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import { highlightText } from "../../../shared/lib";
import { CommentsList } from "../../comments-list";
import type { Post } from "../../../entities/post";
import type { Comment } from "../../../entities/comment";

interface PostDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  comments: Comment[];
  searchQuery: string;
  onAddComment: () => void;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (commentId: number) => void;
  onLikeComment: (commentId: number) => void;
}

export const PostDetailModal = ({
  open,
  onOpenChange,
  post,
  comments,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailModalProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>

          <CommentsList
            comments={comments}
            searchQuery={searchQuery}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onLikeComment={onLikeComment}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
