
// All that this module does is load the PEG.js dependencies which should be
// living in ../depends/pegjs and compiles them here to integrate them into
// the CommonJS world

var sys = require("sys"),
    fs  = require("fs"),
    Sc  = process.binding("evals").Script;
var pegPath = __dirname + "/../depends/pegjs/lib/";
var pegs = ["compiler.js", "metagrammar.js"];

for (var i = 0, n = pegs.length; i < n; i++) {
    var peg = pegs[i];
    Sc.runInThisContext(fs.readFileSync(pegPath + peg), __filename + "/" + peg);
}

exports.PEG = PEG;
