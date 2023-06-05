let actiondump;
function init() {
    fetch("https://raw.githubusercontent.com/LooserRIP/LooserRIP.github.io/master/dfbukkit/action_dump.json")
    .then(res => res.json())
    .then(data => actiondump = data)
}

function findAction(actionname) {
    if (actiondump == undefined) return 0;
    let findID = 0;
    let findVal = 0;
    let idRun = 0;
    for (const runthrough of actiondump.actions) {
        let jarodist = jaroWinkler(runthrough.name.toLowerCase(), actionname.toLowerCase());
        if (jarodist >= findVal) {
            findVal = jarodist;
            findID = idRun;
        }
        idRun++;
    }
    return findID;
}

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
        let i = 0;
        let spacesCount = 0;
        for (const block of jsonData.blocks) {
            if (block.id == "block") {
                if (i == 0) {
                    let dataname = "";
                    if (block.data != undefined) {
                        dataname = block.data
                    } else {
                        dataname = block.action.replace("_", " ");
                    }
                    let nameOfEvent = titleCase(block.block.replace("_", " ")).replace(" ", "");
                    if (nameOfEvent == "Event") nameOfEvent = "PlayerEvent";
                    if (nameOfEvent == "Process") nameOfEvent = "AsyncFunction";
                    finalString = finalString + nameOfEvent + "." + dataname.replace(" ", "-") + " {\n"
                    spacesCount++;
                }
                if (i > 0) {
                    console.log(block);
                    let nameOfBlock = titleCase(block.block.replace("_", " ")).replace(" ", "");
                    let nameOfAction = block.action;
                    if (spacesCount > 0) {
                        finalString += " ".repeat(spacesCount * 4);
                    }
                    finalString = finalString + nameOfBlock + "." + nameOfAction + "(";
                    args = [];
                    sortedArguments = block.args.items.filter(obj => obj.item.id != "bl_tag");
                    sortedTags = block.args.items.filter(obj => obj.item.id == "bl_tag");
                    var slotIndex = 0;
                    if (block.target != undefined) {
                        args.push("Target: " + block.target);
                    }
                    for (const argument of actiondump.actions[findAction(nameOfAction)].icon.arguments) {
                        let params = [];
                        let found = 0;
                        if (argument.plural) {
                            for (let lpi = slotIndex; lpi < sortedArguments.length; lpi++) {
                                params.push(formatParameter(sortedArguments[slotIndex]))
                            }
                        } else {
                            found = sortedArguments.find(obj => obj.slot === slotIndex);
                            if (found != undefined) params.push(formatParameter(found))
                        }
                        if (found != undefined) args.push(removeAmpersand(argument.description.join(" ")) + ": " + params.join(", "));
                        slotIndex += 1;
                    }
                    for (const addTagParam of sortedTags) {
                        args.push(addTagParam.item.data.tag + ": " + addTagParam.item.data.option);
                    }
                    finalString += args.join(", ")
                    finalString = finalString + ")";
                    if (!(i != jsonData.blocks.length - 1 && jsonData.blocks[i + 1].id == "bracket")) {
                        finalString = finalString + ";\n"
                    } else {
                        finalString = finalString + " ";
                    }
                }
            } else if (block.id == "bracket") {
                if (block.direct == "open") {
                    //finalString += " ".repeat(spacesCount * 4);
                    finalString = finalString += "{\n"
                    spacesCount++;
                }
                if (block.direct == "close") {
                    spacesCount--;
                    finalString = finalString + "\n";
                    finalString += " ".repeat(spacesCount * 4);
                    finalString = finalString + "}\n"
                }
            }
            i++;
        }
        finalString = finalString + "}";
        finalStrings.push(finalString);
    })
    finishedString = finalStrings.join("\n")
    console.log(finishedString);
}
function formatParameter(input) {
    input = input.item;
    if (input.id == "var") {
        return "var(" + input.data.name + ", " + input.data.scope + ")";
    }
    if (input.id == "num") {
        return input.data.name;
    }
    if (input.id == "txt") {
        return "'" + input.data.name + "'";
    }
    if (input.id == "item") {
        return "itemnbt(" + input.data.item + ")";
    }
}
function removeAmpersand(str) {
    return str.replace(/&\w/g, '');
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