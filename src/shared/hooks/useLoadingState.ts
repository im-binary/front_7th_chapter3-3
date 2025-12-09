import { useState } from "react";

/**
 * 로딩 상태를 관리하는 hook
 * 단일 책임: 로딩 상태만 담당
 */
export const useLoadingState = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
  };
};
