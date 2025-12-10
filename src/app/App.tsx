import { RouterProvider } from "./providers/RouterProvider";
import { PostsProvider } from "./providers/PostsProvider";
import { CommentsProvider } from "./providers/CommentsProvider";
import Header from "../shared/ui/Header";
import Footer from "../shared/ui/Footer";
import { PostsManagerPage } from "../pages/posts-manager";

export const App = () => {
  return (
    <RouterProvider>
      <PostsProvider>
        <CommentsProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <PostsManagerPage />
            </main>
            <Footer />
          </div>
        </CommentsProvider>
      </PostsProvider>
    </RouterProvider>
  );
};
