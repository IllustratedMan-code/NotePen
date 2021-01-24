const { dialog } = require('electron').remote;
let FileButton = document.getElementById("FilePath");
let FileMenu = document.getElementById("FileDirectory");
FileButton.addEventListener("click", event => {
    //SetFile(".");
    OpenFileMenu();
});
function OpenFileMenu(){
    FileMenu.style.width = 0;
}
function SetFile(FilePath){
    //electron.ipcRenderer.sendSync("OpenFileDialog", FilePath);
    let f = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
    FileButton.textContent = f;
    //console.log(f[0]);
    //electron.ipcRenderer.on("FileDialogPath", (event, arg) => {
    //    FileButton.textContent = arg;
    //});
}

