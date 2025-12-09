import { Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui";
import { usePostsManager } from "./model/usePostsManager";
import { PostsTable } from "./ui/PostsTable";
import { SearchFilters } from "./ui/SearchFilters";
import { Pagination } from "./ui/Pagination";
import { PostDetailDialog } from "./ui/PostDetailDialog";
import { UserModal } from "./ui/UserModal";
import { AddPostDialog } from "./ui/AddPostDialog";
import { EditPostDialog } from "./ui/EditPostDialog";
import { AddCommentDialog } from "./ui/AddCommentDialog";
import { EditCommentDialog } from "./ui/EditCommentDialog";

const PostsManager = () => {
  const {
    // 상태
    posts,
    total,
    skip,
    limit,
    searchQuery,
    selectedPost,
    sortBy,
    sortOrder,
    loading,
    tags,
    selectedTag,
    comments,
    selectedComment,
    selectedUser,
    newPost,
    newComment,
    // Dialog 상태
    showAddDialog,
    showEditDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,
    // 상태 업데이트 함수
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedPost,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    setNewPost,
    setNewComment,
    setSelectedComment,
    setShowAddDialog,
    setShowEditDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setShowUserModal,
    // 액션 함수
    searchPosts,
    fetchPostsByTag,
    addPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    openPostDetail,
    openUserModal,
    updateURL,
  } = usePostsManager();

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
            onSearch={searchPosts}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tags={tags}
            onTagChange={(tag) => {
              fetchPostsByTag(tag);
              updateURL();
            }}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagClick={(tag) => {
                setSelectedTag(tag);
                updateURL();
              }}
              onPostDetail={openPostDetail}
              onEditPost={(post) => {
                setSelectedPost(post);
                setShowEditDialog(true);
              }}
              onDeletePost={deletePost}
              onUserClick={openUserModal}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination skip={skip} limit={limit} total={total} setSkip={setSkip} setLimit={setLimit} />
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
        post={selectedPost}
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
        onAddComment={(postId) => {
          setNewComment((prev) => ({ ...prev, postId }));
          setShowAddCommentDialog(true);
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment);
          setShowEditCommentDialog(true);
        }}
        onDeleteComment={deleteComment}
        onLikeComment={likeComment}
      />

      {/* 사용자 모달 */}
      <UserModal showUserModal={showUserModal} setShowUserModal={setShowUserModal} selectedUser={selectedUser} />
    </Card>
  );
};

export default PostsManager;
