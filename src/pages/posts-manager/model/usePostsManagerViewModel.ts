import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buildQueryString, parseQueryString } from "../../../shared/lib";

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

  // 검색 쿼리는 controlled input을 위해 별도 상태 필요
  const [searchQuery, setSearchQuery] = useState(urlParams.search);

  // 모달 상태
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  // 핸들러 함수들
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

    // 모달 상태
    showPostDetailDialog,
    setShowPostDetailDialog,
    showUserModal,
    setShowUserModal,
    selectedPost,
    handlePostDetail,
  };
};
