import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import { CommentsList } from "./CommentsList";
import { highlightText } from "../../../shared/lib";
import { Post, Comment } from "../../../shared/types";

interface PostDetailDialogProps {
  showPostDetailDialog: boolean;
  setShowPostDetailDialog: (show: boolean) => void;
  selectedPost: Post | null;
  searchQuery: string;
  comments: Record<number, Comment[]>;
  onAddComment: (postId: number) => void;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (id: number, postId: number) => void;
  onLikeComment: (id: number, postId: number) => void;
}

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {selectedPost && comments[selectedPost.id] && (
            <CommentsList
              postId={selectedPost.id}
              comments={comments[selectedPost.id]}
              searchQuery={searchQuery}
              onAddComment={onAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onLikeComment={onLikeComment}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
