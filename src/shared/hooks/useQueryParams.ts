import { useLocation } from "react-router-dom";

/**
 * URL 쿼리 파라미터를 읽는 hook
 * 단일 책임: URL에서 값 읽기만 담당
 */
export const useQueryParams = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const get = (key: string, defaultValue = ""): string => {
    return queryParams.get(key) || defaultValue;
  };

  const getNumber = (key: string, defaultValue = 0): number => {
    const value = queryParams.get(key);
    return value ? parseInt(value, 10) : defaultValue;
  };

  return { get, getNumber, queryParams };
};
