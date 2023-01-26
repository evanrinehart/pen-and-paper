/* a sheet is a combination of canvas element with
   a unique ID corresponding to a mutable image.
   the image is persisted in one or more databases.
   the latest version of the image is always show in the canvas.
   sheets have no metadata, but sheets may be referenced by
   more complex documents, like a map.
*/

function markPoint(canvas,ctx,x,y){
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x,y);
  ctx.stroke();
}

function markLine(canvas,ctx,x0,y0,x1,y1){
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x0,y0);
  ctx.lineTo(x1,y1);
  ctx.stroke();
}

var brushEnable = true;
var brushState  = null;
var brushPath   = [];

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

/*
function repaintPathOn(canvas,ctx){
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
*/

function brushMouseDown(ev){
  if(brushEnable == false) return;
  console.log("begin brush");
  brushState = 1;
  brushPath.length = 0;
  brushPath.push(eventPositionToStandard(ev));
  repaintPathOnAll("scratch");
}

function brushMouseMove(ev){
  if(brushState == null) return;
  console.log("move brush");
  brushPath.push(eventPositionToStandard(ev));
  clearAllScratch();
  repaintPathOnAll("scratch");
}

function brushMouseUp(ev){
  if(brushState == null) return;

  console.log("release brush", brushPath);
  repaintPathOnAll("paper");

  clearAllScratch();

  console.log(brushPath);

  brushState = null;
}

function highestZ(parentElement){
  var z = 0;
  Array.from(parentElement.children).forEach(function(el){
    z = Math.max(z, el.style.zIndex);
  });
  return z;
}

/* {
width:
height:
left:
top:
zIndex:
color:
class:
} */


function newSheet(config){
  const canvas = document.createElement("canvas");
  
  if(config.newID){
    const id = generateId();
    canvas.setAttribute("data-id", id);
    canvas.id = "canvas-" + id;
  }

  canvas.setAttribute("width", config.width);
  canvas.setAttribute("height", config.height);
  canvas.style.position = "absolute";
  canvas.style.zIndex = config.zIndex;
  canvas.style.left = config.left + "px";
  canvas.style.top = config.top + "px";
  canvas.classList.add(config.class);
  canvas.classList.add("world");

  if(config.color){
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = config.color;
    ctx.fillRect(0,0,canvas.width, canvas.height);
  }

/*
  function blobReady(blob){
    console.log("ready", blob);
    // store blob in database with key = id
  }

  canvas.toBlob(blobReady, "image/png");
*/

  return canvas;
}

