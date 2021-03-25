const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const tcpHandler = require('./session.js');
 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
var client;

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    width: 900,
    height: 750
  });

  mainWindow.loadFile(path.join(__dirname, '/chat/chat.html'));
  mainWindow.webContents.openDevTools();

  // INIT CONNECTION THEN LOAD UPON SUCCESS
  tcpHandler.joinSession(mainWindow).then((client) => {
    // send message to template to load chat.
    this.client = client;
    
    // Restart app on client disconnect.
    this.client.getSocket().on('end', () => {
      app.relaunch();
      app.exit();
    });

    mainWindow.webContents.send('ready');
    mainWindow.webContents.on('did-finish-load', ()=>{
      mainWindow.webContents.send('ready');
    })
  }), (error) => {
    console.log(error);
  }

};

app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// Emit message to tcp client to write on socket
ipcMain.on('handle-message', (_event, arg) => {
  this.client.sendMessage(arg)
});
