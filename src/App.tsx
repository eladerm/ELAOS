import React, { useState, useEffect } from 'react';
import { TelemetryProvider, useTelemetry } from './TelemetryContext';
import Desktop from './Desktop';
import { Command, Lock } from 'lucide-react';

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center cursor-none">
      <Command className="w-20 h-20 text-white mb-12 animate-pulse" />
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-200 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="text-white/40 text-[10px] mt-6 font-mono tracking-widest uppercase">
        Loading ElaOS Kernel... {progress}%
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: string) => void }) {
  const [pin, setPin] = useState('');
  const { logEvent } = useTelemetry();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      logEvent('LOGIN', 'User authenticated successfully', 'Dr. Smith');
      onLogin('Dr. Smith');
    } else {
      setPin('');
      logEvent('LOGIN', 'Failed authentication attempt', 'Unknown');
    }
  };

  return (
    <div className="h-screen w-screen bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-2xl">
          <Command className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-medium text-white mb-8 tracking-widest">ElaOS</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN (1234)"
            className="bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/50 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all w-64 backdrop-blur-md"
            autoFocus
          />
        </form>
        
        <p className="text-white/50 text-xs mt-12 max-w-xs text-center">
          This system is strictly monitored. All keystrokes, network requests, and application usage are logged per MDM policy.
        </p>
      </div>
    </div>
  );
}

function ExitDialog({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2026') {
      // @ts-ignore
      if (window.electronAPI) {
        // @ts-ignore
        window.electronAPI.quitApp();
      } else {
        window.close();
      }
    } else if (password === 'admin2026') {
      // @ts-ignore
      if (window.electronAPI) {
        // @ts-ignore
        window.electronAPI.unlockApp();
      }
      onClose();
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Seguridad del Sistema</h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Introduce la contraseña de administrador para salir o desbloquear el modo kiosco.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Contraseña"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppContent() {
  const [appState, setAppState] = useState<'booting' | 'login' | 'desktop'>('booting');
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (window.electronAPI) {
      // @ts-ignore
      window.electronAPI.onShowExitDialog(() => {
        setShowExitDialog(true);
      });
    }
  }, []);

  if (appState === 'booting') {
    return <BootScreen onComplete={() => setAppState('login')} />;
  }

  if (appState === 'login') {
    return (
      <>
        <LoginScreen onLogin={() => setAppState('desktop')} />
        {showExitDialog && <ExitDialog onClose={() => setShowExitDialog(false)} />}
      </>
    );
  }

  return (
    <>
      <Desktop onLock={() => setAppState('login')} onShowExit={() => setShowExitDialog(true)} />
      {showExitDialog && <ExitDialog onClose={() => setShowExitDialog(false)} />}
    </>
  );
}

export default function App() {
  return (
    <TelemetryProvider>
      <AppContent />
    </TelemetryProvider>
  );
}
