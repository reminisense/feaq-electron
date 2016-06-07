const electron = require('electron');
const ipc = require('electron').ipcMain;
const fs = require('fs');
const development = true;


global.urls = {
    app_url: development && false ? 'http://localhost:8000' : 'http://four.featherq.com',
    websocket_url: "ws://188.166.234.33:443/socket/server.php"
};

global.windowProperties = {
    width: development ? 800 : 400,
    height: development ? 800 : 300,
    transparent: false,
    alwaysOnTop: false,
    icon: 'images/favicon-32x32.png'
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

var mainWindow = null;
var pqWindow = null;
var terminalWindow = null;


function createLoginWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow(global.windowProperties);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/views/login.html');

    // Open the DevTools.
    if(development) mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    //close windows
    if(terminalWindow !== null){
        terminalWindow.close();
    }
    if(pqWindow !== null){
        pqWindow.close();
    }
}

function createTerminalsWindow () {
    //save json file
    fs.writeFile('settings.json', JSON.stringify(global.ids));

    terminalWindow = new BrowserWindow(global.windowProperties);
    terminalWindow.loadURL('file://' + __dirname + '/views/terminals.html');
    if(development) terminalWindow.webContents.openDevTools();
    terminalWindow.on('closed', function () {
        terminalWindow = null;
    });

    //close windows
    if(mainWindow !== null){
        mainWindow.close();
    }
    if(pqWindow !== null){
        pqWindow.close();
    }
}

function createProcessQueueWindow () {
    // Create the browser window.
    var pqHeight = process.platform !== 'darwin' ? 200 : 163;
    pqWindow = new BrowserWindow({
        width: development ? 800 : 400,
        height: development ? 800 : pqHeight,
        transparent: false,
        alwaysOnTop: true,
        icon: 'images/favicon-32x32.png'
    });
    pqWindow.loadURL('file://' + __dirname + '/views/index.html');
    if(development) pqWindow.webContents.openDevTools();
    pqWindow.on('closed', function () {
        pqWindow = null;
    });

    //close windows
    if(mainWindow !== null){
        mainWindow.close();
    }
    if(terminalWindow !== null){
        terminalWindow.close();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.dock.setIcon('images/favicon-32x32.png');


app.on('ready', createLoginWindow);
ipc.on('terminal-chosen', createProcessQueueWindow);
ipc.on('login-success', createTerminalsWindow);

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
    if (mainWindow === null && pqWindow === null && terminalWindow === null) {
        global.ids.user_id = null;
        createLoginWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

