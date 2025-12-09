import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface UsePaginationProps {
  total: number;
  onPageChange?: (skip: number, limit: number) => void;
}

export const usePagination = ({ total, onPageChange }: UsePaginationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // URL에서 초기값 로드
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));

  // 총 페이지 수 계산
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  // 페이지 변경
  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit;
    setSkip(newSkip);
    onPageChange?.(newSkip, limit);
  };

  // limit 변경
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setSkip(0); // limit 변경 시 첫 페이지로
    onPageChange?.(0, newLimit);
  };

  // URL 업데이트
  const updateURL = () => {
    const params = new URLSearchParams(location.search);

    if (skip) {
      params.set("skip", skip.toString());
    } else {
      params.delete("skip");
    }

    if (limit) {
      params.set("limit", limit.toString());
    } else {
      params.delete("limit");
    }

    navigate(`?${params.toString()}`);
  };

  // skip이나 limit이 변경되면 URL 업데이트
  useEffect(() => {
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit]);

  return {
    skip,
    limit,
    totalPages,
    currentPage,
    handlePageChange,
    handleLimitChange,
  };
};
