import { Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui";

// Features
import { useAddPost, AddPostDialog } from "../../../features/add-post";
import { useEditPost, EditPostDialog } from "../../../features/edit-post";
import { useAddComment, AddCommentDialog } from "../../../features/add-comment";
import { useEditComment, EditCommentDialog } from "../../../features/edit-comment";
import { usePostsContext } from "../../../app/providers/PostsProvider";
import { useCommentsContext } from "../../../app/providers/CommentsProvider";
import { useTags } from "../../../features/manage-tags";
import { useUserDetail } from "../../../features/view-user-detail";

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
    postsLoading,
    postsTotal,
  } = viewModel;

  const postsFeature = usePostsContext();
  const commentsFeature = useCommentsContext();
  const { tags } = useTags();
  const { selectedUser, fetchUser } = useUserDetail();
  const addPostFeature = useAddPost();
  const editPostFeature = useEditPost();
  const addCommentFeature = useAddComment();
  const editCommentFeature = useEditComment();

  // Feature를 사용하는 핸들러들
  const handleUserClick = async (userId: number) => {
    await fetchUser(userId);
    setShowUserModal(true);
  };

  const handleEditPost = (post: Post) => {
    editPostFeature.setSelectedPost(post);
    editPostFeature.setOpen(true);
  };

  const handleEditPostSubmit = async () => {
    if (!editPostFeature.selectedPost) return;
    await postsFeature.updatePost(editPostFeature.selectedPost.id, {
      title: editPostFeature.selectedPost.title,
      body: editPostFeature.selectedPost.body,
    });
    editPostFeature.setOpen(false);
  };

  const handleAddPostSubmit = async () => {
    await postsFeature.addPost(addPostFeature.formData);
    addPostFeature.setOpen(false);
    addPostFeature.setFormData({ title: "", body: "", userId: 1 });
  };

  const handleAddComment = () => {
    if (!selectedPost) return;
    addCommentFeature.setFormData({ ...addCommentFeature.formData, postId: selectedPost.id });
    addCommentFeature.setOpen(true);
  };

  const handleAddCommentSubmit = async () => {
    if (addCommentFeature.formData.postId === null) return;
    await commentsFeature.addComment({
      body: addCommentFeature.formData.body,
      postId: addCommentFeature.formData.postId,
      userId: addCommentFeature.formData.userId,
    });
    addCommentFeature.setOpen(false);
    addCommentFeature.setFormData({ body: "", postId: null, userId: 1 });
  };

  const handleEditComment = (comment: Comment) => {
    editCommentFeature.setSelectedComment(comment);
    editCommentFeature.setOpen(true);
  };

  const handleEditCommentSubmit = async () => {
    if (!editCommentFeature.selectedComment) return;
    await commentsFeature.updateComment(
      editCommentFeature.selectedComment.id,
      editCommentFeature.selectedComment.body,
      editCommentFeature.selectedComment.postId,
    );
    editCommentFeature.setOpen(false);
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
          {postsLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              searchQuery={searchQuery}
              selectedTag={urlParams.tag}
              onTagSelect={handleTagChange}
              onPostDetail={handlePostDetail}
              onEditPost={handleEditPost}
              onUserClick={handleUserClick}
            />
          )}

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
        searchQuery={searchQuery}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
      />

      {/* 사용자 모달 */}
      <UserModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  );
};
