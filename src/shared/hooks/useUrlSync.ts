import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface UrlSyncParams {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * URL 쿼리 파라미터와 상태를 동기화하는 hook
 * 단일 책임: URL 동기화만 담당
 */
export const useUrlSync = (params: UrlSyncParams, deps: unknown[] = []) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.set(key, String(value));
      } else {
        searchParams.delete(key);
      }
    });

    const newSearch = searchParams.toString();
    const currentSearch = location.search.replace("?", "");

    if (newSearch !== currentSearch) {
      navigate(`?${newSearch}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
