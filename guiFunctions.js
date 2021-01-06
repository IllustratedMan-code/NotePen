const electron = require('electron');
const fs = require('fs');


electron.ipcRenderer.on('save', (event) => {
    saveFile(drawings);
});

function saveFile(Strokes) {
    csv = "";
    Strokes.forEach(function(row){
        rowstr = row.x0 + "," + row.y0 + "," + row.x1 + "," + row.y1;
        csv += rowstr + "\r\n";
    });
    console.log(csv);
}

