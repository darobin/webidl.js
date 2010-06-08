
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
            ["\\.\\.\\.", "return '...'"],
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
            "LONG OCTET SEQUENCE SHORT DOMSTRING UNSIGNED VOID { } [ ] ( ) , : ; :: < > ...",
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
            ["ReadOnly ATTRIBUTE Type identifier GetRaises SetRaises", 
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
    },
};

/*
    [23]	Specials	→	Special Specials
     | ε
    [24]	Special	→	"getter"
     | "setter"
     | "creator"
     | "deleter"
     | "caller"
    [25]	OperationRest	→	ReturnType OptionalIdentifier "(" ArgumentList ")" Raises ";"
    [26]	OptionalIdentifier	→	identifier
     | ε
    [27]	Raises	→	"raises" ExceptionList
     | ε
    [28]	ExceptionList	→	"(" ScopedNameList ")"
    [29]	ArgumentList	→	Argument Arguments
     | ε
    [30]	Arguments	→	"," Argument Arguments
     | ε
    [31]	Argument	→	ExtendedAttributeList In Optional Type Ellipsis identifier
    [32]	In	→	"in"
     | ε
    [33]	Optional	→	"optional"
     | ε
    [34]	Ellipsis	→	"..."
     | ε
    [35]	ExceptionMember	→	Const
     | ExceptionField
    [36]	ExceptionField	→	Type identifier ";"
    [37]	ExtendedAttributeList	→	"[" ExtendedAttribute ExtendedAttributes "]"
     | ε
    [38]	ExtendedAttributes	→	"," ExtendedAttribute ExtendedAttributes
     | ε
    [39]	ExtendedAttribute	→	"(" ExtendedAttributeInner ")" ExtendedAttributeRest
     | "[" ExtendedAttributeInner "]" ExtendedAttributeRest
     | "{" ExtendedAttributeInner "}" ExtendedAttributeRest
     | Other ExtendedAttributeRest
    [40]	ExtendedAttributeRest	→	ExtendedAttribute
     | ε
    [41]	ExtendedAttributeInner	→	"(" ExtendedAttributeInner ")" ExtendedAttributeInner
     | "[" ExtendedAttributeInner "]" ExtendedAttributeInner
     | "{" ExtendedAttributeInner "}" ExtendedAttributeInner
     | OtherOrComma ExtendedAttributeInner
     | ε
    [42]	Other	→	integer
     | float
     | identifier
     | string
     | other
     | "..."
     | ":"
     | "::"
     | ";"
     | "<"
     | "="
     | ">"
     | "?"
     | "false"
     | "object"
     | "true"
     | "any"
     | "attribute"
     | "boolean"
     | "caller"
     | "const"
     | "creator"
     | "deleter"
     | "double"
     | "exception"
     | "float"
     | "getraises"
     | "getter"
     | "implements"
     | "in"
     | "interface"
     | "long"
     | "module"
     | "octet"
     | "omittable"
     | "optional"
     | "raises"
     | "sequence"
     | "setraises"
     | "setter"
     | "short"
     | "DOMString"
     | "stringifier"
     | "typedef"
     | "unsigned"
     | "void"
    [43]	OtherOrComma	→	Other
     | ","
    [44]	Type	→	NullableType
     | ScopedName
     | "any"
     | "object"
    [45]	NullableType	→	UnsignedIntegerType Nullable
     | "boolean" Nullable
     | "octet" Nullable
     | "float" Nullable
     | "double" Nullable
     | "DOMString" Nullable
     | "sequence" "<" Type ">" Nullable
    [46]	UnsignedIntegerType	→	"unsigned" IntegerType
     | IntegerType
    [47]	IntegerType	→	"short"
     | "long" OptionalLong
    [48]	OptionalLong	→	"long"
     | ε
    [49]	Nullable	→	"?"
     | ε
    [50]	ReturnType	→	Type
     | "void"
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
    exports.main(require("system").args);

