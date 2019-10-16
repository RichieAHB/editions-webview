// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/stylis/stylis.js":[function(require,module,exports) {
var define;
/*
 *          __        ___
 *    _____/ /___  __/ (_)____
 *   / ___/ __/ / / / / / ___/
 *  (__  ) /_/ /_/ / / (__  )
 * /____/\__/\__, /_/_/____/
 *          /____/
 *
 * light - weight css preprocessor @licence MIT
 */
(function (factory) {/* eslint-disable */
	typeof exports === 'object' && typeof module !== 'undefined' ? (module['exports'] = factory(null)) :
		typeof define === 'function' && define['amd'] ? define(factory(null)) :
			(window['stylis'] = factory(null))
}(/** @param {*=} options */function factory (options) {/* eslint-disable */

	'use strict'

	/**
	 * Notes
	 *
	 * The ['<method name>'] pattern is used to support closure compiler
	 * the jsdoc signatures are also used to the same effect
	 *
	 * ----
	 *
	 * int + int + int === n4 [faster]
	 *
	 * vs
	 *
	 * int === n1 && int === n2 && int === n3
	 *
	 * ----
	 *
	 * switch (int) { case ints...} [faster]
	 *
	 * vs
	 *
	 * if (int == 1 && int === 2 ...)
	 *
	 * ----
	 *
	 * The (first*n1 + second*n2 + third*n3) format used in the property parser
	 * is a simple way to hash the sequence of characters
	 * taking into account the index they occur in
	 * since any number of 3 character sequences could produce duplicates.
	 *
	 * On the other hand sequences that are directly tied to the index of the character
	 * resolve a far more accurate measure, it's also faster
	 * to evaluate one condition in a switch statement
	 * than three in an if statement regardless of the added math.
	 *
	 * This allows the vendor prefixer to be both small and fast.
	 */

	var nullptn = /^\0+/g /* matches leading null characters */
	var formatptn = /[\0\r\f]/g /* matches new line, null and formfeed characters */
	var colonptn = /: */g /* splits animation rules */
	var cursorptn = /zoo|gra/ /* assert cursor varient */
	var transformptn = /([,: ])(transform)/g /* vendor prefix transform, older webkit */
	var animationptn = /,+\s*(?![^(]*[)])/g /* splits multiple shorthand notation animations */
	var propertiesptn = / +\s*(?![^(]*[)])/g /* animation properties */
	var elementptn = / *[\0] */g /* selector elements */
	var selectorptn = /,\r+?/g /* splits selectors */
	var andptn = /([\t\r\n ])*\f?&/g /* match & */
	var escapeptn = /:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g /* matches :global(.*) */
	var invalidptn = /\W+/g /* removes invalid characters from keyframes */
	var keyframeptn = /@(k\w+)\s*(\S*)\s*/ /* matches @keyframes $1 */
	var plcholdrptn = /::(place)/g /* match ::placeholder varient */
	var readonlyptn = /:(read-only)/g /* match :read-only varient */
	var beforeptn = /\s+(?=[{\];=:>])/g /* matches \s before ] ; = : */
	var afterptn = /([[}=:>])\s+/g /* matches \s after characters [ } = : */
	var tailptn = /(\{[^{]+?);(?=\})/g /* matches tail semi-colons ;} */
	var whiteptn = /\s{2,}/g /* matches repeating whitespace */
	var pseudoptn = /([^\(])(:+) */g /* pseudo element */
	var writingptn = /[svh]\w+-[tblr]{2}/ /* match writing mode property values */
	var gradientptn = /([\w-]+t\()/g /* match *gradient property */
	var supportsptn = /\(\s*(.*)\s*\)/g /* match supports (groups) */
	var propertyptn = /([\s\S]*?);/g /* match properties leading semicolon */
	var selfptn = /-self|flex-/g /* match flex- and -self in align-self: flex-*; */
	var pseudofmt = /[^]*?(:[rp][el]a[\w-]+)[^]*/ /* extrats :readonly or :placholder from selector */
	var trimptn = /[ \t]+$/ /* match tail whitspace */
	var dimensionptn = /stretch|:\s*\w+\-(?:conte|avail)/ /* match max/min/fit-content, fill-available */
	var imgsrcptn = /([^-])(image-set\()/

	/* vendors */
	var webkit = '-webkit-'
	var moz = '-moz-'
	var ms = '-ms-'

	/* character codes */
	var SEMICOLON = 59 /* ; */
	var CLOSEBRACES = 125 /* } */
	var OPENBRACES = 123 /* { */
	var OPENPARENTHESES = 40 /* ( */
	var CLOSEPARENTHESES = 41 /* ) */
	var OPENBRACKET = 91 /* [ */
	var CLOSEBRACKET = 93 /* ] */
	var NEWLINE = 10 /* \n */
	var CARRIAGE = 13 /* \r */
	var TAB = 9 /* \t */
	var AT = 64 /* @ */
	var SPACE = 32 /*   */
	var AND = 38 /* & */
	var DASH = 45 /* - */
	var UNDERSCORE = 95 /* _ */
	var STAR = 42 /* * */
	var COMMA = 44 /* , */
	var COLON = 58 /* : */
	var SINGLEQUOTE = 39 /* ' */
	var DOUBLEQUOTE = 34 /* " */
	var FOWARDSLASH = 47 /* / */
	var GREATERTHAN = 62 /* > */
	var PLUS = 43 /* + */
	var TILDE = 126 /* ~ */
	var NULL = 0 /* \0 */
	var FORMFEED = 12 /* \f */
	var VERTICALTAB = 11 /* \v */

	/* special identifiers */
	var KEYFRAME = 107 /* k */
	var MEDIA = 109 /* m */
	var SUPPORTS = 115 /* s */
	var PLACEHOLDER = 112 /* p */
	var READONLY = 111 /* o */
	var IMPORT = 105 /* <at>i */
	var CHARSET = 99 /* <at>c */
	var DOCUMENT = 100 /* <at>d */
	var PAGE = 112 /* <at>p */

	var column = 1 /* current column */
	var line = 1 /* current line numebr */
	var pattern = 0 /* :pattern */

	var cascade = 1 /* #id h1 h2 vs h1#id h2#id  */
	var prefix = 1 /* vendor prefix */
	var escape = 1 /* escape :global() pattern */
	var compress = 0 /* compress output */
	var semicolon = 0 /* no/semicolon option */
	var preserve = 0 /* preserve empty selectors */

	/* empty reference */
	var array = []

	/* plugins */
	var plugins = []
	var plugged = 0
	var should = null

	/* plugin context */
	var POSTS = -2
	var PREPS = -1
	var UNKWN = 0
	var PROPS = 1
	var BLCKS = 2
	var ATRUL = 3

	/* plugin newline context */
	var unkwn = 0

	/* keyframe animation */
	var keyed = 1
	var key = ''

	/* selector namespace */
	var nscopealt = ''
	var nscope = ''

	/**
	 * Compile
	 *
	 * @param {Array<string>} parent
	 * @param {Array<string>} current
	 * @param {string} body
	 * @param {number} id
	 * @param {number} depth
	 * @return {string}
	 */
	function compile (parent, current, body, id, depth) {
		var bracket = 0 /* brackets [] */
		var comment = 0 /* comments /* // or /* */
		var parentheses = 0 /* functions () */
		var quote = 0 /* quotes '', "" */

		var first = 0 /* first character code */
		var second = 0 /* second character code */
		var code = 0 /* current character code */
		var tail = 0 /* previous character code */
		var trail = 0 /* character before previous code */
		var peak = 0 /* previous non-whitespace code */

		var counter = 0 /* count sequence termination */
		var context = 0 /* track current context */
		var atrule = 0 /* track @at-rule context */
		var pseudo = 0 /* track pseudo token index */
		var caret = 0 /* current character index */
		var format = 0 /* control character formating context */
		var insert = 0 /* auto semicolon insertion */
		var invert = 0 /* inverted selector pattern */
		var length = 0 /* generic length address */
		var eof = body.length /* end of file(length) */
		var eol = eof - 1 /* end of file(characters) */

		var char = '' /* current character */
		var chars = '' /* current buffer of characters */
		var child = '' /* next buffer of characters */
		var out = '' /* compiled body */
		var children = '' /* compiled children */
		var flat = '' /* compiled leafs */
		var selector /* generic selector address */
		var result /* generic address */

		// ...build body
		while (caret < eof) {
			code = body.charCodeAt(caret)

			// eof varient
			if (caret === eol) {
				// last character + noop context, add synthetic padding for noop context to terminate
				if (comment + quote + parentheses + bracket !== 0) {
					if (comment !== 0) {
						code = comment === FOWARDSLASH ? NEWLINE : FOWARDSLASH
					}

					quote = parentheses = bracket = 0
					eof++
					eol++
				}
			}

			if (comment + quote + parentheses + bracket === 0) {
				// eof varient
				if (caret === eol) {
					if (format > 0) {
						chars = chars.replace(formatptn, '')
					}

					if (chars.trim().length > 0) {
						switch (code) {
							case SPACE:
							case TAB:
							case SEMICOLON:
							case CARRIAGE:
							case NEWLINE: {
								break
							}
							default: {
								chars += body.charAt(caret)
							}
						}

						code = SEMICOLON
					}
				}

				// auto semicolon insertion
				if (insert === 1) {
					switch (code) {
						// false flags
						case OPENBRACES:
						case CLOSEBRACES:
						case SEMICOLON:
						case DOUBLEQUOTE:
						case SINGLEQUOTE:
						case OPENPARENTHESES:
						case CLOSEPARENTHESES:
						case COMMA: {
							insert = 0
						}
						// ignore
						case TAB:
						case CARRIAGE:
						case NEWLINE:
						case SPACE: {
							break
						}
						// valid
						default: {
							insert = 0
							length = caret
							first = code
							caret--
							code = SEMICOLON

							while (length < eof) {
								switch (body.charCodeAt(length++)) {
									case NEWLINE:
									case CARRIAGE:
									case SEMICOLON: {
										++caret
										code = first
										length = eof
										break
									}
									case COLON: {
										if (format > 0) {
											++caret
											code = first
										}
									}
									case OPENBRACES: {
										length = eof
									}
								}
							}
						}
					}
				}

				// token varient
				switch (code) {
					case OPENBRACES: {
						chars = chars.trim()
						first = chars.charCodeAt(0)
						counter = 1
						length = ++caret

						while (caret < eof) {
							switch (code = body.charCodeAt(caret)) {
								case OPENBRACES: {
									counter++
									break
								}
								case CLOSEBRACES: {
									counter--
									break
								}
								case FOWARDSLASH: {
									switch (second = body.charCodeAt(caret + 1)) {
										// /*, //
										case STAR:
										case FOWARDSLASH: {
											caret = delimited(second, caret, eol, body)
										}
									}
									break
								}
								// given "[" === 91 & "]" === 93 hence forth 91 + 1 + 1 === 93
								case OPENBRACKET: {
									code++
								}
								// given "(" === 40 & ")" === 41 hence forth 40 + 1 === 41
								case OPENPARENTHESES: {
									code++
								}
								// quote tail delimiter is identical to the head delimiter hence noop,
								// fallthrough clauses have been shifted to the correct tail delimiter
								case DOUBLEQUOTE:
								case SINGLEQUOTE: {
									while (caret++ < eol) {
										if (body.charCodeAt(caret) === code) {
											break
										}
									}
								}
							}

							if (counter === 0) {
								break
							}

							caret++
						}

						child = body.substring(length, caret)

						if (first === NULL) {
							first = (chars = chars.replace(nullptn, '').trim()).charCodeAt(0)
						}

						switch (first) {
							// @at-rule
							case AT: {
								if (format > 0) {
									chars = chars.replace(formatptn, '')
								}

								second = chars.charCodeAt(1)

								switch (second) {
									case DOCUMENT:
									case MEDIA:
									case SUPPORTS:
									case DASH: {
										selector = current
										break
									}
									default: {
										selector = array
									}
								}

								child = compile(current, selector, child, second, depth+1)
								length = child.length

								// preserve empty @at-rule
								if (preserve > 0 && length === 0) {
									length = chars.length
								}

								// execute plugins, @at-rule context
								if (plugged > 0) {
									selector = select(array, chars, invert)
									result = proxy(ATRUL, child, selector, current, line, column, length, second, depth, id)
									chars = selector.join('')

									if (result !== void 0) {
										if ((length = (child = result.trim()).length) === 0) {
											second = 0
											child = ''
										}
									}
								}

								if (length > 0) {
									switch (second) {
										case SUPPORTS: {
											chars = chars.replace(supportsptn, supports)
										}
										case DOCUMENT:
										case MEDIA:
										case DASH: {
											child = chars + '{' + child + '}'
											break
										}
										case KEYFRAME: {
											chars = chars.replace(keyframeptn, '$1 $2' + (keyed > 0 ? key : ''))
											child = chars + '{' + child + '}'

											if (prefix === 1 || (prefix === 2 && vendor('@'+child, 3))) {
												child = '@' + webkit + child + '@' + child
											} else {
												child = '@' + child
											}
											break
										}
										default: {
											child = chars + child

											if (id === PAGE) {
												child = (out += child, '')
											}
										}
									}
								} else {
									child = ''
								}

								break
							}
							// selector
							default: {
								child = compile(current, select(current, chars, invert), child, id, depth+1)
							}
						}

						children += child

						// reset
						context = 0
						insert = 0
						pseudo = 0
						format = 0
						invert = 0
						atrule = 0
						chars = ''
						child = ''
						code = body.charCodeAt(++caret)
						break
					}
					case CLOSEBRACES:
					case SEMICOLON: {
						chars = (format > 0 ? chars.replace(formatptn, '') : chars).trim()

						if ((length = chars.length) > 1) {
							// monkey-patch missing colon
							if (pseudo === 0) {
								first = chars.charCodeAt(0)

								// first character is a letter or dash, buffer has a space character
								if ((first === DASH || first > 96 && first < 123)) {
									length = (chars = chars.replace(' ', ':')).length
								}
							}

							// execute plugins, property context
							if (plugged > 0) {
								if ((result = proxy(PROPS, chars, current, parent, line, column, out.length, id, depth, id)) !== void 0) {
									if ((length = (chars = result.trim()).length) === 0) {
										chars = '\0\0'
									}
								}
							}

							first = chars.charCodeAt(0)
							second = chars.charCodeAt(1)

							switch (first) {
								case NULL: {
									break
								}
								case AT: {
									if (second === IMPORT || second === CHARSET) {
										flat += chars + body.charAt(caret)
										break
									}
								}
								default: {
									if (chars.charCodeAt(length-1) === COLON) {
										break
									}

									out += property(chars, first, second, chars.charCodeAt(2))
								}
							}
						}

						// reset
						context = 0
						insert = 0
						pseudo = 0
						format = 0
						invert = 0
						chars = ''
						code = body.charCodeAt(++caret)
						break
					}
				}
			}

			// parse characters
			switch (code) {
				case CARRIAGE:
				case NEWLINE: {
					// auto insert semicolon
					if (comment + quote + parentheses + bracket + semicolon === 0) {
						// valid non-whitespace characters that
						// may precede a newline
						switch (peak) {
							case CLOSEPARENTHESES:
							case SINGLEQUOTE:
							case DOUBLEQUOTE:
							case AT:
							case TILDE:
							case GREATERTHAN:
							case STAR:
							case PLUS:
							case FOWARDSLASH:
							case DASH:
							case COLON:
							case COMMA:
							case SEMICOLON:
							case OPENBRACES:
							case CLOSEBRACES: {
								break
							}
							default: {
								// current buffer has a colon
								if (pseudo > 0) {
									insert = 1
								}
							}
						}
					}

					// terminate line comment
					if (comment === FOWARDSLASH) {
						comment = 0
					} else if (cascade + context === 0 && id !== KEYFRAME && chars.length > 0) {
						format = 1
						chars += '\0'
					}

					// execute plugins, newline context
					if (plugged * unkwn > 0) {
						proxy(UNKWN, chars, current, parent, line, column, out.length, id, depth, id)
					}

					// next line, reset column position
					column = 1
					line++
					break
				}
				case SEMICOLON:
				case CLOSEBRACES: {
					if (comment + quote + parentheses + bracket === 0) {
						column++
						break
					}
				}
				default: {
					// increment column position
					column++

					// current character
					char = body.charAt(caret)

					// remove comments, escape functions, strings, attributes and prepare selectors
					switch (code) {
						case TAB:
						case SPACE: {
							if (quote + bracket + comment === 0) {
								switch (tail) {
									case COMMA:
									case COLON:
									case TAB:
									case SPACE: {
										char = ''
										break
									}
									default: {
										if (code !== SPACE) {
											char = ' '
										}
									}
								}
							}
							break
						}
						// escape breaking control characters
						case NULL: {
							char = '\\0'
							break
						}
						case FORMFEED: {
							char = '\\f'
							break
						}
						case VERTICALTAB: {
							char = '\\v'
							break
						}
						// &
						case AND: {
							// inverted selector pattern i.e html &
							if (quote + comment + bracket === 0 && cascade > 0) {
								invert = 1
								format = 1
								char = '\f' + char
							}
							break
						}
						// ::p<l>aceholder, l
						// :read-on<l>y, l
						case 108: {
							if (quote + comment + bracket + pattern === 0 && pseudo > 0) {
								switch (caret - pseudo) {
									// ::placeholder
									case 2: {
										if (tail === PLACEHOLDER && body.charCodeAt(caret-3) === COLON) {
											pattern = tail
										}
									}
									// :read-only
									case 8: {
										if (trail === READONLY) {
											pattern = trail
										}
									}
								}
							}
							break
						}
						// :<pattern>
						case COLON: {
							if (quote + comment + bracket === 0) {
								pseudo = caret
							}
							break
						}
						// selectors
						case COMMA: {
							if (comment + parentheses + quote + bracket === 0) {
								format = 1
								char += '\r'
							}
							break
						}
						// quotes
						case DOUBLEQUOTE:
						case SINGLEQUOTE: {
							if (comment === 0) {
								quote = quote === code ? 0 : (quote === 0 ? code : quote)
							}
							break
						}
						// attributes
						case OPENBRACKET: {
							if (quote + comment + parentheses === 0) {
								bracket++
							}
							break
						}
						case CLOSEBRACKET: {
							if (quote + comment + parentheses === 0) {
								bracket--
							}
							break
						}
						// functions
						case CLOSEPARENTHESES: {
							if (quote + comment + bracket === 0) {
								parentheses--
							}
							break
						}
						case OPENPARENTHESES: {
							if (quote + comment + bracket === 0) {
								if (context === 0) {
									switch (tail*2 + trail*3) {
										// :matches
										case 533: {
											break
										}
										// :global, :not, :nth-child etc...
										default: {
											counter = 0
											context = 1
										}
									}
								}

								parentheses++
							}
							break
						}
						case AT: {
							if (comment + parentheses + quote + bracket + pseudo + atrule === 0) {
								atrule = 1
							}
							break
						}
						// block/line comments
						case STAR:
						case FOWARDSLASH: {
							if (quote + bracket + parentheses > 0) {
								break
							}

							switch (comment) {
								// initialize line/block comment context
								case 0: {
									switch (code*2 + body.charCodeAt(caret+1)*3) {
										// //
										case 235: {
											comment = FOWARDSLASH
											break
										}
										// /*
										case 220: {
											length = caret
											comment = STAR
											break
										}
									}
									break
								}
								// end block comment context
								case STAR: {
									if (code === FOWARDSLASH && tail === STAR && length + 2 !== caret) {
										// /*<!> ... */, !
										if (body.charCodeAt(length+2) === 33) {
											out += body.substring(length, caret+1)
										}
										char = ''
										comment = 0
									}
								}
							}
						}
					}

					// ignore comment blocks
					if (comment === 0) {
						// aggressive isolation mode, divide each individual selector
						// including selectors in :not function but excluding selectors in :global function
						if (cascade + quote + bracket + atrule === 0 && id !== KEYFRAME && code !== SEMICOLON) {
							switch (code) {
								case COMMA:
								case TILDE:
								case GREATERTHAN:
								case PLUS:
								case CLOSEPARENTHESES:
								case OPENPARENTHESES: {
									if (context === 0) {
										// outside of an isolated context i.e nth-child(<...>)
										switch (tail) {
											case TAB:
											case SPACE:
											case NEWLINE:
											case CARRIAGE: {
												char = char + '\0'
												break
											}
											default: {
												char = '\0' + char + (code === COMMA ? '' : '\0')
											}
										}
										format = 1
									} else {
										// within an isolated context, sleep untill it's terminated
										switch (code) {
											case OPENPARENTHESES: {
												// :globa<l>(
												if (pseudo + 7 === caret && tail === 108) {
													pseudo = 0
												}
												context = ++counter
												break
											}
											case CLOSEPARENTHESES: {
												if ((context = --counter) === 0) {
													format = 1
													char += '\0'
												}
												break
											}
										}
									}
									break
								}
								case TAB:
								case SPACE: {
									switch (tail) {
										case NULL:
										case OPENBRACES:
										case CLOSEBRACES:
										case SEMICOLON:
										case COMMA:
										case FORMFEED:
										case TAB:
										case SPACE:
										case NEWLINE:
										case CARRIAGE: {
											break
										}
										default: {
											// ignore in isolated contexts
											if (context === 0) {
												format = 1
												char += '\0'
											}
										}
									}
								}
							}
						}

						// concat buffer of characters
						chars += char

						// previous non-whitespace character code
						if (code !== SPACE && code !== TAB) {
							peak = code
						}
					}
				}
			}

			// tail character codes
			trail = tail
			tail = code

			// visit every character
			caret++
		}

		length = out.length

		// preserve empty selector
 		if (preserve > 0) {
 			if (length === 0 && children.length === 0 && (current[0].length === 0) === false) {
 				if (id !== MEDIA || (current.length === 1 && (cascade > 0 ? nscopealt : nscope) === current[0])) {
					length = current.join(',').length + 2
 				}
 			}
		}

		if (length > 0) {
			// cascade isolation mode?
			selector = cascade === 0 && id !== KEYFRAME ? isolate(current) : current

			// execute plugins, block context
			if (plugged > 0) {
				result = proxy(BLCKS, out, selector, parent, line, column, length, id, depth, id)

				if (result !== void 0 && (out = result).length === 0) {
					return flat + out + children
				}
			}

			out = selector.join(',') + '{' + out + '}'

			if (prefix*pattern !== 0) {
				if (prefix === 2 && !vendor(out, 2))
					pattern = 0

				switch (pattern) {
					// ::read-only
					case READONLY: {
						out = out.replace(readonlyptn, ':'+moz+'$1')+out
						break
					}
					// ::placeholder
					case PLACEHOLDER: {
						out = (
							out.replace(plcholdrptn, '::' + webkit + 'input-$1') +
							out.replace(plcholdrptn, '::' + moz + '$1') +
							out.replace(plcholdrptn, ':' + ms + 'input-$1') + out
						)
						break
					}
				}

				pattern = 0
			}
		}

		return flat + out + children
	}

	/**
	 * Select
	 *
	 * @param {Array<string>} parent
	 * @param {string} current
	 * @param {number} invert
	 * @return {Array<string>}
	 */
	function select (parent, current, invert) {
		var selectors = current.trim().split(selectorptn)
		var out = selectors

		var length = selectors.length
		var l = parent.length

		switch (l) {
			// 0-1 parent selectors
			case 0:
			case 1: {
				for (var i = 0, selector = l === 0 ? '' : parent[0] + ' '; i < length; ++i) {
					out[i] = scope(selector, out[i], invert, l).trim()
				}
				break
			}
			// >2 parent selectors, nested
			default: {
				for (var i = 0, j = 0, out = []; i < length; ++i) {
					for (var k = 0; k < l; ++k) {
						out[j++] = scope(parent[k] + ' ', selectors[i], invert, l).trim()
					}
				}
			}
		}

		return out
	}

	/**
	 * Scope
	 *
	 * @param {string} parent
	 * @param {string} current
	 * @param {number} invert
	 * @param {number} level
	 * @return {string}
	 */
	function scope (parent, current, invert, level) {
		var selector = current
		var code = selector.charCodeAt(0)

		// trim leading whitespace
		if (code < 33) {
			code = (selector = selector.trim()).charCodeAt(0)
		}

		switch (code) {
			// &
			case AND: {
				switch (cascade + level) {
					case 0:
					case 1: {
						if (parent.trim().length === 0) {
							break
						}
					}
					default: {
						return selector.replace(andptn, '$1'+parent.trim())
					}
				}
				break
			}
			// :
			case COLON: {
				switch (selector.charCodeAt(1)) {
					// g in :global
					case 103: {
						if (escape > 0 && cascade > 0) {
							return selector.replace(escapeptn, '$1').replace(andptn, '$1'+nscope)
						}
						break
					}
					default: {
						// :hover
						return parent.trim() + selector.replace(andptn, '$1'+parent.trim())
					}
				}
			}
			default: {
				// html &
				if (invert*cascade > 0 && selector.indexOf('\f') > 0) {
					return selector.replace(andptn, (parent.charCodeAt(0) === COLON ? '' : '$1')+parent.trim())
				}
			}
		}

		return parent + selector
	}

	/**
	 * Property
	 *
	 * @param {string} input
	 * @param {number} first
	 * @param {number} second
	 * @param {number} third
	 * @return {string}
	 */
	function property (input, first, second, third) {
		var index = 0
		var out = input + ';'
		var hash = (first*2) + (second*3) + (third*4)
		var cache

		// animation: a, n, i characters
		if (hash === 944) {
			return animation(out)
		} else if (prefix === 0 || (prefix === 2 && !vendor(out, 1))) {
			return out
		}

		// vendor prefix
		switch (hash) {
			// text-decoration/text-size-adjust/text-shadow/text-align/text-transform: t, e, x
			case 1015: {
				// text-shadow/text-align/text-transform, a
				return out.charCodeAt(10) === 97 ? webkit + out + out : out
			}
			// filter/fill f, i, l
			case 951: {
				// filter, t
				return out.charCodeAt(3) === 116 ? webkit + out + out : out
			}
			// color/column, c, o, l
			case 963: {
				// column, n
				return out.charCodeAt(5) === 110 ? webkit + out + out : out
			}
			// box-decoration-break, b, o, x
			case 1009: {
				if (out.charCodeAt(4) !== 100) {
					break
				}
			}
			// mask, m, a, s
			// clip-path, c, l, i
			case 969:
			case 942: {
				return webkit + out + out
			}
			// appearance: a, p, p
			case 978: {
				return webkit + out + moz + out + out
			}
			// hyphens: h, y, p
			// user-select: u, s, e
			case 1019:
			case 983: {
				return webkit + out + moz + out + ms + out + out
			}
			// background/backface-visibility, b, a, c
			case 883: {
				// backface-visibility, -
				if (out.charCodeAt(8) === DASH) {
					return webkit + out + out
				}

				// image-set(...)
				if (out.indexOf('image-set(', 11) > 0) {
					return out.replace(imgsrcptn, '$1'+webkit+'$2') + out
				}

				return out
			}
			// flex: f, l, e
			case 932: {
				if (out.charCodeAt(4) === DASH) {
					switch (out.charCodeAt(5)) {
						// flex-grow, g
						case 103: {
							return webkit + 'box-' + out.replace('-grow', '') + webkit + out + ms + out.replace('grow', 'positive') + out
						}
						// flex-shrink, s
						case 115: {
							return webkit + out + ms + out.replace('shrink', 'negative') + out
						}
						// flex-basis, b
						case 98: {
							return webkit + out + ms + out.replace('basis', 'preferred-size') + out
						}
					}
				}

				return webkit + out + ms + out + out
			}
			// order: o, r, d
			case 964: {
				return webkit + out + ms + 'flex' + '-' + out + out
			}
			// justify-items/justify-content, j, u, s
			case 1023: {
				// justify-content, c
				if (out.charCodeAt(8) !== 99) {
					break
				}

				cache = out.substring(out.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify')
				return webkit + 'box-pack' + cache + webkit + out + ms + 'flex-pack' + cache + out
			}
			// cursor, c, u, r
			case 1005: {
				return cursorptn.test(out) ? out.replace(colonptn, ':' + webkit) + out.replace(colonptn, ':' + moz) + out : out
			}
			// writing-mode, w, r, i
			case 1000: {
				cache = out.substring(13).trim()
				index = cache.indexOf('-') + 1

				switch (cache.charCodeAt(0)+cache.charCodeAt(index)) {
					// vertical-lr
					case 226: {
						cache = out.replace(writingptn, 'tb')
						break
					}
					// vertical-rl
					case 232: {
						cache = out.replace(writingptn, 'tb-rl')
						break
					}
					// horizontal-tb
					case 220: {
						cache = out.replace(writingptn, 'lr')
						break
					}
					default: {
						return out
					}
				}

				return webkit + out + ms + cache + out
			}
			// position: sticky
			case 1017: {
				if (out.indexOf('sticky', 9) === -1) {
					return out
				}
			}
			// display(flex/inline-flex/inline-box): d, i, s
			case 975: {
				index = (out = input).length - 10
				cache = (out.charCodeAt(index) === 33 ? out.substring(0, index) : out).substring(input.indexOf(':', 7) + 1).trim()

				switch (hash = cache.charCodeAt(0) + (cache.charCodeAt(7)|0)) {
					// inline-
					case 203: {
						// inline-box
						if (cache.charCodeAt(8) < 111) {
							break
						}
					}
					// inline-box/sticky
					case 115: {
						out = out.replace(cache, webkit+cache)+';'+out
						break
					}
					// inline-flex
					// flex
					case 207:
					case 102: {
						out = (
							out.replace(cache, webkit+(hash > 102 ? 'inline-' : '')+'box')+';'+
							out.replace(cache, webkit+cache)+';'+
							out.replace(cache, ms+cache+'box')+';'+
							out
						)
					}
				}

				return out + ';'
			}
			// align-items, align-center, align-self: a, l, i, -
			case 938: {
				if (out.charCodeAt(5) === DASH) {
					switch (out.charCodeAt(6)) {
						// align-items, i
						case 105: {
							cache = out.replace('-items', '')
							return webkit + out + webkit + 'box-' + cache + ms + 'flex-' + cache + out
						}
						// align-self, s
						case 115: {
							return webkit + out + ms + 'flex-item-' + out.replace(selfptn, '') + out
						}
						// align-content
						default: {
							return webkit + out + ms + 'flex-line-pack' + out.replace('align-content', '').replace(selfptn, '') + out
						}
					}
				}
				break
			}
			// min/max
			case 973:
			case 989: {
				// min-/max- height/width/block-size/inline-size
				if (out.charCodeAt(3) !== DASH || out.charCodeAt(4) === 122) {
					break
				}
			}
			// height/width: min-content / width: max-content
			case 931:
			case 953: {
				if (dimensionptn.test(input) === true) {
					// stretch
					if ((cache = input.substring(input.indexOf(':') + 1)).charCodeAt(0) === 115)
						return property(input.replace('stretch', 'fill-available'), first, second, third).replace(':fill-available', ':stretch')
					else
						return out.replace(cache, webkit + cache) + out.replace(cache, moz + cache.replace('fill-', '')) + out
				}
				break
			}
			// transform, transition: t, r, a
			case 962: {
				out = webkit + out + (out.charCodeAt(5) === 102 ? ms + out : '') + out

				// transitions
				if (second + third === 211 && out.charCodeAt(13) === 105 && out.indexOf('transform', 10) > 0) {
					return out.substring(0, out.indexOf(';', 27) + 1).replace(transformptn, '$1' + webkit + '$2') + out
				}

				break
			}
		}

		return out
	}

	/**
	 * Vendor
	 *
	 * @param {string} content
	 * @param {number} context
	 * @return {boolean}
	 */
	function vendor (content, context) {
		var index = content.indexOf(context === 1 ? ':' : '{')
		var key = content.substring(0, context !== 3 ? index : 10)
		var value = content.substring(index + 1, content.length - 1)

		return should(context !== 2 ? key : key.replace(pseudofmt, '$1'), value, context)
	}

	/**
	 * Supports
	 *
	 * @param {string} match
	 * @param {string} group
	 * @return {string}
	 */
	function supports (match, group) {
		var out = property(group, group.charCodeAt(0), group.charCodeAt(1), group.charCodeAt(2))

		return out !== group+';' ? out.replace(propertyptn, ' or ($1)').substring(4) : '('+group+')'
	}

	/**
	 * Animation
	 *
	 * @param {string} input
	 * @return {string}
	 */
	function animation (input) {
		var length = input.length
		var index = input.indexOf(':', 9) + 1
		var declare = input.substring(0, index).trim()
		var out = input.substring(index, length-1).trim()

		switch (input.charCodeAt(9)*keyed) {
			case 0: {
				break
			}
			// animation-*, -
			case DASH: {
				// animation-name, n
				if (input.charCodeAt(10) !== 110) {
					break
				}
			}
			// animation/animation-name
			default: {
				// split in case of multiple animations
				var list = out.split((out = '', animationptn))

				for (var i = 0, index = 0, length = list.length; i < length; index = 0, ++i) {
					var value = list[i]
					var items = value.split(propertiesptn)

					while (value = items[index]) {
						var peak = value.charCodeAt(0)

						if (keyed === 1 && (
							// letters
							(peak > AT && peak < 90) || (peak > 96 && peak < 123) || peak === UNDERSCORE ||
							// dash but not in sequence i.e --
							(peak === DASH && value.charCodeAt(1) !== DASH)
						)) {
							// not a number/function
							switch (isNaN(parseFloat(value)) + (value.indexOf('(') !== -1)) {
								case 1: {
									switch (value) {
										// not a valid reserved keyword
										case 'infinite': case 'alternate': case 'backwards': case 'running':
										case 'normal': case 'forwards': case 'both': case 'none': case 'linear':
										case 'ease': case 'ease-in': case 'ease-out': case 'ease-in-out':
										case 'paused': case 'reverse': case 'alternate-reverse': case 'inherit':
										case 'initial': case 'unset': case 'step-start': case 'step-end': {
											break
										}
										default: {
											value += key
										}
									}
								}
							}
						}

						items[index++] = value
					}

					out += (i === 0 ? '' : ',') + items.join(' ')
				}
			}
		}

		out = declare + out + ';'

		if (prefix === 1 || (prefix === 2 && vendor(out, 1)))
			return webkit + out + out

		return out
	}

	/**
	 * Isolate
	 *
	 * @param {Array<string>} current
	 */
	function isolate (current) {
		for (var i = 0, length = current.length, selector = Array(length), padding, element; i < length; ++i) {
			// split individual elements in a selector i.e h1 h2 === [h1, h2]
			var elements = current[i].split(elementptn)
			var out = ''

			for (var j = 0, size = 0, tail = 0, code = 0, l = elements.length; j < l; ++j) {
				// empty element
				if ((size = (element = elements[j]).length) === 0 && l > 1) {
					continue
				}

				tail = out.charCodeAt(out.length-1)
				code = element.charCodeAt(0)
				padding = ''

				if (j !== 0) {
					// determine if we need padding
					switch (tail) {
						case STAR:
						case TILDE:
						case GREATERTHAN:
						case PLUS:
						case SPACE:
						case OPENPARENTHESES:  {
							break
						}
						default: {
							padding = ' '
						}
					}
				}

				switch (code) {
					case AND: {
						element = padding + nscopealt
					}
					case TILDE:
					case GREATERTHAN:
					case PLUS:
					case SPACE:
					case CLOSEPARENTHESES:
					case OPENPARENTHESES: {
						break
					}
					case OPENBRACKET: {
						element = padding + element + nscopealt
						break
					}
					case COLON: {
						switch (element.charCodeAt(1)*2 + element.charCodeAt(2)*3) {
							// :global
							case 530: {
								if (escape > 0) {
									element = padding + element.substring(8, size - 1)
									break
								}
							}
							// :hover, :nth-child(), ...
							default: {
								if (j < 1 || elements[j-1].length < 1) {
									element = padding + nscopealt + element
								}
							}
						}
						break
					}
					case COMMA: {
						padding = ''
					}
					default: {
						if (size > 1 && element.indexOf(':') > 0) {
							element = padding + element.replace(pseudoptn, '$1' + nscopealt + '$2')
						} else {
							element = padding + element + nscopealt
						}
					}
				}

				out += element
			}

			selector[i] = out.replace(formatptn, '').trim()
		}

		return selector
	}

	/**
	 * Proxy
	 *
	 * @param {number} context
	 * @param {string} content
	 * @param {Array<string>} selectors
	 * @param {Array<string>} parents
	 * @param {number} line
	 * @param {number} column
	 * @param {number} length
	 * @param {number} id
	 * @param {number} depth
	 * @param {number} at
	 * @return {(string|void|*)}
	 */
	function proxy (context, content, selectors, parents, line, column, length, id, depth, at) {
		for (var i = 0, out = content, next; i < plugged; ++i) {
			switch (next = plugins[i].call(stylis, context, out, selectors, parents, line, column, length, id, depth, at)) {
				case void 0:
				case false:
				case true:
				case null: {
					break
				}
				default: {
					out = next
				}
			}
		}
		if (out !== content) {
		  return out
		}
	}

	/**
	 * @param {number} code
	 * @param {number} index
	 * @param {number} length
	 * @param {string} body
	 * @return {number}
	 */
	function delimited (code, index, length, body) {
		for (var i = index + 1; i < length; ++i) {
			switch (body.charCodeAt(i)) {
				// /*
				case FOWARDSLASH: {
					if (code === STAR) {
						if (body.charCodeAt(i - 1) === STAR &&  index + 2 !== i) {
							return i + 1
						}
					}
					break
				}
				// //
				case NEWLINE: {
					if (code === FOWARDSLASH) {
						return i + 1
					}
				}
			}
		}

		return i
	}

	/**
	 * @param {number} type
	 * @param {number} index
	 * @param {number} length
	 * @param {number} find
	 * @param {string} body
	 * @return {number}
	 */
	function match (type, index, length, body) {
		for (var i = index + 1; i < length; ++i) {
			switch (body.charCodeAt(i)) {
				case type: {
					return i
				}
			}
		}

		return i
	}

	/**
	 * Minify
	 *
	 * @param {(string|*)} output
	 * @return {string}
	 */
	function minify (output) {
		return output
			.replace(formatptn, '')
			.replace(beforeptn, '')
			.replace(afterptn, '$1')
			.replace(tailptn, '$1')
			.replace(whiteptn, ' ')
	}

	/**
	 * Use
	 *
	 * @param {(Array<function(...?)>|function(...?)|number|void)?} plugin
	 */
	function use (plugin) {
		switch (plugin) {
			case void 0:
			case null: {
				plugged = plugins.length = 0
				break
			}
			default: {
				if (typeof plugin === 'function') {
					plugins[plugged++] = plugin
				}	else if (typeof plugin === 'object') {
					for (var i = 0, length = plugin.length; i < length; ++i) {
						use(plugin[i])
					}
				} else {
					unkwn = !!plugin|0
				}
			}
 		}

 		return use
	}

	/**
	 * Set
	 *
	 * @param {*} options
	 */
	function set (options) {
		for (var name in options) {
			var value = options[name]
			switch (name) {
				case 'keyframe': keyed = value|0; break
				case 'global': escape = value|0; break
				case 'cascade': cascade = value|0; break
				case 'compress': compress = value|0; break
				case 'semicolon': semicolon = value|0; break
				case 'preserve': preserve = value|0; break
				case 'prefix':
					should = null

					if (!value) {
						prefix = 0
					} else if (typeof value !== 'function') {
						prefix = 1
					} else {
						prefix = 2
						should = value
					}
			}
		}

		return set
	}

	/**
	 * Stylis
	 *
	 * @param {string} selector
	 * @param {string} input
	 * @return {*}
	 */
	function stylis (selector, input) {
		if (this !== void 0 && this.constructor === stylis) {
			return factory(selector)
		}

		// setup
		var ns = selector
		var code = ns.charCodeAt(0)

		// trim leading whitespace
		if (code < 33) {
			code = (ns = ns.trim()).charCodeAt(0)
		}

		// keyframe/animation namespace
		if (keyed > 0) {
			key = ns.replace(invalidptn, code === OPENBRACKET ? '' : '-')
		}

		// reset, used to assert if a plugin is moneky-patching the return value
		code = 1

		// cascade/isolate
		if (cascade === 1) {
			nscope = ns
		} else {
			nscopealt = ns
		}

		var selectors = [nscope]
		var result

		// execute plugins, pre-process context
		if (plugged > 0) {
			result = proxy(PREPS, input, selectors, selectors, line, column, 0, 0, 0, 0)

			if (result !== void 0 && typeof result === 'string') {
				input = result
			}
		}

		// build
		var output = compile(array, selectors, input, 0, 0)

		// execute plugins, post-process context
		if (plugged > 0) {
			result = proxy(POSTS, output, selectors, selectors, line, column, output.length, 0, 0, 0)

			// bypass minification
			if (result !== void 0 && typeof(output = result) !== 'string') {
				code = 0
			}
		}

		// reset
		key = ''
		nscope = ''
		nscopealt = ''
		pattern = 0
		line = 1
		column = 1

		return compress*code === 0 ? output : minify(output)
	}

	stylis['use'] = use
	stylis['set'] = set

	if (options !== void 0) {
		set(options)
	}

	return stylis
}));

},{}],"utils.ts":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
var i = 0;

var getClassName = function getClassName() {
  return "s".concat(++i);
};

exports.getClassName = getClassName;
/**
 * Remove fields that are undefined in order that, when spread,
 * they don't override defined fields
 */

var defined = function defined(a) {
  var b = {};

  for (var _i = 0, _Object$entries = Object.entries(a); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    if (typeof value !== "undefined") b[key] = value;
  }

  return b;
};

exports.defined = defined;

var camelCaseToKebabCase = function camelCaseToKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, function (_, end, start) {
    return "".concat(end, "-").concat(start.toLowerCase());
  });
};

var stylesToCSS = function stylesToCSS(styles) {
  return Object.entries(styles).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return "".concat(camelCaseToKebabCase(k), ":").concat(v);
  }).join(";");
};

exports.stylesToCSS = stylesToCSS;

var attrsToString = function attrsToString(attrs) {
  return Object.entries(defined(attrs)).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];

    return "".concat(k, "=\"").concat(v, "\"");
  }).join(" ");
};

exports.attrsToString = attrsToString;

var padIf = function padIf(str) {
  return str && " ".concat(str);
};

exports.padIf = padIf;
},{}],"lib.ts":[function(require,module,exports) {
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var stylis_1 = __importDefault(require("stylis"));

var utils_1 = require("./utils");
/**
 * Will generate a component from a function that takes attributes
 * and string children and returns a string. Adding the `attrs`, `style`
 * and `currentAttrs` functionality.
 */


var createComponent = function createComponent(fn) {
  var g = function g() {
    for (var _len = arguments.length, children = new Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    return fn.apply(void 0, [{}].concat(children));
  };

  g.attrs = function (prevAttrs) {
    var cmp = createComponent(function (attrs) {
      for (var _len2 = arguments.length, children = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        children[_key2 - 1] = arguments[_key2];
      }

      return fn.apply(void 0, [Object.assign(Object.assign(Object.assign({}, prevAttrs), utils_1.defined(attrs)), {
        class: "".concat(prevAttrs.class || "", " ").concat(attrs.class || "").trim() || undefined,
        style: Object.assign(Object.assign({}, prevAttrs.style), utils_1.defined(attrs.style || {}))
      })].concat(children));
    });
    cmp.currentAttrs = prevAttrs;
    return cmp;
  };

  g.style = function (style) {
    return g.attrs({
      style: style
    });
  };

  g.currentAttrs = {};
  return g;
};
/**
 * Helper for generating components with given tag names
 */


var createTagComponent = function createTagComponent(tag) {
  return createComponent(function (_a) {
    var _a$style = _a.style,
        style = _a$style === void 0 ? {} : _a$style,
        rest = __rest(_a, ["style"]);

    for (var _len3 = arguments.length, children = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      children[_key3 - 1] = arguments[_key3];
    }

    return "<".concat(tag).concat(utils_1.padIf(utils_1.attrsToString(Object.assign(Object.assign({}, rest), {
      style: utils_1.stylesToCSS(style) || undefined // coerce empty string to undefined to have it removed

    }))), ">").concat(children.join(""), "</").concat(tag, ">");
  });
};

exports.h = createTagComponent;
/**
 * Helper for building components that spit out HTML tags
 */

var build = function build(tags) {
  return tags.reduce(function (acc, tag) {
    return Object.assign(Object.assign({}, acc), _defineProperty({}, tag, createTagComponent(tag)));
  }, {});
};

exports.build = build;
/**
 * Runs either a StyleBuilder or gets the `selector` from a Selectable
 * as above
 **/

var runInterpolator = function runInterpolator(int, theme) {
  return int ? "selector" in int ? int.selector : int(theme) : "";
};
/**
 * Helper for creating a `selector` value for a styled component.
 *
 * Concatentate the classes with dots preceding them
 */


var classStringToSelector = function classStringToSelector(str) {
  return str.length ? ".".concat(str.split(" ").join(".")) : "";
};
/**
 * Turns a template string array and a list of `StyleInterpolator`
 * into one big `StyleBuilder`
 **/


var combineInterpolators = function combineInterpolators(strs, fns) {
  return function (data) {
    return strs.reduce(function (out, str, i) {
      return "".concat(out).concat(str).concat(runInterpolator(fns[i], data));
    }, "");
  };
};
/**
 * The main helper for adding styles to components.
 */


var createStyleContext = function createStyleContext() {
  var getClassNameImpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : utils_1.getClassName;
  var styles = [];

  var addClass = function addClass(strs) {
    var className = getClassNameImpl();

    for (var _len4 = arguments.length, rest = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      rest[_key4 - 1] = arguments[_key4];
    }

    styles.push({
      sel: ".".concat(className),
      fn: combineInterpolators(strs, rest)
    });
    return className;
  };
  /**
   * Adds a CSS class to the components, stores a function to be lazily evaluated
   * when `getStyles` is called which will generate the CSS for this CSS class and
   * finally returns that component with it's selector in order for using in other
   * template tags for other styled components as described above
   */


  var styled = function styled(component) {
    return function (str) {
      for (var _len5 = arguments.length, rest = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        rest[_key5 - 1] = arguments[_key5];
      }

      var cmp = component.attrs({
        class: addClass.apply(void 0, [str].concat(rest))
      }); // Type-safe way to move from a Component to a StyledComponent
      // clone the function (using `bind`), copy `attrs`, `style` fields etc.
      // and then add `selector` field

      return Object.assign(cmp.bind(undefined), cmp, {
        selector: classStringToSelector(cmp.currentAttrs.class || "")
      });
    };
  };
  /**
   * Adds global CSS to the styles
   */


  var injectGlobal = function injectGlobal(strs) {
    for (var _len6 = arguments.length, rest = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      rest[_key6 - 1] = arguments[_key6];
    }

    return styles.push({
      sel: "",
      fn: combineInterpolators(strs, rest)
    });
  };
  /**
   * This function will generate and return the CSS for all created styled components
   * on this context at the time of calling it.
   */


  var getStyles = function getStyles(theme) {
    return styles.map(function (s) {
      return stylis_1.default(s.sel, runInterpolator(s.fn, theme));
    }).join("");
  };

  return {
    styled: styled,
    injectGlobal: injectGlobal,
    getStyles: getStyles
  };
};

exports.createStyleContext = createStyleContext;
},{"stylis":"node_modules/stylis/stylis.js","./utils":"utils.ts"}],"helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lib_1 = require("./lib");

var _lib_1$build = lib_1.build(["div", "span", "h1", "h2", "h3", "p", "img", "svg", "g", "path", "button", "figure", "figcaption", "blockquote", "cite"]),
    div = _lib_1$build.div,
    span = _lib_1$build.span,
    h1 = _lib_1$build.h1,
    h2 = _lib_1$build.h2,
    h3 = _lib_1$build.h3,
    p = _lib_1$build.p,
    img = _lib_1$build.img,
    svg = _lib_1$build.svg,
    button = _lib_1$build.button,
    g = _lib_1$build.g,
    path = _lib_1$build.path,
    figure = _lib_1$build.figure,
    figcaption = _lib_1$build.figcaption,
    blockquote = _lib_1$build.blockquote,
    cite = _lib_1$build.cite;

exports.div = div;
exports.span = span;
exports.h1 = h1;
exports.h2 = h2;
exports.h3 = h3;
exports.p = p;
exports.img = img;
exports.svg = svg;
exports.button = button;
exports.g = g;
exports.path = path;
exports.figure = figure;
exports.figcaption = figcaption;
exports.blockquote = blockquote;
exports.cite = cite;

var fragment = function fragment() {
  for (var _len = arguments.length, children = new Array(_len), _key = 0; _key < _len; _key++) {
    children[_key] = arguments[_key];
  }

  return children.join("");
};

exports.fragment = fragment;

var getTheme = function getTheme(pillar) {
  switch (pillar) {
    case "news":
      {
        return {
          dark: "#ab0613",
          main: "#c70000",
          bright: "#ff4e36",
          pastel: "#ffbac8",
          faded: "#fff4f2",
          borderStyle: "solid"
        };
      }

    case "opinion":
      {
        return {
          dark: "#bd5318",
          main: "#e05e00",
          bright: "#ff7f0f",
          pastel: "#f9b376",
          faded: "#fef9f5",
          borderStyle: "solid"
        };
      }

    case "sport":
      {
        return {
          dark: "#005689",
          main: "#0084c6",
          bright: "#00b2ff",
          pastel: "#90dcff",
          faded: "#f1f8fc",
          borderStyle: "dotted"
        };
      }

    case "culture":
      {
        return {
          dark: "#6b5840",
          main: "#a1845c",
          bright: "#eacca0",
          pastel: "#e7d4b9",
          faded: "#fbf6ef",
          borderStyle: "solid"
        };
      }

    case "lifestyle":
      {
        return {
          dark: "#7d0068",
          main: "#bb3b80",
          bright: "#ffabdb",
          pastel: "#fec8d3",
          faded: "#feeef7",
          borderStyle: "solid"
        };
      }
  }
};

exports.getTheme = getTheme;
},{"./lib":"lib.ts"}],"styles.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lib_1 = require("./lib");

var _lib_1$createStyleCon = lib_1.createStyleContext(),
    getStyles = _lib_1$createStyleCon.getStyles,
    styled = _lib_1$createStyleCon.styled,
    injectGlobal = _lib_1$createStyleCon.injectGlobal;

exports.styled = styled;
exports.injectGlobal = injectGlobal;

var render = function render(str, theme) {
  return "<style>".concat(getStyles(theme), "</style>").concat(str);
};

exports.render = render;
},{"./lib":"lib.ts"}],"elements/LineContainer.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  max-width: 600px;\n  // collapse margins with sub pixel padding but no visible impact\n  padding: 0.05px 8px;\n  position: relative;\n\n  @media (min-width: 614px) {\n    border-right: 1px solid #999;\n  }\n\n  @media (min-width: 900px) {\n    margin-left: 20vw;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var helpers_1 = require("../helpers");

exports.LineContainer = styles_1.styled(helpers_1.div)(_templateObject());
},{"../styles":"styles.ts","../helpers":"helpers.ts"}],"elements/HTML.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  line-height: 1.4;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var helpers_1 = require("../helpers");

exports.HTML = styles_1.styled(helpers_1.div)(_templateObject());
},{"../styles":"styles.ts","../helpers":"helpers.ts"}],"elements/InlineImage.ts":[function(require,module,exports) {
"use strict";

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  font-size: 12px;\n  line-height: 1.4;\n\n  @media (min-width: 1100px) {\n    margin-left: calc(50% + 8px);\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  margin: 8px 0;\n  float: right;\n  width: 100%;\n\n  @media (min-width: 1100px) {\n    margin: 0 calc(-50% - 16px) 16px 16px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var wrapper = styles_1.styled(helpers_1.figure)(_templateObject());
var image = styles_1.styled(helpers_1.img)(_templateObject2());
var captionText = styles_1.styled(helpers_1.figcaption)(_templateObject3());

exports.InlineImage = function (_ref) {
  var src = _ref.src,
      caption = _ref.caption;
  return wrapper(image.attrs({
    src: src
  })(), captionText(caption));
};
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/Kicker.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-size: 16px;\n  margin: 0;\n  padding: 8px 0;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

exports.Kicker = styles_1.styled(helpers_1.h3)(_templateObject(), function (theme) {
  return theme.main;
});
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/BorderedKicker.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  border-bottom: 1px solid #dcdcdc;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var Kicker_1 = require("./Kicker");

exports.BorderedKicker = styles_1.styled(Kicker_1.Kicker)(_templateObject());
},{"../styles":"styles.ts","./Kicker":"elements/Kicker.ts"}],"elements/Byline.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-size: 16px;\n  line-height: 20px;\n  padding: 4px 0 1em;\n  font-weight: 700;\n  margin: 0;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

exports.Byline = styles_1.styled(helpers_1.h2)(_templateObject(), function (theme) {
  return theme.main;
});
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/Headline.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  padding: 8px 0 0;\n  margin: 0 0 30px;\n  font-size: 36px;\n  line-height: 38px;\n  font-weight: 400;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

exports.Headline = styles_1.styled(helpers_1.h1)(_templateObject(), function (theme) {
  return theme.headerColor;
});
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/Multiline.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  border-width: 0;\n  border-top-width: 1px;\n  margin-bottom: 2px;\n  border-style: ", "\n  width: 100%;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var line = styles_1.styled(helpers_1.div)(_templateObject(), function (theme) {
  return theme.borderStyle;
});

exports.Multiline = function (_ref) {
  var color = _ref.color,
      _ref$count = _ref.count,
      count = _ref$count === void 0 ? 4 : _ref$count;
  var l = line.style({
    borderColor: color
  })();
  var lines = Array.from({
    length: count
  }, function () {
    return l;
  });
  return helpers_1.div.apply(helpers_1, _toConsumableArray(lines));
};
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/Standfirst.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: #121212;\n  line-height: 24px;\n  padding: 0 0 16px;\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Standfirst = styles_1.styled(helpers_1.p)(_templateObject());
exports.Standfirst = Standfirst;
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/TrailImage.ts":[function(require,module,exports) {
"use strict";

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  appearance: none;\n  background-color: ", "\n  border: none;\n  border-radius: 100%;\n  color: white;\n  display: block;\n  width: 40px;\n  height: 40px;\n  line-height: 20px;\n  vertical-align: middle;\n  text-align: center;\n  position: absolute;\n  bottom: 16px;\n  right: 16px;\n  z-index: 1;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  display: none;\n  position: absolute;\n  color: white;\n  top: 0;\n  width: 100%;\n  padding: 16px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  padding-top: 140%;\n\n  @media (min-width: 600px) {\n    padding-top: 100%;\n  }\n\n  @media (min-width: 900px) {\n    padding-top: 100vh;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background-color: black;\n  background-size: cover;\n  background-position: 50% 50%;\n  padding-top: 60%;\n  position: relative;\n\n  &[data-open=\"true\"] {\n    background-image: none !important;\n\n    [data-credit] {\n      display: block;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Wrapper = styles_1.styled(helpers_1.div)(_templateObject());
var WrapperImmersive = styles_1.styled(Wrapper)(_templateObject2());
var CreditText = styles_1.styled(helpers_1.div)(_templateObject3());
var Toggle = styles_1.styled(helpers_1.button)(_templateObject4(), function (theme) {
  return theme.main;
});

var TrailImage = function TrailImage(_ref) {
  var src = _ref.src,
      credit = _ref.credit,
      _ref$immersive = _ref.immersive,
      immersive = _ref$immersive === void 0 ? false : _ref$immersive;
  return (immersive ? WrapperImmersive : Wrapper).attrs({
    id: "trail-wrapper",
    "data-open": false,
    style: {
      backgroundImage: "url(".concat(src, ")")
    }
  })(CreditText.attrs({
    "data-credit": true
  })(credit), Toggle.attrs({
    onclick: "this.parentNode.dataset.open = !JSON.parse(this.parentNode.dataset.open)"
  })(""));
};

exports.TrailImage = TrailImage;
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"headers/ArticleHeader.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BorderedKicker_1 = require("../elements/BorderedKicker");

var Byline_1 = require("../elements/Byline");

var Headline_1 = require("../elements/Headline");

var LineContainer_1 = require("../elements/LineContainer");

var Multiline_1 = require("../elements/Multiline");

var Standfirst_1 = require("../elements/Standfirst");

var TrailImage_1 = require("../elements/TrailImage");

var ArticleHeader = function ArticleHeader(article) {
  return LineContainer_1.LineContainer(TrailImage_1.TrailImage(article.trailImage), BorderedKicker_1.BorderedKicker(article.kicker), Headline_1.Headline(article.headline), Standfirst_1.Standfirst(article.standfirst), Multiline_1.Multiline({
    color: "#999"
  }), Byline_1.Byline(article.byline), Multiline_1.Multiline({
    color: "#dcdcdc",
    count: 1
  }));
};

exports.ArticleHeader = ArticleHeader;
},{"../elements/BorderedKicker":"elements/BorderedKicker.ts","../elements/Byline":"elements/Byline.ts","../elements/Headline":"elements/Headline.ts","../elements/LineContainer":"elements/LineContainer.ts","../elements/Multiline":"elements/Multiline.ts","../elements/Standfirst":"elements/Standfirst.ts","../elements/TrailImage":"elements/TrailImage.ts"}],"elements/KickerPositioner.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  margin-left: -8px;\n\n  @media (min-width: 614px) {\n    margin-left: 0;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var helpers_1 = require("../helpers");

exports.KickerPositioner = styles_1.styled(helpers_1.div)(_templateObject());
},{"../styles":"styles.ts","../helpers":"helpers.ts"}],"elements/FillToLine.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  margin: 0 -8px;\n\n  @media (min-width: 900px) {\n    margin-left: calc(-20vw - 8px);\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var helpers_1 = require("../helpers");

exports.FillToLine = styles_1.styled(helpers_1.div)(_templateObject());
},{"../styles":"styles.ts","../helpers":"helpers.ts"}],"headers/ObitHeader.ts":[function(require,module,exports) {
"use strict";

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  background-color: #333;\n  color: #fff;\n  margin-bottom: 1px;\n  padding: 8px 8px 16px;\n  position: absolute;\n  bottom: 100%;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  color: #333;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  color: #fff;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  color: #fff;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background-color: #333;\n  position: relative;\n  border-top: 1px solid #fff;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TrailImage_1 = require("../elements/TrailImage");

var Byline_1 = require("../elements/Byline");

var Standfirst_1 = require("../elements/Standfirst");

var Multiline_1 = require("../elements/Multiline");

var Headline_1 = require("../elements/Headline");

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Kicker_1 = require("../elements/Kicker");

var LineContainer_1 = require("../elements/LineContainer");

var KickerPositioner_1 = require("../elements/KickerPositioner");

var FillToLine_1 = require("../elements/FillToLine");

var TopWrapper = styles_1.styled(helpers_1.div)(_templateObject());
var ObitHeadline = styles_1.styled(Headline_1.Headline)(_templateObject2());
var ObitStandfirst = styles_1.styled(Standfirst_1.Standfirst)(_templateObject3());
var ObitByline = styles_1.styled(Byline_1.Byline)(_templateObject4());
var ObitKicker = styles_1.styled(Kicker_1.Kicker)(_templateObject5());

var ObitHeader = function ObitHeader(article) {
  return helpers_1.fragment(TrailImage_1.TrailImage(Object.assign(Object.assign({}, article.trailImage), {
    immersive: true
  })), TopWrapper(LineContainer_1.LineContainer(KickerPositioner_1.KickerPositioner(ObitKicker(article.kicker)), ObitHeadline(article.headline), ObitStandfirst(article.standfirst))), LineContainer_1.LineContainer(FillToLine_1.FillToLine(Multiline_1.Multiline({
    color: "#333"
  })), ObitByline(article.byline), FillToLine_1.FillToLine(Multiline_1.Multiline({
    color: "#dcdcdc",
    count: 1
  }))));
};

exports.ObitHeader = ObitHeader;
},{"../elements/TrailImage":"elements/TrailImage.ts","../elements/Byline":"elements/Byline.ts","../elements/Standfirst":"elements/Standfirst.ts","../elements/Multiline":"elements/Multiline.ts","../elements/Headline":"elements/Headline.ts","../helpers":"helpers.ts","../styles":"styles.ts","../elements/Kicker":"elements/Kicker.ts","../elements/LineContainer":"elements/LineContainer.ts","../elements/KickerPositioner":"elements/KickerPositioner.ts","../elements/FillToLine":"elements/FillToLine.ts"}],"elements/OutieKicker.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background-color: ", ";\n  padding: 8px 8px 16px;\n  position: absolute;\n  bottom: 100%;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var Kicker_1 = require("./Kicker");

exports.OutieKicker = styles_1.styled(Kicker_1.Kicker)(_templateObject(), function (theme) {
  return theme.main;
});
},{"../styles":"styles.ts","./Kicker":"elements/Kicker.ts"}],"headers/ImmersiveHeader.ts":[function(require,module,exports) {
"use strict";

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  background-color: ", ";\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  margin-top: -80px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-weight: 600;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  padding-right: 70px;\n  position: relative;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Byline_1 = require("../elements/Byline");

var Headline_1 = require("../elements/Headline");

var KickerPositioner_1 = require("../elements/KickerPositioner");

var LineContainer_1 = require("../elements/LineContainer");

var Multiline_1 = require("../elements/Multiline");

var OutieKicker_1 = require("../elements/OutieKicker");

var Standfirst_1 = require("../elements/Standfirst");

var TrailImage_1 = require("../elements/TrailImage");

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Outer = styles_1.styled(helpers_1.div)(_templateObject());
var ImmersiveHeadline = styles_1.styled(Headline_1.Headline)(_templateObject2(), function (theme) {
  return theme.main;
});
var ImmersiveLineContainer = styles_1.styled(LineContainer_1.LineContainer)(_templateObject3());
var ImmersiveKicker = styles_1.styled(OutieKicker_1.OutieKicker)(_templateObject4(), function (theme) {
  return theme.main;
});

var ImmersiveHeader = function ImmersiveHeader(article, _ref) {
  var _ref$showKicker = _ref.showKicker,
      showKicker = _ref$showKicker === void 0 ? true : _ref$showKicker,
      _ref$showBottomLine = _ref.showBottomLine,
      showBottomLine = _ref$showBottomLine === void 0 ? true : _ref$showBottomLine,
      backgroundColor = _ref.backgroundColor,
      color = _ref.color;
  return helpers_1.div.style({
    backgroundColor: backgroundColor
  })(TrailImage_1.TrailImage(Object.assign(Object.assign({}, article.trailImage), {
    immersive: true
  })), Outer(ImmersiveLineContainer.style({
    backgroundColor: backgroundColor
  })(showKicker ? KickerPositioner_1.KickerPositioner(ImmersiveKicker.style({
    color: color
  })(article.kicker)) : "", ImmersiveHeadline.style({
    color: color
  })(article.headline), Standfirst_1.Standfirst.style({
    color: color
  })(article.standfirst), Multiline_1.Multiline({
    color: color || "#dcdcdc"
  }), Byline_1.Byline.style({
    color: color
  })(article.byline), showBottomLine ? Multiline_1.Multiline({
    color: "#dcdcdc",
    count: 1
  }) : "")));
};

exports.ImmersiveHeader = ImmersiveHeader;
},{"../elements/Byline":"elements/Byline.ts","../elements/Headline":"elements/Headline.ts","../elements/KickerPositioner":"elements/KickerPositioner.ts","../elements/LineContainer":"elements/LineContainer.ts","../elements/Multiline":"elements/Multiline.ts","../elements/OutieKicker":"elements/OutieKicker.ts","../elements/Standfirst":"elements/Standfirst.ts","../elements/TrailImage":"elements/TrailImage.ts","../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/Cutout.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: block;\n  width: 200px;\n  height: auto;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var cutout = styles_1.styled(helpers_1.img)(_templateObject());

var Cutout = function Cutout(_ref) {
  var src = _ref.src;
  return cutout ? cutout.attrs({
    src: src
  })() : "";
};

exports.Cutout = Cutout;
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/AnalysisByline.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-size: 32px;\n  line-height: 20px;\n  padding: 4px 0 50px;\n  font-weight: 700;\n  margin: 0;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

exports.AnalysisByline = styles_1.styled(helpers_1.h2)(_templateObject(), function (theme) {
  return theme.main;
});
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/AnalysisHeadline.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: #000;\n  margin: 16px 0 0;\n  line-height: 32px;\n  font-size: 30px;\n  font-weight: 300;\n  text-decoration-color: ", ";\n  text-decoration-thickness: 1px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var header = styles_1.styled(helpers_1.h1)(_templateObject(), function (theme) {
  return theme.main;
});

exports.AnalysisHeadline = function (_ref) {
  var title = _ref.title,
      underline = _ref.underline;
  return header.attrs({
    style: {
      textDecorationLine: underline ? "underline" : "none"
    }
  })(title);
};
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/Pad.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  padding: 0 8px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var helpers_1 = require("../helpers");

exports.Pad = styles_1.styled(helpers_1.div)(_templateObject());
},{"../styles":"styles.ts","../helpers":"helpers.ts"}],"elements/Quote.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  fill: ", ";\n  display: inline-block;\n  margin-right: 10px;\n  height: 22px;\n  vertical-align: baseline;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var quote = styles_1.styled(helpers_1.svg)(_templateObject(), function (theme) {
  return theme.main;
});

exports.Quote = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      color = _ref.color,
      height = _ref.height;

  return quote.attrs({
    style: {
      fill: color,
      height: height
    },
    role: "img",
    xlmns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 22 14"
  })(helpers_1.g.attrs({
    "fill-rule": "evenodd"
  })(helpers_1.path.attrs({
    d: "M5.506 0h4.976c-.6 4.549-1.13 9.01-1.36 14H0C.83 9.142 2.557 4.549 5.506 0zM17.093 0H22c-.53 4.549-1.129 9.01-1.36 14h-9.099c.945-4.858 2.604-9.451 5.552-14z"
  })()));
};
},{"../helpers":"helpers.ts","../styles":"styles.ts"}],"headers/AnalysisHeader.ts":[function(require,module,exports) {
"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: flex-end;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background-color: #f6f6f6;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Cutout_1 = require("../elements/Cutout");

var AnalysisByline_1 = require("../elements/AnalysisByline");

var AnalysisHeadline_1 = require("../elements/AnalysisHeadline");

var LineContainer_1 = require("../elements/LineContainer");

var Multiline_1 = require("../elements/Multiline");

var Pad_1 = require("../elements/Pad");

var Quote_1 = require("../elements/Quote");

var Standfirst_1 = require("../elements/Standfirst");

var TrailImage_1 = require("../elements/TrailImage");

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Background = styles_1.styled(helpers_1.div)(_templateObject());
var CutoutContainer = styles_1.styled(helpers_1.div)(_templateObject2());

var AnalysisHeader = function AnalysisHeader(article) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$underline = _ref.underline,
      underline = _ref$underline === void 0 ? true : _ref$underline,
      _ref$quote = _ref.quote,
      quote = _ref$quote === void 0 ? false : _ref$quote;

  return Background(LineContainer_1.LineContainer(TrailImage_1.TrailImage(article.trailImage), Pad_1.Pad(CutoutContainer(helpers_1.div(AnalysisHeadline_1.AnalysisHeadline({
    title: "".concat(quote ? Quote_1.Quote() : "").concat(article.headline),
    underline: underline
  }), AnalysisByline_1.AnalysisByline(article.byline)), helpers_1.div(Cutout_1.Cutout({
    src: article.cutout
  }))), Multiline_1.Multiline({
    color: "#999"
  }), Standfirst_1.Standfirst(article.standfirst))));
};

exports.AnalysisHeader = AnalysisHeader;
},{"../elements/Cutout":"elements/Cutout.ts","../elements/AnalysisByline":"elements/AnalysisByline.ts","../elements/AnalysisHeadline":"elements/AnalysisHeadline.ts","../elements/LineContainer":"elements/LineContainer.ts","../elements/Multiline":"elements/Multiline.ts","../elements/Pad":"elements/Pad.ts","../elements/Quote":"elements/Quote.ts","../elements/Standfirst":"elements/Standfirst.ts","../elements/TrailImage":"elements/TrailImage.ts","../helpers":"helpers.ts","../styles":"styles.ts"}],"elements/Stars.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background-color: #ffe500;\n  display: inline-block;\n  font-size: 22px;\n  line-height: 1;\n  color: #000;\n  padding: 2px 4px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var styles_1 = require("../styles");

var helpers_1 = require("../helpers");

var Container = styles_1.styled(helpers_1.div)(_templateObject());

exports.Stars = function (_ref) {
  var count = _ref.count;
  return Container("★".repeat(count), "☆".repeat(5 - count));
};
},{"../styles":"styles.ts","../helpers":"helpers.ts"}],"headers/ReviewHeader.ts":[function(require,module,exports) {
"use strict";

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-weight: 600;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-weight: 600;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  bottom: 0;\n  position: absolute;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background: ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BorderedKicker_1 = require("../elements/BorderedKicker");

var Byline_1 = require("../elements/Byline");

var FillToLine_1 = require("../elements/FillToLine");

var Headline_1 = require("../elements/Headline");

var LineContainer_1 = require("../elements/LineContainer");

var Multiline_1 = require("../elements/Multiline");

var Standfirst_1 = require("../elements/Standfirst");

var TrailImage_1 = require("../elements/TrailImage");

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Stars_1 = require("../elements/Stars");

var Background = styles_1.styled(helpers_1.div)(_templateObject(), function (theme) {
  return theme.faded;
});
var TrailImageContainer = styles_1.styled(helpers_1.div)(_templateObject2());
var StarContainer = styles_1.styled(helpers_1.div)(_templateObject3());
var ReviewKicker = styles_1.styled(BorderedKicker_1.BorderedKicker)(_templateObject4(), function (theme) {
  return theme.dark;
});
var ReviewHeadline = styles_1.styled(Headline_1.Headline)(_templateObject5(), function (theme) {
  return theme.dark;
});
var ReviewStandfirst = styles_1.styled(Standfirst_1.Standfirst)(_templateObject6(), function (theme) {
  return theme.dark;
});
var ReviewByline = styles_1.styled(Byline_1.Byline)(_templateObject7(), function (theme) {
  return theme.dark;
});

var ReviewHeader = function ReviewHeader(article) {
  return helpers_1.fragment(Background(LineContainer_1.LineContainer(TrailImageContainer(TrailImage_1.TrailImage(article.trailImage), StarContainer(article.starCount ? Stars_1.Stars({
    count: article.starCount
  }) : "")), ReviewKicker(article.kicker), ReviewHeadline(article.headline), ReviewStandfirst(article.standfirst))), LineContainer_1.LineContainer(FillToLine_1.FillToLine(Multiline_1.Multiline({
    color: "#999"
  })), ReviewByline(article.byline), FillToLine_1.FillToLine(Multiline_1.Multiline({
    color: "#dcdcdc",
    count: 1
  }))));
};

exports.ReviewHeader = ReviewHeader;
},{"../elements/BorderedKicker":"elements/BorderedKicker.ts","../elements/Byline":"elements/Byline.ts","../elements/FillToLine":"elements/FillToLine.ts","../elements/Headline":"elements/Headline.ts","../elements/LineContainer":"elements/LineContainer.ts","../elements/Multiline":"elements/Multiline.ts","../elements/Standfirst":"elements/Standfirst.ts","../elements/TrailImage":"elements/TrailImage.ts","../helpers":"helpers.ts","../styles":"styles.ts","../elements/Stars":"elements/Stars.ts"}],"headers/InterviewHeader.ts":[function(require,module,exports) {
"use strict";

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  background-color: black;\n  box-shadow: 8px 0 0 0 rgba(0, 0, 0, 1), -8px 0 0 0 rgba(0, 0, 0, 1);\n  color: white;\n  display: inline;\n  font-weight: 400;\n  line-height: 1.23;\n  padding-bottom: 8px;\n  vertical-align: top;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  padding: 4px 8px 8px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  background-color: ", ";\n  color: white;\n  font-size: 20px;\n  font-weight: 600;\n  padding-bottom: 8px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  margin-bottom: 8px;\n  margin-left: -8px;\n  margin-top: -80px;\n  padding-right: 70px;\n  position: relative;\n\n  @media (min-width: 900px) {\n    margin-left: -24px;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background: ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Byline_1 = require("../elements/Byline");

var FillToLine_1 = require("../elements/FillToLine");

var Headline_1 = require("../elements/Headline");

var LineContainer_1 = require("../elements/LineContainer");

var Multiline_1 = require("../elements/Multiline");

var OutieKicker_1 = require("../elements/OutieKicker");

var Standfirst_1 = require("../elements/Standfirst");

var TrailImage_1 = require("../elements/TrailImage");

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Quote_1 = require("../elements/Quote");

var Background = styles_1.styled(helpers_1.div)(_templateObject(), function (theme) {
  return theme.faded;
});
var Popper = styles_1.styled(helpers_1.div)(_templateObject2());
var InterviewKicker = styles_1.styled(OutieKicker_1.OutieKicker)(_templateObject3(), function (theme) {
  return theme.dark;
});
var HeadlineWrapper = styles_1.styled(helpers_1.div)(_templateObject4());
var InterviewHeadline = styles_1.styled(Headline_1.Headline)(_templateObject5());
var InterviewStandfirst = styles_1.styled(Standfirst_1.Standfirst)(_templateObject6(), function (theme) {
  return theme.dark;
});
var StandardByline = styles_1.styled(Byline_1.Byline)(_templateObject7(), function (theme) {
  return theme.dark;
});
var LightByline = styles_1.styled(Byline_1.Byline)(_templateObject8(), function (theme) {
  return theme.main;
});

var InterviewByline = function InterviewByline(lighter) {
  return lighter ? LightByline : StandardByline;
};

var onlyIf = function onlyIf(condition, value) {
  return condition ? value : undefined;
};

var brightColors = {
  BACKGROUND: "#ffe500",
  TEXT: "#000"
};

var InterviewHeader = function InterviewHeader(article) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$brightBg = _ref.brightBg,
      brightBg = _ref$brightBg === void 0 ? true : _ref$brightBg;

  return helpers_1.fragment(Background.style({
    backgroundColor: onlyIf(brightBg, brightColors.BACKGROUND)
  })(TrailImage_1.TrailImage(article.trailImage), LineContainer_1.LineContainer(Popper(InterviewKicker.style({
    color: onlyIf(brightBg, brightColors.TEXT),
    backgroundColor: onlyIf(brightBg, brightColors.BACKGROUND)
  })("Interview"), HeadlineWrapper(InterviewHeadline(Quote_1.Quote({
    color: "white"
  }), article.headline))), InterviewStandfirst.style({
    color: onlyIf(brightBg, brightColors.TEXT)
  })(article.standfirst))), LineContainer_1.LineContainer(FillToLine_1.FillToLine(Multiline_1.Multiline({
    color: "#999"
  })), InterviewByline(brightBg)(article.byline), FillToLine_1.FillToLine(Multiline_1.Multiline({
    color: "#dcdcdc",
    count: 1
  }))));
};

exports.InterviewHeader = InterviewHeader;
},{"../elements/Byline":"elements/Byline.ts","../elements/FillToLine":"elements/FillToLine.ts","../elements/Headline":"elements/Headline.ts","../elements/LineContainer":"elements/LineContainer.ts","../elements/Multiline":"elements/Multiline.ts","../elements/OutieKicker":"elements/OutieKicker.ts","../elements/Standfirst":"elements/Standfirst.ts","../elements/TrailImage":"elements/TrailImage.ts","../helpers":"helpers.ts","../styles":"styles.ts","../elements/Quote":"elements/Quote.ts"}],"elements/Header.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ArticleHeader_1 = require("../headers/ArticleHeader");

var ObitHeader_1 = require("../headers/ObitHeader");

var ImmersiveHeader_1 = require("../headers/ImmersiveHeader");

var AnalysisHeader_1 = require("../headers/AnalysisHeader");

var ReviewHeader_1 = require("../headers/ReviewHeader");

var InterviewHeader_1 = require("../headers/InterviewHeader");

exports.Header = function (article, pillar) {
  switch (article.type) {
    case "default":
      {
        return ArticleHeader_1.ArticleHeader(article);
      }

    case "obit":
      {
        return ObitHeader_1.ObitHeader(article);
      }

    case "longread":
      {
        return ImmersiveHeader_1.ImmersiveHeader(article, {
          backgroundColor: "#000",
          color: "#fff",
          showBottomLine: false
        });
      }

    case "immersive":
      {
        return ImmersiveHeader_1.ImmersiveHeader(article, {
          showKicker: false,
          backgroundColor: "#fff"
        });
      }

    case "analysis":
      {
        return AnalysisHeader_1.AnalysisHeader(article);
      }

    case "opinion":
      {
        return AnalysisHeader_1.AnalysisHeader(article, {
          underline: false,
          quote: true
        });
      }

    case "review":
      {
        return ReviewHeader_1.ReviewHeader(article);
      }

    case "interview":
      {
        return InterviewHeader_1.InterviewHeader(article, {
          brightBg: pillar === "sport"
        });
      }
  }
};
},{"../headers/ArticleHeader":"headers/ArticleHeader.ts","../headers/ObitHeader":"headers/ObitHeader.ts","../headers/ImmersiveHeader":"headers/ImmersiveHeader.ts","../headers/AnalysisHeader":"headers/AnalysisHeader.ts","../headers/ReviewHeader":"headers/ReviewHeader.ts","../headers/InterviewHeader":"headers/InterviewHeader.ts"}],"elements/Pullquote.ts":[function(require,module,exports) {
"use strict";

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  fill: ", ";\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  left: -1px;\n  height: 22px;\n  position: absolute;\n  top: 100%;\n  width: 22px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  border: 1px solid ", ";\n  color: ", ";\n  border-top-width: 12px;\n  padding: 4px 1px 8px 8px;\n  position: relative;\n  line-height: 1.2;\n  margin: 0;\n  margin-bottom: calc(22px + 0.25em);\n  margin-top: 0.25em;\n  font-size: 1.1em;\n  hyphens: auto;\n  z-index: 10000;\n\n  &[data-role=\"supporting\"] {\n    font-family: GT Guardian Titlepiece;\n  }\n\n  &[data-role=\"supporting\"] ", " {\n    color: #111;\n  }\n\n  @media (max-width: 1000px) {\n    &[data-role=\"inline\"],\n    &[data-role=\"supporting\"] {\n      width: 50%;\n      float: left;\n      margin-right: 8px;\n    }\n  }\n\n  @media (min-width: 1000px) {\n    &[data-role=\"inline\"],\n    &[data-role=\"supporting\"] {\n      position: absolute;\n      left: 100%;\n      display: block;\n      width: 180px;\n    }\n  }\n\n  @media (min-width: 1000px) {\n    &[data-role=\"showcase\"] {\n      width: 60%;\n      float: left;\n      margin-right: 8px;\n    }\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  font-style: normal;\n  font-weight: bold;\n  display: block;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var styles_1 = require("../styles");

var Quote_1 = require("./Quote");

var attrib = styles_1.styled(helpers_1.cite)(_templateObject());
var quote = styles_1.styled(helpers_1.blockquote)(_templateObject2(), function (theme) {
  return theme.main;
}, function (theme) {
  return theme.main;
}, attrib);
var tail = styles_1.styled(helpers_1.svg)(_templateObject3());
var line = styles_1.styled(helpers_1.path)(_templateObject4(), function (theme) {
  return theme.main;
});
var Tail = tail.attrs({
  "aria-hidden": true,
  role: "img",
  xmlns: "http://www.w3.org/2000/svg"
})(line.attrs({
  d: "M22.007 0l-.033.53c-.273 4.415-1.877 9.35-4.702 13.22-3.74 5.124-9.301 8.115-16.763 8.246L0 22.005V0h22.007z"
})(), helpers_1.path.attrs({
  d: "M1 0v20.982c6.885-.248 11.992-3.063 15.464-7.822 2.593-3.552 4.12-8.064 4.473-12.16.033-.38.037-.72.063-1H1z",
  fill: "#FFF"
})());

exports.Pullquote = function (_ref) {
  var cite = _ref.cite,
      role = _ref.role,
      attribution = _ref.attribution;
  return quote.attrs({
    "data-role": role
  })(Quote_1.Quote({
    height: "12px"
  }), cite, attribution ? attrib(attribution) : "", Tail);
};
},{"../helpers":"helpers.ts","../styles":"styles.ts","./Quote":"elements/Quote.ts"}],"elements/Article.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../helpers");

var LineContainer_1 = require("./LineContainer");

var HTML_1 = require("./HTML");

var InlineImage_1 = require("./InlineImage");

var Header_1 = require("./Header");

var Pullquote_1 = require("./Pullquote");

var Element = function Element(element) {
  switch (element.type) {
    case "html":
      {
        return HTML_1.HTML(element.html);
      }

    case "image":
      {
        return InlineImage_1.InlineImage(element);
      }

    case "pullquote":
      {
        return Pullquote_1.Pullquote(element);
      }

    default:
      {
        return "";
      }
  }
};

exports.Article = function (article, pillar) {
  return helpers_1.div(Header_1.Header(article, pillar), LineContainer_1.LineContainer.apply(LineContainer_1, _toConsumableArray(article.elements.map(Element))));
};
},{"../helpers":"helpers.ts","./LineContainer":"elements/LineContainer.ts","./HTML":"elements/HTML.ts","./InlineImage":"elements/InlineImage.ts","./Header":"elements/Header.ts","./Pullquote":"elements/Pullquote.ts"}],"model/Article.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var articleTypes = ["default", "obit", "immersive", "longread", "opinion", "analysis", "review", "interview"];
exports.articleTypes = articleTypes;
var exampleArticle = {
  type: "default",
  headline: "Our glorious past is what we remember. The brutality behind it we’ve forgotten",
  trailImage: {
    src: "https://i.guim.co.uk/img/media/cac5909677d47b3edf01bcb258d14c5a1d02643e/0_0_3133_1880/master/3133.jpg?width=1920&quality=85&auto=format&fit=max&s=754916d9fd2135f700ac39dc5edcf35f",
    credit: "Richard Beddington"
  },
  kicker: "Inflatable summer",
  standfirst: "It’s 20 years since George Lucas outraged fans, derailed careers and introduced us to Jar Jar Binks. Is it time to forgive him?",
  byline: "Gary Younge",
  cutout: "https://i.guim.co.uk/img/uploads/2017/10/09/Roy-Greenslade,-R.png?width=300&quality=85&auto=format&fit=max&s=15b48b8e4b6744294489e71d4bfe931f",
  starCount: 4,
  elements: [{
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "image",
    caption: "This is my image it is one of the nicest images in the world",
    src: "https://i.guim.co.uk/img/media/376f51d0a14fa7b1c16d98ae5d6cf48fe6ef48ad/0_0_3600_2160/master/3600.jpg?width=300&quality=85&auto=format&fit=max&s=a9ab6ac4ea8aed40de292647e0bc497f"
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "pullquote",
    role: "supporting",
    attribution: "Rich",
    cite: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "pullquote",
    role: "showcase",
    attribution: "Rich",
    cite: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "pullquote",
    role: "inline",
    attribution: "Rich",
    cite: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }, {
    type: "html",
    html: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
  }]
};
exports.exampleArticle = exampleArticle;
},{}],"model/Pillar.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pillars = ["news", "opinion", "sport", "culture", "lifestyle"];
exports.pillars = pillars;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  *, :before, :after {\n    box-sizing: border-box;\n  }\n\n  html,\n  body {\n    font-family: \"GH Guardian Headline\";\n    margin: 0;\n    padding: 0;\n    -webkit-font-smoothing: antialiased;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Article_1 = require("./elements/Article");

var Article_2 = require("./model/Article");

var Pillar_1 = require("./model/Pillar");

var styles_1 = require("./styles");

var helpers_1 = require("./helpers");

styles_1.injectGlobal(_templateObject());
var root = document.getElementById("root");
if (!root) throw new Error("Can't find root element");

var layout = function layout(type, pillar) {
  return root.innerHTML = styles_1.render(Article_1.Article(Object.assign(Object.assign({}, Article_2.exampleArticle), {
    type: type
  }), pillar), // switch out type here for debugging
  helpers_1.getTheme(pillar));
};

var getArticleType = function getArticleType() {
  var type = window.localStorage.getItem("articleType");
  if (!type || !Article_2.articleTypes.includes(type)) return Article_2.articleTypes[0];
  return type;
};

var getPillar = function getPillar() {
  var pillar = window.localStorage.getItem("pillar");
  if (!pillar) return Pillar_1.pillars[0];
  return pillar;
};

layout(getArticleType(), getPillar());
var buttonContainer = document.getElementById("button-container");
if (!buttonContainer) throw new Error("Can't find button container");
window.addEventListener("scroll", function () {
  window.localStorage.setItem("scrollPos", window.scrollY.toString());
});
Article_2.articleTypes.forEach(function (type) {
  var button = document.createElement("button");
  button.innerHTML = type;
  button.addEventListener("click", function (e) {
    if (!e.target) return;
    layout(type, getPillar());
    window.localStorage.setItem("articleType", type);
  });
  buttonContainer.appendChild(button);
});
Pillar_1.pillars.forEach(function (name) {
  var button = document.createElement("button");
  button.innerHTML = name;
  button.addEventListener("click", function (e) {
    if (!e.target) return;
    layout(getArticleType(), name);
    window.localStorage.setItem("pillar", name);
  });
  buttonContainer.appendChild(button);
});
window.addEventListener("load", function () {
  window.scrollTo({
    top: parseInt(window.localStorage.getItem("scrollPos") || "0", 10)
  });
});
},{"./elements/Article":"elements/Article.ts","./model/Article":"model/Article.ts","./model/Pillar":"model/Pillar.ts","./styles":"styles.ts","./helpers":"helpers.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53822" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/stact.77de5100.js.map