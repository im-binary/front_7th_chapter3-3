import { usePostsManagerViewModel } from "./model/usePostsManagerViewModel";
import { PostsManagerView } from "./ui/PostsManagerView";

const PostsManagerPage = () => {
  const viewModel = usePostsManagerViewModel();

  return <PostsManagerView viewModel={viewModel} />;
};

export default PostsManagerPage;
