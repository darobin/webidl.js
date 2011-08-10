var sys = require("sys"),
    fs  = require("fs"),
    wid = require(__dirname + "/../node/WebIDLParser").Parser,
    _ = require("./underscore")._,
    peg = require(__dirname + "/../lib/peg").PEG;

var specific = process.argv[2];
if (specific) {
    testOne(specific);
}
else {
    testAll();
}

function testAll () {
    ["dom", "esidl"].forEach(function (targ) {
        var idls = fs.readdirSync(__dirname + "/" + targ)
                     .filter(function (it) { return /\.idl$/.test(it) })
                     .map(function (it) { return __dirname + "/" + targ + "/" + it; });
        idls.forEach(testOne);
    });
}

function testOne (idl) {
    sys.puts("Testing  " + idl);
    var jsonPath = idl.replace(/\.idl$/, ".json");
    var ref;
    try {
        ref = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    }
    catch (e) {
        sys.puts("Could not parse reference, skipping: " + jsonPath);
        return;
    }
    try {
        var ast = wid.parse(fs.readFileSync(idl, 'utf-8'));
        if (_.isEqual(ast, ref)) {
            sys.puts("[OK]");
        } else {
            sys.puts("### NOT OK ###");
            fs.writeFileSync(jsonPath + '.fail', JSON.stringify(ast, null, "  "));
        }
    }
    catch (e) {
        sys.puts("ERROR parsing '" + idl + "': " + e + "\nline: " + e.line + ":" + e.column);
    }
}

