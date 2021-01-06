
// colors
const canvasColor = 'white';
const strokeColor = 'black';


// get our canvas element
const canvas = document.getElementById("canvas");
const container = document.getElementById("CanvasContainer");
const context = canvas.getContext("2d");


// disable right clicking context menu
document.oncontextmenu = function () {
    return false;
}

// list of all strokes drawn
const drawings = [];

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
    canvas.width = document.body.clientWidth - containerOffset.left;
    canvas.height = document.body.clientHeight - containerOffset.top;
    context.fillStyle = canvasColor;
    context.fillRect(containerOffset.left, containerOffset.top, canvas.width, canvas.height);
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1));
    }
}
redrawCanvas();

// if the window changes size, redraw the canvas
window.addEventListener("resize", (event) => {
    redrawCanvas();
});

// Mouse Event Handlers
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('wheel', onMouseWheel, false);


// Touch Event Handlers 
       


// mouse functions
let leftMouseDown = false;
let rightMouseDown = false;
function onMouseDown(event) {

    // detect left clicks
    if (event.button == 0) {
        leftMouseDown = true;
        rightMouseDown = false;
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
    if (leftMouseDown) {
        // add the line to our drawing history
        drawings.push({
            x0: prevScaledX,
            y0: prevScaledY,
            x1: scaledX,
            y1: scaledY
        });
        // draw a line
        drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
    }
    if (rightMouseDown) {
        // move the screen
        offsetX += (cursorX - prevCursorX) / scale;
        offsetY += (cursorY - prevCursorY) / scale;
        redrawCanvas();
    }
    prevCursorX = cursorX;
    prevCursorY = cursorY;
}
function onMouseUp() {
    leftMouseDown = false;
    rightMouseDown = false;
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
function drawLine(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.stroke();
}

