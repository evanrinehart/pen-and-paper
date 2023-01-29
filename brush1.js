var Brush1 = {
  points: [],
  cursor: null,
  color: "black",
  // wavyness or jitteryness options
  // door option, window option
  thickness: 7
};

var brush1Tool = {
  name: "brush1",
  click: function(ev){
    //draw shape if previous point exists
    var freeP = eventPositionToStandard(ev);
    var p = snapPoint(freeP);
    Brush1.points.push(p);
    Brush1.cursor = p;
    eachCanvasClass("scratch", brush1RefreshIndicator);
  },
  mouseMove: function(ev){
    var freeP = eventPositionToStandard(ev);
    var p = snapPoint(freeP);
    Brush1.cursor = p;
    eachCanvasClass("scratch", brush1RefreshIndicator);
  },
  keyDown: function(ev){
    //ev.keyCode
    //  32 = space
    //  13 = enter
    //  27 = escape
    //   9 = tab
    eachCanvasClass("glass", brush1Commit);
    clearAllScratch();
    Brush1.points.length = 0;
  },
  mouseUp: function(ev){},
  mouseDown: function(ev){},
  select: function(){
  },
  unselect: function(){
    Brush1.points.length = 0;
    clearAllScratch();
  }
}

function brush1RefreshIndicator(canvas, ctx){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();

  if(Brush1.points.length < 1){
    var c = Brush1.cursor;
    ctx.fillStyle = Brush1.color;
    ctx.arc(c.x + 0.5, c.y + 0.5, Brush1.thickness / 2.0, 0, 2*Math.PI);
    ctx.fill();
  }
  else{
    var points = Brush1.points;
    var start = points[0];
    ctx.beginPath();
    ctx.strokeStyle = Brush1.color;
    ctx.lineWidth = Brush1.thickness;
    ctx.lineCap = "round";
    ctx.moveTo(start.x, start.y);
    for(let i=1; i<points.length; i++){
      var q = points[i];
      ctx.lineTo(q.x, q.y);
    }
    var c = Brush1.cursor;
    ctx.lineTo(c.x, c.y);
    ctx.stroke();
  }

}

function brush1Commit(canvas, ctx){
  if(Brush1.points.length < 2) return;
  var points = Brush1.points;
  var start = points[0];
  ctx.beginPath();
  ctx.strokeStyle = Brush1.color;
  ctx.lineWidth = Brush1.thickness;
  ctx.lineCap = "round";
  ctx.moveTo(start.x, start.y);
  for(let i=1; i<points.length; i++){
    var q = points[i];
    ctx.lineTo(q.x, q.y);
  }
  ctx.stroke();
}
