const { app, BrowserWindow, Menu, MenuItem } = require('electron');
let win = null;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

     // and load the index.html of the app.
    win.loadFile('index.html');
}

const menuTemplate = [{
    label: "File",
    submenu: [
        {
            label:"Save",
            click: () => {win.webContents.send("save")}
        }
    ]
}]
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.whenReady().then(createWindow);
