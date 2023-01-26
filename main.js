var db;
var currentTool;


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

function mark(canvas,ctx,x,y){
  var rect = canvas.getBoundingClientRect();
  var rx = rect.left;
  var ry = rect.top;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(x-rx, y-ry, 50, 0, 2*Math.PI);
  ctx.stroke();
}
*/


function onMouseDown(ev){
  currentTool.mouseDown(ev);
}

function onMouseMove(ev){
  currentTool.mouseMove(ev);
}

function onMouseUp(ev){
  currentTool.mouseUp(ev);
}



function onLoad(ev){

  currentTool = paintTool;

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup",   onMouseUp);


  var size = 1024;
//  newSheet(document.getElementById("workspace"), size, size);
  var canvas = newSheet({
    newID: true,
    width: size,
    height: size,
    left: 1024,
    top: 0,
    zIndex: 0,
    color: "beige",
    class: "paper"
  });

  document.getElementById("workspace").appendChild(canvas);

  var canvas = newSheet({
    width: size,
    height: size,
    left: 1024,
    top: 0,
    zIndex: 50,
    class: "scratch"
  });

  document.getElementById("workspace").appendChild(canvas);

  var canvas = newSheet({
    newID: true,
    width: size,
    height: size,
    left: 0,
    top: 0,
    zIndex: 0,
    color: "beige",
    class: "paper"
  });

  document.getElementById("workspace").appendChild(canvas);

  var canvas = newSheet({
    width: size,
    height: size,
    left: 0,
    top: 0,
    zIndex: 50,
    class: "scratch"
  });

  document.getElementById("workspace").appendChild(canvas);

  /*
  var openReq = window.indexedDB.open("example");
  openReq.onerror = function(ev){
    console.log("error", ev);
  }
  openReq.onsuccess = function(ev){
    console.log("success", ev);
    db = ev.target.result;
  }
  */

/*
  document.getElementById("fileinput").addEventListener("change", function(ev){
    var file = ev.target.files[0];
    var imageBitmapPromise = createImageBitmap(file);
    imageBitmapPromise.then(function(imageBitmap){
      var canvas = document.getElementById("canvas0");
      var ctx    = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0);
    });
    var img = document.getElementById("myimage");
    var fileReader = new FileReader();
    fileReader.onload = function(ev){
      img.src = ev.target.result;
    };
    fileReader.readAsDataURL(file);
    console.log(file);
    //console.log(ev.target.files[0]);
  });
*/
  
  
}

window.addEventListener("load", onLoad);
