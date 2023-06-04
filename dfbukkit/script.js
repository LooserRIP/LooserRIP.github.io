function test() {
    const templateList = [];
    let splitinput = document.getElementById("w3review").value.split("\n");
    splitinput.forEach(elm => {templateList.push(elm.substring(49));});
    templateList.splice(templateList.length - 1, 1);
    templateList.splice(0, 1);
    let finalStrings = [];
    templateList.forEach(templateCode => {
        let finalString = "";
        var strData     = atob(templateCode);
        var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
        var binData     = new Uint8Array(charData);
        var data        = pako.inflate(binData);
        var strData     = String.fromCharCode.apply(null, new Uint16Array(data));
        let jsonData = JSON.parse(strData);
        console.log(jsonData.blocks);
        let i = 0;
        for (const block of jsonData.blocks) {
            if (block.id == "block") {
                console.log(block.block, block.action, block.id);
                if (i == 0) {
                    let dataname = "";
                    if (block.data != undefined) {
                        dataname = block.data
                    } else {
                        dataname = formatString(block.action.replace("_", " "));
                    }
                    let nameOfEvent = titleCase(block.block.replace("_", " ")).replace(" ", "");
                    if (nameOfEvent == "Event") nameOfEvent = "PlayerEvent";
                    if (nameOfEvent == "Process") nameOfEvent = "AsyncFunction";
                    finalString = finalString + nameOfEvent + "." + dataname.replace(" ", "") + " {"
                }
                if (i > 0) {
                    let nameOfBlock = titleCase(block.block.replace("_", " ")).replace(" ", "");
                    let nameOfAction = titleCase(block.action.replace("_", " ")).replace(" ", "");
                    finalString = finalString + nameOfBlock + "." + nameOfAction;
                    if (i != jsonData.blocks.length - 1) {
                        finalString = finalString + ", "
                    }
                }
            } else if (block.id == "bracket") {

            }
            i++;
        }
        finalStrings.push(finalString);
        console.warn(finalString);
    })
    console.log(finalStrings.join("\n"));
}

function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }

  function formatString(input) {
    const regex = /([a-z])([A-Z])/g;
    let result = input.replace(regex, '\$1 \$2');
    return result;
  }
  
  