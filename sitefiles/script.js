 

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let database;
let depths;
let jsonLoaded = false;
let bodyLoaded = false;
let mousePosition = {x: 0, y: 0};
let currentlyDragging = null;
let dragOffset = {x: 0, y: 0}
let bringBackSidebar = null;
let currentlyHovering = null;
let combineCircle = null;
let currentlyDraggingCounter = 0;
let hintHistory = [];
/*
(async () => {
  var request = new XMLHttpRequest();
  request.open("GET", "https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/database.json", false);
  request.send(null)
  database = JSON.parse(request.responseText);
  jsonLoaded = true;
  consolelog("Json Loaded")
  if (bodyLoaded) {
    init()
  }
})();
*/

function initbody() {
  bodyLoaded = true;
  consolelog("Body Initialized")
  combineCircle = document.getElementById("combinecircle");
  if (jsonLoaded) {
    init()
  }
  var request = new XMLHttpRequest();
  request.open("GET", "https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/database.json", false);
  request.send(null)
  database = JSON.parse(request.responseText);
  jsonLoaded = true;
  consolelog("Json Loaded")
  if (bodyLoaded) {
    init()
  }
  document.addEventListener('mousemove', function(event) {
      mousePosition.x = event.pageX;
      mousePosition.y = event.pageY;
  });
  document.addEventListener('mouseup', function(event) {
    consolelog("stopped dragging")
    stopDrag()
  });
}
function init() {
  consolelog("Init");
  setInterval(loop, 5)
  collection.forEach(collectioncheck => {
    consolelog(collectioncheck)
    var res = database['recipes'][collectioncheck];
    if (!collectionitems.includes(res)) {
      collectionitems.push(res);
    }
  })
  const elements = [...database.elements].sort((a, b) => a.depth - b.depth);
  depths = elements.map(element => database.elements.indexOf(element));
  //collectionitems = collectionitems.sort((a, b) => a-b);
  collectionitems.forEach(addToSidebar => {
    addNewItem(addToSidebar, false)
  })
  renderSidebar();
}
let distanceLerp = 0;
let bringBack = [];
let waitTimeCC = 0;
let combining = null;
let collection = [];
let collectionitems = [0, 1, 2, 3];
let doubleclicktimer = 0;
// Collection Management
if (localStorage["lagpt_collection"] == undefined) {
  localStorage["lagpt_collection"] = JSON.stringify([]);
}
collection = JSON.parse(localStorage["lagpt_collection"]);
function collection_checkItem(id) {
  return collectionitems.includes(id);
}
function collection_checkRecipe(ing1, ing2) {
  if (ing1 > ing2) {
    return collection.includes(ing2 + "." + ing1)
  } else {
    return collection.includes(ing1 + "." + ing2)
  }
  return false;
}
function collection_addRecipe(ing1, ing2) {
  if (ing1 > ing2) {
    collection.push(ing2 + "." + ing1)
    if (!collectionitems.includes(database['recipes'][ing2 + "." + ing1])) collectionitems.push(database['recipes'][ing2 + "." + ing1])
  } else {
    collection.push(ing1 + "." + ing2)
    if (!collectionitems.includes(database['recipes'][ing1 + "." + ing2])) collectionitems.push(database['recipes'][ing1 + "." + ing2])
  }
  localStorage["lagpt_collection"] = JSON.stringify(collection);
}
function addNewItem(id, newrender) {
  if (hintHistory[hintHistory.length - 1] == id) {
    gb_exithint();
  }
  depths.splice(depths.indexOf(id), 1)
  if (newrender != false) renderSidebar();
  //dict_add(id);
}

function gb_sidebarsearch() {
  document.getElementById('gb_sidebarsearch').dataset['show'] = "0";
  document.getElementById('gb_exitsidebarsearch').dataset['show'] = "1";
  document.getElementById('gi_sidebar').dataset['show'] = "1";
  document.getElementById('gi_sidebar').value = "";
  document.getElementById('gi_sidebar').focus();
  document.getElementById('sidebar').scrollTop = 0;
  
}
function gb_exitsidebarsearch() {
  document.getElementById('gb_sidebarsearch').dataset['show'] = "1";
  document.getElementById('gb_exitsidebarsearch').dataset['show'] = "0";
  document.getElementById('gi_sidebar').dataset['show'] = "0";
  renderSidebar();
}
function gi_sidebar() {
  renderSidebar();
}
function gi_sidebarcheck(elm) {
  if (elm.value.replaceAll(" ", "") == "" && elm.dataset.show == "1") gb_exitsidebarsearch();
}
function renderSidebar() {
  let filter = null;
  if (document.getElementById('gi_sidebar').dataset['show'] == "1" && document.getElementById('gi_sidebar').value != "") {
    filter = document.getElementById('gi_sidebar').value;
  }
  let newsort = []
  let distances = {};
  let maxdistance = 0;
  for (const elmr of collectionitems) {
    if (database.elements[elmr].potential == 0) {
      continue;
    }
    if (filter == null) {
      newsort.push(elmr);
    } else {
      let nameelm = database.elements[elmr].name;
      let distance = jaroWinkler(filter.toLowerCase().replace(" ", ""), nameelm.toLowerCase().replace(" ", ""))
      distances[elmr] = distance;
      if (distance > 0.45) {
        newsort.push(elmr);
      }
      if (distance > maxdistance) maxdistance = distance;
    }
  }
  document.getElementById("sidebar").innerHTML = "";
  if (filter != null) {
    newsort = newsort.sort((a, b) => (distances[b] - distances[a]));
  }
  var indcounter = -1;
  if (maxdistance > 0.75) {
    indcounter = 0;
    for (const elmrr of newsort) {
      if (distances[elmrr] <= 0.75) break;
      indcounter++;
    }
  }
  var indcounternew = 0;
  newsort.forEach(addToSidebar => {
    var addElm = sidebar_add(addToSidebar)
    if (indcounternew == indcounter) {
      addElm.dataset['push'] = 1;
    }
    indcounternew++;
  })
}
function sidebar_add(id){
  if (database.elements[id].potential == 0) return;
  let addHtml = '<div class="sidebarimage" onmousedown="spawnside(this)" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[id].stripped + '.png\')"></div><span class="sidebartext">' + database.elements[id].name + '</span>';
  let addElm = document.createElement("DIV");
  addElm.dataset["id"] = id;
  addElm.className = "sidebarelement";
  addElm.innerHTML = addHtml;
  if (database.elements[id].name.length > 12) addElm.childNodes[1].dataset['small'] = "1"
  if (database.elements[id].name.length > 17) addElm.childNodes[1].dataset['small'] = "2"
  document.getElementById("sidebar").appendChild(addElm)
  return addElm;
}
let dictsortingmode = 0;
function dictswitchsort() {
  dictsortingmode++;
  if (dictsortingmode > 5) dictsortingmode = 0;
  renderDictionary();
}
function gi_menu() {
  if (openedMenu.includes("dictionary")) {
    renderDictionary()
  } else if (openedMenu.includes("hint")) {
    maxone = {id: -1, distance: 0};
    var idelmr = 0;
    let filter = document.getElementById('gi_menu').value;
    for (const elmr of database.elements) {
      let nameelm = elmr.name
      let distance = jaroWinkler(filter.toLowerCase().replace(" ", ""), nameelm.toLowerCase().replace(" ", ""))
      if (distance > maxone.distance) {
        maxone = {id: idelmr, distance: distance};
      }
      idelmr++;
    }
    console.log(maxone);
    if (maxone.id != -1) {
      openHint(maxone.id, true);
    }
  }
}
function renderDictionary() {
  
  let additionsDisclaimer = ["", " (Remaining Potential)", " (Remaining Combinations)", " (Depth)", " (Alphabetical Order)", " (ID)"]
  document.getElementById('dictionaryDisclaimer').innerText = "You have found " + collectionitems.length + "/8211 items and " + collection.length + "/20262 recipes." + additionsDisclaimer[dictsortingmode];
  if (dictsortingmode > 0) document.getElementById('dictionaryDisclaimer').dataset['font'] = "1";
  newsort = [...collectionitems];
  let elms = database.elements;
  if (document.getElementById("gi_menu").value != "") {
    console.log("Trying.")
    let filter = document.getElementById('gi_menu').value;
    let newsortset = []
    let distances = {};
    for (const elmr of collectionitems) {
      let nameelm = database.elements[elmr].name;
      let distance = jaroWinkler(filter.toLowerCase().replace(" ", ""), nameelm.toLowerCase().replace(" ", ""))
      distances[elmr] = distance;
      if (distance > 0.75) {
        newsortset.push(elmr);
      }
    }
    newsort = newsortset.sort((a, b) => (distances[b] - distances[a]));
  }
  if (dictsortingmode == 1) {
    usedpotentials = {};
    collection.forEach(colladd => {
      let collsplit = colladd.split(".").map(Number);
      if (usedpotentials[collsplit[0]] == undefined) {
        usedpotentials[collsplit[0]] = 0
      }
      usedpotentials[collsplit[0]] += 1;
      if (collsplit[0] != collsplit[1]) {
        if (usedpotentials[collsplit[1]] == undefined) {
          usedpotentials[collsplit[1]] = 0
        }
        usedpotentials[collsplit[1]] += 1;
      }
    })
    newsort = newsort.sort((a, b) => (elms[b].potential - (usedpotentials[b]||0)) - (elms[a].potential - (usedpotentials[a]||0)));
  }
  if (dictsortingmode == 2) {
    usedrecipes = {};
    collection.forEach(colladd => {
      if (usedrecipes[database.recipes[colladd]] == undefined) {
        usedrecipes[database.recipes[colladd]] = 0
      }
      usedpotentials[database.recipes[colladd]] += 1;
    })
    newsort = newsort.sort((a, b) => (elms[b].recipes - (usedrecipes[b]||0)) - (elms[a].recipes - (usedrecipes[a]||0)));
  }
  if (dictsortingmode == 3) {
    newsort = newsort.sort((a, b) => (elms[b].depth - elms[a].depth));
  }
  if (dictsortingmode == 4) {
    newsort = newsort.sort((a, b) => (elms[a].name.localeCompare(elms[b].name)));
  }
  if (dictsortingmode == 5) {
    newsort = newsort.sort((a, b) => (a - b));
  }
  
  document.getElementById("dictionaryContainer").innerHTML = "";
  newsort.forEach(addToSidebar => {
    dict_add(addToSidebar)
  })
}
function dict_add(id) {
  let addElm = document.createElement("DIV");
  addElm.onmousedown = function() {
    openDict(id);
  };
  addElm.className = "dictItem";
  addElm.style.backgroundImage = "url('https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/" + database.elements[id].stripped + ".png')";
  document.getElementById("dictionaryContainer").appendChild(addElm)
}

let prevMousePosition = {x: 0, y: 0}
let totalMouseOffsetDragging = 0;
function loop() {
  if (currentlyDragging != null) {
    let mouseOffset = {x: mousePosition.x - prevMousePosition.x, y: mousePosition.y - prevMousePosition.y};
    totalMouseOffsetDragging += Math.sqrt(mouseOffset.x*mouseOffset.x + mouseOffset.y*mouseOffset.y);
    prevMousePosition = {x: mousePosition.x, y: mousePosition.y};
    let secondsPassed = (Date.now() - currentlyDraggingCounter) / 1000;
    if (secondsPassed > 0.5 && totalMouseOffsetDragging < 20) {
      totalMouseOffsetDragging = 0;

      openDict(currentlyDragging.dataset.id);
      stopDrag();
      return;
    }
    let viewportWidth  = document.documentElement.clientWidth;
    let viewportHeight = document.documentElement.clientHeight;
    currentlyDragging.style.left = (parseInt(mousePosition.x - dragOffset.x)) + "px";
    currentlyDragging.style.top = (parseInt(mousePosition.y - dragOffset.y)) + "px";
    if (parseInt(mousePosition.x - dragOffset.x) > (viewportWidth) - 300) {
      if (currentlyDragging.dataset["small"] == "0") {
        currentlyDragging.dataset["small"] = "1"
      }
    } else if (currentlyDragging.dataset["small"] == "1") {
      if (bringBackSidebar != null) bringBackSidebar.dataset['disappear'] = "0";
        currentlyDragging.dataset["small"] = "0"
    }
    if (currentlyHovering != null) {
      combineCircle.dataset["show"] = "1";
      consolelog(currentlyHovering.parentNode)
      consolelog((parseInt(mousePosition.x - dragOffset.x)), parseInt(currentlyHovering.parentNode.style.left))
      var lerpGetLeft = (((parseInt(currentlyDragging.style.left) + (parseInt(currentlyHovering.parentNode.style.left)))/ 2) - 174);
      var lerpGetTop = (((parseInt(currentlyDragging.style.top) + (parseInt(currentlyHovering.parentNode.style.top)))/ 2) - 174);
      consolelog("lerps" + lerpGetLeft +  "," + lerpGetTop)
      combineCircle.style.left = ((parseInt(combineCircle.style.left) * 0.9) + (lerpGetLeft * 0.1)) + "px"
      combineCircle.style.top = ((parseInt(combineCircle.style.top) * 0.9) + (lerpGetTop * 0.1)) + "px"
      if (waitTimeCC != null && performance.now() - waitTimeCC > 350) {
        combineCircle.style.left = lerpGetLeft + "px";
        combineCircle.style.top = lerpGetTop + "px";
      }
      waitTimeCC = performance.now()
    } else {
      distanceLerp = 0;
      combineCircle.dataset["show"] = "0";
      currentlyDragging.dataset["comb"] = "0";
    }
  } else {
    distanceLerp = 0;
  }
  if (bringBack.length > 0) {
    removeId = null;
  }
  prevMousePosition = {x: mousePosition.x, y: mousePosition.y};
}
let discoveryMenu = null;
function openDiscoveryMenu(id) {
  discoveryMenu = id;
  document.getElementById("newDiscovery").dataset["shown"] = "1";
  document.getElementById("newDiscoveryTitle").innerText = database.elements[id].name;
  document.getElementById("newDiscoveryDescription").innerText = "'" + database.elements[id].description + "'";
  document.getElementById("newDiscoveryImage").style.backgroundImage = "url('https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/" + database.elements[id].stripped + ".png')";
}
function closeDiscoveryMenu() {
  discoveryMenu = null;
  document.getElementById("newDiscovery").dataset["shown"] = "0";
}

function spawnitem(id, posx, posy, smaller) {
  let innerHtmlItem = '<div class="gamecircle"></div><div class="gameimage" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/%1%.png\')"></div><div class="gamehitbox" onmouseover="hoverElement(this, true)" onmouseout="hoverElement(this, false)" onmousedown="gameElmPress(this)"></div>'
  let htmlItem = document.createElement("DIV");
  htmlItem.className = "gameelement";
  htmlItem.dataset['id'] = id;
  htmlItem.dataset['small'] = "1";
  htmlItem.style.left = posx + "px";
  htmlItem.style.top = posy + "px";
  if (smaller == true) htmlItem.dataset["small"] = "2";
  htmlItem.innerHTML = innerHtmlItem.replace("%1%", database.elements[id].stripped);
  document.getElementById("gamecontainer").appendChild(htmlItem)
  return htmlItem
}
async function hoverElement(elm, status) {
  if (combining) return;
  if (currentlyDragging != null && currentlyDragging == elm) return; 
  let circleElm = elm.parentNode;
  var rndid = Math.round(Math.random() * 1000)
  consolelog("hover", rndid)
  if (status) {
    currentlyHovering = elm;
    if (currentlyDragging == null) {
      consolelog("hover move", rndid)
      circleElm.dataset['originalpos'] = getElementPosition(elm) + "";
      consolelog("movin to last sibling")
      moveToLastSibling(circleElm);
    }
  } else {
    if (currentlyHovering == elm) {
      if (currentlyDragging != null && currentlyDragging != elm) {
        bringBack.push(elm)
      }
      currentlyHovering = null;
    }
    elm.parentNode.dataset["comb"] = "0"
    consolelog("hover move back", rndid)
    if (currentlyDragging == null) {
      moveToOriginalPosition(circleElm, parseInt(circleElm.dataset['originalpos']));
      await sleep(1)
    }
  }
  await sleep(0)
  circleElm.dataset["hovered"] = status ? 1 : 0
  if (status) {
    if (currentlyDragging != elm && currentlyDragging != null) {
      circleElm.dataset["comb"] = "1";
      currentlyDragging.dataset["comb"] = "1";
    }
  }
}

async function combineGameElements(on, below) {
  combining = true;
  combineCircle.dataset["show"] = "0";
  on.dataset["comba"] = "2";
  below.dataset["comba"] = "2";
  let id1 = parseInt(on.dataset["id"]);
  let id2 = parseInt(below.dataset["id"]);
  if (id1 > id2) {
    let temp = id1;
    id1 = id2;
    id2 = temp;
  }
  consolelog("COMBINE!", id1, id2)
  let combinationResult = database['recipes'][id1 + '.' + id2];
  consolelog(combinationResult);
  //if (combinationResult == 4) combinationResult = undefined;
  if (combinationResult == undefined) {
    on.dataset["comba"] = "0";
    on.dataset["comb"] = "0";
    on.dataset["hovered"] = "0";
    on.dataset["failed"] = "1";
    below.dataset["comba"] = "0";
    below.dataset["comb"] = "0";
    below.dataset["hovered"] = "0";
    below.dataset["failed"] = "1";
    await sleep(200)
    on.dataset["failed"] = "0";
    below.dataset["failed"] = "0";
    combining = false;
  } else {
    hoverElement(below, false);
    currentlyHovering = null;
    let interpolated = {x: (parseInt(on.style.left) + parseInt(below.style.left))/2, y: (parseInt(on.style.top) + parseInt(below.style.top))/2};
    for (let idt = 0; idt < 75; idt++) {
      on.style.left = ((parseInt(on.style.left) * 0.85) + (interpolated.x * 0.15)) + "px";
      on.style.top = ((parseInt(on.style.top) * 0.85) + (interpolated.y * 0.15)) + "px";
      below.style.left = ((parseInt(below.style.left) * 0.85) + (interpolated.x * 0.15)) + "px";
      below.style.top = ((parseInt(below.style.top) * 0.85) + (interpolated.y * 0.15)) + "px";
      await sleep(4)
    }
    on.remove();
    below.remove();
    combining = false;
    newDiscovery = !collection_checkItem(combinationResult);
    newRecipe = !collection_checkRecipe(id1, id2);
    itemIsFinal = (database.elements[combinationResult].potential == 0)
    let spitem = spawnitem(combinationResult, interpolated.x, interpolated.y, true);
    if (!newDiscovery && newRecipe) {
      sparks(spitem);
    }
    if (newRecipe) {
      collection_addRecipe(id1, id2);
    }
    await sleep(100)
    spitem.dataset["small"] = "0";
    spitem.dataset["newitem"] = "1";
    currentlyHovering = null;
    if (newDiscovery) {
      addNewItem(combinationResult);
      openDiscoveryMenu(combinationResult)
      for (let iw = 0; iw < 500; iw++) {
        await sleep(5);
        if (discoveryMenu == null) {
          break;
        }
      }
      if (itemIsFinal) {
        await sleep(700)
        destroyElm(spitem, combinationResult)
      }
    } else {
      if (itemIsFinal) {
        await sleep(1500)
        destroyElm(spitem, combinationResult)
      }
    }
  }
}
async function sparks(elm) {
  var partyElm = document.createElement("DIV");
  partyElm.style.position = "absolute";
  partyElm.style.left = (parseInt(elm.style.left) - 13) + "px";
  partyElm.style.top = (parseInt(elm.style.top) - 8) + "px";
  document.getElementById("gamecontainer").appendChild(partyElm)
  party.sparkles(partyElm, {zIndex: -1});
  await sleep(2000);
  partyElm.remove()
}
function startDrag(elm, ignore, ignoredoubleclick) {
  let secondsPassed = (Date.now() - doubleclicktimer) / 1000;
  if (secondsPassed < 0.185 && ignoredoubleclick != true) {
    console.log("double click");
    //spawnitem(elm.dataset.id, parseInt(elm.style.left), parseInt(elm.style.top))
    dupeItem(elm);
    return;
  }
  totalMouseOffsetDragging = 0;
  currentlyHovering = null;
  currentlyDraggingCounter = Date.now();
  if (currentlyDragging != null) stopDrag()
  elm.dataset['dragging'] = "1"
  hoverElement(elm.childNodes[0], false)
  currentlyDragging = elm;
  moveToLastSibling(elm)
  if (ignore != true) dragOffset = {x: mousePosition.x - parseInt(elm.style.left), y: mousePosition.y - parseInt(elm.style.top)}
}
async function dupeItem(elm) {
  let viewportWidth  = document.documentElement.clientWidth;
  console.log(parseInt(elm.style.left), (viewportWidth) - 400)
  let spitem = spawnitem(elm.dataset.id, parseInt(elm.style.left) - 90, parseInt(elm.style.top) + 45, true);
  await sleep(100)
  spitem.dataset["small"] = "0";
  spitem.dataset["newitem"] = "1";
}
function gameElmPress(elm) {
  consolelog("yes");
  consolelog(elm.parentNode.dataset['small'])
  if (elm.parentNode.dataset['small'] == "0") {
    startDrag(elm.parentNode, false);
  }
}
async function destroyElm(elm, final) {
  elm.dataset["small"] = "2";
  elm.childNodes[2].dataset["disable"] = "1";
  if (final == -1) {
    elm.dataset["finalitem"] = "2";
    await sleep(700);
    elm.remove();
    return;
  }
  if (final != undefined) {
    elm.dataset["finalitem"] = "1";
    await sleep(200);
    party.resolvableShapes["finalItem" + final] = `<img height="50px" width="50px" src="https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/` + database.elements[final].stripped + `.png"/>`;
    //rectsrc = party.sources.rectSource([parseInt(elm.style.left), parseInt(elm.style.top)]);
    var partyElm = document.createElement("DIV");
    partyElm.style.position = "absolute";
    partyElm.style.left = (parseInt(elm.style.left) - 23) + "px";
    partyElm.style.top = (parseInt(elm.style.top) - 12) + "px";
    document.getElementById("gamecontainer").appendChild(partyElm)
   /* party.confetti(partyElm,{
      shapes: ["finalItem" + final],
      debug: false,
      gravity: 1800,
      zIndex: 5,
      count: 15
    }); */
    party.scene.current.createEmitter({
      emitterOptions: {
        loops: 1,
        useGravity: false,
        modules: [
          new party.ModuleBuilder()
            .drive("size")
            .by((t) => (t < 0.2 ? t * 5 : 1))
            .build(),
          new party.ModuleBuilder()
            .drive("opacity")
            .by((t) => Math.max(0, 1 - t))
            .build(),
        ],
      },
      emissionOptions: {
        rate: 0,
        bursts: [{ time: 0, count: party.variation.skew(10, 5) }],
        sourceSampler: party.sources.dynamicSource(partyElm),
        angle: party.variation.range(0, 360),
        initialSpeed: party.variation.range(50, 500), // Different speeds for each particle
        initialColor: party.variation.gradientSample(
          party.Gradient.simple(party.Color.fromHex("#ffa68d"), party.Color.fromHex("#fd3a84"))
        ),
        lifetime: 0.5,
      },
      rendererOptions: {
        count: 15,
        zIndex: 5,
        shapeFactory: "finalItem" + final,
        applyLighting: undefined,
      },
    });
    
    await sleep(100);
    elm.remove();
    await sleep(700);
    partyElm.remove();
  } else {
    await sleep(2000);
    elm.remove();
  }
}
function stopDrag() {
  
  consolelog("stopped dragging")
  if (bringBackSidebar != null) bringBackSidebar.dataset['disappear'] = "0";
  if (currentlyDragging != null) {
    let secondsPassed = (Date.now() - currentlyDraggingCounter) / 1000;
    currentlyDraggingCounter = 9999999999999999999999999999999999999999;
    if (secondsPassed < 0.185) {
      doubleclicktimer = Date.now();
    }

    if (currentlyHovering != null) {
      combineGameElements(currentlyDragging, currentlyHovering.parentNode)
    }
    if (currentlyDragging.dataset["small"] == "0") currentlyDragging.dataset["small"] = "0";
    if (currentlyDragging.dataset["small"] == "1") {
      destroyElm(currentlyDragging);
    }
    currentlyDragging.dataset["comb"] = "0";
    currentlyDragging.dataset['dragging'] = "0"
  }
  currentlyDragging = null;
}

function spawnside(elm) {
  let id = parseInt(elm.parentNode.dataset.id);
  consolelog(elm.parentNode, id)
  elm.dataset['disappear'] = "1"
  bringBackSidebar = elm;
  offsetElm = getOffset(elm.parentNode);
  dragOffset = {x: mousePosition.x - offsetElm.x, y: mousePosition.y - offsetElm.y}
  consolelog(dragOffset)
  let spawnedItem = spawnitem(id, offsetElm.x, offsetElm.y);
  startDrag(spawnedItem, true, true);
  dragOffset = {x: mousePosition.x - offsetElm.x, y: mousePosition.y - offsetElm.y}
}
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX + 50,
    y: rect.top + window.scrollY + 50
  };
}
function moveToLastSibling(element) {
  if (!element.parentNode) {
    return;
  }
  
  element.parentNode.appendChild(element);
}
function moveToOriginalPosition(element, originalPosition) {
  if (!element.parentNode || originalPosition < 0) {
    return;
  }
  
  const siblings = element.parentNode.children;
  
  if (originalPosition < siblings.length) {
    element.parentNode.insertBefore(element, siblings[originalPosition]);
  } else {
    element.parentNode.appendChild(element);
  }
}
function getElementPosition(element) {
  if (!element.parentNode) {
    return -1;
  }
  
  const siblings = element.parentNode.children;
  return Array.from(siblings).indexOf(element);
}
function consolelog(msg) {
  //consolelog(msg)
}

async function gb_clean() {
  if (document.getElementById("gb_clean").dataset["clean"] == "1") {
    return;
  }
  document.getElementById("gb_clean").dataset["clean"] = "1";
  var elms = document.getElementsByClassName("gameelement");
  for (const elmr of elms) {
    if (elmr.dataset.id != undefined) {
      destroyElm(elmr, -1)
    }
  }
  await sleep(600);
  document.getElementById("gb_clean").dataset["clean"] = "0";
}
function gb_dict() {
  renderDictionary();
  openMenu("dictionary");
}

function openDict(id) {
  consolelog("clicked" + id)
  if (openedMenu.includes("iteminfo")) exitMenu()
  document.getElementById("iteminfoItem").style.backgroundImage = "url('https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/" + database.elements[id].stripped + ".png')";
  document.getElementById("iteminfoDisclaimer").innerText = database.elements[id].name;
  document.getElementById("iteminfoDescription").innerText = database.elements[id].description;
  document.getElementById("iteminfoCombinations").innerHTML = "";
  document.getElementById("iteminfoPotentials").innerHTML = "";
  document.getElementById("iteminfoRecipeDepth").innerText = "Recipe Depth: " + database.elements[id].depth;
  document.getElementById("iteminfoID").innerText = "ID: " + id;
  var collectionCounter = 0;
  var potentialCounter = 0;
  collection.forEach(colladd => {
    let collsplit = colladd.split(".").map(Number);
    if (database.recipes[colladd] == id) {
      let infocombelm = document.createElement("div");
      infocombelm.className = "iteminfoCombination";
      var innercomb = '<div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openDict(' + collsplit[0] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[0]].stripped +'.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[0]].name + '</p></div><p class="iteminfoCombinationText">+</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openDict(' + collsplit[1] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[1]].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[1]].name + '</p></div><p class="iteminfoCombinationText">=</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[id].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[id].name + '</p></div>'
      consolelog(innercomb)
      infocombelm.innerHTML = innercomb;
      document.getElementById("iteminfoCombinations").scrollTop = 0;
      document.getElementById("iteminfoCombinations").appendChild(infocombelm);
      collectionCounter += 1;
    }
    if (collsplit[0] == id || collsplit[1] == id) {
      if (collsplit[1] == id) {
        var tempswitch = collsplit[0];
        collsplit[0] = collsplit[1];
        collsplit[1] = tempswitch;
      }
      let infocombelm = document.createElement("div");
      infocombelm.className = "iteminfoCombination";
      var innercomb = '<div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openDict(' + collsplit[0] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[0]].stripped +'.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[0]].name + '</p></div><p class="iteminfoCombinationText">+</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openDict(' + collsplit[1] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[1]].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[1]].name + '</p></div><p class="iteminfoCombinationText">=</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openDict(' + database.recipes[colladd] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[database.recipes[colladd]].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[database.recipes[colladd]].name + '</p></div>'
      consolelog(innercomb)
      infocombelm.innerHTML = innercomb;
      document.getElementById("iteminfoPotentials").scrollTop = 0;
      document.getElementById("iteminfoPotentials").appendChild(infocombelm);
      potentialCounter += 1;
    }
  })
  document.getElementById("iteminfoCombination").innerText = "Combinations (" + collectionCounter + "/" + database.elements[id].recipes + ")";
  document.getElementById("iteminfoPotential").innerText = "Potential (" + potentialCounter + "/" + database.elements[id].potential + ")";
  if (database.elements[id].potential == 0) {
    document.getElementById("iteminfoPotential").innerText = "Final Item";
  }
  openMenu("iteminfo");
}
let openedMenu = [];
async function openMenu(id, ignorehintg) {
  if (openedMenu.length == 0 && id == "dictionary") {
    document.getElementById("menutitle").innerText = "Collection";
    document.getElementById("gi_menu").dataset["show"] = "2";
    document.getElementById("gi_menu").value = "";
  }
  if (openedMenu.length == 0 && id == "hint") {
    document.getElementById("menutitle").innerText = "Hint";
    document.getElementById("gi_menu").dataset["show"] = "1";
    if (ignorehintg != true) document.getElementById("gi_menu").value = "";
  }
  if (openedMenu.length == 0 && id == "iteminfo") {
    document.getElementById("menutitle").innerText = "Dictionary";
  }

  openedMenu.push(id);
  document.getElementById("menubg").dataset["shown"] = openedMenu.length;
  document.getElementById(id).dataset["shown"] = "1";
}

function exitMenu(ignoreHint) {
  if (openedMenu.length > 0) {
    if (openedMenu[openedMenu.length - 1] == "hint") {
      if (hintHistory.length > 1 && ignoreHint != true) {
        hintHistory.pop();
        let pophint = hintHistory.pop();
        openHint(pophint, false)
        return;
      }
    }
    popped = openedMenu.pop();
    document.getElementById("menubg").dataset["shown"] = openedMenu.length;
    if (openedMenu.length == 0) {
      delete document.getElementById("menubg").dataset["shown"];
      document.getElementById("gi_menu").dataset["show"] = "0";
    }
    document.getElementById(popped).dataset["shown"] = "0";
  }
}
function gb_hint() {
  if (hintHistory.length > 0) {
    openHint(hintHistory.pop());
    return;
  }
  openHint(depths[biasedRandomNumber(8, depths.length - 1)]);
}
function gb_exithint() {
  document.getElementById("gb_hint").dataset["hint"] = "0";
  document.getElementById("gb_exithint").dataset["hint"] = "0";
  hintHistory = [];
}
async function openHint(id, ignoreHint) {
  document.getElementById("gb_hint").dataset["hint"] = "1";
  document.getElementById("gb_exithint").dataset["hint"] = "1";
  if (document.getElementById("hint").dataset['wiggle'] == "1") return;
  //if (id < 4) return;
  if (ignoreHint != true) {
    if (hintHistory.includes(id)) {
      hintHistory.slice(0, hintHistory.indexOf(id));
    } else {
      hintHistory.push(id);
    }
    console.log("hint history", hintHistory);
  }
  console.log(id);
  consolelog(id, database.elements[id].name);
  if (openedMenu.includes("hint")) {
    exitMenu(true)
    document.getElementById("hint").dataset['wiggle'] = "1";
  } 
    
  document.getElementById("hintItem").style.backgroundImage = "url('https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/" + database.elements[id].stripped + ".png')";
  document.getElementById("hintDisclaimer").innerText = database.elements[id].name;
  document.getElementById("hintDescription").innerText = database.elements[id].description;
  let collsplit = database.elements[id].discovered;
  if (collsplit.length == 1) collsplit.push(collsplit[0]);
  consolelog(collsplit)
  var recipeArray = [];
  var recipeKeys = Object.keys(database.recipes);
  recipeKeys.forEach(recipeCheck => {
    if (database.recipes[recipeCheck] == id) {
      let collsplit2 = recipeCheck.split(".").map(Number);
      recipeArray.push({recipe: collsplit2, depth: database.elements[collsplit2[0]].depth + database.elements[collsplit2[1]].depth})
    }
  })
  recipeArray = recipeArray.sort((a, b) => a.depth - b.depth);
  consolelog(recipeArray);
  if (recipeArray.length == 1) {
    document.getElementById("hintPossible").innerText = "Possible Combination"
  } else {
    document.getElementById("hintPossible").innerText = "Possible Combinations"
  }
  if (id < 4) {
    document.getElementById("hintPossible").innerText = "Basic Element."
    document.getElementById("hintComb").innerHTML = "";
  } else {
    document.getElementById("hintComb").innerHTML = "";
    for (let irg = 0; irg < Math.min(recipeArray.length, 3); irg++) {
      collsplit = recipeArray[irg].recipe;
      consolelog(collsplit)
      let infocombelm = document.createElement("div");
      infocombelm.className = "iteminfoCombination";
      consolelog(database.elements[recipeArray[0]]);
      var innercomb = '<div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openHint(' + collsplit[0] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[0]].stripped +'.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[0]].name + '</p></div><p class="iteminfoCombinationText">+</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openHint(' + collsplit[1] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[1]].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[1]].name + '</p></div><p class="iteminfoCombinationText">=</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[id].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[id].name + '</p></div>'
      consolelog(innercomb)
      infocombelm.innerHTML = innercomb;
      document.getElementById("hintComb").scrollTop = 0;
      document.getElementById("hintComb").appendChild(infocombelm);
    }
  }
  openMenu("hint", ignoreHint);
  await sleep(50)
  document.getElementById("hint").dataset['wiggle'] = "0";
}
function biasedRandomNumber(power, max) {
  const rand = Math.random();
  return Math.floor(Math.pow(rand, power) * max);
}


function jaroDistance(s1, s2) {
  if (s1 === s2) return 1.0;

  let len1 = s1.length, len2 = s2.length;
  let maxDist = Math.floor(Math.max(len1, len2) / 2) - 1;
  let match = 0;
  let hashS1 = new Array(s1.length).fill(0);
  let hashS2 = new Array(s2.length).fill(0);

  for (let i = 0; i < len1; i++) {
    for (let j = Math.max(0, i - maxDist); j < Math.min(len2, i + maxDist + 1); j++) {
      if (s1[i] === s2[j] && hashS2[j] === 0) {
        hashS1[i] = 1;
        hashS2[j] = 1;
        match++;
        break;
      }
    }
  }

  if (match === 0) return 0.0;

  let t = 0;
  let point = 0;

  for (let i = 0; i < len1; i++) {
    if (hashS1[i] === 1) {
      while (hashS2[point] === 0) point++;
      if (s1[i] !== s2[point++]) t++;
    }
  }

  t /= 2;
  return ((match) / (len1) + (match) / (len2) + (match - t) / (match)) / 3.0;
}

function jaroWinkler(s1, s2) {
  let jaroDist = jaroDistance(s1, s2);

  if (jaroDist > 0.7) {
    let prefix = 0;

    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
      if (s1[i] === s2[i]) prefix++;
      else break;
    }

    prefix = Math.min(4, prefix);
    jaroDist += 0.1 * prefix * (1 - jaroDist);
  }

  return jaroDist;
}
