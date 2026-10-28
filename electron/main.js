const { app, BrowserWindow, protocol, session } = require('electron');
const path = require('path');
const fs = require('fs');

// 1. Register custom scheme as privileged before app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

// 2. Performance & WebGL / Audio flags
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function setupAppProtocol() {
  protocol.handle('app', async (request) => {
    try {
      const url = new URL(request.url);
      let pathname = decodeURIComponent(url.pathname);

      // Default to /index.html if root
      if (!pathname || pathname === '/' || pathname === '\\') {
        pathname = '/index.html';
      }

      // Base directory is the static export folder /out
      const outDir = path.join(__dirname, '../out');
      let targetPath = path.normalize(path.join(outDir, pathname));

      // Security check: ensure path stays within outDir
      if (!targetPath.startsWith(path.normalize(outDir))) {
        return new Response('Forbidden', { status: 403 });
      }

      // Check if file exists, or fallback to .html, or SPA fallback
      if (!fs.existsSync(targetPath)) {
        if (fs.existsSync(targetPath + '.html')) {
          targetPath = targetPath + '.html';
        } else if (fs.existsSync(path.join(targetPath, 'index.html'))) {
          targetPath = path.join(targetPath, 'index.html');
        } else {
          targetPath = path.join(outDir, 'index.html');
        }
      }

      const data = await fs.promises.readFile(targetPath);
      const contentType = getMimeType(targetPath);

      return new Response(data, {
        status: 200,
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (err) {
      console.error('Error handling app:// request:', err);
      return new Response('Not Found', { status: 404 });
    }
  });
}

function createWindow() {
  const icoCandidates = [
    path.join(__dirname, '../build/icon.ico'),
    path.join(__dirname, '../public/img/icon.ico'),
  ];
  const iconPath = icoCandidates.find((p) => fs.existsSync(p));

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    resizable: true,
    title: 'Azúcar Rush',
    icon: iconPath,
    autoHideMenuBar: true,
    backgroundColor: '#fff1f2',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      spellcheck: false,
    },
  });

  // Remove menu completely
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);

  // Automatic permission handler for pointer lock, full screen, audio, etc.
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true);
  });

  // Keyboard controls: F11 toggles fullscreen. ESC must NOT close the window or exit fullscreen.
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      if (input.key === 'F11') {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
        event.preventDefault();
      }
      // Guarantee ESC does not exit fullscreen or close the window (handled by game pause)
      if (input.key === 'Escape') {
        // Allow in-page keydown to receive Escape for pause without window exit
      }
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app via custom protocol
  mainWindow.loadURL('app://azucar-rush/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setupAppProtocol();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
