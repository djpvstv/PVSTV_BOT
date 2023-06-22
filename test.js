// I guess to build this, try "node-gyp configure"
// then "node-gyp build"

// lol, need to use  node-gyp rebuild --target=24.0.0 --dist-url=https://electronjs.org/headers

console.log("start!");
// const addon = require('./build/Release/v8engine');
// const addon = require('bindings')('v8engine');
const eng = require('./build/Release/v8engine');


const filesToParse = ["C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T165747.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T170137.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T170438.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T170806.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T170906.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T171211.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T171511.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T171631.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T171925.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T173440.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T173741.slp"];
const filesToParse2 = [
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T173756.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T173930.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T174108.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T174226.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T174526.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T174719.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T175711.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T175902.slp",
"C:\\Users\\garre\\Documents\\Slippi\\Lag\\replays\\Game_20210724T180119.slp"];


eng.simpleParse(filesToParse);
eng.simpleParse(filesToParse2);

console.log(eng.simplePrint());

eng.comboParse(filesToParse, "LAG#318");
eng.comboParse(filesToParse2, "LAG#318");

console.log(eng.comboPrint());