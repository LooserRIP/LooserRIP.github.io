const serverAddress = 'wss://badjackbox.glitch.me/';
/*
const serverConnection = new WebSocket(serverAddress);

serverConnection.onopen = function() {
  console.log("I just connected to the server on " + serverAddress);
  setInterval(pingloop, 15000);
}

serverConnection.onmessage = function(event) {
  if (validJson(event.data)) {
    var parse = JSON.parse(event.data);
    console.log("Received: " + event.data);
  }
  //let obj = JSON.parse(event.data);
}
*/
function init() {
  
}
function validJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function pingloop() {
  //serverConnection.send(JSON.stringify({ping: true}));
}
function sethovering(element, id) {
  element.setAttribute("data-hovering", id);
}
function hostgame(element) {
  var ga = element.getAttribute("data-game");
  var list = ["clickrate","dickdetective"];
  window.location.href = "host/" + list[parseInt(ga)] + ".html";
}