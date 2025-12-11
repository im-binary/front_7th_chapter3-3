import { Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui";

import { useDeletePost, useAddPost as useAddPostMutation, useUpdatePost } from "../../../features/manage-posts";
import {
  useComments,
  useDeleteComment,
  useLikeComment,
  useAddComment as useAddCommentMutation,
  useUpdateComment,
} from "../../../features/manage-comments";
import { useTags } from "../../../features/manage-tags";
import { useUserDetail } from "../../../features/view-user-detail";
import { useAddPost, AddPostDialog } from "../../../features/add-post";
import { useEditPost, EditPostDialog } from "../../../features/edit-post";
import { useAddComment, AddCommentDialog } from "../../../features/add-comment";
import { useEditComment, EditCommentDialog } from "../../../features/edit-comment";

// Widgets
import { SearchFilters } from "../../../widgets/search-filters";
import { PostsTable } from "../../../widgets/posts-table";
import { PaginationControls } from "../../../widgets/pagination-controls";
import { PostDetailModal } from "../../../widgets/post-detail-modal";
import { UserModal } from "../../../widgets/user-modal";

// Model
import type { usePostsManagerViewModel } from "../model/usePostsManagerViewModel";
import type { Post } from "../../../entities/post";
import type { Comment } from "../../../entities/comment";

interface PostsManagerViewProps {
  viewModel: ReturnType<typeof usePostsManagerViewModel>;
}

export const PostsManagerView = ({ viewModel }: PostsManagerViewProps) => {
  const {
    urlParams,
    searchQuery,
    setSearchQuery,
    updateURL,
    handleSearch,
    handleTagChange,
    showPostDetailDialog,
    setShowPostDetailDialog,
    showUserModal,
    setShowUserModal,
    selectedPost,
    handlePostDetail,
    posts,
    postsLoading,
    postsTotal,
    postsError,
    postsErrorObj,
  } = viewModel;

  const { data: tags = [] } = useTags();
  const {
    data: selectedUser,
    isLoading: userLoading,
    isError: userError,
  } = useUserDetail(showUserModal ? selectedPost?.userId || null : null);
  const {
    data: comments = [],
    isLoading: commentsLoading,
    isError: commentsError,
  } = useComments(selectedPost?.id || 0);

  // Mutations
  const deletePostMutation = useDeletePost();
  const addPostMutation = useAddPostMutation();
  const updatePostMutation = useUpdatePost();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();
  const addCommentMutation = useAddCommentMutation();
  const updateCommentMutation = useUpdateComment();

  // Feature Hooks (Dialog 상태 관리용)
  const addPostFeature = useAddPost();
  const editPostFeature = useEditPost();
  const addCommentFeature = useAddComment();
  const editCommentFeature = useEditComment();

  // Feature를 사용하는 핸들러들
  const handleUserClick = () => {
    setShowUserModal(true);
  };

  const handleDeletePost = async (id: number): Promise<void> => {
    try {
      await deletePostMutation.mutateAsync(id);
    } catch (error) {
      alert("게시물 삭제 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleEditPost = (post: Post) => {
    editPostFeature.setSelectedPost(post);
    editPostFeature.setOpen(true);
  };

  const handleEditPostSubmit = async () => {
    if (!editPostFeature.selectedPost) {
      return;
    }

    try {
      await updatePostMutation.mutateAsync({
        id: editPostFeature.selectedPost.id,
        post: {
          title: editPostFeature.selectedPost.title,
          body: editPostFeature.selectedPost.body,
        },
      });

      editPostFeature.setOpen(false);
    } catch (error) {
      alert("게시물 수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleAddPostSubmit = async () => {
    try {
      await addPostMutation.mutateAsync(addPostFeature.formData);

      addPostFeature.setOpen(false);
      addPostFeature.setFormData({ title: "", body: "", userId: 1 });
    } catch (error) {
      alert("게시물 추가 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleAddComment = () => {
    if (!selectedPost) {
      return;
    }

    addCommentFeature.setFormData({ ...addCommentFeature.formData, postId: selectedPost.id });
    addCommentFeature.setOpen(true);
  };

  const handleAddCommentSubmit = async () => {
    if (addCommentFeature.formData.postId === null) {
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        body: addCommentFeature.formData.body,
        postId: addCommentFeature.formData.postId,
        userId: addCommentFeature.formData.userId,
      });

      addCommentFeature.setOpen(false);
      addCommentFeature.setFormData({ body: "", postId: null, userId: 1 });
    } catch (error) {
      alert("댓글 추가 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleEditComment = (comment: Comment) => {
    editCommentFeature.setSelectedComment(comment);
    editCommentFeature.setOpen(true);
  };

  const handleEditCommentSubmit = async () => {
    if (!editCommentFeature.selectedComment) {
      return;
    }

    try {
      await updateCommentMutation.mutateAsync({
        id: editCommentFeature.selectedComment.id,
        body: editCommentFeature.selectedComment.body,
        postId: editCommentFeature.selectedComment.postId,
      });

      editCommentFeature.setOpen(false);
    } catch (error) {
      alert("댓글 수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      await deleteCommentMutation.mutateAsync(id);
    } catch (error) {
      alert("댓글 삭제 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleLikeComment = async (id: number, currentLikes: number) => {
    try {
      await likeCommentMutation.mutateAsync({ id, currentLikes });
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => addPostFeature.setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchFilters
            searchQuery={searchQuery}
            selectedTag={urlParams.tag}
            sortBy={urlParams.sortBy}
            sortOrder={urlParams.sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearch}
            onTagChange={handleTagChange}
            onSortByChange={(value) => updateURL({ sortBy: value })}
            onSortOrderChange={(value) => updateURL({ sortOrder: value })}
          />

          {/* 게시물 테이블 */}
          {(() => {
            if (postsLoading) {
              return <div className="flex justify-center p-4">로딩 중...</div>;
            }

            if (postsError) {
              return (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="text-red-600 text-lg font-semibold">⚠️ 데이터를 불러오는데 실패했습니다</div>
                  <p className="text-gray-600 text-sm">{postsErrorObj?.message || "알 수 없는 오류가 발생했습니다."}</p>
                  <Button onClick={() => window.location.reload()}>새로고침</Button>
                </div>
              );
            }

            return (
              <PostsTable
                posts={posts}
                searchQuery={searchQuery}
                selectedTag={urlParams.tag}
                onTagSelect={handleTagChange}
                onPostDetail={handlePostDetail}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                onUserClick={handleUserClick}
              />
            );
          })()}

          {/* 페이지네이션 */}
          <PaginationControls
            skip={urlParams.skip}
            limit={urlParams.limit}
            total={postsTotal}
            onLimitChange={(newLimit) => updateURL({ limit: newLimit, skip: 0 })}
            onPrevious={() => updateURL({ skip: Math.max(0, urlParams.skip - urlParams.limit) })}
            onNext={() => updateURL({ skip: urlParams.skip + urlParams.limit })}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        open={addPostFeature.open}
        onOpenChange={addPostFeature.setOpen}
        formData={addPostFeature.formData}
        onFormChange={addPostFeature.setFormData}
        onSubmit={handleAddPostSubmit}
      />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog
        open={editPostFeature.open}
        onOpenChange={editPostFeature.setOpen}
        post={editPostFeature.selectedPost}
        onPostChange={editPostFeature.setSelectedPost}
        onSubmit={handleEditPostSubmit}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        open={addCommentFeature.open}
        onOpenChange={addCommentFeature.setOpen}
        comment={addCommentFeature.formData}
        onCommentChange={addCommentFeature.setFormData}
        onSubmit={handleAddCommentSubmit}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        open={editCommentFeature.open}
        onOpenChange={editCommentFeature.setOpen}
        comment={editCommentFeature.selectedComment}
        onCommentChange={editCommentFeature.setSelectedComment}
        onSubmit={handleEditCommentSubmit}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailModal
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={comments}
        commentsLoading={commentsLoading}
        commentsError={commentsError}
        searchQuery={searchQuery}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLikeComment}
      />

      {/* 사용자 모달 */}
      <UserModal
        open={showUserModal}
        onOpenChange={setShowUserModal}
        user={selectedUser}
        userLoading={userLoading}
        userError={userError}
      />
    </Card>
  );
};
