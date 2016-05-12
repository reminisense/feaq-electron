const electron = require('electron');
const ipc = require('ipc');

global.urls = {
    app_url: 'http://localhost:8000',
    websocket_url: "ws://188.166.234.33:443/socket/server.php"
};

global.windowProperties = {
    width: 800,
    height: 800,
    transparent: true,
    alwaysOnTop: false
};

global.ids = {
    user_id: null,
    business_id: null,
    service_id: null,
    terminal_id: null
};

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
//var mainWindow;

var mainWindow;
var pqWindow;
var terminalWindow;

function createLoginWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow(global.windowProperties);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/views/login.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

function createTerminalsWindow () {
    terminalWindow = new BrowserWindow(global.windowProperties);

    terminalWindow.loadURL('file://' + __dirname + '/views/terminals.html');
    terminalWindow.webContents.openDevTools();
    terminalWindow.on('closed', function () {
        terminalWindow = null
    });
    mainWindow.close();
}

function createProcessQueueWindow () {
    // Create the browser window.
    pqWindow = new BrowserWindow(global.windowProperties);
    pqWindow.loadURL('file://' + __dirname + '/views/index.html');
    pqWindow.webContents.openDevTools();
    pqWindow.on('closed', function () {
        pqWindow = null
    });
    terminalWindow.close();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createLoginWindow);
ipc.on('login-success', createTerminalsWindow);
ipc.on('terminal-chosen', createProcessQueueWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        //createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

