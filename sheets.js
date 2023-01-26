/* a sheet is a combination of canvas element with
   a unique ID corresponding to a mutable image.
   the image is persisted in one or more databases.
   the latest version of the image is always show in the canvas.
   sheets have no metadata, but sheets may be referenced by
   more complex documents, like a map.
*/


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

