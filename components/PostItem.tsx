
import React, { useState } from 'react';
import { Post } from '../types';

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="mb-8 border-b border-zinc-900 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Post Header */}
      <div className="flex items-center p-3 gap-3">
        <img src={post.avatar} alt={post.username} className="w-8 h-8 rounded-full object-cover border border-zinc-800" />
        <span className="font-bold text-sm tracking-tight">{post.username}</span>
      </div>

      {/* Post Content */}
      <div className="relative aspect-square bg-zinc-900">
        {post.type === 'image' ? (
          <img src={post.url} alt={post.caption} className="w-full h-full object-cover" />
        ) : (
          <video src={post.url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex gap-4 mb-2">
          <button onClick={() => setLiked(!liked)} className={`${liked ? 'text-red-500' : 'text-white'}`}>
            <HeartIcon filled={liked} />
          </button>
          <button><MessageIcon /></button>
          <button><ShareIcon /></button>
        </div>
        <p className="font-bold text-sm mb-1">{post.likes + (liked ? 1 : 0)} likes</p>
        <p className="text-sm">
          <span className="font-bold mr-2">{post.username}</span>
          {post.caption}
        </p>
      </div>
    </div>
  );
};

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

export default PostItem;
