/* a circular eraser tool */

// 1. when not yet clicked, appears as a bright magenta disc
// 2. when mouse held, appears as a magenta path
// 3. when mouse released, whatever was under the magenta is erased.

var Eraser = {
  state: "standby",
  points: [],
  size: 32
};

var eraserTool = {
  name:      "eraser",
  mouseDown: function(ev){
    if(ev.button != 0) return;
    if(!ev.target.classList.contains("surface")) return;
    Eraser.state = "engaged";
    Eraser.points.length = 0;
    var p = snapPoint(eventPositionToStandard(ev));
    Eraser.points.push(p);
  },
  mouseMove: function(ev){
    switch(Eraser.state){
      case "standby":
        var p = snapPoint(eventPositionToStandard(ev));
        clearAllScratch();
        eraserRenderCursor(p);
        break;
      case "engaged":
        var p = snapPoint(eventPositionToStandard(ev));
        Eraser.points.push(p);
        clearAllScratch();
        eraserRefreshIndicator();
    }
  },
  mouseUp:   function(ev){
    if(Eraser.state == "standby") return;
    clearAllScratch();
    eraserCommit();
    Eraser.points.length = 0;
    Eraser.state = "standby";
  },
  keyDown:   function(ev){},
  click:     function(ev){},
  unselect:  function(){
    clearAllScratch();
    Eraser.state = "standby";
    Eraser.points.length = 0;
  },
  select:    function(){},
  busy: function(){ return Eraser.state != "standby"; }
};

function eraserStroke(canvas, ctx, points, erase){
  if(points.size == 0) return;
  ctx.beginPath();
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = Eraser.size;
  ctx.lineCap  = "round";
  ctx.lineJoin = "round";
  if(erase) ctx.globalCompositeOperation = "destination-out";
  var start = standardPositionToCanvas(canvas, points[0]);
  ctx.moveTo(start.x, start.y);
  for(let i=1; i<points.length; i++){
    var q = standardPositionToCanvas(canvas, points[i]);
    ctx.lineTo(q.x, q.y);
  }
  if(points.length == 1){
    ctx.lineTo(start.x, start.y);
  }
  ctx.stroke();
  if(erase) ctx.globalCompositeOperation = "source-over";
}



function eraserRenderCursor(p){
  eachCanvasClass("scratch", function(canvas, ctx){
    ctx.beginPath();
    var c = standardPositionToCanvas(canvas, p);
    ctx.fillStyle = "magenta";
    ctx.arc(c.x + 0.5, c.y + 0.5, Eraser.size / 2.0, 0, 2*Math.PI);
    ctx.fill();
  });
}

function eraserRefreshIndicator(){
  eachCanvasClass("scratch", function(canvas, ctx){
    eraserStroke(canvas, ctx, Eraser.points, false);
  });
}

function eraserCommit(){
  eachCanvasClass("glass", function(canvas, ctx){
    eraserStroke(canvas, ctx, Eraser.points, true);
  });
}
