 

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
  console.log("Body Initialized")
  combineCircle = document.getElementById("combinecircle");
  if (jsonLoaded) {
    init()
  }
  var request = new XMLHttpRequest();
  request.open("GET", "https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/database.json", false);
  request.send(null)
  database = JSON.parse(request.responseText);
  jsonLoaded = true;
  console.log("Json Loaded")
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
  console.log("Init");
  setInterval(loop, 5)
  collection.forEach(collectioncheck => {
    console.log(collectioncheck)
    var res = database['recipes'][collectioncheck];
    if (!collectionitems.includes(res)) {
      collectionitems.push(res);
    }
  })
  const elements = [...database.elements].sort((a, b) => a.depth - b.depth);
  depths = elements.map(element => database.elements.indexOf(element));
  //collectionitems = collectionitems.sort((a, b) => a-b);
  collectionitems.forEach(addToSidebar => {
    addNewItem(addToSidebar)
  })
}
let distanceLerp = 0;
let bringBack = [];
let waitTimeCC = 0;
let combining = null;
let collection = [];
let collectionitems = [0, 1, 2, 3];
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
function addNewItem(id) {
  depths.splice(depths.indexOf(id), 1)
  sidebar_add(id)
  dict_add(id);
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

function loop() {
  if (currentlyDragging != null) {
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
  console.log("COMBINE!", id1, id2)
  let combinationResult = database['recipes'][id1 + '.' + id2];
  console.log(combinationResult);
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
function startDrag(elm, ignore) {
  if (currentlyDragging != null) stopDrag()
  elm.dataset['dragging'] = "1"
  hoverElement(elm.childNodes[0], false)
  currentlyDragging = elm;
  moveToLastSibling(elm)
  if (ignore != true) dragOffset = {x: mousePosition.x - parseInt(elm.style.left), y: mousePosition.y - parseInt(elm.style.top)}
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
  startDrag(spawnedItem, true);
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
  //console.log(msg)
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

  document.getElementById('dictionaryDisclaimer').innerText = "You have found " + collectionitems.length + "/8211 items and " + collection.length + "/20262 recipes."
  openMenu("dictionary");
}

function openDict(id) {
  console.log("clicked" + id)
  if (openedMenu.includes("iteminfo")) exitMenu()
  document.getElementById("iteminfoItem").style.backgroundImage = "url('https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/" + database.elements[id].stripped + ".png')";
  document.getElementById("iteminfoDisclaimer").innerText = database.elements[id].name;
  document.getElementById("iteminfoDescription").innerText = database.elements[id].description;
  document.getElementById("iteminfoCombinations").innerHTML = "";
  document.getElementById("iteminfoPotentials").innerHTML = "";
  var collectionCounter = 0;
  var potentialCounter = 0;
  collection.forEach(colladd => {
    let collsplit = colladd.split(".").map(Number);
    if (database.recipes[colladd] == id) {
      let infocombelm = document.createElement("div");
      infocombelm.className = "iteminfoCombination";
      var innercomb = '<div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openDict(' + collsplit[0] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[0]].stripped +'.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[0]].name + '</p></div><p class="iteminfoCombinationText">+</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openDict(' + collsplit[1] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[1]].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[1]].name + '</p></div><p class="iteminfoCombinationText">=</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[id].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[id].name + '</p></div>'
      console.log(innercomb)
      infocombelm.innerHTML = innercomb;
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
      console.log(innercomb)
      infocombelm.innerHTML = innercomb;
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
async function openMenu(id) {
  if (id == "dictionary") {
    document.getElementById("menutitle").innerText = "Collection";
  }
  if (id == "hint") {
    document.getElementById("menutitle").innerText = "Hint";
  }
  openedMenu.push(id);
  document.getElementById("menubg").dataset["shown"] = openedMenu.length;
  document.getElementById(id).dataset["shown"] = "1";
}

function exitMenu() {
  if (openedMenu.length > 0) {
    popped = openedMenu.pop();
    document.getElementById("menubg").dataset["shown"] = openedMenu.length;
    if (openedMenu.length == 0) delete document.getElementById("menubg").dataset["shown"];
    document.getElementById(popped).dataset["shown"] = "0";
  }
}
function gb_hint() {
  openHint(depths[biasedRandomNumber(8, depths.length - 1)]);
}
async function openHint(id) {
  if (document.getElementById("hint").dataset['wiggle'] == "1") return;
  if (id < 4) return;
  console.log(id, database.elements[id].name);
  if (openedMenu.includes("hint")) {
    exitMenu()
    document.getElementById("hint").dataset['wiggle'] = "1";
  } 
    
  document.getElementById("hintItem").style.backgroundImage = "url('https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/" + database.elements[id].stripped + ".png')";
  document.getElementById("hintDisclaimer").innerText = database.elements[id].name;
  document.getElementById("hintDescription").innerText = database.elements[id].description;
  let collsplit = database.elements[id].discovered;
  if (collsplit.length == 1) collsplit.push(collsplit[0]);
  console.log(collsplit)
  var recipeArray = [];
  var recipeKeys = Object.keys(database.recipes);
  recipeKeys.forEach(recipeCheck => {
    if (database.recipes[recipeCheck] == id) {
      let collsplit2 = recipeCheck.split(".").map(Number);
      recipeArray.push({recipe: collsplit2, depth: database.elements[collsplit2[0]].depth + database.elements[collsplit2[1]].depth})
    }
  })
  recipeArray = recipeArray.sort((a, b) => a.depth - b.depth);
  collsplit = recipeArray[0].recipe;
  console.log(collsplit)
  let infocombelm = document.createElement("div");
  infocombelm.className = "iteminfoCombination";
  console.log(database.elements[recipeArray[0]]);
  var innercomb = '<div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openHint(' + collsplit[0] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[0]].stripped +'.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[0]].name + '</p></div><p class="iteminfoCombinationText">+</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" onclick="openHint(' + collsplit[1] + ')" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[collsplit[1]].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[collsplit[1]].name + '</p></div><p class="iteminfoCombinationText">=</p><div class="iteminfoCombinationItem"><div class="iteminfoCombinationImg" style="background-image: url(\'https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/cdn/IconsStyle/' + database.elements[id].stripped + '.png\')"></div><p class="iteminfoCombinationText">' + database.elements[id].name + '</p></div>'
  console.log(innercomb)
  infocombelm.innerHTML = innercomb;
  document.getElementById("hintComb").innerHTML = "";
  document.getElementById("hintComb").appendChild(infocombelm);
  openMenu("hint");
  await sleep(50)
  document.getElementById("hint").dataset['wiggle'] = "0";
}
function biasedRandomNumber(power, max) {
  const rand = Math.random();
  return Math.floor(Math.pow(rand, power) * max);
}
