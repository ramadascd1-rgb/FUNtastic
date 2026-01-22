
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Discover from './components/Discover';
import CreateContent from './components/CreateContent';
import AIBuddy from './components/AIBuddy';
import { Post, View } from './types';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://picsum.photos/1080/1080?random=10',
    username: 'cosmic_explorer',
    avatar: 'https://picsum.photos/200/200?random=11',
    caption: 'Lost in the digital ether. 🪐 #scifi #vibes',
    likes: 1242,
    timestamp: new Date()
  },
  {
    id: '2',
    type: 'image',
    url: 'https://picsum.photos/1080/1080?random=20',
    username: 'cyber_punk_art',
    avatar: 'https://picsum.photos/200/200?random=21',
    caption: 'Neon nights are the best nights. 🏮✨ #cyberpunk',
    likes: 893,
    timestamp: new Date()
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.FEED);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setCurrentView(View.FEED);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.FEED:
        return <Feed posts={posts} />;
      case View.DISCOVER:
        return <Discover />;
      case View.CREATE:
        return <CreateContent onPostCreated={handlePostCreated} />;
      case View.BUDDY:
        return <AIBuddy />;
      case View.PROFILE:
        return (
          <div className="flex flex-col items-center pt-12 p-8 text-center">
            <img src="https://picsum.photos/200/200?random=user" alt="Profile" className="w-24 h-24 rounded-full mb-4 border-2 border-pink-500 p-1" />
            <h2 className="text-xl font-bold">@FuntasticUser</h2>
            <p className="text-zinc-500 text-sm mb-6">Creating magic with AI since 2025 ✨</p>
            <div className="grid grid-cols-3 w-full gap-4 mb-8">
              <div><p className="font-bold text-lg">{posts.length}</p><p className="text-xs text-zinc-500">Posts</p></div>
              <div><p className="font-bold text-lg">1.2k</p><p className="text-xs text-zinc-500">Followers</p></div>
              <div><p className="font-bold text-lg">482</p><p className="text-xs text-zinc-500">Following</p></div>
            </div>
            <div className="grid grid-cols-3 gap-1 w-full">
              {posts.map(p => (
                <div key={p.id} className="aspect-square bg-zinc-900 overflow-hidden">
                  <img src={p.url} alt="Profile post" className="w-full h-full object-cover opacity-60" />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <Feed posts={posts} />;
    }
  };

  return (
    <Layout activeView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
