import { RouterProvider } from "./providers/RouterProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { ErrorBoundary } from "../shared/ui";
import Header from "../shared/ui/Header";
import Footer from "../shared/ui/Footer";
import { PostsManagerPage } from "../pages/posts-manager";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

export const App = () => {
  return (
    <QueryProvider>
      <RouterProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary onReset={reset}>
                  <PostsManagerPage />
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </main>
          <Footer />
        </div>
      </RouterProvider>
    </QueryProvider>
  );
};
