import { createContext, useContext, ReactNode } from "react";
import { useComments } from "../../features/manage-comments";

type CommentsContextType = ReturnType<typeof useComments>;

const CommentsContext = createContext<CommentsContextType | null>(null);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const commentsState = useComments();

  return <CommentsContext.Provider value={commentsState}>{children}</CommentsContext.Provider>;
};

export const useCommentsContext = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useCommentsContext must be used within CommentsProvider");
  }
  return context;
};
