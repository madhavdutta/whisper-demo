import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const MOODS = [
  { emoji: '✨', label: 'Inspired', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)' },
  { emoji: '💭', label: 'Pensive', color: '#7b9fff', bg: 'rgba(123,159,255,0.15)', border: 'rgba(123,159,255,0.4)' },
  { emoji: '🔥', label: 'Passionate', color: '#ff6bcb', bg: 'rgba(255,107,203,0.15)', border: 'rgba(255,107,203,0.4)' },
  { emoji: '🌊', label: 'Calm', color: '#67e8f9', bg: 'rgba(103,232,249,0.15)', border: 'rgba(103,232,249,0.4)' },
  { emoji: '⚡', label: 'Energetic', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)' },
  { emoji: '🌙', label: 'Melancholic', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.4)' },
];

const FLOATS = ['animate-float-1','animate-float-2','animate-float-3','animate-float-4','animate-float-5'];
const FONT_SIZES = ['text-sm','text-base','text-lg','text-xl'];

function getStoredWhispers() {
  try {
    return JSON.parse(localStorage.getItem('whisper-vault') || '[]');
  } catch { return []; }
}

function storeWhispers(whispers) {
  localStorage.setItem('whisper-vault', JSON.stringify(whispers));
}

function seedPosition(i, total) {
  const cols = Math.ceil(Math.sqrt(total * 1.6));
  const col = i % cols;
  const row = Math.floor(i / cols);
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const padX = w * 0.08;
  const padY = h * 0.18;
  const usableW = w - padX * 2;
  const usableH = h - padY * 2;
  const cellW = usableW / Math.max(cols, 1);
  const cellH = usableH / Math.max(Math.ceil(total / cols), 1);
  const jitterX = (Math.random() - 0.5) * cellW * 0.5;
  const jitterY = (Math.random() - 0.5) * cellH * 0.5;
  return {
    x: padX + col * cellW + cellW / 2 + jitterX,
    y: padY + row * cellH + cellH / 2 + jitterY,
  };
}

function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function NebulaGradients() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent)',
          top: '10%', left: '5%',
          animation: 'float1 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-15"
        style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(123,159,255,0.4), transparent)',
          bottom: '15%', right: '10%',
          animation: 'float2 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-10"
        style={{
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(255,107,203,0.3), transparent)',
          top: '50%', left: '50%',
          animation: 'float3 22s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function WhisperCard({ whisper, index, total, onClick }) {
  const pos = useMemo(() => seedPosition(index, total), [index, total]);
  const float = FLOATS[index % FLOATS.length];
  const fontSize = FONT_SIZES[Math.min(index, FONT_SIZES.length - 1)];
  const mood = MOODS[whisper.mood] || MOODS[0];

  return (
    <button
      onClick={() => onClick(whisper)}
      className={`absolute cursor-pointer group transition-all duration-500 hover:z-50 ${float}`}
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        maxWidth: '220px',
        animationDelay: `${index * 0.15}s`,
      }}
    >
      <div
        className="relative rounded-2xl p-4 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse-glow"
        style={{
          background: mood.bg,
          border: `1px solid ${mood.border}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: `0 0 20px ${mood.color}15, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{mood.emoji}</span>
          <span
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: mood.color }}
          >
            {mood.label}
          </span>
        </div>
        <p
          className={`${fontSize} text-stardust/80 line-clamp-3 text-left leading-relaxed`}
        >
          {whisper.text.length > 120 ? whisper.text.slice(0, 120) + '...' : whisper.text}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-stardust/30">
            {new Date(whisper.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: mood.color, opacity: 0.6 }}
          />
        </div>
      </div>
    </button>
  );
}

function AddModal({ onClose, onAdd }) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({ text: text.trim(), mood });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      style={{ background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass-strong rounded-3xl p-8 w-full max-w-lg animate-modal-enter"
        style={{
          background: 'rgba(15,15,42,0.9)',
          border: '1px solid rgba(167,139,250,0.2)',
          boxShadow: '0 0 60px rgba(167,139,250,0.08), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-stardust">New Whisper</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stardust/40 hover:text-stardust hover:bg-white/5 transition-all"
          >
            ✕
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? This is a safe space..."
          rows={4}
          className="w-full rounded-2xl p-4 text-stardust placeholder-stardust/25 bg-white/5 border border-white/5 focus:border-nebula-purple/50 focus:outline-none transition-all resize-none text-base leading-relaxed"
          maxLength={500}
        />
        <div className="flex justify-end mt-2 mb-5">
          <span className="text-[11px] text-stardust/25">{text.length}/500</span>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-stardust/30 mb-3">Mood</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m, i) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setMood(i)}
                className="px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5"
                style={{
                  background: mood === i ? m.bg : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${mood === i ? m.border : 'rgba(255,255,255,0.05)'}`,
                  color: mood === i ? m.color : 'rgba(255,255,255,0.4)',
                }}
              >
                <span>{m.emoji}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: text.trim()
              ? 'linear-gradient(135deg, #a78bfa, #7b9fff)'
              : 'rgba(255,255,255,0.05)',
            color: text.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
            boxShadow: text.trim() ? '0 0 30px rgba(167,139,250,0.25)' : 'none',
          }}
        >
          Send into the cosmos ✦
        </button>
      </form>
    </div>
  );
}

function DetailModal({ whisper, onClose, onDelete }) {
  const mood = MOODS[whisper.mood] || MOODS[0];

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      style={{ background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass-strong rounded-3xl p-8 w-full max-w-lg animate-modal-enter"
        style={{
          background: 'rgba(15,15,42,0.9)',
          border: `1px solid ${mood.border}`,
          boxShadow: `0 0 60px ${mood.color}10, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">{mood.emoji}</span>
          <div>
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: mood.color }}
            >
              {mood.label}
            </span>
            <p className="text-xs text-stardust/30 mt-0.5">
              {new Date(whisper.createdAt).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              {' · '}
              {new Date(whisper.createdAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <p className="text-stardust/85 text-lg leading-relaxed mb-6">
          {whisper.text}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-stardust/50 hover:text-stardust hover:bg-white/5 transition-all text-sm"
          >
            Close
          </button>
          <button
            onClick={() => { onDelete(whisper.id); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-red-400/60 hover:text-red-300 hover:bg-red-500/5 transition-all text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [whispers, setWhispers] = useState(getStoredWhispers);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });
  const tooltipTimer = useRef(null);

  useEffect(() => {
    storeWhispers(whispers);
  }, [whispers]);

  const addWhisper = useCallback(({ text, mood }) => {
    const whisper = {
      id: crypto.randomUUID(),
      text,
      mood,
      createdAt: Date.now(),
    };
    setWhispers(prev => [whisper, ...prev]);
  }, []);

  const deleteWhisper = useCallback((id) => {
    setWhispers(prev => prev.filter(w => w.id !== id));
  }, []);

  const handleAddClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 10;

    if (whispers.length === 0) {
      setTooltip({ show: true, x, y, text: 'Share your first whisper' });
      tooltipTimer.current = setTimeout(() => {
        setTooltip(prev => ({ ...prev, show: false }));
      }, 2500);
    }
    setShowAdd(true);
  }, [whispers.length]);

  useEffect(() => {
    return () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-cosmic-950 overflow-hidden select-none">
      <Stars />
      <NebulaGradients />

      {/* Background logo */}
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none select-none"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: 0.03,
        }}
      >
        <svg width="400" height="400" viewBox="0 0 48 46" fill="none">
          <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
        </svg>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 48 46" fill="none">
            <path fill="#a78bfa" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
          </svg>
          <div>
            <h1 className="text-lg font-bold text-stardust tracking-tight">Whisper Vault</h1>
            <p className="text-[11px] text-stardust/30 -mt-0.5">{whispers.length} whispers in the void</p>
          </div>
        </div>
      </header>

      {/* Floating whispers */}
      <div className="absolute inset-0 z-10">
        {whispers.map((w, i) => (
          <WhisperCard
            key={w.id}
            whisper={w}
            index={i}
            total={whispers.length}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* Empty state */}
      {whispers.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-slide-up">
            <div className="text-6xl mb-5 opacity-50">🌌</div>
            <p className="text-stardust/30 text-lg font-light">The void is quiet...</p>
            <p className="text-stardust/15 text-sm mt-1">Tap the portal to share a whisper</p>
          </div>
        </div>
      )}

      {/* Add button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={handleAddClick}
          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 animate-breathe"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(167,139,250,0.3), rgba(10,10,26,0.95))',
            border: '1px solid rgba(167,139,250,0.25)',
          }}
        >
          {/* Pulse rings */}
          <div className="pulse-ring-1 absolute inset-0 rounded-full" style={{ border: '1px solid rgba(167,139,250,0.3)' }} />
          <div className="pulse-ring-2 absolute inset-0 rounded-full" style={{ border: '1px solid rgba(123,159,255,0.2)' }} />
          <div className="pulse-ring-3 absolute inset-0 rounded-full" style={{ border: '1px solid rgba(255,107,203,0.15)' }} />

          {/* Orbit particles */}
          <div className="absolute inset-0">
            {[0,1,2,3,4,5].map(i => (
              <div
                key={i}
                className={`absolute top-1/2 left-1/2 ${i < 3 ? 'orbit-particle' : 'orbit-particle-r'}`}
                style={{ animationDelay: `-${i * 2.5}s` }}
              >
                <div
                  className="rounded-full animate-pulse-glow"
                  style={{
                    width: i === 0 ? '4px' : '2.5px',
                    height: i === 0 ? '4px' : '2.5px',
                    background: i % 2 === 0 ? '#a78bfa' : '#7b9fff',
                    boxShadow: `0 0 6px ${i % 2 === 0 ? '#a78bfa' : '#7b9fff'}`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Plus icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            className="relative z-10"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Modals */}
      {showAdd && (
        <AddModal onClose={() => setShowAdd(false)} onAdd={addWhisper} />
      )}
      {selected && (
        <DetailModal
          whisper={selected}
          onClose={() => setSelected(null)}
          onDelete={deleteWhisper}
        />
      )}

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-[100] pointer-events-none animate-fade-in"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div
            className="px-3 py-1.5 rounded-xl text-xs text-stardust/70 whitespace-nowrap"
            style={{
              background: 'rgba(15,15,42,0.95)',
              border: '1px solid rgba(167,139,250,0.2)',
            }}
          >
            {tooltip.text}
          </div>
        </div>
      )}
    </div>
  );
}
