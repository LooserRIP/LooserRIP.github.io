
var bgthemes = {
  
  fireflies: {
    "particles":{
      "number":{
        "value":250
      },
      "color":{
        "value":"$SECONDARYCOLOR$"
      },
      "shape":{
        "type":"circle",
        "stroke":{
          "width":0,
          "color":"$SECONDARYCOLOR$"
        },
        "image":{
          "src":"http://www.iconsdb.com/icons/preview/white/contacts-xxl.png"
        }
      },
      "opacity":{
        "value":1,
        "random":true,
        "anim":{
          "enable":true,
          "speed":0.2
        }
      },
      "size":{
        "value": 5,
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
        "speed":1,
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
  },
  bubbles: {
    "particles":{
      "number":{
        "value":250
      },
      "color":{
        "value":"$SECONDARYCOLOR$"
      },
      "shape":{
        "type":"circle",
        "stroke":{
          "width":0,
          "color":"$SECONDARYCOLOR$"
        },
        "image":{
          "src":"http://www.iconsdb.com/icons/preview/white/contacts-xxl.png"
        }
      },
      "opacity":{
        "value":1,
        "random":true,
        "anim":{
          "enable":false
        }
      },
      "size":{
        "value": 7.8,
        "random":true,
        "anim":{
          "enable": false,
          "size_min": 2,
          "speed":30
        }
      },
      "line_linked":{
        "enable": false
      },
      "move":{
        "enable":true,
        "speed":0.5,
        "direction":"top",
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
  },
  web: {
    "particles":{
      "number":{
        "value":150
      },
      "color":{
        "value":"0"
      },
      "shape":{
        "type":"circle",
        "stroke":{
          "width":0,
          "color":"0"
        },
        "image":{
          "src":"http://www.iconsdb.com/icons/preview/white/contacts-xxl.png"
        }
      },
      "opacity":{
        "value":1,
        "random":true,
        "anim":{
          "enable":true,
          "speed":0.2
        }
      },
      "size":{
        "value": 0,
        "random":false,
        "anim":{
          "enable": false,
          "speed":30
        }
      },
      "line_linked":{
        "enable": true,
        "distance": 120,
        "color":"$SECONDARYCOLOR$",
        "width":1
      },
      "move":{
        "enable":true,
        "speed":1,
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
  },
  squares: {
    "particles":{
      "number":{
        "value":50
      },
      "color":{
        "value":"$PRIMARYCOLOR$"
      },
      "shape":{
        "type":"square",
        "stroke":{
          "width":2,
          "color":"$SECONDARYCOLOR$"
        },
        "image":{
          "src":"http://www.iconsdb.com/icons/preview/white/contacts-xxl.png"
        }
      },
      "opacity":{
        "value":0,
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
        "speed":1,
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
  },
  
}

var appearances = {
  default: {  
    text: "#FFFFFF",
    bg_primary: "#131313",
    bg_secondary: "#202020",
  warmup: "#e89600",
  warmup_glow: "#ffc25944",
  timer_done: "#FFFFFF",
  timer_ready: "#38FF4B",
  timer_prepare: "#FFE668",
  timer_glow_done: "#FFFFFF25",
  timer_glow_ready: "#6AFF827F",
  timer_glow_prepare: "#F4FF6C44",
    bg_theme: "squares",
    scrollbar: "#FFFFFF80",
    scrollbarbg: "#0000001E",
    scrollbaractive: "#B3B3B37A",
    basic_bg: "#9797973D",
    basic_wp: "#A0A0A02D",
    element_bg: "#FFFFFF49",
    element_border: "#A5FFF349",
    element_axis: "#C2FFA549",
    element_center: "#C2FFA580",
    block_ns: "#0000006B",
    block_nsh: "#111F356B",
    block_s: "#0034856B",
    block_sh: "#0049B78B",
    uib_ns: "#51595B6b",
    uib_nsh: "#6770726b",
    uib_s: "#004DC16b",
    uib_sh: "#1E68D86b",
    ui_glow: "#56ff3f68",
    ui_off: "#7f7f7f99",
    ui_on: "#19dc00C1",
    ui_bg: "#20202080",
    uii_wp: "#38383870",
    uii_bg: "#38383870",
    uii_off: "#FFFFFF",
    uii_on: "#52CF71"
  },
  nightly: {
    text: "#ffffff",
    bg_primary: "#110021",
    bg_secondary: "#240082",
  warmup: "#e89600",
  warmup_glow: "#ffc25944",
  timer_done: "#FFFFFF",
  timer_ready: "#38FF4B",
  timer_prepare: "#FFE668",
  timer_glow_done: "#FFFFFF25",
  timer_glow_ready: "#6AFF827F",
  timer_glow_prepare: "#F4FF6C44",
    bg_theme: "fireflies",
    scrollbar: "#262489",
    scrollbarbg: "#0000001E",
    scrollbaractive: "#201f75",
    basic_bg: "#1A186B",
    basic_wp: "#212071",
    element_bg: "#0f0e3d75",
    element_border: "#0e363d75",
    element_axis: "#1b3d0e75",
    element_center: "#1b3d0eab",
    block_ns: "#ffcb8d2b",
    block_nsh: "#ffc47d5c",
    block_s: "#ffb86c99",
    block_sh: "#ffa13dc9",
    uib_ns: "#ffcb8d2b",
    uib_nsh: "#ffc47d5c",
    uib_s: "#ffb86c99",
    uib_sh: "#ffa13dc9",
    ui_glow: "#63ff3f68",
    ui_off: "#ff5f5fd1",
    ui_on: "#20ff7ac1",
    ui_bg: "#28282880",
    uii_glow: "#c8ff3f17",
    uii_wp: "#111111",
    uii_bg: "#202020",
    uii_off: "#ff7b7b",
    uii_on: "#77ff52"
  },
  light: {
    
  text: "#000000",
  warmup: "#e89600",
  warmup_glow: "#ffc25944",
  bg_primary: "#d4d4d4",
  bg_secondary: "#808080",
  bg_theme: "web",
  timer_done:  "#101010",
  timer_ready: "#03dc00",
  timer_prepare: "#ffd500",
  
  timer_glow_done: "#d4d4d4",
  timer_glow_ready: "#00ff297f",
  timer_glow_prepare: "#ecff0044",
  
  scrollbar: "#FFFFFF80",
  scrollbarbg: "#0000001E",
  scrollbaractive: "#B3B3B37A",
  
  basic_bg: "#a9a9a9",
  basic_wp: "#bcbcbc",
  
  element_bg: "#d0d0d07d",
  element_border: "#A5FFF349",
  element_axis: "#C2FFA549",
  element_center: "#C2FFA580",
  
  block_ns: "#8080806b",
  block_nsh: "#34484a6b",
  block_s: "#0072d46b",
  block_sh: "#1d77ff8b",
  
  
  uib_ns: "#8080806b",
  uib_nsh: "#34484a6b",
  uib_s: "#0072d46b",
  uib_sh: "#1d77ff8b",
  
  ui_glow: "#3ffff668",
  ui_off: "#4b4b4b",
  ui_on: "#00dcffc1",
  ui_bg: "#c2c2c280",

  uii_glow: "#3fe4ff20",
  uii_bg: "#a5a5a570",
  uii_wp: "#a1a1a1",
  uii_off: "#FFFFFF",
  uii_on: "#0095ff"
  }
};