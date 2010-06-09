
var sys = require("sys"),
    fs  = require("fs"),
    peg = require("./peg").PEG;

var grammar = fs.readFileSync(__dirname + "/grammar.peg");
var parser = peg.buildParser(grammar);
exports.parser = parser;
parser.killComments = function (str) {
    return str.replace(/\/\/.*$/gm, "")
              .replace(/\/\*[\s\S]*?\*\//g, "");
};
