var fs = require('fs'),
    PEG = require('pegjs');

var parser = PEG.buildParser(fs.readFileSync('./lib/grammar.peg', 'utf8'));

var code = parser.toSource();

fs.writeFileSync('./node/WebIDLParser.js', 'exports.Parser = ' + code);
fs.writeFileSync('./web/WebIDLParser.js', 'window.WebIDLParser = ' + code);