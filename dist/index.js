#!/usr/bin/env node
import { createRequire as __everyagentCreateRequire } from "node:module";
const require = __everyagentCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a, b3) => (typeof require !== "undefined" ? require : a)[b3]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/picocolors/picocolors.js"(exports2, module2) {
    "use strict";
    var p2 = process || {};
    var argv = p2.argv || [];
    var env = p2.env || {};
    var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p2.platform === "win32" || (p2.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input, index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let result = "", cursor = 0;
      do {
        result += string.substring(cursor, index) + replace;
        cursor = index + close.length;
        index = string.indexOf(close, cursor);
      } while (~index);
      return result + string.substring(cursor);
    };
    var createColors = (enabled = isColorSupported) => {
      let f = enabled ? formatter : () => String;
      return {
        isColorSupported: enabled,
        reset: f("\x1B[0m", "\x1B[0m"),
        bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
        dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
        italic: f("\x1B[3m", "\x1B[23m"),
        underline: f("\x1B[4m", "\x1B[24m"),
        inverse: f("\x1B[7m", "\x1B[27m"),
        hidden: f("\x1B[8m", "\x1B[28m"),
        strikethrough: f("\x1B[9m", "\x1B[29m"),
        black: f("\x1B[30m", "\x1B[39m"),
        red: f("\x1B[31m", "\x1B[39m"),
        green: f("\x1B[32m", "\x1B[39m"),
        yellow: f("\x1B[33m", "\x1B[39m"),
        blue: f("\x1B[34m", "\x1B[39m"),
        magenta: f("\x1B[35m", "\x1B[39m"),
        cyan: f("\x1B[36m", "\x1B[39m"),
        white: f("\x1B[37m", "\x1B[39m"),
        gray: f("\x1B[90m", "\x1B[39m"),
        bgBlack: f("\x1B[40m", "\x1B[49m"),
        bgRed: f("\x1B[41m", "\x1B[49m"),
        bgGreen: f("\x1B[42m", "\x1B[49m"),
        bgYellow: f("\x1B[43m", "\x1B[49m"),
        bgBlue: f("\x1B[44m", "\x1B[49m"),
        bgMagenta: f("\x1B[45m", "\x1B[49m"),
        bgCyan: f("\x1B[46m", "\x1B[49m"),
        bgWhite: f("\x1B[47m", "\x1B[49m"),
        blackBright: f("\x1B[90m", "\x1B[39m"),
        redBright: f("\x1B[91m", "\x1B[39m"),
        greenBright: f("\x1B[92m", "\x1B[39m"),
        yellowBright: f("\x1B[93m", "\x1B[39m"),
        blueBright: f("\x1B[94m", "\x1B[39m"),
        magentaBright: f("\x1B[95m", "\x1B[39m"),
        cyanBright: f("\x1B[96m", "\x1B[39m"),
        whiteBright: f("\x1B[97m", "\x1B[39m"),
        bgBlackBright: f("\x1B[100m", "\x1B[49m"),
        bgRedBright: f("\x1B[101m", "\x1B[49m"),
        bgGreenBright: f("\x1B[102m", "\x1B[49m"),
        bgYellowBright: f("\x1B[103m", "\x1B[49m"),
        bgBlueBright: f("\x1B[104m", "\x1B[49m"),
        bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
        bgCyanBright: f("\x1B[106m", "\x1B[49m"),
        bgWhiteBright: f("\x1B[107m", "\x1B[49m")
      };
    };
    module2.exports = createColors();
    module2.exports.createColors = createColors;
  }
});

// node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "node_modules/kind-of/index.js"(exports2, module2) {
    "use strict";
    var toString = Object.prototype.toString;
    module2.exports = function kindOf(val) {
      if (val === void 0) return "undefined";
      if (val === null) return "null";
      var type = typeof val;
      if (type === "boolean") return "boolean";
      if (type === "string") return "string";
      if (type === "number") return "number";
      if (type === "symbol") return "symbol";
      if (type === "function") {
        return isGeneratorFn(val) ? "generatorfunction" : "function";
      }
      if (isArray(val)) return "array";
      if (isBuffer(val)) return "buffer";
      if (isArguments(val)) return "arguments";
      if (isDate(val)) return "date";
      if (isError(val)) return "error";
      if (isRegexp(val)) return "regexp";
      switch (ctorName(val)) {
        case "Symbol":
          return "symbol";
        case "Promise":
          return "promise";
        // Set, Map, WeakSet, WeakMap
        case "WeakMap":
          return "weakmap";
        case "WeakSet":
          return "weakset";
        case "Map":
          return "map";
        case "Set":
          return "set";
        // 8-bit typed arrays
        case "Int8Array":
          return "int8array";
        case "Uint8Array":
          return "uint8array";
        case "Uint8ClampedArray":
          return "uint8clampedarray";
        // 16-bit typed arrays
        case "Int16Array":
          return "int16array";
        case "Uint16Array":
          return "uint16array";
        // 32-bit typed arrays
        case "Int32Array":
          return "int32array";
        case "Uint32Array":
          return "uint32array";
        case "Float32Array":
          return "float32array";
        case "Float64Array":
          return "float64array";
      }
      if (isGeneratorObj(val)) {
        return "generator";
      }
      type = toString.call(val);
      switch (type) {
        case "[object Object]":
          return "object";
        // iterators
        case "[object Map Iterator]":
          return "mapiterator";
        case "[object Set Iterator]":
          return "setiterator";
        case "[object String Iterator]":
          return "stringiterator";
        case "[object Array Iterator]":
          return "arrayiterator";
      }
      return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    };
    function ctorName(val) {
      return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    function isArray(val) {
      if (Array.isArray) return Array.isArray(val);
      return val instanceof Array;
    }
    function isError(val) {
      return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    function isDate(val) {
      if (val instanceof Date) return true;
      return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    function isRegexp(val) {
      if (val instanceof RegExp) return true;
      return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
    }
    function isGeneratorFn(name, val) {
      return ctorName(name) === "GeneratorFunction";
    }
    function isGeneratorObj(val) {
      return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
    }
    function isArguments(val) {
      try {
        if (typeof val.length === "number" && typeof val.callee === "function") {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf("callee") !== -1) {
          return true;
        }
      }
      return false;
    }
    function isBuffer(val) {
      if (val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// node_modules/is-extendable/index.js
var require_is_extendable = __commonJS({
  "node_modules/is-extendable/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function isExtendable(val) {
      return typeof val !== "undefined" && val !== null && (typeof val === "object" || typeof val === "function");
    };
  }
});

// node_modules/extend-shallow/index.js
var require_extend_shallow = __commonJS({
  "node_modules/extend-shallow/index.js"(exports2, module2) {
    "use strict";
    var isObject = require_is_extendable();
    module2.exports = function extend(o2) {
      if (!isObject(o2)) {
        o2 = {};
      }
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];
        if (isObject(obj)) {
          assign(o2, obj);
        }
      }
      return o2;
    };
    function assign(a, b3) {
      for (var key in b3) {
        if (hasOwn(b3, key)) {
          a[key] = b3[key];
        }
      }
    }
    function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
  }
});

// node_modules/section-matter/index.js
var require_section_matter = __commonJS({
  "node_modules/section-matter/index.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var extend = require_extend_shallow();
    module2.exports = function(input, options2) {
      if (typeof options2 === "function") {
        options2 = { parse: options2 };
      }
      var file = toObject(input);
      var defaults = { section_delimiter: "---", parse: identity };
      var opts = extend({}, defaults, options2);
      var delim = opts.section_delimiter;
      var lines = file.content.split(/\r?\n/);
      var sections = null;
      var section = createSection();
      var content = [];
      var stack = [];
      function initSections(val) {
        file.content = val;
        sections = [];
        content = [];
      }
      function closeSection(val) {
        if (stack.length) {
          section.key = getKey(stack[0], delim);
          section.content = val;
          opts.parse(section, sections);
          sections.push(section);
          section = createSection();
          content = [];
          stack = [];
        }
      }
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var len = stack.length;
        var ln = line.trim();
        if (isDelimiter(ln, delim)) {
          if (ln.length === 3 && i !== 0) {
            if (len === 0 || len === 2) {
              content.push(line);
              continue;
            }
            stack.push(ln);
            section.data = content.join("\n");
            content = [];
            continue;
          }
          if (sections === null) {
            initSections(content.join("\n"));
          }
          if (len === 2) {
            closeSection(content.join("\n"));
          }
          stack.push(ln);
          continue;
        }
        content.push(line);
      }
      if (sections === null) {
        initSections(content.join("\n"));
      } else {
        closeSection(content.join("\n"));
      }
      file.sections = sections;
      return file;
    };
    function isDelimiter(line, delim) {
      if (line.slice(0, delim.length) !== delim) {
        return false;
      }
      if (line.charAt(delim.length + 1) === delim.slice(-1)) {
        return false;
      }
      return true;
    }
    function toObject(input) {
      if (typeOf(input) !== "object") {
        input = { content: input };
      }
      if (typeof input.content !== "string" && !isBuffer(input.content)) {
        throw new TypeError("expected a buffer or string");
      }
      input.content = input.content.toString();
      input.sections = [];
      return input;
    }
    function getKey(val, delim) {
      return val ? val.slice(delim.length).trim() : "";
    }
    function createSection() {
      return { key: "", data: "", content: "" };
    }
    function identity(val) {
      return val;
    }
    function isBuffer(val) {
      if (val && val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// node_modules/js-yaml/lib/js-yaml/common.js
var require_common = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/common.js"(exports2, module2) {
    "use strict";
    function isNothing(subject) {
      return typeof subject === "undefined" || subject === null;
    }
    function isObject(subject) {
      return typeof subject === "object" && subject !== null;
    }
    function toArray(sequence) {
      if (Array.isArray(sequence)) return sequence;
      else if (isNothing(sequence)) return [];
      return [sequence];
    }
    function extend(target, source) {
      var index, length, key, sourceKeys;
      if (source) {
        sourceKeys = Object.keys(source);
        for (index = 0, length = sourceKeys.length; index < length; index += 1) {
          key = sourceKeys[index];
          target[key] = source[key];
        }
      }
      return target;
    }
    function repeat(string, count) {
      var result = "", cycle;
      for (cycle = 0; cycle < count; cycle += 1) {
        result += string;
      }
      return result;
    }
    function isNegativeZero(number) {
      return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
    }
    module2.exports.isNothing = isNothing;
    module2.exports.isObject = isObject;
    module2.exports.toArray = toArray;
    module2.exports.repeat = repeat;
    module2.exports.isNegativeZero = isNegativeZero;
    module2.exports.extend = extend;
  }
});

// node_modules/js-yaml/lib/js-yaml/exception.js
var require_exception = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/exception.js"(exports2, module2) {
    "use strict";
    function YAMLException(reason, mark) {
      Error.call(this);
      this.name = "YAMLException";
      this.reason = reason;
      this.mark = mark;
      this.message = (this.reason || "(unknown reason)") + (this.mark ? " " + this.mark.toString() : "");
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack || "";
      }
    }
    YAMLException.prototype = Object.create(Error.prototype);
    YAMLException.prototype.constructor = YAMLException;
    YAMLException.prototype.toString = function toString(compact) {
      var result = this.name + ": ";
      result += this.reason || "(unknown reason)";
      if (!compact && this.mark) {
        result += " " + this.mark.toString();
      }
      return result;
    };
    module2.exports = YAMLException;
  }
});

// node_modules/js-yaml/lib/js-yaml/mark.js
var require_mark = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/mark.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    function Mark(name, buffer, position, line, column) {
      this.name = name;
      this.buffer = buffer;
      this.position = position;
      this.line = line;
      this.column = column;
    }
    Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
      var head, start, tail, end, snippet;
      if (!this.buffer) return null;
      indent = indent || 4;
      maxLength = maxLength || 75;
      head = "";
      start = this.position;
      while (start > 0 && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(start - 1)) === -1) {
        start -= 1;
        if (this.position - start > maxLength / 2 - 1) {
          head = " ... ";
          start += 5;
          break;
        }
      }
      tail = "";
      end = this.position;
      while (end < this.buffer.length && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) === -1) {
        end += 1;
        if (end - this.position > maxLength / 2 - 1) {
          tail = " ... ";
          end -= 5;
          break;
        }
      }
      snippet = this.buffer.slice(start, end);
      return common.repeat(" ", indent) + head + snippet + tail + "\n" + common.repeat(" ", indent + this.position - start + head.length) + "^";
    };
    Mark.prototype.toString = function toString(compact) {
      var snippet, where = "";
      if (this.name) {
        where += 'in "' + this.name + '" ';
      }
      where += "at line " + (this.line + 1) + ", column " + (this.column + 1);
      if (!compact) {
        snippet = this.getSnippet();
        if (snippet) {
          where += ":\n" + snippet;
        }
      }
      return where;
    };
    module2.exports = Mark;
  }
});

// node_modules/js-yaml/lib/js-yaml/type.js
var require_type = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type.js"(exports2, module2) {
    "use strict";
    var YAMLException = require_exception();
    var TYPE_CONSTRUCTOR_OPTIONS = [
      "kind",
      "resolve",
      "construct",
      "instanceOf",
      "predicate",
      "represent",
      "defaultStyle",
      "styleAliases"
    ];
    var YAML_NODE_KINDS = [
      "scalar",
      "sequence",
      "mapping"
    ];
    function compileStyleAliases(map) {
      var result = {};
      if (map !== null) {
        Object.keys(map).forEach(function(style) {
          map[style].forEach(function(alias) {
            result[String(alias)] = style;
          });
        });
      }
      return result;
    }
    function Type(tag, options2) {
      options2 = options2 || {};
      Object.keys(options2).forEach(function(name) {
        if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
          throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
        }
      });
      this.tag = tag;
      this.kind = options2["kind"] || null;
      this.resolve = options2["resolve"] || function() {
        return true;
      };
      this.construct = options2["construct"] || function(data) {
        return data;
      };
      this.instanceOf = options2["instanceOf"] || null;
      this.predicate = options2["predicate"] || null;
      this.represent = options2["represent"] || null;
      this.defaultStyle = options2["defaultStyle"] || null;
      this.styleAliases = compileStyleAliases(options2["styleAliases"] || null);
      if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
        throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
      }
    }
    module2.exports = Type;
  }
});

// node_modules/js-yaml/lib/js-yaml/schema.js
var require_schema = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var Type = require_type();
    function compileList(schema, name, result) {
      var exclude = [];
      schema.include.forEach(function(includedSchema) {
        result = compileList(includedSchema, name, result);
      });
      schema[name].forEach(function(currentType) {
        result.forEach(function(previousType, previousIndex) {
          if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
            exclude.push(previousIndex);
          }
        });
        result.push(currentType);
      });
      return result.filter(function(type, index) {
        return exclude.indexOf(index) === -1;
      });
    }
    function compileMap() {
      var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {}
      }, index, length;
      function collectType(type) {
        result[type.kind][type.tag] = result["fallback"][type.tag] = type;
      }
      for (index = 0, length = arguments.length; index < length; index += 1) {
        arguments[index].forEach(collectType);
      }
      return result;
    }
    function Schema(definition) {
      this.include = definition.include || [];
      this.implicit = definition.implicit || [];
      this.explicit = definition.explicit || [];
      this.implicit.forEach(function(type) {
        if (type.loadKind && type.loadKind !== "scalar") {
          throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
        }
      });
      this.compiledImplicit = compileList(this, "implicit", []);
      this.compiledExplicit = compileList(this, "explicit", []);
      this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
    }
    Schema.DEFAULT = null;
    Schema.create = function createSchema() {
      var schemas, types;
      switch (arguments.length) {
        case 1:
          schemas = Schema.DEFAULT;
          types = arguments[0];
          break;
        case 2:
          schemas = arguments[0];
          types = arguments[1];
          break;
        default:
          throw new YAMLException("Wrong number of arguments for Schema.create function");
      }
      schemas = common.toArray(schemas);
      types = common.toArray(types);
      if (!schemas.every(function(schema) {
        return schema instanceof Schema;
      })) {
        throw new YAMLException("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");
      }
      if (!types.every(function(type) {
        return type instanceof Type;
      })) {
        throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      return new Schema({
        include: schemas,
        explicit: types
      });
    };
    module2.exports = Schema;
  }
});

// node_modules/js-yaml/lib/js-yaml/type/str.js
var require_str = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/str.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:str", {
      kind: "scalar",
      construct: function(data) {
        return data !== null ? data : "";
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/seq.js
var require_seq = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/seq.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:seq", {
      kind: "sequence",
      construct: function(data) {
        return data !== null ? data : [];
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/map.js
var require_map = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/map.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:map", {
      kind: "mapping",
      construct: function(data) {
        return data !== null ? data : {};
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/failsafe.js
var require_failsafe = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/failsafe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      explicit: [
        require_str(),
        require_seq(),
        require_map()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/null.js
var require_null = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/null.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlNull(data) {
      if (data === null) return true;
      var max = data.length;
      return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
    }
    function constructYamlNull() {
      return null;
    }
    function isNull(object) {
      return object === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:null", {
      kind: "scalar",
      resolve: resolveYamlNull,
      construct: constructYamlNull,
      predicate: isNull,
      represent: {
        canonical: function() {
          return "~";
        },
        lowercase: function() {
          return "null";
        },
        uppercase: function() {
          return "NULL";
        },
        camelcase: function() {
          return "Null";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/bool.js
var require_bool = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/bool.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlBoolean(data) {
      if (data === null) return false;
      var max = data.length;
      return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
    }
    function constructYamlBoolean(data) {
      return data === "true" || data === "True" || data === "TRUE";
    }
    function isBoolean(object) {
      return Object.prototype.toString.call(object) === "[object Boolean]";
    }
    module2.exports = new Type("tag:yaml.org,2002:bool", {
      kind: "scalar",
      resolve: resolveYamlBoolean,
      construct: constructYamlBoolean,
      predicate: isBoolean,
      represent: {
        lowercase: function(object) {
          return object ? "true" : "false";
        },
        uppercase: function(object) {
          return object ? "TRUE" : "FALSE";
        },
        camelcase: function(object) {
          return object ? "True" : "False";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/int.js
var require_int = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/int.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    function isHexCode(c) {
      return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
    }
    function isOctCode(c) {
      return 48 <= c && c <= 55;
    }
    function isDecCode(c) {
      return 48 <= c && c <= 57;
    }
    function resolveYamlInteger(data) {
      if (data === null) return false;
      var max = data.length, index = 0, hasDigits = false, ch;
      if (!max) return false;
      ch = data[index];
      if (ch === "-" || ch === "+") {
        ch = data[++index];
      }
      if (ch === "0") {
        if (index + 1 === max) return true;
        ch = data[++index];
        if (ch === "b") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (ch !== "0" && ch !== "1") return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        if (ch === "x") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (!isHexCode(data.charCodeAt(index))) return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "_") return false;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch === ":") break;
        if (!isDecCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      if (!hasDigits || ch === "_") return false;
      if (ch !== ":") return true;
      return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
    }
    function constructYamlInteger(data) {
      var value = data, sign = 1, ch, base, digits = [];
      if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
      }
      ch = value[0];
      if (ch === "-" || ch === "+") {
        if (ch === "-") sign = -1;
        value = value.slice(1);
        ch = value[0];
      }
      if (value === "0") return 0;
      if (ch === "0") {
        if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
        if (value[1] === "x") return sign * parseInt(value, 16);
        return sign * parseInt(value, 8);
      }
      if (value.indexOf(":") !== -1) {
        value.split(":").forEach(function(v2) {
          digits.unshift(parseInt(v2, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d3) {
          value += d3 * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseInt(value, 10);
    }
    function isInteger(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:int", {
      kind: "scalar",
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
        binary: function(obj) {
          return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
        },
        octal: function(obj) {
          return obj >= 0 ? "0" + obj.toString(8) : "-0" + obj.toString(8).slice(1);
        },
        decimal: function(obj) {
          return obj.toString(10);
        },
        /* eslint-disable max-len */
        hexadecimal: function(obj) {
          return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
        }
      },
      defaultStyle: "decimal",
      styleAliases: {
        binary: [2, "bin"],
        octal: [8, "oct"],
        decimal: [10, "dec"],
        hexadecimal: [16, "hex"]
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/float.js
var require_float = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/float.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    var YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      "^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
    );
    function resolveYamlFloat(data) {
      if (data === null) return false;
      if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === "_") {
        return false;
      }
      return true;
    }
    function constructYamlFloat(data) {
      var value, sign, base, digits;
      value = data.replace(/_/g, "").toLowerCase();
      sign = value[0] === "-" ? -1 : 1;
      digits = [];
      if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
      }
      if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      } else if (value === ".nan") {
        return NaN;
      } else if (value.indexOf(":") >= 0) {
        value.split(":").forEach(function(v2) {
          digits.unshift(parseFloat(v2, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d3) {
          value += d3 * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseFloat(value, 10);
    }
    var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
    function representYamlFloat(object, style) {
      var res;
      if (isNaN(object)) {
        switch (style) {
          case "lowercase":
            return ".nan";
          case "uppercase":
            return ".NAN";
          case "camelcase":
            return ".NaN";
        }
      } else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return ".inf";
          case "uppercase":
            return ".INF";
          case "camelcase":
            return ".Inf";
        }
      } else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return "-.inf";
          case "uppercase":
            return "-.INF";
          case "camelcase":
            return "-.Inf";
        }
      } else if (common.isNegativeZero(object)) {
        return "-0.0";
      }
      res = object.toString(10);
      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
    }
    function isFloat(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:float", {
      kind: "scalar",
      resolve: resolveYamlFloat,
      construct: constructYamlFloat,
      predicate: isFloat,
      represent: representYamlFloat,
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/json.js
var require_json = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/json.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_failsafe()
      ],
      implicit: [
        require_null(),
        require_bool(),
        require_int(),
        require_float()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/core.js
var require_core = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/core.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_json()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/timestamp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var YAML_DATE_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
    );
    var YAML_TIMESTAMP_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
    );
    function resolveYamlTimestamp(data) {
      if (data === null) return false;
      if (YAML_DATE_REGEXP.exec(data) !== null) return true;
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
      return false;
    }
    function constructYamlTimestamp(data) {
      var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
      match = YAML_DATE_REGEXP.exec(data);
      if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
      if (match === null) throw new Error("Date resolve error");
      year = +match[1];
      month = +match[2] - 1;
      day = +match[3];
      if (!match[4]) {
        return new Date(Date.UTC(year, month, day));
      }
      hour = +match[4];
      minute = +match[5];
      second = +match[6];
      if (match[7]) {
        fraction = match[7].slice(0, 3);
        while (fraction.length < 3) {
          fraction += "0";
        }
        fraction = +fraction;
      }
      if (match[9]) {
        tz_hour = +match[10];
        tz_minute = +(match[11] || 0);
        delta = (tz_hour * 60 + tz_minute) * 6e4;
        if (match[9] === "-") delta = -delta;
      }
      date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
      if (delta) date.setTime(date.getTime() - delta);
      return date;
    }
    function representYamlTimestamp(object) {
      return object.toISOString();
    }
    module2.exports = new Type("tag:yaml.org,2002:timestamp", {
      kind: "scalar",
      resolve: resolveYamlTimestamp,
      construct: constructYamlTimestamp,
      instanceOf: Date,
      represent: representYamlTimestamp
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/merge.js
var require_merge = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/merge.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlMerge(data) {
      return data === "<<" || data === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:merge", {
      kind: "scalar",
      resolve: resolveYamlMerge
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/binary.js
var require_binary = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/binary.js"(exports2, module2) {
    "use strict";
    var NodeBuffer;
    try {
      _require = __require;
      NodeBuffer = _require("buffer").Buffer;
    } catch (__) {
    }
    var _require;
    var Type = require_type();
    var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
    function resolveYamlBinary(data) {
      if (data === null) return false;
      var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        code = map.indexOf(data.charAt(idx));
        if (code > 64) continue;
        if (code < 0) return false;
        bitlen += 6;
      }
      return bitlen % 8 === 0;
    }
    function constructYamlBinary(data) {
      var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
      for (idx = 0; idx < max; idx++) {
        if (idx % 4 === 0 && idx) {
          result.push(bits >> 16 & 255);
          result.push(bits >> 8 & 255);
          result.push(bits & 255);
        }
        bits = bits << 6 | map.indexOf(input.charAt(idx));
      }
      tailbits = max % 4 * 6;
      if (tailbits === 0) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      } else if (tailbits === 18) {
        result.push(bits >> 10 & 255);
        result.push(bits >> 2 & 255);
      } else if (tailbits === 12) {
        result.push(bits >> 4 & 255);
      }
      if (NodeBuffer) {
        return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
      }
      return result;
    }
    function representYamlBinary(object) {
      var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        if (idx % 3 === 0 && idx) {
          result += map[bits >> 18 & 63];
          result += map[bits >> 12 & 63];
          result += map[bits >> 6 & 63];
          result += map[bits & 63];
        }
        bits = (bits << 8) + object[idx];
      }
      tail = max % 3;
      if (tail === 0) {
        result += map[bits >> 18 & 63];
        result += map[bits >> 12 & 63];
        result += map[bits >> 6 & 63];
        result += map[bits & 63];
      } else if (tail === 2) {
        result += map[bits >> 10 & 63];
        result += map[bits >> 4 & 63];
        result += map[bits << 2 & 63];
        result += map[64];
      } else if (tail === 1) {
        result += map[bits >> 2 & 63];
        result += map[bits << 4 & 63];
        result += map[64];
        result += map[64];
      }
      return result;
    }
    function isBinary(object) {
      return NodeBuffer && NodeBuffer.isBuffer(object);
    }
    module2.exports = new Type("tag:yaml.org,2002:binary", {
      kind: "scalar",
      resolve: resolveYamlBinary,
      construct: constructYamlBinary,
      predicate: isBinary,
      represent: representYamlBinary
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/omap.js
var require_omap = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/omap.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _toString = Object.prototype.toString;
    function resolveYamlOmap(data) {
      if (data === null) return true;
      var objectKeys = {}, index, length, pair, pairKey, pairHasKey, object = data;
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") return false;
        for (pairKey in pair) {
          if (_hasOwnProperty.call(pair, pairKey)) {
            if (!pairHasKey) pairHasKey = true;
            else return false;
          }
        }
        if (!pairHasKey) return false;
        if (_hasOwnProperty.call(objectKeys, pairKey)) return false;
        Object.defineProperty(objectKeys, pairKey, { value: true });
      }
      return true;
    }
    function constructYamlOmap(data) {
      return data !== null ? data : [];
    }
    module2.exports = new Type("tag:yaml.org,2002:omap", {
      kind: "sequence",
      resolve: resolveYamlOmap,
      construct: constructYamlOmap
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/pairs.js
var require_pairs = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/pairs.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _toString = Object.prototype.toString;
    function resolveYamlPairs(data) {
      if (data === null) return true;
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        if (_toString.call(pair) !== "[object Object]") return false;
        keys = Object.keys(pair);
        if (keys.length !== 1) return false;
        result[index] = [keys[0], pair[keys[0]]];
      }
      return true;
    }
    function constructYamlPairs(data) {
      if (data === null) return [];
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        keys = Object.keys(pair);
        result[index] = [keys[0], pair[keys[0]]];
      }
      return result;
    }
    module2.exports = new Type("tag:yaml.org,2002:pairs", {
      kind: "sequence",
      resolve: resolveYamlPairs,
      construct: constructYamlPairs
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/set.js
var require_set = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/set.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    function resolveYamlSet(data) {
      if (data === null) return true;
      var key, object = data;
      for (key in object) {
        if (_hasOwnProperty.call(object, key)) {
          if (object[key] !== null) return false;
        }
      }
      return true;
    }
    function constructYamlSet(data) {
      return data !== null ? data : {};
    }
    module2.exports = new Type("tag:yaml.org,2002:set", {
      kind: "mapping",
      resolve: resolveYamlSet,
      construct: constructYamlSet
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/default_safe.js
var require_default_safe = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/default_safe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_core()
      ],
      implicit: [
        require_timestamp(),
        require_merge()
      ],
      explicit: [
        require_binary(),
        require_omap(),
        require_pairs(),
        require_set()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/undefined.js
var require_undefined = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/undefined.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptUndefined() {
      return true;
    }
    function constructJavascriptUndefined() {
      return void 0;
    }
    function representJavascriptUndefined() {
      return "";
    }
    function isUndefined(object) {
      return typeof object === "undefined";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/undefined", {
      kind: "scalar",
      resolve: resolveJavascriptUndefined,
      construct: constructJavascriptUndefined,
      predicate: isUndefined,
      represent: representJavascriptUndefined
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/regexp.js
var require_regexp = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/regexp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptRegExp(data) {
      if (data === null) return false;
      if (data.length === 0) return false;
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        if (modifiers.length > 3) return false;
        if (regexp[regexp.length - modifiers.length - 1] !== "/") return false;
      }
      return true;
    }
    function constructJavascriptRegExp(data) {
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
      }
      return new RegExp(regexp, modifiers);
    }
    function representJavascriptRegExp(object) {
      var result = "/" + object.source + "/";
      if (object.global) result += "g";
      if (object.multiline) result += "m";
      if (object.ignoreCase) result += "i";
      return result;
    }
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/regexp", {
      kind: "scalar",
      resolve: resolveJavascriptRegExp,
      construct: constructJavascriptRegExp,
      predicate: isRegExp,
      represent: representJavascriptRegExp
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/function.js
var require_function = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/function.js"(exports2, module2) {
    "use strict";
    var esprima;
    try {
      _require = __require;
      esprima = _require("esprima");
    } catch (_3) {
      if (typeof window !== "undefined") esprima = window.esprima;
    }
    var _require;
    var Type = require_type();
    function resolveJavascriptFunction(data) {
      if (data === null) return false;
      try {
        var source = "(" + data + ")", ast = esprima.parse(source, { range: true });
        if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    function constructJavascriptFunction(data) {
      var source = "(" + data + ")", ast = esprima.parse(source, { range: true }), params = [], body;
      if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
        throw new Error("Failed to resolve function");
      }
      ast.body[0].expression.params.forEach(function(param) {
        params.push(param.name);
      });
      body = ast.body[0].expression.body.range;
      if (ast.body[0].expression.body.type === "BlockStatement") {
        return new Function(params, source.slice(body[0] + 1, body[1] - 1));
      }
      return new Function(params, "return " + source.slice(body[0], body[1]));
    }
    function representJavascriptFunction(object) {
      return object.toString();
    }
    function isFunction(object) {
      return Object.prototype.toString.call(object) === "[object Function]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/function", {
      kind: "scalar",
      resolve: resolveJavascriptFunction,
      construct: constructJavascriptFunction,
      predicate: isFunction,
      represent: representJavascriptFunction
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/default_full.js
var require_default_full = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/default_full.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = Schema.DEFAULT = new Schema({
      include: [
        require_default_safe()
      ],
      explicit: [
        require_undefined(),
        require_regexp(),
        require_function()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/loader.js
var require_loader = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/loader.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var Mark = require_mark();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CONTEXT_FLOW_IN = 1;
    var CONTEXT_FLOW_OUT = 2;
    var CONTEXT_BLOCK_IN = 3;
    var CONTEXT_BLOCK_OUT = 4;
    var CHOMPING_CLIP = 1;
    var CHOMPING_STRIP = 2;
    var CHOMPING_KEEP = 3;
    var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
    var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
    var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
    var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
    function _class(obj) {
      return Object.prototype.toString.call(obj);
    }
    function is_EOL(c) {
      return c === 10 || c === 13;
    }
    function is_WHITE_SPACE(c) {
      return c === 9 || c === 32;
    }
    function is_WS_OR_EOL(c) {
      return c === 9 || c === 32 || c === 10 || c === 13;
    }
    function is_FLOW_INDICATOR(c) {
      return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
    }
    function fromHexCode(c) {
      var lc;
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      lc = c | 32;
      if (97 <= lc && lc <= 102) {
        return lc - 97 + 10;
      }
      return -1;
    }
    function escapedHexLen(c) {
      if (c === 120) {
        return 2;
      }
      if (c === 117) {
        return 4;
      }
      if (c === 85) {
        return 8;
      }
      return 0;
    }
    function fromDecimalCode(c) {
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      return -1;
    }
    function simpleEscapeSequence(c) {
      return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
    }
    function charFromCodepoint(c) {
      if (c <= 65535) {
        return String.fromCharCode(c);
      }
      return String.fromCharCode(
        (c - 65536 >> 10) + 55296,
        (c - 65536 & 1023) + 56320
      );
    }
    function setProperty(object, key, value) {
      if (key === "__proto__") {
        Object.defineProperty(object, key, {
          configurable: true,
          enumerable: true,
          writable: true,
          value
        });
      } else {
        object[key] = value;
      }
    }
    var simpleEscapeCheck = new Array(256);
    var simpleEscapeMap = new Array(256);
    for (i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }
    var i;
    function State(input, options2) {
      this.input = input;
      this.filename = options2["filename"] || null;
      this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
      this.onWarning = options2["onWarning"] || null;
      this.legacy = options2["legacy"] || false;
      this.json = options2["json"] || false;
      this.listener = options2["listener"] || null;
      this.maxTotalMergeKeys = typeof options2["maxTotalMergeKeys"] === "number" ? options2["maxTotalMergeKeys"] : 1e4;
      this.implicitTypes = this.schema.compiledImplicit;
      this.typeMap = this.schema.compiledTypeMap;
      this.length = input.length;
      this.position = 0;
      this.line = 0;
      this.lineStart = 0;
      this.lineIndent = 0;
      this.totalMergeKeys = 0;
      this.documents = [];
    }
    function generateError(state, message) {
      return new YAMLException(
        message,
        new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart)
      );
    }
    function throwError(state, message) {
      throw generateError(state, message);
    }
    function throwWarning(state, message) {
      if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
      }
    }
    var directiveHandlers = {
      YAML: function handleYamlDirective(state, name, args) {
        var match, major, minor;
        if (state.version !== null) {
          throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
          throwError(state, "YAML directive accepts exactly one argument");
        }
        match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
          throwError(state, "ill-formed argument of the YAML directive");
        }
        major = parseInt(match[1], 10);
        minor = parseInt(match[2], 10);
        if (major !== 1) {
          throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
          throwWarning(state, "unsupported YAML version of the document");
        }
      },
      TAG: function handleTagDirective(state, name, args) {
        var handle, prefix;
        if (args.length !== 2) {
          throwError(state, "TAG directive accepts exactly two arguments");
        }
        handle = args[0];
        prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
          throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (_hasOwnProperty.call(state.tagMap, handle)) {
          throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
          throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        state.tagMap[handle] = prefix;
      }
    };
    function captureSegment(state, start, end, checkJson) {
      var _position, _length, _character, _result;
      if (start < end) {
        _result = state.input.slice(start, end);
        if (checkJson) {
          for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
            _character = _result.charCodeAt(_position);
            if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
              throwError(state, "expected valid JSON character");
            }
          }
        } else if (PATTERN_NON_PRINTABLE.test(_result)) {
          throwError(state, "the stream contains non-printable characters");
        }
        state.result += _result;
      }
    }
    function chargeMergeWork(state) {
      state.totalMergeKeys += 1;
      if (state.maxTotalMergeKeys !== -1 && state.totalMergeKeys > state.maxTotalMergeKeys) {
        throwError(state, "merge keys exceeded maxTotalMergeKeys (" + state.maxTotalMergeKeys + ")");
      }
    }
    function mergeMappings(state, destination, source, overridableKeys) {
      var sourceKeys, key, index, quantity;
      if (!common.isObject(source)) {
        throwError(state, "cannot merge mappings; the provided source object is unacceptable");
      }
      chargeMergeWork(state);
      sourceKeys = Object.keys(source);
      for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
        key = sourceKeys[index];
        chargeMergeWork(state);
        if (!_hasOwnProperty.call(destination, key)) {
          setProperty(destination, key, source[key]);
          overridableKeys[key] = true;
        }
      }
    }
    function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
      var index, quantity;
      if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
          if (Array.isArray(keyNode[index])) {
            throwError(state, "nested arrays are not supported inside keys");
          }
          if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
            keyNode[index] = "[object Object]";
          }
        }
      }
      if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
        keyNode = "[object Object]";
      }
      keyNode = String(keyNode);
      if (_result === null) {
        _result = {};
      }
      if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
          if (valueNode.length > 100) {
            throwError(state, "abnormal merge sequence size");
          }
          for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
            mergeMappings(state, _result, valueNode[index], overridableKeys);
          }
        } else {
          mergeMappings(state, _result, valueNode, overridableKeys);
        }
      } else {
        if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
          state.line = startLine || state.line;
          state.position = startPos || state.position;
          throwError(state, "duplicated mapping key");
        }
        setProperty(_result, keyNode, valueNode);
        delete overridableKeys[keyNode];
      }
      return _result;
    }
    function readLineBreak(state) {
      var ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 10) {
        state.position++;
      } else if (ch === 13) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 10) {
          state.position++;
        }
      } else {
        throwError(state, "a line break is expected");
      }
      state.line += 1;
      state.lineStart = state.position;
    }
    function skipSeparationSpace(state, allowComments, checkIndent) {
      var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 10 && ch !== 13 && ch !== 0);
        }
        if (is_EOL(ch)) {
          readLineBreak(state);
          ch = state.input.charCodeAt(state.position);
          lineBreaks++;
          state.lineIndent = 0;
          while (ch === 32) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
        } else {
          break;
        }
      }
      if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, "deficient indentation");
      }
      return lineBreaks;
    }
    function testDocumentSeparator(state) {
      var _position = state.position, ch;
      ch = state.input.charCodeAt(_position);
      if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || is_WS_OR_EOL(ch)) {
          return true;
        }
      }
      return false;
    }
    function writeFoldedLines(state, count) {
      if (count === 1) {
        state.result += " ";
      } else if (count > 1) {
        state.result += common.repeat("\n", count - 1);
      }
    }
    function readPlainScalar(state, nodeIndent, withinFlowCollection) {
      var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
      ch = state.input.charCodeAt(state.position);
      if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
        return false;
      }
      if (ch === 63 || ch === 45) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          return false;
        }
      }
      state.kind = "scalar";
      state.result = "";
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
      while (ch !== 0) {
        if (ch === 58) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
            break;
          }
        } else if (ch === 35) {
          preceding = state.input.charCodeAt(state.position - 1);
          if (is_WS_OR_EOL(preceding)) {
            break;
          }
        } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
          break;
        } else if (is_EOL(ch)) {
          _line = state.line;
          _lineStart = state.lineStart;
          _lineIndent = state.lineIndent;
          skipSeparationSpace(state, false, -1);
          if (state.lineIndent >= nodeIndent) {
            hasPendingContent = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          } else {
            state.position = captureEnd;
            state.line = _line;
            state.lineStart = _lineStart;
            state.lineIndent = _lineIndent;
            break;
          }
        }
        if (hasPendingContent) {
          captureSegment(state, captureStart, captureEnd, false);
          writeFoldedLines(state, state.line - _line);
          captureStart = captureEnd = state.position;
          hasPendingContent = false;
        }
        if (!is_WHITE_SPACE(ch)) {
          captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, captureEnd, false);
      if (state.result) {
        return true;
      }
      state.kind = _kind;
      state.result = _result;
      return false;
    }
    function readSingleQuotedScalar(state, nodeIndent) {
      var ch, captureStart, captureEnd;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 39) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 39) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (ch === 39) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
            return true;
          }
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a single quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a single quoted scalar");
    }
    function readDoubleQuotedScalar(state, nodeIndent) {
      var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 34) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 34) {
          captureSegment(state, captureStart, state.position, true);
          state.position++;
          return true;
        } else if (ch === 92) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (is_EOL(ch)) {
            skipSeparationSpace(state, false, nodeIndent);
          } else if (ch < 256 && simpleEscapeCheck[ch]) {
            state.result += simpleEscapeMap[ch];
            state.position++;
          } else if ((tmp = escapedHexLen(ch)) > 0) {
            hexLength = tmp;
            hexResult = 0;
            for (; hexLength > 0; hexLength--) {
              ch = state.input.charCodeAt(++state.position);
              if ((tmp = fromHexCode(ch)) >= 0) {
                hexResult = (hexResult << 4) + tmp;
              } else {
                throwError(state, "expected hexadecimal character");
              }
            }
            state.result += charFromCodepoint(hexResult);
            state.position++;
          } else {
            throwError(state, "unknown escape sequence");
          }
          captureStart = captureEnd = state.position;
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a double quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a double quoted scalar");
    }
    function readFlowCollection(state, nodeIndent) {
      var readNext = true, _line, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = {}, keyNode, keyTag, valueNode, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 91) {
        terminator = 93;
        isMapping = false;
        _result = [];
      } else if (ch === 123) {
        terminator = 125;
        isMapping = true;
        _result = {};
      } else {
        return false;
      }
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(++state.position);
      while (ch !== 0) {
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
          state.position++;
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = isMapping ? "mapping" : "sequence";
          state.result = _result;
          return true;
        } else if (!readNext) {
          throwError(state, "missed comma between flow collection entries");
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 63) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following)) {
            isPair = isExplicitPair = true;
            state.position++;
            skipSeparationSpace(state, true, nodeIndent);
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === _line) && ch === 58) {
          isPair = true;
          ch = state.input.charCodeAt(++state.position);
          skipSeparationSpace(state, true, nodeIndent);
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          valueNode = state.result;
        }
        if (isMapping) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
        } else if (isPair) {
          _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
        } else {
          _result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 44) {
          readNext = true;
          ch = state.input.charCodeAt(++state.position);
        } else {
          readNext = false;
        }
      }
      throwError(state, "unexpected end of the stream within a flow collection");
    }
    function readBlockScalar(state, nodeIndent) {
      var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 124) {
        folding = false;
      } else if (ch === 62) {
        folding = true;
      } else {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      while (ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
        if (ch === 43 || ch === 45) {
          if (CHOMPING_CLIP === chomping) {
            chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
          } else {
            throwError(state, "repeat of a chomping mode identifier");
          }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
          if (tmp === 0) {
            throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
          } else if (!detectedIndent) {
            textIndent = nodeIndent + tmp - 1;
            detectedIndent = true;
          } else {
            throwError(state, "repeat of an indentation width identifier");
          }
        } else {
          break;
        }
      }
      if (is_WHITE_SPACE(ch)) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (is_WHITE_SPACE(ch));
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (!is_EOL(ch) && ch !== 0);
        }
      }
      while (ch !== 0) {
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
          textIndent = state.lineIndent;
        }
        if (is_EOL(ch)) {
          emptyLines++;
          continue;
        }
        if (state.lineIndent < textIndent) {
          if (chomping === CHOMPING_KEEP) {
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (chomping === CHOMPING_CLIP) {
            if (didReadContent) {
              state.result += "\n";
            }
          }
          break;
        }
        if (folding) {
          if (is_WHITE_SPACE(ch)) {
            atMoreIndented = true;
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (atMoreIndented) {
            atMoreIndented = false;
            state.result += common.repeat("\n", emptyLines + 1);
          } else if (emptyLines === 0) {
            if (didReadContent) {
              state.result += " ";
            }
          } else {
            state.result += common.repeat("\n", emptyLines);
          }
        } else {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        captureStart = state.position;
        while (!is_EOL(ch) && ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
      }
      return true;
    }
    function readBlockSequence(state, nodeIndent) {
      var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (ch !== 45) {
          break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!is_WS_OR_EOL(following)) {
          break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
          if (state.lineIndent <= nodeIndent) {
            _result.push(null);
            ch = state.input.charCodeAt(state.position);
            continue;
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        _result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
          throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "sequence";
        state.result = _result;
        return true;
      }
      return false;
    }
    function readBlockMapping(state, nodeIndent, flowIndent) {
      var following, allowCompact, _line, _pos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = {}, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        following = state.input.charCodeAt(state.position + 1);
        _line = state.line;
        _pos = state.position;
        if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
          if (ch === 63) {
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = true;
            allowCompact = true;
          } else if (atExplicitKey) {
            atExplicitKey = false;
            allowCompact = true;
          } else {
            throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
          }
          state.position += 1;
          ch = following;
        } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          if (state.line === _line) {
            ch = state.input.charCodeAt(state.position);
            while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 58) {
              ch = state.input.charCodeAt(++state.position);
              if (!is_WS_OR_EOL(ch)) {
                throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
              }
              if (atExplicitKey) {
                storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
                keyTag = keyNode = valueNode = null;
              }
              detected = true;
              atExplicitKey = false;
              allowCompact = false;
              keyTag = state.tag;
              keyNode = state.result;
            } else if (detected) {
              throwError(state, "can not read an implicit mapping pair; a colon is missed");
            } else {
              state.tag = _tag;
              state.anchor = _anchor;
              return true;
            }
          } else if (detected) {
            throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else {
          break;
        }
        if (state.line === _line || state.lineIndent > nodeIndent) {
          if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
            if (atExplicitKey) {
              keyNode = state.result;
            } else {
              valueNode = state.result;
            }
          }
          if (!atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
            keyTag = keyNode = valueNode = null;
          }
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
        }
        if (state.lineIndent > nodeIndent && ch !== 0) {
          throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "mapping";
        state.result = _result;
      }
      return detected;
    }
    function readTagProperty(state) {
      var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 33) return false;
      if (state.tag !== null) {
        throwError(state, "duplication of a tag property");
      }
      ch = state.input.charCodeAt(++state.position);
      if (ch === 60) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
      } else if (ch === 33) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
      } else {
        tagHandle = "!";
      }
      _position = state.position;
      if (isVerbatim) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && ch !== 62);
        if (state.position < state.length) {
          tagName = state.input.slice(_position, state.position);
          ch = state.input.charCodeAt(++state.position);
        } else {
          throwError(state, "unexpected end of the stream within a verbatim tag");
        }
      } else {
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          if (ch === 33) {
            if (!isNamed) {
              tagHandle = state.input.slice(_position - 1, state.position + 1);
              if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                throwError(state, "named tag handle cannot contain such characters");
              }
              isNamed = true;
              _position = state.position + 1;
            } else {
              throwError(state, "tag suffix cannot contain exclamation marks");
            }
          }
          ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(_position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
          throwError(state, "tag suffix cannot contain flow indicator characters");
        }
      }
      if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        throwError(state, "tag name cannot contain such characters: " + tagName);
      }
      if (isVerbatim) {
        state.tag = tagName;
      } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;
      } else if (tagHandle === "!") {
        state.tag = "!" + tagName;
      } else if (tagHandle === "!!") {
        state.tag = "tag:yaml.org,2002:" + tagName;
      } else {
        throwError(state, 'undeclared tag handle "' + tagHandle + '"');
      }
      return true;
    }
    function readAnchorProperty(state) {
      var _position, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 38) return false;
      if (state.anchor !== null) {
        throwError(state, "duplication of an anchor property");
      }
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an anchor node must contain at least one character");
      }
      state.anchor = state.input.slice(_position, state.position);
      return true;
    }
    function readAlias(state) {
      var _position, alias, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 42) return false;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an alias node must contain at least one character");
      }
      alias = state.input.slice(_position, state.position);
      if (!_hasOwnProperty.call(state.anchorMap, alias)) {
        throwError(state, 'unidentified alias "' + alias + '"');
      }
      state.result = state.anchorMap[alias];
      skipSeparationSpace(state, true, -1);
      return true;
    }
    function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
      var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, type, flowIndent, blockIndent;
      if (state.listener !== null) {
        state.listener("open", state);
      }
      state.tag = null;
      state.anchor = null;
      state.kind = null;
      state.result = null;
      allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
      if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        }
      }
      if (indentStatus === 1) {
        while (readTagProperty(state) || readAnchorProperty(state)) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            allowBlockCollections = allowBlockStyles;
            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          } else {
            allowBlockCollections = false;
          }
        }
      }
      if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
      }
      if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
          flowIndent = parentIndent;
        } else {
          flowIndent = parentIndent + 1;
        }
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
          if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
            hasContent = true;
          } else {
            if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
              hasContent = true;
            } else if (readAlias(state)) {
              hasContent = true;
              if (state.tag !== null || state.anchor !== null) {
                throwError(state, "alias node should not have any properties");
              }
            } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
              hasContent = true;
              if (state.tag === null) {
                state.tag = "?";
              }
            }
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else if (indentStatus === 0) {
          hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
      }
      if (state.tag !== null && state.tag !== "!") {
        if (state.tag === "?") {
          if (state.result !== null && state.kind !== "scalar") {
            throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
          }
          for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
            type = state.implicitTypes[typeIndex];
            if (type.resolve(state.result)) {
              state.result = type.construct(state.result);
              state.tag = type.tag;
              if (state.anchor !== null) {
                state.anchorMap[state.anchor] = state.result;
              }
              break;
            }
          }
        } else if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) {
          type = state.typeMap[state.kind || "fallback"][state.tag];
          if (state.result !== null && type.kind !== state.kind) {
            throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
          }
          if (!type.resolve(state.result)) {
            throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
          } else {
            state.result = type.construct(state.result);
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else {
          throwError(state, "unknown tag !<" + state.tag + ">");
        }
      }
      if (state.listener !== null) {
        state.listener("close", state);
      }
      return state.tag !== null || state.anchor !== null || hasContent;
    }
    function readDocument(state) {
      var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = {};
      state.anchorMap = {};
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 37) {
          break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(_position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
          throwError(state, "directive name must not be less than one character in length");
        }
        while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 35) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (ch !== 0 && !is_EOL(ch));
            break;
          }
          if (is_EOL(ch)) break;
          _position = state.position;
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          directiveArgs.push(state.input.slice(_position, state.position));
        }
        if (ch !== 0) readLineBreak(state);
        if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
          directiveHandlers[directiveName](state, directiveName, directiveArgs);
        } else {
          throwWarning(state, 'unknown document directive "' + directiveName + '"');
        }
      }
      skipSeparationSpace(state, true, -1);
      if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      } else if (hasDirectives) {
        throwError(state, "directives end mark is expected");
      }
      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);
      if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
      }
      state.documents.push(state.result);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 46) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        }
        return;
      }
      if (state.position < state.length - 1) {
        throwError(state, "end of the stream or a document separator is expected");
      } else {
        return;
      }
    }
    function loadDocuments(input, options2) {
      input = String(input);
      options2 = options2 || {};
      if (input.length !== 0) {
        if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
          input += "\n";
        }
        if (input.charCodeAt(0) === 65279) {
          input = input.slice(1);
        }
      }
      var state = new State(input, options2);
      var nullpos = input.indexOf("\0");
      if (nullpos !== -1) {
        state.position = nullpos;
        throwError(state, "null byte is not allowed in input");
      }
      state.input += "\0";
      while (state.input.charCodeAt(state.position) === 32) {
        state.lineIndent += 1;
        state.position += 1;
      }
      while (state.position < state.length - 1) {
        readDocument(state);
      }
      return state.documents;
    }
    function loadAll(input, iterator, options2) {
      if (iterator !== null && typeof iterator === "object" && typeof options2 === "undefined") {
        options2 = iterator;
        iterator = null;
      }
      var documents = loadDocuments(input, options2);
      if (typeof iterator !== "function") {
        return documents;
      }
      for (var index = 0, length = documents.length; index < length; index += 1) {
        iterator(documents[index]);
      }
    }
    function load(input, options2) {
      var documents = loadDocuments(input, options2);
      if (documents.length === 0) {
        return void 0;
      } else if (documents.length === 1) {
        return documents[0];
      }
      throw new YAMLException("expected a single document in the stream, but found more");
    }
    function safeLoadAll(input, iterator, options2) {
      if (typeof iterator === "object" && iterator !== null && typeof options2 === "undefined") {
        options2 = iterator;
        iterator = null;
      }
      return loadAll(input, iterator, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    function safeLoad(input, options2) {
      return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    module2.exports.loadAll = loadAll;
    module2.exports.load = load;
    module2.exports.safeLoadAll = safeLoadAll;
    module2.exports.safeLoad = safeLoad;
  }
});

// node_modules/js-yaml/lib/js-yaml/dumper.js
var require_dumper = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/dumper.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var _toString = Object.prototype.toString;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CHAR_TAB = 9;
    var CHAR_LINE_FEED = 10;
    var CHAR_CARRIAGE_RETURN = 13;
    var CHAR_SPACE = 32;
    var CHAR_EXCLAMATION = 33;
    var CHAR_DOUBLE_QUOTE = 34;
    var CHAR_SHARP = 35;
    var CHAR_PERCENT = 37;
    var CHAR_AMPERSAND = 38;
    var CHAR_SINGLE_QUOTE = 39;
    var CHAR_ASTERISK = 42;
    var CHAR_COMMA = 44;
    var CHAR_MINUS = 45;
    var CHAR_COLON = 58;
    var CHAR_EQUALS = 61;
    var CHAR_GREATER_THAN = 62;
    var CHAR_QUESTION = 63;
    var CHAR_COMMERCIAL_AT = 64;
    var CHAR_LEFT_SQUARE_BRACKET = 91;
    var CHAR_RIGHT_SQUARE_BRACKET = 93;
    var CHAR_GRAVE_ACCENT = 96;
    var CHAR_LEFT_CURLY_BRACKET = 123;
    var CHAR_VERTICAL_LINE = 124;
    var CHAR_RIGHT_CURLY_BRACKET = 125;
    var ESCAPE_SEQUENCES = {};
    ESCAPE_SEQUENCES[0] = "\\0";
    ESCAPE_SEQUENCES[7] = "\\a";
    ESCAPE_SEQUENCES[8] = "\\b";
    ESCAPE_SEQUENCES[9] = "\\t";
    ESCAPE_SEQUENCES[10] = "\\n";
    ESCAPE_SEQUENCES[11] = "\\v";
    ESCAPE_SEQUENCES[12] = "\\f";
    ESCAPE_SEQUENCES[13] = "\\r";
    ESCAPE_SEQUENCES[27] = "\\e";
    ESCAPE_SEQUENCES[34] = '\\"';
    ESCAPE_SEQUENCES[92] = "\\\\";
    ESCAPE_SEQUENCES[133] = "\\N";
    ESCAPE_SEQUENCES[160] = "\\_";
    ESCAPE_SEQUENCES[8232] = "\\L";
    ESCAPE_SEQUENCES[8233] = "\\P";
    var DEPRECATED_BOOLEANS_SYNTAX = [
      "y",
      "Y",
      "yes",
      "Yes",
      "YES",
      "on",
      "On",
      "ON",
      "n",
      "N",
      "no",
      "No",
      "NO",
      "off",
      "Off",
      "OFF"
    ];
    function compileStyleMap(schema, map) {
      var result, keys, index, length, tag, style, type;
      if (map === null) return {};
      result = {};
      keys = Object.keys(map);
      for (index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        style = String(map[tag]);
        if (tag.slice(0, 2) === "!!") {
          tag = "tag:yaml.org,2002:" + tag.slice(2);
        }
        type = schema.compiledTypeMap["fallback"][tag];
        if (type && _hasOwnProperty.call(type.styleAliases, style)) {
          style = type.styleAliases[style];
        }
        result[tag] = style;
      }
      return result;
    }
    function encodeHex(character) {
      var string, handle, length;
      string = character.toString(16).toUpperCase();
      if (character <= 255) {
        handle = "x";
        length = 2;
      } else if (character <= 65535) {
        handle = "u";
        length = 4;
      } else if (character <= 4294967295) {
        handle = "U";
        length = 8;
      } else {
        throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
      }
      return "\\" + handle + common.repeat("0", length - string.length) + string;
    }
    function State(options2) {
      this.schema = options2["schema"] || DEFAULT_FULL_SCHEMA;
      this.indent = Math.max(1, options2["indent"] || 2);
      this.noArrayIndent = options2["noArrayIndent"] || false;
      this.skipInvalid = options2["skipInvalid"] || false;
      this.flowLevel = common.isNothing(options2["flowLevel"]) ? -1 : options2["flowLevel"];
      this.styleMap = compileStyleMap(this.schema, options2["styles"] || null);
      this.sortKeys = options2["sortKeys"] || false;
      this.lineWidth = options2["lineWidth"] || 80;
      this.noRefs = options2["noRefs"] || false;
      this.noCompatMode = options2["noCompatMode"] || false;
      this.condenseFlow = options2["condenseFlow"] || false;
      this.implicitTypes = this.schema.compiledImplicit;
      this.explicitTypes = this.schema.compiledExplicit;
      this.tag = null;
      this.result = "";
      this.duplicates = [];
      this.usedDuplicates = null;
    }
    function indentString(string, spaces) {
      var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
      while (position < length) {
        next = string.indexOf("\n", position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line.length && line !== "\n") result += ind;
        result += line;
      }
      return result;
    }
    function generateNextLine(state, level) {
      return "\n" + common.repeat(" ", state.indent * level);
    }
    function testImplicitResolving(state, str2) {
      var index, length, type;
      for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
        type = state.implicitTypes[index];
        if (type.resolve(str2)) {
          return true;
        }
      }
      return false;
    }
    function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
    }
    function isPrintable(c) {
      return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== 65279 || 65536 <= c && c <= 1114111;
    }
    function isNsChar(c) {
      return isPrintable(c) && !isWhitespace(c) && c !== 65279 && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
    }
    function isPlainSafe(c, prev) {
      return isPrintable(c) && c !== 65279 && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_COLON && (c !== CHAR_SHARP || prev && isNsChar(prev));
    }
    function isPlainSafeFirst(c) {
      return isPrintable(c) && c !== 65279 && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
    }
    function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
    }
    var STYLE_PLAIN = 1;
    var STYLE_SINGLE = 2;
    var STYLE_LITERAL = 3;
    var STYLE_FOLDED = 4;
    var STYLE_DOUBLE = 5;
    function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
      var i;
      var char, prev_char;
      var hasLineBreak = false;
      var hasFoldableLine = false;
      var shouldTrackWidth = lineWidth !== -1;
      var previousLineBreak = -1;
      var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
      if (singleLineOnly) {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
      } else {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (char === CHAR_LINE_FEED) {
            hasLineBreak = true;
            if (shouldTrackWidth) {
              hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
              i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
              previousLineBreak = i;
            }
          } else if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
        hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
      }
      if (!hasLineBreak && !hasFoldableLine) {
        return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
      }
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return STYLE_DOUBLE;
      }
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    function writeScalar(state, string, level, iskey) {
      state.dump = (function() {
        if (string.length === 0) {
          return "''";
        }
        if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
          return "'" + string + "'";
        }
        var indent = state.indent * Math.max(1, level);
        var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
        var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
        function testAmbiguity(string2) {
          return testImplicitResolving(state, string2);
        }
        switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
          case STYLE_PLAIN:
            return string;
          case STYLE_SINGLE:
            return "'" + string.replace(/'/g, "''") + "'";
          case STYLE_LITERAL:
            return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
          case STYLE_FOLDED:
            return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
          case STYLE_DOUBLE:
            return '"' + escapeString(string, lineWidth) + '"';
          default:
            throw new YAMLException("impossible error: invalid scalar style");
        }
      })();
    }
    function blockHeader(string, indentPerLevel) {
      var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
      var clip = string[string.length - 1] === "\n";
      var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
      var chomp = keep ? "+" : clip ? "" : "-";
      return indentIndicator + chomp + "\n";
    }
    function dropEndingNewline(string) {
      return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
    }
    function foldString(string, width) {
      var lineRe = /(\n+)([^\n]*)/g;
      var result = (function() {
        var nextLF = string.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string.slice(0, nextLF), width);
      })();
      var prevMoreIndented = string[0] === "\n" || string[0] === " ";
      var moreIndented;
      var match;
      while (match = lineRe.exec(string)) {
        var prefix = match[1], line = match[2];
        moreIndented = line[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    function foldLine(line, width) {
      if (line === "" || line[0] === " ") return line;
      var breakRe = / [^ ]/g;
      var match;
      var start = 0, end, curr = 0, next = 0;
      var result = "";
      while (match = breakRe.exec(line)) {
        next = match.index;
        if (next - start > width) {
          end = curr > start ? curr : next;
          result += "\n" + line.slice(start, end);
          start = end + 1;
        }
        curr = next;
      }
      result += "\n";
      if (line.length - start > width && curr > start) {
        result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
      } else {
        result += line.slice(start);
      }
      return result.slice(1);
    }
    function escapeString(string) {
      var result = "";
      var char, nextChar;
      var escapeSeq;
      for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        if (char >= 55296 && char <= 56319) {
          nextChar = string.charCodeAt(i + 1);
          if (nextChar >= 56320 && nextChar <= 57343) {
            result += encodeHex((char - 55296) * 1024 + nextChar - 56320 + 65536);
            i++;
            continue;
          }
        }
        escapeSeq = ESCAPE_SEQUENCES[char];
        result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
      }
      return result;
    }
    function writeFlowSequence(state, level, object) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level, object[index], false, false)) {
          if (index !== 0) _result += "," + (!state.condenseFlow ? " " : "");
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = "[" + _result + "]";
    }
    function writeBlockSequence(state, level, object, compact) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level + 1, object[index], true, true)) {
          if (!compact || index !== 0) {
            _result += generateNextLine(state, level);
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            _result += "-";
          } else {
            _result += "- ";
          }
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = _result || "[]";
    }
    function writeFlowMapping(state, level, object) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (index !== 0) pairBuffer += ", ";
        if (state.condenseFlow) pairBuffer += '"';
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level, objectKey, false, false)) {
          continue;
        }
        if (state.dump.length > 1024) pairBuffer += "? ";
        pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
        if (!writeNode(state, level, objectValue, false, false)) {
          continue;
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = "{" + _result + "}";
    }
    function writeBlockMapping(state, level, object, compact) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
      if (state.sortKeys === true) {
        objectKeyList.sort();
      } else if (typeof state.sortKeys === "function") {
        objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
        throw new YAMLException("sortKeys must be a boolean or a function");
      }
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (!compact || index !== 0) {
          pairBuffer += generateNextLine(state, level);
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
          continue;
        }
        explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
        if (explicitPair) {
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += "?";
          } else {
            pairBuffer += "? ";
          }
        }
        pairBuffer += state.dump;
        if (explicitPair) {
          pairBuffer += generateNextLine(state, level);
        }
        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
          continue;
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += ":";
        } else {
          pairBuffer += ": ";
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = _result || "{}";
    }
    function detectType(state, object, explicit) {
      var _result, typeList, index, length, type, style;
      typeList = explicit ? state.explicitTypes : state.implicitTypes;
      for (index = 0, length = typeList.length; index < length; index += 1) {
        type = typeList[index];
        if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
          state.tag = explicit ? type.tag : "?";
          if (type.represent) {
            style = state.styleMap[type.tag] || type.defaultStyle;
            if (_toString.call(type.represent) === "[object Function]") {
              _result = type.represent(object, style);
            } else if (_hasOwnProperty.call(type.represent, style)) {
              _result = type.represent[style](object, style);
            } else {
              throw new YAMLException("!<" + type.tag + '> tag resolver accepts not "' + style + '" style');
            }
            state.dump = _result;
          }
          return true;
        }
      }
      return false;
    }
    function writeNode(state, level, object, block, compact, iskey) {
      state.tag = null;
      state.dump = object;
      if (!detectType(state, object, false)) {
        detectType(state, object, true);
      }
      var type = _toString.call(state.dump);
      if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
      }
      var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
      if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
      }
      if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
        compact = false;
      }
      if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = "*ref_" + duplicateIndex;
      } else {
        if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
          state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === "[object Object]") {
          if (block && Object.keys(state.dump).length !== 0) {
            writeBlockMapping(state, level, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowMapping(state, level, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object Array]") {
          var arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
          if (block && state.dump.length !== 0) {
            writeBlockSequence(state, arrayLevel, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowSequence(state, arrayLevel, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object String]") {
          if (state.tag !== "?") {
            writeScalar(state, state.dump, level, iskey);
          }
        } else {
          if (state.skipInvalid) return false;
          throw new YAMLException("unacceptable kind of an object to dump " + type);
        }
        if (state.tag !== null && state.tag !== "?") {
          state.dump = "!<" + state.tag + "> " + state.dump;
        }
      }
      return true;
    }
    function getDuplicateReferences(object, state) {
      var objects = [], duplicatesIndexes = [], index, length;
      inspectNode(object, objects, duplicatesIndexes);
      for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
        state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
    }
    function inspectNode(object, objects, duplicatesIndexes) {
      var objectKeyList, index, length;
      if (object !== null && typeof object === "object") {
        index = objects.indexOf(object);
        if (index !== -1) {
          if (duplicatesIndexes.indexOf(index) === -1) {
            duplicatesIndexes.push(index);
          }
        } else {
          objects.push(object);
          if (Array.isArray(object)) {
            for (index = 0, length = object.length; index < length; index += 1) {
              inspectNode(object[index], objects, duplicatesIndexes);
            }
          } else {
            objectKeyList = Object.keys(object);
            for (index = 0, length = objectKeyList.length; index < length; index += 1) {
              inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
            }
          }
        }
      }
    }
    function dump(input, options2) {
      options2 = options2 || {};
      var state = new State(options2);
      if (!state.noRefs) getDuplicateReferences(input, state);
      if (writeNode(state, 0, input, true, true)) return state.dump + "\n";
      return "";
    }
    function safeDump(input, options2) {
      return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options2));
    }
    module2.exports.dump = dump;
    module2.exports.safeDump = safeDump;
  }
});

// node_modules/js-yaml/lib/js-yaml.js
var require_js_yaml = __commonJS({
  "node_modules/js-yaml/lib/js-yaml.js"(exports2, module2) {
    "use strict";
    var loader = require_loader();
    var dumper = require_dumper();
    function deprecated(name) {
      return function() {
        throw new Error("Function " + name + " is deprecated and cannot be used.");
      };
    }
    module2.exports.Type = require_type();
    module2.exports.Schema = require_schema();
    module2.exports.FAILSAFE_SCHEMA = require_failsafe();
    module2.exports.JSON_SCHEMA = require_json();
    module2.exports.CORE_SCHEMA = require_core();
    module2.exports.DEFAULT_SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_FULL_SCHEMA = require_default_full();
    module2.exports.load = loader.load;
    module2.exports.loadAll = loader.loadAll;
    module2.exports.safeLoad = loader.safeLoad;
    module2.exports.safeLoadAll = loader.safeLoadAll;
    module2.exports.dump = dumper.dump;
    module2.exports.safeDump = dumper.safeDump;
    module2.exports.YAMLException = require_exception();
    module2.exports.MINIMAL_SCHEMA = require_failsafe();
    module2.exports.SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_SCHEMA = require_default_full();
    module2.exports.scan = deprecated("scan");
    module2.exports.parse = deprecated("parse");
    module2.exports.compose = deprecated("compose");
    module2.exports.addConstructor = deprecated("addConstructor");
  }
});

// node_modules/js-yaml/index.js
var require_js_yaml2 = __commonJS({
  "node_modules/js-yaml/index.js"(exports2, module2) {
    "use strict";
    var yaml2 = require_js_yaml();
    module2.exports = yaml2;
  }
});

// node_modules/gray-matter/lib/engines.js
var require_engines = __commonJS({
  "node_modules/gray-matter/lib/engines.js"(exports, module) {
    "use strict";
    var yaml = require_js_yaml2();
    var engines = exports = module.exports;
    engines.yaml = {
      parse: yaml.safeLoad.bind(yaml),
      stringify: yaml.safeDump.bind(yaml)
    };
    engines.json = {
      parse: JSON.parse.bind(JSON),
      stringify: function(obj, options2) {
        const opts = Object.assign({ replacer: null, space: 2 }, options2);
        return JSON.stringify(obj, opts.replacer, opts.space);
      }
    };
    engines.javascript = {
      parse: function parse(str, options, wrap) {
        try {
          if (wrap !== false) {
            str = "(function() {\nreturn " + str.trim() + ";\n}());";
          }
          return eval(str) || {};
        } catch (err) {
          if (wrap !== false && /(unexpected|identifier)/i.test(err.message)) {
            return parse(str, options, false);
          }
          throw new SyntaxError(err);
        }
      },
      stringify: function() {
        throw new Error("stringifying JavaScript is not supported");
      }
    };
  }
});

// node_modules/strip-bom-string/index.js
var require_strip_bom_string = __commonJS({
  "node_modules/strip-bom-string/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(str2) {
      if (typeof str2 === "string" && str2.charAt(0) === "\uFEFF") {
        return str2.slice(1);
      }
      return str2;
    };
  }
});

// node_modules/gray-matter/lib/utils.js
var require_utils = __commonJS({
  "node_modules/gray-matter/lib/utils.js"(exports2) {
    "use strict";
    var stripBom = require_strip_bom_string();
    var typeOf = require_kind_of();
    exports2.define = function(obj, key, val) {
      Reflect.defineProperty(obj, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: val
      });
    };
    exports2.isBuffer = function(val) {
      return typeOf(val) === "buffer";
    };
    exports2.isObject = function(val) {
      return typeOf(val) === "object";
    };
    exports2.toBuffer = function(input) {
      return typeof input === "string" ? Buffer.from(input) : input;
    };
    exports2.toString = function(input) {
      if (exports2.isBuffer(input)) return stripBom(String(input));
      if (typeof input !== "string") {
        throw new TypeError("expected input to be a string or buffer");
      }
      return stripBom(input);
    };
    exports2.arrayify = function(val) {
      return val ? Array.isArray(val) ? val : [val] : [];
    };
    exports2.startsWith = function(str2, substr, len) {
      if (typeof len !== "number") len = substr.length;
      return str2.slice(0, len) === substr;
    };
  }
});

// node_modules/gray-matter/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/gray-matter/lib/defaults.js"(exports2, module2) {
    "use strict";
    var engines2 = require_engines();
    var utils = require_utils();
    module2.exports = function(options2) {
      const opts = Object.assign({}, options2);
      opts.delimiters = utils.arrayify(opts.delims || opts.delimiters || "---");
      if (opts.delimiters.length === 1) {
        opts.delimiters.push(opts.delimiters[0]);
      }
      opts.language = (opts.language || opts.lang || "yaml").toLowerCase();
      opts.engines = Object.assign({}, engines2, opts.parsers, opts.engines);
      return opts;
    };
  }
});

// node_modules/gray-matter/lib/engine.js
var require_engine = __commonJS({
  "node_modules/gray-matter/lib/engine.js"(exports2, module2) {
    "use strict";
    module2.exports = function(name, options2) {
      let engine = options2.engines[name] || options2.engines[aliase(name)];
      if (typeof engine === "undefined") {
        throw new Error('gray-matter engine "' + name + '" is not registered');
      }
      if (typeof engine === "function") {
        engine = { parse: engine };
      }
      return engine;
    };
    function aliase(name) {
      switch (name.toLowerCase()) {
        case "js":
        case "javascript":
          return "javascript";
        case "coffee":
        case "coffeescript":
        case "cson":
          return "coffee";
        case "yaml":
        case "yml":
          return "yaml";
        default: {
          return name;
        }
      }
    }
  }
});

// node_modules/gray-matter/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/gray-matter/lib/stringify.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var getEngine = require_engine();
    var defaults = require_defaults();
    module2.exports = function(file, data, options2) {
      if (data == null && options2 == null) {
        switch (typeOf(file)) {
          case "object":
            data = file.data;
            options2 = {};
            break;
          case "string":
            return file;
          default: {
            throw new TypeError("expected file to be a string or object");
          }
        }
      }
      const str2 = file.content;
      const opts = defaults(options2);
      if (data == null) {
        if (!opts.data) return file;
        data = opts.data;
      }
      const language = file.language || opts.language;
      const engine = getEngine(language, opts);
      if (typeof engine.stringify !== "function") {
        throw new TypeError('expected "' + language + '.stringify" to be a function');
      }
      data = Object.assign({}, file.data, data);
      const open = opts.delimiters[0];
      const close = opts.delimiters[1];
      const matter2 = engine.stringify(data, options2).trim();
      let buf = "";
      if (matter2 !== "{}") {
        buf = newline(open) + newline(matter2) + newline(close);
      }
      if (typeof file.excerpt === "string" && file.excerpt !== "") {
        if (str2.indexOf(file.excerpt.trim()) === -1) {
          buf += newline(file.excerpt) + newline(close);
        }
      }
      return buf + newline(str2);
    };
    function newline(str2) {
      return str2.slice(-1) !== "\n" ? str2 + "\n" : str2;
    }
  }
});

// node_modules/gray-matter/lib/excerpt.js
var require_excerpt = __commonJS({
  "node_modules/gray-matter/lib/excerpt.js"(exports2, module2) {
    "use strict";
    var defaults = require_defaults();
    module2.exports = function(file, options2) {
      const opts = defaults(options2);
      if (file.data == null) {
        file.data = {};
      }
      if (typeof opts.excerpt === "function") {
        return opts.excerpt(file, opts);
      }
      const sep = file.data.excerpt_separator || opts.excerpt_separator;
      if (sep == null && (opts.excerpt === false || opts.excerpt == null)) {
        return file;
      }
      const delimiter = typeof opts.excerpt === "string" ? opts.excerpt : sep || opts.delimiters[0];
      const idx = file.content.indexOf(delimiter);
      if (idx !== -1) {
        file.excerpt = file.content.slice(0, idx);
      }
      return file;
    };
  }
});

// node_modules/gray-matter/lib/to-file.js
var require_to_file = __commonJS({
  "node_modules/gray-matter/lib/to-file.js"(exports2, module2) {
    "use strict";
    var typeOf = require_kind_of();
    var stringify = require_stringify();
    var utils = require_utils();
    module2.exports = function(file) {
      if (typeOf(file) !== "object") {
        file = { content: file };
      }
      if (typeOf(file.data) !== "object") {
        file.data = {};
      }
      if (file.contents && file.content == null) {
        file.content = file.contents;
      }
      utils.define(file, "orig", utils.toBuffer(file.content));
      utils.define(file, "language", file.language || "");
      utils.define(file, "matter", file.matter || "");
      utils.define(file, "stringify", function(data, options2) {
        if (options2 && options2.language) {
          file.language = options2.language;
        }
        return stringify(file, data, options2);
      });
      file.content = utils.toString(file.content);
      file.isEmpty = false;
      file.excerpt = "";
      return file;
    };
  }
});

// node_modules/gray-matter/lib/parse.js
var require_parse = __commonJS({
  "node_modules/gray-matter/lib/parse.js"(exports2, module2) {
    "use strict";
    var getEngine = require_engine();
    var defaults = require_defaults();
    module2.exports = function(language, str2, options2) {
      const opts = defaults(options2);
      const engine = getEngine(language, opts);
      if (typeof engine.parse !== "function") {
        throw new TypeError('expected "' + language + '.parse" to be a function');
      }
      return engine.parse(str2, opts);
    };
  }
});

// node_modules/gray-matter/index.js
var require_gray_matter = __commonJS({
  "node_modules/gray-matter/index.js"(exports2, module2) {
    "use strict";
    var fs8 = __require("fs");
    var sections = require_section_matter();
    var defaults = require_defaults();
    var stringify = require_stringify();
    var excerpt = require_excerpt();
    var engines2 = require_engines();
    var toFile = require_to_file();
    var parse2 = require_parse();
    var utils = require_utils();
    function matter2(input, options2) {
      if (input === "") {
        return { data: {}, content: input, excerpt: "", orig: input };
      }
      let file = toFile(input);
      const cached = matter2.cache[file.content];
      if (!options2) {
        if (cached) {
          file = Object.assign({}, cached);
          file.orig = cached.orig;
          return file;
        }
        matter2.cache[file.content] = file;
      }
      return parseMatter(file, options2);
    }
    function parseMatter(file, options2) {
      const opts = defaults(options2);
      const open = opts.delimiters[0];
      const close = "\n" + opts.delimiters[1];
      let str2 = file.content;
      if (opts.language) {
        file.language = opts.language;
      }
      const openLen = open.length;
      if (!utils.startsWith(str2, open, openLen)) {
        excerpt(file, opts);
        return file;
      }
      if (str2.charAt(openLen) === open.slice(-1)) {
        return file;
      }
      str2 = str2.slice(openLen);
      const len = str2.length;
      const language = matter2.language(str2, opts);
      if (language.name) {
        file.language = language.name;
        str2 = str2.slice(language.raw.length);
      }
      let closeIndex = str2.indexOf(close);
      if (closeIndex === -1) {
        closeIndex = len;
      }
      file.matter = str2.slice(0, closeIndex);
      const block = file.matter.replace(/^\s*#[^\n]+/gm, "").trim();
      if (block === "") {
        file.isEmpty = true;
        file.empty = file.content;
        file.data = {};
      } else {
        file.data = parse2(file.language, file.matter, opts);
      }
      if (closeIndex === len) {
        file.content = "";
      } else {
        file.content = str2.slice(closeIndex + close.length);
        if (file.content[0] === "\r") {
          file.content = file.content.slice(1);
        }
        if (file.content[0] === "\n") {
          file.content = file.content.slice(1);
        }
      }
      excerpt(file, opts);
      if (opts.sections === true || typeof opts.section === "function") {
        sections(file, opts.section);
      }
      return file;
    }
    matter2.engines = engines2;
    matter2.stringify = function(file, data, options2) {
      if (typeof file === "string") file = matter2(file, options2);
      return stringify(file, data, options2);
    };
    matter2.read = function(filepath, options2) {
      const str2 = fs8.readFileSync(filepath, "utf8");
      const file = matter2(str2, options2);
      file.path = filepath;
      return file;
    };
    matter2.test = function(str2, options2) {
      return utils.startsWith(str2, defaults(options2).delimiters[0]);
    };
    matter2.language = function(str2, options2) {
      const opts = defaults(options2);
      const open = opts.delimiters[0];
      if (matter2.test(str2)) {
        str2 = str2.slice(open.length);
      }
      const language = str2.slice(0, str2.search(/\r?\n/));
      return {
        raw: language,
        name: language ? language.trim() : ""
      };
    };
    matter2.cache = {};
    matter2.clearCache = function() {
      matter2.cache = {};
    };
    module2.exports = matter2;
  }
});

// node_modules/sisteransi/src/index.js
var require_src = __commonJS({
  "node_modules/sisteransi/src/index.js"(exports2, module2) {
    "use strict";
    var ESC = "\x1B";
    var CSI = `${ESC}[`;
    var beep = "\x07";
    var cursor = {
      to(x2, y3) {
        if (!y3) return `${CSI}${x2 + 1}G`;
        return `${CSI}${y3 + 1};${x2 + 1}H`;
      },
      move(x2, y3) {
        let ret = "";
        if (x2 < 0) ret += `${CSI}${-x2}D`;
        else if (x2 > 0) ret += `${CSI}${x2}C`;
        if (y3 < 0) ret += `${CSI}${-y3}A`;
        else if (y3 > 0) ret += `${CSI}${y3}B`;
        return ret;
      },
      up: (count = 1) => `${CSI}${count}A`,
      down: (count = 1) => `${CSI}${count}B`,
      forward: (count = 1) => `${CSI}${count}C`,
      backward: (count = 1) => `${CSI}${count}D`,
      nextLine: (count = 1) => `${CSI}E`.repeat(count),
      prevLine: (count = 1) => `${CSI}F`.repeat(count),
      left: `${CSI}G`,
      hide: `${CSI}?25l`,
      show: `${CSI}?25h`,
      save: `${ESC}7`,
      restore: `${ESC}8`
    };
    var scroll = {
      up: (count = 1) => `${CSI}S`.repeat(count),
      down: (count = 1) => `${CSI}T`.repeat(count)
    };
    var erase = {
      screen: `${CSI}2J`,
      up: (count = 1) => `${CSI}1J`.repeat(count),
      down: (count = 1) => `${CSI}J`.repeat(count),
      line: `${CSI}2K`,
      lineEnd: `${CSI}K`,
      lineStart: `${CSI}1K`,
      lines(count) {
        let clear = "";
        for (let i = 0; i < count; i++)
          clear += this.line + (i < count - 1 ? cursor.up() : "");
        if (count)
          clear += cursor.left;
        return clear;
      }
    };
    module2.exports = { cursor, scroll, erase, beep };
  }
});

// src/index.ts
var import_picocolors6 = __toESM(require_picocolors(), 1);
import fs7 from "fs";
import path18 from "path";

// src/adapters/antigravity.ts
import os from "os";
import path3 from "path";

// src/core/ir.ts
import path from "path";
var FORMAT_IDS = [
  "cursor",
  "claude",
  "opencode",
  "codex",
  "antigravity",
  "windsurf",
  "copilot",
  "cline",
  "roo"
];
var FORMAT_META = {
  cursor: {
    id: "cursor",
    label: "Cursor (.cursor/)",
    configDir: ".cursor",
    rootRuleFile: ".cursorrules"
  },
  claude: {
    id: "claude",
    label: "Claude Code (.claude/)",
    configDir: ".claude",
    rootRuleFile: "CLAUDE.md"
  },
  opencode: {
    id: "opencode",
    label: "OpenCode (.opencode/)",
    configDir: ".opencode",
    rootRuleFile: "AGENTS.md"
  },
  codex: {
    id: "codex",
    label: "Codex CLI (.codex/)",
    configDir: ".codex",
    rootRuleFile: "AGENTS.md"
  },
  antigravity: {
    id: "antigravity",
    label: "Antigravity (.agents/)",
    configDir: ".agents",
    rootRuleFile: "GEMINI.md"
  },
  windsurf: {
    id: "windsurf",
    label: "Windsurf (.windsurf/)",
    configDir: ".windsurf",
    rootRuleFile: ".windsurfrules"
  },
  copilot: {
    id: "copilot",
    label: "Copilot (.github/skills/)",
    configDir: ".github",
    rootRuleFile: ".github/copilot-instructions.md"
  },
  cline: {
    id: "cline",
    label: "Cline (.cline/)",
    configDir: ".cline",
    rootRuleFile: ".clinerules"
  },
  roo: {
    id: "roo",
    label: "Roo Code (.roo/)",
    configDir: ".roo",
    rootRuleFile: ".roorules"
  }
};
var TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
  ".md",
  ".mdc",
  ".txt",
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".ps1",
  ".bat",
  ".cmd",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".cfg",
  ".conf",
  ".py",
  ".rb",
  ".go",
  ".rs",
  ".java",
  ".kt",
  ".swift",
  ".c",
  ".cpp",
  ".h",
  ".hpp",
  ".cs",
  ".php",
  ".sql",
  ".css",
  ".scss",
  ".less",
  ".html",
  ".htm",
  ".xml",
  ".svg",
  ".env",
  ".gitignore",
  ".dockerignore"
]);
function normalizePosixPath(inputPath) {
  return inputPath.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^(?:\.\/)+/, "").replace(/^\/+/, "").replace(/\/+$/, "");
}
function resolveWithin(root, relativePath) {
  const resolvedRoot = path.resolve(root);
  const target = path.resolve(resolvedRoot, relativePath);
  if (target !== resolvedRoot && !target.startsWith(resolvedRoot + path.sep)) {
    throw new Error(
      `Refusing path outside the install directory: "${relativePath}".`
    );
  }
  return target;
}
var CONFIG_ASSET_FILES = /* @__PURE__ */ new Set([
  "settings.json",
  "settings.local.json",
  "mcp.json",
  ".mcp.json"
]);
function isConfigAssetPath(relativePath) {
  const p2 = normalizePosixPath(relativePath).replace(/^\.\//, "");
  return CONFIG_ASSET_FILES.has(p2) || p2.startsWith("hooks/");
}
function isTextFile(filePath, content) {
  const normalized = normalizePosixPath(filePath).toLowerCase();
  const lastDot = normalized.lastIndexOf(".");
  if (lastDot !== -1) {
    const ext = normalized.slice(lastDot);
    if (TEXT_EXTENSIONS.has(ext)) {
      return true;
    }
  }
  const sampleLen = Math.min(content.length, 8192);
  for (let i = 0; i < sampleLen; i++) {
    if (content[i] === 0) {
      return false;
    }
  }
  return true;
}

// src/adapters/types.ts
var import_gray_matter = __toESM(require_gray_matter(), 1);
import path2 from "path";

// src/core/rewriter.ts
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function formatSkillDescriptionForSkillMd(skill) {
  const base = skill.description.trim();
  const globs = skill.globs?.map((g2) => g2.trim()).filter(Boolean) ?? [];
  if (globs.length === 0) {
    return base;
  }
  const globText = globs.join(", ");
  if (base.includes(globText)) {
    return base;
  }
  const hint = `(Applies to: ${globText})`;
  return base ? `${base} ${hint}` : hint;
}
function rewritePaths(text, sourceFormat, targetFormat) {
  if (!text) {
    return text;
  }
  let result = text;
  if (sourceFormat === "antigravity") {
    result = result.replace(/\.agent\/skills\//g, ".agents/skills/");
    result = result.replace(/(^|[^A-Za-z0-9_.-])\.agent\//g, "$1.agents/");
  }
  if (sourceFormat === targetFormat) {
    return result;
  }
  const sourceMeta = FORMAT_META[sourceFormat];
  const targetMeta = FORMAT_META[targetFormat];
  if (sourceFormat === "cursor") {
    result = result.replace(
      /\.cursor\/rules\/([^/\s`'")\]]+)\.mdc\b/g,
      `${targetMeta.configDir}/skills/$1/SKILL.md`
    );
    result = result.replace(
      /\.cursor\/rules\/([^/\s`'")\]]+)\//g,
      `${targetMeta.configDir}/skills/$1/`
    );
    result = result.replace(
      /\.cursor\/rules\//g,
      `${targetMeta.configDir}/skills/`
    );
  } else if (targetFormat === "cursor") {
    const sourceSkillsRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/([^/\\s\`'")\\]]+)\\/`,
      "g"
    );
    result = result.replace(sourceSkillsRe, ".cursor/rules/$1/");
    const sourceSkillsRootRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/`,
      "g"
    );
    result = result.replace(sourceSkillsRootRe, ".cursor/rules/");
    result = result.replace(
      /\.cursor\/rules\/([^/\s`'")\]]+)\/SKILL\.md\b/g,
      ".cursor/rules/$1.mdc"
    );
  } else {
    const sourceSkillsRe = new RegExp(
      `${escapeRegex(sourceMeta.configDir)}\\/skills\\/`,
      "g"
    );
    result = result.replace(sourceSkillsRe, `${targetMeta.configDir}/skills/`);
  }
  if (sourceFormat !== "copilot") {
    const configDirRe = new RegExp(
      `(^|[^A-Za-z0-9_.-])${escapeRegex(sourceMeta.configDir)}\\/`,
      "g"
    );
    result = result.replace(configDirRe, `$1${targetMeta.configDir}/`);
  }
  if (sourceMeta.rootRuleFile !== targetMeta.rootRuleFile) {
    const rootRuleRe = new RegExp(
      `(^|[^A-Za-z0-9_.-])${escapeRegex(sourceMeta.rootRuleFile)}(?=$|[^A-Za-z0-9_.-])`,
      "g"
    );
    result = result.replace(rootRuleRe, `$1${targetMeta.rootRuleFile}`);
  }
  return result;
}
function rewriteAsset(asset, sourceFormat, targetFormat) {
  if (!asset.isText) {
    return {
      relativePath: asset.relativePath,
      content: Buffer.from(asset.content),
      isText: false
    };
  }
  const rewritten = rewritePaths(
    asset.content.toString("utf8"),
    sourceFormat,
    targetFormat
  );
  return {
    relativePath: asset.relativePath,
    content: Buffer.from(rewritten, "utf8"),
    isText: true
  };
}
function rewritePackage(pkg, targetFormat) {
  const skills = pkg.skills.map((skill) => ({
    ...skill,
    globs: skill.globs ? [...skill.globs] : void 0,
    allowedTools: Array.isArray(skill.allowedTools) ? [...skill.allowedTools] : skill.allowedTools,
    extraFrontmatter: skill.extraFrontmatter ? { ...skill.extraFrontmatter } : void 0,
    body: rewritePaths(skill.body, pkg.sourceFormat, targetFormat),
    assets: skill.assets.map(
      (asset) => rewriteAsset(asset, pkg.sourceFormat, targetFormat)
    )
  }));
  const rootRules = pkg.rootRules.map((rule) => ({
    sourceFilename: rule.sourceFilename,
    content: rewritePaths(rule.content, pkg.sourceFormat, targetFormat)
  }));
  const sharedAssets = pkg.sharedAssets.map(
    (asset) => rewriteAsset(asset, pkg.sourceFormat, targetFormat)
  );
  return {
    sourceFormat: pkg.sourceFormat,
    sourceLabel: pkg.sourceLabel,
    skills,
    rootRules,
    sharedAssets
  };
}

// src/adapters/types.ts
function isRootRuleOnly(detection) {
  return detection.skillCount === 0 && detection.matchedPaths.length === 1 && detection.matchedPaths[0] === FORMAT_META[detection.format].rootRuleFile;
}
function parseMarkdownWithFrontmatter(raw) {
  const parsed = (0, import_gray_matter.default)(raw);
  return {
    data: { ...parsed.data },
    body: parsed.content.replace(/^\r?\n/, "")
  };
}
function serializeMarkdownWithFrontmatter(body, frontmatter) {
  const cleanData = {};
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value !== void 0) {
      cleanData[key] = value;
    }
  }
  const normalizedBody = body.replace(/\r\n/g, "\n").replace(/^\n+/, "");
  const withTrailingNewline = normalizedBody.length === 0 ? "" : normalizedBody.endsWith("\n") ? normalizedBody : `${normalizedBody}
`;
  if (Object.keys(cleanData).length === 0) {
    return Buffer.from(withTrailingNewline, "utf8");
  }
  const output = import_gray_matter.default.stringify({ content: withTrailingNewline }, cleanData);
  const ensured = output.endsWith("\n") ? output : `${output}
`;
  return Buffer.from(ensured, "utf8");
}
function normalizeGlobs(value) {
  if (Array.isArray(value)) {
    const items = value.map((item) => String(item).trim()).filter(Boolean);
    return items.length > 0 ? items : void 0;
  }
  if (typeof value === "string") {
    const items = value.split(",").map((item) => item.trim()).filter(Boolean);
    return items.length > 0 ? items : void 0;
  }
  return void 0;
}
function sanitizeSkillName(raw) {
  const segments = normalizePosixPath(raw).split("/").map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, "-")).filter((segment) => segment && segment !== "." && segment !== "..");
  return segments.join("/") || "skill";
}
function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
function buildDetection(format, evidence) {
  const meta = FORMAT_META[format];
  const matchedPaths = [...evidence.skills, ...evidence.configPaths];
  if (evidence.hasRootRule) {
    matchedPaths.push(meta.rootRuleFile);
  }
  const summary = [];
  if (evidence.skills.length > 0) {
    summary.push(`${plural(evidence.skills.length, "skill")} found`);
  }
  if (evidence.hasRootRule) {
    summary.push(meta.rootRuleFile);
  }
  if (summary.length === 0) {
    summary.push(plural(evidence.configPaths.length, "config asset"));
  }
  return {
    format,
    label: meta.label,
    skillCount: evidence.skills.length,
    hasRootRule: evidence.hasRootRule,
    summary: `${meta.label} \u2014 ${summary.join(", ")}`,
    matchedPaths,
    allowLoose: evidence.allowLoose
  };
}
function detectSkillMdFormat(format, files, options2) {
  const meta = FORMAT_META[format];
  const prefix = `${meta.configDir}/skills/`;
  const configPrefix = `${meta.configDir}/`;
  const skillPaths = [];
  const otherConfigPaths = [];
  let hasRootRule = false;
  for (const file of files) {
    const p2 = normalizePosixPath(file.path);
    if (p2.startsWith(prefix) && p2.endsWith("/SKILL.md")) {
      skillPaths.push(p2);
    } else if (p2 === meta.rootRuleFile) {
      hasRootRule = true;
    } else if (p2.startsWith(configPrefix)) {
      otherConfigPaths.push(p2);
    }
  }
  let allowLoose = false;
  if (options2?.allowLoose && skillPaths.length === 0 && otherConfigPaths.length === 0) {
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2 === "SKILL.md" || p2.endsWith("/SKILL.md")) {
        skillPaths.push(p2);
        allowLoose = true;
      }
    }
  }
  if (skillPaths.length === 0 && otherConfigPaths.length === 0 && !hasRootRule) {
    return null;
  }
  return buildDetection(format, {
    skills: skillPaths,
    configPaths: otherConfigPaths,
    hasRootRule,
    allowLoose
  });
}
function parseSkillMdFormat(format, files, options2) {
  const meta = FORMAT_META[format];
  const skillsPrefix = `${meta.configDir}/skills/`;
  const configPrefix = `${meta.configDir}/`;
  const skillsMap = /* @__PURE__ */ new Map();
  const rootRules = [];
  const sharedAssets = [];
  const skillRoots = [];
  for (const file of files) {
    const p2 = normalizePosixPath(file.path);
    if (p2.startsWith(skillsPrefix) && p2.endsWith("/SKILL.md")) {
      const rest = p2.slice(skillsPrefix.length);
      const skillDir = rest.slice(0, -"/SKILL.md".length);
      if (!skillDir) continue;
      skillRoots.push({
        skillName: skillDir,
        rootDir: `${skillsPrefix}${skillDir}/`,
        file
      });
    }
  }
  if (options2?.allowLoose && skillRoots.length === 0) {
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2 !== "SKILL.md" && !p2.endsWith("/SKILL.md")) {
        continue;
      }
      const dir = p2 === "SKILL.md" ? "" : p2.slice(0, -"SKILL.md".length);
      const folder = dir ? dir.slice(0, -1).split("/").pop() ?? "" : "";
      skillRoots.push({
        skillName: folder ? sanitizeSkillName(folder) : "",
        rootDir: dir,
        file
      });
    }
  }
  const entryPaths = new Set(
    skillRoots.map((sr) => normalizePosixPath(sr.file.path))
  );
  for (const entry of skillRoots) {
    const raw = entry.file.content.toString("utf8");
    let parsed;
    try {
      parsed = parseMarkdownWithFrontmatter(raw);
    } catch (err) {
      throw new Error(
        `Could not parse frontmatter in "${entry.file.path}": ${err instanceof Error ? err.message : String(err)}`
      );
    }
    const { data, body } = parsed;
    const {
      name,
      description,
      "allowed-tools": allowedToolsRaw,
      globs,
      alwaysApply,
      ...rest
    } = data;
    const skillName = typeof name === "string" && name.trim() ? sanitizeSkillName(name.trim()) : sanitizeSkillName(
      entry.skillName || options2?.subpathName || "skill"
    );
    let allowedTools;
    if (typeof allowedToolsRaw === "string" && allowedToolsRaw.trim()) {
      allowedTools = allowedToolsRaw.trim();
    } else if (Array.isArray(allowedToolsRaw)) {
      allowedTools = allowedToolsRaw.map((t) => String(t).trim()).filter(Boolean);
    }
    skillsMap.set(entry.rootDir || "__ROOT__", {
      name: skillName,
      description: typeof description === "string" ? description.trim() : "",
      body,
      globs: normalizeGlobs(globs),
      alwaysApply: typeof alwaysApply === "boolean" ? alwaysApply : void 0,
      allowedTools,
      assets: [],
      extraFrontmatter: Object.keys(rest).length > 0 ? rest : void 0
    });
  }
  for (const file of files) {
    const p2 = normalizePosixPath(file.path);
    if (p2 === meta.rootRuleFile) {
      rootRules.push({
        sourceFilename: meta.rootRuleFile,
        content: file.content.toString("utf8")
      });
      continue;
    }
    if (entryPaths.has(p2)) {
      continue;
    }
    let owner;
    for (const sr of skillRoots) {
      if (!sr.rootDir || !p2.startsWith(sr.rootDir)) continue;
      if (!owner || sr.rootDir.length > owner.rootDir.length) {
        owner = sr;
      }
    }
    if (owner) {
      const rel = p2.slice(owner.rootDir.length);
      const skill = skillsMap.get(owner.rootDir);
      if (skill && rel) {
        skill.assets.push({
          relativePath: rel,
          content: file.content,
          isText: isTextFile(p2, file.content)
        });
        continue;
      }
    }
    if (skillRoots.some((sr) => !sr.rootDir) && !p2.startsWith(configPrefix)) {
      const skill = skillsMap.get("__ROOT__");
      if (skill) {
        skill.assets.push({
          relativePath: p2,
          content: file.content,
          isText: isTextFile(p2, file.content)
        });
        continue;
      }
    }
    if (p2.startsWith(configPrefix)) {
      const rel = p2.slice(configPrefix.length);
      if (rel) {
        sharedAssets.push({
          relativePath: rel,
          content: file.content,
          isText: isTextFile(p2, file.content)
        });
      }
    }
  }
  return {
    sourceFormat: format,
    sourceLabel: meta.label,
    skills: Array.from(skillsMap.values()),
    rootRules,
    sharedAssets
  };
}
function emitSkillMdFormat(format, pkg, options2, includeAllowedTools = false) {
  const meta = FORMAT_META[format];
  const isGlobal = Boolean(options2?.global);
  const basePrefix = isGlobal ? "" : `${meta.configDir}/`;
  const emitted = [];
  for (const skill of pkg.skills) {
    const frontmatter = {
      name: skill.name,
      description: formatSkillDescriptionForSkillMd(skill)
    };
    if (includeAllowedTools && skill.allowedTools !== void 0) {
      frontmatter["allowed-tools"] = skill.allowedTools;
    }
    const skillDir = `${basePrefix}skills/${skill.name}`;
    emitted.push({
      relativePath: `${skillDir}/SKILL.md`,
      content: serializeMarkdownWithFrontmatter(skill.body, frontmatter),
      targetFormat: format
    });
    for (const asset of skill.assets) {
      emitted.push({
        relativePath: `${skillDir}/${normalizePosixPath(asset.relativePath)}`,
        content: asset.content,
        targetFormat: format
      });
    }
  }
  for (const asset of pkg.sharedAssets) {
    emitted.push({
      relativePath: `${basePrefix}${normalizePosixPath(asset.relativePath)}`,
      content: asset.content,
      targetFormat: format
    });
  }
  for (const rule of pkg.rootRules) {
    const normalized = rule.content.replace(/\r\n/g, "\n");
    const content = normalized.endsWith("\n") ? normalized : `${normalized}
`;
    emitted.push({
      relativePath: isGlobal ? path2.posix.basename(meta.rootRuleFile) : meta.rootRuleFile,
      content: Buffer.from(content, "utf8"),
      targetFormat: format
    });
  }
  return emitted;
}

// src/adapters/antigravity.ts
function normalizeAgentAliasPaths(files) {
  const canonical = new Set(files.map((file) => normalizePosixPath(file.path)));
  return files.flatMap((file) => {
    const normalized = normalizePosixPath(file.path);
    if (!normalized.startsWith(".agent/")) {
      return [file];
    }
    const alias = `.agents/${normalized.slice(".agent/".length)}`;
    if (canonical.has(alias)) {
      return [];
    }
    return [{ path: alias, content: file.content }];
  });
}
var antigravityAdapter = {
  id: "antigravity",
  label: "Antigravity (.agents/)",
  configDir: ".agents",
  rootRuleFile: "GEMINI.md",
  getGlobalDir() {
    return path3.join(os.homedir(), ".gemini", "config");
  },
  detect(files, options2) {
    return detectSkillMdFormat(
      "antigravity",
      normalizeAgentAliasPaths(files),
      options2
    );
  },
  parse(files, options2) {
    return parseSkillMdFormat(
      "antigravity",
      normalizeAgentAliasPaths(files),
      options2
    );
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("antigravity", pkg, options2, false);
  }
};

// src/adapters/claude.ts
import os2 from "os";
import path4 from "path";
var claudeAdapter = {
  id: "claude",
  label: "Claude Code (.claude/)",
  configDir: ".claude",
  rootRuleFile: "CLAUDE.md",
  getGlobalDir() {
    return path4.join(os2.homedir(), ".claude");
  },
  detect(files, options2) {
    return detectSkillMdFormat("claude", files, options2);
  },
  parse(files, options2) {
    return parseSkillMdFormat("claude", files, options2);
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("claude", pkg, options2, true);
  }
};

// src/adapters/cline.ts
import os3 from "os";
import path5 from "path";
var clineAdapter = {
  id: "cline",
  label: "Cline (.cline/)",
  configDir: ".cline",
  rootRuleFile: ".clinerules",
  getGlobalDir() {
    return path5.join(os3.homedir(), ".cline");
  },
  detect(files, options2) {
    return detectSkillMdFormat("cline", files, options2);
  },
  parse(files, options2) {
    return parseSkillMdFormat("cline", files, options2);
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("cline", pkg, options2, false);
  }
};

// src/adapters/codex.ts
import os4 from "os";
import path6 from "path";
var codexAdapter = {
  id: "codex",
  label: "Codex CLI (.codex/)",
  configDir: ".codex",
  rootRuleFile: "AGENTS.md",
  getGlobalDir() {
    return path6.join(os4.homedir(), ".codex");
  },
  detect(files, options2) {
    return detectSkillMdFormat("codex", files, options2);
  },
  parse(files, options2) {
    return parseSkillMdFormat("codex", files, options2);
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("codex", pkg, options2, false);
  }
};

// src/adapters/copilot.ts
import os5 from "os";
import path7 from "path";
function filterCopilotFiles(files, allowLoose) {
  return files.filter((file) => {
    const p2 = normalizePosixPath(file.path);
    if (p2.startsWith(".github/skills/") || p2 === ".github/copilot-instructions.md") {
      return true;
    }
    return Boolean(allowLoose) && !p2.startsWith(".github/");
  });
}
var copilotAdapter = {
  id: "copilot",
  label: "Copilot (.github/skills/)",
  configDir: ".github",
  rootRuleFile: ".github/copilot-instructions.md",
  getGlobalDir() {
    return path7.join(os5.homedir(), ".copilot");
  },
  detect(files, options2) {
    return detectSkillMdFormat(
      "copilot",
      filterCopilotFiles(files, options2?.allowLoose),
      options2
    );
  },
  parse(files, options2) {
    return parseSkillMdFormat(
      "copilot",
      filterCopilotFiles(files, options2?.allowLoose),
      options2
    );
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("copilot", pkg, options2, false);
  }
};

// src/adapters/cursor.ts
import os6 from "os";
import path8 from "path";
var RULES_PREFIX = ".cursor/rules/";
var CONFIG_PREFIX = ".cursor/";
var ROOT_RULE_FILE = ".cursorrules";
var cursorAdapter = {
  id: "cursor",
  label: "Cursor (.cursor/)",
  configDir: ".cursor",
  rootRuleFile: ROOT_RULE_FILE,
  getGlobalDir() {
    return path8.join(os6.homedir(), ".cursor");
  },
  detect(files, options2) {
    const rulePaths = [];
    const otherConfigPaths = [];
    let hasRootRule = false;
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2.startsWith(RULES_PREFIX) && p2.endsWith(".mdc")) {
        rulePaths.push(p2);
      } else if (p2.startsWith(CONFIG_PREFIX)) {
        otherConfigPaths.push(p2);
      } else if (p2 === ROOT_RULE_FILE) {
        hasRootRule = true;
      }
    }
    let allowLoose = false;
    if (options2?.allowLoose && rulePaths.length === 0 && otherConfigPaths.length === 0) {
      for (const file of files) {
        const p2 = normalizePosixPath(file.path);
        if (p2.endsWith(".mdc")) {
          rulePaths.push(p2);
          allowLoose = true;
        }
      }
    }
    if (rulePaths.length === 0 && otherConfigPaths.length === 0 && !hasRootRule) {
      return null;
    }
    return buildDetection("cursor", {
      skills: rulePaths,
      configPaths: otherConfigPaths,
      hasRootRule,
      allowLoose
    });
  },
  parse(files, options2) {
    const skillsByName = /* @__PURE__ */ new Map();
    const rootRules = [];
    const sharedAssets = [];
    const mdcFiles = [];
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (p2.startsWith(RULES_PREFIX) && p2.endsWith(".mdc")) {
        const skillName = p2.slice(RULES_PREFIX.length, -".mdc".length);
        if (skillName) {
          mdcFiles.push({ skillName, file });
        }
      }
    }
    if (options2?.allowLoose && mdcFiles.length === 0) {
      for (const file of files) {
        const p2 = normalizePosixPath(file.path);
        if (p2.endsWith(".mdc")) {
          const skillName = p2.slice(0, -".mdc".length);
          if (skillName) {
            mdcFiles.push({ skillName, file });
          }
        }
      }
    }
    for (const entry of mdcFiles) {
      const raw = entry.file.content.toString("utf8");
      const { data, body } = parseMarkdownWithFrontmatter(raw);
      const { description, globs, alwaysApply, ...rest } = data;
      skillsByName.set(entry.skillName, {
        name: entry.skillName,
        description: typeof description === "string" ? description.trim() : "",
        body,
        globs: normalizeGlobs(globs),
        alwaysApply: typeof alwaysApply === "boolean" ? alwaysApply : void 0,
        assets: [],
        extraFrontmatter: Object.keys(rest).length > 0 ? rest : void 0
      });
    }
    const mdcPathSet = new Set(mdcFiles.map((m2) => normalizePosixPath(m2.file.path)));
    for (const file of files) {
      const p2 = normalizePosixPath(file.path);
      if (mdcPathSet.has(p2)) {
        continue;
      }
      if (p2 === ROOT_RULE_FILE) {
        rootRules.push({
          sourceFilename: ROOT_RULE_FILE,
          content: file.content.toString("utf8")
        });
        continue;
      }
      if (p2.startsWith(RULES_PREFIX)) {
        const rest = p2.slice(RULES_PREFIX.length);
        let attached = false;
        for (const [skillName, skill] of skillsByName.entries()) {
          const companionPrefix = `${skillName}/`;
          if (rest.startsWith(companionPrefix)) {
            const rel = rest.slice(companionPrefix.length);
            if (rel) {
              skill.assets.push({
                relativePath: rel,
                content: file.content,
                isText: isTextFile(p2, file.content)
              });
              attached = true;
              break;
            }
          }
        }
        if (attached) {
          continue;
        }
      }
      if (p2.startsWith(CONFIG_PREFIX)) {
        const rel = p2.slice(CONFIG_PREFIX.length);
        if (rel) {
          sharedAssets.push({
            relativePath: rel,
            content: file.content,
            isText: isTextFile(p2, file.content)
          });
        }
      }
    }
    return {
      sourceFormat: "cursor",
      sourceLabel: this.label,
      skills: Array.from(skillsByName.values()),
      rootRules,
      sharedAssets
    };
  },
  emit(pkg, options2) {
    const isGlobal = Boolean(options2?.global);
    const basePrefix = isGlobal ? "" : CONFIG_PREFIX;
    const emitted = [];
    for (const skill of pkg.skills) {
      const frontmatter = {
        description: skill.description
      };
      if (skill.globs && skill.globs.length > 0) {
        frontmatter.globs = skill.globs.join(", ");
      }
      frontmatter.alwaysApply = skill.alwaysApply ?? false;
      emitted.push({
        relativePath: `${basePrefix}rules/${skill.name}.mdc`,
        content: serializeMarkdownWithFrontmatter(skill.body, frontmatter),
        targetFormat: "cursor"
      });
      for (const asset of skill.assets) {
        emitted.push({
          relativePath: `${basePrefix}rules/${skill.name}/${normalizePosixPath(asset.relativePath)}`,
          content: asset.content,
          targetFormat: "cursor"
        });
      }
    }
    for (const asset of pkg.sharedAssets) {
      emitted.push({
        relativePath: `${basePrefix}${normalizePosixPath(asset.relativePath)}`,
        content: asset.content,
        targetFormat: "cursor"
      });
    }
    for (const rule of pkg.rootRules) {
      const normalized = rule.content.replace(/\r\n/g, "\n");
      const content = normalized.endsWith("\n") ? normalized : `${normalized}
`;
      emitted.push({
        relativePath: ROOT_RULE_FILE,
        content: Buffer.from(content, "utf8"),
        targetFormat: "cursor"
      });
    }
    return emitted;
  }
};

// src/adapters/opencode.ts
import os7 from "os";
import path9 from "path";
var opencodeAdapter = {
  id: "opencode",
  label: "OpenCode (.opencode/)",
  configDir: ".opencode",
  rootRuleFile: "AGENTS.md",
  getGlobalDir() {
    return path9.join(os7.homedir(), ".config", "opencode");
  },
  detect(files, options2) {
    return detectSkillMdFormat("opencode", files, options2);
  },
  parse(files, options2) {
    return parseSkillMdFormat("opencode", files, options2);
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("opencode", pkg, options2, false);
  }
};

// src/adapters/roo.ts
import os8 from "os";
import path10 from "path";
var rooAdapter = {
  id: "roo",
  label: "Roo Code (.roo/)",
  configDir: ".roo",
  rootRuleFile: ".roorules",
  getGlobalDir() {
    return path10.join(os8.homedir(), ".roo");
  },
  detect(files, options2) {
    return detectSkillMdFormat("roo", files, options2);
  },
  parse(files, options2) {
    return parseSkillMdFormat("roo", files, options2);
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("roo", pkg, options2, false);
  }
};

// src/adapters/windsurf.ts
import os9 from "os";
import path11 from "path";
var windsurfAdapter = {
  id: "windsurf",
  label: "Windsurf (.windsurf/)",
  configDir: ".windsurf",
  rootRuleFile: ".windsurfrules",
  getGlobalDir() {
    return path11.join(os9.homedir(), ".codeium", "windsurf");
  },
  detect(files, options2) {
    return detectSkillMdFormat("windsurf", files, options2);
  },
  parse(files, options2) {
    return parseSkillMdFormat("windsurf", files, options2);
  },
  emit(pkg, options2) {
    return emitSkillMdFormat("windsurf", pkg, options2, false);
  }
};

// src/adapters/registry.ts
var ADAPTERS = [
  cursorAdapter,
  claudeAdapter,
  opencodeAdapter,
  codexAdapter,
  antigravityAdapter,
  windsurfAdapter,
  copilotAdapter,
  clineAdapter,
  rooAdapter
];
var ADAPTER_MAP = {
  cursor: cursorAdapter,
  claude: claudeAdapter,
  opencode: opencodeAdapter,
  codex: codexAdapter,
  antigravity: antigravityAdapter,
  windsurf: windsurfAdapter,
  copilot: copilotAdapter,
  cline: clineAdapter,
  roo: rooAdapter
};
function getAdapter(id) {
  return ADAPTER_MAP[id];
}
var SHARED_ROOT_RULE_FORMATS = /* @__PURE__ */ new Set([
  "opencode",
  "codex",
  "antigravity"
]);
function isWeakRootRuleOnly(detection) {
  return SHARED_ROOT_RULE_FORMATS.has(detection.format) && isRootRuleOnly(detection);
}
function detectFormats(files, options2) {
  const strictResults = [];
  for (const adapter of ADAPTERS) {
    const detected = adapter.detect(files, { ...options2, allowLoose: false });
    if (detected) {
      strictResults.push(detected);
    }
  }
  if (!strictResults.some((r) => r.skillCount > 0)) {
    const looseResults = [];
    for (const candidate of [claudeAdapter, cursorAdapter]) {
      const detected = candidate.detect(files, { ...options2, allowLoose: true });
      if (detected) {
        looseResults.push(detected);
      }
    }
    if (looseResults.length > 0) {
      return looseResults;
    }
  }
  if (strictResults.length > 0) {
    const winners = strictResults.filter(
      (r) => !SHARED_ROOT_RULE_FORMATS.has(r.format) || !isRootRuleOnly(r)
    );
    return winners.length > 0 ? winners : strictResults;
  }
  return [];
}

// src/core/detector.ts
import fs from "fs";
import path12 from "path";
var IGNORED_DIRS = /* @__PURE__ */ new Set([".git", "node_modules", "dist"]);
var KNOWN_CONFIG_DIRS = [
  ".cursor",
  ".claude",
  ".opencode",
  ".codex",
  ".agents",
  ".agent",
  ".windsurf",
  ".cline",
  ".roo"
];
var KNOWN_ROOT_FILES = /* @__PURE__ */ new Set([
  ".cursorrules",
  "CLAUDE.md",
  "AGENTS.md",
  "GEMINI.md",
  ".windsurfrules",
  ".clinerules",
  ".roorules",
  "SKILL.md"
]);
function pathHasKind(targetPath, kind = "any") {
  let stats;
  try {
    stats = fs.statSync(targetPath);
  } catch {
    return false;
  }
  if (kind === "dir") return stats.isDirectory();
  if (kind === "file") return stats.isFile();
  return true;
}
var PROJECT_MARKERS = {
  cursor: [
    { segments: [".cursor"], kind: "any" },
    { segments: [".cursorrules"], kind: "any" }
  ],
  claude: [
    { segments: [".claude"], kind: "any" },
    { segments: ["CLAUDE.md"], kind: "any" }
  ],
  opencode: [{ segments: [".opencode"], kind: "any" }],
  codex: [{ segments: [".codex"], kind: "any" }],
  // `.agents/` only. GEMINI.md is shared with Gemini CLI, so on its own it
  // cannot say which tool the project belongs to.
  antigravity: [
    { segments: [".agents"], kind: "any" },
    { segments: [".agent"], kind: "any" }
  ],
  windsurf: [
    { segments: [".windsurf"], kind: "any" },
    { segments: [".windsurfrules"], kind: "any" }
  ],
  // Copilot shares `.github/` with workflows, so only these two paths count.
  copilot: [
    { segments: [".github", "skills"], kind: "dir" },
    { segments: [".github", "copilot-instructions.md"], kind: "file" }
  ],
  cline: [
    { segments: [".cline"], kind: "any" },
    { segments: [".clinerules"], kind: "any" }
  ],
  roo: [
    { segments: [".roo"], kind: "any" },
    { segments: [".roorules"], kind: "any" }
  ]
};
function hasProjectMarker(rootDir, format) {
  return PROJECT_MARKERS[format].some(
    (marker) => pathHasKind(path12.join(rootDir, ...marker.segments), marker.kind)
  );
}
function maybeExcludeSource(formats, options2) {
  if (options2.excludeSourceWhenLocal && options2.sourceFormat) {
    return formats.filter((id) => id !== options2.sourceFormat);
  }
  return formats;
}
function detectTargetFormats(options2) {
  if (!options2.global) {
    const resolvedDir = path12.resolve(options2.targetDir);
    if (pathHasKind(resolvedDir, "dir")) {
      const projectFormats = FORMAT_IDS.filter(
        (id) => hasProjectMarker(resolvedDir, id)
      );
      const filtered = maybeExcludeSource(projectFormats, options2);
      if (filtered.length > 0) {
        return { formats: filtered, scope: "project" };
      }
    }
  }
  const resolveGlobal = options2.globalDirResolver ?? ((id) => getAdapter(id).getGlobalDir());
  const globalFormats = FORMAT_IDS.filter(
    (id) => pathHasKind(resolveGlobal(id))
  );
  const filteredGlobal = maybeExcludeSource(globalFormats, options2);
  if (filteredGlobal.length > 0) {
    return { formats: filteredGlobal, scope: "global" };
  }
  return { formats: [], scope: "none" };
}
function collectDirFiles(rootDir, subDir, out) {
  const startDir = path12.join(rootDir, subDir);
  if (!pathHasKind(startDir, "dir")) {
    return;
  }
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) {
          continue;
        }
        walk(path12.join(currentDir, entry.name));
      } else if (entry.isFile()) {
        const abs = path12.join(currentDir, entry.name);
        const rel = normalizePosixPath(path12.relative(rootDir, abs));
        if (rel) {
          out.push({ path: rel, content: fs.readFileSync(abs) });
        }
      }
    }
  }
  walk(startDir);
}
function detectLocalProjectSource(dir) {
  const resolvedDir = path12.resolve(dir);
  if (!pathHasKind(resolvedDir, "dir")) {
    return null;
  }
  const files = [];
  for (const configDir of KNOWN_CONFIG_DIRS) {
    collectDirFiles(resolvedDir, configDir, files);
  }
  collectDirFiles(resolvedDir, path12.join(".github", "skills"), files);
  const copilotInstructionsPath = path12.join(
    resolvedDir,
    ".github",
    "copilot-instructions.md"
  );
  if (pathHasKind(copilotInstructionsPath, "file")) {
    files.push({
      path: ".github/copilot-instructions.md",
      content: fs.readFileSync(copilotInstructionsPath)
    });
  }
  let topEntries = [];
  try {
    topEntries = fs.readdirSync(resolvedDir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const entry of topEntries) {
    if (!entry.isFile()) continue;
    if (KNOWN_ROOT_FILES.has(entry.name) || entry.name.endsWith(".mdc")) {
      const abs = path12.join(resolvedDir, entry.name);
      files.push({
        path: entry.name,
        content: fs.readFileSync(abs)
      });
    }
  }
  if (files.length === 0) {
    return null;
  }
  const detections = detectFormats(files);
  if (detections.length === 0) {
    return null;
  }
  return {
    fetchResult: {
      source: {
        type: "local",
        localPath: resolvedDir,
        displayLabel: path12.basename(resolvedDir) || resolvedDir
      },
      files
    },
    detections
  };
}

// src/core/lint.ts
import path13 from "path";
var MAX_DESCRIPTION_LEN = {
  cursor: 500,
  claude: 1024,
  opencode: 1024,
  codex: 1024,
  antigravity: 1024,
  windsurf: 1024,
  copilot: 1024,
  cline: 1024,
  roo: 1024
};
var VALID_SKILL_NAME_RE = /^[a-z0-9][a-z0-9._-]*$/;
function extractMarkdownLinks(body) {
  const links = [];
  const re = /(?<!!)\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(body)) !== null) {
    const raw = match[1].trim().replace(/^<|>$/g, "");
    const target = raw.split(/\s+/)[0];
    if (!target) continue;
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target) || target.startsWith("#") || target.startsWith("//")) {
      continue;
    }
    const clean = target.split("#")[0].split("?")[0];
    if (clean) {
      links.push(clean);
    }
  }
  return links;
}
function lintSourceFiles(files, format, options2) {
  const findings = [];
  const filePathSet = new Set(files.map((f) => normalizePosixPath(f.path)));
  const meta = FORMAT_META[format];
  const entryFiles = [];
  for (const file of files) {
    const p2 = normalizePosixPath(file.path);
    const isEntry = format === "cursor" ? p2.endsWith(".mdc") && (p2.startsWith(".cursor/rules/") || Boolean(options2?.allowLoose)) : format === "copilot" && !options2?.allowLoose ? p2.startsWith(".github/skills/") && p2.endsWith("/SKILL.md") : p2 === "SKILL.md" || p2.endsWith("/SKILL.md");
    if (isEntry) {
      entryFiles.push(file);
    }
  }
  const seenNames = /* @__PURE__ */ new Map();
  const validFiles = [];
  for (const file of files) {
    if (!entryFiles.includes(file)) {
      validFiles.push(file);
      continue;
    }
    try {
      const parsed = parseMarkdownWithFrontmatter(file.content.toString("utf8"));
      const rawName = parsed.data.name;
      const p2 = normalizePosixPath(file.path);
      const fallbackName = format === "cursor" ? path13.posix.basename(p2, ".mdc") : path13.posix.basename(path13.posix.dirname(p2)) || "skill";
      const resolvedName = typeof rawName === "string" && rawName.trim() ? rawName.trim() : fallbackName;
      if (format !== "cursor" && (!rawName || typeof rawName !== "string" || !rawName.trim())) {
        findings.push({
          severity: "error",
          rule: "missing-name",
          file: p2,
          message: "SKILL.md frontmatter is missing a non-empty `name` field."
        });
      } else if (!VALID_SKILL_NAME_RE.test(resolvedName)) {
        findings.push({
          severity: "warning",
          rule: "invalid-name",
          file: p2,
          message: `Skill name "${resolvedName}" should use lowercase letters, digits, hyphens, dots, or underscores.`
        });
      }
      const lowerKey = resolvedName.toLowerCase();
      const firstFile = seenNames.get(lowerKey);
      if (firstFile) {
        findings.push({
          severity: "error",
          rule: "duplicate-name",
          file: p2,
          message: `Duplicate skill name "${resolvedName}" (already defined in ${firstFile}).`
        });
      } else {
        seenNames.set(lowerKey, p2);
      }
      const desc = parsed.data.description;
      if (typeof desc !== "string" || !desc.trim()) {
        findings.push({
          severity: "warning",
          rule: "missing-description",
          file: p2,
          message: "Frontmatter is missing a `description` field."
        });
      } else if (desc.trim().length > MAX_DESCRIPTION_LEN[format]) {
        findings.push({
          severity: "warning",
          rule: "description-length",
          file: p2,
          message: `Description is ${desc.trim().length} characters (recommended max for ${meta.label} is ${MAX_DESCRIPTION_LEN[format]}).`
        });
      }
      const dir = path13.posix.dirname(p2);
      for (const relLink of extractMarkdownLinks(parsed.body)) {
        const resolved = relLink.startsWith("/") ? normalizePosixPath(relLink) : normalizePosixPath(path13.posix.join(dir === "." ? "" : dir, relLink));
        if (!resolved) continue;
        const asPrefix = `${resolved}/`;
        const exists = filePathSet.has(resolved) || filePathSet.has(normalizePosixPath(relLink)) || Array.from(filePathSet).some((fp) => fp.startsWith(asPrefix));
        if (!exists) {
          findings.push({
            severity: "warning",
            rule: "broken-link",
            file: p2,
            message: `Relative link target "${relLink}" was not found in the source package.`
          });
        }
      }
      validFiles.push(file);
    } catch (err) {
      findings.push({
        severity: "error",
        rule: "invalid-frontmatter",
        file: normalizePosixPath(file.path),
        message: err instanceof Error ? err.message : String(err)
      });
    }
  }
  try {
    getAdapter(format).parse(validFiles, options2);
  } catch (err) {
    findings.push({
      severity: "error",
      rule: "parse-error",
      file: meta.configDir,
      message: err instanceof Error ? err.message : String(err)
    });
  }
  return findings;
}

// src/core/manifest.ts
import crypto from "crypto";
import fs3 from "fs";
import os10 from "os";
import path15 from "path";

// src/core/fetcher.ts
import fs2 from "fs";
import path14 from "path";
import zlib from "zlib";
var VALID_SEGMENT_RE = /^[A-Za-z0-9_.-]+$/;
var IGNORED_LOCAL_DIRS = /* @__PURE__ */ new Set([".git", "node_modules", "dist"]);
function parseGitHubSource(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    throw new Error("Source repository or path cannot be empty.");
  }
  if (fs2.existsSync(input)) {
    const stat = fs2.statSync(input);
    if (stat.isDirectory()) {
      const resolved = path14.resolve(input);
      return {
        type: "local",
        localPath: resolved,
        displayLabel: path14.basename(resolved) || resolved
      };
    }
  }
  let normalized = input.replace(/^git\s+clone\s+/i, "").trim();
  const mdLinkMatch = normalized.match(/^\[[^\]]+\]\((https?:\/\/[^)]+)\)$/);
  if (mdLinkMatch) {
    normalized = mdLinkMatch[1];
  }
  normalized = normalized.replace(/[?#].*$/, "");
  const scpSshMatch = normalized.match(/^git@github\.com:(.+)$/i);
  if (scpSshMatch) {
    normalized = scpSshMatch[1];
  } else if (/^ssh:\/\/git@github\.com\//i.test(normalized)) {
    normalized = normalized.replace(/^ssh:\/\/git@github\.com\//i, "");
  } else if (/^https?:\/\//i.test(normalized)) {
    let url;
    try {
      url = new URL(normalized);
    } catch {
      throw new Error(`Invalid GitHub URL: "${input}"`);
    }
    if (/^raw\.githubusercontent\.com$/i.test(url.hostname)) {
      const rawSegments = url.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
      if (rawSegments.length < 4) {
        throw new Error(`Invalid raw GitHub URL: "${input}"`);
      }
      const [rawOwner, rawRepo, ...rest] = rawSegments;
      const trimmedRest = rest[0] === "refs" && (rest[1] === "heads" || rest[1] === "tags") && rest.length >= 4 ? rest.slice(2) : rest;
      normalized = [rawOwner, rawRepo, "blob", ...trimmedRest].join("/");
    } else if (/^(?:www\.)?github\.com$/i.test(url.hostname)) {
      normalized = url.pathname.replace(/^\/+/, "");
    } else {
      throw new Error(`Only github.com repositories are supported (got "${url.hostname}").`);
    }
  } else if (/^(?:www\.)?github\.com\//i.test(normalized)) {
    normalized = normalized.replace(/^(?:www\.)?github\.com\//i, "");
  }
  normalized = normalized.replace(/\/+$/, "");
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error(
      `Invalid GitHub source "${input}". Expected "owner/repo", a GitHub URL, or a local directory.`
    );
  }
  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/i, "");
  if (!VALID_SEGMENT_RE.test(owner) || !VALID_SEGMENT_RE.test(repo) || owner === "." || owner === ".." || repo === "." || repo === "..") {
    throw new Error(`Invalid GitHub owner/repo in "${input}".`);
  }
  let ref;
  let subpath;
  let fileFilter;
  if (segments.length > 2) {
    if (segments[2] === "tree" && segments.length >= 4) {
      ref = segments[3];
      if (segments.length > 4) {
        subpath = segments.slice(4).join("/");
      }
    } else if (segments[2] === "blob" && segments.length >= 5) {
      ref = segments[3];
      const fileSegments = segments.slice(4);
      const fileName = fileSegments[fileSegments.length - 1];
      const parentDir = fileSegments.slice(0, -1).join("/") || void 0;
      const lowerFile = fileName.toLowerCase();
      if (lowerFile === "skill.md") {
        subpath = parentDir;
      } else if (lowerFile === "copilot-instructions.md" && parentDir?.toLowerCase() === ".github") {
        subpath = void 0;
        fileFilter = ".github/copilot-instructions.md";
      } else if (lowerFile.endsWith(".mdc") || lowerFile === "claude.md" || lowerFile === "agents.md" || lowerFile === "gemini.md" || lowerFile === ".cursorrules" || lowerFile === ".windsurfrules" || lowerFile === ".clinerules" || lowerFile === ".roorules" || lowerFile === "copilot-instructions.md") {
        subpath = parentDir;
        fileFilter = fileName;
      } else {
        subpath = parentDir;
      }
    } else {
      throw new Error(
        `Unsupported GitHub path "${input}". Expected "owner/repo" or "owner/repo/tree/<branch>/<subpath>".`
      );
    }
  }
  const displayPath = [subpath, fileFilter].filter(Boolean).join("/");
  const displayLabel = displayPath ? `${owner}/${repo}/${displayPath}` : ref ? `${owner}/${repo}@${ref}` : `${owner}/${repo}`;
  return {
    type: "github",
    owner,
    repo,
    ref,
    subpath,
    ...fileFilter ? { fileFilter } : {},
    displayLabel
  };
}
function readTarString(buf, start, length) {
  const slice = buf.subarray(start, start + length);
  const nulIdx = slice.indexOf(0);
  const end = nulIdx === -1 ? slice.length : nulIdx;
  return slice.subarray(0, end).toString("utf8");
}
function readTarSize(buf, start, length) {
  const slice = buf.subarray(start, start + length);
  if ((slice[0] & 128) !== 0) {
    let value = 0;
    for (let i = 1; i < slice.length; i++) {
      value = value * 256 + slice[i];
    }
    return value;
  }
  const raw = readTarString(buf, start, length).trim();
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 8);
  return Number.isFinite(parsed) ? parsed : 0;
}
function parsePaxHeaders(data) {
  const headers = {};
  const text = data.toString("utf8");
  let cursor = 0;
  while (cursor < text.length) {
    const spaceIdx = text.indexOf(" ", cursor);
    if (spaceIdx === -1) break;
    const len = Number.parseInt(text.slice(cursor, spaceIdx), 10);
    if (!Number.isFinite(len) || len <= 0) break;
    const record = text.slice(spaceIdx + 1, cursor + len).replace(/\n$/, "");
    const eqIdx = record.indexOf("=");
    if (eqIdx !== -1) {
      headers[record.slice(0, eqIdx)] = record.slice(eqIdx + 1);
    }
    cursor += len;
  }
  return headers;
}
function isSafeRelativePath(posixPath) {
  if (!posixPath || posixPath.startsWith("/")) {
    return false;
  }
  const parts = posixPath.split("/");
  return !parts.some((part) => part === ".." || part === "");
}
function extractTarGz(gzipBuffer, subpath, fileFilter) {
  const tarBuffer = zlib.gunzipSync(gzipBuffer);
  const normalizedSubpath = subpath ? normalizePosixPath(subpath) : "";
  const normalizedFilter = fileFilter ? normalizePosixPath(fileFilter) : "";
  const files = [];
  let offset = 0;
  let nextLongName;
  let nextPaxPath;
  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);
    offset += 512;
    if (header.every((b3) => b3 === 0)) {
      break;
    }
    const name = readTarString(header, 0, 100);
    const size = readTarSize(header, 124, 12);
    const typeFlag = String.fromCharCode(header[156] || 0);
    const prefix = readTarString(header, 345, 155);
    const paddedSize = Math.ceil(size / 512) * 512;
    const dataEnd = Math.min(offset + size, tarBuffer.length);
    const content = Buffer.from(tarBuffer.subarray(offset, dataEnd));
    offset += paddedSize;
    if (typeFlag === "L") {
      nextLongName = content.toString("utf8").replace(/\0+$/, "");
      continue;
    }
    if (typeFlag === "x") {
      const pax = parsePaxHeaders(content);
      if (pax.path) {
        nextPaxPath = pax.path;
      }
      continue;
    }
    if (typeFlag === "g") {
      continue;
    }
    let rawEntryPath = nextPaxPath ?? nextLongName ?? (prefix ? `${prefix}/${name}` : name);
    nextLongName = void 0;
    nextPaxPath = void 0;
    if (typeFlag !== "0" && typeFlag !== "\0") {
      continue;
    }
    rawEntryPath = rawEntryPath.replace(/\\/g, "/").replace(/^\.\//, "");
    const firstSlash = rawEntryPath.indexOf("/");
    if (firstSlash === -1) {
      continue;
    }
    let relPath = normalizePosixPath(rawEntryPath.slice(firstSlash + 1));
    if (!relPath || !isSafeRelativePath(relPath)) {
      continue;
    }
    if (normalizedSubpath) {
      const subPrefix = `${normalizedSubpath}/`;
      if (relPath.startsWith(subPrefix)) {
        relPath = relPath.slice(subPrefix.length);
      } else {
        continue;
      }
    }
    if (!relPath || !isSafeRelativePath(relPath)) {
      continue;
    }
    if (normalizedFilter) {
      if (normalizedFilter.toLowerCase().endsWith(".mdc")) {
        const stem = normalizedFilter.slice(0, -".mdc".length);
        if (relPath !== normalizedFilter && !relPath.startsWith(`${stem}/`)) {
          continue;
        }
      } else if (relPath !== normalizedFilter) {
        continue;
      }
    }
    files.push({ path: relPath, content });
  }
  return files;
}
function readLocalDirectory(rootDir) {
  const files = [];
  function walk(currentDir) {
    const entries = fs2.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_LOCAL_DIRS.has(entry.name)) {
          continue;
        }
        walk(path14.join(currentDir, entry.name));
      } else if (entry.isFile()) {
        const abs = path14.join(currentDir, entry.name);
        const rel = normalizePosixPath(path14.relative(rootDir, abs));
        if (rel) {
          files.push({
            path: rel,
            content: fs2.readFileSync(abs)
          });
        }
      }
    }
  }
  walk(rootDir);
  return files;
}
async function downloadGitHubTarball(owner, repo, ref) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers = {
    "User-Agent": "everyagent-cli",
    Accept: "application/vnd.github+json"
  };
  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tarball${ref ? `/${encodeURIComponent(ref)}` : ""}`;
  const codeloadUrl = `https://codeload.github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tar.gz/${encodeURIComponent(ref ?? "HEAD")}`;
  const urls = token ? [apiUrl, codeloadUrl] : [codeloadUrl, apiUrl];
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  let lastStatus = 0;
  let lastError;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: url.startsWith("https://api.github.com") ? headers : { "User-Agent": "everyagent-cli" },
        redirect: "follow"
      });
      if (response.ok) {
        const arr = await response.arrayBuffer();
        return Buffer.from(arr);
      }
      lastStatus = response.status;
      lastError = `${response.status} ${response.statusText}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }
  if (lastStatus === 404) {
    throw new Error(
      `Repository or branch not found on GitHub: "${owner}/${repo}"${ref ? ` (ref: ${ref})` : ""}.`
    );
  }
  throw new Error(
    `Failed to fetch "${owner}/${repo}" from GitHub${lastError ? ` (${lastError})` : ""}.`
  );
}
async function fetchSource(input) {
  const source = parseGitHubSource(input);
  if (source.type === "local") {
    const files2 = readLocalDirectory(source.localPath);
    if (files2.length === 0) {
      throw new Error(`No files found in local directory "${source.localPath}".`);
    }
    return { source, files: files2 };
  }
  const tarball = await downloadGitHubTarball(
    source.owner,
    source.repo,
    source.ref
  );
  const files = extractTarGz(tarball, source.subpath, source.fileFilter);
  if (files.length === 0) {
    if (source.subpath) {
      throw new Error(
        `No files found at subpath "${source.subpath}" in "${source.owner}/${source.repo}".`
      );
    }
    throw new Error(`Repository "${source.owner}/${source.repo}" appears to be empty.`);
  }
  const subpathName = source.subpath ? path14.posix.basename(normalizePosixPath(source.subpath)) : void 0;
  return {
    source,
    files,
    subpathName
  };
}

// src/core/manifest.ts
function hashBuffer(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}
function hashFile(filePath) {
  try {
    const stat = fs3.statSync(filePath);
    if (!stat.isFile()) {
      return null;
    }
    return hashBuffer(fs3.readFileSync(filePath));
  } catch {
    return null;
  }
}
function getManifestPath(options2) {
  if (options2.global) {
    const home = options2.homeDir ?? os10.homedir();
    return path15.join(path15.resolve(home), ".everyagent", "manifest.json");
  }
  return path15.join(
    path15.resolve(options2.targetDir ?? "."),
    ".everyagent",
    "manifest.json"
  );
}
function createEmptyManifest() {
  return { version: 1, installs: [] };
}
function readManifest(manifestPath) {
  if (!fs3.existsSync(manifestPath)) {
    return null;
  }
  let raw;
  try {
    raw = fs3.readFileSync(manifestPath, "utf8");
  } catch (err) {
    throw new Error(
      `Failed to read manifest "${manifestPath}": ${err instanceof Error ? err.message : String(err)}`
    );
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Invalid JSON in manifest "${manifestPath}": ${err instanceof Error ? err.message : String(err)}`
    );
  }
  if (typeof parsed !== "object" || parsed === null || parsed.version !== 1 || !Array.isArray(parsed.installs)) {
    throw new Error(
      `Unsupported or malformed manifest "${manifestPath}". Expected version 1.`
    );
  }
  return parsed;
}
function sortJsonKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }
  if (value !== null && typeof value === "object") {
    const obj = value;
    const sorted = {};
    for (const key of Object.keys(obj).sort()) {
      if (obj[key] !== void 0) {
        sorted[key] = sortJsonKeys(obj[key]);
      }
    }
    return sorted;
  }
  return value;
}
function normalizeInstallEntry(entry) {
  const files = entry.files.map((f) => ({
    path: normalizePosixPath(f.path),
    sha256: f.sha256
  })).sort((a, b3) => a.path.localeCompare(b3.path));
  return {
    source: entry.source,
    ref: entry.ref ?? null,
    subpath: entry.subpath ?? null,
    sourceFormat: entry.sourceFormat,
    targetFormat: entry.targetFormat,
    global: Boolean(entry.global),
    targetDir: entry.global ? path15.resolve(
      entry.targetDir ?? getAdapter(entry.targetFormat).getGlobalDir()
    ) : null,
    ...entry.skills ? { skills: [...entry.skills] } : {},
    ...entry.includeRootRules !== void 0 ? { includeRootRules: entry.includeRootRules } : {},
    ...entry.includeSharedAssets !== void 0 ? { includeSharedAssets: entry.includeSharedAssets } : {},
    ...entry.includeConfigAssets !== void 0 ? { includeConfigAssets: entry.includeConfigAssets } : {},
    installedAt: entry.installedAt,
    files
  };
}
function writeManifest(manifestPath, manifest) {
  const installs = manifest.installs.map(normalizeInstallEntry).sort(
    (a, b3) => a.source.localeCompare(b3.source) || (a.subpath ?? "").localeCompare(b3.subpath ?? "") || a.targetFormat.localeCompare(b3.targetFormat) || (a.targetDir ?? "").localeCompare(b3.targetDir ?? "")
  );
  const normalized = {
    version: 1,
    installs
  };
  fs3.mkdirSync(path15.dirname(manifestPath), { recursive: true });
  fs3.writeFileSync(
    manifestPath,
    `${JSON.stringify(sortJsonKeys(normalized), null, 2)}
`,
    "utf8"
  );
}
function formatSourceForManifest(parsedSource, targetDir, global) {
  if (parsedSource.type === "github") {
    return {
      source: `${parsedSource.owner}/${parsedSource.repo}`,
      ref: parsedSource.ref ?? null,
      subpath: parsedSource.subpath ?? null
    };
  }
  if (!global) {
    const rel = path15.relative(path15.resolve(targetDir), parsedSource.localPath);
    if (!path15.isAbsolute(rel)) {
      return {
        source: rel === "" ? "." : normalizePosixPath(rel),
        ref: null,
        subpath: null
      };
    }
  }
  return {
    source: parsedSource.localPath,
    ref: null,
    subpath: null
  };
}
function getInstallDir(entry, projectDir) {
  if (entry.global) {
    return path15.resolve(
      entry.targetDir ?? getAdapter(entry.targetFormat).getGlobalDir()
    );
  }
  return path15.resolve(projectDir);
}
function resolveManifestSourceForFetch(entry, projectDir) {
  if (entry.ref !== null || entry.subpath !== null) {
    const ref = entry.ref ?? "HEAD";
    if (entry.subpath) {
      return `${entry.source}/tree/${ref}/${entry.subpath}`;
    }
    return `${entry.source}/tree/${ref}`;
  }
  if (path15.isAbsolute(entry.source)) {
    return entry.source;
  }
  if (entry.source === "." || entry.source.startsWith("./") || entry.source.startsWith("../")) {
    return path15.resolve(projectDir, entry.source);
  }
  const candidateLocal = path15.resolve(projectDir, entry.source);
  if (fs3.existsSync(candidateLocal)) {
    return candidateLocal;
  }
  return entry.source;
}
function upsertManifestInstall(manifest, entry) {
  const normalized = normalizeInstallEntry(entry);
  const filtered = manifest.installs.filter(
    (existing) => !(existing.source === normalized.source && (existing.subpath ?? null) === normalized.subpath && existing.targetFormat === normalized.targetFormat && Boolean(existing.global) === normalized.global && (existing.targetDir ?? null) === normalized.targetDir)
  );
  return {
    version: 1,
    installs: [...filtered, normalized]
  };
}
function matchesInstallSource(entry, query, projectDir) {
  const trimmed = query.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (entry.source.toLowerCase() === lower) {
    return true;
  }
  const combined = entry.subpath ? `${entry.source}/${entry.subpath}`.toLowerCase() : "";
  if (combined && combined === lower) {
    return true;
  }
  if (path15.basename(entry.source).toLowerCase() === lower) {
    return true;
  }
  try {
    const parsedQuery = parseGitHubSource(trimmed);
    if (parsedQuery.type === "github") {
      const ghSlug = `${parsedQuery.owner}/${parsedQuery.repo}`.toLowerCase();
      if (entry.source.toLowerCase() === ghSlug) {
        if (!parsedQuery.subpath || entry.subpath === parsedQuery.subpath) {
          return true;
        }
      }
    } else {
      const resolvedEntry2 = path15.resolve(
        projectDir,
        resolveManifestSourceForFetch(entry, projectDir)
      );
      if (resolvedEntry2.toLowerCase() === parsedQuery.localPath.toLowerCase()) {
        return true;
      }
    }
  } catch {
  }
  const resolvedQuery = path15.resolve(projectDir, trimmed).toLowerCase();
  const resolvedEntry = path15.resolve(projectDir, resolveManifestSourceForFetch(entry, projectDir)).toLowerCase();
  return resolvedQuery === resolvedEntry;
}
function inspectInstallDrift(entry, projectDir) {
  const installDir = getInstallDir(entry, projectDir);
  const files = [];
  let modifiedCount = 0;
  let missingCount = 0;
  for (const recorded of entry.files) {
    const rel = normalizePosixPath(recorded.path);
    const abs = resolveWithin(installDir, rel);
    const diskSha256 = hashFile(abs);
    let status;
    if (diskSha256 === null) {
      status = "missing";
      missingCount += 1;
    } else if (diskSha256 !== recorded.sha256) {
      status = "modified";
      modifiedCount += 1;
    } else {
      status = "ok";
    }
    files.push({
      path: rel,
      recordedSha256: recorded.sha256,
      diskSha256,
      status
    });
  }
  return {
    installDir,
    files,
    modifiedCount,
    missingCount
  };
}
function recordManifestEntries(options2) {
  const manifestPath = getManifestPath({
    targetDir: options2.targetDir,
    global: options2.global
  });
  let manifest = readManifest(manifestPath) ?? createEmptyManifest();
  const formattedSource = formatSourceForManifest(
    options2.parsedSource,
    options2.targetDir,
    options2.global
  );
  const priorByTarget = /* @__PURE__ */ new Map();
  for (const existing of manifest.installs) {
    if (existing.source === formattedSource.source && (existing.subpath ?? null) === formattedSource.subpath && Boolean(existing.global) === options2.global) {
      priorByTarget.set(existing.targetFormat, {
        installedAt: existing.installedAt,
        files: new Map(
          existing.files.map((f) => [normalizePosixPath(f.path), f.sha256])
        )
      });
    }
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  for (const planned of options2.plannedTargets) {
    const prior = priorByTarget.get(planned.targetFormat);
    const priorFiles = prior?.files ?? /* @__PURE__ */ new Map();
    const contentByRel = /* @__PURE__ */ new Map();
    for (const file of planned.files) {
      contentByRel.set(normalizePosixPath(file.relativePath), file.content);
    }
    const files = [];
    for (const action of options2.summary.actions) {
      if (action.targetFormat !== planned.targetFormat) continue;
      const rel = normalizePosixPath(action.relativePath);
      if (action.status === "created" || action.status === "overwritten" || action.status === "unchanged" || action.status === "duplicate") {
        const content = contentByRel.get(rel);
        if (content) {
          files.push({ path: rel, sha256: hashBuffer(content) });
        }
      } else if (action.status === "skipped") {
        const prevHash = priorFiles.get(rel);
        if (prevHash) {
          files.push({ path: rel, sha256: prevHash });
        }
      }
    }
    const sameAsPrior = prior !== void 0 && files.length === priorFiles.size && files.every((f) => priorFiles.get(f.path) === f.sha256);
    manifest = upsertManifestInstall(manifest, {
      source: formattedSource.source,
      ref: formattedSource.ref,
      subpath: formattedSource.subpath,
      sourceFormat: options2.sourceFormat,
      targetFormat: planned.targetFormat,
      global: options2.global,
      targetDir: options2.global ? path15.resolve(planned.destination) : null,
      ...options2.selection?.skillNames ? { skills: options2.selection.skillNames } : {},
      ...options2.selection?.includeRootRules !== void 0 ? { includeRootRules: options2.selection.includeRootRules } : {},
      ...options2.selection?.includeSharedAssets !== void 0 ? { includeSharedAssets: options2.selection.includeSharedAssets } : {},
      ...options2.selection?.includeConfigAssets !== void 0 ? { includeConfigAssets: options2.selection.includeConfigAssets } : {},
      installedAt: sameAsPrior ? prior.installedAt : now,
      files
    });
  }
  writeManifest(manifestPath, manifest);
}

// src/core/fuzzy.ts
var FORMAT_ALIASES = {
  claude: "claude",
  claudecode: "claude",
  cc: "claude",
  claudemd: "claude",
  opencode: "opencode",
  oc: "opencode",
  codex: "codex",
  codexcli: "codex",
  openaicodex: "codex",
  cursor: "cursor",
  cursorrules: "cursor",
  mdc: "cursor",
  antigravity: "antigravity",
  agy: "antigravity",
  agents: "antigravity",
  agent: "antigravity",
  googleantigravity: "antigravity",
  windsurf: "windsurf",
  ws: "windsurf",
  windsurfrules: "windsurf",
  codeium: "windsurf",
  copilot: "copilot",
  ghcopilot: "copilot",
  githubcopilot: "copilot",
  github: "copilot",
  cline: "cline",
  clinerules: "cline",
  roo: "roo",
  roocode: "roo",
  roorules: "roo"
};
function normalizeToken(raw) {
  return raw.trim().toLowerCase().replace(/^\.+/, "").replace(/[-_\s]+/g, "");
}
function levenshteinDistance(a, b3) {
  if (a === b3) return 0;
  if (a.length === 0) return b3.length;
  if (b3.length === 0) return a.length;
  let prev = Array.from({ length: b3.length + 1 }, (_3, i) => i);
  let curr = new Array(b3.length + 1);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    const ca = a[i - 1];
    for (let j2 = 1; j2 <= b3.length; j2++) {
      const cost = ca === b3[j2 - 1] ? 0 : 1;
      curr[j2] = Math.min(
        curr[j2 - 1] + 1,
        prev[j2] + 1,
        prev[j2 - 1] + cost
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b3.length];
}
function resolveFormatAlias(raw) {
  const normalized = normalizeToken(raw);
  if (!normalized) return null;
  return FORMAT_ALIASES[normalized] ?? null;
}
function suggestFormat(raw) {
  const normalized = normalizeToken(raw);
  if (!normalized) return null;
  let bestFormat = null;
  let bestDistance = 3;
  for (const id of FORMAT_IDS) {
    const d3 = levenshteinDistance(normalized, id);
    if (d3 < bestDistance) {
      bestDistance = d3;
      bestFormat = id;
    }
  }
  for (const [alias, target] of Object.entries(FORMAT_ALIASES)) {
    const d3 = levenshteinDistance(normalized, alias);
    if (d3 < bestDistance) {
      bestDistance = d3;
      bestFormat = target;
    }
  }
  return bestDistance <= 2 ? bestFormat : null;
}
var SCORE_EXACT = -1;
var SCORE_CONTAINS = 0.5;
var SCORE_CONTAINS_LENGTH_PENALTY = 0.01;
var SCORE_BY_DISTANCE = 1;
var MIN_EDIT_DISTANCE = 2;
var LENGTH_TOLERANCE = 0.4;
function findClosestMatches(query, candidates, maxSuggestions = 3) {
  const normQuery = normalizeToken(query);
  if (!normQuery || candidates.length === 0) {
    return [];
  }
  const maxDist = Math.max(
    MIN_EDIT_DISTANCE,
    Math.floor(normQuery.length * LENGTH_TOLERANCE)
  );
  const scored = [];
  for (const candidate of candidates) {
    const normCand = normalizeToken(candidate);
    if (!normCand) continue;
    if (normCand === normQuery) {
      scored.push({ candidate, score: SCORE_EXACT });
      continue;
    }
    if (normCand.includes(normQuery) || normQuery.includes(normCand)) {
      const lengthDiff = Math.abs(normCand.length - normQuery.length);
      scored.push({
        candidate,
        score: SCORE_CONTAINS + lengthDiff * SCORE_CONTAINS_LENGTH_PENALTY
      });
      continue;
    }
    const dist = levenshteinDistance(normQuery, normCand);
    if (dist <= maxDist) {
      scored.push({ candidate, score: SCORE_BY_DISTANCE + dist });
    }
  }
  scored.sort((a, b3) => a.score - b3.score || a.candidate.localeCompare(b3.candidate));
  return scored.slice(0, maxSuggestions).map((entry) => entry.candidate);
}

// src/core/writer.ts
import fs4 from "fs";
import path16 from "path";
function writeEmittedFiles(files, targetDir, options2 = {}) {
  const force = Boolean(options2.force);
  const dryRun = Boolean(options2.dryRun);
  const seenPaths = options2.seenPaths ?? /* @__PURE__ */ new Map();
  const resolvedRoot = path16.resolve(targetDir);
  const summary = {
    created: 0,
    overwritten: 0,
    unchanged: 0,
    skipped: 0,
    duplicate: 0,
    conflict: 0,
    actions: []
  };
  for (const file of files) {
    const rel = normalizePosixPath(file.relativePath);
    if (!rel || rel.split("/").some((seg) => seg === "..")) {
      throw new Error(`Refusing unsafe target path "${file.relativePath}".`);
    }
    const absolutePath = path16.resolve(resolvedRoot, rel);
    if (absolutePath !== resolvedRoot && !absolutePath.startsWith(resolvedRoot + path16.sep)) {
      throw new Error(`Target path escapes destination directory: "${file.relativePath}".`);
    }
    const emittedEarlier = seenPaths.get(absolutePath);
    const exists = fs4.existsSync(absolutePath);
    const shouldReplace = force || Boolean(options2.overwrite?.has(absolutePath));
    let status;
    let wouldBeContent;
    if (emittedEarlier) {
      if (emittedEarlier.equals(file.content)) {
        status = "duplicate";
        summary.duplicate += 1;
      } else {
        status = "conflict";
        summary.conflict += 1;
      }
    } else if (exists) {
      let existingBuffer;
      try {
        existingBuffer = fs4.readFileSync(absolutePath);
      } catch {
        existingBuffer = void 0;
      }
      if (existingBuffer && existingBuffer.equals(file.content)) {
        status = "unchanged";
        summary.unchanged += 1;
      } else if (!shouldReplace) {
        status = "skipped";
        summary.skipped += 1;
        wouldBeContent = file.content;
      } else {
        status = "overwritten";
        summary.overwritten += 1;
        if (!dryRun) {
          fs4.mkdirSync(path16.dirname(absolutePath), { recursive: true });
          fs4.writeFileSync(absolutePath, file.content);
        }
      }
    } else {
      status = "created";
      summary.created += 1;
      if (!dryRun) {
        fs4.mkdirSync(path16.dirname(absolutePath), { recursive: true });
        fs4.writeFileSync(absolutePath, file.content);
      }
    }
    if (!emittedEarlier) {
      seenPaths.set(absolutePath, file.content);
    }
    summary.actions.push({
      relativePath: rel,
      absolutePath,
      status,
      targetFormat: file.targetFormat,
      dryRun,
      ...wouldBeContent !== void 0 ? { wouldBeContent } : {}
    });
  }
  return summary;
}

// src/core/pipeline.ts
async function fetchAndDetect(source, fromFormat = "auto") {
  const fetchResult = await fetchSource(source);
  if (fromFormat !== "auto") {
    const adapter = getAdapter(fromFormat);
    const detected = adapter.detect(fetchResult.files, {
      subpathName: fetchResult.subpathName,
      allowLoose: false
    }) ?? adapter.detect(fetchResult.files, {
      subpathName: fetchResult.subpathName,
      allowLoose: true
    });
    if (!detected) {
      throw new Error(
        `No ${adapter.label} skills or rules found in "${fetchResult.source.displayLabel}".`
      );
    }
    return {
      fetchResult,
      detections: [detected]
    };
  }
  const detections = detectFormats(fetchResult.files, {
    subpathName: fetchResult.subpathName
  });
  if (detections.length === 0) {
    throw new Error(
      `Could not detect any supported skill format in "${fetchResult.source.displayLabel}".`
    );
  }
  return { fetchResult, detections };
}
function parseDetectedPackage(files, detection, subpathName) {
  return getAdapter(detection.format).parse(files, {
    subpathName,
    allowLoose: detection.allowLoose
  });
}
function shouldPromptTranslationScope(pkg) {
  const totalChoices = pkg.skills.length + (pkg.rootRules.length > 0 ? 1 : 0) + (pkg.sharedAssets.length > 0 ? 1 : 0);
  return totalChoices > 1;
}
function filterPackage(pkg, selection) {
  if (!selection) {
    return stripConfigAssets(pkg);
  }
  let skills = pkg.skills;
  if (selection.skillNames !== void 0) {
    const byLowerName = /* @__PURE__ */ new Map();
    const byNormalizedName = /* @__PURE__ */ new Map();
    for (const skill of pkg.skills) {
      const key = skill.name.toLowerCase();
      if (!byLowerName.has(key)) {
        byLowerName.set(key, skill);
      }
      const normKey = normalizeToken(skill.name);
      if (normKey) {
        const existing = byNormalizedName.get(normKey);
        if (!existing) {
          byNormalizedName.set(normKey, skill);
        } else if (existing !== "ambiguous" && existing.name.toLowerCase() !== key) {
          byNormalizedName.set(normKey, "ambiguous");
        }
      }
    }
    const selectedKeys = /* @__PURE__ */ new Set();
    const missing = [];
    for (const rawName of selection.skillNames) {
      const trimmed = rawName.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (byLowerName.has(key)) {
        selectedKeys.add(key);
        continue;
      }
      const normMatch = byNormalizedName.get(normalizeToken(trimmed));
      if (normMatch && normMatch !== "ambiguous") {
        selectedKeys.add(normMatch.name.toLowerCase());
      } else {
        missing.push(trimmed);
      }
    }
    if (missing.length > 0) {
      const missingText = missing.map((n) => `"${n}"`).join(", ");
      if (pkg.skills.length === 0) {
        throw new Error(
          `Skill(s) not found: ${missingText}. No skills were found in this source.`
        );
      }
      const availableNames = pkg.skills.map((s) => s.name);
      const suggestions = /* @__PURE__ */ new Set();
      for (const missed of missing) {
        for (const match of findClosestMatches(missed, availableNames)) {
          suggestions.add(match);
        }
      }
      const suggestionText = suggestions.size > 0 ? ` Did you mean: ${Array.from(suggestions).join(", ")}?` : "";
      throw new Error(
        `Skill(s) not found: ${missingText}.${suggestionText} Available skills: ${availableNames.join(", ")}.`
      );
    }
    skills = pkg.skills.filter(
      (skill) => selectedKeys.has(skill.name.toLowerCase())
    );
  }
  const rootRules = selection.includeRootRules === false ? [] : pkg.rootRules;
  const sharedAssets = selection.includeSharedAssets === false ? [] : selection.includeConfigAssets === true ? pkg.sharedAssets : pkg.sharedAssets.filter((a) => !isConfigAssetPath(a.relativePath));
  if (skills.length === 0 && rootRules.length === 0 && sharedAssets.length === 0) {
    throw new Error(
      "Nothing selected to translate. Select at least one skill, root rule, or shared asset."
    );
  }
  return {
    ...pkg,
    skills,
    rootRules,
    sharedAssets
  };
}
function stripConfigAssets(pkg) {
  const sharedAssets = pkg.sharedAssets.filter(
    (a) => !isConfigAssetPath(a.relativePath)
  );
  return sharedAssets.length === pkg.sharedAssets.length ? pkg : { ...pkg, sharedAssets };
}
function assertUniqueOutputs(emitted, targetFormat) {
  const seen = /* @__PURE__ */ new Map();
  for (const file of emitted) {
    const rel = normalizePosixPath(file.relativePath);
    const previous = seen.get(rel);
    if (!previous) {
      seen.set(rel, file.content);
      continue;
    }
    if (previous.equals(file.content)) {
      continue;
    }
    throw new Error(
      `Two source items both write "${rel}" for ${FORMAT_META[targetFormat].label} with different content. Rename one of them, or install them separately with --skill.`
    );
  }
}
function convertAndWrite(options2) {
  const sourceAdapter = getAdapter(options2.sourceFormat);
  const parsedPkg = options2.pkg ?? sourceAdapter.parse(options2.files, {
    subpathName: options2.subpathName,
    allowLoose: options2.allowLoose
  });
  const pkg = options2.selection ? filterPackage(parsedPkg, options2.selection) : options2.pkg ? parsedPkg : stripConfigAssets(parsedPkg);
  const planned = options2.targetFormats.map((targetFormat) => {
    const targetAdapter = getAdapter(targetFormat);
    const emitted = targetAdapter.emit(rewritePackage(pkg, targetFormat), {
      global: options2.global
    });
    assertUniqueOutputs(emitted, targetFormat);
    return { targetFormat, emitted };
  });
  const combined = {
    created: 0,
    overwritten: 0,
    unchanged: 0,
    skipped: 0,
    duplicate: 0,
    conflict: 0,
    actions: []
  };
  const seenPaths = /* @__PURE__ */ new Map();
  const plannedTargets = [];
  for (const { targetFormat, emitted } of planned) {
    const destination = options2.global ? getAdapter(targetFormat).getGlobalDir() : options2.targetDir;
    plannedTargets.push({
      targetFormat,
      destination,
      files: emitted
    });
    const result = writeEmittedFiles(emitted, destination, {
      force: options2.force,
      dryRun: options2.dryRun,
      seenPaths,
      overwrite: options2.overwrite
    });
    combined.created += result.created;
    combined.overwritten += result.overwritten;
    combined.unchanged += result.unchanged;
    combined.skipped += result.skipped;
    combined.duplicate += result.duplicate;
    combined.conflict += result.conflict;
    combined.actions.push(...result.actions);
  }
  return { pkg, summary: combined, plannedTargets };
}

// src/core/sync.ts
import fs5 from "fs";
import path17 from "path";
function entryKeepsConfigAssets(entry) {
  if (entry.includeConfigAssets !== void 0) {
    return entry.includeConfigAssets;
  }
  return entry.files.some((file) => {
    const normalized = normalizePosixPath(file.path);
    if (isConfigAssetPath(normalized)) {
      return true;
    }
    const withoutConfigDir = normalized.split("/").slice(1).join("/");
    return withoutConfigDir !== "" && isConfigAssetPath(withoutConfigDir);
  });
}
function groupSkills(files) {
  const groups = /* @__PURE__ */ new Map();
  for (const file of files) {
    const rel = normalizePosixPath(file.path);
    if (!rel.endsWith("/SKILL.md")) continue;
    const dir = rel.slice(0, -"/SKILL.md".length);
    const name = dir.split("/").pop();
    if (name && !groups.has(`${dir}/`)) {
      groups.set(`${dir}/`, { name, dir: `${dir}/`, drifted: false });
    }
  }
  for (const file of files) {
    if (file.status !== "modified") continue;
    const rel = normalizePosixPath(file.path);
    for (const group of groups.values()) {
      if (rel.startsWith(group.dir)) {
        group.drifted = true;
        break;
      }
    }
  }
  return [...groups.values()];
}
function resolveSkillDirs(files, wanted) {
  const byName = /* @__PURE__ */ new Map();
  for (const group of groupSkills(files)) {
    byName.set(group.name.toLowerCase(), group.dir);
  }
  const dirs = [];
  const missing = [];
  for (const name of wanted) {
    const dir = byName.get(name.toLowerCase());
    if (dir) {
      dirs.push(dir);
    } else {
      missing.push(name);
    }
  }
  return { dirs, missing };
}
function planSyncForEntry(entry, emittedFiles, diskHashes, installDir) {
  const resolvedRoot = path17.resolve(installDir);
  const recordedByPath = /* @__PURE__ */ new Map();
  for (const f of entry.files) {
    recordedByPath.set(normalizePosixPath(f.path), f.sha256);
  }
  const emittedByPath = /* @__PURE__ */ new Map();
  for (const f of emittedFiles) {
    const rel = normalizePosixPath(f.relativePath);
    if (!emittedByPath.has(rel)) {
      emittedByPath.set(rel, f);
    }
  }
  const allPaths = Array.from(
    /* @__PURE__ */ new Set([...recordedByPath.keys(), ...emittedByPath.keys()])
  ).sort((a, b3) => a.localeCompare(b3));
  const actions = [];
  const nextFiles = [];
  let hasDrift = false;
  for (const rel of allPaths) {
    const absolutePath = resolveWithin(resolvedRoot, rel);
    const recordedHash = recordedByPath.get(rel);
    const emitted = emittedByPath.get(rel);
    const diskHash = diskHashes.has(rel) ? diskHashes.get(rel) ?? null : hashFile(absolutePath);
    if (emitted) {
      const newHash = hashBuffer(emitted.content);
      if (recordedHash !== void 0) {
        if (diskHash === null) {
          actions.push({
            kind: "keep-missing",
            relativePath: rel,
            absolutePath,
            recordedHash,
            diskHash,
            newHash
          });
          nextFiles.push({ path: rel, sha256: recordedHash });
          hasDrift = true;
        } else if (diskHash === newHash) {
          actions.push({
            kind: "unchanged",
            relativePath: rel,
            absolutePath,
            recordedHash,
            diskHash,
            newHash
          });
          nextFiles.push({ path: rel, sha256: newHash });
        } else if (diskHash === recordedHash) {
          actions.push({
            kind: "update",
            relativePath: rel,
            absolutePath,
            content: emitted.content,
            recordedHash,
            diskHash,
            newHash
          });
          nextFiles.push({ path: rel, sha256: newHash });
          hasDrift = true;
        } else {
          actions.push({
            kind: "keep-local",
            relativePath: rel,
            absolutePath,
            recordedHash,
            diskHash,
            newHash
          });
          nextFiles.push({ path: rel, sha256: recordedHash });
          hasDrift = true;
        }
      } else {
        if (diskHash === null) {
          actions.push({
            kind: "create",
            relativePath: rel,
            absolutePath,
            content: emitted.content,
            diskHash,
            newHash
          });
          nextFiles.push({ path: rel, sha256: newHash });
          hasDrift = true;
        } else if (diskHash === newHash) {
          actions.push({
            kind: "unchanged",
            relativePath: rel,
            absolutePath,
            diskHash,
            newHash
          });
          nextFiles.push({ path: rel, sha256: newHash });
        } else {
          actions.push({
            kind: "untracked",
            relativePath: rel,
            absolutePath,
            diskHash,
            newHash
          });
        }
      }
    } else if (recordedHash !== void 0) {
      if (diskHash === null) {
        actions.push({
          kind: "keep-missing",
          relativePath: rel,
          absolutePath,
          recordedHash,
          diskHash
        });
        hasDrift = true;
      } else if (diskHash === recordedHash) {
        actions.push({
          kind: "delete",
          relativePath: rel,
          absolutePath,
          recordedHash,
          diskHash
        });
        hasDrift = true;
      } else {
        actions.push({
          kind: "keep-local",
          relativePath: rel,
          absolutePath,
          recordedHash,
          diskHash
        });
        nextFiles.push({ path: rel, sha256: recordedHash });
        hasDrift = true;
      }
    }
  }
  return {
    entry,
    installDir: resolvedRoot,
    actions,
    nextFiles,
    hasDrift
  };
}
function pruneEmptyParentDirs(filePath, stopDir) {
  const resolvedStop = path17.resolve(stopDir);
  let current = path17.dirname(path17.resolve(filePath));
  while (current !== resolvedStop && current.startsWith(resolvedStop + path17.sep)) {
    try {
      const entries = fs5.readdirSync(current);
      if (entries.length > 0) {
        break;
      }
      fs5.rmdirSync(current);
      current = path17.dirname(current);
    } catch {
      break;
    }
  }
}
function applySyncPlan(plan, options2 = {}) {
  if (options2.dryRun) {
    return;
  }
  for (const action of plan.actions) {
    if ((action.kind === "create" || action.kind === "update") && action.content) {
      fs5.mkdirSync(path17.dirname(action.absolutePath), { recursive: true });
      fs5.writeFileSync(action.absolutePath, action.content);
    } else if (action.kind === "delete") {
      if (fs5.existsSync(action.absolutePath)) {
        fs5.unlinkSync(action.absolutePath);
        pruneEmptyParentDirs(action.absolutePath, plan.installDir);
      }
    }
  }
}
function planRemove(manifest, selector, projectDir) {
  const matchedEntries = selector.all ? [...manifest.installs] : manifest.installs.filter(
    (entry) => matchesInstallSource(entry, selector.source ?? "", projectDir)
  );
  const matchedSet = new Set(matchedEntries);
  const deletedPaths = [];
  const refusedPaths = [];
  const alreadyMissingPaths = [];
  const missingSkills = [];
  const privateTargets = [];
  const nextInstalls = [];
  for (const entry of manifest.installs) {
    if (!matchedSet.has(entry)) {
      nextInstalls.push(entry);
      continue;
    }
    const scoped = selector.skills ? resolveSkillDirs(entry.files, selector.skills) : void 0;
    if (scoped) {
      for (const name of scoped.missing) {
        if (!missingSkills.includes(name)) {
          missingSkills.push(name);
        }
      }
    }
    const scopedDirs = scoped ? scoped.dirs : null;
    const installDir = getInstallDir(entry, projectDir);
    const remainingFiles = [];
    for (const file of entry.files) {
      const rel = normalizePosixPath(file.path);
      if (scopedDirs && !scopedDirs.some((dir) => rel.startsWith(dir))) {
        remainingFiles.push(file);
        continue;
      }
      const abs = resolveWithin(installDir, rel);
      const diskHash = hashFile(abs);
      const display = entry.global ? abs : rel;
      if (diskHash === null) {
        alreadyMissingPaths.push(display);
      } else if (diskHash === file.sha256) {
        deletedPaths.push(display);
        privateTargets.push({ absolutePath: abs, installDir });
      } else {
        refusedPaths.push(display);
        remainingFiles.push(file);
      }
    }
    if (remainingFiles.length > 0) {
      nextInstalls.push({
        ...entry,
        files: remainingFiles
      });
    }
  }
  return {
    matchedEntries,
    deletedPaths,
    refusedPaths,
    alreadyMissingPaths,
    missingSkills,
    nextManifest: {
      version: 1,
      installs: nextInstalls
    },
    privateTargets
  };
}
function applyRemovePlan(plan, options2 = {}) {
  if (options2.dryRun) {
    return;
  }
  for (const target of plan.privateTargets) {
    if (fs5.existsSync(target.absolutePath)) {
      fs5.unlinkSync(target.absolutePath);
      pruneEmptyParentDirs(target.absolutePath, target.installDir);
    }
  }
}

// node_modules/cac/dist/index.mjs
import { EventEmitter } from "events";
function toArr(any) {
  return any == null ? [] : Array.isArray(any) ? any : [any];
}
function toVal(out, key, val, opts) {
  var x2, old = out[key], nxt = !!~opts.string.indexOf(key) ? val == null || val === true ? "" : String(val) : typeof val === "boolean" ? val : !!~opts.boolean.indexOf(key) ? val === "false" ? false : val === "true" || (out._.push((x2 = +val, x2 * 0 === 0) ? x2 : val), !!val) : (x2 = +val, x2 * 0 === 0) ? x2 : val;
  out[key] = old == null ? nxt : Array.isArray(old) ? old.concat(nxt) : [old, nxt];
}
function mri2(args, opts) {
  args = args || [];
  opts = opts || {};
  var k3, arr, arg, name, val, out = { _: [] };
  var i = 0, j2 = 0, idx = 0, len = args.length;
  const alibi = opts.alias !== void 0;
  const strict = opts.unknown !== void 0;
  const defaults = opts.default !== void 0;
  opts.alias = opts.alias || {};
  opts.string = toArr(opts.string);
  opts.boolean = toArr(opts.boolean);
  if (alibi) {
    for (k3 in opts.alias) {
      arr = opts.alias[k3] = toArr(opts.alias[k3]);
      for (i = 0; i < arr.length; i++) {
        (opts.alias[arr[i]] = arr.concat(k3)).splice(i, 1);
      }
    }
  }
  for (i = opts.boolean.length; i-- > 0; ) {
    arr = opts.alias[opts.boolean[i]] || [];
    for (j2 = arr.length; j2-- > 0; ) opts.boolean.push(arr[j2]);
  }
  for (i = opts.string.length; i-- > 0; ) {
    arr = opts.alias[opts.string[i]] || [];
    for (j2 = arr.length; j2-- > 0; ) opts.string.push(arr[j2]);
  }
  if (defaults) {
    for (k3 in opts.default) {
      name = typeof opts.default[k3];
      arr = opts.alias[k3] = opts.alias[k3] || [];
      if (opts[name] !== void 0) {
        opts[name].push(k3);
        for (i = 0; i < arr.length; i++) {
          opts[name].push(arr[i]);
        }
      }
    }
  }
  const keys = strict ? Object.keys(opts.alias) : [];
  for (i = 0; i < len; i++) {
    arg = args[i];
    if (arg === "--") {
      out._ = out._.concat(args.slice(++i));
      break;
    }
    for (j2 = 0; j2 < arg.length; j2++) {
      if (arg.charCodeAt(j2) !== 45) break;
    }
    if (j2 === 0) {
      out._.push(arg);
    } else if (arg.substring(j2, j2 + 3) === "no-") {
      name = arg.substring(j2 + 3);
      if (strict && !~keys.indexOf(name)) {
        return opts.unknown(arg);
      }
      out[name] = false;
    } else {
      for (idx = j2 + 1; idx < arg.length; idx++) {
        if (arg.charCodeAt(idx) === 61) break;
      }
      name = arg.substring(j2, idx);
      val = arg.substring(++idx) || (i + 1 === len || ("" + args[i + 1]).charCodeAt(0) === 45 || args[++i]);
      arr = j2 === 2 ? [name] : name;
      for (idx = 0; idx < arr.length; idx++) {
        name = arr[idx];
        if (strict && !~keys.indexOf(name)) return opts.unknown("-".repeat(j2) + name);
        toVal(out, name, idx + 1 < arr.length || val, opts);
      }
    }
  }
  if (defaults) {
    for (k3 in opts.default) {
      if (out[k3] === void 0) {
        out[k3] = opts.default[k3];
      }
    }
  }
  if (alibi) {
    for (k3 in out) {
      arr = opts.alias[k3] || [];
      while (arr.length > 0) {
        out[arr.shift()] = out[k3];
      }
    }
  }
  return out;
}
var removeBrackets = (v2) => v2.replace(/[<[].+/, "").trim();
var findAllBrackets = (v2) => {
  const ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g;
  const SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)\]/g;
  const res = [];
  const parse2 = (match) => {
    let variadic = false;
    let value = match[1];
    if (value.startsWith("...")) {
      value = value.slice(3);
      variadic = true;
    }
    return {
      required: match[0].startsWith("<"),
      value,
      variadic
    };
  };
  let angledMatch;
  while (angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v2)) {
    res.push(parse2(angledMatch));
  }
  let squareMatch;
  while (squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v2)) {
    res.push(parse2(squareMatch));
  }
  return res;
};
var getMriOptions = (options2) => {
  const result = { alias: {}, boolean: [] };
  for (const [index, option] of options2.entries()) {
    if (option.names.length > 1) {
      result.alias[option.names[0]] = option.names.slice(1);
    }
    if (option.isBoolean) {
      if (option.negated) {
        const hasStringTypeOption = options2.some((o2, i) => {
          return i !== index && o2.names.some((name) => option.names.includes(name)) && typeof o2.required === "boolean";
        });
        if (!hasStringTypeOption) {
          result.boolean.push(option.names[0]);
        }
      } else {
        result.boolean.push(option.names[0]);
      }
    }
  }
  return result;
};
var findLongest = (arr) => {
  return arr.sort((a, b3) => {
    return a.length > b3.length ? -1 : 1;
  })[0];
};
var padRight = (str2, length) => {
  return str2.length >= length ? str2 : `${str2}${" ".repeat(length - str2.length)}`;
};
var camelcase = (input) => {
  return input.replace(/([a-z])-([a-z])/g, (_3, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
};
var setDotProp = (obj, keys, val) => {
  let i = 0;
  let length = keys.length;
  let t = obj;
  let x2;
  for (; i < length; ++i) {
    x2 = t[keys[i]];
    t = t[keys[i]] = i === length - 1 ? val : x2 != null ? x2 : !!~keys[i + 1].indexOf(".") || !(+keys[i + 1] > -1) ? {} : [];
  }
};
var setByType = (obj, transforms) => {
  for (const key of Object.keys(transforms)) {
    const transform = transforms[key];
    if (transform.shouldTransform) {
      obj[key] = Array.prototype.concat.call([], obj[key]);
      if (typeof transform.transformFunction === "function") {
        obj[key] = obj[key].map(transform.transformFunction);
      }
    }
  }
};
var getFileName = (input) => {
  const m2 = /([^\\\/]+)$/.exec(input);
  return m2 ? m2[1] : "";
};
var camelcaseOptionName = (name) => {
  return name.split(".").map((v2, i) => {
    return i === 0 ? camelcase(v2) : v2;
  }).join(".");
};
var CACError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
};
var Option = class {
  constructor(rawName, description, config) {
    this.rawName = rawName;
    this.description = description;
    this.config = Object.assign({}, config);
    rawName = rawName.replace(/\.\*/g, "");
    this.negated = false;
    this.names = removeBrackets(rawName).split(",").map((v2) => {
      let name = v2.trim().replace(/^-{1,2}/, "");
      if (name.startsWith("no-")) {
        this.negated = true;
        name = name.replace(/^no-/, "");
      }
      return camelcaseOptionName(name);
    }).sort((a, b3) => a.length > b3.length ? 1 : -1);
    this.name = this.names[this.names.length - 1];
    if (this.negated && this.config.default == null) {
      this.config.default = true;
    }
    if (rawName.includes("<")) {
      this.required = true;
    } else if (rawName.includes("[")) {
      this.required = false;
    } else {
      this.isBoolean = true;
    }
  }
};
var processArgs = process.argv;
var platformInfo = `${process.platform}-${process.arch} node-${process.version}`;
var Command = class {
  constructor(rawName, description, config = {}, cli) {
    this.rawName = rawName;
    this.description = description;
    this.config = config;
    this.cli = cli;
    this.options = [];
    this.aliasNames = [];
    this.name = removeBrackets(rawName);
    this.args = findAllBrackets(rawName);
    this.examples = [];
  }
  usage(text) {
    this.usageText = text;
    return this;
  }
  allowUnknownOptions() {
    this.config.allowUnknownOptions = true;
    return this;
  }
  ignoreOptionDefaultValue() {
    this.config.ignoreOptionDefaultValue = true;
    return this;
  }
  version(version, customFlags = "-v, --version") {
    this.versionNumber = version;
    this.option(customFlags, "Display version number");
    return this;
  }
  example(example) {
    this.examples.push(example);
    return this;
  }
  option(rawName, description, config) {
    const option = new Option(rawName, description, config);
    this.options.push(option);
    return this;
  }
  alias(name) {
    this.aliasNames.push(name);
    return this;
  }
  action(callback) {
    this.commandAction = callback;
    return this;
  }
  isMatched(name) {
    return this.name === name || this.aliasNames.includes(name);
  }
  get isDefaultCommand() {
    return this.name === "" || this.aliasNames.includes("!");
  }
  get isGlobalCommand() {
    return this instanceof GlobalCommand;
  }
  hasOption(name) {
    name = name.split(".")[0];
    return this.options.find((option) => {
      return option.names.includes(name);
    });
  }
  outputHelp() {
    const { name, commands } = this.cli;
    const {
      versionNumber,
      options: globalOptions,
      helpCallback
    } = this.cli.globalCommand;
    let sections = [
      {
        body: `${name}${versionNumber ? `/${versionNumber}` : ""}`
      }
    ];
    sections.push({
      title: "Usage",
      body: `  $ ${name} ${this.usageText || this.rawName}`
    });
    const showCommands = (this.isGlobalCommand || this.isDefaultCommand) && commands.length > 0;
    if (showCommands) {
      const longestCommandName = findLongest(commands.map((command) => command.rawName));
      sections.push({
        title: "Commands",
        body: commands.map((command) => {
          return `  ${padRight(command.rawName, longestCommandName.length)}  ${command.description}`;
        }).join("\n")
      });
      sections.push({
        title: `For more info, run any command with the \`--help\` flag`,
        body: commands.map((command) => `  $ ${name}${command.name === "" ? "" : ` ${command.name}`} --help`).join("\n")
      });
    }
    let options2 = this.isGlobalCommand ? globalOptions : [...this.options, ...globalOptions || []];
    if (!this.isGlobalCommand && !this.isDefaultCommand) {
      options2 = options2.filter((option) => option.name !== "version");
    }
    if (options2.length > 0) {
      const longestOptionName = findLongest(options2.map((option) => option.rawName));
      sections.push({
        title: "Options",
        body: options2.map((option) => {
          return `  ${padRight(option.rawName, longestOptionName.length)}  ${option.description} ${option.config.default === void 0 ? "" : `(default: ${option.config.default})`}`;
        }).join("\n")
      });
    }
    if (this.examples.length > 0) {
      sections.push({
        title: "Examples",
        body: this.examples.map((example) => {
          if (typeof example === "function") {
            return example(name);
          }
          return example;
        }).join("\n")
      });
    }
    if (helpCallback) {
      sections = helpCallback(sections) || sections;
    }
    console.log(sections.map((section) => {
      return section.title ? `${section.title}:
${section.body}` : section.body;
    }).join("\n\n"));
  }
  outputVersion() {
    const { name } = this.cli;
    const { versionNumber } = this.cli.globalCommand;
    if (versionNumber) {
      console.log(`${name}/${versionNumber} ${platformInfo}`);
    }
  }
  checkRequiredArgs() {
    const minimalArgsCount = this.args.filter((arg) => arg.required).length;
    if (this.cli.args.length < minimalArgsCount) {
      throw new CACError(`missing required args for command \`${this.rawName}\``);
    }
  }
  checkUnknownOptions() {
    const { options: options2, globalCommand } = this.cli;
    if (!this.config.allowUnknownOptions) {
      for (const name of Object.keys(options2)) {
        if (name !== "--" && !this.hasOption(name) && !globalCommand.hasOption(name)) {
          throw new CACError(`Unknown option \`${name.length > 1 ? `--${name}` : `-${name}`}\``);
        }
      }
    }
  }
  checkOptionValue() {
    const { options: parsedOptions, globalCommand } = this.cli;
    const options2 = [...globalCommand.options, ...this.options];
    for (const option of options2) {
      const value = parsedOptions[option.name.split(".")[0]];
      if (option.required) {
        const hasNegated = options2.some((o2) => o2.negated && o2.names.includes(option.name));
        if (value === true || value === false && !hasNegated) {
          throw new CACError(`option \`${option.rawName}\` value is missing`);
        }
      }
    }
  }
};
var GlobalCommand = class extends Command {
  constructor(cli) {
    super("@@global@@", "", {}, cli);
  }
};
var __assign = Object.assign;
var CAC = class extends EventEmitter {
  constructor(name = "") {
    super();
    this.name = name;
    this.commands = [];
    this.rawArgs = [];
    this.args = [];
    this.options = {};
    this.globalCommand = new GlobalCommand(this);
    this.globalCommand.usage("<command> [options]");
  }
  usage(text) {
    this.globalCommand.usage(text);
    return this;
  }
  command(rawName, description, config) {
    const command = new Command(rawName, description || "", config, this);
    command.globalCommand = this.globalCommand;
    this.commands.push(command);
    return command;
  }
  option(rawName, description, config) {
    this.globalCommand.option(rawName, description, config);
    return this;
  }
  help(callback) {
    this.globalCommand.option("-h, --help", "Display this message");
    this.globalCommand.helpCallback = callback;
    this.showHelpOnExit = true;
    return this;
  }
  version(version, customFlags = "-v, --version") {
    this.globalCommand.version(version, customFlags);
    this.showVersionOnExit = true;
    return this;
  }
  example(example) {
    this.globalCommand.example(example);
    return this;
  }
  outputHelp() {
    if (this.matchedCommand) {
      this.matchedCommand.outputHelp();
    } else {
      this.globalCommand.outputHelp();
    }
  }
  outputVersion() {
    this.globalCommand.outputVersion();
  }
  setParsedInfo({ args, options: options2 }, matchedCommand, matchedCommandName) {
    this.args = args;
    this.options = options2;
    if (matchedCommand) {
      this.matchedCommand = matchedCommand;
    }
    if (matchedCommandName) {
      this.matchedCommandName = matchedCommandName;
    }
    return this;
  }
  unsetMatchedCommand() {
    this.matchedCommand = void 0;
    this.matchedCommandName = void 0;
  }
  parse(argv = processArgs, {
    run = true
  } = {}) {
    this.rawArgs = argv;
    if (!this.name) {
      this.name = argv[1] ? getFileName(argv[1]) : "cli";
    }
    let shouldParse = true;
    for (const command of this.commands) {
      const parsed = this.mri(argv.slice(2), command);
      const commandName = parsed.args[0];
      if (command.isMatched(commandName)) {
        shouldParse = false;
        const parsedInfo = __assign(__assign({}, parsed), {
          args: parsed.args.slice(1)
        });
        this.setParsedInfo(parsedInfo, command, commandName);
        this.emit(`command:${commandName}`, command);
      }
    }
    if (shouldParse) {
      for (const command of this.commands) {
        if (command.name === "") {
          shouldParse = false;
          const parsed = this.mri(argv.slice(2), command);
          this.setParsedInfo(parsed, command);
          this.emit(`command:!`, command);
        }
      }
    }
    if (shouldParse) {
      const parsed = this.mri(argv.slice(2));
      this.setParsedInfo(parsed);
    }
    if (this.options.help && this.showHelpOnExit) {
      this.outputHelp();
      run = false;
      this.unsetMatchedCommand();
    }
    if (this.options.version && this.showVersionOnExit && this.matchedCommandName == null) {
      this.outputVersion();
      run = false;
      this.unsetMatchedCommand();
    }
    const parsedArgv = { args: this.args, options: this.options };
    if (run) {
      this.runMatchedCommand();
    }
    if (!this.matchedCommand && this.args[0]) {
      this.emit("command:*");
    }
    return parsedArgv;
  }
  mri(argv, command) {
    const cliOptions = [
      ...this.globalCommand.options,
      ...command ? command.options : []
    ];
    const mriOptions = getMriOptions(cliOptions);
    let argsAfterDoubleDashes = [];
    const doubleDashesIndex = argv.indexOf("--");
    if (doubleDashesIndex > -1) {
      argsAfterDoubleDashes = argv.slice(doubleDashesIndex + 1);
      argv = argv.slice(0, doubleDashesIndex);
    }
    let parsed = mri2(argv, mriOptions);
    parsed = Object.keys(parsed).reduce((res, name) => {
      return __assign(__assign({}, res), {
        [camelcaseOptionName(name)]: parsed[name]
      });
    }, { _: [] });
    const args = parsed._;
    const options2 = {
      "--": argsAfterDoubleDashes
    };
    const ignoreDefault = command && command.config.ignoreOptionDefaultValue ? command.config.ignoreOptionDefaultValue : this.globalCommand.config.ignoreOptionDefaultValue;
    let transforms = /* @__PURE__ */ Object.create(null);
    for (const cliOption of cliOptions) {
      if (!ignoreDefault && cliOption.config.default !== void 0) {
        for (const name of cliOption.names) {
          options2[name] = cliOption.config.default;
        }
      }
      if (Array.isArray(cliOption.config.type)) {
        if (transforms[cliOption.name] === void 0) {
          transforms[cliOption.name] = /* @__PURE__ */ Object.create(null);
          transforms[cliOption.name]["shouldTransform"] = true;
          transforms[cliOption.name]["transformFunction"] = cliOption.config.type[0];
        }
      }
    }
    for (const key of Object.keys(parsed)) {
      if (key !== "_") {
        const keys = key.split(".");
        setDotProp(options2, keys, parsed[key]);
        setByType(options2, transforms);
      }
    }
    return {
      args,
      options: options2
    };
  }
  runMatchedCommand() {
    const { args, options: options2, matchedCommand: command } = this;
    if (!command || !command.commandAction)
      return;
    command.checkUnknownOptions();
    command.checkOptionValue();
    command.checkRequiredArgs();
    const actionArgs = [];
    command.args.forEach((arg, index) => {
      if (arg.variadic) {
        actionArgs.push(args.slice(index));
      } else {
        actionArgs.push(args[index]);
      }
    });
    actionArgs.push(options2);
    return command.commandAction.apply(this, actionArgs);
  }
};
var cac = (name = "") => new CAC(name);

// package.json
var package_default = {
  name: "everyagent",
  version: "1.4.0",
  description: "Convert and install AI-agent skills between Cursor, Claude Code, OpenCode, Codex CLI, Antigravity, Windsurf, GitHub Copilot, Cline, and Roo Code",
  author: "liferes",
  repository: {
    type: "git",
    url: "git+https://github.com/liferes/everyagent.git"
  },
  homepage: "https://github.com/liferes/everyagent#readme",
  bugs: {
    url: "https://github.com/liferes/everyagent/issues"
  },
  type: "module",
  engines: {
    node: ">=18.0.0"
  },
  bin: {
    everyagent: "dist/index.js"
  },
  files: [
    "dist",
    "README.md"
  ],
  scripts: {
    build: "tsup",
    typecheck: "tsc --noEmit",
    test: "vitest run",
    "test:watch": "vitest",
    prepublishOnly: "npm run typecheck && npm run build && npm test"
  },
  keywords: [
    "ai",
    "agent",
    "skills",
    "cursor",
    "claude",
    "opencode",
    "codex",
    "antigravity",
    "windsurf",
    "copilot",
    "cline",
    "roo",
    "cli"
  ],
  license: "MIT",
  dependencies: {
    "@clack/prompts": "^0.10.1",
    cac: "^6.7.14",
    "gray-matter": "^4.0.3",
    picocolors: "^1.1.1"
  },
  devDependencies: {
    "@types/node": "^22.15.3",
    tsup: "^8.5.0",
    typescript: "^5.8.3",
    vitest: "^3.1.3"
  }
};

// src/cli/args.ts
var CliUsageError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "CliUsageError";
  }
};
function parseTargetFormats(raw) {
  const tokens = raw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (tokens.length === 0) {
    throw new CliUsageError(
      `Target format cannot be empty. Expected: ${FORMAT_IDS.join(", ")}, or all.`
    );
  }
  const resolved = [];
  for (const token of tokens) {
    if (token === "all") {
      for (const id of FORMAT_IDS) {
        if (!resolved.includes(id)) {
          resolved.push(id);
        }
      }
      continue;
    }
    const fmt = resolveFormatAlias(token);
    if (!fmt) {
      const suggestion = suggestFormat(token);
      throw new CliUsageError(
        `Unsupported target format "${token}".${suggestion ? ` Did you mean "${suggestion}"?` : ""} Valid targets: ${FORMAT_IDS.join(", ")}, all.`
      );
    }
    if (!resolved.includes(fmt)) {
      resolved.push(fmt);
    }
  }
  return resolved;
}
function parseSourceFormat(raw) {
  const value = (raw ?? "auto").trim().toLowerCase();
  if (value === "auto") {
    return "auto";
  }
  const resolved = resolveFormatAlias(value);
  if (!resolved) {
    const suggestion = suggestFormat(value);
    throw new CliUsageError(
      `Unsupported source format "${value}".${suggestion ? ` Did you mean "${suggestion}"?` : ""} Valid formats: auto, ${FORMAT_IDS.join(", ")}.`
    );
  }
  return resolved;
}
function parseSkillSelection(raw) {
  const entries = Array.isArray(raw) ? raw : [raw];
  const seen = /* @__PURE__ */ new Set();
  const resolved = [];
  for (const entry of entries) {
    if (typeof entry !== "string") {
      continue;
    }
    for (const part of entry.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const lower = trimmed.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        resolved.push(trimmed);
      }
    }
  }
  if (resolved.length === 0) {
    throw new CliUsageError(
      "Skill selection cannot be empty. Provide one or more comma-separated skill names."
    );
  }
  return resolved;
}
function resolveExplicitPath(argv, opts, positionalDest) {
  const explicitPathFlag = argv.includes("-p") || argv.includes("--path") || argv.some((a) => a.startsWith("--path="));
  return explicitPathFlag ? String(opts.path ?? ".") : positionalDest ?? String(opts.path ?? ".");
}
function parseSubcommand(subcmd, argv) {
  const subArgv = [argv[0], argv[1], ...argv.slice(3)];
  const cli = cac(`everyagent ${subcmd}`);
  if (subcmd === "sync") {
    cli.command("[dest]", "Re-fetch and update installed skills without overwriting local edits").option("-p, --path <dir>", "Project directory", { default: "." }).option("-g, --global", "Sync global manifest (~/.everyagent/manifest.json)").option("-y, --yes", "Confirm deletions without prompting").option("-d, --dry-run", "Preview sync changes without touching disk").option("--check", "Exit with code 1 if any tracked file or source has drifted").option("--json", "Output sync report as JSON");
    cli.help();
    const parsed2 = cli.parse(subArgv, { run: false });
    const opts2 = parsed2.options;
    if (opts2.help || opts2.version) return { kind: "help_or_version" };
    if (parsed2.args.length > 1) {
      throw new CliUsageError(`Unexpected argument "${parsed2.args[1]}" for sync.`);
    }
    return {
      kind: "sync",
      targetDir: resolveExplicitPath(subArgv, opts2, parsed2.args[0]),
      global: Boolean(opts2.global),
      yes: Boolean(opts2.yes),
      dryRun: Boolean(opts2.dryRun),
      check: Boolean(opts2.check),
      json: Boolean(opts2.json)
    };
  }
  if (subcmd === "list") {
    cli.command("[dest]", "List installed skills and check for drift").option("-p, --path <dir>", "Project directory", { default: "." }).option("-g, --global", "List global manifest (~/.everyagent/manifest.json)").option("--json", "Output installed list as JSON");
    cli.help();
    const parsed2 = cli.parse(subArgv, { run: false });
    const opts2 = parsed2.options;
    if (opts2.help || opts2.version) return { kind: "help_or_version" };
    if (parsed2.args.length > 1) {
      throw new CliUsageError(`Unexpected argument "${parsed2.args[1]}" for list.`);
    }
    return {
      kind: "list",
      targetDir: resolveExplicitPath(subArgv, opts2, parsed2.args[0]),
      global: Boolean(opts2.global),
      json: Boolean(opts2.json)
    };
  }
  if (subcmd === "remove") {
    cli.command("[source] [dest]", "Remove untouched files installed from a source").option("--all", "Remove all tracked installs in the manifest").option(
      "-s, --skill <names>",
      "Only remove specific skill(s), comma-separated"
    ).option("-p, --path <dir>", "Project directory", { default: "." }).option("-g, --global", "Remove from global manifest (~/.everyagent/manifest.json)").option("-d, --dry-run", "Preview removals without touching disk");
    cli.help();
    const parsed2 = cli.parse(subArgv, { run: false });
    const opts2 = parsed2.options;
    if (opts2.help || opts2.version) return { kind: "help_or_version" };
    const all = Boolean(opts2.all);
    const skills = opts2.skill !== void 0 ? parseSkillSelection(opts2.skill) : void 0;
    if (all && skills) {
      throw new CliUsageError("Use either --all or --skill, not both.");
    }
    const source = all ? void 0 : parsed2.args[0];
    const destArg = all ? parsed2.args[0] : parsed2.args[1];
    if (!all && !source) {
      throw new CliUsageError(
        "Missing source for remove. Specify <source> or --all."
      );
    }
    if (all && parsed2.args.length > 1 || !all && parsed2.args.length > 2) {
      throw new CliUsageError("Too many arguments for remove.");
    }
    return {
      kind: "remove",
      ...source ? { source } : {},
      ...skills ? { skills } : {},
      all,
      targetDir: resolveExplicitPath(subArgv, opts2, destArg),
      global: Boolean(opts2.global),
      dryRun: Boolean(opts2.dryRun)
    };
  }
  cli.command("[source]", "Check skills for frontmatter, naming, and link issues").option(
    "-f, --from <format>",
    `Override source auto-detection (auto, ${FORMAT_IDS.join(", ")})`,
    { default: "auto" }
  ).option("--json", "Output lint findings as JSON");
  cli.help();
  const parsed = cli.parse(subArgv, { run: false });
  const opts = parsed.options;
  if (opts.help || opts.version) return { kind: "help_or_version" };
  if (parsed.args.length > 1) {
    throw new CliUsageError(`Unexpected argument "${parsed.args[1]}" for lint.`);
  }
  return {
    kind: "lint",
    source: parsed.args[0] ?? ".",
    from: parseSourceFormat(typeof opts.from === "string" ? opts.from : void 0),
    json: Boolean(opts.json)
  };
}
function parseCliArgs(argv) {
  const firstArg = argv[2];
  if (firstArg === "sync" || firstArg === "list" || firstArg === "remove" || firstArg === "lint") {
    return parseSubcommand(firstArg, argv);
  }
  const cli = cac("everyagent");
  cli.command(
    "[source] [dest]",
    "Convert and install AI-agent skills from a GitHub repo or local directory"
  ).option(
    "-t, --to <targets>",
    `Target format(s): ${FORMAT_IDS.join(", ")}, or all`
  ).option(
    "-s, --skill <names>",
    "Only translate specific skill(s), comma-separated"
  ).option("-p, --path <dir>", "Destination project directory", {
    default: "."
  }).option(
    "-f, --from <format>",
    `Override source auto-detection (auto, ${FORMAT_IDS.join(", ")})`,
    { default: "auto" }
  ).option("-g, --global", "Install to user global agent config directory").option("-y, --yes", "Skip confirmation prompt").option("-d, --dry-run", "Preview planned actions without writing files").option("--force", "Overwrite existing files instead of skipping").option(
    "--with-config",
    "Also copy settings, hooks, and MCP files (often hold secrets)"
  ).example("everyagent").example("everyagent owner/repo -t claude").example("everyagent owner/repo -t claude -s react-hooks,api-design").example("everyagent https://github.com/u/r -t opencode ./app -y").example("everyagent sync").example("everyagent list").example("everyagent remove owner/repo").example("everyagent remove owner/repo -s react-hooks,api-design");
  cli.help();
  cli.version(package_default.version);
  const parsed = cli.parse(argv, { run: false });
  const opts = parsed.options;
  if (opts.help || opts.version) {
    return { kind: "help_or_version" };
  }
  const sourceArg = parsed.args[0];
  const destArg = parsed.args[1];
  const hasActionFlags = Boolean(
    opts.to || opts.skill !== void 0 || opts.global || opts.yes || opts.dryRun || opts.force || opts.from && opts.from !== "auto" || opts.path && opts.path !== "."
  );
  if (!sourceArg && !hasActionFlags) {
    return { kind: "interactive" };
  }
  if (!sourceArg) {
    throw new CliUsageError(
      "Missing source repository or path. Run `everyagent` with no arguments for the interactive wizard, or `everyagent --help` for usage."
    );
  }
  const from = parseSourceFormat(
    typeof opts.from === "string" ? opts.from : void 0
  );
  const targets = typeof opts.to === "string" ? parseTargetFormats(opts.to) : void 0;
  const skills = opts.skill !== void 0 ? parseSkillSelection(opts.skill) : void 0;
  const targetDir = resolveExplicitPath(argv, opts, destArg);
  return {
    kind: "command",
    source: sourceArg,
    targets,
    ...skills ? { skills } : {},
    from,
    targetDir,
    global: Boolean(opts.global),
    yes: Boolean(opts.yes),
    dryRun: Boolean(opts.dryRun),
    force: Boolean(opts.force),
    withConfig: Boolean(opts.withConfig)
  };
}

// src/cli/logger.ts
var import_picocolors = __toESM(require_picocolors(), 1);
function logInfo(message) {
  console.log(`${import_picocolors.default.cyan("\u2139")} ${message}`);
}
function logSuccess(message) {
  console.log(`${import_picocolors.default.green("\u2714")} ${message}`);
}
function logWarn(message) {
  console.log(`${import_picocolors.default.yellow("\u26A0")} ${message}`);
}
function logError(message) {
  console.error(`${import_picocolors.default.red("\u2716")} ${message}`);
}
function formatActionLine(action, globalMode = false) {
  const prefix = action.dryRun ? `${import_picocolors.default.dim("[dry-run]")} ` : "";
  const displayPath = globalMode ? action.absolutePath : action.relativePath;
  switch (action.status) {
    case "created":
      return `${prefix}${import_picocolors.default.green("\u2714 Created")} ${displayPath}`;
    case "overwritten":
      return `${prefix}${import_picocolors.default.green("\u2714 Overwrote")} ${displayPath}`;
    case "unchanged":
      return `${prefix}${import_picocolors.default.dim(`= Up to date ${displayPath}`)}`;
    case "skipped":
      return `${prefix}${import_picocolors.default.yellow("\u26A0 Skipped")} ${displayPath} ${import_picocolors.default.dim("(differs on disk)")}`;
    case "duplicate":
      return `${prefix}${import_picocolors.default.dim(`\u2261 ${displayPath} (written once for both targets)`)}`;
    case "conflict":
      return `${prefix}${import_picocolors.default.yellow("\u26A0 Conflict")} ${displayPath} ${import_picocolors.default.dim("(second target wanted different content; first kept)")}`;
  }
}
function formatSummaryCounts(summary) {
  const parts = [];
  if (summary.created > 0 || summary.overwritten === 0 && summary.unchanged === 0) {
    parts.push(`${summary.created} created`);
  }
  if (summary.overwritten > 0) {
    parts.push(`${summary.overwritten} overwritten`);
  }
  if (summary.unchanged > 0) {
    parts.push(`${summary.unchanged} up to date`);
  }
  if (summary.skipped > 0 || summary.unchanged === 0) {
    parts.push(`${summary.skipped} skipped`);
  }
  if (summary.duplicate > 0) {
    parts.push(`${summary.duplicate} shared`);
  }
  if (summary.conflict > 0) {
    parts.push(`${summary.conflict} conflict${summary.conflict === 1 ? "" : "s"}`);
  }
  return parts.join(", ");
}
function logWriteSummary(summary, options2 = {}) {
  const skippedActions = [];
  for (const action of summary.actions) {
    if (action.status === "unchanged") {
      continue;
    }
    if (action.status === "skipped") {
      skippedActions.push(action);
      continue;
    }
    console.log(formatActionLine(action, options2.global));
  }
  if (skippedActions.length > 0) {
    const prefix = options2.dryRun ? `${import_picocolors.default.dim("[dry-run]")} ` : "";
    console.log(`${prefix}${import_picocolors.default.yellow("\u26A0 Differs on disk:")}`);
    for (const action of skippedActions) {
      const displayPath = options2.global ? action.absolutePath : action.relativePath;
      console.log(`  ${displayPath}`);
    }
  }
  const isAllUpToDate = !options2.dryRun && summary.created === 0 && summary.overwritten === 0 && summary.skipped === 0 && summary.conflict === 0 && summary.unchanged > 0;
  const verb = options2.dryRun ? "Dry run complete!" : isAllUpToDate ? "Already up to date!" : "Done!";
  console.log("");
  console.log(`${import_picocolors.default.bold(import_picocolors.default.green(verb))} ${formatSummaryCounts(summary)}.`);
  if (skippedActions.length > 0 && options2.showForceHint !== false) {
    logWarn(
      `${skippedActions.length} file${skippedActions.length === 1 ? "" : "s"} differ${skippedActions.length === 1 ? "s" : ""} on disk and ${skippedActions.length === 1 ? "was" : "were"} kept. Re-run with --force to replace ${skippedActions.length === 1 ? "it" : "them"}.`
    );
  }
  if (summary.conflict > 0) {
    logWarn(
      "Two target formats share a file name and produced different content. Install them one at a time with -t <format> if you need both."
    );
  }
  console.log(
    import_picocolors.default.dim("Always double-check the output in case some skills were not detected.")
  );
}

// src/cli/prompts.ts
import fs6 from "fs";

// node_modules/@clack/prompts/dist/index.mjs
import { stripVTControlCharacters as S2 } from "util";

// node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
var import_picocolors2 = __toESM(require_picocolors(), 1);
import { stdin as j, stdout as M } from "process";
import * as g from "readline";
import O from "readline";
import { Writable as X } from "stream";
function DD({ onlyFirst: e2 = false } = {}) {
  const t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
  return new RegExp(t, e2 ? void 0 : "g");
}
var uD = DD();
function P(e2) {
  if (typeof e2 != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof e2}\``);
  return e2.replace(uD, "");
}
function L(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
var W = { exports: {} };
(function(e2) {
  var u2 = {};
  e2.exports = u2, u2.eastAsianWidth = function(F2) {
    var s = F2.charCodeAt(0), i = F2.length == 2 ? F2.charCodeAt(1) : 0, D2 = s;
    return 55296 <= s && s <= 56319 && 56320 <= i && i <= 57343 && (s &= 1023, i &= 1023, D2 = s << 10 | i, D2 += 65536), D2 == 12288 || 65281 <= D2 && D2 <= 65376 || 65504 <= D2 && D2 <= 65510 ? "F" : D2 == 8361 || 65377 <= D2 && D2 <= 65470 || 65474 <= D2 && D2 <= 65479 || 65482 <= D2 && D2 <= 65487 || 65490 <= D2 && D2 <= 65495 || 65498 <= D2 && D2 <= 65500 || 65512 <= D2 && D2 <= 65518 ? "H" : 4352 <= D2 && D2 <= 4447 || 4515 <= D2 && D2 <= 4519 || 4602 <= D2 && D2 <= 4607 || 9001 <= D2 && D2 <= 9002 || 11904 <= D2 && D2 <= 11929 || 11931 <= D2 && D2 <= 12019 || 12032 <= D2 && D2 <= 12245 || 12272 <= D2 && D2 <= 12283 || 12289 <= D2 && D2 <= 12350 || 12353 <= D2 && D2 <= 12438 || 12441 <= D2 && D2 <= 12543 || 12549 <= D2 && D2 <= 12589 || 12593 <= D2 && D2 <= 12686 || 12688 <= D2 && D2 <= 12730 || 12736 <= D2 && D2 <= 12771 || 12784 <= D2 && D2 <= 12830 || 12832 <= D2 && D2 <= 12871 || 12880 <= D2 && D2 <= 13054 || 13056 <= D2 && D2 <= 19903 || 19968 <= D2 && D2 <= 42124 || 42128 <= D2 && D2 <= 42182 || 43360 <= D2 && D2 <= 43388 || 44032 <= D2 && D2 <= 55203 || 55216 <= D2 && D2 <= 55238 || 55243 <= D2 && D2 <= 55291 || 63744 <= D2 && D2 <= 64255 || 65040 <= D2 && D2 <= 65049 || 65072 <= D2 && D2 <= 65106 || 65108 <= D2 && D2 <= 65126 || 65128 <= D2 && D2 <= 65131 || 110592 <= D2 && D2 <= 110593 || 127488 <= D2 && D2 <= 127490 || 127504 <= D2 && D2 <= 127546 || 127552 <= D2 && D2 <= 127560 || 127568 <= D2 && D2 <= 127569 || 131072 <= D2 && D2 <= 194367 || 177984 <= D2 && D2 <= 196605 || 196608 <= D2 && D2 <= 262141 ? "W" : 32 <= D2 && D2 <= 126 || 162 <= D2 && D2 <= 163 || 165 <= D2 && D2 <= 166 || D2 == 172 || D2 == 175 || 10214 <= D2 && D2 <= 10221 || 10629 <= D2 && D2 <= 10630 ? "Na" : D2 == 161 || D2 == 164 || 167 <= D2 && D2 <= 168 || D2 == 170 || 173 <= D2 && D2 <= 174 || 176 <= D2 && D2 <= 180 || 182 <= D2 && D2 <= 186 || 188 <= D2 && D2 <= 191 || D2 == 198 || D2 == 208 || 215 <= D2 && D2 <= 216 || 222 <= D2 && D2 <= 225 || D2 == 230 || 232 <= D2 && D2 <= 234 || 236 <= D2 && D2 <= 237 || D2 == 240 || 242 <= D2 && D2 <= 243 || 247 <= D2 && D2 <= 250 || D2 == 252 || D2 == 254 || D2 == 257 || D2 == 273 || D2 == 275 || D2 == 283 || 294 <= D2 && D2 <= 295 || D2 == 299 || 305 <= D2 && D2 <= 307 || D2 == 312 || 319 <= D2 && D2 <= 322 || D2 == 324 || 328 <= D2 && D2 <= 331 || D2 == 333 || 338 <= D2 && D2 <= 339 || 358 <= D2 && D2 <= 359 || D2 == 363 || D2 == 462 || D2 == 464 || D2 == 466 || D2 == 468 || D2 == 470 || D2 == 472 || D2 == 474 || D2 == 476 || D2 == 593 || D2 == 609 || D2 == 708 || D2 == 711 || 713 <= D2 && D2 <= 715 || D2 == 717 || D2 == 720 || 728 <= D2 && D2 <= 731 || D2 == 733 || D2 == 735 || 768 <= D2 && D2 <= 879 || 913 <= D2 && D2 <= 929 || 931 <= D2 && D2 <= 937 || 945 <= D2 && D2 <= 961 || 963 <= D2 && D2 <= 969 || D2 == 1025 || 1040 <= D2 && D2 <= 1103 || D2 == 1105 || D2 == 8208 || 8211 <= D2 && D2 <= 8214 || 8216 <= D2 && D2 <= 8217 || 8220 <= D2 && D2 <= 8221 || 8224 <= D2 && D2 <= 8226 || 8228 <= D2 && D2 <= 8231 || D2 == 8240 || 8242 <= D2 && D2 <= 8243 || D2 == 8245 || D2 == 8251 || D2 == 8254 || D2 == 8308 || D2 == 8319 || 8321 <= D2 && D2 <= 8324 || D2 == 8364 || D2 == 8451 || D2 == 8453 || D2 == 8457 || D2 == 8467 || D2 == 8470 || 8481 <= D2 && D2 <= 8482 || D2 == 8486 || D2 == 8491 || 8531 <= D2 && D2 <= 8532 || 8539 <= D2 && D2 <= 8542 || 8544 <= D2 && D2 <= 8555 || 8560 <= D2 && D2 <= 8569 || D2 == 8585 || 8592 <= D2 && D2 <= 8601 || 8632 <= D2 && D2 <= 8633 || D2 == 8658 || D2 == 8660 || D2 == 8679 || D2 == 8704 || 8706 <= D2 && D2 <= 8707 || 8711 <= D2 && D2 <= 8712 || D2 == 8715 || D2 == 8719 || D2 == 8721 || D2 == 8725 || D2 == 8730 || 8733 <= D2 && D2 <= 8736 || D2 == 8739 || D2 == 8741 || 8743 <= D2 && D2 <= 8748 || D2 == 8750 || 8756 <= D2 && D2 <= 8759 || 8764 <= D2 && D2 <= 8765 || D2 == 8776 || D2 == 8780 || D2 == 8786 || 8800 <= D2 && D2 <= 8801 || 8804 <= D2 && D2 <= 8807 || 8810 <= D2 && D2 <= 8811 || 8814 <= D2 && D2 <= 8815 || 8834 <= D2 && D2 <= 8835 || 8838 <= D2 && D2 <= 8839 || D2 == 8853 || D2 == 8857 || D2 == 8869 || D2 == 8895 || D2 == 8978 || 9312 <= D2 && D2 <= 9449 || 9451 <= D2 && D2 <= 9547 || 9552 <= D2 && D2 <= 9587 || 9600 <= D2 && D2 <= 9615 || 9618 <= D2 && D2 <= 9621 || 9632 <= D2 && D2 <= 9633 || 9635 <= D2 && D2 <= 9641 || 9650 <= D2 && D2 <= 9651 || 9654 <= D2 && D2 <= 9655 || 9660 <= D2 && D2 <= 9661 || 9664 <= D2 && D2 <= 9665 || 9670 <= D2 && D2 <= 9672 || D2 == 9675 || 9678 <= D2 && D2 <= 9681 || 9698 <= D2 && D2 <= 9701 || D2 == 9711 || 9733 <= D2 && D2 <= 9734 || D2 == 9737 || 9742 <= D2 && D2 <= 9743 || 9748 <= D2 && D2 <= 9749 || D2 == 9756 || D2 == 9758 || D2 == 9792 || D2 == 9794 || 9824 <= D2 && D2 <= 9825 || 9827 <= D2 && D2 <= 9829 || 9831 <= D2 && D2 <= 9834 || 9836 <= D2 && D2 <= 9837 || D2 == 9839 || 9886 <= D2 && D2 <= 9887 || 9918 <= D2 && D2 <= 9919 || 9924 <= D2 && D2 <= 9933 || 9935 <= D2 && D2 <= 9953 || D2 == 9955 || 9960 <= D2 && D2 <= 9983 || D2 == 10045 || D2 == 10071 || 10102 <= D2 && D2 <= 10111 || 11093 <= D2 && D2 <= 11097 || 12872 <= D2 && D2 <= 12879 || 57344 <= D2 && D2 <= 63743 || 65024 <= D2 && D2 <= 65039 || D2 == 65533 || 127232 <= D2 && D2 <= 127242 || 127248 <= D2 && D2 <= 127277 || 127280 <= D2 && D2 <= 127337 || 127344 <= D2 && D2 <= 127386 || 917760 <= D2 && D2 <= 917999 || 983040 <= D2 && D2 <= 1048573 || 1048576 <= D2 && D2 <= 1114109 ? "A" : "N";
  }, u2.characterLength = function(F2) {
    var s = this.eastAsianWidth(F2);
    return s == "F" || s == "W" || s == "A" ? 2 : 1;
  };
  function t(F2) {
    return F2.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
  }
  u2.length = function(F2) {
    for (var s = t(F2), i = 0, D2 = 0; D2 < s.length; D2++) i = i + this.characterLength(s[D2]);
    return i;
  }, u2.slice = function(F2, s, i) {
    textLen = u2.length(F2), s = s || 0, i = i || 1, s < 0 && (s = textLen + s), i < 0 && (i = textLen + i);
    for (var D2 = "", r = 0, n = t(F2), E = 0; E < n.length; E++) {
      var a = n[E], o2 = u2.length(a);
      if (r >= s - (o2 == 2 ? 1 : 0)) if (r + o2 <= i) D2 += a;
      else break;
      r += o2;
    }
    return D2;
  };
})(W);
var tD = W.exports;
var eD = L(tD);
var FD = function() {
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};
var sD = L(FD);
function p(e2, u2 = {}) {
  if (typeof e2 != "string" || e2.length === 0 || (u2 = { ambiguousIsNarrow: true, ...u2 }, e2 = P(e2), e2.length === 0)) return 0;
  e2 = e2.replace(sD(), "  ");
  const t = u2.ambiguousIsNarrow ? 1 : 2;
  let F2 = 0;
  for (const s of e2) {
    const i = s.codePointAt(0);
    if (i <= 31 || i >= 127 && i <= 159 || i >= 768 && i <= 879) continue;
    switch (eD.eastAsianWidth(s)) {
      case "F":
      case "W":
        F2 += 2;
        break;
      case "A":
        F2 += t;
        break;
      default:
        F2 += 1;
    }
  }
  return F2;
}
var w = 10;
var N = (e2 = 0) => (u2) => `\x1B[${u2 + e2}m`;
var I = (e2 = 0) => (u2) => `\x1B[${38 + e2};5;${u2}m`;
var R = (e2 = 0) => (u2, t, F2) => `\x1B[${38 + e2};2;${u2};${t};${F2}m`;
var C = { modifier: { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], overline: [53, 55], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29] }, color: { black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], blackBright: [90, 39], gray: [90, 39], grey: [90, 39], redBright: [91, 39], greenBright: [92, 39], yellowBright: [93, 39], blueBright: [94, 39], magentaBright: [95, 39], cyanBright: [96, 39], whiteBright: [97, 39] }, bgColor: { bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], bgBlackBright: [100, 49], bgGray: [100, 49], bgGrey: [100, 49], bgRedBright: [101, 49], bgGreenBright: [102, 49], bgYellowBright: [103, 49], bgBlueBright: [104, 49], bgMagentaBright: [105, 49], bgCyanBright: [106, 49], bgWhiteBright: [107, 49] } };
Object.keys(C.modifier);
var iD = Object.keys(C.color);
var rD = Object.keys(C.bgColor);
[...iD, ...rD];
function CD() {
  const e2 = /* @__PURE__ */ new Map();
  for (const [u2, t] of Object.entries(C)) {
    for (const [F2, s] of Object.entries(t)) C[F2] = { open: `\x1B[${s[0]}m`, close: `\x1B[${s[1]}m` }, t[F2] = C[F2], e2.set(s[0], s[1]);
    Object.defineProperty(C, u2, { value: t, enumerable: false });
  }
  return Object.defineProperty(C, "codes", { value: e2, enumerable: false }), C.color.close = "\x1B[39m", C.bgColor.close = "\x1B[49m", C.color.ansi = N(), C.color.ansi256 = I(), C.color.ansi16m = R(), C.bgColor.ansi = N(w), C.bgColor.ansi256 = I(w), C.bgColor.ansi16m = R(w), Object.defineProperties(C, { rgbToAnsi256: { value: (u2, t, F2) => u2 === t && t === F2 ? u2 < 8 ? 16 : u2 > 248 ? 231 : Math.round((u2 - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(u2 / 255 * 5) + 6 * Math.round(t / 255 * 5) + Math.round(F2 / 255 * 5), enumerable: false }, hexToRgb: { value: (u2) => {
    const t = /[a-f\d]{6}|[a-f\d]{3}/i.exec(u2.toString(16));
    if (!t) return [0, 0, 0];
    let [F2] = t;
    F2.length === 3 && (F2 = [...F2].map((i) => i + i).join(""));
    const s = Number.parseInt(F2, 16);
    return [s >> 16 & 255, s >> 8 & 255, s & 255];
  }, enumerable: false }, hexToAnsi256: { value: (u2) => C.rgbToAnsi256(...C.hexToRgb(u2)), enumerable: false }, ansi256ToAnsi: { value: (u2) => {
    if (u2 < 8) return 30 + u2;
    if (u2 < 16) return 90 + (u2 - 8);
    let t, F2, s;
    if (u2 >= 232) t = ((u2 - 232) * 10 + 8) / 255, F2 = t, s = t;
    else {
      u2 -= 16;
      const r = u2 % 36;
      t = Math.floor(u2 / 36) / 5, F2 = Math.floor(r / 6) / 5, s = r % 6 / 5;
    }
    const i = Math.max(t, F2, s) * 2;
    if (i === 0) return 30;
    let D2 = 30 + (Math.round(s) << 2 | Math.round(F2) << 1 | Math.round(t));
    return i === 2 && (D2 += 60), D2;
  }, enumerable: false }, rgbToAnsi: { value: (u2, t, F2) => C.ansi256ToAnsi(C.rgbToAnsi256(u2, t, F2)), enumerable: false }, hexToAnsi: { value: (u2) => C.ansi256ToAnsi(C.hexToAnsi256(u2)), enumerable: false } }), C;
}
var ED = CD();
var d = /* @__PURE__ */ new Set(["\x1B", "\x9B"]);
var oD = 39;
var y = "\x07";
var V = "[";
var nD = "]";
var G = "m";
var _ = `${nD}8;;`;
var z = (e2) => `${d.values().next().value}${V}${e2}${G}`;
var K = (e2) => `${d.values().next().value}${_}${e2}${y}`;
var aD = (e2) => e2.split(" ").map((u2) => p(u2));
var k = (e2, u2, t) => {
  const F2 = [...u2];
  let s = false, i = false, D2 = p(P(e2[e2.length - 1]));
  for (const [r, n] of F2.entries()) {
    const E = p(n);
    if (D2 + E <= t ? e2[e2.length - 1] += n : (e2.push(n), D2 = 0), d.has(n) && (s = true, i = F2.slice(r + 1).join("").startsWith(_)), s) {
      i ? n === y && (s = false, i = false) : n === G && (s = false);
      continue;
    }
    D2 += E, D2 === t && r < F2.length - 1 && (e2.push(""), D2 = 0);
  }
  !D2 && e2[e2.length - 1].length > 0 && e2.length > 1 && (e2[e2.length - 2] += e2.pop());
};
var hD = (e2) => {
  const u2 = e2.split(" ");
  let t = u2.length;
  for (; t > 0 && !(p(u2[t - 1]) > 0); ) t--;
  return t === u2.length ? e2 : u2.slice(0, t).join(" ") + u2.slice(t).join("");
};
var lD = (e2, u2, t = {}) => {
  if (t.trim !== false && e2.trim() === "") return "";
  let F2 = "", s, i;
  const D2 = aD(e2);
  let r = [""];
  for (const [E, a] of e2.split(" ").entries()) {
    t.trim !== false && (r[r.length - 1] = r[r.length - 1].trimStart());
    let o2 = p(r[r.length - 1]);
    if (E !== 0 && (o2 >= u2 && (t.wordWrap === false || t.trim === false) && (r.push(""), o2 = 0), (o2 > 0 || t.trim === false) && (r[r.length - 1] += " ", o2++)), t.hard && D2[E] > u2) {
      const c = u2 - o2, f = 1 + Math.floor((D2[E] - c - 1) / u2);
      Math.floor((D2[E] - 1) / u2) < f && r.push(""), k(r, a, u2);
      continue;
    }
    if (o2 + D2[E] > u2 && o2 > 0 && D2[E] > 0) {
      if (t.wordWrap === false && o2 < u2) {
        k(r, a, u2);
        continue;
      }
      r.push("");
    }
    if (o2 + D2[E] > u2 && t.wordWrap === false) {
      k(r, a, u2);
      continue;
    }
    r[r.length - 1] += a;
  }
  t.trim !== false && (r = r.map((E) => hD(E)));
  const n = [...r.join(`
`)];
  for (const [E, a] of n.entries()) {
    if (F2 += a, d.has(a)) {
      const { groups: c } = new RegExp(`(?:\\${V}(?<code>\\d+)m|\\${_}(?<uri>.*)${y})`).exec(n.slice(E).join("")) || { groups: {} };
      if (c.code !== void 0) {
        const f = Number.parseFloat(c.code);
        s = f === oD ? void 0 : f;
      } else c.uri !== void 0 && (i = c.uri.length === 0 ? void 0 : c.uri);
    }
    const o2 = ED.codes.get(Number(s));
    n[E + 1] === `
` ? (i && (F2 += K("")), s && o2 && (F2 += z(o2))) : a === `
` && (s && o2 && (F2 += z(s)), i && (F2 += K(i)));
  }
  return F2;
};
function Y(e2, u2, t) {
  return String(e2).normalize().replace(/\r\n/g, `
`).split(`
`).map((F2) => lD(F2, u2, t)).join(`
`);
}
var xD = ["up", "down", "left", "right", "space", "enter", "cancel"];
var B = { actions: new Set(xD), aliases: /* @__PURE__ */ new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"], ["", "cancel"], ["escape", "cancel"]]) };
function $(e2, u2) {
  if (typeof e2 == "string") return B.aliases.get(e2) === u2;
  for (const t of e2) if (t !== void 0 && $(t, u2)) return true;
  return false;
}
function BD(e2, u2) {
  if (e2 === u2) return;
  const t = e2.split(`
`), F2 = u2.split(`
`), s = [];
  for (let i = 0; i < Math.max(t.length, F2.length); i++) t[i] !== F2[i] && s.push(i);
  return s;
}
var AD = globalThis.process.platform.startsWith("win");
var S = /* @__PURE__ */ Symbol("clack:cancel");
function pD(e2) {
  return e2 === S;
}
function m(e2, u2) {
  const t = e2;
  t.isTTY && t.setRawMode(u2);
}
function fD({ input: e2 = j, output: u2 = M, overwrite: t = true, hideCursor: F2 = true } = {}) {
  const s = g.createInterface({ input: e2, output: u2, prompt: "", tabSize: 1 });
  g.emitKeypressEvents(e2, s), e2.isTTY && e2.setRawMode(true);
  const i = (D2, { name: r, sequence: n }) => {
    const E = String(D2);
    if ($([E, r, n], "cancel")) {
      F2 && u2.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!t) return;
    const a = r === "return" ? 0 : -1, o2 = r === "return" ? -1 : 0;
    g.moveCursor(u2, a, o2, () => {
      g.clearLine(u2, 1, () => {
        e2.once("keypress", i);
      });
    });
  };
  return F2 && u2.write(import_sisteransi.cursor.hide), e2.once("keypress", i), () => {
    e2.off("keypress", i), F2 && u2.write(import_sisteransi.cursor.show), e2.isTTY && !AD && e2.setRawMode(false), s.terminal = false, s.close();
  };
}
var gD = Object.defineProperty;
var vD = (e2, u2, t) => u2 in e2 ? gD(e2, u2, { enumerable: true, configurable: true, writable: true, value: t }) : e2[u2] = t;
var h = (e2, u2, t) => (vD(e2, typeof u2 != "symbol" ? u2 + "" : u2, t), t);
var x = class {
  constructor(u2, t = true) {
    h(this, "input"), h(this, "output"), h(this, "_abortSignal"), h(this, "rl"), h(this, "opts"), h(this, "_render"), h(this, "_track", false), h(this, "_prevFrame", ""), h(this, "_subscribers", /* @__PURE__ */ new Map()), h(this, "_cursor", 0), h(this, "state", "initial"), h(this, "error", ""), h(this, "value");
    const { input: F2 = j, output: s = M, render: i, signal: D2, ...r } = u2;
    this.opts = r, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = i.bind(this), this._track = t, this._abortSignal = D2, this.input = F2, this.output = s;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(u2, t) {
    const F2 = this._subscribers.get(u2) ?? [];
    F2.push(t), this._subscribers.set(u2, F2);
  }
  on(u2, t) {
    this.setSubscriber(u2, { cb: t });
  }
  once(u2, t) {
    this.setSubscriber(u2, { cb: t, once: true });
  }
  emit(u2, ...t) {
    const F2 = this._subscribers.get(u2) ?? [], s = [];
    for (const i of F2) i.cb(...t), i.once && s.push(() => F2.splice(F2.indexOf(i), 1));
    for (const i of s) i();
  }
  prompt() {
    return new Promise((u2, t) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted) return this.state = "cancel", this.close(), u2(S);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      const F2 = new X();
      F2._write = (s, i, D2) => {
        this._track && (this.value = this.rl?.line.replace(/\t/g, ""), this._cursor = this.rl?.cursor ?? 0, this.emit("value", this.value)), D2();
      }, this.input.pipe(F2), this.rl = O.createInterface({ input: this.input, output: F2, tabSize: 2, prompt: "", escapeCodeTimeout: 50, terminal: true }), O.emitKeypressEvents(this.input, this.rl), this.rl.prompt(), this.opts.initialValue !== void 0 && this._track && this.rl.write(this.opts.initialValue), this.input.on("keypress", this.onKeypress), m(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u2(S);
      });
    });
  }
  onKeypress(u2, t) {
    if (this.state === "error" && (this.state = "active"), t?.name && (!this._track && B.aliases.has(t.name) && this.emit("cursor", B.aliases.get(t.name)), B.actions.has(t.name) && this.emit("cursor", t.name)), u2 && (u2.toLowerCase() === "y" || u2.toLowerCase() === "n") && this.emit("confirm", u2.toLowerCase() === "y"), u2 === "	" && this.opts.placeholder && (this.value || (this.rl?.write(this.opts.placeholder), this.emit("value", this.opts.placeholder))), u2 && this.emit("key", u2.toLowerCase()), t?.name === "return") {
      if (!this.value && this.opts.placeholder && (this.rl?.write(this.opts.placeholder), this.emit("value", this.opts.placeholder)), this.opts.validate) {
        const F2 = this.opts.validate(this.value);
        F2 && (this.error = F2 instanceof Error ? F2.message : F2, this.state = "error", this.rl?.write(this.value));
      }
      this.state !== "error" && (this.state = "submit");
    }
    $([u2, t?.name, t?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), m(this.input, false), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const u2 = Y(this._prevFrame, process.stdout.columns, { hard: true }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, u2 * -1));
  }
  render() {
    const u2 = Y(this._render(this) ?? "", process.stdout.columns, { hard: true });
    if (u2 !== this._prevFrame) {
      if (this.state === "initial") this.output.write(import_sisteransi.cursor.hide);
      else {
        const t = BD(this._prevFrame, u2);
        if (this.restoreCursor(), t && t?.length === 1) {
          const F2 = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F2)), this.output.write(import_sisteransi.erase.lines(1));
          const s = u2.split(`
`);
          this.output.write(s[F2]), this._prevFrame = u2, this.output.write(import_sisteransi.cursor.move(0, s.length - F2 - 1));
          return;
        }
        if (t && t?.length > 1) {
          const F2 = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F2)), this.output.write(import_sisteransi.erase.down());
          const s = u2.split(`
`).slice(F2);
          this.output.write(s.join(`
`)), this._prevFrame = u2;
          return;
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(u2), this.state === "initial" && (this.state = "active"), this._prevFrame = u2;
    }
  }
};
var dD = class extends x {
  get cursor() {
    return this.value ? 0 : 1;
  }
  get _value() {
    return this.cursor === 0;
  }
  constructor(u2) {
    super(u2, false), this.value = !!u2.initialValue, this.on("value", () => {
      this.value = this._value;
    }), this.on("confirm", (t) => {
      this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = t, this.state = "submit", this.close();
    }), this.on("cursor", () => {
      this.value = !this.value;
    });
  }
};
var A;
A = /* @__PURE__ */ new WeakMap();
var kD = Object.defineProperty;
var $D = (e2, u2, t) => u2 in e2 ? kD(e2, u2, { enumerable: true, configurable: true, writable: true, value: t }) : e2[u2] = t;
var H = (e2, u2, t) => ($D(e2, typeof u2 != "symbol" ? u2 + "" : u2, t), t);
var SD = class extends x {
  constructor(u2) {
    super(u2, false), H(this, "options"), H(this, "cursor", 0), this.options = u2.options, this.value = [...u2.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: t }) => t === u2.cursorAt), 0), this.on("key", (t) => {
      t === "a" && this.toggleAll();
    }), this.on("cursor", (t) => {
      switch (t) {
        case "left":
        case "up":
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          break;
        case "down":
        case "right":
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          break;
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
  get _value() {
    return this.options[this.cursor].value;
  }
  toggleAll() {
    const u2 = this.value.length === this.options.length;
    this.value = u2 ? [] : this.options.map((t) => t.value);
  }
  toggleValue() {
    const u2 = this.value.includes(this._value);
    this.value = u2 ? this.value.filter((t) => t !== this._value) : [...this.value, this._value];
  }
};
var OD = Object.defineProperty;
var PD = (e2, u2, t) => u2 in e2 ? OD(e2, u2, { enumerable: true, configurable: true, writable: true, value: t }) : e2[u2] = t;
var J = (e2, u2, t) => (PD(e2, typeof u2 != "symbol" ? u2 + "" : u2, t), t);
var LD = class extends x {
  constructor(u2) {
    super(u2, false), J(this, "options"), J(this, "cursor", 0), this.options = u2.options, this.cursor = this.options.findIndex(({ value: t }) => t === u2.initialValue), this.cursor === -1 && (this.cursor = 0), this.changeValue(), this.on("cursor", (t) => {
      switch (t) {
        case "left":
        case "up":
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          break;
        case "down":
        case "right":
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          break;
      }
      this.changeValue();
    });
  }
  get _value() {
    return this.options[this.cursor];
  }
  changeValue() {
    this.value = this._value.value;
  }
};
var RD = class extends x {
  get valueWithCursor() {
    if (this.state === "submit") return this.value;
    if (this.cursor >= this.value.length) return `${this.value}\u2588`;
    const u2 = this.value.slice(0, this.cursor), [t, ...F2] = this.value.slice(this.cursor);
    return `${u2}${import_picocolors2.default.inverse(t)}${F2.join("")}`;
  }
  get cursor() {
    return this._cursor;
  }
  constructor(u2) {
    super(u2), this.on("finalize", () => {
      this.value || (this.value = u2.defaultValue);
    });
  }
};

// node_modules/@clack/prompts/dist/index.mjs
var import_picocolors3 = __toESM(require_picocolors(), 1);
var import_sisteransi2 = __toESM(require_src(), 1);
import y2 from "process";
function ce() {
  return y2.platform !== "win32" ? y2.env.TERM !== "linux" : !!y2.env.CI || !!y2.env.WT_SESSION || !!y2.env.TERMINUS_SUBLIME || y2.env.ConEmuTask === "{cmd::Cmder}" || y2.env.TERM_PROGRAM === "Terminus-Sublime" || y2.env.TERM_PROGRAM === "vscode" || y2.env.TERM === "xterm-256color" || y2.env.TERM === "alacritty" || y2.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var V2 = ce();
var u = (t, n) => V2 ? t : n;
var le = u("\u25C6", "*");
var L2 = u("\u25A0", "x");
var W2 = u("\u25B2", "x");
var C2 = u("\u25C7", "o");
var ue = u("\u250C", "T");
var o = u("\u2502", "|");
var d2 = u("\u2514", "\u2014");
var k2 = u("\u25CF", ">");
var P2 = u("\u25CB", " ");
var A2 = u("\u25FB", "[\u2022]");
var T = u("\u25FC", "[+]");
var F = u("\u25FB", "[ ]");
var $e = u("\u25AA", "\u2022");
var _2 = u("\u2500", "-");
var me = u("\u256E", "+");
var de = u("\u251C", "+");
var pe = u("\u256F", "+");
var q = u("\u25CF", "\u2022");
var D = u("\u25C6", "*");
var U = u("\u25B2", "!");
var K2 = u("\u25A0", "x");
var b2 = (t) => {
  switch (t) {
    case "initial":
    case "active":
      return import_picocolors3.default.cyan(le);
    case "cancel":
      return import_picocolors3.default.red(L2);
    case "error":
      return import_picocolors3.default.yellow(W2);
    case "submit":
      return import_picocolors3.default.green(C2);
  }
};
var G2 = (t) => {
  const { cursor: n, options: r, style: i } = t, s = t.maxItems ?? Number.POSITIVE_INFINITY, c = Math.max(process.stdout.rows - 4, 0), a = Math.min(c, Math.max(s, 5));
  let l2 = 0;
  n >= l2 + a - 3 ? l2 = Math.max(Math.min(n - a + 3, r.length - a), 0) : n < l2 + 2 && (l2 = Math.max(n - 2, 0));
  const $2 = a < r.length && l2 > 0, g2 = a < r.length && l2 + a < r.length;
  return r.slice(l2, l2 + a).map((p2, v2, f) => {
    const j2 = v2 === 0 && $2, E = v2 === f.length - 1 && g2;
    return j2 || E ? import_picocolors3.default.dim("...") : i(p2, v2 + l2 === n);
  });
};
var he = (t) => new RD({ validate: t.validate, placeholder: t.placeholder, defaultValue: t.defaultValue, initialValue: t.initialValue, render() {
  const n = `${import_picocolors3.default.gray(o)}
${b2(this.state)}  ${t.message}
`, r = t.placeholder ? import_picocolors3.default.inverse(t.placeholder[0]) + import_picocolors3.default.dim(t.placeholder.slice(1)) : import_picocolors3.default.inverse(import_picocolors3.default.hidden("_")), i = this.value ? this.valueWithCursor : r;
  switch (this.state) {
    case "error":
      return `${n.trim()}
${import_picocolors3.default.yellow(o)}  ${i}
${import_picocolors3.default.yellow(d2)}  ${import_picocolors3.default.yellow(this.error)}
`;
    case "submit":
      return `${n}${import_picocolors3.default.gray(o)}  ${import_picocolors3.default.dim(this.value || t.placeholder)}`;
    case "cancel":
      return `${n}${import_picocolors3.default.gray(o)}  ${import_picocolors3.default.strikethrough(import_picocolors3.default.dim(this.value ?? ""))}${this.value?.trim() ? `
${import_picocolors3.default.gray(o)}` : ""}`;
    default:
      return `${n}${import_picocolors3.default.cyan(o)}  ${i}
${import_picocolors3.default.cyan(d2)}
`;
  }
} }).prompt();
var ye = (t) => {
  const n = t.active ?? "Yes", r = t.inactive ?? "No";
  return new dD({ active: n, inactive: r, initialValue: t.initialValue ?? true, render() {
    const i = `${import_picocolors3.default.gray(o)}
${b2(this.state)}  ${t.message}
`, s = this.value ? n : r;
    switch (this.state) {
      case "submit":
        return `${i}${import_picocolors3.default.gray(o)}  ${import_picocolors3.default.dim(s)}`;
      case "cancel":
        return `${i}${import_picocolors3.default.gray(o)}  ${import_picocolors3.default.strikethrough(import_picocolors3.default.dim(s))}
${import_picocolors3.default.gray(o)}`;
      default:
        return `${i}${import_picocolors3.default.cyan(o)}  ${this.value ? `${import_picocolors3.default.green(k2)} ${n}` : `${import_picocolors3.default.dim(P2)} ${import_picocolors3.default.dim(n)}`} ${import_picocolors3.default.dim("/")} ${this.value ? `${import_picocolors3.default.dim(P2)} ${import_picocolors3.default.dim(r)}` : `${import_picocolors3.default.green(k2)} ${r}`}
${import_picocolors3.default.cyan(d2)}
`;
    }
  } }).prompt();
};
var ve = (t) => {
  const n = (r, i) => {
    const s = r.label ?? String(r.value);
    switch (i) {
      case "selected":
        return `${import_picocolors3.default.dim(s)}`;
      case "active":
        return `${import_picocolors3.default.green(k2)} ${s} ${r.hint ? import_picocolors3.default.dim(`(${r.hint})`) : ""}`;
      case "cancelled":
        return `${import_picocolors3.default.strikethrough(import_picocolors3.default.dim(s))}`;
      default:
        return `${import_picocolors3.default.dim(P2)} ${import_picocolors3.default.dim(s)}`;
    }
  };
  return new LD({ options: t.options, initialValue: t.initialValue, render() {
    const r = `${import_picocolors3.default.gray(o)}
${b2(this.state)}  ${t.message}
`;
    switch (this.state) {
      case "submit":
        return `${r}${import_picocolors3.default.gray(o)}  ${n(this.options[this.cursor], "selected")}`;
      case "cancel":
        return `${r}${import_picocolors3.default.gray(o)}  ${n(this.options[this.cursor], "cancelled")}
${import_picocolors3.default.gray(o)}`;
      default:
        return `${r}${import_picocolors3.default.cyan(o)}  ${G2({ cursor: this.cursor, options: this.options, maxItems: t.maxItems, style: (i, s) => n(i, s ? "active" : "inactive") }).join(`
${import_picocolors3.default.cyan(o)}  `)}
${import_picocolors3.default.cyan(d2)}
`;
    }
  } }).prompt();
};
var fe = (t) => {
  const n = (r, i) => {
    const s = r.label ?? String(r.value);
    return i === "active" ? `${import_picocolors3.default.cyan(A2)} ${s} ${r.hint ? import_picocolors3.default.dim(`(${r.hint})`) : ""}` : i === "selected" ? `${import_picocolors3.default.green(T)} ${import_picocolors3.default.dim(s)} ${r.hint ? import_picocolors3.default.dim(`(${r.hint})`) : ""}` : i === "cancelled" ? `${import_picocolors3.default.strikethrough(import_picocolors3.default.dim(s))}` : i === "active-selected" ? `${import_picocolors3.default.green(T)} ${s} ${r.hint ? import_picocolors3.default.dim(`(${r.hint})`) : ""}` : i === "submitted" ? `${import_picocolors3.default.dim(s)}` : `${import_picocolors3.default.dim(F)} ${import_picocolors3.default.dim(s)}`;
  };
  return new SD({ options: t.options, initialValues: t.initialValues, required: t.required ?? true, cursorAt: t.cursorAt, validate(r) {
    if (this.required && r.length === 0) return `Please select at least one option.
${import_picocolors3.default.reset(import_picocolors3.default.dim(`Press ${import_picocolors3.default.gray(import_picocolors3.default.bgWhite(import_picocolors3.default.inverse(" space ")))} to select, ${import_picocolors3.default.gray(import_picocolors3.default.bgWhite(import_picocolors3.default.inverse(" enter ")))} to submit`))}`;
  }, render() {
    const r = `${import_picocolors3.default.gray(o)}
${b2(this.state)}  ${t.message}
`, i = (s, c) => {
      const a = this.value.includes(s.value);
      return c && a ? n(s, "active-selected") : a ? n(s, "selected") : n(s, c ? "active" : "inactive");
    };
    switch (this.state) {
      case "submit":
        return `${r}${import_picocolors3.default.gray(o)}  ${this.options.filter(({ value: s }) => this.value.includes(s)).map((s) => n(s, "submitted")).join(import_picocolors3.default.dim(", ")) || import_picocolors3.default.dim("none")}`;
      case "cancel": {
        const s = this.options.filter(({ value: c }) => this.value.includes(c)).map((c) => n(c, "cancelled")).join(import_picocolors3.default.dim(", "));
        return `${r}${import_picocolors3.default.gray(o)}  ${s.trim() ? `${s}
${import_picocolors3.default.gray(o)}` : ""}`;
      }
      case "error": {
        const s = this.error.split(`
`).map((c, a) => a === 0 ? `${import_picocolors3.default.yellow(d2)}  ${import_picocolors3.default.yellow(c)}` : `   ${c}`).join(`
`);
        return `${r + import_picocolors3.default.yellow(o)}  ${G2({ options: this.options, cursor: this.cursor, maxItems: t.maxItems, style: i }).join(`
${import_picocolors3.default.yellow(o)}  `)}
${s}
`;
      }
      default:
        return `${r}${import_picocolors3.default.cyan(o)}  ${G2({ options: this.options, cursor: this.cursor, maxItems: t.maxItems, style: i }).join(`
${import_picocolors3.default.cyan(o)}  `)}
${import_picocolors3.default.cyan(d2)}
`;
    }
  } }).prompt();
};
var Me = (t = "", n = "") => {
  const r = `
${t}
`.split(`
`), i = S2(n).length, s = Math.max(r.reduce((a, l2) => {
    const $2 = S2(l2);
    return $2.length > a ? $2.length : a;
  }, 0), i) + 2, c = r.map((a) => `${import_picocolors3.default.gray(o)}  ${import_picocolors3.default.dim(a)}${" ".repeat(s - S2(a).length)}${import_picocolors3.default.gray(o)}`).join(`
`);
  process.stdout.write(`${import_picocolors3.default.gray(o)}
${import_picocolors3.default.green(C2)}  ${import_picocolors3.default.reset(n)} ${import_picocolors3.default.gray(_2.repeat(Math.max(s - i - 1, 1)) + me)}
${c}
${import_picocolors3.default.gray(de + _2.repeat(s + 2) + pe)}
`);
};
var xe = (t = "") => {
  process.stdout.write(`${import_picocolors3.default.gray(d2)}  ${import_picocolors3.default.red(t)}

`);
};
var Ie = (t = "") => {
  process.stdout.write(`${import_picocolors3.default.gray(ue)}  ${t}
`);
};
var Se = (t = "") => {
  process.stdout.write(`${import_picocolors3.default.gray(o)}
${import_picocolors3.default.gray(d2)}  ${t}

`);
};
var M2 = { message: (t = "", { symbol: n = import_picocolors3.default.gray(o) } = {}) => {
  const r = [`${import_picocolors3.default.gray(o)}`];
  if (t) {
    const [i, ...s] = t.split(`
`);
    r.push(`${n}  ${i}`, ...s.map((c) => `${import_picocolors3.default.gray(o)}  ${c}`));
  }
  process.stdout.write(`${r.join(`
`)}
`);
}, info: (t) => {
  M2.message(t, { symbol: import_picocolors3.default.blue(q) });
}, success: (t) => {
  M2.message(t, { symbol: import_picocolors3.default.green(D) });
}, step: (t) => {
  M2.message(t, { symbol: import_picocolors3.default.green(C2) });
}, warn: (t) => {
  M2.message(t, { symbol: import_picocolors3.default.yellow(U) });
}, warning: (t) => {
  M2.warn(t);
}, error: (t) => {
  M2.message(t, { symbol: import_picocolors3.default.red(K2) });
} };
var J2 = `${import_picocolors3.default.gray(o)}  `;
var Y2 = ({ indicator: t = "dots" } = {}) => {
  const n = V2 ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["\u2022", "o", "O", "0"], r = V2 ? 80 : 120, i = process.env.CI === "true";
  let s, c, a = false, l2 = "", $2, g2 = performance.now();
  const p2 = (m2) => {
    const h2 = m2 > 1 ? "Something went wrong" : "Canceled";
    a && N2(h2, m2);
  }, v2 = () => p2(2), f = () => p2(1), j2 = () => {
    process.on("uncaughtExceptionMonitor", v2), process.on("unhandledRejection", v2), process.on("SIGINT", f), process.on("SIGTERM", f), process.on("exit", p2);
  }, E = () => {
    process.removeListener("uncaughtExceptionMonitor", v2), process.removeListener("unhandledRejection", v2), process.removeListener("SIGINT", f), process.removeListener("SIGTERM", f), process.removeListener("exit", p2);
  }, B2 = () => {
    if ($2 === void 0) return;
    i && process.stdout.write(`
`);
    const m2 = $2.split(`
`);
    process.stdout.write(import_sisteransi2.cursor.move(-999, m2.length - 1)), process.stdout.write(import_sisteransi2.erase.down(m2.length));
  }, R2 = (m2) => m2.replace(/\.+$/, ""), O2 = (m2) => {
    const h2 = (performance.now() - m2) / 1e3, w2 = Math.floor(h2 / 60), I2 = Math.floor(h2 % 60);
    return w2 > 0 ? `[${w2}m ${I2}s]` : `[${I2}s]`;
  }, H2 = (m2 = "") => {
    a = true, s = fD(), l2 = R2(m2), g2 = performance.now(), process.stdout.write(`${import_picocolors3.default.gray(o)}
`);
    let h2 = 0, w2 = 0;
    j2(), c = setInterval(() => {
      if (i && l2 === $2) return;
      B2(), $2 = l2;
      const I2 = import_picocolors3.default.magenta(n[h2]);
      if (i) process.stdout.write(`${I2}  ${l2}...`);
      else if (t === "timer") process.stdout.write(`${I2}  ${l2} ${O2(g2)}`);
      else {
        const z2 = ".".repeat(Math.floor(w2)).slice(0, 3);
        process.stdout.write(`${I2}  ${l2}${z2}`);
      }
      h2 = h2 + 1 < n.length ? h2 + 1 : 0, w2 = w2 < n.length ? w2 + 0.125 : 0;
    }, r);
  }, N2 = (m2 = "", h2 = 0) => {
    a = false, clearInterval(c), B2();
    const w2 = h2 === 0 ? import_picocolors3.default.green(C2) : h2 === 1 ? import_picocolors3.default.red(L2) : import_picocolors3.default.red(W2);
    l2 = R2(m2 ?? l2), t === "timer" ? process.stdout.write(`${w2}  ${l2} ${O2(g2)}
`) : process.stdout.write(`${w2}  ${l2}
`), E(), s();
  };
  return { start: H2, stop: N2, message: (m2 = "") => {
    l2 = R2(m2 ?? l2);
  } };
};

// src/cli/prompts.ts
var import_picocolors5 = __toESM(require_picocolors(), 1);

// src/cli/diff.ts
var import_picocolors4 = __toESM(require_picocolors(), 1);
function computeLcsDiff(oldLines, newLines) {
  const m2 = oldLines.length;
  const n = newLines.length;
  const dp = Array.from({ length: m2 + 1 }, () => new Uint16Array(n + 1));
  for (let i2 = m2 - 1; i2 >= 0; i2--) {
    for (let j3 = n - 1; j3 >= 0; j3--) {
      if (oldLines[i2] === newLines[j3]) {
        dp[i2][j3] = dp[i2 + 1][j3 + 1] + 1;
      } else {
        dp[i2][j3] = Math.max(dp[i2 + 1][j3], dp[i2][j3 + 1]);
      }
    }
  }
  const out = [];
  let i = 0;
  let j2 = 0;
  while (i < m2 && j2 < n) {
    if (oldLines[i] === newLines[j2]) {
      out.push({ kind: "same", text: oldLines[i] });
      i++;
      j2++;
    } else if (dp[i + 1][j2] >= dp[i][j2 + 1]) {
      out.push({ kind: "del", text: oldLines[i] });
      i++;
    } else {
      out.push({ kind: "add", text: newLines[j2] });
      j2++;
    }
  }
  while (i < m2) {
    out.push({ kind: "del", text: oldLines[i++] });
  }
  while (j2 < n) {
    out.push({ kind: "add", text: newLines[j2++] });
  }
  return out;
}
function computeRangeDiff(oldLines, newLines) {
  let start = 0;
  while (start < oldLines.length && start < newLines.length && oldLines[start] === newLines[start]) {
    start++;
  }
  let oldEnd = oldLines.length - 1;
  let newEnd = newLines.length - 1;
  while (oldEnd >= start && newEnd >= start && oldLines[oldEnd] === newLines[newEnd]) {
    oldEnd--;
    newEnd--;
  }
  const out = [];
  if (start > 0) {
    out.push({ kind: "same", text: oldLines[start - 1] });
  }
  for (let i = start; i <= oldEnd; i++) {
    out.push({ kind: "del", text: oldLines[i] });
  }
  for (let j2 = start; j2 <= newEnd; j2++) {
    out.push({ kind: "add", text: newLines[j2] });
  }
  if (oldEnd + 1 < oldLines.length) {
    out.push({ kind: "same", text: oldLines[oldEnd + 1] });
  }
  return out;
}
function formatShortDiff(existing, incoming, filePath, maxLines = 16) {
  if (!isTextFile(filePath, existing) || !isTextFile(filePath, incoming)) {
    return `Binary file differs (${existing.length} bytes on disk -> ${incoming.length} bytes incoming).`;
  }
  const oldLines = existing.toString("utf8").replace(/\r\n/g, "\n").split("\n");
  const newLines = incoming.toString("utf8").replace(/\r\n/g, "\n").split("\n");
  const diffLines = oldLines.length <= 400 && newLines.length <= 400 ? computeLcsDiff(oldLines, newLines) : computeRangeDiff(oldLines, newLines);
  const include = /* @__PURE__ */ new Set();
  for (let i = 0; i < diffLines.length; i++) {
    if (diffLines[i].kind !== "same") {
      if (i > 0) include.add(i - 1);
      include.add(i);
      if (i + 1 < diffLines.length) include.add(i + 1);
    }
  }
  const formatted = [];
  let prevIdx = -1;
  for (let i = 0; i < diffLines.length; i++) {
    if (!include.has(i)) continue;
    if (prevIdx !== -1 && i > prevIdx + 1) {
      formatted.push(import_picocolors4.default.dim("..."));
    }
    const line = diffLines[i];
    if (line.kind === "del") {
      formatted.push(import_picocolors4.default.red(`- ${line.text}`));
    } else if (line.kind === "add") {
      formatted.push(import_picocolors4.default.green(`+ ${line.text}`));
    } else {
      formatted.push(import_picocolors4.default.dim(`  ${line.text}`));
    }
    prevIdx = i;
  }
  if (formatted.length === 0) {
    return import_picocolors4.default.dim("(whitespace or line-ending difference)");
  }
  if (formatted.length > maxLines) {
    const remaining = formatted.length - maxLines;
    return [...formatted.slice(0, maxLines), import_picocolors4.default.dim(`... (+${remaining} more lines)`)].join("\n");
  }
  return formatted.join("\n");
}

// src/cli/prompts.ts
function assertNotCancelled(value) {
  if (pD(value)) {
    xe("Operation cancelled.");
    process.exit(0);
  }
  return value;
}
function truncateText(text, maxLen = 60) {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLen) {
    return collapsed;
  }
  return `${collapsed.slice(0, maxLen - 3)}...`;
}
function formatDetectedHeader(sourceLabel, format) {
  return `Detected ${sourceLabel} (${FORMAT_META[format].configDir})`;
}
function formatSelectionCounts(pkg) {
  const parts = [];
  if (pkg.skills.length > 0) {
    parts.push(`${pkg.skills.length} skill${pkg.skills.length === 1 ? "" : "s"}`);
  }
  for (const rule of pkg.rootRules) {
    parts.push(rule.sourceFilename);
  }
  const configCount = pkg.sharedAssets.filter(
    (a) => isConfigAssetPath(a.relativePath)
  ).length;
  const sharedCount = pkg.sharedAssets.length - configCount;
  if (sharedCount > 0) {
    parts.push(`${sharedCount} shared asset${sharedCount === 1 ? "" : "s"}`);
  }
  if (configCount > 0) {
    parts.push(`${configCount} config file${configCount === 1 ? "" : "s"}`);
  }
  return parts.join(", ");
}
function formatPackageOverview(pkg, maxSkills = 12) {
  const lines = [];
  const visibleSkills = pkg.skills.slice(0, maxSkills);
  for (const skill of visibleSkills) {
    const desc = skill.description ? ` \u2014 ${truncateText(skill.description, 60)}` : "";
    const assets = skill.assets.length > 0 ? ` [${skill.assets.length} asset${skill.assets.length === 1 ? "" : "s"}]` : "";
    lines.push(`\u2022 ${skill.name}${desc}${assets}`);
  }
  if (pkg.skills.length > maxSkills) {
    const extra = pkg.skills.length - maxSkills;
    lines.push(`... and ${extra} more skill${extra === 1 ? "" : "s"}`);
  }
  for (const rule of pkg.rootRules) {
    lines.push(`\u2022 ${rule.sourceFilename} (root rule)`);
  }
  const configCount = pkg.sharedAssets.filter(
    (a) => isConfigAssetPath(a.relativePath)
  ).length;
  const sharedCount = pkg.sharedAssets.length - configCount;
  if (sharedCount > 0) {
    lines.push(
      `\u2022 Shared config assets (${sharedCount} file${sharedCount === 1 ? "" : "s"})`
    );
  }
  if (configCount > 0) {
    lines.push(
      `\u2022 Settings, hooks, MCP (${configCount} file${configCount === 1 ? "" : "s"}, skipped unless --with-config)`
    );
  }
  return lines.join("\n");
}
async function promptSourceFormatSelection(detections) {
  const selected = assertNotCancelled(
    await ve({
      message: "Multiple formats detected. Which source format should Everyagent read from?",
      options: detections.map((d3) => ({
        value: d3.format,
        label: d3.summary
      }))
    })
  );
  const match = detections.find((d3) => d3.format === selected);
  if (!match) {
    throw new Error(`Selected format "${String(selected)}" not found.`);
  }
  return match;
}
async function promptTranslationScope(pkg) {
  const counts = formatSelectionCounts(pkg);
  const scope = assertNotCancelled(
    await ve({
      message: "What would you like to translate?",
      options: [
        {
          value: "all",
          label: "Translate all",
          hint: counts || void 0
        },
        {
          value: "selected",
          label: "Translate selected",
          hint: "pick specific skills & rules"
        },
        {
          value: "cancel",
          label: "Cancel"
        }
      ]
    })
  );
  if (scope === "cancel") {
    return null;
  }
  if (scope === "all") {
    return {
      includeRootRules: true,
      includeSharedAssets: true,
      includeConfigAssets: true
    };
  }
  const options2 = [];
  for (const skill of pkg.skills) {
    const hintParts = [];
    if (skill.description) {
      hintParts.push(truncateText(skill.description, 48));
    }
    if (skill.assets.length > 0) {
      hintParts.push(
        `${skill.assets.length} asset${skill.assets.length === 1 ? "" : "s"}`
      );
    }
    options2.push({
      value: `skill:${skill.name}`,
      label: skill.name,
      ...hintParts.length > 0 ? { hint: hintParts.join(" \xB7 ") } : {}
    });
  }
  if (pkg.rootRules.length > 0) {
    options2.push({
      value: "__root_rules__",
      label: `${pkg.rootRules.map((r) => r.sourceFilename).join(", ")} (root rule)`,
      hint: "root instruction file"
    });
  }
  const configAssets = pkg.sharedAssets.filter(
    (a) => isConfigAssetPath(a.relativePath)
  );
  const sharedAssets = pkg.sharedAssets.filter(
    (a) => !isConfigAssetPath(a.relativePath)
  );
  if (sharedAssets.length > 0) {
    const sample = sharedAssets.slice(0, 2).map((a) => a.relativePath).join(", ");
    options2.push({
      value: "__shared_assets__",
      label: `Shared config assets (${sharedAssets.length} file${sharedAssets.length === 1 ? "" : "s"})`,
      hint: sharedAssets.length > 2 ? `${sample}, ...` : sample
    });
  }
  if (configAssets.length > 0) {
    const sample = configAssets.slice(0, 2).map((a) => a.relativePath).join(", ");
    options2.push({
      value: "__config_assets__",
      label: `Settings, hooks, MCP (${configAssets.length} file${configAssets.length === 1 ? "" : "s"})`,
      hint: `${configAssets.length > 2 ? `${sample}, ...` : sample} \xB7 may contain secrets`
    });
  }
  const picked = assertNotCancelled(
    await fe({
      message: "Select skills and rules to translate:",
      options: options2,
      required: true
    })
  );
  const pickedSet = new Set(picked);
  const skillNames = picked.filter((value) => value.startsWith("skill:")).map((value) => value.slice("skill:".length));
  return {
    skillNames,
    includeRootRules: pickedSet.has("__root_rules__"),
    includeSharedAssets: pickedSet.has("__shared_assets__") || pickedSet.has("__config_assets__"),
    includeConfigAssets: pickedSet.has("__config_assets__")
  };
}
async function promptTargetFormatSelection(sourceFormat, detectedTargets) {
  const otherFormats = sourceFormat ? FORMAT_IDS.filter((id) => id !== sourceFormat) : [...FORMAT_IDS];
  const detectedSet = new Set(detectedTargets ?? []);
  const formatHints = (id) => {
    const parts = [];
    if (id === sourceFormat) {
      parts.push("detected source");
    }
    if (detectedSet.has(id)) {
      parts.push("detected");
    }
    return parts.length > 0 ? parts.join(" \xB7 ") : void 0;
  };
  const options2 = sourceFormat ? [
    {
      value: "all_other",
      label: "All other formats",
      hint: `${otherFormats.length} other formats`
    },
    {
      value: "all",
      label: "All formats",
      hint: `all ${FORMAT_IDS.length} formats`
    },
    ...FORMAT_IDS.map((id) => {
      const hint = formatHints(id);
      return {
        value: id,
        label: FORMAT_META[id].label,
        ...hint ? { hint } : {}
      };
    })
  ] : [
    { value: "all", label: "All supported formats" },
    ...FORMAT_IDS.map((id) => {
      const hint = formatHints(id);
      return {
        value: id,
        label: FORMAT_META[id].label,
        ...hint ? { hint } : {}
      };
    })
  ];
  const selected = assertNotCancelled(
    await fe({
      message: "Select target format(s) to generate:",
      options: options2,
      ...detectedTargets && detectedTargets.length > 0 ? { initialValues: detectedTargets } : {},
      required: true
    })
  );
  if (selected.includes("all")) {
    return [...FORMAT_IDS];
  }
  const chosen = /* @__PURE__ */ new Set();
  if (selected.includes("all_other")) {
    for (const id of otherFormats) {
      chosen.add(id);
    }
  }
  for (const id of FORMAT_IDS) {
    if (selected.includes(id)) {
      chosen.add(id);
    }
  }
  return FORMAT_IDS.filter((id) => chosen.has(id));
}
async function promptWriteAction(options2) {
  const targetNames = options2.targetFormats.map((id) => FORMAT_META[id].label.split(" ")[0]).join(", ");
  const message = options2.alreadyPreviewed ? "Proceed with writing these files?" : `Translate [${options2.sourceLabel}] \u2794 [${targetNames}] into ${options2.destinationLabel} (${options2.selectionSummary})?`;
  const preview = options2.preview;
  let writeOption;
  let forceOption;
  if (preview) {
    if (preview.skipped > 0) {
      writeOption = {
        value: "write",
        label: preview.created > 0 ? "Write new & keep existing" : "Keep existing files",
        hint: `${preview.created} new, skip ${preview.skipped} changed${preview.unchanged > 0 ? `, ${preview.unchanged} up to date` : ""}`
      };
      forceOption = {
        value: "force",
        label: `Update ${preview.skipped} changed file${preview.skipped === 1 ? "" : "s"}`,
        hint: preview.created > 0 ? `+ ${preview.created} new` : "overwrite differing files"
      };
    } else {
      writeOption = {
        value: "write",
        label: "Translate & write files",
        hint: preview.unchanged > 0 ? `${preview.created} new, ${preview.unchanged} up to date` : `${preview.created} new file${preview.created === 1 ? "" : "s"}`
      };
    }
  } else {
    writeOption = {
      value: "write",
      label: "Translate & write files",
      hint: "skip existing files"
    };
    forceOption = {
      value: "force",
      label: "Translate & overwrite existing",
      hint: "--force"
    };
  }
  const dryRunOption = {
    value: "dry_run",
    label: "Preview plan (dry-run)",
    hint: "inspect files without writing"
  };
  const changeTargetOption = {
    value: "change_target",
    label: "Change target format"
  };
  const cancelOption = {
    value: "cancel",
    label: "Cancel"
  };
  const orderedOptions = options2.defaultForce && forceOption ? [
    forceOption,
    writeOption,
    ...options2.alreadyPreviewed ? [] : [dryRunOption],
    ...options2.allowChangeTarget ? [changeTargetOption] : [],
    cancelOption
  ] : [
    writeOption,
    ...options2.alreadyPreviewed ? [] : [dryRunOption],
    ...forceOption ? [forceOption] : [],
    ...options2.allowChangeTarget ? [changeTargetOption] : [],
    cancelOption
  ];
  return assertNotCancelled(
    await ve({
      message,
      options: orderedOptions
    })
  );
}
async function promptConflictResolution(actions, globalMode = false) {
  const differing = actions.filter((a) => a.status === "skipped");
  if (differing.length === 0) {
    return /* @__PURE__ */ new Set();
  }
  const count = differing.length;
  const choice = assertNotCancelled(
    await ve({
      message: `${count} existing file${count === 1 ? "" : "s"} differ${count === 1 ? "s" : ""} on disk. What would you like to do?`,
      options: [
        {
          value: "replace_all",
          label: "Replace all differing files",
          hint: `${count} file${count === 1 ? "" : "s"}`
        },
        {
          value: "review",
          label: "Review one by one",
          hint: "show diff for each file"
        },
        {
          value: "keep_all",
          label: "Keep them",
          hint: "leave differing files untouched"
        }
      ]
    })
  );
  if (choice === "replace_all") {
    return new Set(differing.map((a) => a.absolutePath));
  }
  if (choice === "keep_all") {
    return /* @__PURE__ */ new Set();
  }
  const toReplace = /* @__PURE__ */ new Set();
  for (let i = 0; i < differing.length; i++) {
    const action = differing[i];
    const displayPath = globalMode ? action.absolutePath : action.relativePath;
    let diskBuf = Buffer.alloc(0);
    try {
      diskBuf = fs6.readFileSync(action.absolutePath);
    } catch {
      diskBuf = Buffer.alloc(0);
    }
    const diff = formatShortDiff(
      diskBuf,
      action.wouldBeContent ?? Buffer.alloc(0),
      action.relativePath
    );
    Me(diff, `${displayPath} (${i + 1}/${differing.length})`);
    const perFile = assertNotCancelled(
      await ve({
        message: `Replace ${displayPath}?`,
        options: [
          { value: "keep", label: "Keep existing" },
          { value: "replace", label: "Replace with incoming" },
          { value: "replace_all", label: "Replace all remaining" },
          { value: "keep_all", label: "Keep all remaining" }
        ]
      })
    );
    if (perFile === "replace") {
      toReplace.add(action.absolutePath);
    } else if (perFile === "replace_all") {
      for (let j2 = i; j2 < differing.length; j2++) {
        toReplace.add(differing[j2].absolutePath);
      }
      break;
    } else if (perFile === "keep_all") {
      break;
    }
  }
  return toReplace;
}
async function promptConfirmSyncDeletions(deletePaths) {
  if (deletePaths.length === 0) {
    return true;
  }
  return assertNotCancelled(
    await ye({
      message: `Sync will delete ${deletePaths.length} untouched file${deletePaths.length === 1 ? "" : "s"} removed upstream. Continue?`,
      initialValue: true
    })
  );
}
async function runInteractiveWizard() {
  Ie(import_picocolors5.default.bgCyan(import_picocolors5.default.black(" everyagent ")));
  let fetchResult;
  let detections;
  let usingCurrentDir = false;
  const localSource = detectLocalProjectSource(process.cwd());
  if (localSource) {
    const detectedSummary = localSource.detections.map((d3) => d3.summary).join(" \xB7 ");
    const sourceChoice = assertNotCancelled(
      await ve({
        message: "Detected skills in this project. What would you like to do?",
        options: [
          {
            value: "local",
            label: "Convert this project",
            hint: detectedSummary
          },
          {
            value: "remote",
            label: "Import from a GitHub repo or another folder"
          }
        ]
      })
    );
    if (sourceChoice === "local") {
      fetchResult = localSource.fetchResult;
      detections = localSource.detections;
      usingCurrentDir = true;
      if (detections.length === 1) {
        M2.step(
          formatDetectedHeader(
            fetchResult.source.displayLabel,
            detections[0].format
          )
        );
      }
    }
  }
  if (!usingCurrentDir) {
    const sourceInput = assertNotCancelled(
      await he({
        message: "GitHub repository URL, owner/repo, or local folder:",
        placeholder: "owner/repo or https://github.com/owner/repo",
        validate(value) {
          if (!value || !value.trim()) {
            return "Please enter a GitHub repo or local path.";
          }
          try {
            parseGitHubSource(value);
            return void 0;
          } catch (err) {
            return err instanceof Error ? err.message : String(err);
          }
        }
      })
    );
    const spin = Y2();
    spin.start(`Fetching ${sourceInput.trim()}...`);
    try {
      const res = await fetchAndDetect(sourceInput.trim(), "auto");
      fetchResult = res.fetchResult;
      detections = res.detections;
      if (detections.length === 1) {
        spin.stop(
          formatDetectedHeader(
            fetchResult.source.displayLabel,
            detections[0].format
          )
        );
      } else {
        spin.stop(
          `Detected ${detections.length} formats in ${fetchResult.source.displayLabel}`
        );
      }
    } catch (err) {
      spin.stop("Fetch failed");
      M2.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  }
  let chosenDetection = detections[0];
  if (detections.length > 1) {
    chosenDetection = await promptSourceFormatSelection(detections);
    M2.step(
      formatDetectedHeader(
        fetchResult.source.displayLabel,
        chosenDetection.format
      )
    );
  }
  const pkg = parseDetectedPackage(
    fetchResult.files,
    chosenDetection,
    fetchResult.subpathName
  );
  Me(
    formatPackageOverview(pkg),
    `${fetchResult.source.displayLabel} \xB7 ${FORMAT_META[chosenDetection.format].label}`
  );
  let filteredPkg = filterPackage(pkg);
  let selection;
  if (shouldPromptTranslationScope(pkg)) {
    const picked = await promptTranslationScope(pkg);
    if (!picked) {
      xe("Aborted. No files were written.");
      return;
    }
    selection = picked;
    filteredPkg = filterPackage(pkg, picked);
  }
  const detectedTargets = detectTargetFormats({
    targetDir: process.cwd(),
    sourceFormat: chosenDetection.format,
    excludeSourceWhenLocal: usingCurrentDir
  });
  let targetFormats = await promptTargetFormatSelection(
    chosenDetection.format,
    detectedTargets.formats
  );
  const destinationMode = assertNotCancelled(
    await ve({
      message: "Where should the converted skills be installed?",
      options: [
        { value: "cwd", label: "Current directory (.)" },
        { value: "custom", label: "Custom project path" },
        {
          value: "global",
          label: "Global config directories",
          hint: "user home folders for selected agents"
        }
      ]
    })
  );
  let targetDir = ".";
  const isGlobal = destinationMode === "global";
  if (destinationMode === "custom") {
    targetDir = assertNotCancelled(
      await he({
        message: "Target project directory:",
        initialValue: "./my-project",
        validate(value) {
          return !value || !value.trim() ? "Please provide a directory path." : void 0;
        }
      })
    );
  }
  let destinationLabel = isGlobal ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(", ") : targetDir;
  const sourceName = FORMAT_META[chosenDetection.format].label.split(" ")[0];
  const selectionSummary = formatSelectionCounts(filteredPkg);
  let alreadyPreviewed = false;
  let actionChoice = "cancel";
  let overwritePaths = /* @__PURE__ */ new Set();
  let forceAll = false;
  while (true) {
    const { summary: preview } = convertAndWrite({
      files: fetchResult.files,
      pkg: filteredPkg,
      sourceFormat: chosenDetection.format,
      targetFormats,
      targetDir,
      global: isGlobal,
      dryRun: true,
      subpathName: fetchResult.subpathName,
      allowLoose: chosenDetection.allowLoose
    });
    if (preview.created === 0 && preview.skipped === 0 && preview.conflict === 0 && preview.unchanged > 0) {
      Se(`${import_picocolors5.default.green("Already up to date!")} ${formatSummaryCounts(preview)}.`);
      return;
    }
    if (preview.skipped > 0) {
      overwritePaths = await promptConflictResolution(preview.actions, isGlobal);
      actionChoice = "write";
      break;
    }
    actionChoice = await promptWriteAction({
      sourceLabel: sourceName,
      targetFormats,
      destinationLabel,
      selectionSummary,
      alreadyPreviewed,
      preview,
      allowChangeTarget: true
    });
    if (actionChoice === "dry_run") {
      for (const action of preview.actions) {
        if (action.status !== "unchanged") {
          console.log(formatActionLine(action, isGlobal));
        }
      }
      M2.info(`Dry run: ${formatSummaryCounts(preview)}.`);
      alreadyPreviewed = true;
      continue;
    }
    if (actionChoice === "change_target") {
      targetFormats = await promptTargetFormatSelection(
        chosenDetection.format,
        targetFormats
      );
      destinationLabel = isGlobal ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(", ") : targetDir;
      alreadyPreviewed = false;
      continue;
    }
    forceAll = actionChoice === "force";
    break;
  }
  if (actionChoice === "cancel") {
    xe("Aborted. No files were written.");
    return;
  }
  const { summary, plannedTargets } = convertAndWrite({
    files: fetchResult.files,
    pkg: filteredPkg,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir,
    global: isGlobal,
    force: forceAll,
    overwrite: overwritePaths,
    subpathName: fetchResult.subpathName,
    allowLoose: chosenDetection.allowLoose
  });
  recordManifestEntries({
    targetDir,
    global: isGlobal,
    parsedSource: fetchResult.source,
    sourceFormat: chosenDetection.format,
    selection,
    plannedTargets,
    summary
  });
  for (const action of summary.actions) {
    if (action.status !== "unchanged") {
      console.log(formatActionLine(action, isGlobal));
    }
  }
  if (summary.conflict > 0) {
    M2.warn(
      "Two target formats share a file name and produced different content. Install them one at a time if you need both."
    );
  }
  M2.info(import_picocolors5.default.dim("Always double-check the output in case some skills were not detected."));
  Se(`${import_picocolors5.default.green("Done!")} ${formatSummaryCounts(summary)}.`);
}

// src/index.ts
function emitForSyncEntry(pkg, entry) {
  let skills = pkg.skills;
  if (entry.skills !== void 0) {
    const wanted = new Set(entry.skills.map((s) => s.toLowerCase()));
    skills = pkg.skills.filter((s) => wanted.has(s.name.toLowerCase()));
  }
  const sharedAssets = entry.includeSharedAssets === false ? [] : entryKeepsConfigAssets(entry) ? pkg.sharedAssets : pkg.sharedAssets.filter((a) => !isConfigAssetPath(a.relativePath));
  const scopedPkg = {
    ...pkg,
    skills,
    rootRules: entry.includeRootRules === false ? [] : pkg.rootRules,
    sharedAssets
  };
  return getAdapter(entry.targetFormat).emit(
    rewritePackage(scopedPkg, entry.targetFormat),
    { global: entry.global }
  );
}
function requireManifest(targetDir, global) {
  const manifestPath = getManifestPath({ targetDir, global });
  const manifest = readManifest(manifestPath);
  if (!manifest) {
    logError(
      `No manifest found at ${manifestPath}. Reinstall your skills once with \`everyagent <source>\` to create one.`
    );
    process.exit(1);
  }
  return { manifestPath, manifest };
}
var SYNC_ACTION_STYLES = {
  create: { verb: "\u2714 Created", colour: import_picocolors6.default.green, summary: "created" },
  update: { verb: "\u2714 Updated", colour: import_picocolors6.default.green, summary: "updated" },
  delete: { verb: "\u2716 Deleted", colour: import_picocolors6.default.red, summary: "deleted" },
  "keep-local": {
    verb: "\u26A0 Local change",
    colour: import_picocolors6.default.yellow,
    note: "(kept)",
    summary: "local changes kept"
  },
  "keep-missing": {
    verb: "\u26A0 Missing on disk",
    colour: import_picocolors6.default.yellow,
    note: "(left absent)",
    summary: "missing"
  },
  untracked: {
    verb: "\u26A0 Not tracked",
    colour: import_picocolors6.default.yellow,
    note: "(file exists, kept)",
    summary: "not tracked"
  },
  unchanged: {
    verb: "= Up to date",
    colour: import_picocolors6.default.dim,
    summary: "up to date",
    silent: true
  }
};
function printSyncPlanActions(plans, prefix) {
  const counts = /* @__PURE__ */ new Map();
  for (const plan of plans) {
    for (const action of plan.actions) {
      counts.set(action.kind, (counts.get(action.kind) ?? 0) + 1);
      const style = SYNC_ACTION_STYLES[action.kind];
      if (style.silent) continue;
      const display = plan.entry.global ? action.absolutePath : action.relativePath;
      const note = style.note ? ` ${import_picocolors6.default.dim(style.note)}` : "";
      console.log(`${prefix}${style.colour(style.verb)} ${display}${note}`);
    }
  }
  return counts;
}
function formatSyncCounts(counts) {
  return Object.keys(SYNC_ACTION_STYLES).filter((kind) => (counts.get(kind) ?? 0) > 0).map((kind) => `${counts.get(kind)} ${SYNC_ACTION_STYLES[kind].summary}`).join(", ");
}
function syncHeadline(parsed) {
  if (parsed.check) {
    return parsed.anyDrift ? "Drift detected!" : "All up to date!";
  }
  return parsed.dryRun ? "Dry run complete!" : "Sync complete!";
}
async function handleSync(parsed) {
  const projectDir = path18.resolve(parsed.targetDir);
  const { manifestPath, manifest } = requireManifest(projectDir, parsed.global);
  if (manifest.installs.length === 0) {
    if (parsed.json) {
      console.log(JSON.stringify({ entries: [], hasDrift: false }, null, 2));
    } else {
      logInfo("Manifest has no installed entries.");
    }
    return;
  }
  const groups = /* @__PURE__ */ new Map();
  for (const entry of manifest.installs) {
    const fetchTarget = resolveManifestSourceForFetch(entry, projectDir);
    const key = `${fetchTarget}\0${entry.sourceFormat}`;
    const existing = groups.get(key);
    if (existing) {
      existing.entries.push(entry);
    } else {
      groups.set(key, {
        fetchTarget,
        sourceFormat: entry.sourceFormat,
        entries: [entry]
      });
    }
  }
  const plans = [];
  for (const group of groups.values()) {
    const { fetchResult, detections } = await fetchAndDetect(
      group.fetchTarget,
      group.sourceFormat
    );
    const detection = detections[0];
    const pkg = parseDetectedPackage(
      fetchResult.files,
      detection,
      fetchResult.subpathName
    );
    for (const entry of group.entries) {
      const installDir = getInstallDir(entry, projectDir);
      const emitted = emitForSyncEntry(pkg, entry);
      const diskHashes = /* @__PURE__ */ new Map();
      for (const f of entry.files) {
        const rel = normalizePosixPath(f.path);
        diskHashes.set(rel, hashFile(resolveWithin(installDir, rel)));
      }
      for (const f of emitted) {
        const rel = normalizePosixPath(f.relativePath);
        if (!diskHashes.has(rel)) {
          diskHashes.set(rel, hashFile(resolveWithin(installDir, rel)));
        }
      }
      plans.push(planSyncForEntry(entry, emitted, diskHashes, installDir));
    }
  }
  const anyDrift = plans.some((p2) => p2.hasDrift);
  const deletePaths = plans.flatMap(
    (p2) => p2.actions.filter((a) => a.kind === "delete").map((a) => p2.entry.global ? a.absolutePath : a.relativePath)
  );
  if (!parsed.check && !parsed.dryRun && deletePaths.length > 0 && process.stdin.isTTY && !parsed.yes && !parsed.json) {
    const confirmed = await promptConfirmSyncDeletions(deletePaths);
    if (!confirmed) {
      logInfo(import_picocolors6.default.dim("Aborted. No files were changed."));
      return;
    }
  }
  if (!parsed.check && !parsed.dryRun) {
    for (const plan of plans) {
      applySyncPlan(plan, { dryRun: false });
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updatedInstalls = plans.map((plan) => {
      const changed = plan.actions.some(
        (a) => a.kind === "create" || a.kind === "update" || a.kind === "delete"
      );
      return {
        ...plan.entry,
        installedAt: changed ? now : plan.entry.installedAt,
        files: plan.nextFiles
      };
    });
    writeManifest(manifestPath, { version: 1, installs: updatedInstalls });
  }
  if (parsed.json) {
    console.log(
      JSON.stringify(
        {
          dryRun: parsed.dryRun || parsed.check,
          hasDrift: anyDrift,
          entries: plans.map((p2) => ({
            source: p2.entry.source,
            subpath: p2.entry.subpath,
            targetFormat: p2.entry.targetFormat,
            installDir: p2.installDir,
            hasDrift: p2.hasDrift,
            actions: p2.actions.map((a) => ({
              kind: a.kind,
              path: a.relativePath
            }))
          }))
        },
        null,
        2
      )
    );
  } else {
    const prefix = parsed.dryRun || parsed.check ? `${import_picocolors6.default.dim("[dry-run]")} ` : "";
    const counts = printSyncPlanActions(plans, prefix);
    const headline = syncHeadline({
      check: parsed.check,
      dryRun: parsed.dryRun,
      anyDrift
    });
    const colouredHeadline = anyDrift && parsed.check ? import_picocolors6.default.yellow(headline) : import_picocolors6.default.green(headline);
    console.log("");
    console.log(`${import_picocolors6.default.bold(colouredHeadline)} ${formatSyncCounts(counts)}.`);
  }
  if (parsed.check && anyDrift) {
    process.exit(1);
  }
}
function wrapNames(names, width) {
  const lines = [];
  let current = "";
  for (const name of names) {
    if (current && current.length + 2 + name.length > width) {
      lines.push(current);
      current = name;
    } else {
      current = current ? `${current}  ${name}` : name;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}
async function handleList(parsed) {
  const projectDir = path18.resolve(parsed.targetDir);
  const { manifest } = requireManifest(projectDir, parsed.global);
  const items = await Promise.all(
    manifest.installs.map(async (entry) => {
      const drift = inspectInstallDrift(entry, projectDir);
      let sourceDrifted = false;
      const fetchTarget = resolveManifestSourceForFetch(entry, projectDir);
      if (path18.isAbsolute(fetchTarget) && fs7.existsSync(fetchTarget)) {
        try {
          const { fetchResult, detections } = await fetchAndDetect(
            fetchTarget,
            entry.sourceFormat
          );
          const pkg = parseDetectedPackage(
            fetchResult.files,
            detections[0],
            fetchResult.subpathName
          );
          const emitted = emitForSyncEntry(pkg, entry);
          const diskHashes = /* @__PURE__ */ new Map();
          for (const f of drift.files) {
            diskHashes.set(f.path, f.diskSha256);
          }
          const plan = planSyncForEntry(entry, emitted, diskHashes, drift.installDir);
          sourceDrifted = plan.actions.some(
            (a) => a.kind === "create" || a.kind === "update" || a.kind === "delete"
          );
        } catch {
          sourceDrifted = false;
        }
      }
      const status = drift.modifiedCount === 0 && drift.missingCount === 0 && !sourceDrifted ? "clean" : "drifted";
      return {
        source: entry.source,
        ref: entry.ref,
        subpath: entry.subpath,
        sourceFormat: entry.sourceFormat,
        targetFormat: entry.targetFormat,
        global: entry.global,
        installDir: drift.installDir,
        installedAt: entry.installedAt,
        fileCount: entry.files.length,
        modifiedCount: drift.modifiedCount,
        missingCount: drift.missingCount,
        sourceDrifted,
        status,
        files: drift.files,
        skills: groupSkills(drift.files)
      };
    })
  );
  if (parsed.json) {
    console.log(JSON.stringify({ installs: items }, null, 2));
    return;
  }
  if (items.length === 0) {
    logInfo("No installs recorded in manifest.");
    return;
  }
  for (const item of items) {
    const srcLabel = item.subpath ? `${item.source}/${item.subpath}` : item.source;
    const driftParts = [];
    if (item.modifiedCount > 0) driftParts.push(`${item.modifiedCount} modified`);
    if (item.missingCount > 0) driftParts.push(`${item.missingCount} missing`);
    if (item.sourceDrifted) driftParts.push("source moved on");
    const driftText = driftParts.length > 0 ? import_picocolors6.default.yellow(` (${driftParts.join(", ")})`) : import_picocolors6.default.green(" (clean)");
    const countLabel = item.skills.length > 0 ? `${plural(item.skills.length, "skill")}, ${plural(item.fileCount, "file")}` : plural(item.fileCount, "file");
    console.log(
      `${import_picocolors6.default.cyan("\u2022")} ${import_picocolors6.default.bold(srcLabel)} \u2192 ${FORMAT_META[item.targetFormat].label} \xB7 ${countLabel}${driftText}`
    );
    if (item.global) {
      console.log(`  ${import_picocolors6.default.dim(item.installDir)}`);
    }
    if (item.skills.length > 0) {
      const names = item.skills.map(
        (skill) => skill.drifted ? `${skill.name}*` : skill.name
      );
      for (const line of wrapNames(names, 74)) {
        console.log(`    ${line}`);
      }
    }
  }
}
async function handleRemove(parsed) {
  const projectDir = path18.resolve(parsed.targetDir);
  const { manifestPath, manifest } = requireManifest(projectDir, parsed.global);
  const plan = planRemove(
    manifest,
    {
      source: parsed.source,
      all: parsed.all,
      ...parsed.skills ? { skills: parsed.skills } : {}
    },
    projectDir
  );
  if (plan.matchedEntries.length === 0) {
    const available = [...new Set(manifest.installs.map((i) => i.source))];
    logError(
      `No matching install for "${parsed.source ?? "--all"}" in manifest.${available.length > 0 ? ` Installed sources: ${available.join(", ")}` : ""}`
    );
    process.exit(1);
  }
  if (plan.missingSkills.length > 0) {
    logError(`Not installed: ${plan.missingSkills.join(", ")}.`);
    const available = [
      ...new Set(plan.matchedEntries.flatMap((e2) => groupSkills(e2.files).map((s) => s.name)))
    ];
    if (available.length > 0) {
      logInfo(`Installed skills: ${available.join(", ")}.`);
    }
    process.exit(1);
  }
  applyRemovePlan(plan, { dryRun: parsed.dryRun });
  if (!parsed.dryRun) {
    writeManifest(manifestPath, plan.nextManifest);
  }
  const prefix = parsed.dryRun ? `${import_picocolors6.default.dim("[dry-run]")} ` : "";
  for (const rel of plan.deletedPaths) {
    console.log(`${prefix}${import_picocolors6.default.red("\u2716 Removed")} ${rel}`);
  }
  for (const rel of plan.alreadyMissingPaths) {
    console.log(`${prefix}${import_picocolors6.default.dim(`= Already missing ${rel}`)}`);
  }
  if (plan.refusedPaths.length > 0) {
    logWarn(
      `Kept ${plan.refusedPaths.length} locally edited file${plan.refusedPaths.length === 1 ? "" : "s"} (content differs from manifest):`
    );
    for (const rel of plan.refusedPaths) {
      console.log(`  ${rel}`);
    }
  }
  logSuccess(
    `${parsed.dryRun ? "Would remove" : "Removed"} ${plan.deletedPaths.length} file${plan.deletedPaths.length === 1 ? "" : "s"}.`
  );
}
async function handleLint(parsed) {
  const { fetchResult, detections } = await fetchAndDetect(
    parsed.source,
    parsed.from
  );
  const detection = detections[0];
  const findings = lintSourceFiles(fetchResult.files, detection.format, {
    subpathName: fetchResult.subpathName,
    allowLoose: detection.allowLoose
  });
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  if (parsed.json) {
    console.log(
      JSON.stringify(
        {
          source: fetchResult.source.displayLabel,
          format: detection.format,
          errors: errors.length,
          warnings: warnings.length,
          findings
        },
        null,
        2
      )
    );
  } else if (findings.length === 0) {
    logSuccess(
      `No issues found in ${fetchResult.source.displayLabel} (${FORMAT_META[detection.format].label}).`
    );
  } else {
    for (const f of findings) {
      const icon = f.severity === "error" ? import_picocolors6.default.red("\u2716") : import_picocolors6.default.yellow("\u26A0");
      console.log(`${icon} [${f.rule}] ${f.file}: ${f.message}`);
    }
    console.log("");
    console.log(
      `Lint finished: ${errors.length} error${errors.length === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}.`
    );
  }
  if (errors.length > 0) {
    process.exit(1);
  }
}
async function main() {
  const parsed = parseCliArgs(process.argv);
  if (parsed.kind === "help_or_version") {
    return;
  }
  if (parsed.kind === "interactive") {
    await runInteractiveWizard();
    return;
  }
  if (parsed.kind === "sync") {
    await handleSync(parsed);
    return;
  }
  if (parsed.kind === "list") {
    await handleList(parsed);
    return;
  }
  if (parsed.kind === "remove") {
    await handleRemove(parsed);
    return;
  }
  if (parsed.kind === "lint") {
    await handleLint(parsed);
    return;
  }
  const { fetchResult, detections } = await fetchAndDetect(
    parsed.source,
    parsed.from
  );
  let chosenDetection = detections[0];
  if (detections.length > 1) {
    for (const d3 of detections) {
      logInfo(`Detected: ${d3.summary}`);
    }
    if (!process.stdin.isTTY) {
      const allSharedRoots = detections.every(isWeakRootRuleOnly);
      if (!allSharedRoots) {
        if (detections.every((d3) => d3.skillCount === 0)) {
          throw new Error(
            `No SKILL.md found in ${fetchResult.source.displayLabel}. everyagent converts skills, and this source only carries config files (${detections.flatMap((d3) => d3.matchedPaths.slice(0, 2)).join(", ")}).`
          );
        }
        throw new Error(
          `Multiple formats detected (${detections.map((d3) => d3.format).join(", ")}). Specify one with --from <format>.`
        );
      }
      const chosenPath = detections[0].matchedPaths[0];
      const others = [
        ...new Set(detections.slice(1).map((d3) => d3.matchedPaths[0]))
      ].filter((p2) => p2 && p2 !== chosenPath);
      logInfo(
        `Reading ${chosenPath} as ${FORMAT_META[detections[0].format].label}${others.length > 0 ? `; also found ${others.join(", ")}, pass --from to read that instead` : ""}.`
      );
    } else {
      chosenDetection = await promptSourceFormatSelection(detections);
    }
  }
  const pkg = parseDetectedPackage(
    fetchResult.files,
    chosenDetection,
    fetchResult.subpathName
  );
  logInfo(
    `${formatDetectedHeader(fetchResult.source.displayLabel, chosenDetection.format)} \u2014 ${formatSelectionCounts(pkg)}`
  );
  let selection;
  if (parsed.skills) {
    selection = {
      skillNames: parsed.skills,
      includeRootRules: false,
      includeSharedAssets: false
    };
  } else if (!parsed.yes && !parsed.dryRun && process.stdin.isTTY && shouldPromptTranslationScope(pkg)) {
    const overview = formatPackageOverview(pkg);
    if (overview) {
      console.log(overview);
    }
    const pickedScope = await promptTranslationScope(pkg);
    if (!pickedScope) {
      logInfo(import_picocolors6.default.dim("Aborted. No files were written."));
      return;
    }
    selection = pickedScope;
  }
  if (parsed.withConfig) {
    selection = { ...selection ?? {}, includeConfigAssets: true };
  }
  const filteredPkg = filterPackage(pkg, selection);
  let targetFormats = parsed.targets;
  let wasAutoDetected = false;
  if (!targetFormats) {
    const excludeSourceWhenLocal = fetchResult.source.type === "local" && !parsed.global && path18.resolve(fetchResult.source.localPath) === path18.resolve(parsed.targetDir);
    const detected = detectTargetFormats({
      targetDir: parsed.targetDir,
      global: parsed.global,
      sourceFormat: chosenDetection.format,
      excludeSourceWhenLocal
    });
    if (detected.formats.length > 0) {
      logInfo(
        `Auto-detected target${detected.formats.length === 1 ? "" : "s"} (${detected.scope === "project" ? "from project" : "installed on this machine"}): ${detected.formats.map((id) => FORMAT_META[id].label).join(", ")}`
      );
      if (!process.stdin.isTTY || parsed.yes || parsed.dryRun || detected.formats.length === 1) {
        targetFormats = detected.formats;
        wasAutoDetected = true;
      } else {
        targetFormats = await promptTargetFormatSelection(
          chosenDetection.format,
          detected.formats
        );
      }
    } else {
      if (!process.stdin.isTTY) {
        throw new Error(
          `Could not auto-detect any target format. Specify -t, --to <${FORMAT_IDS.join("|")}|all>.`
        );
      }
      targetFormats = await promptTargetFormatSelection(chosenDetection.format);
    }
  }
  let destinationLabel = parsed.global ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(", ") : parsed.targetDir;
  let effectiveForce = parsed.force;
  let overwritePaths = /* @__PURE__ */ new Set();
  if (!parsed.yes && !parsed.dryRun && process.stdin.isTTY) {
    const sourceName = FORMAT_META[chosenDetection.format].label.split(" ")[0];
    const selectionSummary = formatSelectionCounts(filteredPkg);
    let alreadyPreviewed = false;
    let actionChoice = "cancel";
    while (true) {
      const { summary: preview } = convertAndWrite({
        files: fetchResult.files,
        pkg: filteredPkg,
        sourceFormat: chosenDetection.format,
        targetFormats,
        targetDir: parsed.targetDir,
        global: parsed.global,
        force: parsed.force,
        dryRun: true,
        subpathName: fetchResult.subpathName,
        allowLoose: chosenDetection.allowLoose
      });
      if (preview.created === 0 && preview.skipped === 0 && preview.conflict === 0 && preview.unchanged > 0) {
        logInfo(`Already up to date! ${formatSummaryCounts(preview)}.`);
        return;
      }
      if (preview.skipped > 0 && !parsed.force) {
        overwritePaths = await promptConflictResolution(
          preview.actions,
          parsed.global
        );
        actionChoice = "write";
        break;
      }
      actionChoice = await promptWriteAction({
        sourceLabel: sourceName,
        targetFormats,
        destinationLabel,
        selectionSummary,
        alreadyPreviewed,
        defaultForce: parsed.force,
        preview,
        allowChangeTarget: wasAutoDetected
      });
      if (actionChoice === "dry_run") {
        for (const action of preview.actions) {
          if (action.status !== "unchanged") {
            console.log(formatActionLine(action, parsed.global));
          }
        }
        logInfo(`Dry run: ${formatSummaryCounts(preview)}.`);
        alreadyPreviewed = true;
        continue;
      }
      if (actionChoice === "change_target") {
        targetFormats = await promptTargetFormatSelection(
          chosenDetection.format,
          targetFormats
        );
        destinationLabel = parsed.global ? targetFormats.map((id) => getAdapter(id).getGlobalDir()).join(", ") : parsed.targetDir;
        alreadyPreviewed = false;
        continue;
      }
      effectiveForce = actionChoice === "force";
      break;
    }
    if (actionChoice === "cancel") {
      logInfo(import_picocolors6.default.dim("Aborted. No files were written."));
      return;
    }
  }
  const { summary, plannedTargets } = convertAndWrite({
    files: fetchResult.files,
    pkg: filteredPkg,
    sourceFormat: chosenDetection.format,
    targetFormats,
    targetDir: parsed.targetDir,
    global: parsed.global,
    force: effectiveForce,
    overwrite: overwritePaths,
    dryRun: parsed.dryRun,
    subpathName: fetchResult.subpathName,
    allowLoose: chosenDetection.allowLoose
  });
  if (!parsed.dryRun) {
    recordManifestEntries({
      targetDir: parsed.targetDir,
      global: parsed.global,
      parsedSource: fetchResult.source,
      sourceFormat: chosenDetection.format,
      selection,
      plannedTargets,
      summary
    });
  }
  logWriteSummary(summary, {
    dryRun: parsed.dryRun,
    global: parsed.global,
    showForceHint: !effectiveForce && (parsed.dryRun || parsed.yes || !process.stdin.isTTY)
  });
}
main().catch((err) => {
  logError(err instanceof Error ? err.message : String(err));
  process.exit(err instanceof CliUsageError ? 2 : 1);
});
/*! Bundled license information:

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

strip-bom-string/index.js:
  (*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
