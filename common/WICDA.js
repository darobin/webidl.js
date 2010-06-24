
// This is designed to work both with Node.js and on the Web
// on the Web it is expected that WebIDLParser and WICDAParser have already been loaded

(function () {
    var isNode = (typeof exports !== "undefined") && (typeof __dirname !== "undefined");
    var widlp, wicdp;
    if (isNode) {
        widlp = require("WebIDLParser").Parser;
        wicdp = require("WICDAParser").Parser;
    }
    else {
        widlp = WebIDLParser;
        wicdp = WICDAParser;
    }
    
    var WICDA = {
        applySheet: function (sheet, webidl) {
            if (typeof webidl === "string") {
                webidl = widlp.parse(webidl);
            }
            if (!sheet.actions) return webidl;
            for (var i = 0, n = sheet.actions.length; i < n; i++) {
                var act = sheet.actions[i];
                if (!act.action) continue;
                if (act.action === "addExtAttr") WICDA.addExtAttr(webidl, act.path, act.value);
            }
            return webidl;
        },
        addExtAttr:    function (webidl, path, value) {
            var item = WICDA.resolve(webidl, path);
            if (!item) return;
            if (!item.extAttrs) return;
            try {
                var ea = widlp.parse(value, "extendedAttributeList");
                for (var i = 0, n = ea.length; i < n; i++) item.extAttrs.push(ea[i]);
            }
            catch (e) { return; }
        },
        resolve:    function (webidl, path) {
            var steps;
            try {
                steps = wicdp.parse(path);
            }
            catch (e) { return; }
            if (steps.length === 0) return;
            var ctx = { type: "module", name: "", definitions: webidl };
            while (true) {
                if (steps.length === 0) return ctx;
                var step = steps.shift();
                var type = step.step;
                switch (type) {
                    case "module":
                    case "interface":
                    case "exception":
                        if (ctx.type !== "module") return;
                        var ret = WICDA._typeName(ctx.definitions, type, step.name);
                        if (ret) ctx = ret;
                        else return;
                        break;
                    case "typedef":
                        if (ctx.type !== "module") return;
                        return WICDA._typeName(ctx.definitions, type, step.name);
                        break;
                    case "implements":
                        if (ctx.type !== "module") return;
                        for (var i = 0, n = ctx.definitions.length; i < n; i++) {
                            var imp = ctx.definitions[i];
                            if (imp.type == "implements" && imp.target == step.target && imp.source == step.source) return imp;
                        }
                        return;
                        break;
                    case "constant":
                        if (ctx.type !== "interface" && ctx.type !== "exception") return;
                        return WICDA._typeName(ctx.members, type, step.name);
                        break;
                    case "attribute":
                        if (ctx.type !== "interface") return;
                        return WICDA._typeName(ctx.members, type, step.name);
                        break;
                    case "field":
                        if (ctx.type !== "exception") return;
                        return WICDA._typeName(ctx.members, type, step.name);
                        break;
                    case "argument":
                        if (ctx.type !== "operation") return;
                        if (!ctx.arguments) return;
                        for (var i = 0, n = ctx.arguments.length; i < n; i++) {
                            var arg = ctx.arguments[i];
                            if (arg.name == step.name) return arg;
                        }
                        return;
                        break;
                    case "operation":
                        if (ctx.type !== "interface") return;
                        for (var i = 0, n = ctx.members.length; i < n; i++) {
                            var op = ctx.members[i];
                            if (op.type == "operation" && op.name == step.name && op.arguments.length == step.arguments.length) {
                                for (var j = 0, m = op.arguments.length; j < m; j++) {
                                    if (op.arguments[j].type.idlType != step.arguments[j]) return;
                                }
                                return op;
                            }
                        }
                        return;
                        break;
                    default:
                        return;
                }
            }
        },
        _typeName:    function (list, type, name) {
            for (var i = 0, n = list.length; i < n; i++) {
                var item = list[i];
                if (item.type == type && item.name == name) return item;
            }
            return;
        }
    };
    
    if (isNode) exports.WICDA = WICDA;
    else        window.WICDA  = WICDA;
    
    
})();
