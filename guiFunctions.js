const electron = require('electron');
const fs = require('fs');
const parse = require('csv-parse');


electron.ipcRenderer.on('save', (event) => {
    saveFile(drawings);
});

electron.ipcRenderer.on('open', (event) => {
    openFile("./note.txt");
});
electron.ipcRenderer.on('new', (event) => {
    drawings.splice(0, drawings.length);
    redrawCanvas();
});
function saveFile(Strokes) {
    let csv = "";
    Strokes.forEach(function(row){
        rowstr = row.x0 + "," + row.y0 + "," + row.x1 + "," + row.y1;
        csv += rowstr + "\r\n";
    });
    fs.writeFile("note.txt", csv, (err) => {
        if (err) throw err;
        console.log("the file was saved");
    });
}

function openFile(filestr) {
    fs.readFile(filestr, 'utf8', (err, data) => {
        if (err) throw err;
        parse(data, {columns: false, trim: true}, function(err, rows){
            rows.forEach(function (row){
            drawings.push({
                x0: parseFloat(row[0]),
                y0: parseFloat(row[1]),
                x1: parseFloat(row[2]),
                y1: parseFloat(row[3])
            });
            });
            redrawCanvas();


        });
    });
}
