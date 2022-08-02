const serverAddress = 'wss://badjackbox.glitch.me/';

function init() {
    //document.body.style.fontFamily = "helvetica";
    document.body.onkeydown = function(e){
      changename(document.getElementById("username"));
      checkplaybutton();
  }
}
var connected = false;
const serverConnection = new WebSocket(serverAddress);

serverConnection.onopen = function() {
  console.log("I just connected to the server on " + serverAddress);
  connected = true;
  checkplaybutton();
  setInterval(pingloop, 15000);
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function pingloop() {
  serverConnection.send(JSON.stringify({ping: true}));
}
serverConnection.onmessage = function(event) {
  if (validJson(event.data)) {
    var parse = JSON.parse(event.data);
    if (parse.joinres != undefined) {
      if (parse.error != undefined) {
        document.getElementById("play").setAttribute("joining", "0");
      } else {
        var urls = ["clickrate", "dickdetective"];
        setCookie("code", parse.joinres.code);
        setCookie("username", document.getElementById("username").value);
        load_page("https://badjackbox.glitch.me/gamefile/game_" + urls[parse.joinres.game] + ".html");
      }
    }
    console.log("Received: " + event.data);
  }
  //let obj = JSON.parse(event.data);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function validJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function host() {
  window.location.href = "jackbox/host.html";
}
async function changename(element) {
  await sleep(0);
  document.getElementById("remaining").innerText = (12 - element.value.length);
}
async function checkplaybutton() {
  await sleep(0);
  if (document.getElementById("username").value != "" && document.getElementById("roomcode").value.length == 4 && connected) {
    document.getElementById("play").removeAttribute("disabled");
  } else {
    document.getElementById("play").disabled = "disabled";
  }
}

function join() {
  document.getElementById("play").setAttribute("joining", "1");
  serverConnection.send(JSON.stringify({join: document.getElementById("roomcode").value}));
  
}
var fontmode = 0;
function switchfont() {
  var sl = document.querySelectorAll( 'body *' );
  for(const sli in sl) {
    if (sl[sli].style == undefined) {continue;}
    if (fontmode == 0) {
      sl[sli].style.fontFamily = "comics";
    } else {
      sl[sli].style.fontFamily = "helvetica";
    }
  }
  if (fontmode == 0) {
    fontmode = 1;
  } else {
    fontmode = 0;
  }
}
function load_page(url){
  var qr=new XMLHttpRequest();
  qr.open('get',url);
  qr.send();
  qr.onload=function(){
    console.log(qr.responseText);
    document.write(qr.responseText);
  }
};
