function init() {
    if (localStorage["shadle_unlimited"] == "1") {
        localStorage["shadle_unlimited"] = "0";
        document.getElementById("toggle").innerText = "Unlimited mode toggled OFF.";
    } else {
        localStorage["shadle_unlimited"] = "1";
        document.getElementById("toggle").innerText = "Unlimited mode toggled ON.";
    }
}