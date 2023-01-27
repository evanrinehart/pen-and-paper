function drawSquareGrid(canvas, ctx, config){
  var N = config.N;
  var sep = 1024 / N;
  ctx.strokeStyle = config.color;
  for(let i=0; i < N; i++){
    var x = Math.floor(i * sep)+0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for(let j=0; j < N; j++){
    var y = Math.floor(j * sep)+0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
}
  
/*
function drawGrid(canvas,ctx){
  var N = 33;
  var sep = 1024 / N;
  ctx.strokeStyle = "lightgray";
  for(let i=0; i < N; i++){
    var x = Math.floor(i * sep)+0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for(let j=0; j < N; j++){
    var y = Math.floor(j * sep)+0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
}
*/
