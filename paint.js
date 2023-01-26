var Paint = {
  state: null,
  path:  [],
  color: "black",
  size: 3
};

var pencilTool = {
  name:      "pencil",
  mouseDown: paintMouseDown,
  mouseMove: paintMouseMove,
  mouseUp:   paintMouseUp,
  select:    paintSelected
};

var eraserTool = {
  name:      "eraser",
  mouseDown: paintMouseDown,
  mouseMove: paintMouseMove,
  mouseUp:   paintMouseUp,
  select:    eraserSelected
};

function eachCanvas(f){
  var stuff = document.getElementsByTagName("canvas");
  for(let i = 0; i < stuff.length; i++){
    var canvas = stuff[i];
    var ctx = canvas.getContext("2d");
    f(canvas, ctx);
  }
}

/* CONVERSIONS */
function eventPositionToStandard(ev){
  var ws = document.getElementById("workspace");
  var rect = ws.getBoundingClientRect();
  var x = ev.clientX - rect.x;
  var y = ev.clientY - rect.y;
  return {x: x, y: y};
}

function standardPositionToClient(xy){
  var ws = document.getElementById("workspace");
  var rect = ws.getBoundingClientRect();
  var x = xy.x + rect.x;
  var y = xy.y + rect.y;
  return {x: x, y: y};
}

function standardPositionToCanvas(canvas, xy){
  var rect = canvas.getBoundingClientRect();
  var clientXY = standardPositionToClient(xy);
  var x = clientXY.x - rect.x;
  var y = clientXY.y - rect.y;
  return {x: x, y: y};
}

/* PAINTING COMMANDS */
function repaintPathOn(canvas,ctx){
  var brushPath = Paint.path;

  if(brushPath.length == 0) return;
  if(Paint.color){
    ctx.strokeStyle = Paint.color;
  }
  else{
    ctx.strokeStyle = canvas.getAttribute("data-color");
  }
  ctx.lineWidth = Paint.size;
  ctx.lineCap = "round";

  var start = standardPositionToCanvas(canvas, brushPath[0]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  for(let i=1; i < brushPath.length; i++){
    var next = standardPositionToCanvas(canvas, brushPath[i]);
    ctx.lineTo(next.x, next.y);
  }
  ctx.stroke();
}

function repaintPathOnAll(klass){
  eachCanvas(function(canvas,ctx){
    if(!canvas.classList.contains(klass)) return;
    repaintPathOn(canvas,ctx);
  });
}

function clearAllScratch(){
  eachCanvas(function(canvas,ctx){
    if(!canvas.classList.contains("scratch")) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  });
}

/* MAIN CALLBACKS */
function paintMouseDown(ev){
  if(ev.button != 0) return;
  if(!ev.target.classList.contains("surface")) return;
  Paint.state = 1;
  Paint.path.length = 0;
  Paint.path.push(eventPositionToStandard(ev));
  repaintPathOnAll("scratch");
}

function paintMouseMove(ev){
  if(Paint.state == null) return;
  Paint.path.push(eventPositionToStandard(ev));
  clearAllScratch();
  repaintPathOnAll("scratch");
}

function paintMouseUp(ev){
  if(ev.button != 0) return;
  if(Paint.state == null) return;
  repaintPathOnAll("paper");
  clearAllScratch();
  Paint.path.length = 0;
  Paint.state = null;
}

function paintSelected(){
  Paint.color = "black";
  Paint.size = 3;
}

function eraserSelected(){
  Paint.color = null;
  Paint.size = 30;
}
