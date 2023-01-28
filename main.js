var db;
var currentTool;

function onMouseDown(ev){
  if(ev.target.classList.contains("token")){
    currentTool = grabTool;
    currentTool.select();
    currentTool.mouseDown(ev);
    toolButtonChangeTo(document.querySelector('#toolbar img[data-tool="grab"]'));
  }
  else{
    currentTool.mouseDown(ev);
  }
}

function onMouseMove(ev){
  currentTool.mouseMove(ev);
}

function onMouseUp(ev){
  currentTool.mouseUp(ev);
}

function onClick(ev){
  currentTool.click(ev);
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

function onToolClick(ev){
  if(ev.target.matches("#toolbar .tool")){
    var name = ev.target.getAttribute("data-tool");
    if(currentTool.name != name){
      toolButtonChangeTo(ev.target);
      switch(name){
        case "grab":   currentTool = grabTool;  break;
        case "pencil": currentTool = pencilTool; break;
        case "inkpen": currentTool = inkpenTool; break;
        case "paint":  currentTool = paintTool; break;
        case "eraser": currentTool = eraserTool; break;
      }
      currentTool.select();
    }
  }
}

function onHeadingClick(ev){
  if(ev.button == 0 && ev.target.id == "header"){
    var newText = prompt("Change the heading text?", ev.target.innerHTML);
    if(newText){
      ev.target.innerHTML = newText;
    }
  }
}



function onLoad(ev){

  currentTool = grabTool;

  document.addEventListener("click", onClick);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup",   onMouseUp);

  document.addEventListener("click", onToolClick);
  document.addEventListener("click", onHeadingClick);
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
  drawSquareGrid(canvas,ctx,{
    N: 32,
    color: "#e5e5cC"
  });
  drawSquareGrid(canvas,ctx,{
    N: 16,
    color: "#d5d5bC"
  });

  var canvas = newSheet({
    width: size,
    height: size,
    left: 0,
    top: 0,
    zIndex: 50,
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
