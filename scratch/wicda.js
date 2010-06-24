
require.paths.unshift(__dirname + "/../node");
var sys = require("sys");

try {
    sys.puts("starting");
    var parser = require("WICDAParser").Parser;
    sys.puts("starting");
    sys.puts(
        sys.inspect(
            parser.parse("/module:Cryptids/interface:Dahut/operation:graze(float,DOMString)/argument:volume"), false, null
        )
    );
}
catch (e) {
    sys.p(e);
}
