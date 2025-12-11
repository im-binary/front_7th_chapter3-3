import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buildQueryString, parseQueryString } from "../../../shared/lib";
import { usePosts, useSearchPosts, usePostsByTag } from "../../../features/manage-posts";

// Types
import type { Post } from "../../../entities/post";

export const usePostsManagerViewModel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = useMemo(() => {
    const params = parseQueryString(location.search);
    return {
      skip: parseInt(params.skip || "0"),
      limit: parseInt(params.limit || "10"),
      search: params.search || "",
      sortBy: params.sortBy || "",
      sortOrder: params.sortOrder || "asc",
      tag: params.tag || "",
    };
  }, [location.search]);

  const [searchQuery, setSearchQuery] = useState(urlParams.search);

  // 모달 상태
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
    error: searchErrorObj,
  } = useSearchPosts(urlParams.search);

  const {
    data: tagData,
    isLoading: tagLoading,
    isError: tagError,
    error: tagErrorObj,
  } = usePostsByTag(urlParams.tag, urlParams.limit, urlParams.skip);

  const {
    data: defaultPostsData,
    isLoading: defaultLoading,
    isError: defaultError,
    error: defaultErrorObj,
  } = usePosts(urlParams.limit, urlParams.skip);

  const getActiveQueryResult = () => {
    // 1순위: 검색
    if (urlParams.search) {
      return {
        data: searchData,
        isLoading: searchLoading,
        isError: searchError,
        error: searchErrorObj,
      };
    }

    // 2순위: 태그 필터
    if (urlParams.tag && urlParams.tag !== "all") {
      return {
        data: tagData,
        isLoading: tagLoading,
        isError: tagError,
        error: tagErrorObj,
      };
    }

    // 3순위: 기본 목록
    return {
      data: defaultPostsData,
      isLoading: defaultLoading,
      isError: defaultError,
      error: defaultErrorObj,
    };
  };

  const {
    data: rawPostsData,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorObj,
  } = getActiveQueryResult();

  // 정렬 적용
  const posts = rawPostsData
    ? [...rawPostsData.posts].sort((a, b) => {
        if (!urlParams.sortBy) return 0;

        const aValue = a[urlParams.sortBy as keyof Post];
        const bValue = b[urlParams.sortBy as keyof Post];

        if (aValue === undefined || bValue === undefined) return 0;

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return urlParams.sortOrder === "desc" ? -comparison : comparison;
      })
    : [];

  const postsTotal = rawPostsData?.total || 0;

  // URL 업데이트 함수
  const updateURL = (updates: Record<string, string | number> = {}) => {
    const queryString = buildQueryString({
      skip: String(updates.skip ?? urlParams.skip),
      limit: String(updates.limit ?? urlParams.limit),
      search: (updates.search as string) ?? urlParams.search,
      sortBy: (updates.sortBy as string) ?? urlParams.sortBy,
      sortOrder: (updates.sortOrder as string) ?? urlParams.sortOrder,
      tag: (updates.tag as string) ?? urlParams.tag,
    });

    navigate(`?${queryString}`);
  };

  const handlePostDetail = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  const handleTagChange = (tag: string) => {
    updateURL({ tag, skip: 0 });
  };

  const handleSearch = () => {
    updateURL({ search: searchQuery, skip: 0 });
  };

  return {
    // URL & Search
    urlParams,
    searchQuery,
    setSearchQuery,
    updateURL,
    handleSearch,
    handleTagChange,

    // Posts Data
    posts,
    postsLoading,
    postsTotal,
    postsError,
    postsErrorObj,

    // 모달 상태
    showPostDetailDialog,
    setShowPostDetailDialog,
    showUserModal,
    setShowUserModal,
    selectedPost,
    handlePostDetail,
  };
};
