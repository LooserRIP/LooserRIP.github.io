
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
} 

function init() {
  initLocalStorage();
  refreshTimeButtons();
}
function initLocalStorage() {
  if (localStorage["tt_types"] == undefined) localStorage["tt_types"] = JSON.stringify(["School", "Work", "Sleep"]);

}

function refreshTimeButtons() {
  let types = JSON.parse(localStorage.tt_types);

}
function createTimeButton() {
  
}



let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log("PROMPTTTT");
  e.prompt();
});

