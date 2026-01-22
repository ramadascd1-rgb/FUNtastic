
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData, encode } from '../utils/audioUtils';

const AIBuddy: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to hang out?');
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    try {
      setStatus('Connecting to Buddy...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Buddy is listening!');
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio handling
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const { output: ctx } = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Transcription handling
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => [...prev.slice(-4), `Buddy: ${text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscription(prev => [...prev.slice(-4), `You: ${text}`]);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setStatus('Oops, Buddy got disconnected.');
            setIsActive(false);
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Buddy had to go.');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are FUNtastic Buddy, a high-energy, friendly AI living in a social media app. Keep responses short, fun, and full of personality. Use emojis. If the user sounds bored, suggest something fun!',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Could not start Buddy.');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('Ready to hang out?');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-b from-indigo-900 via-black to-black">
      <div className="relative mb-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-500 to-yellow-500 ${isActive ? 'animate-pulse scale-110' : ''}`}>
          <div className="w-28 h-28 rounded-full bg-black flex items-center justify-center overflow-hidden">
            <SparklesIcon className={`w-12 h-12 text-white ${isActive ? 'animate-bounce' : ''}`} />
          </div>
        </div>
        {isActive && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
            LIVE
          </div>
        )}
      </div>

      <h2 className="text-2xl font-black mb-2 tracking-tight">AI Buddy</h2>
      <p className="text-zinc-400 mb-8 max-w-xs">{status}</p>

      {isActive && (
        <div className="w-full mb-8 space-y-2 text-left bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm min-h-[120px]">
          {transcription.map((line, i) => (
            <p key={i} className={`text-sm ${line.startsWith('You:') ? 'text-zinc-400' : 'text-pink-400 font-medium'}`}>
              {line}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={isActive ? stopSession : startSession}
        className={`px-12 py-4 rounded-full font-bold transition-all duration-300 transform active:scale-95 ${isActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg shadow-pink-500/25'}`}
      >
        {isActive ? 'Stop Chatting' : 'Hang Out with Buddy'}
      </button>

      {!isActive && (
        <p className="mt-8 text-xs text-zinc-500">Buddy needs microphone access to talk!</p>
      )}
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707" />
  </svg>
);

export default AIBuddy;
