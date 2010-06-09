
var sys = require("sys"),
    fs  = require("fs"),
    peg = require("./peg").PEG;

var grammar = fs.readFileSync("grammar.peg");
var parser = peg.buildParser(grammar);
exports.parser = parser;
