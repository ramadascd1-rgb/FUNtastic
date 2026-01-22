
import React from 'react';
import PostItem from './PostItem';
import { Post } from '../types';

interface FeedProps {
  posts: Post[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  return (
    <div className="pb-4">
      {/* Stories Bar */}
      <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar border-b border-zinc-900 mb-2">
        <StoryCircle label="You" img="https://picsum.photos/100/100?random=1" active={true} />
        <StoryCircle label="AI_Buddy" img="https://picsum.photos/100/100?random=2" />
        <StoryCircle label="GlobalFun" img="https://picsum.photos/100/100?random=3" />
        <StoryCircle label="Neo_Tech" img="https://picsum.photos/100/100?random=4" />
        <StoryCircle label="GamerGirl" img="https://picsum.photos/100/100?random=5" />
      </div>

      {posts.length > 0 ? (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center text-zinc-500">
          <p className="mb-4">No fun here yet! Go create some magic.</p>
        </div>
      )}
    </div>
  );
};

const StoryCircle = ({ label, img, active = false }: { label: string; img: string; active?: boolean }) => (
  <div className="flex flex-col items-center gap-1 shrink-0">
    <div className={`p-0.5 rounded-full ${active ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-zinc-800'}`}>
      <div className="p-0.5 rounded-full bg-black">
        <img src={img} alt={label} className="w-14 h-14 rounded-full object-cover" />
      </div>
    </div>
    <span className="text-[10px] text-zinc-400">{label}</span>
  </div>
);

export default Feed;
