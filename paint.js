var Paint = {
  state: null,
  path:  []
};

var paintTool = {
  mouseDown: paintMouseDown,
  mouseMove: paintMouseMove,
  mouseUp:   paintMouseUp
};

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

function repaintPathOn(canvas,ctx){
  var brushPath = Path.path;

  if(brushPath.length == 0) return;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
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

function paintMouseDown(ev){
  console.log("begin brush");
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
  if(Paint.state == null) return;

  repaintPathOnAll("paper");

  clearAllScratch();

  Paint.state = null;
}


