var db;
var currentTool;

var Options = {
  snap: false
};

function snapPoint(p){
  return !Options.snap ? p : {
      x: Math.floor(p.x / 16) * 16,
      y: Math.floor(p.y / 16) * 16
    };
}

function eachCanvas(f){
  var stuff = document.getElementsByTagName("canvas");
  for(let i = 0; i < stuff.length; i++){
    var canvas = stuff[i];
    var ctx = canvas.getContext("2d");
    f(canvas, ctx);
  }
}

function eachCanvasClass(klass, f){
  eachCanvas(function(canvas,ctx){
    if(!canvas.classList.contains(klass)) return;
    f(canvas,ctx);
  });
}

function clearAllScratch(){
  eachCanvasClass("scratch", function(canvas, ctx){
    ctx.clearRect(0,0,canvas.width,canvas.height);
  });
}

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


function onMouseDown(ev){
  /* clicking tool switching buttons */
  if(ev.button == 0 && !currentTool.busy() && ev.target.matches("#toolbar .tool")){
    var name = ev.target.getAttribute("data-tool");
    if(currentTool.name != name){
      toolButtonChangeTo(ev.target);
      currentTool.unselect();
      switch(name){
        case "grab":   currentTool = grabTool;  break;
        case "brush1": currentTool = brush1Tool; break;
        case "inkpen": currentTool = inkpenTool; break;
        case "paint":  currentTool = paintTool; break;
        case "eraser": currentTool = eraserTool; break;
      }
      currentTool.select();
    }
  }
  /* clicking the heading to edit the message */
  else if(ev.button == 0 && !currentTool.busy() && ev.target.id == "header"){
    var newText = prompt("Change the heading text?", ev.target.innerHTML);
    if(newText){
      ev.target.innerHTML = newText;
    }
  }
  /* clicking a token regardless of current tool to switch to grab mode */
  else if( ev.button == 0 && 
           !currentTool.busy() &&
           currentTool.name != "grab" && 
           ev.target.classList.contains("token") ){
    /* This just won't work in general probably. */
    currentTool.unselect();
    currentTool = grabTool;
    currentTool.select();
    currentTool.mouseDown(ev);
    toolButtonChangeTo(document.querySelector('#toolbar img[data-tool="grab"]'));
  }
  /* holding middle mouse allows panning the workspace any time */
  else if(ev.button == 1){
    grabWorldStart(ev);
  }
  /* assume the click is against the general workspace */
  else{
    currentTool.mouseDown(ev);
  }
}

function onMouseMove(ev){
  /* dragging the whole world may happen any time */
  if(Grab.panEngaged){
    grabWorldMove(ev);
  }
  else{
    currentTool.mouseMove(ev);
  }
}

function onMouseUp(ev){
  /* holding middle mouse allows panning the workspace any time */
  if(ev.button == 1){
    grabWorldEnd();
  }
  else{
    currentTool.mouseUp(ev);
  }
}

function onClick(ev){
  currentTool.click(ev);
}

function onKeyDown(ev){
  if(ev.code == "KeyS") Options.snap = !Options.snap;
  console.log(ev);
  currentTool.keyDown(ev);
}

function onDoubleClick(ev){
  if(ev.target.classList.contains("token")){
    if(ev.target.classList.contains("reverse")){
      ev.target.classList.remove("reverse");
    }
    else{
      ev.target.classList.add("reverse");
    }
  }
}

function toolButtonChangeTo(button){
  var buttons = document.querySelectorAll("#toolbar .tool");
  for(let i=0; i<buttons.length; i++){
    buttons[i].classList.remove("active");
  }
  button.classList.add("active");
}



function onLoad(ev){

  currentTool = grabTool;

  document.addEventListener("click", onClick);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup",   onMouseUp);
  document.addEventListener("keydown",   onKeyDown);

  document.addEventListener("dblclick", onDoubleClick);

  var size = 1024;
//  newSheet(document.getElementById("workspace"), size, size);
  var canvas = newSheet({
    newID: true,
    width: size,
    height: size,
    left: 0,
    top: 0,
    zIndex: 0,
    color: "beige",
    clear: false,
    class: "paper"
  });
  document.getElementById("workspace").appendChild(canvas);
  var ctx = canvas.getContext('2d');
  /*
  drawSquareGrid(canvas,ctx,{
    N: 32,
    color: "#e5e5cC"
  });
  */
  drawSquareGrid(canvas,ctx,{
    N: 16,
    color: "#d5d5bC"
  });

  var canvas = newSheet({
    width: size,
    height: size,
    left: 0,
    top: 0,
    zIndex: 10,
    clear: true,
    class: "glass"
  });
  document.getElementById("workspace").appendChild(canvas);

  var canvas = newSheet({
    width: size,
    height: size,
    left: 0,
    top: 0,
    zIndex: 50,
    clear: true,
    class: "scratch"
  });
  document.getElementById("workspace").appendChild(canvas);


  /* SAME THING BUT 1024 over there */
  var canvas = newSheet({
    newID: true,
    width: size,
    height: size,
    left: 1024,
    top: 0,
    zIndex: 0,
    color: "beige",
    clear: false,
    class: "paper"
  });
  document.getElementById("workspace").appendChild(canvas);
  var ctx = canvas.getContext('2d');
  /*
  drawSquareGrid(canvas,ctx,{
    N: 32,
    color: "#e5e5cC"
  });
  */
  drawSquareGrid(canvas,ctx,{
    N: 16,
    color: "#d5d5bC"
  });

  var canvas = newSheet({
    width: size,
    height: size,
    left: 1024,
    top: 0,
    zIndex: 10,
    clear: true,
    class: "glass"
  });
  document.getElementById("workspace").appendChild(canvas);

  var canvas = newSheet({
    width: size,
    height: size,
    left: 1024,
    top: 0,
    zIndex: 50,
    clear: true,
    class: "scratch"
  });
  document.getElementById("workspace").appendChild(canvas);

/*
  var canvas = newSheet({
    newID: true,
    width: size,
    height: size,
    left: 1024,
    top: 0,
    zIndex: 0,
    color: "darkseagreen",
    class: "paper"
  });
  document.getElementById("workspace").appendChild(canvas);

  var canvas = newSheet({
    width: size,
    height: size,
    left: 1024,
    top: 0,
    zIndex: 50,
    color: "darkseagreen",
    clear: true,
    class: "scratch"
  });
  document.getElementById("workspace").appendChild(canvas);
*/

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
