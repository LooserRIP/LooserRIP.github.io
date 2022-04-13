let database;
async function init() {
  database = await fetch("https://wakeful-enchanted-theory.glitch.me/database");
  database = await database.json();
  document.getElementById("totalusers").innerText = "Total Users: " + database.users.length;
  var keys = Object.keys(database.attempts);
  var attemptVals = 0;
  var attemptAmt = 0;
  for(var ik = 0; ik < keys.length; ik++) {
    var kd = database.attempts[keys[ik]];
    for(var iv = 0; iv < kd.v.length; iv++) {
      attemptAmt++;
      attemptVals += kd.v[iv];
    }
  }
  document.getElementById("averageattempts").innerText = "Average Attempts: " + attemptVals / attemptAmt;
  var keys = Object.keys(database.beats);
  var beatsVals = 0;
  var beatsAmt = 0;
  for(var ik = 0; ik < keys.length; ik++) {
    var kd = database.beats[keys[ik]];
    for(var iv = 0; iv < kd.v.length; iv++) {
      beatsAmt++;
      beatsVals += kd.v[iv];
    }
  }
  document.getElementById("beatpercentage").innerText = "Beat Percentage: " + Math.floor(beatsVals / beatsAmt * 100) + "%";
}