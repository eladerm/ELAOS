const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let isUnlocked = false;
let unlockTimeout;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    kiosk: true, // Modo Kiosco (Pantalla completa, sin bordes, siempre encima)
    alwaysOnTop: true,
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Prevenir que se cierre con Alt+F4
  mainWindow.on('close', (e) => {
    if (!isUnlocked) {
      e.preventDefault();
    }
  });

  // Recuperar el foco si lo pierde
  mainWindow.on('blur', () => {
    if (!isUnlocked && mainWindow) {
      mainWindow.focus();
    }
  });

  // Cargar la app
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Registrar el atajo secreto para salir (Ctrl+Shift+Q)
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('show-exit-dialog');
    }
  });
  
  // Bloquear otros atajos comunes
  globalShortcut.register('CommandOrControl+W', () => {});
  globalShortcut.register('F11', () => {});
  globalShortcut.register('CommandOrControl+R', () => {});
  globalShortcut.register('F5', () => {});
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('quit-app', () => {
  isUnlocked = true;
  app.quit();
});

ipcMain.on('unlock-app', () => {
  isUnlocked = true;
  if (mainWindow) {
    mainWindow.setKiosk(false);
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setFullScreen(false);
  }
  
  // Volver a bloquear después de 60 segundos
  clearTimeout(unlockTimeout);
  unlockTimeout = setTimeout(() => {
    isUnlocked = false;
    if (mainWindow) {
      mainWindow.setKiosk(true);
      mainWindow.setAlwaysOnTop(true);
      mainWindow.setFullScreen(true);
      mainWindow.focus();
    }
  }, 60000);
});
