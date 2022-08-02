let colorhue = 0;
let colorsatur = 1;
let colorbright = 1;

let colorgoalhue = 0;
let colorgoalsatur = 0;
let colorgoalbright = 0;
let colorgoal = "#000000";
let guesses = [];
let won = false;
let gamedone = false;
let mouseDown = [0,0,0,0,0,0,0,0];
let ismobile = false;
let dayoffset = 0;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function setAnalytic(type, value) {
  if (localStorage["shadle_unlimited"] == "1") return;

  var now = new Date();
  var day = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7);
  var yayfetch = await fetch("https://wakeful-enchanted-theory.glitch.me/analytics", {
    method: "POST",
    body: JSON.stringify({type: type, value: value, day: day})
    }) 
}


function init() {
  
  if (localStorage["shadle_unlimited"] == "1") dayoffset = Math.round(Math.random() * 1000);
  if (localStorage["shadle_unlimited"] != "1") updateStreak();
  generateColor();
  updateColorButtons();
  tutorial();

  document.body.onmousedown = function(evt) { 
    mouseDown[evt.button] = true;
  }
  document.body.onmouseup = function(evt) {
    mouseDown[evt.button] = false;
  }
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    ismobile = true;
    addcss("shadle/mobilestyle.css");
  }

  
  if (ismobile) document.getElementById("twitterbutton").remove();
}



async function tutorial() {
  if (localStorage["shadle_first"] == undefined) {
    localStorage["shadle_first"] = "1";
    setAnalytic("users","");
  }
  if (localStorage["shadle_tutorial"] == undefined) {
    document.getElementById("tutorialuioverlay").dataset.reveal = "1";
    await sleep(100);
    document.getElementById("tutorialui").dataset.reveal = "1";
  }
}

function helpmenu() {
  document.getElementById("tutorialuioverlay").dataset.reveal = "1";
  document.getElementById("tutorialui").dataset.reveal = "1";
}
function settingsmenu() {
  document.getElementById("settingsuioverlay").dataset.reveal = "1";
  document.getElementById("settingsui").dataset.reveal = "1";
}
async function statsmenu() {
  document.getElementById("wintext").innerText = "";
  if (gamedone) {
    document.getElementById("wintext").innerText = "You're so good at this game.";
    if (guesses.length == 1) {
      document.getElementById("wintext").innerText = "Wow! one attempt!";
    }
    if (guesses.length == 4) {
      document.getElementById("wintext").innerText = "Clutch!";
    }
    if (!won) {
      document.getElementById("wintext").innerText = "You'll get it next time. :)";
    }
  }
  document.getElementById("winuioverlay").dataset.reveal = "1";
  document.getElementById("ws_played").innerText = JSON.parse(localStorage.shadle_stats).w + JSON.parse(localStorage.shadle_stats).l;
  document.getElementById("ws_str").innerText = JSON.parse(localStorage.shadle_stats).str;
  //document.getElementById("ws_mstr").innerText = JSON.parse(localStorage.shadle_stats).mstr;
  document.getElementById("ws_wlr").innerText = Math.floor(JSON.parse(localStorage.shadle_stats).w / (JSON.parse(localStorage.shadle_stats).w + JSON.parse(localStorage.shadle_stats).l) * 100) + "%";
  if (isNaN(Math.floor(JSON.parse(localStorage.shadle_stats).w / (JSON.parse(localStorage.shadle_stats).w + JSON.parse(localStorage.shadle_stats).l) * 100))) {
    document.getElementById("ws_wlr").innerText = "0%";
  }
  document.getElementById("winui").dataset.reveal = "1";
}

async function play() {
  localStorage["shadle_tutorial"] = "1";
  document.getElementById("tutorialui").dataset.reveal = "0";
  document.getElementById("tutorialuioverlay").dataset.reveal = "0";
}

async function exitsettings() {
  document.getElementById("settingsui").dataset.reveal = "0";
  document.getElementById("settingsuioverlay").dataset.reveal = "0";
}

function updateStreak() {
  
  if (localStorage["shadle_stats"] == undefined) {
    localStorage["shadle_stats"] = JSON.stringify({w1: 0, w2: 0, w3: 0, w4: 0, w5: 0, w6: 0, w: 0, l: 0, str: 0, mstr: 0});
  }

  var now = new Date();
  var days = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7)- 100 + dayoffset;
  var stats = JSON.parse(localStorage["shadle_stats"]);
  if (stats["str"] == undefined) stats["str"] = 0;
  if (stats["strday"] == undefined) stats["strday"] = 0;
  if (days > stats.strday + 1) stats.str = 0;
  localStorage.shadle_stats = JSON.stringify(stats);
}
function pickhue(elm) {
  var ind = elm.dataset.id;
  colorhue = ind * 36;
  updateColorButtons();
}
function pickbright(elm) {
  var ind = elm.dataset.id;
  colorbright = ind * 0.1;
  updateColorButtons();
}
function picksatur(elm) {
  var ind = elm.dataset.id;
  colorsatur = ind * 0.1;
  updateColorButtons();
}

function mouseover(elm) {
  var ind = elm.dataset.id;
  if (mouseDown[0]) {
    if (elm.dataset.type == "hue") colorhue = ind * 36;
    if (elm.dataset.type == "satur") colorsatur = ind * 0.1;
    if (elm.dataset.type == "bright") colorbright = ind * 0.1;
    updateColorButtons();
  }
}

function clickcolor(elm) {
  var ind = elm.dataset.id;
  if (elm.dataset.type == "hue") colorhue = ind * 36;
  if (elm.dataset.type == "satur") colorsatur = ind * 0.1;
  if (elm.dataset.type == "bright") colorbright = ind * 0.1;
  updateColorButtons();
}

function consolelog() {

}


async function generateColor() {
  var now = new Date();
  var days = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7) - 100 + dayoffset;
  consolelog((now - (now.getTimezoneOffset() * 60000)) /8.64e7);
  consolelog(now/8.64e7);
  consolelog(days);
  if (localStorage["shadle_unlimited"] != "1") {
    if (localStorage["shadle_lastday"] != days) {
      localStorage["shadle_guesses"] = JSON.stringify([]);
      localStorage["shadle_lastday"] = days;
    }
    if (localStorage["shadle_stats"] == undefined) {
      localStorage["shadle_stats"] = JSON.stringify({w1: 0, w2: 0, w3: 0, w4: 0, w5: 0, w6: 0, w: 0, l: 0});
    }
  }
  
  colorgoalhue = randomInt(0, 9, days) * 36;
  colorgoalsatur = randomInt(0, 10, days + 500) * 0.1;
  colorgoalbright = randomInt(0, 10, days + 1000) * 0.1;
  colorgoal = hsvToHex(colorgoalhue, colorgoalsatur, colorgoalbright);
  document.getElementById("colorref").innerText = colorgoal;

  document.getElementById("submitcolorbutton").dataset["reveal"] = "1";
  if (localStorage["shadle_unlimited"] != "1") {
    var tempguesses = JSON.parse(localStorage.shadle_guesses);
    for (let i= 0; i < tempguesses.length; i++) {
      const guess = tempguesses[i];
      colorhue = guess.h;
      colorsatur = guess.s;
      colorbright = guess.v;
      submitcolor(false);
      updateColorButtons();
      await sleep(200);
    }
  }
  document.getElementById("submitcolorbutton").dataset["reveal"] = "0";

}


function submitcolor(firsttime) {
  if (gamedone) return;
  if (guesses.length >= 4) return;
  guesses.push({h: colorhue, s: colorsatur, v: colorbright});
  /*
  var huediff = (Math.abs(Math.round(colorgoalhue/36) - Math.round(colorhue/36)) / 9);
  var saturdiff = (Math.abs(Math.round(colorgoalsatur/10) - Math.round(colorsatur/10)) / 10);
  var brightdiff = (Math.abs(Math.round(colorgoalbright/10) - Math.round(colorbright/10)) / 11);
  consolelog(huediff, saturdiff,brightdiff);
  */
  var dist = deltaE(hsvToRgb2(colorhue, colorsatur, colorbright), hsvToRgb2(colorgoalhue, colorgoalsatur, colorgoalbright));
  var dist = 100 - dist;
  createGuess(colorhue,colorsatur,colorbright,Math.floor(dist), guesses.length - 1);
  var firstTimeWin = firsttime;
  if (localStorage["shadle_unlimited"] != "1") localStorage.shadle_guesses = JSON.stringify(guesses);
  if (dist == 100) {
    gamedone = true;
    win(firstTimeWin);
  } else {
    if (guesses.length == 4) {
      gamedone = true;
      defeat(firstTimeWin);
    }
  }
}

function revealBackground() {
  document.getElementById("background").style.backgroundColor = colorgoal;
  document.getElementById("background").dataset["reveal"] = "1";
  var root = document.querySelector(':root');
  root.style.setProperty("--bg", colorgoal);
  root.style.setProperty("--outline", "2px");
  root.style.setProperty("--outlinen", "-2px");
  console.log(colorgoalbright);
  var bgoutline = hsvToHex(colorgoalhue, colorgoalsatur, (colorgoalbright * 0.8));
  if (colorgoalbright > 0.5) {
    document.body.dataset["dark"] = "1";
    root.style.setProperty("color-scheme", "light dark");
    root.style.setProperty("--color", "#000000");
    root.style.setProperty("--colortransparent", "#00000060");
  } else {
    document.body.dataset["dark"] = "0";
    root.style.removeProperty("color-scheme");
    root.style.setProperty("--color", "#FFFFFF");
    root.style.setProperty("--colortransparent", "#FFFFFF60");
  }
  if (colorgoalbright < 0.5 && colorgoalsatur == 0) {
    bgoutline = colorgoal;
  }
  if (colorgoalbright < 0.25) {
    bgoutline = hsvToHex(colorgoalhue, colorgoalsatur, (colorgoalbright * 0.7));
  }
  root.style.setProperty("--bgoutline", bgoutline); 
}

async function win(first) {
  won = true;
  if (localStorage["shadle_unlimited"] == "1") first = false;
  if (first) {
    var stats = JSON.parse(localStorage.shadle_stats);
    if (stats["str"] == undefined) stats["str"] = 0;
    if (stats["mstr"] == undefined) stats["mstr"] = 0;
    var now = new Date();
    var days = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7)- 100 + dayoffset;
    stats.strday = days;
    stats.str += 1;
    if (stats.str >= stats.mstr) stats.mstr = stats.str;
    stats.w += 1;
    stats["w" + guesses.length] += 1;
    setAnalytic("beats",1);
    setAnalytic("attempts", guesses.length);
    localStorage.shadle_stats = JSON.stringify(stats);
  }
  document.getElementById("wintext").innerText = "You're so good at this game.";
  if (guesses.length == 1) {
    document.getElementById("wintext").innerText = "Wow! one attempt!";
  }
  if (guesses.length == 4) {
    document.getElementById("wintext").innerText = "Clutch!";
  }
  revealBackground();
  await sleep(1400);
  document.getElementById("submitcolorbutton").dataset["reveal"] = "1";
  revealBackground();
  document.getElementById("winuioverlay").dataset.reveal = "1";
  document.getElementById("ws_played").innerText = JSON.parse(localStorage.shadle_stats).w + JSON.parse(localStorage.shadle_stats).l;
  document.getElementById("ws_str").innerText = JSON.parse(localStorage.shadle_stats).str;
  //document.getElementById("ws_mstr").innerText = JSON.parse(localStorage.shadle_stats).mstr;
  document.getElementById("ws_wlr").innerText = Math.floor(JSON.parse(localStorage.shadle_stats).w / (JSON.parse(localStorage.shadle_stats).w + JSON.parse(localStorage.shadle_stats).l) * 100) + "%";
  document.getElementById("winui").dataset.reveal = "1";
}
async function defeat(first) {
  if (localStorage["shadle_unlimited"] == "1") first = false;
  if (first) {
    var stats = JSON.parse(localStorage.shadle_stats);
    if (stats["str"] == undefined) stats["str"] = 0;
    if (stats["mstr"] == undefined) stats["mstr"] = 0;
    stats.str = 0;
    stats.l += 1;
    setAnalytic("beats",0);
    localStorage.shadle_stats = JSON.stringify(stats);
  }
  revealBackground();
  await sleep(1400);
  document.getElementById("submitcolorbutton").dataset["reveal"] = "1";
  document.getElementById("winuioverlay").dataset.reveal = "1";
  document.getElementById("ws_played").innerText = JSON.parse(localStorage.shadle_stats).w + JSON.parse(localStorage.shadle_stats).l;
  document.getElementById("ws_str").innerText = JSON.parse(localStorage.shadle_stats).str;
  //document.getElementById("ws_mstr").innerText = JSON.parse(localStorage.shadle_stats).mstr;
  document.getElementById("ws_wlr").innerText = Math.floor(JSON.parse(localStorage.shadle_stats).w / (JSON.parse(localStorage.shadle_stats).w + JSON.parse(localStorage.shadle_stats).l) * 100) + "%";
  document.getElementById("wintext").innerText = "You'll get it next time. :)";
  document.getElementById("winui").dataset.reveal = "1";
}

function deltaE(rgbA, rgbB) {
  let labA = rgb2lab(rgbA);
  let labB = rgb2lab(rgbB);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / (1.0);
  let deltaCkcsc = deltaC / (sc);
  let deltaHkhsh = deltaH / (sh);
  let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb){
  let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

async function createGuess(h, s, v, dist, ind) {
  var guess = document.createElement("DIV");
  guess.className = "guess";
  var guesscolor = document.createElement("DIV");
  guesscolor.className = "guess-color";
  guesscolor.style.backgroundColor = hsvToHex(h, s, v);
  guesscolor.setAttribute("onclick", "copycolor(" + ind + ")");
  var guesshinthue = document.createElement("DIV");
  guesshinthue.className = "hint";
  guesshinthue.innerText = "H";
  guesshinthue.setAttribute("onclick", "copycolorchannel(" + ind + ", 'H')");
  var guesshintsatur = document.createElement("DIV");
  guesshintsatur.className = "hint";
  guesshintsatur.innerText = "S";
  guesshintsatur.setAttribute("onclick", "copycolorchannel(" + ind + ", 'S')");
  var guesshintbright = document.createElement("DIV");
  guesshintbright.className = "hint";
  guesshintbright.innerText = "V";
  guesshintbright.setAttribute("onclick", "copycolorchannel(" + ind + ", 'V')");

  guess.appendChild(guesscolor);
  guess.appendChild(guesshinthue);
  guess.appendChild(guesshintsatur);
  guess.appendChild(guesshintbright);
  document.getElementById("guesses").appendChild(guess);

  var diff = Math.abs(Math.round(h / 36) - Math.round(colorgoalhue / 36));
  if (colorgoalsatur == 0 || colorgoalbright == 0) diff = 0;
  if (diff == 0) {
    guesshinthue.dataset["type"] = "correct";
  } else if (diff == 1 || diff == 9) {
    guesshinthue.dataset["type"] = "close";
  } else {
    guesshinthue.dataset["type"] = "incorrect";
  }
  var diff2 = Math.abs(Math.round(s / 0.1) - Math.round(colorgoalsatur / 0.1));
  if (colorgoalbright == 0) diff2 = 0;
  if (diff2 == 0) {
    guesshintsatur.dataset["type"] = "correct";
  } else if (diff2 == 1) {
    guesshintsatur.dataset["type"] = "close";
  } else {
    guesshintsatur.dataset["type"] = "incorrect";
  }
  var diff3 = Math.abs(Math.round(v / 0.1) - Math.round(colorgoalbright / 0.1));
  if (diff3 == 0) {
    guesshintbright.dataset["type"] = "correct";
  } else if (diff3 == 1) {
    guesshintbright.dataset["type"] = "close";
  } else {
    guesshintbright.dataset["type"] = "incorrect";
  }
  
}

function copycolor(i) {
  colorhue = guesses[i].h;
  colorsatur = guesses[i].s;
  colorbright = guesses[i].v;
  updateColorButtons();
}

function copycolorchannel(i, c) {
  if (c == "H") colorhue = guesses[i].h;
  if (c == "S") colorsatur = guesses[i].s;
  if (c == "V") colorbright = guesses[i].v;
  updateColorButtons();
}

function randomInt(min, max, seed) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(mulberry32(seed)() * (max - min + 1)) + min;
}

function mulberry32(a) {
  return function() {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}



function updateColorButtons() {
  for (let i= 0; i < 10; i++) {
    var btn = document.getElementById("hue_" + i);
    btn.style.backgroundColor = hsvToHex(i * 36, colorsatur, colorbright);
    if (colorhue == i * 36) {
      btn.dataset["selected"] = "1";
    } else {
      btn.dataset["selected"] = "0";
    }
  }
  for (let i= 0; i < 11; i++) {
    var btn = document.getElementById("satur_" + i);
    btn.style.backgroundColor = hsvToHex(colorhue, i * 0.1, colorbright);
    consolelog(i * 0.1, colorsatur, i);
    if (colorsatur == i * 0.1) {
      btn.dataset["selected"] = "1";
    } else {
      btn.dataset["selected"] = "0";
    }
  }
  for (let i= 0; i < 11; i++) {
    var btn = document.getElementById("bright_" + i);
    btn.style.backgroundColor = hsvToHex(colorhue, colorsatur, i * 0.1);
    if (colorbright == i * 0.1) {
      btn.dataset["selected"] = "1";
    } else {
      btn.dataset["selected"] = "0";
    }
  }
  document.getElementById("confirmingcolor").style.backgroundColor = hsvToHex(colorhue, colorsatur, colorbright);
}

function hsvToHex(hue, saturation, value) {
  var rgb = hsvToRgb(hue, saturation, value);
  return rgbToHex(Math.floor(rgb[0] * 255), Math.floor(rgb[1] * 255), Math.floor(rgb[2] * 255));
}
function hsvToRgb2(hue, saturation, value) {
  var rgb = hsvToRgb(hue, saturation, value);
  return [Math.floor(rgb[0] * 255), Math.floor(rgb[1] * 255), Math.floor(rgb[2] * 255)];
}
function hsvToRgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}   

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

async function closemenu() {
  document.getElementById("winui").dataset.reveal = "0";
  document.getElementById("winuioverlay").dataset.reveal = "0";
}

function share() {

  var now = new Date();
  var days = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7)- 100 + dayoffset;
  consolelog(days);

  var sharetext = "Shadle #" + (days - 18990) + " " + guesses.length + "/4  (" + colorgoal + ")\n";
  if (!won) sharetext = "Shadle #" + (days - 18990) + " X/4  (" + colorgoal + ")\n";
  if (localStorage["shadle_unlimited"] == "1") sharetext = sharetext.replace("#" + (days - 18990), "Unlimited");
  var title = sharetext;
  //sharetext = sharetext + colorgoal + "\n";
  var description = sharetext;
  for (let i = 0; i < guesses.length; i++) {
    var guess = guesses[i];
    var charhue = "⚫";
    var charsatur = "⚫";
    var charbright = "⚫";
    var diff = Math.abs(Math.round(guess.h / 36) - Math.round(colorgoalhue /36));
    if (colorgoalsatur == 0 || colorgoalbright == 0) diff = 0;
    if (diff == 0) {
      charhue = "🟢";
    } else if (diff == 1 || diff == 9) {charhue = "🟡"}
    var diff = Math.abs(Math.round(guess.s / 0.1) - Math.round(colorgoalsatur /0.1));
    if (colorgoalbright == 0) diff = 0;
    if (diff == 0) {
      charsatur = "🟢";
    } else if (diff == 1) {charsatur = "🟡"}
    var diff = Math.abs(Math.round(guess.v / 0.1) - Math.round(colorgoalbright /0.1));
    if (diff == 0) {
      charbright = "🟢";
    } else if (diff == 1) {charbright = "🟡"}
    sharetext = sharetext + "\n" + charhue + charsatur + charbright;
    description = description + "\n" + charhue + charsatur + charbright;
  }
  sharetext = sharetext + "\nhttps://looserrip.github.io/shadle";
  
  consolelog(sharetext);
  console.log(sharetext);
  if(!gamedone) sharetext="Your daily color guessing game!\nhttps://looserrip.github.io/shadle";
  if(!gamedone) description="Your daily color guessing game!\n";
  if (ismobile) {
    navigator.share({
      title: "",
      text: description,
      url: "",
    });
  } else {
    navigator.clipboard.writeText(sharetext);
  }
}
async function settweet() {
  var now = new Date();
  var days = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7)- 100 + dayoffset;
  var sharetext = "Shadle%20%23" + (days - 18990) + "%20" + guesses.length + "/4%20(" + colorgoal.replace("#", "%23") + ")%0a";
  if (!won) sharetext = "Shadle%20%23" + (days - 18990) + "%20X/4%20(" + colorgoal + ")%0a";
  if (localStorage["shadle_unlimited"] == "1") sharetext = sharetext.replace("%20%23" + (days - 18990), "Unlimited");
  for (let i = 0; i < guesses.length; i++) {
    var guess = guesses[i];
    var charhue = "%E2%9A%AB";
    var charsatur = "%E2%9A%AB";
    var charbright = "%E2%9A%AB";
    var diff = Math.abs(Math.round(guess.h / 36) - Math.round(colorgoalhue /36));
    if (colorgoalsatur == 0 || colorgoalbright == 0) diff = 0;
    if (diff == 0) {
      charhue = "%F0%9F%9F%A2";
    } else if (diff == 1 || diff == 9) {charhue = "%F0%9F%9F%A1"}
    var diff = Math.abs(Math.round(guess.s / 0.1) - Math.round(colorgoalsatur /0.1));
    if (colorgoalbright == 0) diff = 0;
    if (diff == 0) {
      charsatur = "%F0%9F%9F%A2";
    } else if (diff == 1) {charsatur = "%F0%9F%9F%A1"}
    var diff = Math.abs(Math.round(guess.v / 0.1) - Math.round(colorgoalbright /0.1));
    if (diff == 0) {
      charbright = "%F0%9F%9F%A2";
    } else if (diff == 1) {charbright = "%F0%9F%9F%A1"}
    sharetext = sharetext + "%0a" + charhue + charsatur + charbright;
  }
  sharetext = sharetext + "%0ahttps://looserrip.github.io/shadle";
  consolelog(sharetext);
  if(!gamedone) sharetext="Your%20daily%20color%20guessing%20game!%0ahttps://looserrip.github.io/shadle";
  await sleep(500);
  location.href = "https://twitter.com/intent/tweet?text=" + sharetext;
  //document.getElementById("twitterspan").setAttribute("href", "https://twitter.com/intent/tweet?text=" + sharetext);
  //navigator.clipboard.writeText(sharetext);
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log("PROMPTTTT");
  e.prompt();
});

async function hardmode() {
  await sleep(500);
  location.href = "https://looserrip.github.io/shadle/hard";
}

