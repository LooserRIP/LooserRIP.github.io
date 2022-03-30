


/* globals appearances*/
/* globals bgthemes */


let timer = false;
let timerc = 0;
let holdtime = 0;
let timerobj;
let timerdivobj;
let ismobile = false;
var selectedProfile = 0;
let editing = false;
let warmup = false;
let draggingelement = false;
let draggingoffset = {x: 0, y: 0};
let mousedown = false;
var cmp = {x:0, y:0};
let exactpositioning = false;
var layoutsave = {};
let solvestab;
let selectedsolve;
let pastselectedsolve;
var hoveredelement = false;
let edittab;
let editlayoutbutton;
let currentui = false;
let uiclickverify = true;
let settings;




var defaultlayout = {editlayout: {x: 1, y: 1, s: 1}, settings: {x: 99, y: 1, s: 1}, timer: {x: 50, y: 25, s: 1}, solves: {x: 0, y: 50, s: 1}};




async function init() {
  currentui = false;
  solvestab = document.getElementById("solvestab");
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    ismobile = true;
  }
  timerobj = document.getElementById("timer");
  timerdivobj = document.getElementById("timerdiv");
    timerdone();
    loadLayout();
    document.body.onkeydown = function(e){
      if (!e.repeat) {
        if(e.keyCode == 32) {
          clickstart();
        }
      }
      if (e.keyCode == 38) wheel(1);
      if (e.keyCode == 40) wheel(-1);
      if (e.keyCode == 16) exactpositioning = true;
      if (e.keyCode == 13 && document.activeElement == document.getElementById("addsolveinput")) submitsolve();
      if (e.keyCode == 87 && document.activeElement == document.body) setwarmup(!warmup);
      if (e.keyCode == 46 && document.activeElement == document.body && selectedsolve != undefined && selectedsolve != false) deletesolvetool();
  }
    
    document.body.onkeyup = function(e){
    if(e.keyCode == 32) {
      clickend();
    }
      if (e.keyCode == 16) exactpositioning = false;
  }
    document.body.onwheel = function(e) {
      var state = clamp(e.deltaY, -1, 1) * -1;
      wheel(state);
    }
  //Mobile friendly stuff because reason's a bitch
  if (ismobile) {
    document.body.ontouchstart = function(e) {
      clickstart();
      touchdown();
    }
    document.body.ontouchend = function(e) {
      touchup();
      clickend();
    }
    document.body.ontouchmove = function(e) {
      var touchLocation = event.targetTouches[0];
      var mousePos = {x: touchLocation.pageX, y:touchLocation.pageY};
      movecursor(mousePos);
      cmp = mousePos;
    }
  } else {
    document.body.onmousedown = function(e) {
      touchdown();
    }
    document.body.onmouseup = function(e) {
      touchup();
    }
    document.body.onmousemove = function(e) {
      var mousePos = {x: event.clientX, y: event.clientY};
      movecursor(mousePos);
      cmp = mousePos;
    }
  }
  initsettings();
  initProfiles();
  refreshElementPositions();
  initElementClicks();
  updateAverages();
  switchTab("general");
  scramble();
  setAppearance();
  initcustomtheme();
  var customthemeparse = JSON.parse(localStorage.customthemes);
  for(var it = 0; it < customthemeparse.length; it++) {
    addSavedCT(customthemeparse[it].name, customthemeparse[it].data, it);
  }
  
  await sleep(0);
  refreshElementPositions();
  
setInputFilter(document.getElementById("addsolveinput"), function(value) {
  return /^\d*[.,]?\d{0,3}$/.test(value); });
  
}

function wheel(state) {
  if (hoveredelement != false && hoveredelement != 0 && editing) {
        
        var sc = parseFloat(hoveredelement.dataset.scale);
        var add = state / 10;
        if (exactpositioning) add /= 10;
        sc += add;
        sc = clamp(sc,0.3, 3)
        hoveredelement.dataset.scale = sc;
        
        refreshElementPositions();
       
      }
}

function savect() {
  var parse = JSON.parse(localStorage["customthemes"]);
  parse.push({data: localStorage.appearance, name: "Untitled"});
  localStorage["customthemes"] = JSON.stringify(parse);
  addSavedCT("Untitled", localStorage["appearance"], parse.length - 1);
}

async function addSavedCT(name, theme, index) {
  var outerblock = document.createElement("DIV");
  outerblock.className = "savedct";
  outerblock.dataset.ind = index;
  var nameinput = document.createElement("INPUT");
  nameinput.value = name;
  nameinput.className = "savedctname";
  nameinput.dataset.ind = index;
  nameinput.dataset.form = "field";
  nameinput.addEventListener("change", async function (event) {
    var parse = JSON.parse(localStorage["customthemes"]);
    parse[parseInt(this.parentNode.dataset.ind)].name = this.value;
  localStorage["customthemes"] = JSON.stringify(parse);
  }, false);
  var inputblock = document.createElement("DIV");
  inputblock.className = "savedctinputdiv";
  var datainput = document.createElement("INPUT");
  datainput.value = theme;
  datainput.className = "savedctdata";
  datainput.dataset.ind = index;
  datainput.dataset.form = "field";
  datainput.dataset.withicon = "1";
  var shareicon = document.createElement("SPAN");
  shareicon.className = "savedcticon";
  shareicon.dataset.mi = "1";
  shareicon.dataset.mis = "1";
  shareicon.innerText = "content_copy";
  shareicon.addEventListener("mousedown", async function (event) {
    this.parentNode.childNodes[1].select();
    this.parentNode.childNodes[1].setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(this.parentNode.childNodes[1].value);
  }, false);
  shareicon.addEventListener("touchstart", async function (event) {
    this.parentNode.childNodes[1].select();
    this.parentNode.childNodes[1].setSelectionRange(0, 99999);
    navigator.clipboard.writeText(this.parentNode.childNodes[1].value);
  }, false);
  var deleteicon = document.createElement("SPAN");
  deleteicon.className = "savedctdeleteicon";
  deleteicon.dataset.mi = "1";
  deleteicon.dataset.mis = "1";
  deleteicon.dataset.ind = index;
  deleteicon.innerText = "delete";
  deleteicon.addEventListener("mousedown", async function (event) {
    this.parentNode.remove();
    var customthemesrem = JSON.parse(localStorage.customthemes);
    customthemesrem.splice(parseInt(this.parentNode.dataset.ind), 1);
    localStorage.customthemes = JSON.stringify(customthemesrem);
    refreshcustomthemeinds();
  }, false);
  deleteicon.addEventListener("touchstart", async function (event) {
    this.parentNode.remove();
    var customthemesrem = JSON.parse(localStorage.customthemes);
    customthemesrem.splice(parseInt(this.parentNode.dataset.ind), 1);
    localStorage.customthemes = JSON.stringify(customthemesrem);
    refreshcustomthemeinds();
    
  }, false);
  inputblock.appendChild(shareicon);
  inputblock.appendChild(datainput);
  var selectblock = document.createElement("DIV");
  selectblock.className = "savedctselect";
  selectblock.dataset.ind = index;
  selectblock.addEventListener("mousedown", async function (event) {
    localStorage["appearance"] = JSON.parse(localStorage["customthemes"])[parseInt(this.parentNode.dataset.ind)].data;
    initcustomtheme();
    setAppearance();
  }, false);
  selectblock.addEventListener("touchstart", async function (event) {
    localStorage["appearance"] = JSON.parse(localStorage["customthemes"])[parseInt(this.parentNode.dataset.ind)].data;
    initcustomtheme();
    setAppearance();
  }, false);
  var selectblockcaption = document.createElement("P");
  selectblockcaption.className = "savedctselectcaption";
  selectblockcaption.innerText = "Select";
  selectblock.appendChild(selectblockcaption);
  datainput.addEventListener("change", async function (event) {
    var parse = JSON.parse(localStorage["customthemes"]);
    parse[parseInt(this.parentNode.parentNode.dataset.ind)].data = this.value;
    localStorage["customthemes"] = JSON.stringify(parse);
    var pd = JSON.parse(this.value);
    if (pd.bg_primary != undefined) {
      this.parentNode.parentNode.style.backgroundColor = pd.bg_primary;
      this.parentNode.parentNode.style.color = pd.text;
      this.style.borderBottom = "2px solid " + pd.basic_bg;
      this.style.color = pd.text;
      this.parentNode.parentNode.childNodes[0].style.borderBottom = "2px solid " + pd.basic_bg;
      this.parentNode.parentNode.childNodes[0].style.color = pd.text;
      this.parentNode.parentNode.childNodes[2].style.backgroundColor = pd.uib_ns;
      this.parentNode.parentNode.childNodes[2].childNodes[0].style.color = pd.text;
      this.parentNode.parentNode.childNodes[3].style.color = pd.text;
      this.parentNode.parentNode.childNodes[1].childNodes[0].style.color = pd.text;
    } else {
      this.parentNode.parentNode.style.backgroundColor = "var(--bg_primary)";
      this.parentNode.parentNode.style.color = "var(--text)";
      this.style.borderBottom = "2px solid var(--basic-bg)";
      this.style.color = "var(--text)";
      this.parentNode.parentNode.childNodes[0].style.borderBottom = "2px solid var(--basic-bg)";
      this.parentNode.parentNode.childNodes[0].style.color = "var(--text)";
      this.parentNode.parentNode.childNodes[2].style.backgroundColor = "var(--uib-ns)";
      this.parentNode.parentNode.childNodes[2].childNodes[0].style.color = "var(--text)";
      this.parentNode.parentNode.childNodes[3].style.color = "var(--text)";
      this.parentNode.parentNode.childNodes[1].childNodes[0].style.color = "var(--text)";
    }
    
    
  }, false);
  
    var pd = JSON.parse(theme);
    if (pd.bg_primary != undefined) {
      outerblock.style.backgroundColor = pd.bg_primary;
      outerblock.style.color = pd.text;
      datainput.style.borderBottom = "2px solid " + pd.basic_bg;
      datainput.style.color = pd.text;
      nameinput.style.borderBottom = "2px solid " + pd.basic_bg;
      nameinput.style.color = pd.text;
      selectblock.style.backgroundColor = pd.uib_ns;
      selectblockcaption.style.color = pd.text;
      deleteicon.style.color = pd.text;
      shareicon.style.color = pd.text;
    } else {
      outerblock.style.backgroundColor = "var(--bg_primary)";
      outerblock.style.color = "var(--text)";
      datainput.style.borderBottom = "2px solid var(--basic-bg)";
      datainput.style.color = "var(--text)";
      nameinput.style.borderBottom = "2px solid var(--basic-bg)";
      nameinput.style.color = "var(--text)";
      selectblock.style.backgroundColor = "var(--uib-ns)";
      selectblockcaption.style.color = "var(--text)";
      deleteicon.style.color = "var(--text)";
      shareicon.style.color = "var(--text)";
    }
  
  outerblock.appendChild(nameinput);
  outerblock.appendChild(inputblock);
  outerblock.appendChild(selectblock);
  outerblock.appendChild(deleteicon);
  document.getElementById("savedcts").insertBefore(outerblock, document.getElementById("newsavedct"));
  

}

function refreshcustomthemeinds() {
  var children = document.getElementById("savedcts").childNodes;
  var icount = 0;
  for (var ir = 0; ir < children.length; ir++) {
    if (children[ir].dataset != undefined) {
      children[ir].dataset.ind = icount;
      icount++;
    }
  }
}

var root = document.querySelector(':root');
function setAppearance() {
  if (document.getElementById("particles-js") != undefined) document.getElementById("particles-js").remove();
  if (localStorage["appearance"] == undefined) localStorage["appearance"] = JSON.stringify(appearances.default);
  if (localStorage["customthemes"] == undefined) localStorage["customthemes"] = JSON.stringify([]);
  var appearance = JSON.parse(localStorage.appearance);
  var keys = Object.keys(appearance);
  var bgprimary = "#000000";
  var bgsecondary = "#000000";
  var bgtheme = bgthemes["squares"];
  for (var i = 0; i < keys.length; i++) {
    var key = '--' + keys[i];
    var value = appearance[keys[i]];
    if (key == "--bg_primary") bgprimary = value;
    if (key == "--bg_secondary") bgsecondary = value;
    if (key == "--bg_theme") {
      if (bgthemes[value] == undefined) {
        bgtheme = JSON.parse(value.replaceAll("$PRIMARYCOLOR$", bgprimary.slice(0,7)).replaceAll("$SECONDARYCOLOR$", bgsecondary.slice(0,7)));
      } else {
        bgtheme = JSON.parse(JSON.stringify(bgthemes[value]).replaceAll("$PRIMARYCOLOR$", bgprimary.slice(0,7)).replaceAll("$SECONDARYCOLOR$", bgsecondary.slice(0,7)));
      }
    }
    if (key != "--bg_theme" && key != "bg_primary" && key != "bg_secondary") {
      key = key.replaceAll("_", "-");
      root.style.setProperty(key, value);
    }
  
  }
  var particlesJSdiv = document.createElement("DIV");
  particlesJSdiv.setAttribute("id", "particles-js");
  document.getElementById("background").appendChild(particlesJSdiv);
  tsParticles.load("particles-js", bgtheme
  );
}


var tabs = ["general", "statistics", "appearance"];
function switchTab(tabPick) {
  for(var i = 0; i < tabs.length; i++) {
    var tab = tabs[i];
    var stabObj = document.getElementById("settingtab_" + tab);
    var stabbObj = document.getElementById("stabb_" + tab);
    if (tab == tabPick) {
      stabbObj.dataset.selected = "1";
      stabObj.dataset.on = "1";
    } else {
      stabbObj.dataset.selected = "0";
      stabObj.dataset.on = "0";
    }
  }
}

var defaultProfiles = {selected: 0, profiles: [{name: "Default", type: "3x3"}]}
function initProfiles() {
  if (localStorage["profiles"] == undefined) {
    localStorage["profiles"] = JSON.stringify(defaultProfiles);
  }
  var profiles = JSON.parse(localStorage["profiles"]);
  switchProfile(profiles.selected);
  for(var i = 0; i < profiles.profiles.length; i++) {
    if (selectedProfile == i) {
      createProfileBlock(i, profiles.profiles[i].name, "1", false);
    } else {
      createProfileBlock(i, profiles.profiles[i].name, "0", false);
    }
  }
}

async function createProfileBlock(ind, name, selected, animation) {
  var profpick = document.createElement("DIV");
  profpick.className = "profilepick";
  profpick.dataset.indp = ind;
  profpick.dataset.selected = selected;
  profpick.dataset.profile = "1";
  var profpickcaption = document.createElement("P");
  profpickcaption.className = "profilecaption";
  profpickcaption.innerText = name;
  var profpickicon = document.createElement("SPAN");
  profpickicon.className = "profileicon";
  profpickicon.dataset.mi = "1";
  profpickicon.dataset.mis = "1";
  profpickicon.innerText = "more_vert";
  profpick.appendChild(profpickcaption);
  profpick.appendChild(profpickicon);
  if (animation) profpick.dataset.anim = "1";
  document.getElementById("profilelist").appendChild(profpick);
  
  if (animation) {
    await sleep(0);
    profpick.dataset.anim = "0";
  }
  profpick.addEventListener("mousedown", async function (event) {
    switchProfile(parseInt(this.dataset.indp));
  }, false);
  profpickicon.addEventListener("mousedown", async function (event) {
    await sleep(20);
    var pem = document.getElementById("profileeditmenu");
    selectedDD = parseInt(this.parentNode.dataset.indp);
    pem.dataset.active = "1";
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    pem.style.left = calculateperc((((this.getBoundingClientRect().right + this.getBoundingClientRect().left)/2) - (pem.offsetWidth / 1.75))/ width * 100, pem.offsetWidth, 1, "x") + "%";
    pem.style.top = calculateperc((((this.getBoundingClientRect().bottom + this.getBoundingClientRect().top)/2) - (pem.offsetHeight / 1.75))/ height * 100, pem.offsetHeight, 1, "y") + "%";
    
  }, false);
  
}
let selectedDD = 0;
function profilemenu(state) {
  if (state == "delete") {
    var profilesJ = JSON.parse(localStorage["profiles"]);
    if (profilesJ.profiles.length == 1) {
    localStorage["0" + "_solves"] = JSON.stringify([]);
    refreshSolves();
    updateAverages();
    return;
    }
    document.getElementById("profilelist").childNodes[selectedDD + 1].remove();
    delete localStorage[selectedDD + "_solves"];
    for(var ip = selectedDD + 1; ip < 999; ip++) {
      if (localStorage[ip + "_solves"] == undefined) {
        delete localStorage[(ip - 1)+ "_solves"];
        break;
      } else {
        localStorage[(ip - 1) + "_solves"] = localStorage[ip + "_solves"];
      }
    }
    profilesJ.profiles.splice(selectedDD, 1);
    localStorage.profiles = JSON.stringify(profilesJ);
    if (selectedProfile >= selectedDD) switchProfile(0);
    refreshSolves();
    updateAverages();
    
    
    var children = document.getElementById("profilelist").childNodes;
    var icount = 0;
    for (var ir = 0; ir < children.length; ir++) {
      if (children[ir].dataset != undefined) {
        children[ir].dataset.indp = icount;
        icount++;
      }
    }
  }
  if (state == "duplicate") {
    var name = document.getElementById("addprofileinput").value;
    var profiles = JSON.parse(localStorage["profiles"]);
    profiles.profiles.push({name: profiles.profiles[selectedDD].name + " - Copy", type: profiles.profiles[selectedDD].type});
    localStorage[profiles.profiles.length - 1 + "_solves"] = localStorage[selectedDD + "_solves"];
    localStorage["profiles"] = JSON.stringify(profiles);
    createProfileBlock(profiles.profiles.length - 1, profiles.profiles[selectedDD].name + " - Copy", "0", true);
  }
  if (state == "rename") {
    switchui("renameprofile");
  }
}


var defaultsettings = {};

function initsettings() {
  if (localStorage["settings"] == undefined) {
    localStorage["settings"] = JSON.stringify(defaultsettings);
  }
  settings = JSON.parse(localStorage["settings"]);
  var keys = Object.keys(settings);
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var dockey = document.getElementById("setting_" + key);
    if (dockey == undefined) continue;
    if (settings[key] == false || settings[key] == true) {
      dockey.checked = settings[key];
    } else {
      dockey.value = settings[key];
      if (key == "theme" && settings[key] == "custom") document.getElementById("customthemedd").dataset.active = "1";
    }
  }
}

function initcustomtheme() {
  var appears = JSON.parse(localStorage["appearance"]);
  var keys = Object.keys(appears);
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var dockey = document.getElementById("customtheme_" + key);
    var rangeelm = document.getElementById("customthemer_" + key);
    if (dockey == undefined) continue;
    if (appears[key] == false || appears[key] == true) {
      dockey.checked = appears[key];
    } else {
      if (appears[key].length == 7) {
        rangeelm.value = 100;  
        rangeelm.style.backgroundSize = "100% 100%";
        dockey.value = appears[key];
        document.getElementById("customthemel_" + key).style.backgroundColor = appears[key];
      } else if (appears[key].length == 9) {
        dockey.value = appears[key].slice(0,7);
        document.getElementById("customthemel_" + key).style.backgroundColor = appears[key];
        rangeelm.value = parseInt(appears[key].slice(7,9),16) / 2.55;
        rangeelm.style.backgroundSize = rangeelm.value +  "% 100%";
      }
    }
  }
}



function setsetting(setting, value) {
  settings[setting] = value;
  localStorage["settings"] = JSON.stringify(settings);
}

function getsetting(setting) {
  if (settings[setting] != undefined) return settings[setting];
  return false;
}
var prevCustomThemeVal;
function changesetting(elm, type) {
  prevCustomThemeVal = getsetting("theme");
    if (type == "s") {
      setsetting(elm.dataset.key, elm.checked);
    }
    if (type == "dd") {
      setsetting(elm.dataset.key, elm.value);
    }
  if (elm.dataset.key == "scramblecolors") scramble(true);
  if (elm.dataset.key == "theme") {
    if (elm.value == "custom") {
      if (getsetting("savecustomtheme")) {
        localStorage["appearance"] = localStorage["customappearance"];
      }
      initcustomtheme();
      document.getElementById("customthemedd").dataset.active = "1";
      setAppearance();
    } else {
      if (prevCustomThemeVal == "custom" && getsetting("savecustomtheme")) {
        localStorage["customappearance"] = localStorage["appearance"];
      }
      document.getElementById("customthemedd").dataset.active = "0";
      localStorage["appearance"] = JSON.stringify(appearances[elm.value]);
      initcustomtheme();
      setAppearance();
    }
  }
}
function customthemechange(elm,type) {
  var appearChange = JSON.parse(localStorage.appearance);
  if (type == 'c') {
    var opac = document.getElementById("customthemer_" + elm.dataset.key).value;
    var hexopac = Math.round((opac * 2.55)).toString(16); if(hexopac.length == 1) hexopac = "0" + hexopac;
    appearChange[elm.dataset.key] = (elm.value.slice(0,7) + hexopac);
    document.getElementById("customthemel_" + elm.dataset.key).style.backgroundColor = appearChange[elm.dataset.key];
  }
  localStorage.appearance = JSON.stringify(appearChange);
  setAppearance();
}
function customthemeinput(elm,type) {
  if (type == 'c') {
    var opac = document.getElementById("customthemer_" + elm.dataset.key).value;
    var hexopac = Math.round((opac * 2.55)).toString(16); if(hexopac.length == 1) hexopac = "0" + hexopac;
    root.style.setProperty("--" + elm.dataset.key.replace("_","-"), (elm.value.slice(0,7) + hexopac));
    document.getElementById("customthemel_" + elm.dataset.key).style.backgroundColor = (elm.value.slice(0,7) + hexopac);
  }
}
function customthemerchange(elm) {
  elm.style.backgroundSize = elm.value + "% 100%";
  var appearChange = JSON.parse(localStorage.appearance);
  var hex = document.getElementById("customtheme_" + elm.dataset.key).value;
  var hexopac = Math.round((elm.value * 2.55)).toString(16); if(hexopac.length == 1) hexopac = "0" + hexopac;
  appearChange[elm.dataset.key] = (hex.slice(0,7) + hexopac);
  document.getElementById("customthemel_" + elm.dataset.key).style.backgroundColor = appearChange[elm.dataset.key];
  localStorage.appearance = JSON.stringify(appearChange);
  setAppearance();
}
function customthemerinput(elm) {
  elm.style.backgroundSize = elm.value + "% 100%";
    var hex = document.getElementById("customtheme_" + elm.dataset.key).value;
    var hexopac = Math.round((elm.value * 2.55)).toString(16); if(hexopac.length == 1) hexopac = "0" + hexopac;
    root.style.setProperty("--" + elm.dataset.key.replaceAll("_","-"),(hex.slice(0,7) + hexopac));
    document.getElementById("customthemel_" + elm.dataset.key).style.backgroundColor = (hex.slice(0,7) + hexopac);
}

function newprofile() {
  switchui("addprofile");
}

function submitprofile() {
  var name = document.getElementById("addprofileinput").value;
  var profiles = JSON.parse(localStorage["profiles"]);
  profiles.profiles.push({name: name, type: "3x3"});
  localStorage["profiles"] = JSON.stringify(profiles);
  switchui(false);
  createProfileBlock(profiles.profiles.length - 1, name, "0", true)
}
function renameprofile() {
  var name = document.getElementById("renameprofileinput").value;
  var profiles = JSON.parse(localStorage["profiles"]);
  profiles.profiles[selectedDD].name = name;
  localStorage["profiles"] = JSON.stringify(profiles);
  document.getElementById("profilelist").childNodes[selectedDD + 1].childNodes[0].innerText = name;
  switchui(false);
}

function addsolvetool() {
  switchui("addsolve");
}

function submitsolve() {
  var val = clamp(parseFloat(document.getElementById("addsolveinput").value),0, 100000) * 1000;
  if (isNaN(val)) val = 0;
  addSolve(val, 0, 0, undefined);
  document.getElementById("addsolveinput").value = "";
  switchui(false);
}
function switchui(ids) {
  if (editing) return;
  currentui = ids;
  var uies = document.getElementsByClassName("uielm");
  for (let i = 0; i < uies.length; i++) {
    uies[i].dataset.active = "0";
  }
  if (ids == false) {
    document.getElementById("background").dataset.filter = "0";
    document.getElementById("main").dataset.filter = "0";
    var elms = document.getElementsByClassName("element");
    for (var i = 0; i < elms.length; i++) {
      elms[i].dataset.uipointer = "0";
    }
    return;
  }
  var elms = document.getElementsByClassName("element");
  for (var i = 0; i < elms.length; i++) {
    elms[i].dataset.uipointer = "1";
  }
  document.getElementById("background").dataset.filter = "ui";
  document.getElementById("main").dataset.filter = "ui";
  var uie = document.getElementById("ui_" + ids);
  uie.dataset.active = "1";
  verifyuiclick();
}

function opensettings() {
  switchTab("general");
  switchui("settings");
}

function deletesolvetool() {
  if (pastselectedsolve != 0 && pastselectedsolve != undefined) {
    var solves = JSON.parse(localStorage[selectedProfile + "_solves"]);
    var indDelete = parseInt(pastselectedsolve.dataset.ind);
    solves.splice(indDelete, 1);
    localStorage[selectedProfile+"_solves"] = JSON.stringify(solves);
    pastselectedsolve.remove();
    updateAverages();
  }
}

async function verifyuiclick() {
  await sleep(1);
  uiclickverify = true;
}

var scrambleNow = "";
async function scramble(dontscramble) {
  var scramble = generateScramble();
  if (dontscramble == true) {
   scramble = scrambleNow;
  }
  var sctp = document.getElementById("scrambletext");
  while (sctp.lastElementChild) {
    if (sctp.lastElementChild.dataset.color == "white") break;
    sctp.removeChild(sctp.lastElementChild);
  }
  var splitscramble = scramble.split(" ");
  splitscramble.splice(0, 1);
  var dict = {f: "#5cf545", r: "#eb3734", u: "#fffafa", b: "#4570ff", l: "#ffa33b", d: "#fcff3b"};
  for (var i = 0; i < splitscramble.length; i++) {
    var div = document.createElement("P");
    div.className = "scrambletextpiece";
    if (getsetting("scramblecolors")) {
      div.style.color = dict[splitscramble[i][0].toLowerCase()];
    }
    div.innerText = splitscramble[i];
    sctp.appendChild(div);
  }
  document.getElementById("scramblevis2d").setAttribute("scramble", scramble);
  document.getElementById("scramblevis2dbg").setAttribute("scramble", scramble);
  scrambleNow = scramble;
}

function touchup() {
  mousedown = false;
  if (draggingelement != false) {
    draggingelement.dataset.borderdone = "0";
  }
  draggingelement = false;
}
async function touchdown()  {
  
  document.getElementById("profileeditmenu").dataset.active = "0";
  
  if (selectedsolve != false) {
    pastselectedsolve = selectedsolve;
    if (selectedsolve != undefined) {
      selectedsolve.dataset.selected = "0";
    }
    
    document.getElementById("")
    
  } else {
    pastselectedsolve = 0;
  }
  document.getElementById("selectedsolvetools").dataset.active = "0";
  selectedsolve = false;
  mousedown = true;
  uiclickverify = false;
  
  await sleep(20);
  if (!uiclickverify && currentui != false) {
    switchui(false);
  }
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function refreshSolves() {
  while (solvestab.lastElementChild) {
    solvestab.removeChild(solvestab.lastElementChild);
  }
  var svs = JSON.parse(localStorage[selectedProfile + "_solves"]);
  for (let is = 0; is < svs.length; is++) {
    addSolveBlock(prettyformat2chars(svs[is].time), is, true);
  }
}
var viewingsolve;
function solveview(elm) {
  var ind = elm.dataset.ind;
  var svs = JSON.parse(localStorage[selectedProfile + "_solves"]);
  var solve = svs[ind];
  viewingsolve = ind;
  document.getElementById("solveviewtitle").innerText = (solve.time / 1000) + "s";
  if (solve.comment == undefined) {
    document.getElementById("solveviewcomment").value = "";
  } else {
    document.getElementById("solveviewcomment").value = solve.comment;
  }
  switchui("solveview");
}
function changecomment(elm) {
  var svs = JSON.parse(localStorage[selectedProfile + "_solves"]);
  var solve = svs[viewingsolve];
  solve["comment"] = elm.value;
  localStorage[selectedProfile + "_solves"] = JSON.stringify(svs);
}

async function addSolveBlock(solve, index, optimize) {
  var outerblock = document.createElement("DIV");
  outerblock.className = "solveblock";
  outerblock.dataset.ind = index;
  var caption = document.createElement("P");
  caption.innerText = solve;
  caption.className = "solvecaption";
  outerblock.appendChild(caption);
  solvestab.insertBefore(outerblock, solvestab.firstChild);
  
  outerblock.addEventListener("mousedown", async function (event) {
    await sleep(0);
    if (!editing && pastselectedsolve != this) {
      outerblock.dataset.selected = "1";
      document.getElementById("selectedsolvetools").dataset.active = "1";
      selectedsolve = this;
      pastselectedsolve = selectedsolve;
    } else if (!editing && pastselectedsolve == this) {
      outerblock.dataset.selected = "1";
      document.getElementById("selectedsolvetools").dataset.active = "1";
      selectedsolve = this;
      pastselectedsolve = selectedsolve;
      solveview(this);
    }
  }, false);

  outerblock.addEventListener("touchstart", async function (event) {
    await sleep(0);
    if (!editing && pastselectedsolve != this) {
      outerblock.dataset.selected = "1";
  document.getElementById("selectedsolvetools").dataset.active = "1";
      selectedsolve = this;
    pastselectedsolve = selectedsolve;
    }
  }, false);
}

function movecursor(mp) {
  if (draggingelement != false && editing) {
        draggingelement.dataset.borderdone = "0";
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var sc = parseFloat(draggingelement.dataset.scale);
    var ew = draggingelement.offsetWidth;
    var eh = draggingelement.offsetHeight;
    var intendedHeight = height - (eh * sc * 1);
    var intendedWidth = width - (ew * sc * 1);
    var relativeX = ((mp.x + draggingoffset.x - (ew * sc * 0.5) + 8) / intendedWidth);
    var relativeY = ((mp.y + draggingoffset.y - (eh * sc * 0.5) + 8) / intendedHeight);
    
      if (relativeX > 0.475 && relativeX < 0.525 && !exactpositioning) {
      relativeX = clamp(relativeX, 0, 1);
      relativeY = clamp(relativeY, 0, 1);
        draggingelement.dataset.borderdone = "2";
        relativeX = 0.5;
      }
      if (relativeY > 0.475 && relativeY < 0.525 && !exactpositioning) {
      relativeX = clamp(relativeX, 0, 1);
      relativeY = clamp(relativeY, 0, 1);
        draggingelement.dataset.borderdone = "2";
        relativeY = 0.5;
      }
    if (relativeX == 0.5 && relativeY == 0.5) {
        draggingelement.dataset.borderdone = "3";
    }
    
    if (relativeX > 1 || relativeX < 0 || relativeY > 1 || relativeY < 0) {
      draggingelement.dataset.borderdone = "1";
      relativeX = clamp(relativeX, 0, 1);
      relativeY = clamp(relativeY, 0, 1);
    } else {
    }
      draggingelement.style.left = calculateperc(relativeX * 100, ew, sc, "x") + "%";//calculateperc(((mp.x + draggingoffset.x) / width) * 100, ew, sc, "x") + "%";
      draggingelement.style.top = calculateperc(relativeY * 100, eh, sc, "y") + "%"; //calculateperc(((mp.y + draggingoffset.y) / height) * 100, eh, sc, "y") + "%";
      draggingelement.dataset.percx = relativeX * 100;
      draggingelement.dataset.percy = relativeY * 100;
    
    //draggingelement.dataset.percx = (((mp.x + draggingoffset.x)) / (intendedHeight +(ew * sc / 2) - 8));
  }
}
function editwindowclick(elm) {
  var layout = JSON.parse(localStorage["layout"]);
  var key = elm.dataset.key;
  var elme = document.getElementById("e_" + key);
  if (layout[key] == undefined || (layout[key].h == 1)) {
    elm.dataset.state = 1;
    
    if (layout[key] == undefined) {
      layout[key] = {x:0.5, y:0.5, s:1}; 
      if (ismobile) layout[key] = {x:0.5,y:0.5,s:0.5};
    elme.style.display = "block";
      var s = layout[key].s;
      elme.style.transform = "scale(" + s + ") translate(" + (50*-1/s) + "%, " + (50*-1/s) + "%)";
    elme.style.display = "block";
      elme.dataset.percx = layout[key].x;
      elme.dataset.percy = layout[key].y;
      elme.dataset.scale = layout[key].s;
      elme.style.left = calculateperc(layout[key].x, elme.offsetWidth, layout[key].s, "x") + "%";
      elme.style.top = calculateperc(layout[key].y, elme.offsetHeight, layout[key].s, "y") + "%";
      elme.dataset.key = key;
      
    }
    elme.style.display = "block";
      elme.style.left = calculateperc(elme.dataset.percx, elme.offsetWidth, layout[key].s, "x") + "%";
      elme.style.top = calculateperc(elme.dataset.percy, elme.offsetHeight, layout[key].s, "y") + "%";
    layout[key].h = 0;
  } else {
    elm.dataset.state = 0;
    layout[key].h = 1;
    elme.style.display = "none";
    
  }
  localStorage["layout"] = JSON.stringify(layout);
}
function exitedit() {
  document.getElementById("exiteditbutton").dataset.active = "0";
  document.getElementById("saveeditbutton").dataset.active = "0";
  document.getElementById("background").dataset.filter = "0";
  document.getElementById("warmupswitch").disabled = false;
  document.getElementById("ytplayer").dataset.editing = "0";
  var elms = document.getElementsByClassName("element");
  for (var i = 0; i < elms.length; i++) {
    elms[i].dataset.editing = "0";
  }
  currentui = false;
  editing = false;
  switchui('edit');
}
function exiteditbutton() {
  exitedit();
  localStorage["layout"] = layoutsave;
  loadLayout();
  
}
function saveeditbutton() {
  exitedit();
  var elms = document.getElementsByClassName("element");
  var sobj = JSON.parse(localStorage["layout"]);
  for (var i = 0; i < elms.length; i++) {
    var el = elms[i];
    if (el.dataset.key != undefined) {
      if (el.style.display == "none" || el.style.display == "") {
        sobj[el.dataset.key] = {x:el.dataset.percx, y: el.dataset.percy, s: el.dataset.scale, h: 1};
      } else {
        sobj[el.dataset.key] = {x:el.dataset.percx, y: el.dataset.percy, s: el.dataset.scale, h: 0};
      }
    }
  }
  localStorage["layout"] = JSON.stringify(sobj);
  
}
function getPxFromPerc(p,xy) {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if (xy == 0) {
      return parseInt(p) * width * 0.01;
    } else {
      return parseInt(p) * height * 0.01;
    }
}

function initElementClicks() {
  var elms = document.getElementsByClassName("element");
  for (var i = 0; i < elms.length; i++) {
    var elm = elms[i];
      elm.addEventListener("mousedown", function (event) {
        draggingoffset = {x: getPxFromPerc(this.style.left,0) - event.clientX, y: getPxFromPerc(this.style.top,1) - event.clientY};
        draggingelement = this;
      }, false);
      elm.addEventListener("mouseup", function (event) {
        if (draggingelement != false) {
          draggingelement.dataset.borderdone = "0";
        }
        draggingelement = false;
      }, false);
      elm.addEventListener("touchstart", function (event) {
        var touchLocation = event.targetTouches[0];
        draggingoffset = {x: getPxFromPerc(this.style.left,0)- touchLocation.pageX, y: getPxFromPerc(this.style.top,1) - touchLocation.pageY};
        draggingelement = this;
      }, false);
      elm.addEventListener("touchend", function (event) {
        if (draggingelement != false) {
          draggingelement.dataset.borderdone = "0";
        }
        draggingelement = false;
      }, false);
    

      elm.addEventListener("mouseover", function (event) {
        hoveredelement = this;
      }, false);
      elm.addEventListener("mouseout", function (event) {
        hoveredelement = false;
      }, false);
  }
}

function editlayout() {
        refreshElementPositions();
  if (currentui != false) switchui(false);
  if (editing) {
    const width  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
    if ((parseFloat(editlayoutbutton.style.left) / 100 * width > (175))) {
      saveeditbutton();
    }
    return;
  }
     timerdone();
  layoutsave = localStorage["layout"];
  document.getElementById("exiteditbutton").dataset.active = "1";
  document.getElementById("saveeditbutton").dataset.active = "1";
  document.getElementById("warmupswitch").disabled = true;
  document.getElementById("ytplayer").dataset.editing = "1";
  document.getElementById("background").dataset.filter = "blur";
  var elms = document.getElementsByClassName("element");
  for (var i = 0; i < elms.length; i++) {
    elms[i].dataset.editing = "1";
  }
  currentui = false;
  editing = true;
}


function editreset(resetkey) {
  var eld = document.getElementById("e_" + resetkey);
  if (defaultlayout[resetkey] != undefined) {
    eld.dataset.percx = defaultlayout[resetkey].x;
    eld.dataset.percy = defaultlayout[resetkey].y;
    eld.dataset.scale = defaultlayout[resetkey].s;
  } else {
    eld.dataset.percx = 50;
    eld.dataset.percy = 50;
    eld.dataset.scale = 1;
  }
  refreshElementPositions();
}


function loadLayout() {
  if (localStorage["layout"] == undefined) {
    localStorage["layout"] = JSON.stringify(defaultlayout);
  }
  var ls = JSON.parse(localStorage["layout"]);
  if (ls.settings == undefined) ls.settings = {x: 99, y: 1, s:1};
  localStorage["layout"] = JSON.stringify(ls);
  var layout = JSON.parse(localStorage["layout"]);
  var layoutKeys = Object.keys(layout);
  for (var keyind in layoutKeys) {
    var key = layoutKeys[keyind];
    var obj = document.getElementById("e_" + key);
    if (!(layout[key].h != undefined && layout[key].h == 1)) {
      if (document.getElementById("ew_" + key) != undefined) {
        document.getElementById("ew_" + key).dataset.state = "1";
      }
      obj.style.display = "Block";
    }
    var s = layout[key].s;
    obj.style.left = calculateperc(layout[key].x, obj.offsetWidth, s, "x")+ "%";
    obj.style.top = calculateperc(layout[key].y, obj.offsetHeight, s, "y") + "%";
    if (key != "editlayout") {
      obj.style.transform = "scale(" + s + ") translate(" + (50*-1/s) + "%, " + (50*-1/s) + "%)";
    }
    obj.dataset.percx = layout[key].x;
    obj.dataset.percy = layout[key].y;
    obj.dataset.scale = layout[key].s;
    obj.dataset.key = key;
  }
}

window.addEventListener('resize', function(event) {
  refreshElementPositions();
}, true);

function refreshElementPositions() {
  var elementsL = document.getElementsByClassName("element");
  for (let eind = 0; eind < elementsL.length; eind++) {
    var elem = elementsL[eind];
    if (elem.dataset == undefined) {
      continue;
    }
    elem.style.left = calculateperc(parseInt(elem.dataset.percx), elem.offsetWidth, parseFloat(elem.dataset.scale), "x") + "%";
    elem.style.top = calculateperc(parseInt(elem.dataset.percy), elem.offsetHeight, parseFloat(elem.dataset.scale), "y") + "%";
    var s = parseFloat(elem.dataset.scale);
    if (elem.id != "editlayout") {
      elem.style.transform = "scale(" + s + ") translate(" + (50*-1/s) + "%, " + (50*-1/s) + "%)";
    }
  }
}

function calculateperc(perc, size, scale, s) {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (s == "y") {
    var intendedHeight = height - (size * scale);
    return (((perc / 100 * intendedHeight) + (size * scale / 2) - 8) / height) * 100;
  }
  var intendedWidth = width - (size * scale);
  return (((perc / 100 * intendedWidth) + (size * scale / 2) - 8) / width) * 100;
}

  setInterval(timerbehaviour, 78);
function switchProfile(prof) {
  var profiles = JSON.parse(localStorage["profiles"]);
  profiles.selected = prof;
  localStorage["profiles"] = JSON.stringify(profiles);
  selectedProfile = prof;
  if (localStorage[selectedProfile + "_solves"] == undefined) {
    localStorage[selectedProfile + "_solves"] = '[]';
  }
  
  var elms = document.getElementsByClassName("profilepick");
  for (var ie = 0; ie < elms.length; ie++) {
    var elm = elms[ie];
    if (selectedProfile == elm.dataset.indp) {
      elm.dataset.selected = "1";
    } else {
      elm.dataset.selected = "0";
    }
  }
  refreshSolves();
  updateAverages();
  
}
function addSolve(time, hold, inspection, scramble) {
  if (scramble == undefined) scramble = "";
  document.getElementById("timer").innerText = prettyformat(time);
  var p = JSON.parse(localStorage[selectedProfile + "_solves"]);
  p.push({time: time, hold: hold, inspect: inspection, scramble: scramble, date: Date.now()});
  localStorage[selectedProfile + "_solves"] = JSON.stringify(p);
  updateAverages();
  addSolveBlock(prettyformat2chars(time), p.length - 1);
}

function updateAverages() {
  updateAverage("ao5", 5, 2);
  updateAverage("ao12", 12, 2);
  updateAnalytics();
}
function updateAnalytics() {
  var p = JSON.parse(localStorage[selectedProfile + "_solves"]);
  var pb = 9999999999999;
  var solves = [];
  var data1 = [];
  var data2 = [];
  var data3 = [];
  var data4 = [];
  var labels = [];
  for (var ist = 0; ist < p.length; ist++) {
    solves.push(p[ist].time);
  }
  for (var is = 0; is < solves.length; is++) {
    var solve = solves[is];
    if (solve < pb) pb = solve;
    data1.push(compdec(solve / 1000));
    data4.push(compdec(pb / 1000));
    //labels.push(is + 1);
    labels.push("");
    if (is >= 4) {
      data2.push(compdec(getAverage(solves.slice(is - 4, is + 1)) / 1000));
    } else {data2.push(0);}
    if (is >= 11) {
      data3.push(compdec(getAverage(solves.slice(is - 11, is + 1)) / 1000));
    } else {data3.push(0);}
    
  }
  
  var src = "https://quickchart.io/chart/render/zm-40c7f01f-f1cb-462c-8402-1579e54f9023?labels=" + labels.join(",") + "&data4=" + data4.join(',') + "&data3=" + data1.join(',') + "&data2=" + data2.join(',') + "&data1=" + data3.join(',');
  document.getElementById("analyticimage").setAttribute("src", src);
  
}
function getAverage(pn) {
  var count = pn.length;
  pn.sort(function(a, b){return b-a});
  pn.splice(0, 1);
  pn.splice(pn.length - 1, 1);
  var sum = pn.reduce((partialSum, a) => partialSum + a, 0);
  return(sum / (count - 2));
}
function updateAverage(id, count, remove) {
  var p = JSON.parse(localStorage[selectedProfile + "_solves"]);
  var elm = document.getElementById(id);
  if (p.length >= count) {
    var pnt = p.slice(p.length - count, p.length);
    var pn = [];
    for (let it=0; it<count; it++) {
      pn.push(pnt[it].time);
    }
    pn.sort(function(a, b){return b-a});
    for(let i=0; i<remove/2; i++) {
      pn.splice(0, 1);
      pn.splice(pn.length - 1, 1);
    }
    
    var sum = pn.reduce((partialSum, a) => partialSum + a, 0);
    var avg = sum / (count - remove);
    elm.innerText = "Average of " + count + ": " + prettyformat(Math.round(avg));
  } else {
    elm.innerText = "Average of " + count + ": --";
  }
}
function clickend() {
  if (!timer) {
    if (ct(holdtime) > 300) {
      if (!editing) {
        starttimer();
      } else {
        timerdone();
      }
    } else {
     timerdone();
    }
  }
}
function clickstart() {
  if (!timer) {
    timerobj.dataset.timerstate = "prepare";
    holdtime = Date.now();
  } else {
    solvefinish();
   timerdone();
  }
}
function solvefinish() {
  document.getElementById("timer").innerText = prettyformat(ct(timerc));
  if (!warmup) {
    addSolve(ct(timerc), ct(holdtime), 0, scrambleNow);
  }
  scramble();
}


function timerdone() {
    timer = false;
  timerobj.dataset.timerstate = "done";
  timerdivobj.dataset.timerstate = "done";
  holdtime = 0;  
}

function starttimer() {
  holdtime = 0;
  timerobj.dataset.timerstate = "running";
  timerdivobj.dataset.timerstate = "running";
  timerc = Date.now();
  timer = true;
}
function ct(time) {
  if (time == false || time == 0) return 0;
  return Date.now() - time;
}
function addZeroes(num, splitter) {
  const dec = num.split('.')[1]
  const len = dec && dec.length > splitter ? dec.length : splitter
  return Number(num).toFixed(len)
}
function prettyformat(num) {
  return addZeroes("" + num/1000, 3);
}
function prettyformat2chars(num) {
  return addZeroes("" + (Math.round(num/10) / 100), 2);
}
  
function fixdec(num) {
  return (Math.floor(num*100000))/100000;
}

  
function compdec(num) {
  return (Math.floor(num*10))/10;
}


function timerbehaviour() {
  const width  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (ct(holdtime) > 300) {
    timerobj.dataset.timerstate = "ready";
    timerobj.innerText = "0.000";
  } else if (timer) {
    if (getsetting("hidetimer")) {
      timerobj.innerText = "--";
    } else {
      timerobj.innerText = prettyformat(ct(timerc));
    }
  }
  
}

function setwarmup(state) {
  warmup = state;
  document.getElementById("warmupswitch").checked = state;
  if (state) {
    timerobj.dataset.warmup = "1";
  } else {
    timerobj.dataset.warmup = "0";
  }
}

async function setvideo(input) {
  var parsedlink = parselink(input.value);
  if (parsedlink != false) {
    await sleep(0);
    input.value = parsedlink;
  }
  if (input.value.length == 11) {
    document.getElementById("ytplayer").src = "https://www.youtube.com/embed/" + input.value + "?autoplay=1&fs=0&modestbranding=1&rel=0&origin=https://musicplaylists.glitch.me/";
  }
}

function parselink(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function generateScramble() {
  var array = new Array(" U", " D", " R", " L", " F", " B");
  var switches = ["", "\'", "2"]; 
  var array2 = new Array();
  var last = '';
  var random = 0;
  for (var i = 0; i < 20; i++) {
      do {
         random = Math.floor(Math.random() * array.length);
      } while (last == array[random]) 
  last = array[random];
  var scrambleItem = array[random] + switches[parseInt(Math.random()*switches.length)];
  array2.push(scrambleItem);
  }
  var scramble = "";
  for(i=0; i<20; i++) {
     scramble += array2[i];
  }
  return scramble;
}

function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}


function scrambleProfile(array, num, profile) {
  var profileList = JSON.parse(localStorage[profile + "_solves"]);
    for (let i = 0; i < num; i++) {
        var random = Math.floor(Math.random() * array.length);
        profileList.push(array[random]);
    }
  localStorage[profile + "_solves"] = JSON.stringify(profileList);
}

var particlesJson = {
  "particles":{
    "number":{
      "value":50
    },
    "color":{
      "value":"#110021"
    },
    "shape":{
      "type":"square",
      "stroke":{
        "width":2,
        "color":"#3D00C2"
      },
      "image":{
        "src":"http://www.iconsdb.com/icons/preview/white/contacts-xxl.png"
      }
    },
    "opacity":{
      "value":0.5,
      "random":false,
      "anim":{
        "enable":false,
        "speed":1
      }
    },
    "size":{
      "value": 20,
      "random":true,
      "anim":{
        "enable": false,
        "speed":30
      }
    },
    "line_linked":{
      "enable": false,
      "distance": 120,
      "color":"#fff",
      "width":1
    },
    "move":{
      "enable":true,
      "speed":2,
      "direction":"none",
      "straight":false
    }
  },
  "interactivity":{
    "detect_on": "window",
    "events":{
      "onhover":{
        "enable":false,
        "mode":"repulse"
      },
      "onclick":{
        "enable": false,
        "mode":"push"
      }
    },
    "modes":{
      "repulse":{
        "distance":100,
        "duration":0.5
      },
      "bubble":{
        "distance":100,
        "size":10
      }
    }
  }
};

    

