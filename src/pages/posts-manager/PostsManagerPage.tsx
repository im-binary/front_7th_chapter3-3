import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui";
import { buildQueryString } from "../../shared/lib";

// Features
import { useAddPost, AddPostDialog } from "../../features/add-post";
import { useEditPost, EditPostDialog } from "../../features/edit-post";
import { useAddComment, AddCommentDialog } from "../../features/add-comment";
import { useEditComment, EditCommentDialog } from "../../features/edit-comment";
import { usePosts } from "../../features/manage-posts";
import { useComments } from "../../features/manage-comments";
import { useTags } from "../../features/manage-tags";
import { useUserDetail } from "../../features/view-user-detail";

// Widgets
import { SearchFilters } from "../../widgets/search-filters";
import { PostsTable } from "../../widgets/posts-table";
import { PaginationControls } from "../../widgets/pagination-controls";
import { PostDetailModal } from "../../widgets/post-detail-modal";
import { UserModal } from "../../widgets/user-modal";

// Types
import type { Post } from "../../entities/post";
import type { Comment } from "../../entities/comment";

const PostsManagerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // URL 상태
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");

  // 모달 상태
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Features hooks
  const { posts, total, loading, fetchPosts, searchPosts, fetchPostsByTag, deletePost, setPosts } = usePosts();
  const { comments, fetchComments, deleteComment, likeComment, setComments } = useComments();
  const { tags } = useTags();
  const { selectedUser, fetchUser } = useUserDetail();

  // Add Post
  const addPostFeature = useAddPost();

  // Edit Post
  const editPostFeature = useEditPost();

  // Add Comment
  const addCommentFeature = useAddComment();

  // Edit Comment
  const editCommentFeature = useEditComment();

  // URL 업데이트 함수
  const updateURL = () => {
    const queryString = buildQueryString({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      sortOrder,
      tag: selectedTag,
    });

    navigate(`?${queryString}`);
  };

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (userId: number) => {
    await fetchUser(userId);
    setShowUserModal(true);
  };

  // 게시물 수정
  const handleEditPost = (post: Post) => {
    editPostFeature.setSelectedPost(post);
    editPostFeature.setOpen(true);
  };

  // 게시물 업데이트 완료
  const handleUpdatePost = async () => {
    await editPostFeature.handleSubmit((updatedPost) => {
      setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    });
  };

  // 게시물 추가 완료
  const handleAddPost = async () => {
    await addPostFeature.handleSubmit((newPost) => {
      setPosts([newPost, ...posts]);
    });
  };

  // 댓글 추가
  const handleOpenAddComment = (postId: number) => {
    addCommentFeature.setFormData({ ...addCommentFeature.formData, postId });
    addCommentFeature.setOpen(true);
  };

  // 댓글 추가 완료
  const handleAddComment = async () => {
    await addCommentFeature.handleSubmit((newComment) => {
      setComments((prev) => ({
        ...prev,
        [newComment.postId]: [...(prev[newComment.postId] || []), newComment],
      }));
    });
  };

  // 댓글 수정
  const handleEditComment = (comment: Comment) => {
    editCommentFeature.setSelectedComment(comment);
    editCommentFeature.setOpen(true);
  };

  // 댓글 업데이트 완료
  const handleUpdateComment = async () => {
    await editCommentFeature.handleSubmit((updatedComment) => {
      setComments((prev) => ({
        ...prev,
        [updatedComment.postId]: prev[updatedComment.postId].map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment,
        ),
      }));
    });
  };

  // 태그 선택 핸들러
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    fetchPostsByTag(tag);
    updateURL();
  };

  // 검색 핸들러
  const handleSearch = () => {
    if (searchQuery) {
      searchPosts(searchQuery);
    } else {
      fetchPosts(limit, skip);
    }
  };

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts(limit, skip);
    }
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get("skip") || "0"));
    setLimit(parseInt(params.get("limit") || "10"));
    setSearchQuery(params.get("search") || "");
    setSortBy(params.get("sortBy") || "");
    setSortOrder(params.get("sortOrder") || "asc");
    setSelectedTag(params.get("tag") || "");
  }, [location.search]);

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
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearch}
            onTagChange={handleTagChange}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagSelect={handleTagChange}
              onPostDetail={openPostDetail}
              onEditPost={handleEditPost}
              onDeletePost={deletePost}
              onUserClick={openUserModal}
            />
          )}

          {/* 페이지네이션 */}
          <PaginationControls
            skip={skip}
            limit={limit}
            total={total}
            onLimitChange={setLimit}
            onPrevious={() => setSkip(Math.max(0, skip - limit))}
            onNext={() => setSkip(skip + limit)}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        open={addPostFeature.open}
        onOpenChange={addPostFeature.setOpen}
        formData={addPostFeature.formData}
        onFormChange={addPostFeature.setFormData}
        onSubmit={handleAddPost}
      />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog
        open={editPostFeature.open}
        onOpenChange={editPostFeature.setOpen}
        post={editPostFeature.selectedPost}
        onPostChange={editPostFeature.setSelectedPost}
        onSubmit={handleUpdatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        open={addCommentFeature.open}
        onOpenChange={addCommentFeature.setOpen}
        comment={addCommentFeature.formData}
        onCommentChange={addCommentFeature.setFormData}
        onSubmit={handleAddComment}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        open={editCommentFeature.open}
        onOpenChange={editCommentFeature.setOpen}
        comment={editCommentFeature.selectedComment}
        onCommentChange={editCommentFeature.setSelectedComment}
        onSubmit={handleUpdateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailModal
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={selectedPost ? comments[selectedPost.id] || [] : []}
        searchQuery={searchQuery}
        onAddComment={() => selectedPost && handleOpenAddComment(selectedPost.id)}
        onEditComment={handleEditComment}
        onDeleteComment={(commentId) => selectedPost && deleteComment(commentId, selectedPost.id)}
        onLikeComment={(commentId) => selectedPost && likeComment(commentId, selectedPost.id)}
      />

      {/* 사용자 모달 */}
      <UserModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  );
};

export default PostsManagerPage;
