import { useState, useEffect } from "react";
import { usePostsQuery, usePostsMutation, usePostsSort, type Post } from "../../../entities/post";
import { useCommentsQuery, useCommentsMutation, type Comment } from "../../../entities/comment";
import { usersApi, type User } from "../../../entities/user";
import { tagsApi, type Tag } from "../../../entities/tag";
import { useAddPostFeature } from "../../../features/add-post";
import { useEditPostFeature } from "../../../features/edit-post";
import { useAddCommentFeature } from "../../../features/add-comment";
import { useEditCommentFeature } from "../../../features/edit-comment";
import { useSearchFilters } from "../../../widgets/search-filters";
import { usePagination } from "../../../widgets/pagination";

/**
 * 게시물 관리 페이지 코디네이션 훅
 *
 * 책임:
 * - 모든 원자 훅들을 조합
 * - 페이지 레벨 상태 관리
 * - 위젯/피처 간 데이터 흐름 제어
 */
export const usePostsPage = () => {
  // === Local State ===
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  // === Widgets ===
  const searchFilters = useSearchFilters({
    onSearchChange: () => {}, // 검색은 postsQuery에서 처리
    onTagChange: () => {}, // 태그 변경은 postsQuery에서 처리
    onSortChange: () => {}, // 정렬은 postsSort에서 처리
  });

  const pagination = usePagination({
    total: 0, // postsQuery에서 업데이트
    onPageChange: () => {}, // 페이지 변경은 postsQuery에서 처리
  });

  // === Entities - Posts ===
  const postsQuery = usePostsQuery({
    limit: pagination.limit,
    skip: pagination.skip,
  });

  const postsMutation = usePostsMutation(posts, setPosts);

  usePostsSort({
    posts,
    setPosts,
    sortBy: searchFilters.sortBy,
    sortOrder: searchFilters.sortOrder,
  });

  // === Entities - Comments ===
  const commentsQuery = useCommentsQuery();
  const commentsMutation = useCommentsMutation(comments, setComments);

  // === Features - Posts ===
  const addPostFeature = useAddPostFeature();

  const editPostFeature = useEditPostFeature({
    onSuccess: (updatedPost: Post) => {
      postsMutation.updatePost(updatedPost);
    },
  });

  // === Features - Comments ===
  const addCommentFeature = useAddCommentFeature({
    onSuccess: (newComment: Comment) => {
      commentsMutation.addComment(newComment);
    },
  });

  const editCommentFeature = useEditCommentFeature({
    onSuccess: (updatedComment: Comment) => {
      commentsMutation.updateComment(updatedComment);
    },
  });

  // === Sync postsQuery data to local state ===
  useEffect(() => {
    if (postsQuery.posts.length > 0) {
      setPosts(postsQuery.posts);
    }
  }, [postsQuery.posts]);

  // === Sync commentsQuery data to local state ===
  useEffect(() => {
    setComments(commentsQuery.comments);
  }, [commentsQuery.comments]);

  // === Search & Filter Effects ===
  useEffect(() => {
    if (searchFilters.searchQuery) {
      postsQuery.searchPosts(searchFilters.searchQuery);
    } else if (searchFilters.selectedTag !== "all") {
      postsQuery.fetchPostsByTag(searchFilters.selectedTag);
    } else {
      postsQuery.fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.skip, pagination.limit, searchFilters.searchQuery, searchFilters.selectedTag]);

  // === Page Actions ===
  const openPostDetail = (post: Post): void => {
    setSelectedPost(post);
    commentsQuery.fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  const openUserModal = async (user: User): Promise<void> => {
    try {
      const userData = await usersApi.getUser(user.id);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

  const deletePost = async (id: number) => {
    postsMutation.deletePost(id);
  };

  const deleteComment = (id: number, postId: number) => {
    commentsMutation.deleteComment(id, postId);
  };

  const likeComment = (id: number, postId: number) => {
    commentsMutation.likeComment(id, postId);
  };

  // === Initial Load ===
  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await tagsApi.getTags();
        setTags(data);
      } catch (error) {
        console.error("태그 가져오기 오류:", error);
      }
    };
    loadTags();
  }, []);

  // === Public API ===
  return {
    // Posts 데이터
    posts,
    total: postsQuery.total,
    loading: postsQuery.loading,

    // Search & Filters
    searchQuery: searchFilters.searchQuery,
    setSearchQuery: searchFilters.setSearchQuery,
    handleSearch: searchFilters.handleSearch,
    selectedTag: searchFilters.selectedTag,
    handleTagChange: searchFilters.handleTagChange,
    sortBy: searchFilters.sortBy,
    sortOrder: searchFilters.sortOrder,
    handleSortChange: searchFilters.handleSortChange,
    tags,

    // Pagination
    skip: pagination.skip,
    limit: pagination.limit,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    handlePageChange: pagination.handlePageChange,
    handleLimitChange: pagination.handleLimitChange,

    // Comments
    comments,
    fetchComments: commentsQuery.fetchComments,

    // Add Post Feature
    showAddDialog: addPostFeature.open,
    setShowAddDialog: addPostFeature.setOpen,
    newPost: addPostFeature.formData,
    setNewPost: addPostFeature.setFormData,
    addPost: () => addPostFeature.handleSubmit((post) => postsMutation.addPost(post)),

    // Edit Post Feature
    showEditDialog: editPostFeature.isOpen,
    setShowEditDialog: (open: boolean) => (open ? {} : editPostFeature.closeDialog()),
    selectedPostForEdit: selectedPost,
    setSelectedPost,
    openEditPost: (post: Post) => {
      setSelectedPost(post);
      editPostFeature.openEditDialog(post);
    },
    updatePost: () => {
      if (selectedPost) {
        editPostFeature.handleSubmit(selectedPost.id);
      }
    },

    // Delete Post
    deletePost,

    // Add Comment Feature
    showAddCommentDialog: addCommentFeature.isOpen,
    setShowAddCommentDialog: (open: boolean) =>
      open ? addCommentFeature.openAddDialog() : addCommentFeature.closeDialog(),
    newComment: {
      body: addCommentFeature.formData.body,
      postId: selectedPost?.id || null,
      userId: addCommentFeature.formData.userId,
    },
    setNewComment: (data: { body: string; userId: number; postId: number | null }) => {
      addCommentFeature.updateField("body", data.body);
      addCommentFeature.updateField("userId", data.userId);
    },
    openAddComment: addCommentFeature.openAddDialog,
    addComment: () => {
      if (selectedPost) {
        addCommentFeature.handleSubmit(selectedPost.id);
      }
    },

    // Edit Comment Feature
    showEditCommentDialog: editCommentFeature.isOpen,
    setShowEditCommentDialog: (open: boolean) => (open ? {} : editCommentFeature.closeDialog()),
    selectedComment,
    setSelectedComment,
    openEditComment: (comment: Comment) => {
      setSelectedComment(comment);
      editCommentFeature.openEditDialog(comment);
    },
    updateComment: () => {
      if (selectedComment) {
        editCommentFeature.handleSubmit(selectedComment.id);
      }
    },

    // Delete & Like Comment
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
  };
};
