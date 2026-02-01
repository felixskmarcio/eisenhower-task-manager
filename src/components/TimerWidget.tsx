import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, Settings, Volume2, VolumeX, Coffee, RotateCcw, X, Minimize2, Maximize2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  quadrant: number;
  timeSpent?: number;
}

interface TimerStats {
  totalSessions: number;
  totalFocusTime: number;
  totalBreakTime: number;
  sessionsToday: number;
  timePerQuadrant: { [key: number]: number };
}

interface TimerWidgetProps {
  activeTask: Task | null;
  onTimerComplete: (taskId: string, timeSpent: number) => void;
  onTimerStart: (taskId: string) => void;
  onTimerStop: () => void;
  tasks: Task[];
}

const TIMER_DURATIONS = [
  { label: '15 min', value: 15 * 60 },
  { label: '25 min', value: 25 * 60 },
  { label: '45 min', value: 45 * 60 },
  { label: '60 min', value: 60 * 60 },
];

const BREAK_DURATIONS = {
  short: 5 * 60,
  long: 15 * 60,
};

export function TimerWidget({
  activeTask,
  onTimerComplete,
  onTimerStart,
  onTimerStop,
  tasks
}: TimerWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [selectedDuration, setSelectedDuration] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [breakType, setBreakType] = useState<'short' | 'long'>('short');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stats, setStats] = useState<TimerStats>(() => {
    const saved = localStorage.getItem('pomodoro-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.lastDate !== today) {
        return { ...parsed, sessionsToday: 0, lastDate: today };
      }
      return parsed;
    }
    return {
      totalSessions: 0,
      totalFocusTime: 0,
      totalBreakTime: 0,
      sessionsToday: 0,
      timePerQuadrant: { 0: 0, 1: 0, 2: 0, 3: 0 },
      lastDate: new Date().toDateString(),
    };
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRMhLFm11+erYBsFKmCg0N2tYhsHO1+Xz+CsZB0KQGCUzN6rZB0KRGKSytyqZh4MRmSQyNqpZx8OR2WOxdipaCEPSGaNw9WnaiIPSmeMwdOlayMRTGmLv9GjbCQSTWqKvs+ibiYTT2uJvMyecCcUT22HusmbbikWUW6FtseYbyoXU3GDtMSVcCsYVHKBssKScywZVXR/sMCQdC0aV3V9rr2Ndi4bWHZ6rLqLdy8cWnh4qriJeDAeW3l1prWGejEfXXpzpLKDfDIgX3txoq+BfjMhYHxunqx+gDQiYn1rm6l7gjUjZH5pmqZ4hDYlZn9mmKR2hjcmaIFklqFzhzgoaoNilZ5xijkpbIRgk5tupDsrbYZdkZhriDwtb4dbj5VpijwucIhZjZJmjD4vcYlXjJBkjj8xc4tVio1ikEAydIxTiYpgkkEzdo5RiIdek0M1d49Ph4Rek0Q2eZFNhYFbkEY4epJLhH5ZjUg5fJRJg3tWjEo7fZZHgnlUi0s8f5hFgXZSiU09gJpDgHRQiE8+gZxBf3JNh1FAgJ0/fnBLhVNCgZ49fW5JhFRDgp87fGxHg1ZFg587e2pFgldGhJ84emhDgVlHhZ42eWZBgFpJhp40eGU/f1xKh500d2M9flxLiJwydmE8fV5MiZsxdV87e15NipsvcV45el1PjJouc1w4eVxQjZksclk3eFxRjpkrcFc2d1tSj5gqb1U1dlpTkJcob1Q0dFlUkZYnblIzdFhVkpUmbFEyclZWk5QlaVAycVVXlJMjZ08xb1RYlZIiZU0wblNZlpEhY0sub1JamZAgYEoub1FbnJAfXkguclFcnpAeXEcudFJeoY8dWkUvdlNfoo4cV0Qve1VhpI0bVUIxfldiqo0aU0AzgVljro0ZUEA0g1tlsI0YTz82hVxns44XTj44h11ptY4WTT46il5rt44VTD48jV9tu44UTD9Aj2BwvY4TTkBEkmFyv44ST0FHlWJ1wY4RUUJKmGN4w44QUkNNm2R7xY4PU0RQnmV/x44OVURZIT4=');
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
  }, [stats]);

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  }, [soundEnabled]);

  const startTimer = useCallback(() => {
    if (!activeTask) return;

    setIsRunning(true);
    setIsPaused(false);
    setTimeLeft(selectedDuration);
    setTotalTime(selectedDuration);
    setElapsedTime(0);
    setIsBreak(false);
    onTimerStart(activeTask.id);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playSound();
          return 0;
        }
        return prev - 1;
      });
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }, [activeTask, selectedDuration, onTimerStart, playSound]);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    if (!isRunning || !isPaused) return;

    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playSound();
          return 0;
        }
        return prev - 1;
      });
      if (!isBreak) {
        setElapsedTime((prev) => prev + 1);
      }
    }, 1000);
  }, [isRunning, isPaused, isBreak, playSound]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (activeTask && elapsedTime > 0 && !isBreak) {
      onTimerComplete(activeTask.id, elapsedTime);

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalFocusTime: prev.totalFocusTime + elapsedTime,
        timePerQuadrant: {
          ...prev.timePerQuadrant,
          [activeTask.quadrant]: (prev.timePerQuadrant[activeTask.quadrant] || 0) + elapsedTime,
        },
      }));
    }

    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(selectedDuration);
    setElapsedTime(0);
    setIsBreak(false);
    onTimerStop();
  }, [activeTask, elapsedTime, isBreak, selectedDuration, onTimerComplete, onTimerStop]);

  const startBreak = useCallback((type: 'short' | 'long') => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const breakDuration = BREAK_DURATIONS[type];
    setBreakType(type);
    setIsBreak(true);
    setTimeLeft(breakDuration);
    setTotalTime(breakDuration);
    setIsPaused(false);

    // Update session count when starting break (means focus session completed)
    setStats((prev) => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      sessionsToday: prev.sessionsToday + 1,
    }));

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playSound();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsBreak(false);
          setTimeLeft(selectedDuration);
          setTotalTime(selectedDuration);
          setIsRunning(false);
          return selectedDuration;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedDuration, playSound]);

  // Handle timer completion
  useEffect(() => {
    if (isRunning && !isPaused && timeLeft === 0 && !isBreak) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (activeTask) {
        onTimerComplete(activeTask.id, elapsedTime);
        setStats((prev) => ({
          ...prev,
          totalFocusTime: prev.totalFocusTime + elapsedTime,
          timePerQuadrant: {
            ...prev.timePerQuadrant,
            [activeTask.quadrant]: (prev.timePerQuadrant[activeTask.quadrant] || 0) + elapsedTime,
          },
        }));
      }

      setIsRunning(false);
    }
  }, [timeLeft, isRunning, isPaused, isBreak, activeTask, elapsedTime, onTimerComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeHours = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const quadrantNames = ['Fazer', 'Agendar', 'Delegar', 'Eliminar'];
  const quadrantColors = ['text-red-500', 'text-blue-500', 'text-yellow-500', 'text-gray-500'];

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50"
        data-testid="timer-widget-minimized"
      >
        <Button
          size="icon"
          variant="default"
          className={cn(
            "h-14 w-14 rounded-none shadow-2xl border border-[#ccff00]/50",
            isRunning && !isPaused && "animate-pulse shadow-[0_0_15px_rgba(204,255,0,0.3)]",
            "bg-[#09090b] text-[#ccff00] hover:bg-[#18181b]"
          )}
          onClick={() => setIsMinimized(false)}
          data-testid="button-expand-timer"
        >
          <div className="flex flex-col items-center">
            <Clock className="h-5 w-5" />
            <span className="text-[10px] font-mono font-bold mt-1">{formatTime(timeLeft)}</span>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <Card
      className="fixed bottom-4 right-4 z-50 w-80 shadow-2xl border bg-[#09090b] border-[#27272a] rounded-none"
      data-testid="timer-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#27272a] bg-[#18181b]">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#ccff00]" />
          <span className="font-display font-bold text-sm uppercase tracking-wider text-[#f4f4f5]">
            {isBreak ? `Pausa ${breakType === 'short' ? 'Curta' : 'Longa'}` : 'Pomodoro Protocol'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-none text-[#a1a1aa] hover:text-white hover:bg-[#27272a]"
            onClick={() => setSoundEnabled(!soundEnabled)}
            data-testid="button-toggle-sound"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-none text-[#a1a1aa] hover:text-white hover:bg-[#27272a]"
            onClick={() => setIsMinimized(true)}
            data-testid="button-minimize-timer"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="p-6 bg-[#09090b]">
        <div className="flex flex-col items-center">
          {/* Circular Progress */}
          <div className="relative w-40 h-40 mb-6">
            <div className="absolute inset-0 rounded-full border border-[#27272a]/50"></div>
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(204,255,0,0.1)]">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="#18181b"
                strokeWidth="4"
                className="opacity-50"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke={isBreak ? "#22c55e" : "#ccff00"}
                strokeWidth="4"
                strokeLinecap="square"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 - (progress / 100) * (2 * Math.PI * 64)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-mono font-bold tracking-tight ${isBreak ? "text-[#22c55e]" : "text-[#ccff00]"}`} data-testid="text-timer-display">
                {formatTime(timeLeft)}
              </span>
              {isRunning && !isBreak && (
                <span className="text-xs font-mono text-[#a1a1aa] mt-1 bg-[#27272a] px-2 py-0.5 rounded-none">
                  +{formatTime(elapsedTime)}
                </span>
              )}
            </div>
          </div>

          {/* Active Task */}
          {activeTask && (
            <div className="text-center mb-6 w-full px-2">
              <div className="inline-flex items-center gap-2 mb-1 px-2 py-0.5 border border-[#27272a] bg-[#18181b]">
                <div className="w-1.5 h-1.5 bg-[#ccff00] animate-pulse"></div>
                <span className="text-[10px] font-mono uppercase text-[#a1a1aa] tracking-widest">Target Ativo</span>
              </div>
              <p className="font-display font-medium text-sm text-[#f4f4f5] truncate mt-1" data-testid="text-active-task">
                {activeTask.title}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3 mb-2 w-full justify-center">
            {!isRunning ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="button-duration-selector"
                      className="rounded-none border-[#27272a] bg-transparent text-[#a1a1aa] hover:bg-[#27272a] hover:text-white font-mono h-10 min-w-[80px]"
                    >
                      <Settings className="h-3 w-3 mr-2" />
                      {selectedDuration / 60}m
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-none border-[#27272a] bg-[#09090b] text-[#d4d4d8]">
                    <DropdownMenuLabel className="font-mono uppercase text-xs text-[#a1a1aa]">Duração do Foco</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#27272a]" />
                    {TIMER_DURATIONS.map((duration) => (
                      <DropdownMenuItem
                        key={duration.value}
                        onClick={() => {
                          setSelectedDuration(duration.value);
                          setTimeLeft(duration.value);
                          setTotalTime(duration.value);
                        }}
                        data-testid={`menu-duration-${duration.value / 60}`}
                        className="font-mono text-xs focus:bg-[#27272a] focus:text-[#ccff00] cursor-pointer rounded-none"
                      >
                        {duration.label}
                        {selectedDuration === duration.value && <span className="ml-auto text-[#ccff00]">◄</span>}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={startTimer}
                  disabled={!activeTask}
                  data-testid="button-start-timer"
                  className="rounded-none bg-[#ccff00] text-black hover:bg-[#bbe600] font-mono font-bold uppercase tracking-wider h-10 px-6 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-3 w-3 mr-2 fill-current" />
                  Iniciar
                </Button>
              </>
            ) : (
              <>
                {isPaused ? (
                  <Button onClick={resumeTimer} className="rounded-none bg-[#ccff00] text-black hover:bg-[#bbe600] font-mono font-bold uppercase h-10 flex-1" data-testid="button-resume-timer">
                    <Play className="h-3 w-3 mr-2 fill-current" />
                    RETOMAR
                  </Button>
                ) : (
                  <Button onClick={pauseTimer} variant="outline" className="rounded-none border-[#ccff00] text-[#ccff00] bg-transparent hover:bg-[#ccff00]/10 font-mono uppercase h-10 flex-1" data-testid="button-pause-timer">
                    <Pause className="h-3 w-3 mr-2 fill-current" />
                    PAUSAR
                  </Button>
                )}
                <Button
                  onClick={stopTimer}
                  variant="destructive"
                  className="rounded-none h-10 px-3 bg-[#ef4444] hover:bg-[#dc2626] font-mono font-bold uppercase tracking-wider"
                  data-testid="button-stop-timer"
                  title="Finalizar e Salvar Sessão"
                >
                  <Square className="h-3 w-3 mr-2 fill-current" />
                  FINALIZAR
                </Button>
              </>
            )}
          </div>

          {/* Break Buttons */}
          {!isRunning && !isBreak && (
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startBreak('short')}
                className="rounded-none border-[#27272a] text-[#22c55e] hover:bg-[#22c55e]/10 hover:border-[#22c55e] font-mono text-xs h-8"
                data-testid="button-short-break"
              >
                <Coffee className="h-3 w-3 mr-2" />
                5m Pausa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startBreak('long')}
                className="rounded-none border-[#27272a] text-[#22c55e] hover:bg-[#22c55e]/10 hover:border-[#22c55e] font-mono text-xs h-8"
                data-testid="button-long-break"
              >
                <Coffee className="h-3 w-3 mr-2" />
                15m Pausa
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-[#27272a] p-4 bg-[#18181b]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase text-[#a1a1aa] tracking-widest">Estatísticas do Dia</span>
          <Badge variant="outline" className="text-[10px] font-mono rounded-none border-[#27272a] text-[#ccff00] bg-[#09090b]" data-testid="badge-sessions-today">
            {stats.sessionsToday} SESSÕES
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#27272a] mb-3 border border-[#27272a]">
          <div className="flex flex-col p-2 bg-[#09090b]">
            <span className="text-[10px] text-[#52525b] uppercase font-mono mb-1">Total Foco</span>
            <span className="font-mono text-sm text-[#f4f4f5]" data-testid="text-total-focus">{formatTimeHours(stats.totalFocusTime)}</span>
          </div>
          <div className="flex flex-col p-2 bg-[#09090b]">
            <span className="text-[10px] text-[#52525b] uppercase font-mono mb-1">Sessões</span>
            <span className="font-mono text-sm text-[#f4f4f5]" data-testid="text-total-sessions">{stats.totalSessions}</span>
          </div>
        </div>

        {/* Time per quadrant */}
        <div>
          <span className="text-[10px] font-mono uppercase text-[#a1a1aa] tracking-widest mb-2 block">Distribuição por Quadrante</span>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((q) => (
              <div key={q} className="flex items-center justify-between text-[10px] p-1.5 border border-[#27272a] bg-[#09090b]">
                <span className={`font-mono uppercase ${q === 0 ? 'text-[#ef4444]' :
                  q === 1 ? 'text-[#3b82f6]' :
                    q === 2 ? 'text-[#eab308]' :
                      'text-[#71717a]'
                  }`}>{quadrantNames[q]}</span>
                <span className="font-mono text-[#d4d4d8]" data-testid={`text-quadrant-${q}-time`}>
                  {formatTimeHours(stats.timePerQuadrant[q] || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
