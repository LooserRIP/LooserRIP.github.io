const tileWidth = 160;
const tileHeight = 90;
let deltaX = 0;
let deltaY = 0;
let currentlyPressing = {};

let previousStartX = -999;
let previousStartY = -999;
let previousEndX = -999;
let previousEndY = -999;
let offsetX = BigInt(0);
let offsetY = BigInt(0);
let historyTree = [];

function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false; 
  return num > 1;
}

function createOrRecycleTile(fx, fy) {
    let x = BigInt(fx) + offsetX;
    let y = BigInt(fy) + offsetY;
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.style.left = `${fx * tileWidth}px`;
  tile.style.top = `${fy * tileHeight}px`;
  let id = xyToID(x, -y);
  let urlid = base64Encode(id, 11);
  //if (isPrime(id)) tile.classList.add('red');
  const text = document.createElement("P");
  text.innerText = `X: ${x}, Y: ${-y}\nID: ${id}, \nURLID: ${urlid}`;
  text.innerText = urlid;
  tile.style.backgroundImage = `url(https://img.youtube.com/vi/${urlid}/default.jpg)`
  tile.appendChild(text);
  return tile;
}

function updateWorld() {
  const world = document.getElementById('world');
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const startX = Math.floor(deltaX / tileWidth) - 2;
  const endX = startX + Math.floor(viewportWidth / tileWidth) + 5;
  const startY = Math.floor(deltaY / tileHeight) - 2;
  const endY = startY + Math.floor(viewportHeight / tileHeight) + 5;
  world.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
    if (startX == previousStartX && startY == previousStartY && endX == previousEndX && endY == previousEndY) return;
    previousStartX = startX;
    previousStartY = startY;
    previousEndX = endX;
    previousEndY = endY;
  world.innerHTML = ''; // Clear existing tiles (for demo purposes; could be optimized)
  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      world.appendChild(createOrRecycleTile(x, y));
    }
  }

}

function handleKeyDown(event) {
    if (currentlyPressing[event.key] == undefined) currentlyPressing[event.key] = false;
    currentlyPressing[event.key] = true;
    if (event.key == 'r') {
        historyTree.push([offsetX, offsetY]);
        offsetX = BigInt(Math.round((Math.random() - 0.5) * 2 * 5000000000));
        offsetY = BigInt(Math.round((Math.random() - 0.5) * 2 * 5000000000));
        previousStartX = undefined;
        updateWorld();
    }
    if (event.key == 'z') {
        if (historyTree.length > 0) {
            let t = historyTree.pop();
            offsetX = t[0]
            offsetY = t[1];
            previousStartX = undefined;
            updateWorld();
        }
    }
    return;
    const stepSize = 25; // pixels
    switch (event.key) {
      case 'w': deltaY -= stepSize; break;
      case 'a': deltaX -= stepSize; break;
      case 's': deltaY += stepSize; break;
      case 'd': deltaX += stepSize; break;
    }
    updateWorld();
  }
function handleKeyUp(event) {
    if (currentlyPressing[event.key] == undefined) currentlyPressing[event.key] = false;
    currentlyPressing[event.key] = false;
    return;
    const stepSize = 25; // pixels
    switch (event.key) {
      case 'w': deltaY -= stepSize; break;
      case 'a': deltaX -= stepSize; break;
      case 's': deltaY += stepSize; break;
      case 'd': deltaX += stepSize; break;
    }
    updateWorld();
}

function keyLoop() {
    const stepSize = 15; // pixels
    const originalDeltaX = deltaX;
    const originalDeltaY = deltaY;
    if (currentlyPressing['w']) {
        deltaY -= stepSize;
    }
    if (currentlyPressing['a']) {
        deltaX -= stepSize;
    }
    if (currentlyPressing['s']) {
        deltaY += stepSize;
    }
    if (currentlyPressing['d']) {
        deltaX += stepSize;
    }
    if (originalDeltaX != deltaX || originalDeltaY != deltaY) { //moved
        updateWorld();
    }
}

function OnLoad() {
    console.log("Hello. I made this website to show how many possible video IDs there are - compared to how little videos there are.\n\nYou can browse in an infinite plane of non-repeating IDs, and you will most likely never ever find a video. And if you do, It'll as lucky as winning the lottery 4200 times in a row.")
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    setInterval(keyLoop, 10);
    updateWorld();
}
function removepopup() {
    document.getElementById("popup").dataset["remove"] = "1";
}
const abs = (n) => (n < 0n) ? -n : n;

function xyToID(x, y) {
    
    // The layer or "manhattan distance" to (0,0) from (x, y) is the sum
    // of the absolute values of x and y, this accounts for movement along the grid without diagonals.
    let Layer = abs(x) + abs(y)
    if (Layer == 0) return 0;

    let g = abs(y);
    let result = g;
    if (y >= 0n && x <= 0n) result = 2n*Layer - g;
    if (y <= 0n && x <= 0n) result = 2n*Layer + g;
    if (y < 0n && x >= 0n) result = 4n*Layer - g;
    
    //return BigInt(3532380743379303576n + y);
    return BigInt((BigInt(2)*(BigInt(Layer)-BigInt(1))*(BigInt(Layer))+BigInt(1)) + BigInt(result));
}


let stringtable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

// Function to encode a number into a custom base64 string
function base64Encode(number, minimumDigits = 0) {
    let encodedString = '';
    do {
        let remainder = BigInt(BigInt(number) % BigInt(64));
        encodedString = stringtable[remainder] + encodedString;
        number = BigInt(number) / BigInt(64);
    } while (number > 0);

    // Pad with the first character to meet the minimum digits requirement
    while (encodedString.length < minimumDigits) {
        encodedString = stringtable[0] + encodedString;
    }

    return encodedString;
}

// Function to decode a custom base64 string into a number
function base64Decode(str) {
    let decodedNumber = BigInt(0);
    for (let i = 0; i < str.length; i++) {
        let charIndex = stringtable.indexOf(str[i]);
        if (charIndex === -1) {
            throw new Error("Invalid character in the input string.");
        }
        decodedNumber = decodedNumber * BigInt(64) + BigInt(charIndex);
    }
    return decodedNumber;
}

function genRandomNumber(byteCount, radix) {
    return BigInt('0x' + crypto.randomBytes(byteCount).toString('hex')).toString(radix)
  }