var sys = require("sys"),
    fs  = require("fs"),
    wid = require(__dirname + "/../node/WebIDLParser").Parser,
    peg = require(__dirname + "/../lib/peg").PEG;

var specific = process.argv[2];
if (specific) {
    toJSON(specific);
}
else {
    doAll();
}

function doAll () {
    ["dom", "esidl"].forEach(function (targ) {
        var idls = fs.readdirSync(__dirname + "/" + targ)
                     .filter(function (it) { return /\.idl$/.test(it) })
                     .map(function (it) { return __dirname + "/" + targ + "/" + it; });
        idls.forEach(toJSON);
    });
}

function toJSON (idl) {
    var jsonPath = idl.replace(/\.idl$/, ".json");
    sys.puts("Working on " + jsonPath);
    try {
        var st = fs.statSync(jsonPath);
        if (st.isFile()) {
            sys.puts("Skipping '" + idl + "', JSON exists.");
        }
    }
    catch (e) {}
    try {
        var ast = wid.parse(fs.readFileSync(idl));
        var str = "\n\n// ---- TEST NOT REVIEWED ----- \n\n" + JSON.stringify(ast, null, "  ");
        fs.writeFileSync(jsonPath, str);
    }
    catch (e) {
        sys.puts("ERROR parsing '" + idl + "': " + e + "\nline: " + e.line + ":" + e.column);
    }
}

