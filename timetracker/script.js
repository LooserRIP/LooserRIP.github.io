
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
} 
var types = [];
var history = [];
var documentElements = {};
var pickedCategory = 0;
var cooldownWindowClose = 0;
var selectedCategory = -1;



function init() {
  let key = window.keyboard;
  key.addEventListener("keyboardchange", keyboardchange);
  function keyboardchange(state, dimensions) {
    let message =  state + " " + dimensions.width + "x" + dimensions.height;
    if (state == "shown") {
      document.getElementById("windowsParent").dataset["keyboard"] = "1";
    } else {
      document.getElementById("windowsParent").dataset["keyboard"] = "0";
    }
  }
  types = [];
  initDocElms();
  initLocalStorage();
  refreshTimeButtons();
  selectCategory(0);
}
function initDocElms() {
  documentElements["categorySlider"] = document.getElementById("activitySlider");
  documentElements["windowParent"] = document.getElementById("windowsParent");
  documentElements["iconList"] = document.getElementById("chooseIcon_iconList");
}
function initLocalStorage() {
  if (localStorage["tt_types"] == undefined) {
    addCategory("Routine", "coffee", "#807f44;");
      addText(0, "Morning Routine");
      addText(0, "Evening Routine");
      addText(0, "Night Routine");
    addCategory("Work", "work", "#5874b0;");
      addText(1, "Paid Work");
      addText(1, "Personal Hobby");
    addCategory("Education", "school", "#71c1c9");
      addText(2, "School");
      addText(2, "Homework");
    addCategory("Fitness", "fitness_center", "#ee8787");
      addText(3, "Cardio");
      addText(3, "Weight Lifting");
      addText(3, "Calisthenics");
    addCategory("Meditation", "self_improvement", "#e9afa3");
      addText(4, "Mindfulness");
      addText(4, "Relaxation");
      addText(4, "Gratitude");
    addCategory("Procrastination", "remove", "#969696");
      addText(5, "Internet");
      addText(5, "YouTube");
      addText(5, "TikTok");
      addText(5, "Instagram");
    addCategory("Sleep", "hotel", "#c48ddd");
      addText(6, "Sleeping");
      addText(6, "Resting");
    addCategory("Entertainment", "sports_esports", "#5dc365");
      addText(7, "Video Games");
      addText(7, "Hobbies");
    addCategory("Social", "group", "#a55f43");
      addText(8, "Hangouts");
      addText(8, "Parties");
    localStorage["tt_types"] = JSON.stringify(types);
  } else {
    types = JSON.parse(localStorage["tt_types"]);
  }
}
function generateTextButtons(id) {
  var activityTextsDoc = document.getElementById("activityTexts");
  removeAllChildNodes(activityTextsDoc);
  if (id != -1) {
    types[id].texts.forEach(element => {
      var addActivityTxt = document.createElement("P");
      addActivityTxt.className = "activityTextPick";
      addActivityTxt.innerText = element;
      addActivityTxt.setAttribute("onmousedown", "startTextCount(this)");
      addActivityTxt.setAttribute("ontouchstart", "startTextCount(this)");
      addActivityTxt.setAttribute("onmouseup", "endTextCount(this)");
      addActivityTxt.setAttribute("ontouchend", "endTextCount(this)");
      activityTextsDoc.appendChild(addActivityTxt);
    });
    var addActivityTxta = document.createElement("P");
    addActivityTxta.className = "activityTextPick";
    addActivityTxta.id = "addActivityText";
    addActivityTxta.innerText = "+";
    activityTextsDoc.appendChild(addActivityTxta);
  }
}
var dateSaveCountText = 0;
var elementSaveCountText = null;
function selectText(elm) {
  
}
function startTextCount(elm) {
  dateSaveCountText = Date.now();
  elementSaveCountText = elm;
}
function endTextCount(elm, category, text) {
  if (elementSaveCountText == elm) {
    var difference = Date.now() - dateSaveCountText;
    if (difference > 1500) {
      
    } else {
      selextText()
    }
    elementSaveCountText = null;
  }
}
function addText(id, text) {
  types[id].texts.push(text);
  localStorage["tt_types"] = JSON.stringify(types);
  if (id == selectedCategory) generateTextButtons(id);
}
function selectCategory(id) {
  document.getElementById("categoryName").innerText = types[id].name;
  console.log(id);
  selectedCategory = id;
  for (let elmI = 0; elmI < types.length; elmI++) {
    if (elmI == id) {
      documentElements["category" + elmI].dataset["selected"] = "1";
    } else {
      documentElements["category" + elmI].dataset["selected"] = "0";
    }
  }
  generateTextButtons(id);
}
function addCategoryUI() {
  document.getElementById("input_categoryname").value = "";
  timeCategoryCooldown = Date.now();
  openWindow("addCategory");
}
function openWindow(name) {
  cooldownWindowClose = Date.now();
  document.getElementById("windowBackground").dataset["active"] = "1";
  document.getElementById("window_" + name).dataset['open'] = "1";
}
function closeWindow(name) {
  document.getElementById("windowBackground").dataset["active"] = "0";
  document.getElementById("window_" + name).dataset['open'] = "0";
}
function closeAllWindows() {
  var opens = [];
  if (cooldownWindowClose + 500 < Date.now())  {
    var windows = document.getElementsByClassName("window");
    for(var i = 0; i < windows.length; i++) {
      if (windows[i].dataset["open"] == "1") {
        opens.push(windows[i].id);
        windows[i].dataset["open"] = "0";
      }
    }
    document.getElementById("windowBackground").dataset["active"] = "0";
    if (opens.includes("window_chooseIcon")) {
      openWindow("addCategory");
    }
  }
}
function openIconChoose() {
  closeAllWindows();
  document.getElementById("input_searchicons").value = "";
  iconSearch = "";
  openWindow("chooseIcon");
  clearIconList();
  refreshIconList(iconSearch, documentElements.iconList.childElementCount, 100);
}
var timeCategoryCooldown = 0;
function submitAddCategory() {
  if (timeCategoryCooldown + 1000 < Date.now()) {
    timeCategoryCooldown = Date.now();
    closeWindow("addCategory");
    addCategory(document.getElementById("input_categoryname").value, 
      document.getElementById("iconChoose").innerHTML, 
      document.getElementById("categoryChooseColor").value);
    addCategoryButton(types.length - 1);
  }
}
function toggleWindow(name) {
  if (document.getElementById("window_" + name).dataset['open'] == "1") {
    closeWindow(name);
  } else {
    openWindow(name);
  }
}
function addCategory(name, icon, color) {
  types.push({name: name, icon: icon, color: color, texts: []});
  localStorage["tt_types"] = JSON.stringify(types);
}
function addCategoryButton(id) {
  var element = document.createElement("DIV");
  element.className = "activityButton";
  element.dataset["big"] = "0";
  var text;
  if (id != -1) {
    var category = types[id];
    element.setAttribute("ontouchstart", "selectCategory(" + id + ")");
    element.setAttribute("onmousedown", "selectCategory(" + id + ")");
    text = '<div class="activityDisc" style="background-color: ' + category.color + 'aa;"> <span class="material-icons">' + category.icon + '</span> </div>';
  } else {
    element.setAttribute("ontouchstart", "addCategoryUI()");
    element.setAttribute("onmousedown", "addCategoryUI()");
    element.setAttribute("id", "addCategoryButton")
    text = '<div class="activityDisc" style="background-color: var(--c1);"><span class="material-icons">add</span></div>'
  }
  element.innerHTML = text;
  documentElements.categorySlider.appendChild(element);
  if (document.getElementById("addCategoryButton") != null) {
    documentElements.categorySlider.appendChild(document.getElementById("addCategoryButton"));
  }
  documentElements["category" + id] = element;
} 
var iconUpdateCooldown = Date.now();
var iconSearch = "";
setInterval(checkIconListScroll, 250);
function checkIconListScroll() {
  var winScroll = documentElements["iconList"].scrollTop || documentElements["iconList"].scrollTop;
  var height = documentElements["iconList"].scrollHeight - documentElements["iconList"].clientHeight;
  var scrolled = (winScroll / height) * 100;
  if (scrolled > 90 && iconUpdateCooldown + 500 < Date.now()) {
    iconUpdateCooldown = Date.now();
    refreshIconList(iconSearch, documentElements.iconList.childElementCount, 100);
  }
}

function refreshIconList(searchCondition, start, icons) {
  var filterArray = [...iconArray];
  if (searchCondition != "") filterArray = filterArray.filter(word => word.includes(searchCondition));
  for (let dli = start; dli < icons + start; dli++) {
    var elem = filterArray[dli];
    if (dli >= filterArray.length) return;
    var elm = document.createElement("A");
    elm.className = "iconListIcon material-icons";
    elm.setAttribute("onclick", "selectIcon(this)");
    elm.innerHTML = elem;
    documentElements.iconList.appendChild(elm);
  }
}
function selectIcon(elm) {
  closeAllWindows();
  document.getElementById("iconChoose").innerHTML = elm.innerHTML;
}
function clearIconList() {
  removeAllChildNodes(documentElements.iconList);
}
function searchIcons(elm) {
  clearIconList();
  iconSearch = elm.value;
  refreshIconList(iconSearch, documentElements.iconList.childElementCount, 100);
}

function refreshTimeButtons() {
  var id = 0;
  removeAllChildNodes(documentElements.categorySlider);
  types.forEach(tof => {
    addCategoryButton(id);
    id++;
  });
  addCategoryButton(-1);
}
function createTimeButton() {
  
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log("PROMPTTTT");
  e.prompt();
});









;(function (){

  class Keyboard {
    constructor () {
      this.screenWidth = screen.width        // detect orientation
      this.windowHeight = window.innerHeight // detect keyboard change
      this.listeners = {
        resize: []
      , keyboardchange: []
      , focuschange: []
      }

      this.isTouchScreen = 'ontouchstart' in document.documentElement

      this.focusElement = null
      this.changeFocusTime = new Date().getTime()
      this.focusDelay = 1000 // at least 600 ms is required

      let focuschange = this.focuschange.bind(this)
      document.addEventListener("focus", focuschange, true)
      document.addEventListener("blur", focuschange, true)

      window.onresize = this.resizeWindow.bind(this)
    }

    focuschange(event) {
      let target = event.target
      let elementType = null
      let checkType = false
      let checkEnabled = false
      let checkEditable = true

      if (event.type === "focus") {
        elementType = target.nodeName
        this.focusElement = target

        switch (elementType) {
          case "INPUT":
            checkType = true
          case "TEXTAREA":
            checkEditable = false
            checkEnabled = true
          break
        }

        if (checkType) {
          let type = target.type
          switch (type) {
            case "color":
            case "checkbox":
            case "radio":
            case "date":
            case "file":
            case "month":
            case "time":
              this.focusElement = null
              checkEnabled = false
            default:
              elementType += "[type=" + type +"]"
          }
        }

        if (checkEnabled) {
          if (target.disabled) {
            elementType += " (disabled)"
            this.focusElement = null
          }
        }

        if (checkEditable) {
          if (!target.contentEditable) {
            elementType = null
            this.focusElement = null
          }
        }
      } else {
        this.focusElement = null
      }

      this.changeFocusTime = new Date().getTime()

      this.listeners.focuschange.forEach(listener => {
        listener(this.focusElement, elementType)
      })
    }

    resizeWindow() {
      let screenWidth = screen.width;
      let windowHeight = window.innerHeight
      let dimensions = {
        width: innerWidth
      , height: windowHeight
      }
      let orientation = (screenWidth > screen.height)
                      ? "landscape"
                      : "portrait"

      let focusAge = new Date().getTime() - this.changeFocusTime
      let closed = !this.focusElement
                && (focusAge < this.focusDelay)            
                && (this.windowHeight < windowHeight)
      let opened = this.focusElement 
                && (focusAge < this.focusDelay)
                && (this.windowHeight > windowHeight)

      if ((this.screenWidth === screenWidth) && this.isTouchScreen) {
        // No change of orientation

        // opened or closed can only be true if height has changed.
        // 
        // Edge case
        // * Will give a false positive for keyboard change.
        // * The user has a tablet computer with both screen and
        //   keyboard, and has just clicked into or out of an
        //   editable area, and also changed the window height in
        //   the appropriate direction, all with the mouse.

        if (opened) {
          this.keyboardchange("shown", dimensions)
        } else if (closed) {
          this.keyboardchange("hidden", dimensions)
        } else {
          // Assume this is a desktop touchscreen computer with
          // resizable windows
          this.resize(dimensions, orientation)
        }

      } else {
        // Orientation has changed
        this.resize(dimensions, orientation)
      }

      this.windowHeight = windowHeight
      this.screenWidth = screenWidth
    }

    keyboardchange(change, dimensions) {
      this.listeners.keyboardchange.forEach(listener => {
        listener(change, dimensions)
      })
    }

    resize(dimensions, orientation) {
      this.listeners.resize.forEach(listener => {
        listener(dimensions, orientation)
      })
    }

    addEventListener(eventName, listener) {
      // log("*addEventListener " + eventName)

      let listeners = this.listeners[eventName] || []
      if (listeners.indexOf(listener) < 0) {
        listeners.push(listener)
      }
    }

    removeEventListener(eventName, listener) {
      let listeners = this.listeners[eventName] || []
      let index = listeners.indexOf(listener)

      if (index < 0) {
      } else {       
        listeners.slice(index, 1)
      }
    }
  }

  window.keyboard = new Keyboard()

})()

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}