const serverAddress = 'wss://goodorevil.glitch.me/';

function init() {
}

function submit() {
  serverConnection.send(JSON.stringify({add: document.getElementById("name").value, addlink: document.getElementById("link").value, password: document.getElementById("password").value}));
  document.getElementById("link").value = "";
  document.getElementById("name").value = "";
}

const serverConnection = new WebSocket(serverAddress);

serverConnection.onopen = function() {
  loaded = true;
  console.log("I just connected to the server on " + serverAddress);
  document.getElementById("container").dataset.active = "1";
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
    if (parse.listall != undefined) {
    }
  }
  console.log("Received: " + event.data);
  //let obj = JSON.parse(event.data);
}


function validJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
