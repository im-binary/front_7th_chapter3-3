import { createContext, useContext, ReactNode } from "react";
import { usePosts } from "../../features/manage-posts";

type PostsContextType = ReturnType<typeof usePosts>;

const PostsContext = createContext<PostsContextType | null>(null);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const postsState = usePosts();

  return <PostsContext.Provider value={postsState}>{children}</PostsContext.Provider>;
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within PostsProvider");
  }
  return context;
};
