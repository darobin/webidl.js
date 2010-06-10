
require.paths.unshift(__dirname + "/../node");
var sys = require("sys");

try {
    var parser = require("WebIDLParser").Parser;
    // sys.puts(
    //     sys.inspect(
    //         parser.parse(
    //             require("fs").readFileSync(__dirname + "/test.idl")
    //         ), false, null
    //     )
    // );
    sys.puts(
        sys.inspect(
            parser.parse("void doRobin (boolean testing, [Urgh] DOMString urgh);", "Operation"), false, null
        )
    );
}
catch (e) {
    sys.p(e);
}
