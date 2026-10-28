const { contextBridge } = require('electron');

// Expose safe APIs to the renderer process if needed
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
});
