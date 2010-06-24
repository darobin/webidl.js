
require.paths.unshift(__dirname + "/../node");
require.paths.unshift(__dirname + "/../common");
var sys = require("sys"),
    fs  = require("fs");

// try {
//     var parser = require("WICDAParser").Parser;
//     sys.puts(
//         sys.inspect(
//             parser.parse("/module:Cryptids/interface:Dahut/operation:graze(float,DOMString)/argument:volume"), false, null
//         )
//     );
// }
// catch (e) {
//     sys.p(e);
// }

try {
    var wicda = require("WICDA").WICDA;
    var sheet = JSON.parse(fs.readFileSync(__dirname + "/wicdaction.json"));
    var res = wicda.applySheet(sheet, fs.readFileSync(__dirname + "/wicda.idl"));
    sys.puts(sys.inspect(res, false, null));
}
catch (e) {
    sys.p(e);
}
