const { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } = require('electron');
let win = null;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    }
  });

     // and load the index.html of the app.
    win.loadFile('index.html');
    //console.log(dialog.showOpenDialog({ properties: ['openDirectory'] }));
}




const menuTemplate = [{
    label: "File",
    submenu: [
        {
            label:"Save",
            click: () => {win.webContents.send("save")}
        },
        {
            label:"Open",
            click: () => {win.webContents.send("open")}
        },
        {
            label:"New",
            click: () => {win.webContents.send("new")}
        }
    ]
}]
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
ipcMain.on('OpenFileDialog', (event, arg) => {
    let f = dialog.showOpenDialogSync({ properties: ['openFile'] });
    console.log(f);
    event.reply('FileDialogPath', f);
});

app.whenReady().then(createWindow);

