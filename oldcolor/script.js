let colorhue = 0;
let colorsatur = 1;
let colorbright = 1;

let colorgoalhue = 0;
let colorgoalsatur = 0;
let colorgoalbright = 0;
let colorgoal = "#000000";
let guesses = [];
let won = false;


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function init() {
  generateColor();
  updateColorButtons();
}

function generateColor() {
  var now = new Date();
  var days = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7) - 100;
  console.log((now - (now.getTimezoneOffset() * 60000)) /8.64e7);
  console.log(now/8.64e7);
  console.log(days);
  if (localStorage["lastday"] != days) {
    localStorage["guesses"] = JSON.stringify([]);
    localStorage["lastday"] = days;
  }
  if (localStorage["stats"] == undefined) {
    localStorage["stats"] = JSON.stringify({w1: 0, w2: 0, w3: 0, w4: 0, w5: 0, w6: 0, w: 0, l: 0});
  }
  
  colorgoalhue = randomInt(0, 9, days) * 36;
  colorgoalsatur = randomInt(0, 10, days + 500) * 0.1;
  colorgoalbright = randomInt(0, 10, days + 1000) * 0.1;
  colorgoal = hsvToHex(colorgoalhue, colorgoalsatur, colorgoalbright);
  document.getElementById("colorref").innerText = colorgoal;

  var tempguesses = JSON.parse(localStorage.guesses);
  for (let i= 0; i < tempguesses.length; i++) {
    const guess = tempguesses[i];
    colorhue = guess.h;
    colorsatur = guess.s;
    colorbright = guess.v;
    submitcolor(false);
  }

}


function submitcolor(firsttime) {
  if (guesses.length >= 4) return;
  guesses.push({h: colorhue, s: colorsatur, v: colorbright});
  /*
  var huediff = (Math.abs(Math.round(colorgoalhue/36) - Math.round(colorhue/36)) / 9);
  var saturdiff = (Math.abs(Math.round(colorgoalsatur/10) - Math.round(colorsatur/10)) / 10);
  var brightdiff = (Math.abs(Math.round(colorgoalbright/10) - Math.round(colorbright/10)) / 11);
  console.log(huediff, saturdiff,brightdiff);
  */
  var dist = deltaE(hsvToRgb2(colorhue, colorsatur, colorbright), hsvToRgb2(colorgoalhue, colorgoalsatur, colorgoalbright));
  var dist = 100 - dist;
  createGuess(colorhue,colorsatur,colorbright,Math.floor(dist), guesses.length - 1);
  var firstTimeWin = firsttime;
  localStorage.guesses = JSON.stringify(guesses);
  if (dist == 100) {
    win(firstTimeWin);
  } else {
    if (guesses.length == 4) {
      defeat(firstTimeWin);
    }
  }
}

function revealBackground() {
  document.getElementById("background").style.backgroundColor = colorgoal;
  document.getElementById("background").dataset["reveal"] = "1";
}

async function win(first) {
  won = true;
  if (first) {
    var stats = JSON.parse(localStorage.stats);
    stats.w += 1;
    stats["w" + guesses.length] += 1;
    localStorage.stats = JSON.stringify(stats);
  }
  if (guesses.length == 1) {
    document.getElementById("wintext").innerText = "mf cheated";
  }
  if (guesses.length == 4) {
    document.getElementById("wintext").innerText = "fr you clutched";
  }
  revealBackground();
  document.getElementById("winuioverlay").dataset.reveal = "1";
  await sleep(1400);
  document.getElementById("ws_played").innerText = JSON.parse(localStorage.stats).w + JSON.parse(localStorage.stats).l;
  document.getElementById("ws_wlr").innerText = Math.floor(JSON.parse(localStorage.stats).w / (JSON.parse(localStorage.stats).w + JSON.parse(localStorage.stats).l) * 100) + "%";
  document.getElementById("winui").dataset.reveal = "1";
}
async function defeat(first) {
  if (first) {
    var stats = JSON.parse(localStorage.stats);
    stats.l += 1;
    localStorage.stats = JSON.stringify(stats);
  }
  revealBackground();
  document.getElementById("winuioverlay").dataset.reveal = "1";
  await sleep(1400);
  document.getElementById("ws_played").innerText = JSON.parse(localStorage.stats).w + JSON.parse(localStorage.stats).l;
  document.getElementById("ws_wlr").innerText = Math.floor(JSON.parse(localStorage.stats).w / (JSON.parse(localStorage.stats).w + JSON.parse(localStorage.stats).l) * 100) + "%";
  document.getElementById("wintext").innerText = "LLLLL";
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
  guesscolor.className = "guesscolor";
  guesscolor.style.backgroundColor = hsvToHex(h, s, v);
  guesscolor.setAttribute("onclick", "copycolor(" + ind + ")")
  var guessconfs = document.createElement("DIV");
  guessconfs.className = "guessconfs";
  var guessc_hue = document.createElement("DIV");
  guessc_hue.className = "guessc";
  guessc_hue.dataset["state"] = "0";
  var guessc_hue_text = document.createElement("P");
  guessc_hue_text.className = "guessct";
  guessc_hue_text.innerText = "H";
  guessc_hue.appendChild(guessc_hue_text);
  guessconfs.appendChild(guessc_hue);
  var guessc_satur = document.createElement("DIV");
  guessc_satur.className = "guessc";
  guessc_satur.dataset["state"] = "0";
  var guessc_satur_text = document.createElement("P");
  guessc_satur_text.className = "guessct";
  guessc_satur_text.innerText = "S";
  guessc_satur.appendChild(guessc_satur_text);
  guessconfs.appendChild(guessc_satur);
  var guessc_bright = document.createElement("DIV");
  guessc_bright.className = "guessc";
  guessc_bright.dataset["state"] = "0";
  var guessc_bright_text = document.createElement("P");
  guessc_bright_text.className = "guessct";
  guessc_bright_text.innerText = "V";
  guessc_bright.appendChild(guessc_bright_text);
  guessconfs.appendChild(guessc_bright);

  guess.appendChild(guesscolor);
  guess.appendChild(guessconfs);
  document.getElementById("guesses").appendChild(guess);

  await sleep(0);
  guessc_hue.dataset["state"] = "a";
  await sleep(100);
  guessc_satur.dataset["state"] = "a";
  await sleep(100);
  guessc_bright.dataset["state"] = "a";
  await sleep(50);
  var diff = Math.abs(Math.round(h / 36) - Math.round(colorgoalhue / 36));
  console.log(diff);
  if (diff == 0) {
    guessc_hue.dataset["state"] = "3";
  } else if (diff == 1 || diff == 9) {
    guessc_hue.dataset["state"] = "2";
  } else {
    guessc_hue.dataset["state"] = "1";
  }
  await sleep(100);
  var diff2 = Math.abs(Math.round(s / 0.1) - Math.round(colorgoalsatur / 0.1));
  if (diff2 == 0) {
    guessc_satur.dataset["state"] = "3";
  } else if (diff2 == 1) {
    guessc_satur.dataset["state"] = "2";
  } else {
    guessc_satur.dataset["state"] = "1";
  }
  await sleep(100);
  var diff3 = Math.abs(Math.round(v / 0.1) - Math.round(colorgoalbright / 0.1));
  if (diff3 == 0) {
    guessc_bright.dataset["state"] = "3";
  } else if (diff3 == 1) {
    guessc_bright.dataset["state"] = "2";
  } else {
    guessc_bright.dataset["state"] = "1";
  }
  
}

function copycolor(i) {
  colorhue = guesses[i].h;
  colorsatur = guesses[i].s;
  colorbright = guesses[i].v;
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
    console.log(i * 0.1, colorsatur, i);
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

function share() {

  var now = new Date();
  var days = Math.floor((now - (now.getTimezoneOffset() * 60000))/8.64e7)- 100;
  console.log(days);

  var sharetext = "Daily Color Picker #" + (days - 18990) + " " + guesses.length + "/4\n";
  if (!won) sharetext = "Daily Color Picker #" + (days - 18990) + " " + "X/4\n";
  for (let i = 0; i < guesses.length; i++) {
    var guess = guesses[i];
    var charhue = "⬛";
    var charsatur = "⬛";
    var charbright = "⬛";
    var diff = Math.abs(Math.round(guess.h / 36) - Math.round(colorgoalhue /36));
    if (diff == 0) {
      charhue = "🟩";
    } else if (diff == 1 || diff == 9) {charhue = "🟨"}
    var diff = Math.abs(Math.round(guess.s / 0.1) - Math.round(colorgoalsatur /0.1));
    if (diff == 0) {
      charsatur = "🟩";
    } else if (diff == 1) {charsatur = "🟨"}
    var diff = Math.abs(Math.round(guess.v / 0.1) - Math.round(colorgoalbright /0.1));
    if (diff == 0) {
      charbright = "🟩";
    } else if (diff == 1) {charbright = "🟨"}
    sharetext = sharetext + "\n" + charhue + charsatur + charbright;
  }
  sharetext = sharetext + "\nhttps://looserrip.github.io/color";
  
  console.log(sharetext);

  navigator.clipboard.writeText(sharetext);
}
