
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
} 
var types = [];
var history = [];
var documentElements = {};
var pickedCategory = 0;
var cooldownWindowClose = 0;

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
}
function initDocElms() {
  documentElements["categorySlider"] = document.getElementById("activitySlider");
  documentElements["windowParent"] = document.getElementById("windowsParent");
}
function initLocalStorage() {
  if (localStorage["tt_types"] == undefined) {
    addCategory("Work", "work", "#5874b0;");
    addCategory("Education", "school", "#71c1c9");
    addCategory("Fitness", "fitness_center", "#ee8787");
    addCategory("Meditation", "self_improvement", "#e9afa3");
    addCategory("Procrastination", "remove", "#969696");
    addCategory("Sleep", "hotel", "#c48ddd");
    addCategory("Entertainment", "sports_esports", "#5dc365");
    localStorage["tt_types"] = JSON.stringify(types);
  } else {
    types = JSON.parse(localStorage["tt_types"]);
  }
}
function selectCategory(id) {
  console.log(id);
  for (let elmI = 0; elmI < types.length; elmI++) {
    if (elmI == id) {
      documentElements["category" + elmI].dataset["selected"] = "1";
    } else {
      documentElements["category" + elmI].dataset["selected"] = "0";
    }
  }
}
function addCategoryUI() {
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
  var opens = {};
  if (cooldownWindowClose + 500 < Date.now())  {
    var windows = document.getElementsByClassName("window");
    for(var i = 0; i < windows.length; i++) {
      windows[i].dataset["open"] = "0";
    }
    document.getElementById("windowBackground").dataset["active"] = "0";
  }
}
function openIconChoose() {

}
function submitAddCategory() {
  closeWindow("addCategory");
  openWindow("chooseIcon");
}
function toggleWindow(name) {
  if (document.getElementById("window_" + name).dataset['open'] == "1") {
    closeWindow(name);
  } else {
    openWindow(name);
  }
}
function addCategory(name, icon, color) {
  types.push({name: name, icon: icon, color: color});
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
    text = '<div class="activityDisc" style="background-color: var(--c1);"><span class="material-icons">add</span></div>'
  }
  element.innerHTML = text;
  documentElements.categorySlider.appendChild(element);
  documentElements["category" + id] = element;
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