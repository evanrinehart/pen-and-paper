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
  mouseDown: function(ev){
    if(ev.button != 0) return;
    //if(!ev.target.classList.contains("surface")) return;
    //draw shape if previous point exists
    var freeP = eventPositionToStandard(ev); /* ! */
    var p = snapPoint(freeP);
    Brush1.points.push(p);
    Brush1.cursor = p;
    console.log(Brush1);
    clearAllScratch();
    brush1RefreshIndicator();
  },
  mouseUp: function(ev){
  },
  click: function(ev){
  },
  mouseMove: function(ev){
    var freeP = eventPositionToStandard(ev); /* ! */
    var p = snapPoint(freeP);
    Brush1.cursor = p;
    clearAllScratch();
    brush1RefreshIndicator();
  },
  keyDown: function(ev){
    //ev.keyCode
    //  32 = space
    //  13 = enter
    //  27 = escape
    //   9 = tab
    switch(ev.keyCode){
      case 13:
      case 27:
      case 32:
      case  9:
        brush1CommitExit();
    }
  },
  select: function(){
    //eachCanvas(function(canvas, ctx){
    //  ctx.globalCompositeOperation = "source-over";
    //});
    Brush1.points.length = 0;
  },
  unselect: function(){
    brush1CommitExit();
  },
  busy: function(){
    return Brush1.points.length > 0;
  }
}

function brush1CommitExit(){
  clearAllScratch();
  brush1Commit();
  Brush1.points.length = 0;
}

function brush1Render(canvas, ctx, points, cursor){
  var plan = [];
  for(i=0; i<points.length; i++) plan.push(points[i]);
  if(cursor) plan.push(cursor);
  if(plan.length == 0) return;

  ctx.beginPath();
  if(plan.length == 1){
    var c = standardPositionToCanvas(canvas, plan[0]);
    ctx.fillStyle = Brush1.color;
    ctx.arc(c.x + 0.5, c.y + 0.5, Brush1.thickness / 2.0, 0, 2*Math.PI);
    ctx.fill();
  }
  else{
    ctx.strokeStyle = Brush1.color;
    ctx.lineWidth = Brush1.thickness;
    ctx.lineCap  = "round";
    ctx.lineJoin = "round";
    //ctx.miterLimit = 2;
    var start = standardPositionToCanvas(canvas, plan[0]);
    ctx.moveTo(start.x, start.y);
    for(let i=1; i<plan.length; i++){
      var q = standardPositionToCanvas(canvas, plan[i]);
      ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();
  }
}

function brush1Commit(){
  eachCanvasClass("glass", function(canvas,ctx){
    brush1Render(canvas, ctx, Brush1.points, null);
  });
}

function brush1RefreshIndicator(){
  eachCanvasClass("scratch", function(canvas,ctx){
    brush1Render(canvas, ctx, Brush1.points, Brush1.cursor);
  });
}
