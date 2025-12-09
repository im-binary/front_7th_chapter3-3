// Post Types
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

// Comment Types
export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

export interface NewComment {
  body: string;
  postId: number | null;
  userId: number;
}

// User Types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  image: string;
  address?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  company?: {
    name: string;
    title: string;
    department: string;
  };
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// Tag Types
export interface Tag {
  slug: string;
  name: string;
  url: string;
}
