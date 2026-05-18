import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Zap, AlertTriangle, CheckCircle2, Lock, Cpu, Info } from 'lucide-react';

const SHAPE_TEMPLATES = [
  "101101001010111001011011101001011011",
  "011001111010110110101101011110101100",
  "111000101110011100111001011101000111",
  "001100110110011111100110110011001100",
  "101010111111010101101010010101111111",
  "110111110111101101111111011110111101",
  "011011011011000000111111011011011011",
  "111111100001101111011011100001111111",
  "101010110110011111101101101101101010",
  "011001011010110110101101101001101100"
];

const MODULE_LIBRARY = SHAPE_TEMPLATES.map(s => s.split('').map(c => c === '1'));
const STABLE_DEPLOY_ID = Math.random().toString(36).substring(7).toUpperCase();

// Simple Audio utility using Web Audio API for responsive, synthesized sci-fi sounds
const useSoundSys = () => {
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const playSound = useCallback((freq: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContext.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  return {
    playClick: () => playSound(800, 'sine', 0.1, 0.05),
    playSelect: () => playSound(400, 'square', 0.05, 0.02),
    playSuccess: () => {
      playSound(600, 'sine', 0.2, 0.1);
      setTimeout(() => playSound(800, 'sine', 0.3, 0.1), 100);
    },
    playError: () => {
      playSound(150, 'sawtooth', 0.4, 0.1);
    },
    playGlitch: () => {
      for(let i=0; i<5; i++) {
        setTimeout(() => playSound(Math.random() * 1000 + 100, i % 2 === 0 ? 'sawtooth' : 'square', 0.05, 0.05), i * 50);
      }
    },
    playBoot: () => {
      playSound(100, 'sine', 1.5, 0.2);
      setTimeout(() => playSound(200, 'sine', 1, 0.1), 500);
    }
  };
};

const COLORS = {
  bg: '#05070a',
  primary: '#00BCD4',
  accent: '#e2e8f0',
  danger: '#ff1744',
  success: '#00e676',
};

export default function App() {
  const [gameState, setGameState] = useState<'IDLE' | 'BOOTING' | 'SYNCING' | 'SUCCESS' | 'FAILURE'>('IDLE');
  const [syncPercentage, setSyncPercentage] = useState(0);
  const sounds = useSoundSys();

  const handleStart = () => {
    sounds.playBoot();
    setGameState('BOOTING');
    setTimeout(() => setGameState('SYNCING'), 2000);
  };

  const handleComplete = React.useCallback((success: boolean) => {
    if (success) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
    setGameState(success ? 'SUCCESS' : 'FAILURE');
    if (success) setSyncPercentage(100);
  }, [sounds]);

  const reset = React.useCallback(() => {
    sounds.playClick();
    setGameState('IDLE');
    setSyncPercentage(0);
  }, [sounds]);

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 font-sans selection:bg-[#00BCD4] selection:text-white overflow-hidden flex items-center justify-center p-4">
      {/* High-Tech Background Elements */}
      <div className="fixed inset-0 pointer-events-none holo-grid" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,188,212,0.05)_0,transparent_70%)]" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BCD4]/30 to-transparent animate-pulse-slow" />

      <div className="absolute top-4 left-4 z-50 text-[8px] font-mono opacity-20 hidden sm:block">
        &gt; DEPLOY_ID: {STABLE_DEPLOY_ID}<br/>
        &gt; NODE_READY: TRUE
      </div>

      <div className="fixed inset-0 pointer-events-none crt-overlay opacity-[0.03]" />
      <div className="scanline" />

      <AnimatePresence mode="wait">
        {gameState === 'IDLE' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8 sm:space-y-12 max-w-xl px-4"
          >
            <div className="space-y-4 animate-float">
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 border border-[#00BCD4]/20 rounded-full flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 border-t-2 border-[#00BCD4] rounded-full" />
                  <Cpu size={32} className="sm:size-16 text-[#00BCD4] text-glow-cyan" />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 border border-white/5 rounded-full animate-pulse-slow" />
              </div>
              
              <div className="space-y-1">
                <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black tracking-tighter uppercase text-white leading-tight">
                  ВЗЛОМ<span className="text-[#00BCD4]">_ПЕРИКОТА</span>
                </h1>
                <p className="text-[#00BCD4] font-mono text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.4em] uppercase opacity-60">Версия системы 9.4.0 // Высокая точность</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleStart}
                onMouseEnter={() => sounds.playSelect()}
                className="group relative px-10 sm:px-16 py-3 sm:py-4 transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 bg-[#00BCD4] skew-x-[-12deg] group-hover:bg-white transition-colors" />
                <span className="relative z-10 text-black font-black uppercase text-sm sm:text-base tracking-[0.2em] sm:tracking-[0.3em] group-hover:text-[#00BCD4]">
                  Запустить синхронизацию
                </span>
                <div className="absolute -inset-1 border border-[#00BCD4]/50 skew-x-[-12deg] group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all" />
              </button>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center text-[8px] sm:text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                <div className="flex items-center gap-2 sm:border-r sm:border-slate-800 sm:pr-8">
                  <Shield size={12} className="text-[#00BCD4]" /> УРОВЕНЬ_ЗАЩИТЫ: ОМЕГА
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-[#00BCD4]" /> КАНАЛ_СВЯЗИ: ОПТИМАЛЬНО
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'BOOTING' && (
          <motion.div
            key="booting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Загрузка_когнитивных_массивов</span>
                <span className="text-[10px] font-mono text-[#00BCD4]">ID_ПРОЦЕССА: {Math.random().toString(16).substring(2, 8).toUpperCase()}</span>
              </div>
              
              <div className="h-0.5 bg-slate-900 w-full relative overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[#00BCD4]/40 w-1/3"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="h-full bg-[#00BCD4] relative z-10 shadow-[0_0_10px_#00BCD4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-tighter relative">
              {[
                "Извлечение нейронных паттернов...",
                "Обход уровней квантового шифрования...",
                "Установка защищенного буфера связи...",
                "Загрузка инструкций к модулю..."
              ].map((line, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-[#00BCD4] rounded-full" />
                  {line}
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="mt-4 p-3 border border-[#00BCD4]/10 bg-[#00BCD4]/5 rounded-lg flex items-start gap-3"
              >
                <Info size={14} className="text-[#00BCD4] shrink-0 mt-0.5" />
                <p className="text-[9px] normal-case text-slate-400 leading-relaxed">
                  <span className="text-[#00BCD4] font-bold">ИНСТРУКЦИЯ:</span> Комбинируйте модули из буфера инъекции так, чтобы полностью закрыть белые ячейки («целевая матрица»). Нажатие кнопки инъекции проверяет соответствие.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {gameState === 'SYNCING' && (
          <ShapeHacking onComplete={handleComplete} onSyncChange={setSyncPercentage} />
        )}

        {(gameState === 'SUCCESS' || gameState === 'FAILURE') && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative text-center space-y-6 sm:space-y-12 max-w-[90vw] sm:max-w-xl w-full glass-panel p-6 sm:p-12 rounded-3xl sm:rounded-[2rem]"
            >
              {gameState === 'SUCCESS' ? (
                <>
                  <div className="relative inline-block">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-[-40px] bg-[#00e676]/30 blur-3xl rounded-full"
                    />
                    <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 bg-[#00e676]/10 border border-[#00e676] rounded-full flex items-center justify-center mx-auto text-[#00e676]">
                       <CheckCircle2 size={32} className="sm:size-12" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-4xl xs:text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white">
                      СИНХРОНИЗАЦИЯ<br className="sm:hidden"/><span className="text-[#00e676]">_ЗАВЕРШЕНА</span>
                    </h2>
                    <p className="text-slate-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase">Нейронная интеграция успешно подтверждена.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-xl text-left space-y-2">
                    <div className="flex justify-between text-[8px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                      <span className="truncate mr-2">ФАЙЛ_ДАННЫХ: ПРОТОКОЛ_ПЕРИКОТ_X</span>
                      <span className="shrink-0">100% РАСШИФРОВАНО</span>
                    </div>
                    <div className="h-1 bg-slate-900 overflow-hidden rounded-full">
                       <div className="h-full bg-[#00e676] w-full" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative inline-block">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute inset-[-40px] bg-[#ff1744]/30 blur-3xl rounded-full"
                    />
                    <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 bg-[#ff1744]/10 border border-[#ff1744] rounded-full flex items-center justify-center mx-auto text-[#ff1744]">
                       <AlertTriangle size={32} className="sm:size-12" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-4xl xs:text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white">
                      ПРОРЫВ<br className="sm:hidden"/><span className="text-[#ff1744]">_ЯДРА</span>
                    </h2>
                    <p className="text-[#ff1744] font-mono text-[10px] sm:text-xs tracking-widest uppercase animate-pulse">Трассировка запущена. Идет аварийное завершение.</p>
                  </div>
                </>
              )}
              
              <button
                onClick={reset}
                onMouseEnter={() => sounds.playSelect()}
                className="group relative w-full py-4 sm:py-5 transition-all active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl group-hover:bg-[#00BCD4] group-hover:border-[#00BCD4] transition-all" />
                <span className="relative z-10 text-slate-400 font-black uppercase text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] group-hover:text-black transition-colors">
                  Вернуться в Матрицу
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShapeHacking({ onComplete, onSyncChange }: { onComplete: (s: boolean) => void, onSyncChange: (v: number) => void }) {
  const totalLevels = 3;
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [appliedModule, setAppliedModule] = useState<boolean[] | null>(null);
  const [feedback, setFeedback] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const sounds = useSoundSys();
  
  const [targetShape, setTargetShape] = useState<boolean[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevIdx = useRef(currentIdx);

  useEffect(() => {
    if (prevIdx.current !== currentIdx) {
      sounds.playSelect();
      prevIdx.current = currentIdx;
    }
  }, [currentIdx, sounds]);

  // Sync progress percentage with parent safely in useEffect
  useEffect(() => {
    const progress = (level / totalLevels) * 100;
    onSyncChange(progress);
  }, [level, onSyncChange, totalLevels]);

  // Generate new target when level changes
  useEffect(() => {
    const solutionIdx = Math.floor(Math.random() * MODULE_LIBRARY.length);
    const solutionModule = MODULE_LIBRARY[solutionIdx];
    setTargetShape(solutionModule.map(v => !v));
    setCurrentIdx(Math.floor(Math.random() * MODULE_LIBRARY.length));
    setAppliedModule(null);
    setIsChecking(false);
  }, [level]);

  const handleInject = React.useCallback(() => {
    if (MODULE_LIBRARY.length === 0 || targetShape.length === 0 || isChecking) return;
    
    sounds.playClick();
    setIsChecking(true);
    const currentModule = MODULE_LIBRARY[currentIdx];
    setAppliedModule(currentModule);

    // Short delay to visualize the overlay
    setTimeout(() => {
      const isCorrect = targetShape.every((val, i) => val !== currentModule[i]);

      if (isCorrect) {
        sounds.playSuccess();
        setFeedback({ text: 'МОДУЛЬ_СИНХРОНИЗИРОВАН', type: 'success' });
        setTimeout(() => {
          setFeedback(null);
          if (level >= totalLevels - 1) {
            onComplete(true);
          } else {
            setLevel(prev => prev + 1);
            setTimeLeft(prev => prev + 5); 
          }
        }, 1000);
      } else {
        sounds.playGlitch();
        setFeedback({ text: 'ОШИБКА_ПОСЛЕДОВАТЕЛЬНОСТИ', type: 'error' });
        setIsGlitching(true);
        setTimeLeft(prev => Math.max(0, prev - 3)); 
        setTimeout(() => {
          setFeedback(null);
          setIsGlitching(false);
          setAppliedModule(null);
          setIsChecking(false);
        }, 1000);
      }
    }, 800);
  }, [currentIdx, targetShape, level, totalLevels, onComplete, isChecking, sounds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChecking) return;
      if (e.key === 'ArrowLeft') setCurrentIdx(prev => (prev - 1 + MODULE_LIBRARY.length) % MODULE_LIBRARY.length);
      if (e.key === 'ArrowRight') setCurrentIdx(prev => (prev + 1) % MODULE_LIBRARY.length);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleInject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInject, isChecking]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(false);
    }
  }, [timeLeft, onComplete]);

  if (targetShape.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-[calc(100vw-32px)] max-w-sm flex flex-col items-center gap-6 sm:gap-8 relative p-4 sm:p-8 glass-panel rounded-2xl sm:rounded-3xl ${isGlitching ? 'glitch-effect shake' : ''}`}
    >
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] px-4 sm:px-8 py-2 sm:py-4 border-2 ${
              feedback.type === 'success' ? 'bg-slate-900 border-[#00e676] text-[#00e676]' : 'bg-slate-900 border-[#ff1744] text-[#ff1744]'
            } font-black text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.4em] uppercase whitespace-nowrap shadow-[0_0_80px_rgba(0,0,0,0.9)] rounded-lg text-center leading-tight`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between w-full text-[8px] sm:text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold px-2">
        <div className="flex items-center gap-2">
          <Cpu size={12} className="sm:size-14 text-[#00BCD4]" /> СИНХ_{level + 1}/{totalLevels}
        </div>
        <div className={`flex items-center gap-2 ${timeLeft < 5 ? 'text-[#ff1744] animate-pulse' : ''}`}>
          <AlertTriangle size={12} className="sm:size-14" /> ЛИМИТ_ВР: {timeLeft}с
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 text-center w-full">
        <div className="flex items-center gap-3 justify-center">
           <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00BCD4]/20" />
           <p className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold">Целевая_матрица</p>
           <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00BCD4]/20" />
        </div>
        <div className="relative group mx-auto w-fit p-1 bg-slate-950 rounded-xl">
          <div className="relative grid grid-cols-6 gap-0.5 p-1 sm:p-2 bg-slate-900/50 border border-white/5 rounded-lg">
            {targetShape.map((targetActive, i) => {
              const appliedActive = appliedModule?.[i];
              const isOverlap = targetActive && appliedActive;
              const isFill = !targetActive && appliedActive;
              
              let bgColor = targetActive ? '#ffffff' : 'rgba(255,255,255,0.02)';
              let borderColor = targetActive ? '#ffffff' : 'rgba(255,255,255,0.05)';
              let shadow = targetActive ? '0 0 10px rgba(255,255,255,0.1)' : 'none';

              if (isOverlap) {
                bgColor = '#ff1744';
                borderColor = '#ff1744';
                shadow = '0 0 20px rgba(255, 23, 68, 0.6)';
              } else if (isFill) {
                bgColor = '#00e676';
                borderColor = '#00e676';
                shadow = '0 0 20px rgba(0, 230, 118, 0.6)';
              }

              return (
                <motion.div
                  key={`target-${i}`}
                  initial={false}
                  animate={{
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    boxShadow: shadow,
                    scale: appliedActive ? 1.05 : 1
                  }}
                  className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 border rounded-[2px]"
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 sm:gap-6 items-center">
        <div className="flex items-center gap-3 justify-center w-full">
           <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00BCD4]/20" />
           <p className="text-[8px] sm:text-[10px] text-[#00BCD4] uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold">Буфер_инъекции</p>
           <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00BCD4]/20" />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 w-full px-1">
          <button 
            onClick={() => !isChecking && setCurrentIdx(prev => (prev - 1 + MODULE_LIBRARY.length) % MODULE_LIBRARY.length)} 
            disabled={isChecking}
            className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-white/5 border border-white/10 rounded-full text-[#00BCD4] hover:bg-[#00BCD4] hover:text-black active:scale-90 transition-all flex items-center justify-center font-black z-20 ${isChecking ? 'opacity-10' : ''}`}
          >
            ←
          </button>
          
          <div className="flex-1 relative flex items-center justify-center h-40 sm:h-48 overflow-hidden pointer-events-none">
             <AnimatePresence initial={false} mode="popLayout">
                {[-1, 0, 1].map((offset) => {
                  const idx = (currentIdx + offset + MODULE_LIBRARY.length) % MODULE_LIBRARY.length;
                  const isMain = offset === 0;
                  return (
                    <motion.div
                      key={`${idx}-${offset}`}
                      initial={{ opacity: 0, x: offset * 80, scale: isMain ? 1 : 0.7 }}
                      animate={{ 
                        opacity: isMain ? 1 : 0.05, 
                        x: offset * 100, 
                        scale: isMain ? 1 : 0.6,
                        filter: isMain ? 'blur(0px)' : 'blur(4px)'
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className={`absolute grid grid-cols-6 gap-0.5 w-24 h-24 sm:w-32 sm:h-32 p-1 border rounded-lg sm:rounded-xl ${isMain ? 'bg-slate-900 border-[#00BCD4]/30' : 'bg-transparent border-white/5'}`}
                    >
                      {MODULE_LIBRARY[idx].map((active, i) => (
                        <div
                          key={`module-cell-${idx}-${i}`}
                          className={`aspect-square transition-all duration-300 rounded-[1px] sm:rounded-[2px] ${
                            active ? (isMain ? 'bg-[#00BCD4] shadow-[0_0_10px_rgba(0,188,212,0.4)]' : 'bg-[#00BCD4]') : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </motion.div>
                  );
                })}
             </AnimatePresence>
             <div className="absolute top-0 right-0 text-[7px] sm:text-[8px] font-mono opacity-40 text-[#00BCD4] px-2 py-0.5 sm:py-1 bg-slate-950 rounded-bl-lg border-l border-b border-white/5">
                {currentIdx + 1}/{MODULE_LIBRARY.length}
             </div>
          </div>

          <button 
            onClick={() => !isChecking && setCurrentIdx(prev => (prev + 1) % MODULE_LIBRARY.length)}
            disabled={isChecking}
            className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-white/5 border border-white/10 rounded-full text-[#00BCD4] hover:bg-[#00BCD4] hover:text-black active:scale-90 transition-all flex items-center justify-center font-black z-20 ${isChecking ? 'opacity-10' : ''}`}
          >
            →
          </button>
        </div>

        <div className="flex gap-1 sm:gap-1.5 w-full justify-center">
          {MODULE_LIBRARY.map((_, i) => (
            <div 
              key={`dot-${i}`} 
              className={`h-0.5 transition-all duration-300 ${i === currentIdx ? 'w-4 sm:w-6 bg-[#00BCD4]' : 'w-1 sm:w-2 bg-white/10'}`}
            />
          ))}
        </div>

        <button
          onClick={handleInject}
          disabled={isChecking}
          className={`group relative w-full py-4 sm:py-5 transition-all duration-300 active:scale-[0.97] ${isChecking ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="absolute inset-0 bg-[#00BCD4] rounded-lg sm:rounded-xl shadow-[0_0_20px_rgba(0,188,212,0.2)]" />
          <span className="relative z-10 text-black font-black uppercase text-xs sm:text-base tracking-[0.2em] sm:tracking-[0.5em]">
            Синхр_последовательность
          </span>
          <div className="absolute -inset-1 border border-[#00BCD4]/50 rounded-lg sm:rounded-xl scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </button>
      </div>

      <div className="text-[8px] sm:text-[10px] text-slate-500 text-center uppercase tracking-widest font-mono border-t border-white/5 pt-4 w-full line-clamp-2">
         Для подтверждения последовательности требуется ввод комплементарных данных.
      </div>
    </motion.div>
  );
}
