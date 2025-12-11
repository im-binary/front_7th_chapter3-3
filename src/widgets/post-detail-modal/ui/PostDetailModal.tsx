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
  commentsLoading: boolean;
  commentsError: boolean;
  searchQuery: string;
  onAddComment: () => void;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (id: number) => Promise<void>;
  onLikeComment: (id: number, currentLikes: number) => Promise<void>;
}

export const PostDetailModal = ({
  open,
  onOpenChange,
  post,
  comments,
  commentsLoading,
  commentsError,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailModalProps) => {
  if (!post) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>

          {(() => {
            if (commentsLoading) {
              return <div className="flex justify-center p-4 text-gray-500">댓글 로딩 중...</div>;
            }

            if (commentsError) {
              return (
                <div className="flex flex-col items-center p-4 text-red-600 space-y-2">
                  <p>댓글을 불러오는데 실패했습니다.</p>
                  <button onClick={() => window.location.reload()} className="text-sm underline hover:no-underline">
                    새로고침
                  </button>
                </div>
              );
            }

            return (
              <CommentsList
                comments={comments}
                searchQuery={searchQuery}
                onAddComment={onAddComment}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
                onLikeComment={onLikeComment}
              />
            );
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
