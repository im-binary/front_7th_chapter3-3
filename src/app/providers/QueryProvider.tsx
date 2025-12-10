import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터 신선도: 1분 (기본값)
      // - 1분 동안은 캐시된 데이터를 그대로 사용
      // - 1분 후부터는 백그라운드에서 자동 재조회
      staleTime: 1000 * 60,

      // 가비지 컬렉션: 5분
      // - 사용하지 않는 캐시는 5분 후 메모리에서 제거
      // - staleTime(1분) < gcTime(5분) 관계 유지
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1,
      // 재시도 지연: 지수 백오프 (기본값)
      // - 1차: 1초, 2차: 2초, 3차: 4초...
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
};
