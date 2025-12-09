import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface UseSearchFiltersProps {
  onSearchChange?: (query: string) => void;
  onTagChange?: (tag: string) => void;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
}

export const useSearchFilters = (props?: UseSearchFiltersProps) => {
  const { onSearchChange, onTagChange, onSortChange } = props || {};
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // URL에서 초기값 로드
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");

  // 검색 실행
  const handleSearch = () => {
    onSearchChange?.(searchQuery);
    updateURL();
  };

  // 태그 변경
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    onTagChange?.(tag);
  };

  // 정렬 변경
  const handleSortChange = (by: string, order: string) => {
    setSortBy(by);
    setSortOrder(order);
    onSortChange?.(by, order);
  };

  // URL 업데이트
  const updateURL = () => {
    const params = new URLSearchParams(location.search);

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    if (selectedTag) {
      params.set("tag", selectedTag);
    } else {
      params.delete("tag");
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    if (sortOrder) {
      params.set("sortOrder", sortOrder);
    } else {
      params.delete("sortOrder");
    }

    navigate(`?${params.toString()}`);
  };

  // 태그나 정렬이 변경되면 URL 업데이트
  useEffect(() => {
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, sortBy, sortOrder]);

  return {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleSearch,
    handleTagChange,
    handleSortChange,
  };
};
