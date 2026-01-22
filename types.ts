
export type PostType = 'image' | 'video';

export interface Post {
  id: string;
  type: PostType;
  url: string;
  username: string;
  avatar: string;
  caption: string;
  likes: number;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  bio: string;
}

export enum View {
  FEED = 'FEED',
  DISCOVER = 'DISCOVER',
  CREATE = 'CREATE',
  BUDDY = 'BUDDY',
  PROFILE = 'PROFILE'
}
