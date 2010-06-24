
var sys = require("sys"),
    fs  = require("fs"),
    peg = require(__dirname + "/../lib/peg").PEG;

generate(__dirname + "/../lib/grammar.peg",
         __dirname + "/../node/WebIDLParser.js",
         __dirname + "/../web/WebIDLParser.js",
         "exports.Parser = ",
         "window.WebIDLParser = ",
         function (source) {
             return source.replace("var result = {", "var result = {\n    killComments: function (str) {\n" +
                                                                       "      return str.replace(/\\/\\/.*$/gm, '')\n" +
                                                                       "                .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');\n" +
                                                                       "    },\n")
                           .replace("parse: function(input) {", "parse: function(input, start) {\n" +
                                                                "      input = this.killComments(input);\n" +
                                                                "      if (!start) start = 'definitions';\n" +
                                                                "      var funcs = {};\n");
         }
);

generate(__dirname + "/../lib/wicda.peg",
         __dirname + "/../node/WICDAParser.js",
         __dirname + "/../web/WICDAParser.js",
         "exports.Parser = ",
         "window.WICDAParser = ",
         function (source) { return source;}
);

function generate (grammarFile, outNode, outWeb, pfxNode, pfxWeb, preproc) {
    var grammar = fs.readFileSync(grammarFile);
    var parser = peg.buildParser(grammar);
    var source = parser.toSource();

    // we brute-force modify the source, it would be nice if there were a more elegant way in PEG
    source = preproc(source)
                    .replace("parse: function(input) {", "parse: function(input, start) {\n      var funcs = {};\n")
                    .replace(/function parse_(\w+)\(context\)/g, "var parse_$1 = funcs['$1'] = function parse_$1(context)")
                    .replace("var result = parse_definitions", "var result = funcs[start]");

    var webSrc = pfxWeb + source + ";\n",
        nodeSrc = pfxNode + source + ";\n";

    fs.writeFileSync(outWeb, webSrc);
    fs.writeFileSync(outNode, nodeSrc);
}

