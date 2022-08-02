const serverAddress = 'wss://badjackbox.glitch.me/';
const serverConnection = new WebSocket(serverAddress);
var code;
var players = [];
var playerelements = [];
var playersfinished;
var playeraddresses = new Object();
var playerdict = new Object();
var playerslength;
var gamestate = 0;
var finishedround1 = false;
var datev;
var audioDict = {none: "",
                 theme_intro:  "https://media1.vocaroo.com/mp3/1lk2vzvOJ40O", 
                 theme_round1: "https://media1.vocaroo.com/mp3/1c3yRdjtgFh9", 
                 theme_round2: "https://media1.vocaroo.com/mp3/13Oh0vCPLj9r",
                 player_join:  "https://media1.vocaroo.com/mp3/1kOeUeltzbA7",
                 vine_boom:    "https://media1.vocaroo.com/mp3/1cBfGBHKpD0e"}

serverConnection.onopen = function() {
  console.log("I just connected to the server on " + serverAddress);
  
  serverConnection.send(JSON.stringify({host:0}));
  
  setInterval(pingloop, 15000);
}

serverConnection.onmessage = function(event) {
  if (validJson(event.data)) {
    var parse = JSON.parse(event.data);
    if (parse.code != undefined) {
      //document.getElementById("gamecode").innerText = parse.code;
      code = parse.code;
      gametransition();
    } else if (parse.playerjoined != undefined) {
      spawnPlayer(parse.playerjoined, parse.auth);
    } else if (parse.playerleft != undefined) {
      if (gamestate == 0) {
        removePlayer(parse.playerleft, parse.auth);
      }
    } else if (parse.startgame != undefined) {
      gamestate = 1;
      startgame();
    } else if (parse.answers != undefined) {
      if (parse.answersround == 1) {
        document.getElementById("checkdevices").dataset.check = "0";
        document.getElementById("progressbg").dataset.state = "2";
        console.log(parse.answers);
        answerdict = parse.answers;
        var cn = [...document.getElementsByClassName("playerlobbyanswer")];
        cn.forEach(cnhighlight => {
          cnhighlight.dataset.state = "2";
        });
        votingstart();
      }
    } else if (parse.playerfinished != undefined) {
      playersfinished++;
      highlightPlayer(parse.playerfinished);
      if (playersfinished == players.length && !finishedround1) {
        finishedround1 = true;
        document.getElementById("progressicon").dataset.state = "2";
        serverConnection.send(JSON.stringify({finishround: true}));
      }
    } else if (parse.votesubmitted != undefined) {
      if (parse.round == 1) {
        highlightPlayer(parse.address);
        if (parse.address != parse.voteowner) {
          if (playerdict[parse.voteowner]["vote" + parse.votesubmitted] == undefined){
            playerdict[parse.voteowner]["vote" + parse.votesubmitted] = 0;
          }
          playerdict[parse.voteowner]["vote" + parse.votesubmitted] += 1;
        }
      }
    }
    console.log("Received: " + event.data);
  }
  //let obj = JSON.parse(event.data);
}
var answerdict;
let mousedown = [false,false,false,false,false,false,false,false,false,false,false,false,false];
var firstmouse = false;
var mp = {x: 0, y: 0};
function init() {
  playersfinished = 0;
  datev = new Date();
  document.body.onmouseup = function(evt) {
    mousedown[evt.button] = false;
    if (dragginglobby != undefined) {
      dragginglobby.setAttribute("data-dragginglobby", "0");
      dragginglobby = undefined;
    }
  }
  document.body.onmousedown = function(evt) {
    mousedown[evt.button] = true;
    if (!firstmouse) {
      firstmouse = true;
      apreloadAllAudio();
    }
  }
  document.body.onmousemove = function(evt) {
    mp = {x: evt.clientX, y: evt.clientY};
  }
  preloadImages();
  setInterval(dragloop, 2);
}
async function removePlayer(username, auth) {
  delete playeraddresses[auth];
  var rem = document.querySelectorAll("[data-plla='" + auth + "']");
  players.splice(players.indexOf(auth), 1);
  if (rem != undefined) rem[0].remove();
  var cn = document.getElementById("playerlist").childNodes;
  for (var indfilter = 1; indfilter < cn.length; indfilter++) {
    var changefilter = cn[indfilter];
    changefilter.firstChild.style.filter = "hue-rotate(" + (((indfilter - 1) / 10) * 360) + "deg)";
  }
}
async function highlightPlayer(auth) {
  var rem = document.querySelectorAll("[data-pllah='" + auth + "']");
  if (rem != undefined) rem[0].dataset.state = "2";
}

async function spawnPlayer(username, auth) {
  players.push(auth);
  playeraddresses[auth] = username;
  playerdict[auth] = {username:username, vote0: 0, vote1: 0, score: 0};
  var ced = document.createElement("DIV");
  ced.setAttribute("class", "playerlobby");
  ced.setAttribute("data-pll", username);
  ced.setAttribute("data-plla", auth);
  var ce = document.createElement("DIV");
  ce.setAttribute("data-playerlobby", "0");
  ce.setAttribute("class", "playerlobbyimg");
  ce.setAttribute("onmousedown", "draglobbyplayer(event, this)");
  ce.style.left = "0px";
  ce.style.top = "0px";
  ce.style.filter = "hue-rotate(" + (((players.length - 1) / 10) * 360) + "deg)";
  ce.style.backgroundImage = "url('" + cursortextures[0] + "')";
  ced.appendChild(ce);
  var cet = document.createElement("P");
  cet.innerText = username;
  cet.setAttribute("class", "playertext");
  ced.appendChild(cet);
  document.getElementById("playerlist").appendChild(ced);
  playerelements.push(ce);
  checkstartbutton();
  await sleep(5);
  ce.setAttribute("data-playerlobby", "1");
  playaudio("player_join", 0.7);
}

async function spawnPlayerAnswer(auth) {
  var username = playeraddresses[auth];
  var ced = document.createElement("DIV");
  ced.setAttribute("class", "playerlobbyanswer");
  ced.dataset.state = "1";
  ced.setAttribute("data-pll", username);
  ced.setAttribute("data-pllah", auth);
  var ce = document.createElement("DIV");
  ce.dataset.state = "0";
  ce.setAttribute("class", "playerlobbyimg");
  ce.setAttribute("onmousedown", "draglobbyplayer(event, this)");
  ce.style.left = "0px";
  ce.style.top = "0px";
  ce.style.filter = "hue-rotate(" + (((players.indexOf(auth)) / 10) * 360) + "deg)";
  ce.style.backgroundImage = "url('" + cursortextures[0] + "')";
  ced.appendChild(ce);
  var cet = document.createElement("P");
  cet.innerText = username;
  cet.setAttribute("class", "playertext");
  ced.appendChild(cet);
  document.getElementById("playerlistanswer").appendChild(ced);
  playerelements.push(ce);
  checkstartbutton();
  await sleep(5);
  ce.setAttribute("data-playerlobby", "1");
}

async function spawnPlayerScore(auth, spot) {
  var username = playeraddresses[auth];
  var score = playerdict[auth].score;
  var cedt = document.createElement("DIV");
  cedt.setAttribute("class","playerlobbyscorediv")
  //cedt.style.top = (spot * 150) + "px";
  var ced = document.createElement("DIV");
  ced.setAttribute("class", "playerlobbyscore");
  ced.dataset.state = "1";
  ced.setAttribute("data-pll", username);
  ced.setAttribute("data-pllsh", auth);
  ced.setAttribute("data-pllsh", auth);
  var ce = document.createElement("DIV");
  ce.dataset.state = "0";
  ce.setAttribute("onmousedown", "draglobbyplayer(event, this)");
  ce.style.left = "0px";
  ce.style.top = "0px";
  ce.style.filter = "hue-rotate(" + (((players.indexOf(auth)) / 10) * 360) + "deg)";
  ce.style.backgroundImage = "url('" + cursortextures[0] + "')";
  ce.setAttribute("class","playerlistscoreimg");
  ced.appendChild(ce);
  // var cet = document.createElement("P");
  // cet.innerText = username;
  // cet.setAttribute("class", "playertext");
  // ced.appendChild(cet);
  
  var cedtt = document.createElement("P");
  cedtt.setAttribute("class","playertextnamescore");
  cedtt.innerText = username;
  var cedtts = document.createElement("P");
  cedtts.setAttribute("class","playertextscore");
  cedtts.innerText = playerdict[auth].score;
  cedt.appendChild(ced);
  cedt.appendChild(cedtt);
  cedt.appendChild(cedtts);
  document.getElementById("playerlistscore").appendChild(cedt);
  playerelements.push(ce);
  checkstartbutton();
  await sleep(50);
  ce.dataset.playerlobby = "1";
  ce.dataset.score = "1";
  cedtt.dataset.score = "1";
  cedtts.dataset.score = "1";
}
var dragginglobby;
var dragOffset;
function draglobbyplayer(event, element) {
  var pllusername = element.parentNode.dataset.pll;
  if (pllusername.toLowerCase().includes("dwayne")) {
    playaudio("vine_boom", 1);
    element.style.backgroundImage = "url('" + "https://imgur.com/lnmvW7R.png" + "')";
  }
  element.setAttribute("data-dragginglobby", "1");
  dragginglobby = element;
  dragOffset = {x: (event.clientX - parseInt(element.style.left)), y: (event.clientY - parseInt(element.style.top))};
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
  serverConnection.send(JSON.stringify({ping: true}));
}
function sethovering(element, id) {
  element.setAttribute("data-hovering", id);
}
function hostgame(element) {
  var ga = element.getAttribute("data-game");
  var list = ["clickrate","dickdetective"];
  window.location.href = "http://badjackbox.glitch.me/host/" + list[parseInt(ga)];
}
async function gametransition() {
  
  document.getElementById("gametransition").setAttribute("data-transition", "1");
  await sleep(1500);
  document.getElementById("gametransition").setAttribute("data-transition", "2");
  document.getElementById("gamecode").innerText = code;
  document.getElementById("gamecodelabel").style.display = "block";
  document.getElementById("gamecodejoinat").style.display = "block";
  document.getElementById("gamecodelink").style.display = "block";
  document.getElementById("gamecontainer").style.display = "block";
  document.body.style.backgroundColor = "#3A00F2";
  document.body.style.backgroundImage = "url('https://imgur.com/xlNzq1Z.png')";
  await sleep(1500);
  document.getElementById("gametransition").setAttribute("data-transition", "3");
  
  
  
}

var audiosong;

async function playsong(key) {
  if (audiosong != undefined) {
    audiosong.pause();
    audiosong.currentTime = 0;
  }
  audiosong = new Audio(audioDict[key]);
  audiosong.volume = 0.3;
  console.log(audiosong);
  audiosong.play();
}
async function playaudio(key, volume) {
  var audiop = new Audio(audioDict[key]);
  audiop.volume = volume;
  audiop.play();
}
var cursortextures = ["https://imgur.com/w4bDhsX.png", "https://imgur.com/XQBbgUY.png","https://imgur.com/1LrO5PW.png", "https://imgur.com/m5BLNWI.png", "https://imgur.com/qDZFXPf.png"];
function preloadImages() {
  var preload = ["https://imgur.com/gDD9YUh.png","https://imgur.com/rb5PVmH.png", "https://imgur.com/zJDmusp.png", "https://imgur.com/cziXipL.png", "https://imgur.com/c3cYGQH.png", "https://imgur.com/m5BLNWI.png", "https://imgur.com/1LrO5PW.png", "https://imgur.com/qDZFXPf.png", "https://imgur.com/i30JThx.png", "https://imgur.com/w4bDhsX.png", "https://imgur.com/XQBbgUY.png","https://imgur.com/sFr5j7T.png","https://imgur.com/PSvCk72.png","https://imgur.com/lnmvW7R.png"];

  for(let ip = 0; ip < preload.length; ip++) {
    var img = document.createElement("IMG");
    img.setAttribute("src", preload[ip]);
    img.setAttribute("style", "display:none;");
    img.setAttribute("alt", '');
    document.body.appendChild(img);
  }
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const lerp = (x, y, a) => x * (1 - a) + y * a;
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
var playeranimsind = 0;
function dragloop() {
  if (gamestate == 1) {
    return;
  }
  if (mousedown[0] && dragginglobby != undefined) {
    //console.log(event.clientX, event.clientY);
    dragginglobby.style.top = lerp((mp.y - dragOffset.y),parseFloat(dragginglobby.style.top), 0.9) + "px";
    dragginglobby.style.left = lerp((mp.x - dragOffset.x),parseFloat(dragginglobby.style.left), 0.9) + "px";
  }
  playeranimsind++;
  var cl;
  playerelements.forEach(el => {
    cl = cursortextures;
    if (playeranimsind % 50 == 0) {
      
      var ga = el.getAttribute("data-srcc");
      if (ga != undefined) {
        //cl = cl.splice(cl.indexOf(el.getAttribute("data-srcc")), 1);
        cl = cl.filter(function(e) { return e !== ga })
      }
      var url = cl[getRandomInt(0,cl.length - 1)];
      var pllusername = el.parentNode.getAttribute("data-pll");
      el.setAttribute("data-srcc", url)
      el.style.backgroundImage = "url('" + url + "')";
      /*
      if (!(dragginglobby == el && pllusername.toLowerCase().includes("dwayne") && pllusername.toLowerCase().includes("johnson"))) {
        el.setAttribute("data-srcc", url)
        el.style.backgroundImage = "url('" + url + "')";
      }
      */
    }
    if (dragginglobby != el) {
      el.style.top = lerp(0, parseFloat(el.style.top), 0.975) + "px";
      el.style.left = lerp(0, parseFloat(el.style.left), 0.975) + "px";
    }
  });
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function startgame() {
  playsong("theme_intro");
  document.getElementById("gametransition").style.display = "block";
  document.getElementById("gametransition").setAttribute("data-transition", "0");
  await sleep(10);
  document.getElementById("gametransition").setAttribute("data-transition", "1");
  await sleep(1500);
  document.getElementById("gametransition").setAttribute("data-transition", "2");
  document.body.style.backgroundImage = "url('https://imgur.com/qfXTfZJ.png')";
  document.getElementById("gamecode").style.display = "none";
  document.getElementById("gamecodelabel").style.display = "none";
  document.getElementById("gamecodejoinat").style.display = "none";
  document.getElementById("gamecodelink").style.display = "none";
  document.getElementById("gamecontainer").style.display = "none";
  await sleep(1500);
  document.getElementById("gametransition").setAttribute("data-transition", "3");
  
  var ceri = document.createElement("IMG");
  ceri.src = "https://imgur.com/zJDmusp.png";
  ceri.className = "intro_img";
  ceri.dataset.anim = "0";
  ceri.setAttribute("draggable","false");
  var cerl = document.createElement("IMG");
  cerl.src = "https://imgur.com/gDD9YUh.png";
  cerl.className = "intro_logo";
  cerl.setAttribute("draggable","false");
  var cer = document.createElement("IMG");
  cer.src = "https://imgur.com/rb5PVmH.png";
  cer.className = "intro_cursor";
  cer.setAttribute("draggable","false");
  document.getElementById("introanimations").appendChild(cer);
  document.getElementById("introanimations").appendChild(ceri);
  document.getElementById("introanimations").appendChild(cerl);
  await sleep(50);
  ceri.dataset.anim = "1";
  await sleep(1750);
  cer.dataset.anim = "0";
  await sleep(1000);
  cer.dataset.anim = "1";
  ceri.src = "https://imgur.com/cziXipL.png";
  await sleep(200);
  cer.dataset.anim = "2";
  await sleep(1000);
  cer.dataset.anim = "3";
  await sleep(1000);
  ceri.dataset.anim = "2";
  await sleep(1250);
  cer.dataset.anim = "4";
  await sleep(800);
  cer.dataset.anim = "5";
  cerl.dataset.anim = "0";
  await sleep(200);
  cer.dataset.anim = "6";
  await sleep(500);
  cer.dataset.anim = "7";
  await sleep(500);
  cerl.dataset.anim = "1";
  await sleep(2500);
  document.getElementById("checkdevices").dataset.check = "1";
  document.getElementById("progressbg").dataset.state = "0";
  document.getElementById("progressbar").dataset.state = "0";
  document.getElementById("progressicon").dataset.state = "0";
  document.getElementById("playerlistanswer").dataset.state = "1";
  
  players.forEach(playerfe => {
    spawnPlayerAnswer(playerfe);
  });
  
  cer.remove();
  ceri.remove();
  serverConnection.send(JSON.stringify({sendprompts: 1}));
  await sleep(50);
  document.getElementById("progressbg").dataset.state = "1";
  document.getElementById("progressbar").dataset.state = "1";
  document.getElementById("progressicon").dataset.state = "1";
  
  await sleep(45000);
  if (!finishedround1) {
    finishedround1 = true;
    document.getElementById("progressicon").dataset.state = "2";
    serverConnection.send(JSON.stringify({finishround: true}));
  }
}

async function votingstart() {
  document.getElementById("playerlistanswer").dataset.state = "2";
  document.getElementById("progressbgv").dataset.state = "0";
  document.getElementById("progressbarv").dataset.state = "0";
  document.getElementById("progressiconv").dataset.state = "0";
  await sleep(2000);
  var shuffledplayers = players.slice(0);
  shuffle(shuffledplayers);
  var promptshow = document.getElementById("promptshow");
  var answershow = document.getElementById("answershow");
  var cn = [...document.getElementsByClassName("playerlobbyanswer")];
  
  promptshow.dataset.state = "0";
  answershow.dataset.state = "0";
  for(const pi in shuffledplayers) {
    cn.forEach(cnhighlight => {cnhighlight.dataset.state = "1";});
    var player = shuffledplayers[pi];
    console.log(pi,shuffledplayers,player);
    
    
    typeprompt(promptshow,answerdict[player].prompt,1000);
    answershow.dataset.state = "0";
    document.getElementById("ctrdiv").dataset.state = "0";
    document.getElementById("progressbarv").dataset.state = "3";
    document.getElementById("progressiconv").dataset.state = "3";
    answershow.dataset.state = "2";
    await sleep(2500);
    answershow.innerText = answerdict[player].answer;
    serverConnection.send(JSON.stringify({viewinganswer:player}));
    answershow.dataset.state = "1";
    document.getElementById("progressbgv").dataset.state = "1";
    document.getElementById("progressbarv").dataset.state = "1";
    document.getElementById("progressiconv").dataset.state = "1";
    await sleep(15000);
    cn.forEach(cnhighlight => {cnhighlight.dataset.state = "2";});
    var playerslength = players.length;
    playerdict[player].vote1 = ((playerslength - 1) - playerdict[player].vote0);
    var perc = Math.round((playerdict[player].vote0 / (playerslength - 1)) * 100);
    playerdict[player].score += Math.round((playerdict[player].vote0 / (playerslength - 1)) * 1000) - (((playerslength - 1) - (playerdict[player].vote0 + playerdict[player].vote1)) * 50);
    if (playerdict[player].score < 0) playerdict[player].score = 0;
    document.getElementById("ctrshow").innerText = perc + "%";
    document.getElementById("ctrdiv").dataset.state = "1";
    
    typeprompt(promptshow,"",1000);
    await sleep(2950);
    document.getElementById("ctrdiv").dataset.state = "2";
    await sleep(50);
  }
  answershow.dataset.state = "2";
  document.getElementById("progressbgv").dataset.state = "0";
  promptshow.removeAttribute("data-state");
  typeprompt(promptshow,answerdict[player].prompt,1000);
  var speed = 1000 / playerslength;
  for (const pi2 in playerelements) {
    var prelm = playerelements[pi2];
    if (prelm.parentNode.dataset.pllah != undefined) {
      prelm.parentNode.dataset.state = "3";
      await sleep(speed);
    }
  }
  await sleep(500);
  for (const pi2 in playerelements) {
    var prelm = playerelements[pi2];
    if (prelm.parentNode.dataset.pllah != undefined) {
      prelm.parentNode.dataset.state = "0";
    }
  }
  answershow.removeAttribute('data-state');
  var objectkeys = Object.keys(playerdict);
  var playerscoreboard = [];
  for (const pi3 in objectkeys) {
    var objectkey = objectkeys[pi3];
    var objkg = playerdict[objectkey];
    var newobject = {address: objectkey, username: objkg.username, score: objkg.score};
    playerscoreboard.push(newobject);
  }
  playerscoreboard.sort(function (a, b) {
    return b.score - a.score;
  });
  console.log(playerscoreboard);
  document.getElementById("playerlistscore").dataset.state = "1";
  for (const pis in playerscoreboard) {
    var plrsb = playerscoreboard[pis];
    spawnPlayerScore(plrsb.address);
    await sleep(speed);
  }
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

async function typeprompt(element, prompt, time) {
  var speed = Math.floor(time / (prompt.length + element.innerText.length));
  console.log(speed);
  var lengthi = element.innerText.length;
  var innerText = element.innerText;
  for(let vi = 0; vi < lengthi; vi++) {
    innerText = innerText.slice(0,innerText.length - 1);
    element.innerText = innerText;
    await sleep(speed);
  }
  for(let vi = 0; vi < prompt.length; vi++) {
    innerText = innerText + prompt.slice(vi, vi + 1);
    element.innerText = innerText;
    await sleep(speed);
  }
}

function startbutton() {
  playerslength = players.length;
  document.getElementById("start").disabled = "disabled";
  attemptingstart = true;
  serverConnection.send(JSON.stringify({startgame: 1}));
}
var attemptingstart = false;
async function checkstartbutton() {
  if (gamestate == 1 || attemptingstart) return;
  await sleep(0);
  if (players.length > 2) {
    document.getElementById("start").removeAttribute("disabled");
  } else {
    document.getElementById("start").disabled = "disabled";
  }
}


//audio crap

/*
+50
var audioFiles = [
    "https://media1.vocaroo.com/mp3/15aziQDMRlRa",
    "https://media1.vocaroo.com/mp3/1c3yRdjtgFh9",
    "https://media1.vocaroo.com/mp3/13Oh0vCPLj9r"
];
*/

function apreloadAllAudio() {
  var audioFiles = Object.values(audioDict);
  audioFiles.forEach(src => {
    apreloadAudio(src);
  });
}

async function apreloadAudio(url) {
  var audio = new Audio();
  audio.addEventListener('canplaythrough', aloadedAudio, false);
  audio.src = url;
  function aloadedAudio() {
    console.log("loaded " + url);
    audio.src = "";
    return;
  }
}
 /*   
var loaded = 0;
function aloadedAudio() {
    loaded++;
    if (loaded == audioFiles.length){
    	apreloadAudioInit();
    }
}
    
var player;
function aplay(index) {
  player = document.getElementById('player');
    player.src = audioFiles[index];
    player.play();
}
    
function apreloadAudioInit() {
  player = document.getElementById('player');
    var i = 0;
    player.onended = function() {
    	i++;
        if (i >= audioFiles.length) {
            // end 
            return;
        }
    	aplay(i);
    };
    aplay(i);
}
    
for (var i in audioFiles) {
    apreloadAudio(audioFiles[i]);
}
*/