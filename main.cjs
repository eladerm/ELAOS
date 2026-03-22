const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let isUnlocked = false;
let unlockTimeout;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    kiosk: true, // Modo Kiosco (Pantalla completa, sin bordes, siempre encima)
    alwaysOnTop: true,
    fullscreen: true,
    frame: false,
    show: false, // Ocultar hasta que esté listo para evitar pantalla blanca
    backgroundColor: '#000000', // Fondo negro mientras carga
    skipTaskbar: true, // Ocultar de la barra de tareas
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Forzar el nivel más alto de "siempre encima" para tapar el Menú Inicio de Windows
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  // Mostrar la ventana solo cuando esté lista para renderizar
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Prevenir que se cierre con Alt+F4
  mainWindow.on('close', (e) => {
    if (!isUnlocked) {
      e.preventDefault();
    }
  });

  // Recuperar el foco de forma ultra-agresiva si lo pierde (ej. al presionar la tecla Windows)
  mainWindow.on('blur', () => {
    if (!isUnlocked && mainWindow) {
      setTimeout(() => {
        mainWindow.setKiosk(true);
        mainWindow.setFullScreen(true);
        mainWindow.setAlwaysOnTop(true, 'screen-saver');
        mainWindow.focus();
      }, 10);
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
  
  // Bloquear otros atajos comunes y la tecla Windows (Super/Meta)
  globalShortcut.register('Super', () => {});
  globalShortcut.register('Meta', () => {});
  globalShortcut.register('CommandOrControl+Esc', () => {});
  globalShortcut.register('Alt+Space', () => {});
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
  if (mainWindow) {
    mainWindow.destroy(); // Destruye la ventana inmediatamente
  }
  app.exit(0); // Cierra el proceso de Node.js de forma forzada
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
