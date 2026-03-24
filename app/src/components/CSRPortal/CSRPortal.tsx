import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'qwen3.5:35b';

const SYSTEM_PROMPT = `You are Eburon Sarah, a professional customer service representative for Eburon Edge Voice, a local-first voice synthesis studio. You are helpful, empathetic, and knowledgeable about voice AI technology.

Key traits:
- Professional but friendly tone
- Patient and understanding
- Knowledgeable about voice cloning, TTS, and STT technology
- Always helpful and solution-oriented
- Keep responses concise but informative

You have access to Eburon Edge Voice models including:
- Athena (flagship multilingual synthesis)
- Iris (compact multilingual)
- Hestia (fast English)
- Hera (broad multilingual coverage)
- Nike (fast expressive English)
- Artemis (long-form coherent speech)
- Gaia (highest-capacity long-form)
- Orbit (transcription models)

Current date: ${new Date().toLocaleDateString()}`;

export function CSRPortal() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('eburon-hera');
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check Ollama connection
  useEffect(() => {
    const checkOllamaConnection = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
          setOllamaConnected(true);
          setError(null);
        } else {
          setOllamaConnected(false);
          setError('Ollama not connected');
        }
      } catch {
        setOllamaConnected(false);
        setError('Cannot connect to Ollama');
      }
    };
    checkOllamaConnection();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const generateSpeech = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await apiClient.generateSpeech({
        text,
        profile_id: selectedVoice,
        model: 'eburon-athena',
        voice_cloning: false,
        enhance: true,
      });

      // Play the generated audio
      if (response.audio_url) {
        const audio = new Audio(response.audio_url);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  }, [selectedVoice]);

  const sendToOllama = useCallback(async (userMessage: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsGenerating(true);
    setError(null);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const conversationHistory = messages
        .slice(-10)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');

      const prompt = `${SYSTEM_PROMPT}\n\nConversation:\n${conversationHistory}\nuser: ${userMessage}\nassistant:`;

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 512,
          },
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Generate speech for response
      await generateSpeech(data.response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Ollama error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response from LLM');
    } finally {
      setIsGenerating(false);
    }
  }, [messages, generateSpeech]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputText.trim() && !isGenerating) {
        sendToOllama(inputText.trim());
        setInputText('');
      }
    },
    [inputText, isGenerating, sendToOllama]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold">CSR Agent</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span className="text-xs text-muted-foreground font-mono">
                Ollama: {ollamaConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-carbon border border-white/10 text-xs px-2 py-1 font-mono text-bronze"
            >
              <option value="eburon-hera">Eburon Hera</option>
              <option value="eburon-athena">Eburon Athena</option>
              <option value="eburon-hestia">Eburon Hestia</option>
              <option value="eburon-nike">Eburon Nike</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-powered customer service agent using local Ollama LLM with Eburon Edge Voice synthesis
        </p>
      </div>

      {/* Status Bar */}
      <div className="shrink-0 py-2 px-1 flex items-center gap-4 text-[10px] font-mono text-white/40 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
          <span>{isListening ? 'Listening...' : 'Ready'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-bronze animate-pulse' : 'bg-white/20'}`} />
          <span>{isSpeaking ? 'Speaking...' : 'Silent'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
          <span>{isGenerating ? 'Generating...' : 'Idle'}</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="shrink-0 px-1 py-2">
          <div className="bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400 font-mono">
            {error}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <div className="max-w-md">
              <div className="w-16 h-16 border border-bronze/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎧</span>
              </div>
              <h3 className="text-white font-medium mb-2">Eburon Sarah</h3>
              <p className="text-xs text-muted-foreground">
                Hi! I'm your AI customer service assistant. I can help with questions about Eburon Edge Voice, 
                voice cloning, TTS models, and more. Click the microphone to speak or type your question below.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 ${
                msg.role === 'user'
                  ? 'bg-bronze/10 border border-bronze/30'
                  : 'bg-carbon/50 border border-white/10'
              }`}
            >
              <div className="text-[9px] font-mono text-white/40 uppercase mb-1">
                {msg.role === 'user' ? 'You' : 'Eburon Sarah'} • {msg.timestamp.toLocaleTimeString()}
              </div>
              <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-carbon/50 border border-white/10 p-4 max-w-[80%]">
              <div className="text-[9px] font-mono text-white/40 uppercase mb-1">Eburon Sarah</div>
              <div className="flex items-center gap-2 text-bronze">
                <div className="w-2 h-2 bg-bronze rounded-full animate-pulse" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 border-t border-white/5 bg-carbon/30">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'border border-white/20 text-white/60 hover:text-white hover:border-white/40'
            }`}
            disabled={isGenerating}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>Microphone</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or click microphone to speak..."
            className="flex-1 bg-black border border-white/10 px-4 text-sm text-white outline-none focus:border-bronze/50 transition-colors"
            disabled={isGenerating}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="px-6 py-3 bg-white text-obsidian font-mono text-xs font-bold uppercase tracking-widest hover:bg-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Sending...' : 'Send'}
          </button>

          <button
            type="button"
            onClick={clearChat}
            className="px-4 py-3 border border-white/10 text-white/40 font-mono text-xs hover:text-white hover:border-white/30 transition-colors"
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  );
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}