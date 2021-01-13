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

let ColorPicker = document.getElementById("Colorpicker");
let Color1 = document.getElementById("Color1");
let Color2 = document.getElementById("Color2");
let Color3 = document.getElementById("Color3");
let Color4 = document.getElementById("Color4");
let Color5 = document.getElementById("Color5");
let Color6 = document.getElementById("Color6");
let Color7 = document.getElementById("Color7");
changeColorPicker(Color1);

Color1.addEventListener("click", function() {
    changeColorPicker(Color1);
});
Color2.addEventListener("click", function() {
    changeColorPicker(Color2);
});
Color3.addEventListener("click", function() {
    changeColorPicker(Color3);
});
Color4.addEventListener("click", function() {
    changeColorPicker(Color4);
});
Color5.addEventListener("click", function() {
    changeColorPicker(Color5);
});
Color6.addEventListener("click", function() {
    changeColorPicker(Color6);
});
ColorPicker.addEventListener("input",function(e){
    CurrentColor.style.backgroundColor = e.target.value;
    strokeColor = e.target.value;
});



function convertColor(color)
{  
  var rgbColors=new Object();

  // Handle rgb(redValue, greenValue, blueValue) format
  if (color[0]=='r')
  {
      color=color.substring(color.indexOf('(')+1, color.indexOf(')'));
      rgbColors=color.split(',', 3);
      rgbColors[0]=parseInt(rgbColors[0]);
      rgbColors[1]=parseInt(rgbColors[1]);
      rgbColors[2]=parseInt(rgbColors[2]);

  }
  // Handle the #RRGGBB' format
  else if (color.substring(0,1)=="#")
  {
    rgbColors[0]=color.substring(1, 3);  // redValue
    rgbColors[1]=color.substring(3, 5);  // greenValue
    rgbColors[2]=color.substring(5, 7);  // blueValue

    rgbColors[0]=parseInt(rgbColors[0], 16);
    rgbColors[1]=parseInt(rgbColors[1], 16);
    rgbColors[2]=parseInt(rgbColors[2], 16);
	}
  return rgbColors;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function cssToHex(css){
    css = convertColor(css);
    return(rgbToHex(css[0], css[1], css[2]));
}
function changeColorPicker(Color){
    ColorPicker.value = cssToHex(getComputedStyle(Color).backgroundColor);
    CurrentColor = Color;
    strokeColor = cssToHex(getComputedStyle(Color).backgroundColor);
}
