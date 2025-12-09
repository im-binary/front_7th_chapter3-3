import type { User } from "../../user";

// Post Entity Types
export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
  author?: User;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface NewPost {
  title: string;
  body: string;
  userId: number;
}
