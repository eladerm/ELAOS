import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export type LogEvent = {
  id: string;
  timestamp: Date;
  type: 'KEYSTROKE' | 'APP_OPEN' | 'APP_CLOSE' | 'NETWORK_BLOCKED' | 'NETWORK_ACCESS' | 'LOGIN';
  details: string;
  user: string;
  appContext?: string;
};

interface TelemetryContextType {
  logs: LogEvent[];
  logEvent: (type: LogEvent['type'], details: string, user?: string) => void;
  setAppContext: (app: string) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const currentUser = useRef<string>('System');
  const currentAppContext = useRef<string>('Desktop');

  const setAppContext = React.useCallback((app: string) => {
    currentAppContext.current = app;
  }, []);

  const logEvent = React.useCallback((type: LogEvent['type'], details: string, user: string = currentUser.current) => {
    if (user) currentUser.current = user;
    
    const newLog: LogEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      type,
      details,
      user: currentUser.current,
      appContext: currentAppContext.current,
    };
    
    setLogs((prev) => [newLog, ...prev].slice(0, 5000)); // Keep last 5000 logs
  }, []);

  // Global Keylogger Simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys alone to reduce noise
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;
      
      let keyStr = e.key;
      if (e.key === ' ') keyStr = '[SPACE]';
      if (e.key === 'Enter') keyStr = '[ENTER]';
      if (e.key === 'Backspace') keyStr = '[BACKSPACE]';
      
      logEvent('KEYSTROKE', `Key pressed: ${keyStr}`);
    };

    // Use capture phase to ensure we catch it before any other component stops propagation
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  return (
    <TelemetryContext.Provider value={{ logs, logEvent, setAppContext }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (context === undefined) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}
