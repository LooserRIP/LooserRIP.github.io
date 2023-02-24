var imagecache = {};
async function getImage(name) {
    if (imagecache[name] != undefined) return imagecache[name];
    var link = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=1&pid=0&tags=" + encodeURIComponent(name) + "%20score:%3E=20%20-animated%20-comic";
    if (Math.random() > 0.9) link = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=1&pid=0&tags=" + encodeURIComponent(name) + "%20sort:score%20-animated%20-comic";
    var matches = ["", ""];
    await fetch(link).then(async function (response) {
        // The API call was successful!
        return response.text();
    }).then(async function (html) {
        console.log(html);
        var regExp = /sample_url=\"(.*?)\"/;
        matches = regExp.exec(html);
        console.log(matches[1]); 
    }).catch(async function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
    imagecache[name] = matches[1];
    return matches[1];
}
var current;
var current2;
var previous;
function clamp(num, min, max) {
    return num <= min 
      ? min 
      : num >= max 
        ? max 
        : num
  }
function start() {
    current = Math.round((Math.random() * 1500)) + 250;
    current2 = current;
    previous = [];
    select();
    refresh();  
    document.body.onkeydown = function(e){
        if(e.keyCode == 72){
            document.getElementById("tagbg1").dataset.filter = "1";
            document.getElementById("tagbg2").dataset.filter = "1";
        }
      }
      document.body.onkeyup = function(e){
          if(e.keyCode == 72){
              document.getElementById("tagbg1").dataset.filter = "0";
              document.getElementById("tagbg2").dataset.filter = "0";
          }
        }
}
function select() {
    var add;
    previous.push(current);
    for (let ldp = 0; ldp < 20; ldp++) {
        add = Math.round(Math.random() * 1000) - 500;
        if (!previous.includes(clamp(current + add, 0, 1999))) {
            break;
        }
    }
    previous.push(clamp(current + add, 0, 1999));
    current2 = clamp(current + add, 0, 1999);
}
async function refresh() {
    var sj1 = scoreJson[current];
    var sj2 = scoreJson[current2];
    var imagelink1 = await getImage(sj1.name);
    var imagelink2 = await getImage(sj2.name);
    document.getElementById("tagname1").innerText = sj1.name;
    document.getElementById("tagname2").innerText = sj2.name;
    document.getElementById("tagtype1").innerText = sj1.type;
    document.getElementById("tagtype2").innerText = sj2.type;
    document.getElementById("tagscore1").innerText = sj1.score;
    document.getElementById("tagscore2").innerText = sj2.score;
    document.getElementById("tagscore1").dataset.revealed = "0";
    document.getElementById("tagscore2").dataset.revealed = "0";
    document.getElementById("tagbg1").style = "background: url(" + imagelink1 + ");";
    document.getElementById("tagbg2").style = "background: url(" + imagelink2 + ");";
}
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

var inAnimation = false;
async function mclick(intd) {
    if (inAnimation) return;
    inAnimation = true;
    var sj1 = scoreJson[current];
    var sj2 = scoreJson[current2];
    var wc = winCondition(parseInt(sj1.score), parseInt(sj2.score), intd);
    document.getElementById("tagscore1").dataset.revealed = "1";
    document.getElementById("tagscore2").dataset.revealed = "1";
    await sleep(2000);
    if (wc) {
        if (intd == 2) current = current2;
        select();
        refresh();
    } else {
        location.reload();
    }
    inAnimation = false;
}
function winCondition(i1, i2, ii) {
    if (i1 > i2) {
        if (ii == 1) return true;
        if (ii == 2) return false;
    }
    if (i2 > i1) {
        if (ii == 2) return true;
        if (ii == 1) return false;
    }
    return true;
}