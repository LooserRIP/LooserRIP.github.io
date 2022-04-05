const serverAddress = 'wss://goodorevil.glitch.me/';

var leftItems = [];
var index;
var mouseDown = false;
var dragOffset = {x: 0, y: 0};
var judgedimage;
var dHell;
var dHeaven;
var loaded = false;
var loadTime = 0;
var votingOn;

function init() {
  judgedimage = document.getElementById("judgedimage");
  dHell = document.getElementById("hell");
  dHeaven = document.getElementById("heaven");
  document.body.onmousedown = function() { 
  }
  document.body.onmouseup = function() {
    if (mouseDown && loaded) {
      if (dHell.dataset.active == "1") {
        vote("d");
      } else if (dHeaven.dataset.active == "1") {
        vote("u");
      }
    }
    mouseDown = false;
  }
  document.body.onmousemove = function(event) {
    if (mouseDown) {
      var newPos = {x: event.clientX + dragOffset.x, y: event.clientY + dragOffset.y};
      judgedimage.style.top = newPos.y + "px";
      judgedimage.style.left = newPos.x + "px";
    }
  }
  setInterval(physics, 5);
}

const serverConnection = new WebSocket(serverAddress);

serverConnection.onopen = function() {
  loaded = true;
  console.log("I just connected to the server on " + serverAddress);

  //setInterval(ping, 10000);

  // serverConnection.send('hello server');
}
var modeSave;
function vote(mode) {
  serverConnection.send(JSON.stringify({vote: leftItems[index].id, votemode: mode}));
  votingOn = mode;
  loadTime = 1;
  document.getElementById("statsui").dataset.active = "1";
  document.getElementById("statsname").innerText = leftItems[index].n;
  var up = leftItems[index].u;
  var down = leftItems[index].d;
  if (mode == "u") up++;
  if (mode == "d") down++;
  if (down > up) {
    document.getElementById("statspercentage").innerText = Math.floor(((down / (down + up))) * 100) + "% Evil";
  } else {
    document.getElementById("statspercentage").innerText = Math.floor(((up / (down + up))) * 100) + "% Good";
  }
  document.getElementById("statsvotes").innerText = (down + up) + " Votes";
  if (up > down) document.getElementById("statsverdict").dataset.mode = "heaven";
  if (down > up) document.getElementById("statsverdict").dataset.mode = "hell";
  if (up == down) document.getElementById("statsverdict").dataset.mode = "neutral";
  modeSave = mode;
  leftItems.splice(index, 1);
}

function continueOn() {
  loadTime = 0;
  document.getElementById("statsui").dataset.active = "0";
  spawnItem();
}

function physics() {
  const width  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (!mouseDown) {
    if (loadTime <= 0) {
      judgedimage.style.top =  (((parseFloat(judgedimage.style.top) * 20)  + (height / 2))/21) + "px";
      judgedimage.style.left = (((parseFloat(judgedimage.style.left) * 20) + (width / 2))/21) + "px";
    } else {
      var distgive = -400;
      if (modeSave == "u") distgive = width + 400;
      judgedimage.style.top =  (((parseFloat(judgedimage.style.top) * 20)  + (height / 2))/21) + "px";
      judgedimage.style.left = (((parseFloat(judgedimage.style.left) * 20) + (distgive))/21) + "px";
    }
  }
  if (parseFloat(judgedimage.style.left) < 300) {
    dHell.dataset.active = "1";
  } else {
    dHell.dataset.active = "0";
  }
  if (parseFloat(judgedimage.style.left) > width - 300) {
    dHeaven.dataset.active = "1";
  } else {
    dHeaven.dataset.active = "0";
  }
}
function startdrag(event) {
  mouseDown = true;
  dragOffset = {x: parseFloat(judgedimage.style.left) - event.clientX, y: parseFloat(judgedimage.style.top) - event.clientY};
  console.log(dragOffset);
}

function ping() {
  serverConnection.send(JSON.stringify({ping: true}));

}
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

serverConnection.onmessage = function(event) {
  if (validJson(event.data)) {
    var parse = JSON.parse(event.data);
    if (parse.list != undefined) {
      console.log(parse.list);
      leftItems = shuffle(parse.list);
      spawnItem();
    }
  }
  console.log("Received: " + event.data);
  //let obj = JSON.parse(event.data);
}



function spawnItem() {
  if (leftItems.length > 0) {
    index = randomInt(0, leftItems.length - 1);
    var item = leftItems[index];
    const width  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    judgedimage.style.left = (((parseFloat(judgedimage.style.left) * 20) + (width / 2))/21) + "px";
    judgedimage.style.top = (-height - 100) + "px";
    judgedimage.style.backgroundImage = "url('" + item.l + "')";
  } else {
    document.getElementById("statsui").dataset.active = "1";
    document.getElementById("statsname").innerText = "Sorry!";
    document.getElementById("statspercentage").innerText = "but you have judged all items!";
    document.getElementById("statsvotes").innerText = "";
    document.getElementById("statsverdict").style.display = "none";
    document.getElementById("judgedimage").style.display = "none";
    document.getElementById("statsbutton").style.display = "none";
  }
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
function validJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
