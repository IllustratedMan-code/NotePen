
// colors
const canvasColor = 'black';
var strokeColor = 'white';


// get our canvas element
const canvas = document.getElementById("canvas");
const container = document.getElementById("CanvasContainer");
const context = canvas.getContext("2d");

//gives canvas its own resizing context;
//not needed if set in css;
//canvas.style.position = 'absolute';


// disable right clicking context menu
document.oncontextmenu = function () {
    return false;
}

// list of all lines drawn
const drawings = [];
// number of Complete Strokes made (pen down, pen up)
var StrokeNumber = 0;
var Stroking = false;
// coordinates of our cursor
let cursorX;
let cursorY;
let prevCursorX;
let prevCursorY;

// distance from origin
let offsetX = 0;
let offsetY = 0;

// zoom amount
let scale = 1;

// convert coordinates
function toScreenX(xTrue) {
    return (xTrue + offsetX) * scale;
}
function toScreenY(yTrue) {
    return (yTrue + offsetY) * scale;
}
function toTrueX(xScreen) {
    return (xScreen / scale) - offsetX;
}
function toTrueY(yScreen) {
    return (yScreen / scale) - offsetY;
}
function trueHeight() {
    return canvas.clientHeight / scale;
}
function trueWidth() {
    return canvas.clientWidth / scale;
}

function redrawCanvas() {
    // set the canvas to the size of the window

    var containerOffset = container.getBoundingClientRect();
    //changing width and height redraws canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1), line.color);
    }
}
redrawCanvas();

// if the window changes size, redraw the canvas
window.addEventListener("resize", (event) => {
    redrawCanvas();
});

// Mouse Event Handlers and handles events
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('wheel', onMouseWheel, false);
// adds event for keyboard
document.addEventListener('keydown', function(e){
    if (e.code == "KeyB"){

        let RecentStroke = 0;
        drawings.forEach(function(row){
            RecentStroke = Math.max(row.StrokeN, RecentStroke);
        });
        Undo(RecentStroke);
    };
})
/* This adds an event listener to auxclicks, middle click is 1 may be needed when mousedown becomes primary only
canvas.addEventListener('auxclick', function(e){
    console.log(e.button);
})*/
// removes a specific stroke from drawings (all lines that make up a stroke)
function Undo(N) {
    let strokeLength = 0;
    let start = false;
    let startn;
    drawings.forEach(function(row, i){
        if(row.StrokeN == N){
            strokeLength++;
            if (start == false){
                start = true;
                startn = i;
            }
        };
    });
    drawings.splice(startn, strokeLength);
    strokeLength = 0;
    redrawCanvas();

}


// Touch Event Handlers 
       


// mouse functions
let leftMouseDown = false;
let rightMouseDown = false;
let middleMouseDown = false;
function onMouseDown(event) {

    // detect left clicks
    if (event.button == 0) {
        leftMouseDown = true;
    }
    // detect middle clicks
    if (event.button == 1) {
        middleMouseDown = true;
        leftMouseDown = false;
    }
    // detect right clicks
    if (event.button == 2) {
        rightMouseDown = true;
        leftMouseDown = false;
    }

    // update the cursor coordinates

    var containerOffset = container.getBoundingClientRect();
    cursorX = event.pageX - containerOffset.left;
    cursorY = event.pageY - containerOffset.top;

    prevCursorX = event.pageX - containerOffset.left;
    prevCursorY = event.pageY - containerOffset.top;
}
function onMouseMove(event) {
    // get mouse position
    var containerOffset = container.getBoundingClientRect();
    cursorX = event.pageX - containerOffset.left;
    cursorY = event.pageY - containerOffset.top;
    const scaledX = toTrueX(cursorX) ;
    const scaledY = toTrueY(cursorY);
    const prevScaledX = toTrueX(prevCursorX);
    const prevScaledY = toTrueY(prevCursorY);
    if (rightMouseDown || middleMouseDown)leftMouseDown=false;
    if (leftMouseDown) {
        // add the line to our drawing history
        drawings.push({
            x0: prevScaledX,
            y0: prevScaledY,
            x1: scaledX,
            y1: scaledY,
            color: strokeColor,
            StrokeN: StrokeNumber
        });
        // draw a line
        drawLine(prevCursorX, prevCursorY, cursorX, cursorY, strokeColor);
        Stroking = true;
    }
    if (middleMouseDown) {
        // move the screen
        offsetX += (cursorX - prevCursorX) / scale;
        offsetY += (cursorY - prevCursorY) / scale;
        redrawCanvas();
    }
    if (rightMouseDown) {
        // eraser

        // line intersection
        drawings.forEach(function(row){
            let inter = intersect(prevScaledX, scaledX, prevScaledY, scaledY, row.x0, row.x1, row.y0, row.y1);
            if (intersect(prevScaledX, scaledX, prevScaledY, scaledY, row.x0, row.x1, row.y0, row.y1)){
                Undo(row.StrokeN);
            };
        });

    }
    prevCursorX = cursorX;
    prevCursorY = cursorY;
}
function onMouseUp() {
    if (Stroking){
        Stroking = false;
        StrokeNumber++;
    };
    leftMouseDown = false;
    rightMouseDown = false;
    middleMouseDown = false;
}
function onMouseWheel(event) {
    const deltaY = event.deltaY;
    const scaleAmount = -deltaY / 500;
    scale = scale * (1 + scaleAmount);
    var containerOffset = container.getBoundingClientRect();

    // zoom the page based on where the cursor is
    var distX = (event.pageX - containerOffset.left) / canvas.clientWidth;
    var distY = (event.pageY - containerOffset.top) / canvas.clientHeight;

    // calculate how much we need to zoom
    const unitsZoomedX = trueWidth() * scaleAmount;
    const unitsZoomedY = trueHeight() * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    offsetX -= unitsAddLeft;
    offsetY -= unitsAddTop;
    redrawCanvas();
}
function drawLine(x0, y0, x1, y1, color) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
}

function intersect (x1, x2, y1, y2, x3, x4, y3, y4){
    let m1 = ((y2-y1)/(x2-x1));
    let m2 = ((y4-y3)/(x4-x3));
    if (Math.abs(m1) == Math.abs(m2))return(false);
    let b1 = y1-(m1*x1);
    let b2 = y3-(m2*x3);
    let x = ((b2-b1)/(m1-m2));
    let y = m1 * x + b1;
    if ((x >= Math.min(x1, x2)) && (x <= Math.max(x1, x2)) && (y >= Math.min(y1, y2)) && (y <=Math.max(y1,y2)) && (Math.min(x3, x4)) && (x <= Math.max(x3, x4)) && (y >= Math.min(y3, y4)) && (y <=Math.max(y3,y4))){
        return(true);
    }else{
        return(false);
    }
}
