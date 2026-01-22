
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { Post } from '../types';

interface CreateContentProps {
  onPostCreated: (post: Post) => void;
}

const CreateContent: React.FC<CreateContentProps> = ({ onPostCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState('');
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [hasSelectedVeoKey, setHasSelectedVeoKey] = useState(false);

  const checkVeoKey = async () => {
    if (contentType === 'video') {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        // Proceeding as instructed: assume success after call
        setHasSelectedVeoKey(true);
        return true;
      }
      setHasSelectedVeoKey(true);
      return true;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGenStatus('Warming up the pixels...');

    try {
      if (contentType === 'video') {
        await checkVeoKey();
      }

      const gemini = GeminiService.getInstance();
      let resultUrl = '';
      let caption = '';

      if (contentType === 'image') {
        resultUrl = await gemini.generateFunImage(prompt);
        caption = await gemini.suggestCaption(prompt);
      } else {
        resultUrl = await gemini.generateFunVideo(prompt, (msg) => setGenStatus(msg));
        caption = await gemini.suggestCaption(`Fun video about ${prompt}`);
      }

      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        type: contentType,
        url: resultUrl,
        username: 'AI_Creator',
        avatar: 'https://picsum.photos/200/200?random=ai',
        caption: caption,
        likes: 0,
        timestamp: new Date()
      };

      onPostCreated(newPost);
      setPrompt('');
    } catch (err) {
      console.error(err);
      alert('Content generation hit a snag. Try a different prompt!');
    } finally {
      setIsGenerating(false);
      setGenStatus('');
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-black mb-2 tracking-tighter">CREATE MAGIC</h2>
        <p className="text-zinc-400 text-sm mb-6">Describe your wildest idea and let Gemini build it.</p>

        <div className="flex bg-zinc-900 p-1 rounded-xl mb-6">
          <button
            onClick={() => setContentType('image')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${contentType === 'image' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500'}`}
          >
            Image
          </button>
          <button
            onClick={() => setContentType('video')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${contentType === 'video' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500'}`}
          >
            Video
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={contentType === 'image' ? "e.g. A neon blue cat surfing on a pizza slice..." : "e.g. A futuristic city where cars fly through neon rings..."}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 mb-6 min-h-[120px] resize-none"
        />

        <button
          disabled={isGenerating || !prompt.trim()}
          onClick={handleGenerate}
          className={`w-full py-4 rounded-full font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isGenerating || !prompt.trim() ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-xl shadow-purple-500/20'}`}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner />
              <span className="text-sm">{genStatus}</span>
            </>
          ) : (
            <>Generate FUNtastic {contentType === 'image' ? 'Image' : 'Video'}</>
          )}
        </button>

        {contentType === 'video' && !isGenerating && (
          <p className="mt-4 text-[10px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
            Powered by VEO 3.1 Fast <br/> 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline decoration-zinc-700">Billing Account Required</a>
          </p>
        )}
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default CreateContent;
