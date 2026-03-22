import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { 
  Wifi, 
  BatteryMedium, 
  Search, 
  Command, 
  Lock,
  Stethoscope,
  Globe,
  FileText,
  ShieldAlert,
  X,
  Minus,
  Maximize2,
  Activity,
  Monitor,
  Table,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Wand2,
  SlidersHorizontal,
  Crop,
  RotateCw,
  Keyboard,
  Download
} from 'lucide-react';
import { useTelemetry } from './TelemetryContext';
import { cn } from './utils';

// --- Apps ---

function ClinicDashboard() {
  return (
    <div className="p-6 h-full flex flex-col bg-[#F5F5F7]">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800">Aesthetic Clinic Dashboard</h2>
      <div className="grid grid-cols-3 gap-6 flex-1">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-medium mb-4 text-slate-700">Today's Appointments</h3>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', patient: 'Elena Rostova', treatment: 'Botox - Forehead', status: 'Completed' },
              { time: '10:30 AM', patient: 'Marcus Chen', treatment: 'Laser Hair Removal', status: 'In Progress' },
              { time: '11:45 AM', patient: 'Sarah Jenkins', treatment: 'Dermal Fillers', status: 'Waiting' },
              { time: '02:00 PM', patient: 'Lucia Gomez', treatment: 'Chemical Peel', status: 'Scheduled' },
            ].map((apt, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-slate-500 w-20">{apt.time}</div>
                  <div>
                    <div className="font-medium text-slate-900">{apt.patient}</div>
                    <div className="text-sm text-slate-500">{apt.treatment}</div>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  apt.status === 'Completed' ? "bg-emerald-100 text-emerald-700" :
                  apt.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
                  apt.status === 'Waiting' ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-700"
                )}>
                  {apt.status}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium mb-4 text-slate-700">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-indigo-50 text-indigo-700 rounded-xl font-medium text-sm hover:bg-indigo-100 transition-colors">New Patient</button>
              <button className="p-4 bg-indigo-50 text-indigo-700 rounded-xl font-medium text-sm hover:bg-indigo-100 transition-colors">Schedule</button>
              <button className="p-4 bg-indigo-50 text-indigo-700 rounded-xl font-medium text-sm hover:bg-indigo-100 transition-colors">Billing</button>
              <button className="p-4 bg-indigo-50 text-indigo-700 rounded-xl font-medium text-sm hover:bg-indigo-100 transition-colors">Inventory</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium mb-2 text-slate-700">System Status</h3>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Secure Connection Active
            </div>
            <p className="text-xs text-slate-500 mt-2">All telemetry and MDM policies are currently enforced.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecureBrowser() {
  const { logEvent } = useTelemetry();
  // Usamos igu=1 para permitir que Google se renderice dentro de un iframe (bypass de X-Frame-Options para prototipos)
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');
  const [error, setError] = useState('');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalUrl = inputUrl.trim();
    let displayUrl = finalUrl;
    
    // Si no empieza con http/https
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      // Si tiene un punto y no tiene espacios, asumimos que es un dominio (ej. apple.com)
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
        displayUrl = finalUrl;
      } else {
        // Si no, lo tratamos como una búsqueda en Google
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}&igu=1`;
        displayUrl = finalUrl;
      }
    }

    // Si el usuario intenta ir a google, forzamos el parámetro igu=1 para evitar el bloqueo del iframe
    if (finalUrl.includes('google.com') && !finalUrl.includes('igu=1')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'igu=1';
    }

    setError('');
    setUrl(finalUrl);
    setInputUrl(displayUrl.replace('&igu=1', '').replace('?igu=1', '')); // Ocultamos el parámetro técnico al usuario
    logEvent('NETWORK_ACCESS', `Navigated to: ${displayUrl}`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-4 p-3 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md">
        <div className="flex gap-2">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"><Minus className="w-4 h-4 rotate-90" /></button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"><Minus className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleNavigate} className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-full max-w-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Search Google or enter a URL"
              className="flex-1 text-sm outline-none text-slate-700 bg-transparent"
            />
          </div>
        </form>
      </div>
      <div className="flex-1 bg-[#F5F5F7] flex items-center justify-center relative">
        {error ? (
          <div className="text-center max-w-md p-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Connection Blocked</h2>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        ) : (
          <div className="w-full h-full bg-white flex flex-col items-center justify-center relative">
            <iframe 
              src={url} 
              className="w-full h-full border-none bg-white"
              title="Secure Browser Content"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-none opacity-50">
              Note: Some sites (like Facebook) block iframes. This is a web prototype limitation, not present in the final Tauri app.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TelemetryAdmin() {
  const { logs } = useTelemetry();
  
  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] text-slate-300 font-mono text-sm">
      <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-500">
          <Activity className="w-4 h-4" />
          <span className="font-semibold tracking-wider">ELA_OS // ESF TELEMETRY STREAM</span>
        </div>
        <div className="text-xs text-slate-500">
          SIP: ENABLED | MDM: ENFORCED | KEYLOGGER: ACTIVE
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 hover:bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-500 shrink-0">[{format(log.timestamp, 'HH:mm:ss.SSS')}]</span>
            <span className={cn(
              "shrink-0 w-32 font-semibold",
              log.type === 'KEYSTROKE' ? 'text-blue-400' :
              log.type === 'NETWORK_BLOCKED' ? 'text-red-400' :
              log.type === 'LOGIN' ? 'text-emerald-400' :
              'text-amber-400'
            )}>
              {log.type}
            </span>
            <span className="text-slate-500 shrink-0 w-24">{log.user}</span>
            <span className="text-slate-300 truncate">{log.details}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for events...</div>
        )}
      </div>
    </div>
  );
}

// --- New Apps ---

function KeyAnalyzer() {
  const { logs } = useTelemetry();
  
  // Reconstruct text from keystrokes, grouped by app context
  const sessions = React.useMemo(() => {
    const result: { app: string, text: string, startTime: Date, endTime: Date }[] = [];
    let currentSession: { app: string, text: string, startTime: Date, endTime: Date } | null = null;
    
    const chronologicalLogs = [...logs].reverse();
    for (const log of chronologicalLogs) {
      if (log.type === 'KEYSTROKE') {
        const appName = log.appContext || 'Desktop';
        if (!currentSession || currentSession.app !== appName) {
          if (currentSession) result.push(currentSession);
          currentSession = { app: appName, text: '', startTime: log.timestamp, endTime: log.timestamp };
        }
        
        const key = log.details.replace('Key pressed: ', '');
        if (key === '[BACKSPACE]') {
          currentSession.text = currentSession.text.slice(0, -1);
        } else if (key === '[SPACE]') {
          currentSession.text += ' ';
        } else if (key === '[ENTER]') {
          currentSession.text += '\n';
        } else if (key.length === 1) {
          currentSession.text += key;
        }
        currentSession.endTime = log.timestamp;
      }
    }
    if (currentSession) result.push(currentSession);
    return result.reverse(); // Newest first
  }, [logs]);

  // Calculate word frequency across all sessions
  const allText = sessions.map(s => s.text).join(' ');
  const words = allText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.reduce((acc, word) => {
    const w = word.toLowerCase();
    acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

  const downloadLogs = () => {
    const logText = logs.map(l => `[${format(l.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS')}] ${l.type} - ${l.user} [${l.appContext || 'Desktop'}]: ${l.details}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elaos-telemetry-logs.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] text-slate-800">
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
        <h2 className="font-semibold text-lg flex items-center gap-2"><Keyboard className="w-5 h-5 text-indigo-500"/> Keystroke Interpreter</h2>
        <button onClick={downloadLogs} className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> Export Raw Logs
        </button>
      </div>
      <div className="flex-1 overflow-hidden flex">
        <div className="w-2/3 p-6 border-r border-slate-200 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Reconstructed Text by App</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {sessions.length === 0 && <span className="text-slate-400 italic text-sm">No typing detected yet... Start typing anywhere in the OS.</span>}
            {sessions.map((session, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
                  <span className="font-semibold text-indigo-600 text-sm">{session.app}</span>
                  <span className="text-xs text-slate-400">{format(session.startTime, 'HH:mm:ss')} - {format(session.endTime, 'HH:mm:ss')}</span>
                </div>
                <div className="font-mono text-sm whitespace-pre-wrap text-slate-700">
                  {session.text || <span className="text-slate-300 italic">No printable characters</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/3 p-6 flex flex-col bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Word Frequency</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {sortedWords.length === 0 && <span className="text-slate-400 italic text-sm">No words to analyze.</span>}
            {sortedWords.map(([word, count]) => (
              <div key={word} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="font-medium text-slate-700 truncate mr-2">{word}</span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicWebSystem() {
  const { logEvent } = useTelemetry();
  useEffect(() => {
    logEvent('NETWORK_ACCESS', 'Opened Clinic Web System (External)');
  }, []);
  return (
    <div className="w-full h-full bg-white">
      <iframe 
        src="https://studio--studio-3620711772-b2859.us-central1.hosted.app/login" 
        className="w-full h-full border-none"
        title="Clinic Web System"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}

function ElaDocs() {
  return (
    <div className="flex flex-col h-full bg-[#F5F5F7]">
      <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-2 border-r pr-4">
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-700"><Bold className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-700"><Italic className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-700"><Underline className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-700"><AlignLeft className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-700"><AlignCenter className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-700"><AlignRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div 
          className="w-[800px] min-h-[1000px] bg-white shadow-sm border border-slate-200 p-12 outline-none text-slate-800"
          contentEditable
          suppressContentEditableWarning
        >
          <h1 className="text-3xl font-semibold mb-4">Patient Evaluation Report</h1>
          <p className="mb-4 text-slate-600">Date: {format(new Date(), 'MMMM d, yyyy')}</p>
          <p>Start typing here...</p>
        </div>
      </div>
    </div>
  );
}

function ElaSheets() {
  const rows = Array.from({ length: 20 });
  const cols = Array.from({ length: 8 });
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-4 gap-4 shrink-0">
        <div className="font-medium text-slate-700 text-sm">Inventory_Q3.xlsx</div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-200 bg-slate-100 w-10"></th>
              {cols.map((_, i) => (
                <th key={i} className="border border-slate-200 bg-slate-50 p-2 font-medium text-slate-600 text-center w-32">
                  {String.fromCharCode(65 + i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-slate-200 bg-slate-50 text-center text-slate-500 font-medium p-1">{rowIndex + 1}</td>
                {cols.map((_, colIndex) => (
                  <td key={colIndex} className="border border-slate-200 p-0">
                    <input type="text" className="w-full h-full p-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ElaPhotos() {
  return (
    <div className="flex h-full bg-[#1E1E1E] text-slate-300">
      <div className="w-64 border-r border-white/10 bg-black/20 p-4 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Adjustments</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Exposure</span><span>0.0</span></div>
              <input type="range" className="w-full accent-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Contrast</span><span>+12</span></div>
              <input type="range" className="w-full accent-blue-500" defaultValue="60" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Highlights</span><span>-5</span></div>
              <input type="range" className="w-full accent-blue-500" defaultValue="45" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 rounded bg-white/5 hover:bg-white/10 flex flex-col items-center gap-1 text-xs"><Crop className="w-4 h-4"/> Crop</button>
            <button className="p-2 rounded bg-white/5 hover:bg-white/10 flex flex-col items-center gap-1 text-xs"><RotateCw className="w-4 h-4"/> Rotate</button>
            <button className="p-2 rounded bg-white/5 hover:bg-white/10 flex flex-col items-center gap-1 text-xs"><Wand2 className="w-4 h-4"/> Auto</button>
            <button className="p-2 rounded bg-white/5 hover:bg-white/10 flex flex-col items-center gap-1 text-xs"><SlidersHorizontal className="w-4 h-4"/> Filter</button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8 flex items-center justify-center bg-black/40">
        <div className="relative group">
          <img 
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2000&auto=format&fit=crop" 
            alt="Patient Before/After" 
            className="max-h-[600px] object-contain shadow-2xl ring-1 ring-white/10"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Before / After</span>
            <span className="text-white/50">|</span>
            <span>Zoom: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- OS Components ---

const APPS = [
  { id: 'clinic-web', name: 'Clinic System', icon: Monitor, color: 'bg-indigo-600', component: ClinicWebSystem },
  { id: 'docs', name: 'Ela Docs', icon: FileText, color: 'bg-blue-500', component: ElaDocs },
  { id: 'sheets', name: 'Ela Sheets', icon: Table, color: 'bg-emerald-500', component: ElaSheets },
  { id: 'photos', name: 'Ela Photos', icon: ImageIcon, color: 'bg-purple-500', component: ElaPhotos },
  { id: 'browser', name: 'Secure Web', icon: Globe, color: 'bg-sky-500', component: SecureBrowser },
  { id: 'interpreter', name: 'Key Interpreter', icon: Keyboard, color: 'bg-rose-500', component: KeyAnalyzer },
  { id: 'telemetry', name: 'ESF Audit', icon: ShieldAlert, color: 'bg-slate-800', component: TelemetryAdmin },
];

const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506744626753-eba7bc1373ee?q=80&w=2564&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2564&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2564&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2564&auto=format&fit=crop'
];

export default function Desktop({ onLock, onShowExit }: { onLock?: () => void, onShowExit?: () => void }) {
  const [time, setTime] = useState(new Date());
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'about' | 'settings' | 'store' | null>(null);
  const { logEvent, setAppContext } = useTelemetry();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const bgTimer = setInterval(() => setBgIndex(prev => (prev + 1) % BACKGROUNDS.length), 60000);
    return () => {
      clearInterval(timer);
      clearInterval(bgTimer);
    };
  }, []);

  useEffect(() => {
    const appName = APPS.find(a => a.id === activeApp)?.name || 'Desktop';
    setAppContext(appName);
  }, [activeApp, setAppContext]);

  const openApp = (appId: string) => {
    if (!openApps.includes(appId)) {
      setOpenApps([...openApps, appId]);
      logEvent('APP_OPEN', `Launched application: ${appId}`);
    }
    setActiveApp(appId);
  };

  const closeApp = (appId: string) => {
    const newOpenApps = openApps.filter(id => id !== appId);
    setOpenApps(newOpenApps);
    if (activeApp === appId) {
      setActiveApp(newOpenApps.length > 0 ? newOpenApps[newOpenApps.length - 1] : null);
    }
    logEvent('APP_CLOSE', `Closed application: ${appId}`);
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cover bg-center flex flex-col relative transition-all duration-1000"
      style={{ backgroundImage: `url(${BACKGROUNDS[bgIndex]})` }}
    >
      {/* Top Menu Bar (macOS style) */}
      <div className="h-7 glass-panel-dark text-white/90 text-[13px] font-medium px-2 flex items-center justify-between z-50 rounded-none border-x-0 border-t-0 border-b-white/10 relative">
        {activeMenu && (
          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
        )}
        <div className="flex items-center gap-1 z-50">
          {/* ElaOS Menu */}
          <div className="relative">
            <button onClick={() => setActiveMenu(activeMenu === 'apple' ? null : 'apple')} className={cn("flex items-center gap-2 px-2 py-1 rounded transition-colors", activeMenu === 'apple' ? "bg-white/20" : "hover:bg-white/10")}>
              <Command className="w-3.5 h-3.5" />
              <span className="font-semibold">ElaOS</span>
            </button>
            {activeMenu === 'apple' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-2xl py-1 text-slate-800">
                <button onClick={() => { setActiveMenu(null); setActiveModal('about'); }} className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">About ElaOS</button>
                <div className="h-px bg-slate-200/50 my-1" />
                <button onClick={() => { setActiveMenu(null); setActiveModal('settings'); }} className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">System Settings...</button>
                <button onClick={() => { setActiveMenu(null); setActiveModal('store'); }} className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">App Store</button>
                <div className="h-px bg-slate-200/50 my-1" />
                <button onClick={() => { setActiveMenu(null); onShowExit?.(); }} className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Force Quit...</button>
                <button onClick={() => { setActiveMenu(null); onShowExit?.(); }} className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Shut Down...</button>
                <div className="h-px bg-slate-200/50 my-1" />
                <button onClick={() => { setActiveMenu(null); onLock?.(); }} className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Lock Screen</button>
              </div>
            )}
          </div>
          
          {activeApp && (
            <span className="font-semibold px-2">{APPS.find(a => a.id === activeApp)?.name}</span>
          )}
          
          {/* File Menu */}
          <div className="relative">
            <button onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')} className={cn("px-2 py-1 rounded transition-colors", activeMenu === 'file' ? "bg-white/20" : "hover:bg-white/10")}>File</button>
            {activeMenu === 'file' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-2xl py-1 text-slate-800">
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">New Window</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Open...</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Open Recent</button>
                <div className="h-px bg-slate-200/50 my-1" />
                <button onClick={() => { setActiveMenu(null); if (activeApp) closeApp(activeApp); }} className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Close Window</button>
              </div>
            )}
          </div>
          
          {/* Edit Menu */}
          <div className="relative">
            <button onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')} className={cn("px-2 py-1 rounded transition-colors", activeMenu === 'edit' ? "bg-white/20" : "hover:bg-white/10")}>Edit</button>
            {activeMenu === 'edit' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-2xl py-1 text-slate-800">
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Undo</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Redo</button>
                <div className="h-px bg-slate-200/50 my-1" />
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Cut</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Copy</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Paste</button>
              </div>
            )}
          </div>
          
          {/* View Menu */}
          <div className="relative">
            <button onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')} className={cn("px-2 py-1 rounded transition-colors", activeMenu === 'view' ? "bg-white/20" : "hover:bg-white/10")}>View</button>
            {activeMenu === 'view' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-2xl py-1 text-slate-800">
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Enter Full Screen</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Show Sidebar</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 z-50">
          {/* Wifi Menu */}
          <div className="relative">
            <button onClick={() => setActiveMenu(activeMenu === 'wifi' ? null : 'wifi')} className={cn("p-1.5 rounded transition-colors", activeMenu === 'wifi' ? "bg-white/20" : "hover:bg-white/10")}>
              <Wifi className="w-3.5 h-3.5" />
            </button>
            {activeMenu === 'wifi' && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-2xl py-2 text-slate-800">
                <div className="px-4 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Network</div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm flex items-center justify-between">
                  <span>SecureNet_5G</span>
                  <Wifi className="w-3 h-3" />
                </button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm flex items-center justify-between">
                  <span>Guest_Network</span>
                </button>
                <div className="h-px bg-slate-200/50 my-1" />
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Network Preferences...</button>
              </div>
            )}
          </div>
          
          {/* Battery Menu */}
          <div className="relative">
            <button onClick={() => setActiveMenu(activeMenu === 'battery' ? null : 'battery')} className={cn("p-1.5 rounded transition-colors", activeMenu === 'battery' ? "bg-white/20" : "hover:bg-white/10")}>
              <BatteryMedium className="w-4 h-4" />
            </button>
            {activeMenu === 'battery' && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-2xl py-2 text-slate-800">
                <div className="px-4 py-1 text-sm font-medium">Battery: 85%</div>
                <div className="px-4 py-1 text-xs text-slate-500">Power Source: Power Adapter</div>
                <div className="h-px bg-slate-200/50 my-1" />
                <button className="w-full text-left px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-sm">Battery Settings...</button>
              </div>
            )}
          </div>
          
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
            <Search className="w-3.5 h-3.5" />
          </button>
          <span className="px-2">{format(time, 'EEE MMM d  HH:mm')}</span>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="flex-1 relative p-8">
        <AnimatePresence>
          {activeModal === 'about' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col items-center z-[100]"
            >
              <Command className="w-16 h-16 text-indigo-600 mb-4" />
              <h2 className="text-xl font-bold text-slate-800">ElaOS</h2>
              <p className="text-sm text-slate-500 mb-4">Version 1.0.0 (Build 2026)</p>
              <p className="text-xs text-slate-400 text-center mb-6">Strict MDM Enforced.<br/>All rights reserved.</p>
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium w-full transition-colors">Close</button>
            </motion.div>
          )}
          
          {activeModal === 'settings' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col z-[100]"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4">System Settings</h2>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">MDM Policy</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">ENFORCED</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Telemetry</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">ACTIVE</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Kiosk Mode</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">LOCKED</span>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium w-full transition-colors">Close Settings</button>
            </motion.div>
          )}

          {activeModal === 'store' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col items-center z-[100]"
            >
              <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
              <h2 className="text-lg font-bold text-slate-800 mb-2">Access Denied</h2>
              <p className="text-sm text-slate-500 text-center mb-6">The App Store is disabled by your system administrator.</p>
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium w-full transition-colors">Dismiss</button>
            </motion.div>
          )}

          {openApps.map((appId) => {
            const app = APPS.find(a => a.id === appId);
            if (!app) return null;
            const isActive = activeApp === appId;
            
            // Calculate a stable cascading position based on appId length/chars
            const hash = appId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const offset = (hash % 10) * 30 + 50;
            
            return (
              <motion.div
                key={appId}
                drag
                dragMomentum={false}
                onPointerDownCapture={() => setActiveApp(appId)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ 
                  zIndex: isActive ? 50 : 10,
                  top: offset,
                  left: offset
                }}
                className="absolute w-[800px] h-[600px] glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/20"
              >
                {/* Window Chrome */}
                <div className="h-12 bg-white/50 backdrop-blur-md border-b border-slate-200/50 flex items-center px-4 shrink-0 cursor-grab active:cursor-grabbing">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); closeApp(appId); }}
                      className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center group"
                    >
                      <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 flex items-center justify-center group">
                      <Minus className="w-2 h-2 text-amber-900 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 flex items-center justify-center group">
                      <Maximize2 className="w-2 h-2 text-emerald-900 opacity-0 group-hover:opacity-100" />
                    </button>
                  </div>
                  <div className="flex-1 text-center text-sm font-medium text-slate-700 pointer-events-none">
                    {app.name}
                  </div>
                  <div className="w-16" /> {/* Spacer for centering */}
                </div>
                
                {/* App Content */}
                <div className="flex-1 overflow-hidden relative bg-white" onPointerDown={(e) => e.stopPropagation()}>
                  <app.component />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel rounded-3xl p-2 flex gap-2 shadow-2xl border-white/20">
        {APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="relative group outline-none"
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-110",
              app.color
            )}>
              <app.icon className="w-7 h-7" />
            </div>
            {openApps.includes(app.id) && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-800" />
            )}
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
              {app.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
