
require.paths.unshift("../depends/jison/lib/");

var Generator = require("jison").Generator;

exports.grammar = {
    comment:    "Parser for WebIDL",
    author:     "Robin Berjon",
    
    lex:    {
        macros: {
            integer:    "-?0([0-7]*|[Xx][0-9A-Fa-f]+)|[1-9][0-9]*",
            float:      "-?([0-9]+\\.[0-9]*|[0-9]*\\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+",
            identifier: "[A-Z_a-z][0-9A-Z_a-z]*",
            string:     '"[^"]*"',
            whitespace: "[\\t\\n\\r ]+|[\\t\\n\\r ]*((//.*|/\\*.*?\\*/)[\\t\\n\\r ]*)+",
            other:      "[^\\t\\n\\r 0-9A-Z_a-z]",
        },
        rules:  [
            ["module\\b", "return 'MODULE'"],
            ["interface\\b", "return 'INTERFACE'"],
            ["exception\\b", "return 'EXCEPTION'"],
            ["typedef\\b", "return 'TYPEDEF'"],
            ["implements\\b", "return 'IMPLEMENTS'"],
            ["const\\b", "return 'CONST'"],
            ["true\\b", "return 'TRUE'"],
            ["false\\b", "return 'FALSE'"],
            ["stringifier\\b", "return 'STRINGIFIER'"],
            ["attribute\\b", "return 'ATTRIBUTE'"],
            ["readonly\\b", "return 'READONLY'"],
            ["getraises\\b", "return 'GETRAISES'"],
            ["setraises\\b", "return 'SETRAISES'"],
            ["omittable\\b", "return 'OMITTABLE'"],
            ["getter\\b", "return 'GETTER'"],
            ["setter\\b", "return 'SETTER'"],
            ["creator\\b", "return 'CREATOR'"],
            ["deleter\\b", "return 'DELETER'"],
            ["caller\\b", "return 'CALLER'"],
            ["raises\\b", "return 'RAISES'"],
            ["in\\b", "return 'IN'"],
            ["optional\\b", "return 'OPTIONAL'"],
            ["object\\b", "return 'OBJECT'"],
            ["any\\b", "return 'ANY'"],
            ["boolean\\b", "return 'BOOLEAN'"],
            ["double\\b", "return 'DOUBLE'"],
            ["float\\b", "return 'FLOAT'"],
            ["long\\b", "return 'LONG'"],
            ["octet\\b", "return 'OCTET'"],
            ["sequence\\b", "return 'SEQUENCE'"],
            ["short\\b", "return 'SHORT'"],
            ["DOMString\\b", "return 'DOMSTRING'"],
            ["unsigned\\b", "return 'UNSIGNED'"],
            ["void\\b", "return 'VOID'"],
            ["\\.\\.\\.", "return 'ELLIPSIS'"],
            ["\\s+", "/* skip whitespace */"],
            ["\\{", "return '{'"],
            ["\\}", "return '}'"],
            ["\\[", "return '['"],
            ["\\]", "return ']'"],
            ["\\(", "return '('"],
            ["\\)", "return ')'"],
            ["\\?", "return '?'"],
            ["=", "return '='"],
            ["<", "return '<'"],
            [">", "return '>'"],
            [",", "return ','"],
            ["::", "return '::'"],
            [":", "return ':'"],
            [";", "return ';'"],
        ],
    },
    
    tokens: "MODULE INTERFACE EXCEPTION TYPEDEF IMPLEMENTS CONST TRUE FALSE STRINGIFIER ATTRIBUTE READONLY GETRAISES " +
            "SETRAISES OMITTABLE GETTER SETTER CREATOR DELETER CALLER RAISES IN OPTIONAL OBJECT ANY BOOLEAN DOUBLE FLOAT " +
            "LONG OCTET SEQUENCE SHORT DOMSTRING UNSIGNED VOID { } [ ] ( ) , : ; :: < > ELLIPSIS",
    start:  "Definitions",
    bnf:    {
        Definitions:    [
            ["ExtendedAttributeList Definition", "$2.extAttrs = $1; $$ = [$2];"],
            ["Definitions ExtendedAttributeList Definition", "$$ = $1; $3.extAttrs = $2; $1.push($3);"],
            ["", "$$ = [];"]
        ],
        Definition:     [
            ["Module", "$$ = $1;"],
            ["Interface", "$$ = $1;"],
            ["Exception", "$$ = $1;"],
            ["Typedef", "$$ = $1;"],
            ["ImplementsStatement", "$$ = $1;"],
        ],
        Module:         [
            ["MODULE identifier { Definitions } ;", "$$ = { type: 'module', name: $2, definitions: $4 };"],
        ],
        Interface:      [
            ["INTERFACE identifier InterfaceInheritance { InterfaceMembers } ;", 
             "$$ = { type: 'interface', name: $2, inheritance: $3, members: $5 };"],
        ],
        InterfaceInheritance:   [
            [": ScopedNameList", "$$ = [$2];"],
            ["", "$$ = [];"],
        ],
        InterfaceMembers:   [
            ["ExtendedAttributeList InterfaceMember", "$2.extAttrs = $1; $$ = [$2];"],
            ["InterfaceMembers ExtendedAttributeList InterfaceMember", "$$ = $1; $3.extAttrs = $2; $1.push($3);"],
            ["", "$$ = [];"]
        ],
        InterfaceMember:    [
            ["Const", "$$ = $1;"],
            ["AttributeOrOperation", "$$ = $1;"],
        ],
        Exception:      [
            ["EXCEPTION identifier { ExceptionMembers } ;", 
             "$$ = { type: 'exception', name: $2, members: $4 };"],
        ],
        ExceptionMembers:   [
            ["ExtendedAttributeList ExceptionMember", "$2.extAttrs = $1; $$ = [$2];"],
            ["ExceptionMembers ExtendedAttributeList ExceptionMember", "$$ = $1; $3.extAttrs = $2; $1.push($3);"],
            ["", "$$ = [];"]
        ],
        Typedef:   [
            ["TYPEDEF Type identifier ;", "$$ = { type: 'typedef', type: $2, name: $3 };"],
        ],
        ImplementsStatement:   [
            ["ScopedName IMPLEMENTS ScopedName ;", "$$ = { type: 'implements', interface: $1, implements: $3 };"],
        ],
        Const:   [
            ["CONST Type identifier = ConstExpr ;", 
             "$$ = { type: 'const', type: $2, name: $3, value: $5 };"],
        ],
        ConstExpr:     [
            ["BooleanLiteral", "$$ = $1;"],
            ["integer", "$$ = Number($1);"],
            ["float", "$$ = Number($1);"],
        ],
        BooleanLiteral:     [
            ["TRUE", "$$ = true;"],
            ["FALSE", "$$ = false;"],
        ],
        AttributeOrOperation:     [
            ["STRINGIFIER StringifierAttributeOrOperation", "$$ = { type: 'stringifier', value: $1 };"],
            ["Attribute", "$$ = $1;"],
            ["Operation", "$$ = $1;"],
        ],
        StringifierAttributeOrOperation:     [
            ["Attribute", "$$ = $1;"],
            ["OperationRest", "$$ = $1;"],
            [";", "$$ = null;"],
        ],
        Attribute:  [
            ["ReadOnly ATTRIBUTE Type identifier GetRaises SetRaises ;", 
             "$$ = { type: 'attribute', readOnly: $1, type: $3, name: $4, getRaises: $5, setRaises: $6 };"]
        ],
        ReadOnly:   [
            ["READONLY", "$$ = true;"],
            ["", "$$ = false;"]
        ],
        GetRaises:   [
            ["GETRAISES ExceptionList", "$$ = $2;"],
            ["", "$$ = null;"]
        ],
        SetRaises:   [
            ["SETRAISES ExceptionList", "$$ = $2;"],
            ["", "$$ = null;"]
        ],
        Operation:  [
            ["OmittableSpecials OperationRest", 
             "$2.omittable = $1.omittable; $2.specials = $1.specials; $$ = $2;"]
        ],
        OmittableSpecials:  [
            ["OMITTABLE Specials",  "$$ = { omittable: true, specials: $2 };"],
            ["Specials",  "$$ = { omittable: false, specials: $1 };"],
        ],
        Specials:   [
            ["Special", "$$ = [$1];"],
            ["Specials Special", "$$ = $1; $1.push($2);"],
            ["", "$$ = [];"]
        ],
        Special:     [
            ["GETTER", "$$ = $1;"],
            ["SETTER", "$$ = $1;"],
            ["CREATOR", "$$ = $1;"],
            ["DELETER", "$$ = $1;"],
            ["CALLER", "$$ = $1;"],
        ],
        OperationRest:  [
            ["ReturnType OptionalIdentifier ( ArgumentList ) Raises ;", 
             "$$ = { type: 'operation', type: $1, name: $2, params: $4, raises: $5 };"]
        ],
        OptionalIdentifier:   [
            ["identifier", "$$ = $1;"],
            ["", "$$ = null;"]
        ],
        Raises:   [
            ["RAISES ExceptionList", "$$ = $2;"],
            ["", "$$ = null;"]
        ],
        ExceptionList:   [
            ["( ScopedNameList )", "$$ = $2;"],
        ],
        ArgumentList:   [
            ["Argument", "$$ = [$1];"],
            ["ArgumentList , Argument", "$$ = $1; $1.push($3);"],
            ["", "$$ = [];"]
        ],
        // XXX don't think I need this one, but matches the ArgumentList used inside the previous
        // Arguments:   [
        //     [", Argument Arguments", "$$ = $1; $1.push($3);"],
        //     ["", "$$ = [];"]
        // ],
        Argument:  [
            ["ExtendedAttributeList In Optional Type Ellipsis identifier", 
             "$$ = { type: 'param', extAttrs: $1, optional: $3, type: $4, variadic: $5, name: $6 };"]
        ],
        In:   [
            ["IN", "$$ = true;"],
            ["", "$$ = false;"]
        ],
        Optional:   [
            ["OPTIONAL", "$$ = true;"],
            ["", "$$ = false;"]
        ],
        Ellipsis:   [
            ["ELLIPSIS", "$$ = true;"],
            ["", "$$ = false;"]
        ],
        ExceptionMember:    [
            ["Const", "$$ = $1;"],
            ["ExceptionField", "$$ = $1;"],
        ],
        ExceptionField:  [
            ["Type identifier ;", 
             "$$ = { type: 'field', type: $1, name: $2 };"]
        ],
        ExtendedAttributeList:  [
            ["[ ExtendedAttributes ]", "$$ = $2;"],
            ["", "$$ = [];"],
        ],
        ExtendedAttributes:   [
            ["ExtendedAttribute", "$$ = [$1];"],
            ["ExtendedAttributes , ExtendedAttribute", "$$ = $1; $1.push($3);"],
            ["", "$$ = [];"]
        ],
        ExtendedAttribute:   [
            ["( ExtendedAttributeInner ) ExtendedAttributeRest", "$$ = [$2, $4];"],
            ["[ ExtendedAttributeInner ] ExtendedAttributeRest", "$$ = [$2, $4];"],
            ["{ ExtendedAttributeInner } ExtendedAttributeRest", "$$ = [$2, $4];"],
            ["Other ExtendedAttributeRest", "$$ = [$1, $2];"],
        ],
        ExtendedAttributeRest:   [
            ["ExtendedAttribute", "$$ = $1;"],
            ["", "$$ = null;"]
        ],
        ExtendedAttributeInner:   [
            ["( ExtendedAttributeInner ) ExtendedAttributeInner", "$$ = [$2, $4];"],
            ["[ ExtendedAttributeInner ] ExtendedAttributeInner", "$$ = [$2, $4];"],
            ["{ ExtendedAttributeInner } ExtendedAttributeInner", "$$ = [$2, $4];"],
            ["OtherOrComma ExtendedAttributeInner", "$$ = [$1, $2];"],
            ["", "$$ = null;"],
        ],
        Other:     [
            ["integer", "$$ = $1;"],
            ["FLOAT", "$$ = $1;"],
            ["identifier", "$$ = $1;"],
            ["string", "$$ = $1;"],
            ["other", "$$ = $1;"],
            ["ELLIPSIS", "$$ = $1;"],
            ["::", "$$ = $1;"],
            [":", "$$ = $1;"],
            [";", "$$ = $1;"],
            ["<", "$$ = $1;"],
            ["=", "$$ = $1;"],
            [">", "$$ = $1;"],
            ["?", "$$ = $1;"],
            ["FALSE", "$$ = $1;"],
            ["OBJECT", "$$ = $1;"],
            ["TRUE", "$$ = $1;"],
            ["ANY", "$$ = $1;"],
            ["ATTRIBUTE", "$$ = $1;"],
            ["BOOLEAN", "$$ = $1;"],
            ["CALLER", "$$ = $1;"],
            ["CONST", "$$ = $1;"],
            ["CREATOR", "$$ = $1;"],
            ["DELETER", "$$ = $1;"],
            ["DOUBLE", "$$ = $1;"],
            ["EXCEPTION", "$$ = $1;"],
            ["GETRAISES", "$$ = $1;"],
            ["GETTER", "$$ = $1;"],
            ["IMPLEMENTS", "$$ = $1;"],
            ["IN", "$$ = $1;"],
            ["INTERFACE", "$$ = $1;"],
            ["LONG", "$$ = $1;"],
            ["MODULE", "$$ = $1;"],
            ["OCTET", "$$ = $1;"],
            ["OMITTABLE", "$$ = $1;"],
            ["OPTIONAL", "$$ = $1;"],
            ["RAISES", "$$ = $1;"],
            ["SEQUENCE", "$$ = $1;"],
            ["SETRAISES", "$$ = $1;"],
            ["SETTER", "$$ = $1;"],
            ["SHORT", "$$ = $1;"],
            ["DOMString", "$$ = $1;"],
            ["STRINGIFIER", "$$ = $1;"],
            ["TYPEDEF", "$$ = $1;"],
            ["UNSIGNED", "$$ = $1;"],
            ["VOID", "$$ = $1;"],
        ],
        OtherOrComma:     [
            ["Other", "$$ = $1;"],
            [",", "$$ = $1;"],
        ],
        Type:     [
            ["NullableType", "$$ = { type: 'type', nullable: $1.nullable, name: $1.name, sequence: $1.sequence };"],
            ["ScopedName", "$$ = { type: 'type', nullable: false, name: $1, sequence: false };"],
            ["ANY", "$$ = { type: 'type', nullable: true, name: 'Any', sequence: false };"],
            ["OBJECT", "$$ = { type: 'type', nullable: true, name: 'Object', sequence: false };"],
        ],
        NullableType:     [
            ["UnsignedIntegerType Nullable", "$$ = { name: $1, nullable: $2, sequence: false };"],
            ["BOOLEAN Nullable", "$$ = { name: 'boolean', nullable: $2, sequence: false };"],
            ["OCTET Nullable", "$$ = { name: 'octet', nullable: $2, sequence: false };"],
            ["FLOAT Nullable", "$$ = { name: 'float', nullable: $2, sequence: false };"],
            ["DOUBLE Nullable", "$$ = { name: 'double', nullable: $2, sequence: false };"],
            ["DOMString Nullable", "$$ = { name: 'string', nullable: $2, sequence: false };"],
            ["SEQUENCE < Type > Nullable", "$$ = { name: 'sequence', type: $3, nullable: $5, sequence: true };"],
        ],
        UnsignedIntegerType:    [
            ["UNSIGNED IntegerType", "$$ = 'unsigned ' + $2;"],
            ["IntegerType", "$$ = $1;"],
        ],
        IntegerType:    [
            ["SHORT", "$$ = 'short';"],
            ["LONG OptionalLong", "$$ = 'long' + $2;"],
        ],
        OptionalLong:    [
            ["LONG", "$$ = ' long';"],
            ["", "$$ = '';"],
        ],
        Nullable:    [
            ["?", "$$ = true;"],
            ["", "$$ = false;"],
        ],
        ReturnType:    [
            ["Type", "$$ = $1;"],
            ["VOID", "$$ = { name: 'void', nullable: false, sequence: false };"],
        ],
    },
};

/*
    [51]	ScopedNameList	→	ScopedName ScopedNames
    [52]	ScopedNames	→	"," ScopedName ScopedNames
     | ε
    [53]	ScopedName	→	AbsoluteScopedName
     | RelativeScopedName
    [54]	AbsoluteScopedName	→	"::" identifier ScopedNameParts
    [55]	RelativeScopedName	→	identifier ScopedNameParts
    [56]	ScopedNameParts	→	"::" identifier ScopedNameParts
     | ε
    [57]	ExtendedAttributeNoArg	→	identifier
    [58]	ExtendedAttributeArgList	→	identifier "(" ArgumentList ")"
    [59]	ExtendedAttributeIdent	→	identifier "=" identifier
    [60]	ExtendedAttributeScopedName	→	identifier "=" ScopedName
    [61]	ExtendedAttributeNamedArgList	→	identifier "=" identifier "(" ArgumentList ")"
*/


// XXX these options might need changing
var options = { type: "slr", moduleType: "commonjs", moduleName: "webidl-parse" };

exports.main = function main (args) {
    var fs = require("fs"),
        cwd = fs.path(fs.cwd()),
        code = new Generator(exports.grammar, options).generate(),
        stream = cwd.join(options.moduleName + ".js").open("w");
    stream.print(code).close();
};

if (require.main === module)
    exports.main(process.argv);

