import { Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui";
import { usePostsPage } from "./model/usePostsPage";
import { PostsTable } from "./ui/PostsTable";
import { SearchFilters } from "../../widgets/search-filters";
import { Pagination } from "../../widgets/pagination";
import { PostDetailDialog } from "./ui/PostDetailDialog";
import { UserModal } from "./ui/UserModal";
import { AddPostDialog } from "./ui/AddPostDialog";
import { EditPostDialog } from "./ui/EditPostDialog";
import { AddCommentDialog } from "./ui/AddCommentDialog";
import { EditCommentDialog } from "./ui/EditCommentDialog";

const PostsManager = () => {
  const {
    // Posts 데이터
    posts,
    total,
    loading,

    // Search & Filters
    searchQuery,
    setSearchQuery,
    handleSearch,
    selectedTag,
    handleTagChange,
    sortBy,
    sortOrder,
    handleSortChange,
    tags,

    // Pagination
    skip,
    limit,
    handlePageChange,
    handleLimitChange,

    // Comments
    comments, // Add Post Feature
    showAddDialog,
    setShowAddDialog,
    newPost,
    setNewPost,
    addPost,

    // Edit Post Feature
    showEditDialog,
    setShowEditDialog,
    selectedPostForEdit,
    setSelectedPost,
    openEditPost,
    updatePost,
    deletePost,

    // Add Comment Feature
    showAddCommentDialog,
    setShowAddCommentDialog,
    newComment,
    setNewComment,
    openAddComment,
    addComment,

    // Edit Comment Feature
    showEditCommentDialog,
    setShowEditCommentDialog,
    selectedComment,
    setSelectedComment,
    openEditComment,
    updateComment,
    deleteComment,
    likeComment,

    // Post Detail & User Modal
    selectedPost,
    openPostDetail,
    showPostDetailDialog,
    setShowPostDetailDialog,
    selectedUser,
    openUserModal,
    showUserModal,
    setShowUserModal,
  } = usePostsPage();

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
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
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            selectedTag={selectedTag}
            setSelectedTag={handleTagChange}
            tags={tags}
            onTagChange={handleTagChange}
            sortBy={sortBy}
            setSortBy={(value) => handleSortChange(value, sortOrder)}
            sortOrder={sortOrder}
            setSortOrder={(value) => handleSortChange(sortBy, value)}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagClick={handleTagChange}
              onPostDetail={openPostDetail}
              onEditPost={openEditPost}
              onDeletePost={deletePost}
              onUserClick={openUserModal}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            skip={skip}
            limit={limit}
            total={total}
            setSkip={(value) => handlePageChange(Math.floor(value / limit) + 1)}
            setLimit={handleLimitChange}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        post={newPost}
        onPostChange={setNewPost}
        onSubmit={addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={selectedPostForEdit}
        onPostChange={setSelectedPost}
        onSubmit={updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        comment={newComment}
        onCommentChange={setNewComment}
        onSubmit={addComment}
      />
      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onCommentChange={setSelectedComment}
        onSubmit={updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
        comments={comments}
        onAddComment={openAddComment}
        onEditComment={openEditComment}
        onDeleteComment={deleteComment}
        onLikeComment={likeComment}
      />

      {/* 사용자 모달 */}
      <UserModal showUserModal={showUserModal} setShowUserModal={setShowUserModal} selectedUser={selectedUser} />
    </Card>
  );
};

export default PostsManager;
