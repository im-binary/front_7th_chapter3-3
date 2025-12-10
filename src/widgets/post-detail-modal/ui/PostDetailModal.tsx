import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import { highlightText } from "../../../shared/lib";
import { CommentsList } from "../../comments-list";
import { useCommentsContext } from "../../../app/providers/CommentsProvider";
import type { Post } from "../../../entities/post";
import type { Comment } from "../../../entities/comment";

interface PostDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  searchQuery: string;
  onAddComment: () => void;
  onEditComment: (comment: Comment) => void;
}

export const PostDetailModal = ({
  open,
  onOpenChange,
  post,
  searchQuery,
  onAddComment,
  onEditComment,
}: PostDetailModalProps) => {
  const { comments, deleteComment, likeComment } = useCommentsContext();

  if (!post) {
    return null;
  }

  const postComments = comments[post.id] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>

          <CommentsList
            comments={postComments}
            searchQuery={searchQuery}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={(commentId) => deleteComment(commentId, post.id)}
            onLikeComment={(commentId) => likeComment(commentId, post.id)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
