const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onShowExitDialog: (callback) => ipcRenderer.on('show-exit-dialog', (_event, value) => callback(value)),
  quitApp: () => ipcRenderer.send('quit-app'),
  unlockApp: () => ipcRenderer.send('unlock-app')
});
