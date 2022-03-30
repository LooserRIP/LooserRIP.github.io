const serverAddress = 'wss://minesweeper-online.glitch.me/';

//console.log("hello world");
let container;
let chunkloadlist = [];
var mouseDown = [false, false, false, false, false, false, false, false, false];
var dragOffset;
var dict;
var elementdict;
var biomes;
var count;
var animationdict;
var ubedict;
var nickname;
var flagcounter;
var ismobile;
var penalty;
var camerashakeorig;
var camerashakeover;
var docsc;
var mousePos;
var nickdiv;
var chatdiv;
var chatinput;
var chatbox;
var ubeclouds = 0;
var savetap;
var tapping;
var tapmove;
var doubletapcheck;
var zoomMode = 0;
var mp;
var pid;
var namejson;
var viewinginfo;
var biomenames;
var commanddict;
var selectelement;
var tiledouble;
var renderfilter;

var dataat;
var animationobjects;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}
async function reloadnames() {
  namejson = await fetch("https://minesweeper-online.glitch.me/getstats");
  namejson = await namejson.json();
  namejson = namejson.users;
}

setInterval(cleardict, 10000);

function changecoord() {
  if (document.getElementById("coordinput").value.replace(" ","").split(",").length == 2) {
    var split = document.getElementById("coordinput").value.replace(" ","").split(",");
    
    var x = clamp(parseInt(split[0]), -1000, 1000);
    var y = clamp(parseInt(split[1]), -1000, 1000);
    
    container.style.left = x * 600;
    container.style.top = y * 600;
    
    localStorage.setItem("prevpos", container.style.left + "," + container.style.top);
  }
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function spawnPlayerMarker(tx,ty,player,playerauth,remove) {
  var gets = document.getElementsByClassName("player");
  for(let ig = 0; ig < gets.length; ig++) {
    if (gets[ig].getAttribute("data-player") == playerauth) {
      gets[ig].remove();
    }
  }
  if (remove != true) {
    var plr = document.createElement("div");
    plr.setAttribute("class","player");
    plr.setAttribute("data-player",playerauth);
    plr.setAttribute("data-savecontainer","y");
    plr.style.left = (tx * 50) + "px";
    plr.style.top = (ty * 50) + "px";
    plr.style.filter = "hue-rotate(" + mod((mulberry32(xmur3(playerauth)())() * 360) +180, 360) + "deg)";
    var plrtxt = document.createElement("P");
    plrtxt.innerText = player;
    plrtxt.setAttribute("class","playertext");
    plr.appendChild(plrtxt);
    
    container.appendChild(plr);
  }
}

function showInfo(tx,ty,player,remove) {
  if (viewinginfo == tx + "," + ty) {
    remove = true;
    viewinginfo = "n";
  } else {
    viewinginfo = tx + "," + ty;
  }
  var spl = dict[tx + "," + ty].split("_");
  var gets = document.getElementsByClassName("info");
  for(let ig = 0; ig < gets.length; ig++) {
      gets[ig].remove();
  }
  if (remove != true) {
    var plr = document.createElement("div");
    plr.setAttribute("class","info");
    plr.setAttribute("data-savecontainer","y");
    plr.style.left = (tx * 50) + "px";
    plr.style.top = (ty * 50) + "px";
    var plrtxt = document.createElement("P");
    var value = "Unrevealed";
    if (spl[1] == 1) {
      value = spl[0];
      if (value == "b") {value = "Bomb"};
      if (value == "qb") {value = "Misleading Bomb"};
      if (value == "ba") {value = "Barrier"};
      if (value == "q") {value = "Misled Tile"};
    }
    if (spl[1] == 2) {
      value = "Flagged";
    }
    var biome = biomenames[spl[2]];
    plrtxt.innerText = "Position: X: "+tx+", Y: " + ty + "\nValue: " + value + "\nBiome: " + biome;
    if (spl.length == 4) {
      var modf = "Opened";
      if(spl[1] == 2) { //document.getElementById("myImg").style.filter = "grayscale(100%)";
        modf = "Flagged";
      }
      if (spl[1] != 0) {
        plrtxt.innerText = "Position: X: "+tx+", Y: " + ty + "\nValue: " + value + "\nBiome: " + biome + "\n" + modf + " By: " + namejson[spl[3]].nick;
      }
    }
    plrtxt.setAttribute("class","infotext");
    plr.appendChild(plrtxt);
    
    container.appendChild(plr);
  }
}
function selectinit() {
    var plr = document.createElement("div");
    plr.setAttribute("class","select");
    plr.setAttribute("id","select");
    plr.setAttribute("data-savecontainer","y");
    plr.style.left = (Math.floor(parseFloat(container.style.left) / 50) * 50) + "px";
    plr.style.top = (Math.floor(parseFloat(container.style.top) / 50) * 50) + "px";
    
    container.appendChild(plr);
    selectelement = document.getElementById("select");
}
function ismobilea() {
  return !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
}


function mulberry32(a) {
  return function() {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function cleardict() {
  count = 0;
}

function preloadImages() {
  var preload = [];
  pushlist(animationdict["vanilla"], ",", ".png");
  pushlist(animationdict["chocolate"], ",", ".png");
  pushlist(animationdict["strawberry"], ",", ".png");
  pushlist(animationdict["banana"], ",", ".png");
  pushlist(animationdict["cookie"], ",", ".png");
  pushlist(animationdict["cream"], ",", ".png");
  pushlist(animationdict["creamcookie"], ",", ".png");
  pushlist(animationdict["ube"], ",", ".png");
  pushlist(animationdict["waffle"], ",", ".png");
  for(let ip = 0; ip < preload.length; ip++) {
    var img = document.createElement("IMG");
    img.setAttribute("src", preload[ip]);
    img.setAttribute("style", "display:none;");
    img.setAttribute("alt", '');
    document.body.appendChild(img);
  }
  
  function pushlist(list, splitter, addon) {
    var split = list.split(splitter);
    for(let ipp = 0; ipp < split.length; ipp++) {
      preload.push(split[ipp] + addon);
    }
  }
}
function changenick() {
    localStorage.setItem("nick", document.getElementById("nickinput").value);
    nickname = document.getElementById("nickinput").value;
}
async function setNick() {
    var superherojson = await fetch("https://akabab.github.io/superhero-api/api/all.json");
    superherojson = await superherojson.json();
    
    localStorage.setItem("nick", superherojson[Math.floor(Math.random() * superherojson.length)].name);
    nickname = localStorage.getItem("nick");
    document.getElementById("nickinput").value = localStorage.getItem("nick");
    superherojson = new Object();
}

var canopen;
function addcss(path) {
  var fileref = document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", path);
  document.getElementsByTagName("head")[0].appendChild(fileref);
}

function performCommand(cmd) {
  var args = cmd.split(" ");
  if (commanddict.includes(args[0])) {
    if (args[0] == "players") {
      serverConnection.send(JSON.stringify({loadplayers: true}));
    }
    if (args[0] == "" || args[0] == "help") {
      addChatMessage("List of commands:", "", "client");
      addChatMessage("/players - shows a list of connected players.", "", "client");
      addChatMessage("/settings - shows a list of settings", "", "client");
      addChatMessage("/settings <setting> <mode> - sets a setting.", "", "client");
    }
    if (args[0] == "zoom") {
      zoomOut();
    }
    if (args[0] == "settings") {
      if (args.length == 1) {
        addChatMessage("List of settings:", "", "client");
        addChatMessage('"rendermode" <fancy/performance> - Sets the render mode of chunks.', "", "client");
        addChatMessage('"filter" <sane/heavydrugs> - Sets the filter mode of the renderer.', "", "client");
        addChatMessage('"tilefilters" <off/on> - Visual filters such as the waffle tiles being darker/lighter.', "", "client");
        addChatMessage('"camerashake" <on/off> - The effect of the camera shaking when bombs are hit.', "", "client");
      } else {
        if (args[1] == "rendermode") {
          if (args[2] == "performance") {
            setSetting(0, 1, "Render mode set to Performance.");
          } else {
            setSetting(0, 0, "Render mode set to Fancy.");
          }
        }
        if (args[1] == "filter") {
          if (args[2] == "heavydrugs") {
            setSetting(1, 1, "Filter set to Heavy Drugs.");
            renderfilter = 1;
          } else {
            setSetting(1, 0, "Filter set to Sane.");
            renderfilter = 0;
          }
        }
        if (args[1] == "tilefilters") {
          if (args[2] == "on") {
            setSetting(2, 1, "Tile Filters set to On.");
          } else {
            setSetting(2, 0, "Tile Filters set to Off.");
          }
        }
        if (args[1] == "camerashake") {
          if (args[2] == "off") {
            setSetting(3, 1, "Camera Shake set to Off.");
          } else {
            setSetting(3, 0, "Camera Shake set to On.");
          }
        }
      }
    }
  } else {
    addChatMessage("Command doesn't exist! do /help to see a list of commands.", "", "client");
  }
}

function setSetting(settingindex, index, message) {
  addChatMessage(message, "", "client");
  var gisp = localStorage.getItem("settings").split("");
  gisp[settingindex] = index;
  localStorage.setItem("settings", gisp.join(""));
  settingsstring = gisp.join("");
}
var settingsstring;

function getSetting(settingindex) {
  return settingsstring.slice(settingindex, settingindex + 1);
}


function init() {
  dataat = [];
  viewinginfo = "n";
  if (localStorage.getItem('settings') == undefined) {
    localStorage.setItem("settings", "00000000000000000000000000000000000000");
  }
  settingsstring = localStorage.getItem("settings");
  commanddict = ["help", "", "players", "camerashake", "zoom", "settings"]
  chatinput = document.getElementById("chatinput");
  document.title = "Minesweeper Online";
  docsc = document.getElementById("sct");
    docsc.innerText = localStorage.getItem("sca");
  docsc.style.color = "#000000";
  ismobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    ismobile = true;
}
  if (ismobile) {
    addcss("mobilestyle.css");
  }

  if (localStorage.getItem("nick") == null) {
    setNick();
    var guestnum = Math.floor(Math.random() * 64000);
    localStorage.setItem("nick", "Guest" + guestnum);
  }
  nickname = localStorage.getItem("nick");
  document.getElementById("nickinput").value = localStorage.getItem("nick");
  count = 0;
  biomes = ["vanilla","chocolate","strawberry", "banana", "cookie", "cream", "creamcookie", "ube", "waffle"];
  biomenames = ["Vanilla", "Chocolate", "Strawberry", "Banana", "Cookie Dough", "Cookies & Cream", "Cookies & Cream: Cookie", "Ube", "Waffle"];
  animationdict = new Object();
  animationdict["vanilla"]     = "https://imgur.com/WViACB7,https://imgur.com/Utnd1rY,https://imgur.com/dx3CQ9u,https://imgur.com/zHh3cMI,https://imgur.com/Vorvges,https://imgur.com/t9gSDcp,https://imgur.com/5R0Rw3N,https://imgur.com/RxllPUW";
  animationdict["chocolate"]   = "https://imgur.com/tbbi6VL,https://imgur.com/xi65uX2,https://imgur.com/ZNlpesw,https://imgur.com/zoJOS3K,https://imgur.com/7jK6exB,https://imgur.com/RxhNxbZ,https://imgur.com/zyz8K2N,https://imgur.com/zpEdvFV";
  animationdict["strawberry"]  = "https://imgur.com/JpDfMx3,https://imgur.com/SeHYCbM,https://imgur.com/BldAOEE,https://imgur.com/fC8e0Ok,https://imgur.com/EbOlA9S,https://imgur.com/MqSyilK,https://imgur.com/odE74Cr,https://imgur.com/wGfkdp5";
  animationdict["banana"]      = "https://imgur.com/5z5uJ4x,https://imgur.com/Cbor2G6,https://imgur.com/CeCXhle,https://imgur.com/DySUplm,https://imgur.com/eQPh72H,https://imgur.com/XDrDZpy,https://imgur.com/Mypb4hL,https://imgur.com/fvCOI0N";
  animationdict["cookie"]      = "https://imgur.com/OsmeaXI,https://imgur.com/mOoWQ6Z,https://imgur.com/wOKeX3c,https://imgur.com/hWl12p6,https://imgur.com/pqAKtYE,https://imgur.com/uo6Epeb,https://imgur.com/bGcCQS5,https://imgur.com/VB03sNC";
  animationdict["cream"]       = "https://imgur.com/sVxU2Ww,https://imgur.com/pzg2ZtG,https://imgur.com/SqHIVf0,https://imgur.com/l4dx5CN,https://imgur.com/ZQaFVbd,https://imgur.com/I58QtoN,https://imgur.com/juJ1eF1,https://imgur.com/54XUfNo";
  animationdict["creamcookie"] = "https://imgur.com/IeQOWeJ,https://imgur.com/b1XbVxM,https://imgur.com/VKPwKfb,https://imgur.com/a6LGRLm,https://imgur.com/flKreTc,https://imgur.com/nlRsT99,https://imgur.com/jpS34YU,https://imgur.com/aBw97jl";
  animationdict["ube"]         = "https://imgur.com/JQaSiCD,https://imgur.com/oR7AmB6,https://imgur.com/egJc6ZY,https://imgur.com/Q8J0bRG,https://imgur.com/Sxlmwgh,https://imgur.com/8uLopCE,https://imgur.com/PbjyGSf,https://imgur.com/APzczdf";
  animationdict["waffle"]      = "https://imgur.com/rTZmqxa,https://imgur.com/HZ3rFJg,https://imgur.com/UhAIUGv,https://imgur.com/ARo1Xgk,https://imgur.com/PYSxWOo,https://imgur.com/RhQGloO,https://imgur.com/VFpMUZm,https://imgur.com/WHHJGty";
  //old waffle animationdict["waffle"]      = "https://imgur.com/rTZmqxa,https://imgur.com/z9izC1W,https://imgur.com/oqqIbKm,https://imgur.com/UZzT3Rd,https://imgur.com/j52YDHh,https://imgur.com/8y02ZXa,https://imgur.com/vsmJar6,https://imgur.com/vH63v9J";
  //animationdict["chocolate"] = "";
  dict = new Object();
  ubedict = [];
  elementdict = new Object();
  reloadnames();
  container = document.getElementById("chunkcontainer");
        container.style.left = "0px";
        container.style.top = "0px";
  if (localStorage.getItem("prevpos") != null) {
    var splitg = localStorage.getItem("prevpos").split(",");
        container.style.left = splitg[0];
        container.style.top = splitg[1];
  }
      document.getElementById("coordinput").value = Math.floor(parseInt(container.style.left) / 600) + ", " + Math.floor(parseInt(container.style.top) / 600);
  var target;
  document.body.onmousedown = function(evt) { 
    
      if (canopen < 1) {
        canopen = 1;
      }
    mouseDown[evt.button] = true;
    if (evt.button == 0) {
      dragOffset = {x: evt.clientX, y: evt.clientY} ;
    }
    if (evt.button == 1) {
      
      dragOffset = {x: evt.clientX, y: evt.clientY} ;
      target = evt.target;

      evt.preventDefault();
      evt.stopPropagation();
    }
  }
  document.body.onmouseup = function(evt) {
    mouseDown[evt.button] = false;
  }
  document.body.onmousemove = function(event) {
    mousePos = {x: event.clientX, y: event.clientY};
    mp = mousePos;
    if (mouseDown[0]) {
      canopen -= 0.05;
      if (canopen < 2) {
      container.style.left = (parseInt(container.style.left) + (event.clientX - dragOffset.x)) + "px";
      container.style.top = (parseInt(container.style.top)   + (event.clientY - dragOffset.y)) + "px";
      localStorage.setItem("prevpos", container.style.left + "," + container.style.top);
      genLoop();
      document.getElementById("coordinput").value = Math.floor(parseInt(container.style.left) / 600) + ", " + Math.floor(parseInt(container.style.top) / 600);
      }
      dragOffset = {x: event.clientX, y: event.clientY};
    }
    if (mouseDown[1]) {
      container.style.left = (parseInt(container.style.left) + (event.clientX - dragOffset.x)) + "px";
      container.style.top = (parseInt(container.style.top)   + (event.clientY - dragOffset.y)) + "px";
      localStorage.setItem("prevpos", container.style.left + "," + container.style.top);
      genLoop();
      document.getElementById("coordinput").value = Math.floor(parseInt(container.style.left) / 600) + ", " + Math.floor(parseInt(container.style.top) / 600);
      dragOffset = {x: event.clientX, y: event.clientY};
    }
    
  }
  
  document.ontouchstart = function(event) {
    dragOffset = {x: event.clientX, y: event.clientY} ;
    var touchLocation = event.targetTouches[0];
    mp = {x: touchLocation.pageX, y:touchLocation.pageY};
    if (!event) event = window.event; 
    //savetap = {x: touchLocation.pageX, y: touchLocation.pageY};
    flagcounter = 0;
    if(doubletapcheck > 0) {
      var r = raycastTile(mp.x, mp.y);
      if (tiledouble != r.x + "," + r.y){
        tiledouble = r.x + "," + r.y;
        doubletapcheck = 17;
        return;
        }
      tiledouble = r.x  +","+r.y;
      var  r= raycastTile(mp.x, mp.y);
      showInfo(r.x, r.y);
    }
    doubletapcheck = 17;
    
  }
  
  document.ontouchend = function(event) {
    tapping = false;
  }
  
  document.ontouchmove = function(event) {
    var touchLocation = event.targetTouches[0];
    mp = {x: touchLocation.pageX, y:touchLocation.pageY};
    if (!event) event = window.event; 
    
    
      container.style.left = (parseInt(container.style.left) + (touchLocation.pageX - dragOffset.x)) + "px";
      container.style.top = (parseInt(container.style.top)   + (touchLocation.pageY - dragOffset.y)) + "px";
      localStorage.setItem("prevpos", container.style.left + "," + container.style.top);
      genLoop();
      document.getElementById("coordinput").value = Math.floor(parseInt(container.style.left) / 600) + ", " + Math.floor(parseInt(container.style.top) / 600);
      if (tapping) {
        tapmove += 1;
        if (tapmove > 4) {
          flagcounter = -99999;
        }
      }
      dragOffset = {x: touchLocation.pageX, y: touchLocation.pageY};
  }
  
  
  document.body.onkeydown = function(e){
    if(e.keyCode == 13){
        if (chatinput === document.activeElement) {
          if (chatinput.value != "") {
            if (chatinput.value.slice(0,1) == "/") {
              performCommand(chatinput.value.slice(1,999));
            } else {
              sendChat(chatinput.value.slice(0,120));
            }
          } //
          chatinput.value = "";
          chatinput.blur();
        } else {
          chatinput.focus();
        }
    }
    if (e.keyCode == 72) {
      if (mp != undefined) {
        if (chatinput === document.activeElement) return;
        var r = raycastTile(mp.x, mp.y);
        showInfo(r.x, r.y);
      }
    }
  }
  preloadImages();
  
  if (localStorage.getItem("penalty") != undefined) {
    penalty = parseInt(localStorage.getItem("penalty"));
    
       camerashakeover = 0;
       camerashakeorig = {x: 0, y: 0};
  }
  divInit();
  setInterval(penaltyloop, 25);
  
  renderfilter = getSetting(1);
  setInterval(scrollRainbow, 10);
  //selectinit();
  //setInterval(selectloop, 25);
}
function openchatbox() {
  if (ismobile) {
    return;
  }
  chatinput.focus();
  mp = {x: 0, y: 0};
  
}
/*function checkNodes() {
  var lengthnodes = container.childElementCount;
  var children = container.childNodes;
  for (let i = 0; i < lengthnodes; i++) {
    var item = children[i];
    var dataChunk = item.getAttribute("data-chunk").split(",");
    var dx = parseInt(dataChunk[0]);
    var dy = parseInt(dataChunk[1]);
    const width   = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
    const height  = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var minwidth  = Math.floor(width /   600);
    var minheight = Math.floor(height /  600);
    var rcx = Math.floor(parseInt(container.style.left) / 600);
    var rcy = Math.floor(parseInt(container.style.top ) / 600);
  }
}*/

function ping() {
  serverConnection.send(JSON.stringify({ping: true}));
}

function raycastTile(x, y) {
  return {x: (Math.floor(x / 50 - (parseFloat(container.style.left) / 50))), y:(Math.floor(y / 50 - (parseFloat(container.style.top) / 50)))};
}

function getTile(g) {
  return dict[g].split("_")[0];
}
function getState(g) {
  return dict[g].split("_")[1];
}
function getBiome(g) {
  return dict[g].split("_")[2];
}
function getAuthor(g) {
  if (dict[g].split("_")[3] != undefined) {
    return dict[g].split("_")[3];
  }
  return -1;
}
function changeStateDict(g,value) {
  var spl = dict[g].split("_");
  spl[1] = value;
  dict[g] = spl.join("_");
}
function changeAuthorDict(g,value) {
  var spl = dict[g].split("_");
  if (spl.length == 4) {
    spl[3] = value;
  } else {
    spl.push(value);
  }
  dict[g] = spl.join("_");
}

function generateChunk(x, y) {
  //console.log(x + " " + y);
  var div = document.createElement("DIV");
  div.setAttribute("class", "chunk");
  div.setAttribute("data-chunk", x + "," + y);
  div.setAttribute("data-dc", (x / 600) + "," + (y/600));
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.backgroundColor = "#808080";
  container.appendChild(div);
  serverConnection.send(JSON.stringify({cx: x / 600, cy: y / 600}));
  count += 0.2;
}

var serverConnection = new WebSocket(serverAddress);
var connected;
serverConnection.onopen = function() {
  setInterval(loop, 5);
  setInterval(ping, 10000);
  connected = true;
  // serverConnection.send('hello server');
}
serverConnection.onclose = function() {
  //alert("Disconnected. Reconnect?al")
  location.reload();
  connected = false;
  //serverConnection = new WebSocket(serverAddress);
  // serverConnection.send('hello server');
}

serverConnection.onmessage = function(event) {
  if (validJson(event.data)) {
    var parse = JSON.parse(event.data);
    if (parse.chunkdata != undefined) {
      var lookfor = parse.chunkx + "," + parse.chunky;
      var getchunks = document.getElementsByClassName("chunk");
      for(let ic = 0; ic < getchunks.length; ic++) {
        var ga = getchunks[ic].getAttribute("data-dc");
        if (ga == lookfor) {
          var chunkcontainer = getchunks[ic];
          var splitchunkdata = chunkdecompress(parse.chunkdata, parse.chunkx, parse.chunky).split("*");
          
          var tileindex = 0;
          var rendermode = parseInt(getSetting(0));
          var tilefilters = getSetting(2);
          for (let iy = 0; iy < 12; iy++) {
            for (let ix = 0; ix < 12; ix++) {
              var rx = (parse.chunkx * 12) + ix;
              var ry = (parse.chunky * 12) + iy;
              var splittiledata = splitchunkdata[tileindex].split("_");
              
              
              var tileclass = "unrevealed";
              if (parseInt(splittiledata[2]) == 1) {
                tileclass = splittiledata[1];
              }
              if (parseInt(splittiledata[2]) == 2) {
                tileclass = "flag"
              }
              
              var div = document.createElement("DIV");
              div.setAttribute("class", "tile_" + tileclass + "_" + biomes[parseInt(splittiledata[3])]);
              div.setAttribute("id", rx + "," + ry);
              div.setAttribute("data-id", splittiledata[0]);
              div.setAttribute("data-biome", splittiledata[3]);
              div.setAttribute("onmouseup", "clicktile(this, event)");
              div.setAttribute("ontouchend", "taptile(this, event)");
              div.setAttribute("ontouchstart", "holdtaptile(this, event)");
              div.setAttribute("onmousedown", "holdtile(this, event)");
              chunkcontainer.appendChild(div);
              dict[rx + "," + ry] = splittiledata.slice(1,99).join("_");
              
              if (splittiledata[3] == "8") {
                var fox = Math.floor(rx / 16);
                var foy = Math.floor(ry / 16);
                var fomx = fox;
                if (fomx == 0) fomx = 128;
                var fomy = foy;
                if (fomy == 0) fomy = 67;
                var perc = mulberry32(fomx * fomy * 69 * fomx * fomy + (fox * 3) + (foy * 7))();
                if (!(rx % 16 == 0 || ry % 16 == 0)) {
                  if (splittiledata[2] == "0") {
                    if (rendermode == 0 && tilefilters == "1") {
                      div.style.filter = "brightness(" + (Math.floor((1 - perc) * 50) + 50) + "%)";
                    }
                  }
                }
              }
              if (splittiledata[3] == "0" || splittiledata[3] == "8") {
                var mx = rx;
                if (mx == 0) mx = 128;
                var my = ry;
                if (my == 0) my = 67;
                var perc = mulberry32(mx * my * 124 * mx * my + (rx * 5) + (ry * 3))();
                var sparkleperc = 0.999;
                if (splittiledata[3] == "8") sparkleperc = 0.99;
                if (perc > sparkleperc) {
                  if (splittiledata[1] == "0" && splittiledata[2] == "0") {
                    div.setAttribute("class", "tile_sparkle_" + biomes[parseInt(splittiledata[3])]);
                  }
                }
              }
              
              elementdict[rx + "," + ry] = div;
              tileindex++;
            }
          }
        }
      }
      //document.getElementsByClassName("chunk")
    } else {
      if (parse.state != undefined && parse.x != undefined && parse.y != undefined) {
        var addressind = addressIndex(parse.playerauth);
        if (parse.state == 1) {
          opentile(elementdict[parse.x + "," + parse.y], false, false,4,0,addressind);
          spawnPlayerMarker(parse.x, parse.y, parse.player, parse.playerauth,false);
        }
        if (parse.state == 0 || parse.state == 2) {
          setflagtile(elementdict[parse.x + "," + parse.y], parse.state);
          spawnPlayerMarker(parse.x, parse.y, parse.player, parse.playerauth,false);
        }
        
      } else {
      if (parse.message != undefined && parse.player != undefined && parse.playerauth != undefined) {
        addChatMessage(parse.message,parse.player, parse.playerauth);
      } else {
        if (parse.chatlog != undefined) {
          var length = parse.chatlog.length;
          for(let ic = 0; ic < length; ic++) {
            var s = parse.chatlog[ic];
            addChatMessage(s.message, s.player, s.playerauth);
          }
        } else {
          if (parse.playerslist != undefined) {
          var length = parse.playerslist.length;
             addChatMessage(": List of online players", "", "client");
            for(let ic = 0; ic < length; ic++) {
              var s = parse.playerslist[ic];
              addChatMessage("-" + s, "", "client");
            }
          } else {
            if (parse.setpid != undefined) {
              pid = parse.setpid;
            } else {
              if (parse.reloadnames != undefined) {
                reloadnames();
              }
            }
          }
        }
      }
    }
    
  }
  //console.log("Received: " + event.data);
  //let obj = JSON.parse(event.data);
}}
function addressIndex(address) {
  var found = -1;
  for (let ias = 0; ias < namejson.length; ias++) {
    if (namejson[ias].address == address) {
      found = ias;
      break;
    }
  }
  return found;
}
function holdtaptile(element, evt) {
  savetap = element;
  tapping = true;
  tapmove = 0;
}
function holdtile(element, evt) {
  var getid = element.getAttribute("data-id").split(",");
  if (getState(getid) == 0) {
    canopen = 999;
  } else {
    canopen = 0;
  }
}
function clicktile(element, evt) {
  if (penalty > 0) {
    if (evt.button != 1) {
      camerashakeover = 20;
    }
    return;
  }
  if (ismobile) {
    return;
  }
  var buttonevent = evt.button;
  if (flagcounter > 200) {
    buttonevent = 2;  }
  
  if (buttonevent != 0) {
    canopen = 1;
  }
  var getid = element.getAttribute("data-id").split(",");
  var state = 0;
  if (buttonevent == 0) {
    state = 1;
  }
  if (buttonevent == 2) {
    state = 2;
  }
  if (state != 0) {
    
  }
  if (state == 1) {
    opentile(element, false, true, 4);
    serverConnection.send(JSON.stringify({x: parseInt(getid[0]), y: parseInt(getid[1]), state: state, player: nickname}));
    count += 1;
  }
  if (state == 2) {
    flagtile(element,parseInt(getid[0]), parseInt(getid[1]));
  }
  
}
function zoomOut() {
  var viewport = document.querySelector('meta[name="viewport"]');
  if ( viewport ) {
    zoomMode++;
    if (zoomMode > 2) {
      zoomMode = 0;
    }
    if (zoomMode == 1) {
      viewport.content = "initial-scale=0.5";
    }
    if (zoomMode == 2) {
      viewport.content = "initial-scale=0.1";
    }
    if (zoomMode == 0) {
      viewport.content = "initial-scale=1";
    }
  }
}
function taptile(element, evt) {
  if (penalty > 0) {
    camerashakeover = 20;
    return;
  }
  
  var buttonevent = 0;
  if (flagcounter > 40 || flagcounter < -9999) {
    return;  }
  
  if (buttonevent != 0) {
    canopen = 1;
  }
  var getid = element.getAttribute("data-id").split(",");
  var state = 0;
  if (buttonevent == 0) {
    state = 1;
  }
  if (buttonevent == 2) {
    state = 2;
  }
  if (state != 0) {
    
  }
  if (state == 1) {
    opentile(element, false, true, 4);
    serverConnection.send(JSON.stringify({x: parseInt(getid[0]), y: parseInt(getid[1]), state: state, player: nickname}));
    count += 1;
  }
  if (state == 2) {
    flagtile(element,parseInt(getid[0]), parseInt(getid[1]));
  }
  
}

function flagtile(element, xd, yd) {
  if (element == undefined) {
    return;
  }
  var getid = element.getAttribute("data-id");
  if (getState(getid) == 0) {
    changeStateDict(getid, 2);
    changeAuthorDict(getid, pid);
    element.setAttribute("class", "tile_flag" + "_" + biomes[parseInt(element.getAttribute("data-biome"))]);
    serverConnection.send(JSON.stringify({x: xd, y: yd, state: 2, player: nickname}));
    element.style.filter = "none";
    count += 1;
  } else {
    if (getState(getid) == 2) {
    changeStateDict(getid, 0);
    changeAuthorDict(getid, pid);
      element.setAttribute("class", "tile_unrevealed" + "_" + biomes[parseInt(element.getAttribute("data-biome"))]);
      serverConnection.send(JSON.stringify({x: xd, y: yd, state: 0, player: nickname}));
      if (element.getAttribute('data-biome') == "8") {
        var fox = Math.floor(xd / 16);
        var foy = Math.floor(yd / 16);
        var fomx = fox;
        if (fomx == 0) fomx = 128;
        var fomy = foy;
        if (fomy == 0) fomy = 67;
        var perc = mulberry32(fomx * fomy * 69 * fomx * fomy + (fox * 3) + (foy * 7))();
        if (getSetting(0) == "0" && getSetting(2) == "1") {
          element.style.filter = "brightness(" + (Math.floor((1 - perc) * 50) + 50) + "%)";
        }
      }
      if (element.getAttribute('data-biome') == 0) {
        var mx = xd;
        if (mx == 0) mx = 128;
        var my = yd;
        if (my == 0) my = 67;
        var perc = mulberry32(mx * my * 124 * mx * my + (xd * 5) + (yd * 3))();
        if (perc > 0.999) {
          if (getTile(getid) == "0") {
            element.setAttribute("class", "tile_sparkle_vanilla");
          }
        }
      }
    count += 1;
    }
  }
}
function setflagtile(element, state, idse) {
  if (element == undefined) {
    return;
  }
  var getid = element.getAttribute("data-id");
  
    changeStateDict(getid, state);
    changeAuthorDict(getid, idse);
  if (state == 0) {
    element.setAttribute("class", "tile_unrevealed" + "_" + biomes[parseInt(element.getAttribute("data-biome"))]);
    if (element.getAttribute("data-biome") == "8") {
      var gdsp = getid.split(",");
      var fox = Math.floor(parseInt(gdsp[0]) / 16);
      var foy = Math.floor(parseInt(gdsp[1]) / 16);
      var fomx = fox;
      if (fomx == 0) fomx = 128;
      var fomy = foy;
      if (fomy == 0) fomy = 67;
      var perc = mulberry32(fomx * fomy * 69 * fomx * fomy + (fox * 3) + (foy * 7))();
      if (getSetting(0) == "0" && getSetting(2) == "1") {
        element.style.filter = "brightness(" + (Math.floor((1 - perc) * 50) + 50) + "%)";
      }
    }
      if (element.getAttribute('data-biome') == 0) {
        var xd = parseInt(gdsp[0]);
        var yd = parseInt(gdsp[1]);
        var mx = xd;
        if (mx == 0) mx = 128;
        var my = yd;
        if (my == 0) my = 67;
        var perc = mulberry32(mx * my * 124 * mx * my + (xd * 5) + (yd * 3))();
        if (perc > 0.999) {
          if (getTile(getid) == "0") {
            element.setAttribute("class", "tile_sparkle_vanilla");
          }
        }
      }
  } else {
    element.setAttribute("class", "tile_flag" + "_" + biomes[parseInt(element.getAttribute("data-biome"))]);
    element.style.filter = "none";
  }
}

async function chordtile(element,chaining,manual) {
  var getid = element.getAttribute("data-id");
  var flags = 0;
  countflag(1,0);
  countflag(-1,0);
  countflag(0,1);
  countflag(0,-1);
  countflag(1,1);
  countflag(-1,-1);
  countflag(1,-1);
  countflag(-1,1);
  if (getTile(getid) + "" == flags + "") {
    chord(1,0);
    chord(-1,0);
    chord(0,1);
    chord(0,-1);
    chord(1,1);
    chord(-1,-1);
    chord(1,-1);
    chord(-1,1);
  }
  
  function chord(xo, yo) {
    var x = parseInt(getid.split(",")[0]) + xo;
    var y = parseInt(getid.split(",")[1]) + yo;
    if (getState(x + "," + y) != 0) {
      return;
    }
    opentile(elementdict[x + "," + y], false, true,  4);
    serverConnection.send(JSON.stringify({x: x, y: y, state: 1, chaining:true, player: nickname}));
  }
  function countflag(xo, yo) {
    var x = parseInt(getid.split(",")[0]);
    var y = parseInt(getid.split(",")[1]);
    var state = getState((x + xo) + "," + (y + yo));
    var res = getTile((x + xo) + "," + (y + yo));
    if (state == 2 || (state == 1 && (res == "b" || res == "qb"))) {
      flags++;
    }
  }
}

async function opentile(element, chaining, manual, chainwait, animationwait, idse) {
  
  if (element == undefined) {
    return;
  }
  var getid = element.getAttribute("data-id");
  if (getState(getid) != 0) {
    chordtile(element,chaining,manual);
    return;
  }
  if (getTile(getid) == "b" || getTile(getid) == "qb") {
     if (manual) {
       navigator.vibrate(1000);
       camerashakeover = 0;
       penalty = 600;
       camerashakeorig = {x: 0, y: 0};
     }
  }
  var att = document.createElement("DIV");
  att.setAttribute("class", "tile_at_" + biomes[parseInt(element.getAttribute("data-biome"))]);
  att.setAttribute("data-at", "0");
  var pp = parseInt(element.getAttribute("data-biome"));
  if (pp == 6) {
    chainwait *= 2;
  }
  att.setAttribute("data-ats", chainwait);
  if (animationwait != undefined) {
    att.setAttribute("data-atsw", animationwait);
  }
  att.setAttribute("data-biome", biomes[parseInt(element.getAttribute("data-biome"))]);
  att.style.width = "50px";
  att.style.height = "50px";
  att.style.backgroundImage = animationdict[biomes[parseInt(element.getAttribute("data-biome"))]].split(",")[0];
  element.appendChild(att);
  dataat.push(att);
  element.setAttribute("class", "tile_"+ getTile(getid) + "_" + biomes[parseInt(element.getAttribute("data-biome"))]);
  element.style.filter = "none";
  changeStateDict(getid, 1);
  if (manual) {
    idse = pid;
  }
  changeAuthorDict(getid, idse);
  var x = parseInt(getid.split(",")[0]);
  var y = parseInt(getid.split(",")[1]);
  
  if (getTile(getid) == "0") {
    if (!chaining) {
      chain(x,y);
    }
  }
  
  if (manual) {
    var sa = 10;
    if (chaining) {
      sa = 1;
    }
    if (getTile(getid) == "b" || getTile(getid) == "qb") {
      sa = -1000;
    }
    var pr = parseInt(localStorage.getItem("sca"));
    if (localStorage.getItem("sca") == undefined) {
      pr = 0;
    }
    var add = pr + sa;
    localStorage.setItem("sca",add);
    docsc.innerText = add;
    if (sa > 0) {
      docsc.style.color = "#2DFF2D";
    } else {
      docsc.style.color = "#FF303E";
    }
  }
}
//  var touchLocation = event.targetTouches[0];
//  if (!e) e = window.event; 
function setopentile(element) {
  var getid = element.getAttribute("data-id");
  element.setAttribute("class", "tile_"+ getTile(getid));
}


async function chain(x, y) {
  var tiles = [x + "," + y];
  var origp = {x:x, y:y};
  var index = 0;
  while(true) {
    var tile = tiles[0];
    checktile(1,0);
    checktile(-1,0);
    checktile(0,1);
    checktile(0,-1);
    checktile(1,1);
    checktile(-1,-1);
    checktile(-1,1);
    checktile(1,-1);
    tiles.shift();
    if(tiles.length == 0) {
      break;
    }
    index++;
  }
  function checktile(xo, yo) {
    
    var splittile = tile.split(",");
    var x = xo + parseInt(splittile[0]);
    var y = yo + parseInt(splittile[1]);
    if (getState(x + "," + y) != 0) {
      return;
    }
    if (getTile(x + "," + y) == "0") {
      if (!tiles.includes(x + "," + y)) {
        tiles.push(x + "," + y); 
      }
    }
    opentile(elementdict[x + "," + y], true, true, 5, Math.floor(getDistance(x,y,origp.x,origp.y) * 5));
  }
  /*
  opentile(elementdict[(x + 1) + "," + (y)], true);
  opentile(elementdict[(x - 1) + "," + (y)], true);
  opentile(elementdict[(x) + "," + (y + 1)], true);
  opentile(elementdict[(x) + "," + (y - 1)], true);
  opentile(elementdict[(x + 1) + "," + (y + 1)], true);
  opentile(elementdict[(x - 1) + "," + (y - 1)], true);
  opentile(elementdict[(x + 1) + "," + (y - 1)], true);
  opentile(elementdict[(x - 1) + "," + (y + 1)], true);
  */
}
function getDistance(x1,y1,x2,y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt(a*a + b*b);
}


function penaltyloop() {    
  
  if (penalty > 0) {
      penalty -= 1;
      localStorage.setItem("penalty", penalty);
      var camerashakev;
      if (camerashakeover > 0) {
        camerashakeover -= 0.2;
      }
      if (penalty > 2500) {
        camerashakev = ((penalty - 2500) / 40) + 2 + camerashakeover;
      } else {
        camerashakev = 2 + camerashakeover;
      }
    if (getSetting(3) == "1") {
      camerashakev = 0;
    }
        var camerashakeadd = {x: Math.floor((Math.random() - 0.5) * 2 * camerashakev), y: Math.floor((Math.random() - 0.5) * 2 * camerashakev)};
        container.style.left = (parseInt(container.style.left) + (camerashakeorig.x * -1)+ camerashakeadd.x);
        container.style.top = (parseInt(container.style.top) + (camerashakeorig.y * -1) + camerashakeadd.y);
        camerashakeorig = {x: camerashakeadd.x, y: camerashakeadd.y};
    }
  
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
const lerp = (x, y, a) => x * (1 - a) + y * a;
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));


function genLoop() {
      var chunkgentemp = [];
            const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const height  = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var minwidth = Math.floor(width /   600);
    var minheight = Math.floor(height / 600);
    var rcx = Math.floor(parseInt(container.style.left) / 600);
    var rcy = Math.floor(parseInt(container.style.top ) / 600);
    if (penalty > 0) {
    var rcx = Math.floor((parseInt(container.style.left) + (camerashakeorig.x * -1)) / 600);
    var rcy = Math.floor((parseInt(container.style.top) + (camerashakeorig.y * -1)) / 600);
    }
    var rendermode = parseInt(getSetting(0));
  
    for(let ix = -2 + (rendermode * 1); ix < minwidth + 1; ix++) {
      for (let iy = -2 + (rendermode * 1); iy < minheight + 1; iy++) {
        var sx = ((rcx * - 1) + ix) * 600;
        var sy = ((rcy * -1) + iy) * 600;
        if (!chunkloadlist.includes(sx + "," + sy)) {
          chunkloadlist.push(sx + "," + sy);
          generateChunk(sx, sy);
        }
        chunkgentemp.push(sx + "," + sy);
      }
    }
    
    var chunkloadlistlength = chunkloadlist.length;
    var chunkloadlisttemp = chunkloadlist;
    for (let il = 0; il < chunkloadlistlength; il++) {
      if (!chunkgentemp.includes(chunkloadlisttemp[il])) {
          var lengthnodes = container.childElementCount;
          var children = container.childNodes;
          for (let i = 1; i < lengthnodes + 1; i++) {
            var item = children[i];
             if (item == undefined) {
               break;
             }
            var getsave = item.getAttribute("data-savecontainer");
            if (getsave != "y") {
              var dataChunk = item.getAttribute("data-chunk");
            
            if (dataChunk == chunkloadlist[il]) {
              deleteDictElements(item.getAttribute("data-dc"));
              container.removeChild(item);
              chunkloadlist.splice(il, 1);
            }
            }
          }
      }
    }
    
    //var getElls = document.querySelectorAll('[data-at]');
    var getElls = dataat;
    
    for (let ie = 0; ie < getElls.length; ie++) {
      if (!(typeof(getElls[ie]) != 'undefined' && getElls[ie] != null)) {
        continue;
      }
      //var ier = parseInt(getElls[ie].getAttribute("data-rotate")) + 1;
      //getElls[ie].style.transform = "rotate(" + ier + "deg)";
      //getElls[ie].setAttribute("data-rotate", ier);
      var fl = parseFloat(getElls[ie].style.opacity) - 0.002;
      getElls[ie].style.opacity = "" + fl;
      if (fl <= 0) {
        getElls[ie].remove();
      }
      
      /*if (getElls[ie].style.width == undefined) {
      getElls[ie].style.width = "0px";
      getElls[ie].style.height = "0px";
      }
      getElls[ie].style.width = (parseInt(getElls[ie].style.width) * 15 / 16) + "px";
      getElls[ie].style.height = (parseInt(getElls[ie].style.height) * 15 / 16) + "px";
      getElls[ie].style.left = 25 - (parseInt(getElls[ie].style.width)/2);
      getElls[ie].style.top = 25 - (parseInt(getElls[ie].style.width)/2);
      if (parseInt(getElls[ie].style.height) < 0) {
        getElls[ie].remove();
      }*/
      var url = animationdict[getElls[ie].getAttribute("data-biome")].split(",")[Math.floor(parseInt(getElls[ie].getAttribute("data-at")) / parseInt(getElls[ie].getAttribute("data-ats")))] + ".png";
      getElls[ie].style.backgroundImage = "url('" + url + "')" 
      var add = 1;
      if (getElls[ie].getAttribute("data-atsw") != undefined) {
        if (parseInt(getElls[ie].getAttribute("data-atsw")) > 0) {
          add = 0;
          getElls[ie].setAttribute("data-atsw", parseInt(getElls[ie].getAttribute("data-atsw")) -1);
        }
      }
      getElls[ie].setAttribute("data-at", parseInt(getElls[ie].getAttribute("data-at")) + add);
      if (parseInt(getElls[ie].getAttribute("data-at")) >= (parseInt(getElls[ie].getAttribute("data-ats")) * 8) - 1) {
        getElls[ie].remove();
          dataat.splice(ie, 1);
      }
    }
}
function loop () {
    
    var color = docsc.style.color;
    var rgb = color;
      rgb = rgb.substring(4, rgb.length-1)
         .replace(/ /g, '')
         .split(',');
    if (rgb[0] > 5 && rgb[1] > 5 && rgb[2] > 5) {
      //var rgb = hexToRgb(color);
      var rgb = {r: rgb[0], g: rgb[1], b: rgb[2]};
      var newrgb = {r: lerp(rgb.r, 0, 0.01),g: lerp(rgb.g, 0, 0.01),b: lerp(rgb.b, 0, 0.01)};
      //var newhex = rgbToHex(newrgb.r, newrgb.g, newrgb.b);
      docsc.style.color = "rgb("+ newrgb.r + "," + newrgb.g + "," + newrgb.b + ")";
    } else {
      docsc.style.color = "rgb(0,0,0)";
    }
    
    doubletapcheck -= 0.5;
    if (ismobile) {
      if (tapping) {
        flagcounter++;
        if (flagcounter > 20) {
          var getid = savetap.getAttribute("data-id").split(",");
          if (getState(getid) != 1) {
            navigator.vibrate(100);
          }
          flagtile(savetap,parseInt(getid[0]), parseInt(getid[1]));
          flagcounter = -99999;
        }
      }
    }
  
    if (count > 75) {
      alert("Error: You're being ratelimited.");
      count = -1000;
    }
      
    divLoop();
    genLoop();
    cloudLoop();
}
//  var div = document.createElement("DIV");

var nickinputel;
var coordinputel;

function divInit() {
  nickdiv = document.getElementById("nickdiv");
  chatdiv = document.getElementById("chatdiv");
  chatbox = document.getElementById("chatbox");
  
  nickinputel  = document.getElementById("nickinput");
  coordinputel = document.getElementById("coordinput");
  
  nickdiv.style.backgroundColor = "rgba(255, 255, 255, 0.99)";
  chatdiv.style.backgroundColor = "rgba(255, 255, 255, 0.99)";
  //nickdiv.style.opacity = 0.1;
  //chatdiv.style.opacity = 0.1;
}
function divLoop() {
  if (mousePos == undefined || chatinput == undefined) {
    return;
  }
  const width  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  
  //console.log(dragOffset.x, (width - 350), dragOffset.x > (width - 350));
  var mult = 1;
  if (ismobile) {
    mult = 0.5;
  }
  if((mousePos.x > (width - (300 * mult)) && mousePos.y < 350 * mult) || document.activeElement === nickinputel || document.activeElement === coordinputel) {
    opacAdd(nickdiv, 0.05);
  } else {
    opacAdd(nickdiv, -0.05);
  }
  if((mousePos.x < (400 * mult) && mousePos.y > (height - (450 * mult))) || chatinput === document.activeElement) {
    opacAdd(chatdiv, 0.05);
  } else {
    opacAdd(chatdiv, -0.05);
  }
  
  function opacAdd(div, opadd) {
    var rgb = div.style.backgroundColor;
      rgb = rgb.replace("rgba(", "").replace(")", "").replace(" ", "").split(",");
      div.style.backgroundColor = "rgba(255, 255, 255, " + clamp((parseFloat(rgb[3]) + opadd),0,0.9) + ")";
    
    //var fl = clamp(parseFloat(div.style.opacity) + opadd,0,1);
    //div.style.opacity = "" + fl;
  }
  
}

function sendChat(message) {
  serverConnection.send(JSON.stringify({message: message, player: nickname}));
  addChatMessage(message,nickname, "n");
}

function addChatMessage(message, nick, auth) {
  if (auth == "server" && (message == nickname + " has joined." || message == nickname + " has left.")) {
    return;
  }
  var chatadd = document.createElement("p");
  chatadd.setAttribute("class", "chatmessage");
  chatadd.innerText = nick + ": " + message;
  if (auth == "server" || auth=="client") {
    chatadd.innerText = message;
  }
  chatbox.appendChild(chatadd);
  chatbox.scrollTop = chatbox.scrollHeight;
  if (chatbox.childElementCount > 100) {
    chatbox.firstChild.remove();
  }
}


function deleteDictElements(dc) {
  if (dc == null || dc == undefined) {
    return;
  }
  var split = dc.split(",");
  var cx = parseInt(split[0]);
  var cy = parseInt(split[1]);
  
  for (let iy = 0; iy < 12; iy++) {
    for (let ix = 0; ix < 12; ix++) {
      var rx = (cx * 12) + ix;
      var ry = (cy * 12) + iy;
      //var index = ubedict.indexOf(rx + "," + ry);
      //if (index !== -1) {
      //  ubedict.splice(index, 1);
      //}
      delete dict[rx + "," + ry];
      delete elementdict[rx + "," + ry];
    }
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


function cloudLoop() {
  return;
  var ma = Math.random();
  if (ma > 0.999) {
    var getDict = Math.floor((Math.random() - 0.001) * ubedict.length);
    var splitDict = ubedict[getDict].split(",");
    var div = document.createElement("DIV");
    div.setAttribute("class","ubecloud");
    div.setAttribute("data-savecontainer","y");
    div.style.left = (parseInt(splitDict[0]) * 50) + "px";
    div.style.top = (parseInt(splitDict[1]) * 50) + "px";
    container.appendChild(div);
  }
  
  var clouds = document.getElementsByClassName("ubecloud");
  for (let ic = 0; ic < clouds.length; ic++) {
    var cl = clouds[ic];
    cl.style.left = (parseInt(cl.style.left) - 1) + "px";
  }
}

function mod(x, m) {
    return (x%m + m)%m;
}

function selectloop() {
  var rc = raycastTile(mp.x, mp.y);
  selectelement.style.left = lerp(parseFloat(selectelement.style.left),(rc.x*50),0.25);
  selectelement.style.top = lerp(parseFloat(selectelement.style.top),(rc.y*50),0.25);
}

var rainbowoffset = 0;
function scrollRainbow() {
  if (renderfilter != 1) {
    return;
  }
  rainbowoffset += 10;
  var query = document.querySelectorAll("[data-id]");
   query.forEach(async function(rainbow) {
     var id = rainbow.getAttribute("data-id").split(",");
     rainbow.style.filter = "hue-rotate(" + Math.floor(mod((parseInt(id[0]) * 10) + rainbowoffset, 360)) + "deg)";
   })
}
              //div.style.filter = "hue-rotate(" + Math.floor((rx * 10) - (Math.floor(((rx * 10) / 360))) * 360) + "deg)";

var ascii = "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}\"";
var tilevalues = ["0","1","2","3","4","5","6","7","8","9","b","ba","qb","q"];
function weirdhex(num) {
	var ascl = ascii.length;
  return ascii[Math.floor(num / (ascl - 1))] + ascii[num % (ascl - 1)];
}
function weirdunhex(str) {
	var ascl = ascii.length;
	var i1 = ascii.indexOf(str[0]);
	var i2 = ascii.indexOf(str[1]);
  return (i1 * (ascl - 1)) + i2;
}
function chunkcompress(chunk) {
	var chunklist = [];
  var splitchunk = chunk.split("*");
  for(const tileindex in splitchunk) {
  	var tile = splitchunk[tileindex];
  	var splittile = tile.split("_");
    var val = parseInt(splittile[2]) + (parseInt(splittile[3]) * 3);
    var user = "~";
    if (splittile.length > 4) {
    	user = weirdhex(parseInt(splittile[4]));
    }
    var total = ascii[tilevalues.indexOf(splittile[1])] + ascii[val] + user;
    chunklist.push(total);
  }
  var join = chunklist.join(""); 
  return join;
}
function chunkldecompress(chunk, chunkid) {
  return chunkdecompress(chunk, parseInt(chunkid.split(",")[0]), parseInt(chunkid.split(",")[1]));
}
function chunkdecompress(chunk, chunkx, chunky) {
  var splitchunk = chunk.split("");
  var stringconnect = "";
  var strind = 0;
  var chunklist = [];
  var strindex = 0;
  for (const charindex in splitchunk) {
  	var char = splitchunk[charindex];
    strind++;
   	stringconnect += char;
    var finishstring = false;
    if (strind % 4 == 0) {
      finishstring = true;
    } else {
    	if (char == "~") {
        finishstring = true;
      }
    }
    if (finishstring) {
  	  var io = ascii.indexOf(stringconnect[0]);
  	  var iov = ascii.indexOf(stringconnect[1]);
      var tile = tilevalues[io]; 
      var state = iov % 3;
      var biome = Math.floor(iov / 3);
      var tileX = (chunkx * 12) + (strindex % 12);
      var tileY = (chunky * 12) + Math.floor(strindex / 12);
      var total = tileX + "," + tileY + "_" + tile + "_" + state + "_" + biome;
  	  if (stringconnect.length > 3) {
   	 		total += "_" + weirdunhex(stringconnect[2] + stringconnect[3])
    	}
      chunklist.push(total);
      strind = 0;
      stringconnect = "";
    	strindex++;
    }
  }
  return chunklist.join("*");
}