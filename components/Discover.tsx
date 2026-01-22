
import React from 'react';

const Discover: React.FC = () => {
  const categories = ['Tech', 'Design', 'Space', 'Retro', 'Futurism', 'Comedy'];
  
  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Explore FUNtastic world..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <SearchIcon className="absolute left-4 top-3.5 text-zinc-500 w-5 h-5" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {categories.map(cat => (
          <button key={cat} className="px-4 py-1.5 bg-zinc-900 rounded-full text-xs font-semibold border border-zinc-800 hover:border-zinc-600">
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`bg-zinc-900 relative aspect-square overflow-hidden rounded-sm transition-transform active:scale-95`}>
            <img 
              src={`https://picsum.photos/400/400?random=${i + 100}`} 
              alt="Discover item" 
              className="w-full h-full object-cover opacity-80 hover:opacity-100"
            />
            {i % 4 === 0 && (
              <div className="absolute top-2 right-2 text-white">
                <PlayIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default Discover;
