import { usePostsManagerViewModel } from "./model/usePostsManagerViewModel";
import { PostsManagerView } from "./ui/PostsManagerView";

/**
 * PostsManager Page
 * ViewModel과 View를 연결하는 역할만 수행합니다.
 */
const PostsManagerPage = () => {
  const viewModel = usePostsManagerViewModel();

  return <PostsManagerView viewModel={viewModel} />;
};

export default PostsManagerPage;
