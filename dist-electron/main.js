import { app, BrowserWindow } from 'electron';
import { resolveUiPath } from './pathresolver.js';
import { isDev } from './utils.js';
app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({});
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5173');
    }
    else {
        mainWindow.loadFile(resolveUiPath());
    }
    mainWindow.on('closed', () => {
        app.quit();
    });
});
