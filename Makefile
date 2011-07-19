parsers: node/WebIDLParser.js web/WebIDLParser.js

node/WebIDLParser.js: lib/grammar.peg
	pegjs < lib/grammar.peg | sed -e 's/module.exports =/exports.Parser =/' > node/WebIDLParser.js

web/WebIDLParser.js: lib/grammar.peg
	pegjs < lib/grammar.peg | sed -e 's/module.exports =/window.WebIDLParser =/' > web/WebIDLParser.js

