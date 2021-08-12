import 'dotenv/config';

import {
  app,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  shell,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import url from 'url';

import i18n from '../i18n';

import {
  getWindowBounds,
  setWindowBounds,
} from './utils/windowBoundsController';

let mainWindow: Electron.BrowserWindow | null;

console.log("app.getPath('userData')");
console.log(app.getPath('userData'));

function createWindow() {
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`);

  if (app.dock) {
    app.dock.setIcon(icon);
  }

  mainWindow = new BrowserWindow({
    ...getWindowBounds(),
    icon,
    minWidth: 512,
    minHeight: 556,
    maxWidth: 616,
    maxHeight: 664,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      enableRemoteModule: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  mainWindow.on('close', () => {
    setWindowBounds(mainWindow?.getBounds());
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function createMenu() {
  await i18n.loadNamespaces('applicationMenu');

  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Apollo',
      submenu: [
        {
          label: i18n.t('applicationMenu:exit'),
          role: 'quit',
          accelerator: 'CmdOrCtrl+Q',
        },
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
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            shell.openExternal('https://paymetrade.com/');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

app.disableHardwareAcceleration();

app.on('ready', () => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.allowRendererProcessReuse = true;
