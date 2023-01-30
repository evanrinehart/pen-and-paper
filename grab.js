var grabTool = {
  name:      "grab",
  mouseDown: grabMouseDown,
  mouseMove: grabMouseMove,
  mouseUp:   grabMouseUp,
  keyDown:   function(ev){},
  click:     function(ev){},
  unselect:  function(){},
  select:    function(){},
  busy:      function(){ return false; }
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
  if(ev.button != 0) return;
  if(ev.target.classList.contains("token")){
    var token = ev.target;
    var container = ev.target.parentElement;
    container.removeChild(token);
    container.appendChild(token);
    Grab.state = "token";
    Grab.token = token;
    var rect1 = token.getBoundingClientRect();
    var rect2 = container.getBoundingClientRect();
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
  if(ev.button != 0) return;
  if(Grab.state == null) return;
  Grab.state = null;
  Grab.token = null;
}
