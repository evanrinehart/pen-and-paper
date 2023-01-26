var grabTool = {
  mouseDown: grabMouseDown,
  mouseMove: grabMouseMove,
  mouseUp:   grabMouseUp
};

var Grab = {
  state: null,
  token: null,
  tokenOrig: null,
  tokenOffset: null,
  worldMarginX: 0,
  worldMarginY: 0,
  worldPrevX: null,
  worldPrevY: null
}

function grabMouseDown(ev){
  if(ev.target.classList.contains("token")){
    console.log("grab token");
    Grab.state = "token";
    Grab.token = ev.target;
    var rect1 = ev.target.getBoundingClientRect();
    var rect2 = ev.target.parentElement.getBoundingClientRect();
    Grab.tokenOrig = {
      x: rect2.x,
      y: rect2.y
    }
    Grab.tokenOffset = {
      x: rect1.x - ev.clientX,
      y: rect1.y - ev.clientY
    };
  }
  else if(ev.target.classList.contains("world")){
    Grab.state = "world";
    Grab.worldPrevX = ev.clientX;
    Grab.worldPrevY = ev.clientY;
  }
}

function grabMouseMove(ev){
  switch(Grab.state){
    case null:
      break;
    case "token":
      console.log("move token");
      var elem = Grab.token;
      elem.style.left = ev.clientX - Grab.tokenOrig.x + Grab.tokenOffset.x + "px";
      elem.style.top  = ev.clientY - Grab.tokenOrig.y + Grab.tokenOffset.y + "px";
      break;
    case "world":
      var deltaX = ev.clientX - Grab.worldPrevX;
      var deltaY = ev.clientY - Grab.worldPrevY;
      Grab.worldMarginX += deltaX;
      Grab.worldMarginY += deltaY;
      var workspace = document.getElementById("workspace");
      workspace.style.marginLeft = Grab.worldMarginX + "px";
      workspace.style.marginTop  = Grab.worldMarginY + "px";
      Grab.worldPrevX = ev.clientX;
      Grab.worldPrevY = ev.clientY;
      break;
  }
}

function grabMouseUp(ev){
  if(Grab.state == null) return;
  Grab.state = null;
  Grab.token = null;
}
