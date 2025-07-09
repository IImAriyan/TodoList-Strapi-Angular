import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true
    }
  });

  const indexPath = url.format({
    pathname: path.join(__dirname, '../dist/todo-list-frontend/browser/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(indexPath);
  mainWindow.title = 'Todo List App';

mainWindow.setMenuBarVisibility(false);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

