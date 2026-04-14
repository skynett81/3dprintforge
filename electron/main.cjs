/**
 * 3DPrintForge Electron Main Process
 *
 * Wraps the existing Node.js + vanilla JS web app as a native desktop app.
 * - Spawns the server (server/index.js) as a child process
 * - Loads the web UI in a BrowserWindow
 * - System tray with printer status
 * - Native notifications bridge (renderer → main → OS)
 * - Native application menu with keyboard shortcuts
 * - Auto-start at login + single instance lock
 * - Auto-updater via GitHub releases
 * - Custom protocol handler: 3dprintforge://
 */

const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, shell, dialog, nativeImage, session } = require('electron');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// ── Globals ──

const IS_DEV = process.env.NODE_ENV === 'development' || !app.isPackaged;
const SERVER_PATH = path.join(__dirname, '..', 'server', 'index.js');
const ICON_PATH = path.join(__dirname, 'assets', 'icon.png');
const TRAY_ICON_PATH = path.join(__dirname, 'assets', 'tray.png');

let mainWindow = null;
let tray = null;
let serverProcess = null;
let isQuitting = false;
let updateStatus = null;

// ── Single instance lock ──

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// ── Custom protocol ──

try {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('3dprintforge', process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient('3dprintforge');
  }
} catch (e) {
  console.warn('[electron] Could not register 3dprintforge:// protocol:', e.message);
}

// ── Server child process ──

async function _probeServer() {
  // Bypass self-signed cert check via the low-level http module
  return new Promise((resolve) => {
    const https = require('node:https');
    const req = https.get('https://localhost:3443/api/health', {
      rejectUnauthorized: false,
      timeout: 2000,
    }, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function startServer() {
  if (serverProcess) return;
  // Skip spawn if server is already running externally (e.g. via systemd)
  if (await _probeServer()) {
    console.log('[electron] Server already running externally — using existing instance');
    return;
  }
  console.log('[electron] Starting 3DPrintForge server...');

  const serverEnv = {
    ...process.env,
    NODE_ENV: IS_DEV ? 'development' : 'production',
    ELECTRON_RUN_AS_NODE: '1',
  };

  serverProcess = spawn(process.execPath, [SERVER_PATH], {
    cwd: path.join(__dirname, '..'),
    env: serverEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.log('[server]', text);
  });

  serverProcess.stderr.on('data', (data) => {
    const text = data.toString().trim();
    if (text) console.error('[server:err]', text);
  });

  serverProcess.on('exit', (code) => {
    console.log(`[electron] Server exited with code ${code}`);
    serverProcess = null;
    if (!isQuitting && code !== 0) {
      // Server crashed — restart after 3s
      setTimeout(startServer, 3000);
    }
  });
}

function stopServer() {
  if (!serverProcess) return;
  console.log('[electron] Stopping server...');
  serverProcess.kill('SIGTERM');
  serverProcess = null;
}

// ── Wait for server to be ready ──

async function waitForServer(maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await _probeServer()) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

// ── Main window ──

function createWindow() {
  const iconImage = fs.existsSync(ICON_PATH) ? nativeImage.createFromPath(ICON_PATH) : undefined;

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    icon: iconImage,
    title: '3DPrintForge',
    backgroundColor: '#1a1d21',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // needed for IPC in preload
    },
    show: false, // don't show until ready
  });

  // Accept self-signed cert on localhost
  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    if (request.hostname === 'localhost' || request.hostname === '127.0.0.1') {
      callback(0); // trust
    } else {
      callback(-3); // default behavior
    }
  });

  mainWindow.loadURL('https://localhost:3443');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      // Show tray notification on first hide
      if (tray && !mainWindow._hiddenOnce) {
        mainWindow._hiddenOnce = true;
        tray.displayBalloon?.({
          title: '3DPrintForge',
          content: 'Running in the tray. Right-click the icon to show or quit.',
        });
      }
    }
  });

  // Open external links in the system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://localhost') || url.startsWith('http://localhost')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (IS_DEV) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// ── System tray ──

function createTray() {
  const trayImage = fs.existsSync(TRAY_ICON_PATH)
    ? nativeImage.createFromPath(TRAY_ICON_PATH)
    : fs.existsSync(ICON_PATH)
      ? nativeImage.createFromPath(ICON_PATH).resize({ width: 16, height: 16 })
      : nativeImage.createEmpty();

  tray = new Tray(trayImage);
  tray.setToolTip('3DPrintForge');
  updateTrayMenu(0, 0);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function updateTrayMenu(onlineCount, totalCount) {
  if (!tray) return;
  const statusText = totalCount > 0
    ? `Printers: ${onlineCount}/${totalCount} online`
    : 'No printers configured';

  const menu = Menu.buildFromTemplate([
    { label: '3DPrintForge', enabled: false },
    { label: statusText, enabled: false },
    { type: 'separator' },
    {
      label: 'Open Dashboard',
      click: () => {
        if (mainWindow) { mainWindow.show(); mainWindow.focus(); }
      },
    },
    {
      label: 'Open Firmware Updates',
      click: () => {
        if (mainWindow) { mainWindow.show(); mainWindow.loadURL('https://localhost:3443/#firmware-updates'); }
      },
    },
    {
      label: 'Open in Browser',
      click: () => shell.openExternal('https://localhost:3443'),
    },
    { type: 'separator' },
    {
      label: 'Check for Updates',
      click: () => checkForUpdates(true),
    },
    { type: 'separator' },
    {
      label: 'Quit 3DPrintForge',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);
  tray.setToolTip(`3DPrintForge — ${statusText}`);
}

// ── Tray status poller ──

let statusPollTimer = null;

function _httpGetJson(url) {
  return new Promise((resolve, reject) => {
    const https = require('node:https');
    const req = https.get(url, { rejectUnauthorized: false, timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function pollPrinterStatus() {
  try {
    const printers = await _httpGetJson('https://localhost:3443/api/printers');
    if (!Array.isArray(printers)) return;
    // Online count: approximate via check of any state-bearing field, or just total for now
    updateTrayMenu(printers.length, printers.length);
  } catch {}
}

// ── Native notifications bridge ──

ipcMain.handle('notification:show', (event, options) => {
  if (!Notification.isSupported()) return false;
  const n = new Notification({
    title: options.title || '3DPrintForge',
    body: options.body || '',
    icon: fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
    silent: options.silent || false,
  });
  n.on('click', () => {
    if (mainWindow) { mainWindow.show(); mainWindow.focus(); }
  });
  n.show();
  return true;
});

ipcMain.handle('app:get-info', () => ({
  version: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
  electronVersion: process.versions.electron,
  nodeVersion: process.versions.node,
}));

ipcMain.handle('app:set-auto-launch', (event, enabled) => {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    openAsHidden: true, // start minimized to tray
  });
  return app.getLoginItemSettings().openAtLogin;
});

ipcMain.handle('app:get-auto-launch', () => {
  return app.getLoginItemSettings().openAtLogin;
});

ipcMain.handle('updater:check', () => checkForUpdates(false));
ipcMain.handle('updater:status', () => updateStatus);

// ── Application menu ──

function createMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: '3DPrintForge',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { label: 'Check for Updates...', click: () => checkForUpdates(true) },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: createWindow,
        },
        { type: 'separator' },
        {
          label: 'Open Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => mainWindow?.loadURL('https://localhost:3443/'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Printers',
      submenu: [
        {
          label: 'Firmware Updates',
          accelerator: 'CmdOrCtrl+Shift+F',
          click: () => mainWindow?.loadURL('https://localhost:3443/#firmware-updates'),
        },
        {
          label: 'Resources',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => mainWindow?.loadURL('https://localhost:3443/#resources'),
        },
        {
          label: 'OctoPrint Admin',
          click: () => mainWindow?.loadURL('https://localhost:3443/#octoprint'),
        },
        {
          label: 'JSCAD Studio',
          accelerator: 'CmdOrCtrl+Shift+J',
          click: () => mainWindow?.loadURL('https://localhost:3443/#jscad'),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://skynett81.github.io/3dprintforge/'),
        },
        {
          label: 'GitHub Repository',
          click: () => shell.openExternal('https://github.com/skynett81/3dprintforge'),
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/skynett81/3dprintforge/issues'),
        },
        { type: 'separator' },
        {
          label: 'Check for Updates...',
          click: () => checkForUpdates(true),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── Auto-updater ──

function checkForUpdates(showDialog) {
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.autoDownload = false;
    autoUpdater.on('update-available', (info) => {
      updateStatus = { status: 'available', version: info.version };
      if (showDialog) {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Update Available',
          message: `3DPrintForge ${info.version} is available.`,
          detail: info.releaseNotes?.toString().slice(0, 500) || '',
          buttons: ['Download', 'Later'],
          defaultId: 0,
        }).then(({ response }) => {
          if (response === 0) autoUpdater.downloadUpdate();
        });
      }
    });
    autoUpdater.on('update-not-available', () => {
      updateStatus = { status: 'not-available' };
      if (showDialog) {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'No Updates',
          message: 'You\'re on the latest version of 3DPrintForge.',
        });
      }
    });
    autoUpdater.on('update-downloaded', () => {
      updateStatus = { status: 'downloaded' };
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'A new version has been downloaded. Restart to install?',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
      }).then(({ response }) => {
        if (response === 0) {
          isQuitting = true;
          autoUpdater.quitAndInstall();
        }
      });
    });
    autoUpdater.on('error', (err) => {
      updateStatus = { status: 'error', error: err.message };
      if (showDialog) {
        dialog.showErrorBox('Update Error', err.message);
      }
    });
    autoUpdater.checkForUpdates();
  } catch (e) {
    console.error('[updater] error:', e.message);
    if (showDialog) dialog.showErrorBox('Update Error', e.message);
  }
}

// ── App lifecycle ──

app.whenReady().then(async () => {
  createMenu();
  startServer();

  console.log('[electron] Waiting for server to be ready...');
  const ready = await waitForServer(60);
  if (!ready) {
    dialog.showErrorBox('3DPrintForge', 'Failed to start the server. Check logs for details.');
    app.quit();
    return;
  }
  console.log('[electron] Server ready');

  createWindow();
  createTray();

  // Poll printer status every 30 seconds
  statusPollTimer = setInterval(pollPrinterStatus, 30000);
  pollPrinterStatus();

  // Initial update check 1 minute after launch
  setTimeout(() => checkForUpdates(false), 60000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else if (mainWindow) { mainWindow.show(); mainWindow.focus(); }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit — stay in tray
  }
});

app.on('before-quit', () => {
  isQuitting = true;
  if (statusPollTimer) clearInterval(statusPollTimer);
  stopServer();
});

// Handle deep-link on Windows/Linux (second-instance event)
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    // Parse 3dprintforge://path and navigate
    const route = url.replace('3dprintforge://', '');
    mainWindow.loadURL(`https://localhost:3443/${route}`);
  }
});
