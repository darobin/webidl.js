
require.paths.unshift(__dirname + "/../lib");
var sys = require("sys");

try {
    var parser = require("generator").parser;
    sys.puts(
        sys.inspect(
            parser.parse(
                parser.killComments(
                    require("fs").readFileSync(__dirname + "/test.idl")
                )
            ), false, null
        )
    );
}
catch (e) {
    sys.p(e);
}
