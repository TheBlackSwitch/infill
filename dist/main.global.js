"use strict";
var Infill = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/prismjs/prism.js
  var require_prism = __commonJS({
    "node_modules/prismjs/prism.js"(exports, module) {
      "use strict";
      var _self = typeof window !== "undefined" ? window : typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope ? self : {};
      var Prism3 = (function(_self2) {
        var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
        var uniqueId = 0;
        var plainTextGrammar = {};
        var _ = {
          /**
           * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
           * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
           * additional languages or plugins yourself.
           *
           * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
           *
           * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
           * empty Prism object into the global scope before loading the Prism script like this:
           *
           * ```js
           * window.Prism = window.Prism || {};
           * Prism.manual = true;
           * // add a new <script> to load Prism's script
           * ```
           *
           * @default false
           * @type {boolean}
           * @memberof Prism
           * @public
           */
          manual: _self2.Prism && _self2.Prism.manual,
          /**
           * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
           * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
           * own worker, you don't want it to do this.
           *
           * By setting this value to `true`, Prism will not add its own listeners to the worker.
           *
           * You obviously have to change this value before Prism executes. To do this, you can add an
           * empty Prism object into the global scope before loading the Prism script like this:
           *
           * ```js
           * window.Prism = window.Prism || {};
           * Prism.disableWorkerMessageHandler = true;
           * // Load Prism's script
           * ```
           *
           * @default false
           * @type {boolean}
           * @memberof Prism
           * @public
           */
          disableWorkerMessageHandler: _self2.Prism && _self2.Prism.disableWorkerMessageHandler,
          /**
           * A namespace for utility methods.
           *
           * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
           * change or disappear at any time.
           *
           * @namespace
           * @memberof Prism
           */
          util: {
            encode: function encode(tokens) {
              if (tokens instanceof Token) {
                return new Token(tokens.type, encode(tokens.content), tokens.alias);
              } else if (Array.isArray(tokens)) {
                return tokens.map(encode);
              } else {
                return tokens.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
              }
            },
            /**
             * Returns the name of the type of the given value.
             *
             * @param {any} o
             * @returns {string}
             * @example
             * type(null)      === 'Null'
             * type(undefined) === 'Undefined'
             * type(123)       === 'Number'
             * type('foo')     === 'String'
             * type(true)      === 'Boolean'
             * type([1, 2])    === 'Array'
             * type({})        === 'Object'
             * type(String)    === 'Function'
             * type(/abc+/)    === 'RegExp'
             */
            type: function(o) {
              return Object.prototype.toString.call(o).slice(8, -1);
            },
            /**
             * Returns a unique number for the given object. Later calls will still return the same number.
             *
             * @param {Object} obj
             * @returns {number}
             */
            objId: function(obj) {
              if (!obj["__id"]) {
                Object.defineProperty(obj, "__id", { value: ++uniqueId });
              }
              return obj["__id"];
            },
            /**
             * Creates a deep clone of the given object.
             *
             * The main intended use of this function is to clone language definitions.
             *
             * @param {T} o
             * @param {Record<number, any>} [visited]
             * @returns {T}
             * @template T
             */
            clone: function deepClone(o, visited) {
              visited = visited || {};
              var clone2;
              var id;
              switch (_.util.type(o)) {
                case "Object":
                  id = _.util.objId(o);
                  if (visited[id]) {
                    return visited[id];
                  }
                  clone2 = /** @type {Record<string, any>} */
                  {};
                  visited[id] = clone2;
                  for (var key in o) {
                    if (o.hasOwnProperty(key)) {
                      clone2[key] = deepClone(o[key], visited);
                    }
                  }
                  return (
                    /** @type {any} */
                    clone2
                  );
                case "Array":
                  id = _.util.objId(o);
                  if (visited[id]) {
                    return visited[id];
                  }
                  clone2 = [];
                  visited[id] = clone2;
                  /** @type {Array} */
                  /** @type {any} */
                  o.forEach(function(v, i) {
                    clone2[i] = deepClone(v, visited);
                  });
                  return (
                    /** @type {any} */
                    clone2
                  );
                default:
                  return o;
              }
            },
            /**
             * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
             *
             * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
             *
             * @param {Element} element
             * @returns {string}
             */
            getLanguage: function(element) {
              while (element) {
                var m = lang.exec(element.className);
                if (m) {
                  return m[1].toLowerCase();
                }
                element = element.parentElement;
              }
              return "none";
            },
            /**
             * Sets the Prism `language-xxxx` class of the given element.
             *
             * @param {Element} element
             * @param {string} language
             * @returns {void}
             */
            setLanguage: function(element, language) {
              element.className = element.className.replace(RegExp(lang, "gi"), "");
              element.classList.add("language-" + language);
            },
            /**
             * Returns the script element that is currently executing.
             *
             * This does __not__ work for line script element.
             *
             * @returns {HTMLScriptElement | null}
             */
            currentScript: function() {
              if (typeof document === "undefined") {
                return null;
              }
              if (document.currentScript && document.currentScript.tagName === "SCRIPT" && 1 < 2) {
                return (
                  /** @type {any} */
                  document.currentScript
                );
              }
              try {
                throw new Error();
              } catch (err) {
                var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
                if (src) {
                  var scripts = document.getElementsByTagName("script");
                  for (var i in scripts) {
                    if (scripts[i].src == src) {
                      return scripts[i];
                    }
                  }
                }
                return null;
              }
            },
            /**
             * Returns whether a given class is active for `element`.
             *
             * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
             * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
             * given class is just the given class with a `no-` prefix.
             *
             * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
             * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
             * ancestors have the given class or the negated version of it, then the default activation will be returned.
             *
             * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
             * version of it, the class is considered active.
             *
             * @param {Element} element
             * @param {string} className
             * @param {boolean} [defaultActivation=false]
             * @returns {boolean}
             */
            isActive: function(element, className, defaultActivation) {
              var no = "no-" + className;
              while (element) {
                var classList = element.classList;
                if (classList.contains(className)) {
                  return true;
                }
                if (classList.contains(no)) {
                  return false;
                }
                element = element.parentElement;
              }
              return !!defaultActivation;
            }
          },
          /**
           * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
           *
           * @namespace
           * @memberof Prism
           * @public
           */
          languages: {
            /**
             * The grammar for plain, unformatted text.
             */
            plain: plainTextGrammar,
            plaintext: plainTextGrammar,
            text: plainTextGrammar,
            txt: plainTextGrammar,
            /**
             * Creates a deep copy of the language with the given id and appends the given tokens.
             *
             * If a token in `redef` also appears in the copied language, then the existing token in the copied language
             * will be overwritten at its original position.
             *
             * ## Best practices
             *
             * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
             * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
             * understand the language definition because, normally, the order of tokens matters in Prism grammars.
             *
             * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
             * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
             *
             * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
             * @param {Grammar} redef The new tokens to append.
             * @returns {Grammar} The new language created.
             * @public
             * @example
             * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
             *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
             *     // at its original position
             *     'comment': { ... },
             *     // CSS doesn't have a 'color' token, so this token will be appended
             *     'color': /\b(?:red|green|blue)\b/
             * });
             */
            extend: function(id, redef) {
              var lang2 = _.util.clone(_.languages[id]);
              for (var key in redef) {
                lang2[key] = redef[key];
              }
              return lang2;
            },
            /**
             * Inserts tokens _before_ another token in a language definition or any other grammar.
             *
             * ## Usage
             *
             * This helper method makes it easy to modify existing languages. For example, the CSS language definition
             * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
             * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
             * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
             * this:
             *
             * ```js
             * Prism.languages.markup.style = {
             *     // token
             * };
             * ```
             *
             * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
             * before existing tokens. For the CSS example above, you would use it like this:
             *
             * ```js
             * Prism.languages.insertBefore('markup', 'cdata', {
             *     'style': {
             *         // token
             *     }
             * });
             * ```
             *
             * ## Special cases
             *
             * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
             * will be ignored.
             *
             * This behavior can be used to insert tokens after `before`:
             *
             * ```js
             * Prism.languages.insertBefore('markup', 'comment', {
             *     'comment': Prism.languages.markup.comment,
             *     // tokens after 'comment'
             * });
             * ```
             *
             * ## Limitations
             *
             * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
             * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
             * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
             * deleting properties which is necessary to insert at arbitrary positions.
             *
             * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
             * Instead, it will create a new object and replace all references to the target object with the new one. This
             * can be done without temporarily deleting properties, so the iteration order is well-defined.
             *
             * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
             * you hold the target object in a variable, then the value of the variable will not change.
             *
             * ```js
             * var oldMarkup = Prism.languages.markup;
             * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
             *
             * assert(oldMarkup !== Prism.languages.markup);
             * assert(newMarkup === Prism.languages.markup);
             * ```
             *
             * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
             * object to be modified.
             * @param {string} before The key to insert before.
             * @param {Grammar} insert An object containing the key-value pairs to be inserted.
             * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
             * object to be modified.
             *
             * Defaults to `Prism.languages`.
             * @returns {Grammar} The new grammar object.
             * @public
             */
            insertBefore: function(inside, before, insert, root) {
              root = root || /** @type {any} */
              _.languages;
              var grammar = root[inside];
              var ret = {};
              for (var token in grammar) {
                if (grammar.hasOwnProperty(token)) {
                  if (token == before) {
                    for (var newToken in insert) {
                      if (insert.hasOwnProperty(newToken)) {
                        ret[newToken] = insert[newToken];
                      }
                    }
                  }
                  if (!insert.hasOwnProperty(token)) {
                    ret[token] = grammar[token];
                  }
                }
              }
              var old = root[inside];
              root[inside] = ret;
              _.languages.DFS(_.languages, function(key, value) {
                if (value === old && key != inside) {
                  this[key] = ret;
                }
              });
              return ret;
            },
            // Traverse a language definition with Depth First Search
            DFS: function DFS(o, callback, type, visited) {
              visited = visited || {};
              var objId = _.util.objId;
              for (var i in o) {
                if (o.hasOwnProperty(i)) {
                  callback.call(o, i, o[i], type || i);
                  var property = o[i];
                  var propertyType = _.util.type(property);
                  if (propertyType === "Object" && !visited[objId(property)]) {
                    visited[objId(property)] = true;
                    DFS(property, callback, null, visited);
                  } else if (propertyType === "Array" && !visited[objId(property)]) {
                    visited[objId(property)] = true;
                    DFS(property, callback, i, visited);
                  }
                }
              }
            }
          },
          plugins: {},
          /**
           * This is the most high-level function in Prism’s API.
           * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
           * each one of them.
           *
           * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
           *
           * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
           * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
           * @memberof Prism
           * @public
           */
          highlightAll: function(async, callback) {
            _.highlightAllUnder(document, async, callback);
          },
          /**
           * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
           * {@link Prism.highlightElement} on each one of them.
           *
           * The following hooks will be run:
           * 1. `before-highlightall`
           * 2. `before-all-elements-highlight`
           * 3. All hooks of {@link Prism.highlightElement} for each element.
           *
           * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
           * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
           * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
           * @memberof Prism
           * @public
           */
          highlightAllUnder: function(container, async, callback) {
            var env = {
              callback,
              container,
              selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            _.hooks.run("before-highlightall", env);
            env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));
            _.hooks.run("before-all-elements-highlight", env);
            for (var i = 0, element; element = env.elements[i++]; ) {
              _.highlightElement(element, async === true, env.callback);
            }
          },
          /**
           * Highlights the code inside a single element.
           *
           * The following hooks will be run:
           * 1. `before-sanity-check`
           * 2. `before-highlight`
           * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
           * 4. `before-insert`
           * 5. `after-highlight`
           * 6. `complete`
           *
           * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
           * the element's language.
           *
           * @param {Element} element The element containing the code.
           * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
           * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
           * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
           * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
           *
           * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
           * asynchronous highlighting to work. You can build your own bundle on the
           * [Download page](https://prismjs.com/download.html).
           * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
           * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
           * @memberof Prism
           * @public
           */
          highlightElement: function(element, async, callback) {
            var language = _.util.getLanguage(element);
            var grammar = _.languages[language];
            _.util.setLanguage(element, language);
            var parent = element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === "pre") {
              _.util.setLanguage(parent, language);
            }
            var code = element.textContent;
            var env = {
              element,
              language,
              grammar,
              code
            };
            function insertHighlightedCode(highlightedCode) {
              env.highlightedCode = highlightedCode;
              _.hooks.run("before-insert", env);
              env.element.innerHTML = env.highlightedCode;
              _.hooks.run("after-highlight", env);
              _.hooks.run("complete", env);
              callback && callback.call(env.element);
            }
            _.hooks.run("before-sanity-check", env);
            parent = env.element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === "pre" && !parent.hasAttribute("tabindex")) {
              parent.setAttribute("tabindex", "0");
            }
            if (!env.code) {
              _.hooks.run("complete", env);
              callback && callback.call(env.element);
              return;
            }
            _.hooks.run("before-highlight", env);
            if (!env.grammar) {
              insertHighlightedCode(_.util.encode(env.code));
              return;
            }
            if (async && _self2.Worker) {
              var worker = new Worker(_.filename);
              worker.onmessage = function(evt) {
                insertHighlightedCode(evt.data);
              };
              worker.postMessage(JSON.stringify({
                language: env.language,
                code: env.code,
                immediateClose: true
              }));
            } else {
              insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
            }
          },
          /**
           * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
           * and the language definitions to use, and returns a string with the HTML produced.
           *
           * The following hooks will be run:
           * 1. `before-tokenize`
           * 2. `after-tokenize`
           * 3. `wrap`: On each {@link Token}.
           *
           * @param {string} text A string with the code to be highlighted.
           * @param {Grammar} grammar An object containing the tokens to use.
           *
           * Usually a language definition like `Prism.languages.markup`.
           * @param {string} language The name of the language definition passed to `grammar`.
           * @returns {string} The highlighted HTML.
           * @memberof Prism
           * @public
           * @example
           * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
           */
          highlight: function(text2, grammar, language) {
            var env = {
              code: text2,
              grammar,
              language
            };
            _.hooks.run("before-tokenize", env);
            if (!env.grammar) {
              throw new Error('The language "' + env.language + '" has no grammar.');
            }
            env.tokens = _.tokenize(env.code, env.grammar);
            _.hooks.run("after-tokenize", env);
            return Token.stringify(_.util.encode(env.tokens), env.language);
          },
          /**
           * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
           * and the language definitions to use, and returns an array with the tokenized code.
           *
           * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
           *
           * This method could be useful in other contexts as well, as a very crude parser.
           *
           * @param {string} text A string with the code to be highlighted.
           * @param {Grammar} grammar An object containing the tokens to use.
           *
           * Usually a language definition like `Prism.languages.markup`.
           * @returns {TokenStream} An array of strings and tokens, a token stream.
           * @memberof Prism
           * @public
           * @example
           * let code = `var foo = 0;`;
           * let tokens = Prism.tokenize(code, Prism.languages.javascript);
           * tokens.forEach(token => {
           *     if (token instanceof Prism.Token && token.type === 'number') {
           *         console.log(`Found numeric literal: ${token.content}`);
           *     }
           * });
           */
          tokenize: function(text2, grammar) {
            var rest = grammar.rest;
            if (rest) {
              for (var token in rest) {
                grammar[token] = rest[token];
              }
              delete grammar.rest;
            }
            var tokenList = new LinkedList();
            addAfter(tokenList, tokenList.head, text2);
            matchGrammar(text2, tokenList, grammar, tokenList.head, 0);
            return toArray(tokenList);
          },
          /**
           * @namespace
           * @memberof Prism
           * @public
           */
          hooks: {
            all: {},
            /**
             * Adds the given callback to the list of callbacks for the given hook.
             *
             * The callback will be invoked when the hook it is registered for is run.
             * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
             *
             * One callback function can be registered to multiple hooks and the same hook multiple times.
             *
             * @param {string} name The name of the hook.
             * @param {HookCallback} callback The callback function which is given environment variables.
             * @public
             */
            add: function(name, callback) {
              var hooks = _.hooks.all;
              hooks[name] = hooks[name] || [];
              hooks[name].push(callback);
            },
            /**
             * Runs a hook invoking all registered callbacks with the given environment variables.
             *
             * Callbacks will be invoked synchronously and in the order in which they were registered.
             *
             * @param {string} name The name of the hook.
             * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
             * @public
             */
            run: function(name, env) {
              var callbacks = _.hooks.all[name];
              if (!callbacks || !callbacks.length) {
                return;
              }
              for (var i = 0, callback; callback = callbacks[i++]; ) {
                callback(env);
              }
            }
          },
          Token
        };
        _self2.Prism = _;
        function Token(type, content, alias, matchedStr) {
          this.type = type;
          this.content = content;
          this.alias = alias;
          this.length = (matchedStr || "").length | 0;
        }
        Token.stringify = function stringify(o, language) {
          if (typeof o == "string") {
            return o;
          }
          if (Array.isArray(o)) {
            var s = "";
            o.forEach(function(e) {
              s += stringify(e, language);
            });
            return s;
          }
          var env = {
            type: o.type,
            content: stringify(o.content, language),
            tag: "span",
            classes: ["token", o.type],
            attributes: {},
            language
          };
          var aliases = o.alias;
          if (aliases) {
            if (Array.isArray(aliases)) {
              Array.prototype.push.apply(env.classes, aliases);
            } else {
              env.classes.push(aliases);
            }
          }
          _.hooks.run("wrap", env);
          var attributes = "";
          for (var name in env.attributes) {
            attributes += " " + name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"';
          }
          return "<" + env.tag + ' class="' + env.classes.join(" ") + '"' + attributes + ">" + env.content + "</" + env.tag + ">";
        };
        function matchPattern(pattern, pos, text2, lookbehind) {
          pattern.lastIndex = pos;
          var match = pattern.exec(text2);
          if (match && lookbehind && match[1]) {
            var lookbehindLength = match[1].length;
            match.index += lookbehindLength;
            match[0] = match[0].slice(lookbehindLength);
          }
          return match;
        }
        function matchGrammar(text2, tokenList, grammar, startNode, startPos, rematch) {
          for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
              continue;
            }
            var patterns = grammar[token];
            patterns = Array.isArray(patterns) ? patterns : [patterns];
            for (var j = 0; j < patterns.length; ++j) {
              if (rematch && rematch.cause == token + "," + j) {
                return;
              }
              var patternObj = patterns[j];
              var inside = patternObj.inside;
              var lookbehind = !!patternObj.lookbehind;
              var greedy = !!patternObj.greedy;
              var alias = patternObj.alias;
              if (greedy && !patternObj.pattern.global) {
                var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
                patternObj.pattern = RegExp(patternObj.pattern.source, flags + "g");
              }
              var pattern = patternObj.pattern || patternObj;
              for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
                if (rematch && pos >= rematch.reach) {
                  break;
                }
                var str = currentNode.value;
                if (tokenList.length > text2.length) {
                  return;
                }
                if (str instanceof Token) {
                  continue;
                }
                var removeCount = 1;
                var match;
                if (greedy) {
                  match = matchPattern(pattern, pos, text2, lookbehind);
                  if (!match || match.index >= text2.length) {
                    break;
                  }
                  var from = match.index;
                  var to = match.index + match[0].length;
                  var p = pos;
                  p += currentNode.value.length;
                  while (from >= p) {
                    currentNode = currentNode.next;
                    p += currentNode.value.length;
                  }
                  p -= currentNode.value.length;
                  pos = p;
                  if (currentNode.value instanceof Token) {
                    continue;
                  }
                  for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === "string"); k = k.next) {
                    removeCount++;
                    p += k.value.length;
                  }
                  removeCount--;
                  str = text2.slice(pos, p);
                  match.index -= pos;
                } else {
                  match = matchPattern(pattern, 0, str, lookbehind);
                  if (!match) {
                    continue;
                  }
                }
                var from = match.index;
                var matchStr = match[0];
                var before = str.slice(0, from);
                var after = str.slice(from + matchStr.length);
                var reach = pos + str.length;
                if (rematch && reach > rematch.reach) {
                  rematch.reach = reach;
                }
                var removeFrom = currentNode.prev;
                if (before) {
                  removeFrom = addAfter(tokenList, removeFrom, before);
                  pos += before.length;
                }
                removeRange(tokenList, removeFrom, removeCount);
                var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
                currentNode = addAfter(tokenList, removeFrom, wrapped);
                if (after) {
                  addAfter(tokenList, currentNode, after);
                }
                if (removeCount > 1) {
                  var nestedRematch = {
                    cause: token + "," + j,
                    reach
                  };
                  matchGrammar(text2, tokenList, grammar, currentNode.prev, pos, nestedRematch);
                  if (rematch && nestedRematch.reach > rematch.reach) {
                    rematch.reach = nestedRematch.reach;
                  }
                }
              }
            }
          }
        }
        function LinkedList() {
          var head = { value: null, prev: null, next: null };
          var tail = { value: null, prev: head, next: null };
          head.next = tail;
          this.head = head;
          this.tail = tail;
          this.length = 0;
        }
        function addAfter(list, node, value) {
          var next = node.next;
          var newNode = { value, prev: node, next };
          node.next = newNode;
          next.prev = newNode;
          list.length++;
          return newNode;
        }
        function removeRange(list, node, count) {
          var next = node.next;
          for (var i = 0; i < count && next !== list.tail; i++) {
            next = next.next;
          }
          node.next = next;
          next.prev = node;
          list.length -= i;
        }
        function toArray(list) {
          var array = [];
          var node = list.head.next;
          while (node !== list.tail) {
            array.push(node.value);
            node = node.next;
          }
          return array;
        }
        if (!_self2.document) {
          if (!_self2.addEventListener) {
            return _;
          }
          if (!_.disableWorkerMessageHandler) {
            _self2.addEventListener("message", function(evt) {
              var message = JSON.parse(evt.data);
              var lang2 = message.language;
              var code = message.code;
              var immediateClose = message.immediateClose;
              _self2.postMessage(_.highlight(code, _.languages[lang2], lang2));
              if (immediateClose) {
                _self2.close();
              }
            }, false);
          }
          return _;
        }
        var script = _.util.currentScript();
        if (script) {
          _.filename = script.src;
          if (script.hasAttribute("data-manual")) {
            _.manual = true;
          }
        }
        function highlightAutomaticallyCallback() {
          if (!_.manual) {
            _.highlightAll();
          }
        }
        if (!_.manual) {
          var readyState = document.readyState;
          if (readyState === "loading" || readyState === "interactive" && script && script.defer) {
            document.addEventListener("DOMContentLoaded", highlightAutomaticallyCallback);
          } else {
            if (window.requestAnimationFrame) {
              window.requestAnimationFrame(highlightAutomaticallyCallback);
            } else {
              window.setTimeout(highlightAutomaticallyCallback, 16);
            }
          }
        }
        return _;
      })(_self);
      if (typeof module !== "undefined" && module.exports) {
        module.exports = Prism3;
      }
      if (typeof global !== "undefined") {
        global.Prism = Prism3;
      }
      Prism3.languages.markup = {
        "comment": {
          pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
          greedy: true
        },
        "prolog": {
          pattern: /<\?[\s\S]+?\?>/,
          greedy: true
        },
        "doctype": {
          // https://www.w3.org/TR/xml/#NT-doctypedecl
          pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
          greedy: true,
          inside: {
            "internal-subset": {
              pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
              lookbehind: true,
              greedy: true,
              inside: null
              // see below
            },
            "string": {
              pattern: /"[^"]*"|'[^']*'/,
              greedy: true
            },
            "punctuation": /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/i,
            "name": /[^\s<>'"]+/
          }
        },
        "cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          greedy: true
        },
        "tag": {
          pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
          greedy: true,
          inside: {
            "tag": {
              pattern: /^<\/?[^\s>\/]+/,
              inside: {
                "punctuation": /^<\/?/,
                "namespace": /^[^\s>\/:]+:/
              }
            },
            "special-attr": [],
            "attr-value": {
              pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
              inside: {
                "punctuation": [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  {
                    pattern: /^(\s*)["']|["']$/,
                    lookbehind: true
                  }
                ]
              }
            },
            "punctuation": /\/?>/,
            "attr-name": {
              pattern: /[^\s>\/]+/,
              inside: {
                "namespace": /^[^\s>\/:]+:/
              }
            }
          }
        },
        "entity": [
          {
            pattern: /&[\da-z]{1,8};/i,
            alias: "named-entity"
          },
          /&#x?[\da-f]{1,8};/i
        ]
      };
      Prism3.languages.markup["tag"].inside["attr-value"].inside["entity"] = Prism3.languages.markup["entity"];
      Prism3.languages.markup["doctype"].inside["internal-subset"].inside = Prism3.languages.markup;
      Prism3.hooks.add("wrap", function(env) {
        if (env.type === "entity") {
          env.attributes["title"] = env.content.replace(/&amp;/, "&");
        }
      });
      Object.defineProperty(Prism3.languages.markup.tag, "addInlined", {
        /**
         * Adds an inlined language to markup.
         *
         * An example of an inlined language is CSS with `<style>` tags.
         *
         * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addInlined('style', 'css');
         */
        value: function addInlined(tagName, lang) {
          var includedCdataInside = {};
          includedCdataInside["language-" + lang] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: true,
            inside: Prism3.languages[lang]
          };
          includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;
          var inside = {
            "included-cdata": {
              pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
              inside: includedCdataInside
            }
          };
          inside["language-" + lang] = {
            pattern: /[\s\S]+/,
            inside: Prism3.languages[lang]
          };
          var def = {};
          def[tagName] = {
            pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
              return tagName;
            }), "i"),
            lookbehind: true,
            greedy: true,
            inside
          };
          Prism3.languages.insertBefore("markup", "cdata", def);
        }
      });
      Object.defineProperty(Prism3.languages.markup.tag, "addAttribute", {
        /**
         * Adds an pattern to highlight languages embedded in HTML attributes.
         *
         * An example of an inlined language is CSS with `style` attributes.
         *
         * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addAttribute('style', 'css');
         */
        value: function(attrName, lang) {
          Prism3.languages.markup.tag.inside["special-attr"].push({
            pattern: RegExp(
              /(^|["'\s])/.source + "(?:" + attrName + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
              "i"
            ),
            lookbehind: true,
            inside: {
              "attr-name": /^[^\s=]+/,
              "attr-value": {
                pattern: /=[\s\S]+/,
                inside: {
                  "value": {
                    pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                    lookbehind: true,
                    alias: [lang, "language-" + lang],
                    inside: Prism3.languages[lang]
                  },
                  "punctuation": [
                    {
                      pattern: /^=/,
                      alias: "attr-equals"
                    },
                    /"|'/
                  ]
                }
              }
            }
          });
        }
      });
      Prism3.languages.html = Prism3.languages.markup;
      Prism3.languages.mathml = Prism3.languages.markup;
      Prism3.languages.svg = Prism3.languages.markup;
      Prism3.languages.xml = Prism3.languages.extend("markup", {});
      Prism3.languages.ssml = Prism3.languages.xml;
      Prism3.languages.atom = Prism3.languages.xml;
      Prism3.languages.rss = Prism3.languages.xml;
      (function(Prism4) {
        var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
        Prism4.languages.css = {
          "comment": /\/\*[\s\S]*?\*\//,
          "atrule": {
            pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + string.source + ")*?" + /(?:;|(?=\s*\{))/.source),
            inside: {
              "rule": /^@[\w-]+/,
              "selector-function-argument": {
                pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                lookbehind: true,
                alias: "selector"
              },
              "keyword": {
                pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                lookbehind: true
              }
              // See rest below
            }
          },
          "url": {
            // https://drafts.csswg.org/css-values-3/#urls
            pattern: RegExp("\\burl\\((?:" + string.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
            greedy: true,
            inside: {
              "function": /^url/i,
              "punctuation": /^\(|\)$/,
              "string": {
                pattern: RegExp("^" + string.source + "$"),
                alias: "url"
              }
            }
          },
          "selector": {
            pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + string.source + ")*(?=\\s*\\{)"),
            lookbehind: true
          },
          "string": {
            pattern: string,
            greedy: true
          },
          "property": {
            pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
            lookbehind: true
          },
          "important": /!important\b/i,
          "function": {
            pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
            lookbehind: true
          },
          "punctuation": /[(){};:,]/
        };
        Prism4.languages.css["atrule"].inside.rest = Prism4.languages.css;
        var markup = Prism4.languages.markup;
        if (markup) {
          markup.tag.addInlined("style", "css");
          markup.tag.addAttribute("style", "css");
        }
      })(Prism3);
      Prism3.languages.clike = {
        "comment": [
          {
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: true,
            greedy: true
          },
          {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true,
            greedy: true
          }
        ],
        "string": {
          pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
          greedy: true
        },
        "class-name": {
          pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
          lookbehind: true,
          inside: {
            "punctuation": /[.\\]/
          }
        },
        "keyword": /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
        "boolean": /\b(?:false|true)\b/,
        "function": /\b\w+(?=\()/,
        "number": /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
        "operator": /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        "punctuation": /[{}[\];(),.:]/
      };
      Prism3.languages.javascript = Prism3.languages.extend("clike", {
        "class-name": [
          Prism3.languages.clike["class-name"],
          {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
            lookbehind: true
          }
        ],
        "keyword": [
          {
            pattern: /((?:^|\})\s*)catch\b/,
            lookbehind: true
          },
          {
            pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: true
          }
        ],
        // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
        "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        "number": {
          pattern: RegExp(
            /(^|[^\w$])/.source + "(?:" + // constant
            (/NaN|Infinity/.source + "|" + // binary integer
            /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
            /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
            /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
            /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
            /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
          ),
          lookbehind: true
        },
        "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
      });
      Prism3.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
      Prism3.languages.insertBefore("javascript", "keyword", {
        "regex": {
          pattern: RegExp(
            // lookbehind
            // eslint-disable-next-line regexp/no-dupe-characters-character-class
            /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
            // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
            // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
            // with the only syntax, so we have to define 2 different regex patterns.
            /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
            /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
            /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
          ),
          lookbehind: true,
          greedy: true,
          inside: {
            "regex-source": {
              pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
              lookbehind: true,
              alias: "language-regex",
              inside: Prism3.languages.regex
            },
            "regex-delimiter": /^\/|\/$/,
            "regex-flags": /^[a-z]+$/
          }
        },
        // This must be declared before keyword because we use "function" inside the look-forward
        "function-variable": {
          pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
          alias: "function"
        },
        "parameter": [
          {
            pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          }
        ],
        "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
      });
      Prism3.languages.insertBefore("javascript", "string", {
        "hashbang": {
          pattern: /^#!.*/,
          greedy: true,
          alias: "comment"
        },
        "template-string": {
          pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
          greedy: true,
          inside: {
            "template-punctuation": {
              pattern: /^`|`$/,
              alias: "string"
            },
            "interpolation": {
              pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
              lookbehind: true,
              inside: {
                "interpolation-punctuation": {
                  pattern: /^\$\{|\}$/,
                  alias: "punctuation"
                },
                rest: Prism3.languages.javascript
              }
            },
            "string": /[\s\S]+/
          }
        },
        "string-property": {
          pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
          lookbehind: true,
          greedy: true,
          alias: "property"
        }
      });
      Prism3.languages.insertBefore("javascript", "operator", {
        "literal-property": {
          pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
          lookbehind: true,
          alias: "property"
        }
      });
      if (Prism3.languages.markup) {
        Prism3.languages.markup.tag.addInlined("script", "javascript");
        Prism3.languages.markup.tag.addAttribute(
          /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
          "javascript"
        );
      }
      Prism3.languages.js = Prism3.languages.javascript;
      (function() {
        if (typeof Prism3 === "undefined" || typeof document === "undefined") {
          return;
        }
        if (!Element.prototype.matches) {
          Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }
        var LOADING_MESSAGE = "Loading\u2026";
        var FAILURE_MESSAGE = function(status, message) {
          return "\u2716 Error " + status + " while fetching file: " + message;
        };
        var FAILURE_EMPTY_MESSAGE = "\u2716 Error: File does not exist or is empty";
        var EXTENSIONS = {
          "js": "javascript",
          "py": "python",
          "rb": "ruby",
          "ps1": "powershell",
          "psm1": "powershell",
          "sh": "bash",
          "bat": "batch",
          "h": "c",
          "tex": "latex"
        };
        var STATUS_ATTR = "data-src-status";
        var STATUS_LOADING = "loading";
        var STATUS_LOADED = "loaded";
        var STATUS_FAILED = "failed";
        var SELECTOR = "pre[data-src]:not([" + STATUS_ATTR + '="' + STATUS_LOADED + '"]):not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';
        function loadFile(src, success, error) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", src, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              if (xhr.status < 400 && xhr.responseText) {
                success(xhr.responseText);
              } else {
                if (xhr.status >= 400) {
                  error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
                } else {
                  error(FAILURE_EMPTY_MESSAGE);
                }
              }
            }
          };
          xhr.send(null);
        }
        function parseRange(range) {
          var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || "");
          if (m) {
            var start = Number(m[1]);
            var comma = m[2];
            var end = m[3];
            if (!comma) {
              return [start, start];
            }
            if (!end) {
              return [start, void 0];
            }
            return [start, Number(end)];
          }
          return void 0;
        }
        Prism3.hooks.add("before-highlightall", function(env) {
          env.selector += ", " + SELECTOR;
        });
        Prism3.hooks.add("before-sanity-check", function(env) {
          var pre = (
            /** @type {HTMLPreElement} */
            env.element
          );
          if (pre.matches(SELECTOR)) {
            env.code = "";
            pre.setAttribute(STATUS_ATTR, STATUS_LOADING);
            var code = pre.appendChild(document.createElement("CODE"));
            code.textContent = LOADING_MESSAGE;
            var src = pre.getAttribute("data-src");
            var language = env.language;
            if (language === "none") {
              var extension = (/\.(\w+)$/.exec(src) || [, "none"])[1];
              language = EXTENSIONS[extension] || extension;
            }
            Prism3.util.setLanguage(code, language);
            Prism3.util.setLanguage(pre, language);
            var autoloader = Prism3.plugins.autoloader;
            if (autoloader) {
              autoloader.loadLanguages(language);
            }
            loadFile(
              src,
              function(text2) {
                pre.setAttribute(STATUS_ATTR, STATUS_LOADED);
                var range = parseRange(pre.getAttribute("data-range"));
                if (range) {
                  var lines = text2.split(/\r\n?|\n/g);
                  var start = range[0];
                  var end = range[1] == null ? lines.length : range[1];
                  if (start < 0) {
                    start += lines.length;
                  }
                  start = Math.max(0, Math.min(start - 1, lines.length));
                  if (end < 0) {
                    end += lines.length;
                  }
                  end = Math.max(0, Math.min(end, lines.length));
                  text2 = lines.slice(start, end).join("\n");
                  if (!pre.hasAttribute("data-start")) {
                    pre.setAttribute("data-start", String(start + 1));
                  }
                }
                code.textContent = text2;
                Prism3.highlightElement(code);
              },
              function(error) {
                pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
                code.textContent = error;
              }
            );
          }
        });
        Prism3.plugins.fileHighlight = {
          /**
           * Executes the File Highlight plugin for all matching `pre` elements under the given container.
           *
           * Note: Elements which are already loaded or currently loading will not be touched by this method.
           *
           * @param {ParentNode} [container=document]
           */
          highlight: function highlight(container) {
            var elements = (container || document).querySelectorAll(SELECTOR);
            for (var i = 0, element; element = elements[i++]; ) {
              Prism3.highlightElement(element);
            }
          }
        };
        var logged = false;
        Prism3.fileHighlight = function() {
          if (!logged) {
            console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.");
            logged = true;
          }
          Prism3.plugins.fileHighlight.highlight.apply(this, arguments);
        };
      })();
    }
  });

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    Editor: () => Editor,
    default_options: () => default_options2
  });

  // src/utils.ts
  function download_file(data, filename, type) {
    var file = new Blob([data], { type });
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      var a = document.createElement("a"), url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
  function cursor_pos_from_point(root_element, x, y) {
    let carret_node;
    let local_offset = 0;
    if (typeof document.caretPositionFromPoint === "function") {
      let carret_position = document.caretPositionFromPoint(x, y);
      if (!carret_position) return null;
      carret_node = carret_position.offsetNode;
      local_offset = carret_position.offset;
    } else if (typeof document.caretRangeFromPoint === "function") {
      let carret_position = document.caretRangeFromPoint(x, y);
      if (!carret_position) return null;
      carret_node = carret_position.startContainer;
      local_offset = carret_position.startOffset;
    } else {
      console.warn("You're using an older browser, selecting in the editor is not supported here!");
      return null;
    }
    const walker = document.createTreeWalker(root_element, NodeFilter.SHOW_ALL);
    let offset = 0;
    while (true) {
      let node = walker.nextNode();
      if (!node) return null;
      if (node.nodeType === Node.TEXT_NODE) {
        if (carret_node === node) {
          offset += local_offset;
          break;
        }
        if (node.textContent) offset += node.textContent.length;
      }
    }
    return {
      "global": offset,
      "local": local_offset
    };
  }
  function log_string(value) {
    const div = document.createElement("div");
    try {
      div.textContent = JSON.stringify(value);
    } catch {
      div.textContent = value;
    }
    const logs = document.getElementById("logs");
    logs?.prepend(div);
  }

  // node_modules/@theblackswitch/yamp/dist/main.js
  var StringHelper = class {
    static CHAR_CODE = {
      "newline": 10
    };
    static is_whitespace(c) {
      switch (c) {
        case " ":
        case "	":
        case "\n":
        case "\r":
        case "\v":
        case "\f":
        case "\xA0":
          return true;
        default:
          return false;
      }
    }
    static is_valid_char(c) {
      if (c.length !== 1) return false;
      const code = c.codePointAt(0);
      if (!code) return false;
      return code >= 32 && // No control chars
      code !== 127 && // DEL
      !this.is_whitespace(c) && !(code >= 57344 && code <= 63743 || // No private use area
      code >= 983040 && code <= 1048573 || code >= 1048576 && code <= 1114109);
    }
    static is_text_char(c) {
      if (c.length !== 1) return false;
      const code = c.charCodeAt(0);
      return code >= 48 && code <= 57 || // 0-9
      code >= 65 && code <= 90 || // A-Z
      code >= 97 && code <= 122;
    }
    static is_number(c) {
      if (c.length !== 1) return false;
      switch (c) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          return true;
        default:
          return false;
      }
    }
    static insert_substring(string, start_pos, length, insert) {
      return string.slice(0, start_pos) + insert + string.slice(start_pos + length);
    }
    static turn_into_ascii(input) {
      let out = "";
      for (let i = 0; i < input.length; i++) {
        let c = input.charAt(i);
        if (this.is_text_char(c)) {
          out += c;
        } else if (c === " ") {
          out += "-";
        }
      }
      return out.toLowerCase();
    }
  };
  var CharMap = class _CharMap {
    width_map;
    que = [];
    // -------------------------------
    //  Constructors                            
    // -------------------------------
    constructor(width_map) {
      this.width_map = width_map;
    }
    static from_cache(lines, cached) {
      let width_map = new Array(lines.length);
      for (let line_idx = 0; line_idx < lines.length; line_idx++) {
        let curr_map;
        if (!cached.char_map[line_idx]) {
          const len = lines[line_idx]?.length;
          curr_map = new Array(len);
          curr_map.fill(0);
        } else {
          curr_map = cached.char_map[line_idx];
        }
        width_map[line_idx] = curr_map;
      }
      return new _CharMap(width_map);
    }
    // -------------------------------
    //  Que handlers                            
    // -------------------------------
    // Append a discard to the que
    que_discard_event(line_idx, start, count) {
      if (count < 1) return;
      this.que.push({
        "type": "discard",
        "line_idx": line_idx,
        "start": start,
        "count": count
      });
    }
    que_extend_event(line_idx, target_idx, amount) {
      if (amount === 0) return;
      this.que.push({
        "type": "extend",
        "line_idx": line_idx,
        "target_idx": target_idx,
        "amount": amount
      });
    }
    // cancel the discard que
    cancel_que() {
      this.que = [];
    }
    // Apply all changes from the que
    apply_que() {
      for (const event of this.que) {
        if (event.type === "discard") {
          this.discard_immediately(event.line_idx, event.start, event.count);
        } else if (event.type === "extend") {
          this.extend_immediately(event.line_idx, event.target_idx, event.amount);
        }
      }
    }
    // -------------------------------
    //  Instant modifiers                            
    // -------------------------------
    // Set a character to have a width of 0
    discard_immediately(line_idx, start, count) {
      for (let i = 0; i < count; i++) {
        const result = this.#wrap_idx(i + start, line_idx);
        if (result.curr_map !== void 0) result.curr_map[result.idx] = 255;
      }
    }
    // Increase the width of a character
    extend_immediately(line_idx, target_idx, amount) {
      const result = this.#wrap_idx(target_idx, line_idx);
      const final_idx = result.idx;
      if (result.curr_map[final_idx] !== void 0 && result.curr_map[final_idx] + amount >= 255) {
        throw Error("Failed to extend charmap, trying to extend width map beyond 254-width limit!");
      }
      if (result.curr_map[final_idx] !== void 0) result.curr_map[final_idx] += amount;
    }
    // When an index is out of range of the current line, wrap to the next line
    #wrap_idx(idx, line) {
      let final_idx = idx;
      let final_line_idx = line;
      let curr_map = this.width_map[final_line_idx];
      while (curr_map !== void 0 && final_idx > curr_map.length - 1) {
        final_idx -= curr_map.length;
        final_line_idx++;
        curr_map = this.width_map[final_line_idx];
      }
      if (curr_map === void 0) throw Error("Failed to discard charmap char. Array index out of range!");
      return { "idx": final_idx, "line": final_line_idx, "curr_map": curr_map };
    }
    // -------------------------------
    //  Getters                            
    // -------------------------------
    get_copy() {
      return structuredClone(this.width_map);
    }
    absolute_map() {
      let absolute_map = [];
      let line_map = [];
      let line_idx_map = [];
      let offset = 0;
      for (let line_idx = 0; line_idx < this.width_map.length; line_idx++) {
        let curr_line = this.width_map[line_idx];
        if (curr_line === void 0) continue;
        let curr_map = [];
        for (let i = 0; i < curr_line.length; i++) {
          let curr_width = curr_line[i];
          if (curr_width !== void 0 && curr_width >= 0 && curr_width < 255) {
            for (let ai = 0; ai <= curr_width; ai++) {
              line_idx_map.push(line_idx);
              absolute_map.push(offset);
              curr_map.push(offset);
            }
          }
          offset++;
        }
        line_map.push(curr_map);
      }
      return { "absolute_map": absolute_map, "width_map": this.width_map, "line_map": line_map, "line_idx_map": line_idx_map };
    }
  };
  var IsTypeOf = class {
    static SingleLineParserClass(parser) {
      return parser.prototype instanceof SingleLineParser;
    }
    static MultilineParserClass(parser) {
      return parser.prototype instanceof MultilineParser;
    }
    static InlineParserClass(parser) {
      return parser.prototype instanceof InlineParser;
    }
    static cachedAstNode(node) {
      return "type" in node && node.type === "cached";
    }
  };
  var Parser = class {
    static FAIL = 0;
    // Failed to parse so go to the next parser
    static EXTEND = 1;
    // The previous parser got extended so skip this line
    constructor(...args) {
    }
    static init() {
    }
    // Runs once before the parsing starts. Can be used to init static variables for example
    static PRIORITY = 10;
    // Use this modifier to handle the order in which syntax is parsed. Higher numbers get parsed earlier
    line_idx = 0;
    // Used internally for chaching
    static register_escape_chars() {
      return null;
    }
    static escape_text(text2, CHAR_MAP, char_map_line, char_map_idx, parsers) {
      if (text2 === void 0 || char_map_line === void 0 || CHAR_MAP === void 0 || char_map_idx === void 0 || parsers === void 0) throw Error("[YAMP]: Failed to run function escape_text(), missing arguments to function! Expected 5");
      if (parsers.length === 0 || !text2.includes("\\")) return text2;
      let out = "";
      let escape_chars = "";
      for (const parser of parsers) {
        let result = parser.register_escape_chars();
        if (result) {
          escape_chars += result;
        }
      }
      if (escape_chars.length === 0) return text2;
      for (let i = 0; i < text2.length; i++) {
        if (text2.charAt(i) === "\\" && escape_chars.includes(text2.charAt(i + 1))) {
          CHAR_MAP.discard_immediately(char_map_line, i + char_map_idx, 1);
          out += text2.charAt(i + 1);
          i++;
        } else {
          out += text2.charAt(i);
        }
      }
      return out;
    }
  };
  var InlineParser = class extends Parser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      return [];
    }
  };
  var InlineModifer = class _InlineModifer {
    #index = 0;
    #data;
    #params = {};
    #modify_char_map = true;
    static new_insert(idx, value, modify_char_map = false) {
      return new _InlineModifer({ "type": "insert", "value": value }, idx, modify_char_map);
    }
    static new_delete(idx, count, modify_char_map = false) {
      return new _InlineModifer({ "type": "delete", "count": count }, idx, modify_char_map);
    }
    static new_replace(idx, count, new_value, modify_char_map = false) {
      return new _InlineModifer({ "type": "replace", "value": new_value, "count": count }, idx, modify_char_map);
    }
    get index() {
      return this.#index;
    }
    constructor(data, index, modify_char_map) {
      this.#data = data;
      this.#index = index;
      this.#modify_char_map = modify_char_map;
    }
    apply(line, CHAR_MAP, char_map_line, char_map_idx) {
      if (this.#data.type === "insert") {
        line = StringHelper.insert_substring(line, this.#index, 0, this.#data.value);
      } else if (this.#data.type === "delete") {
        if (this.#modify_char_map) CHAR_MAP.discard_immediately(char_map_line, this.#index + char_map_idx, this.#data.count);
        line = StringHelper.insert_substring(line, this.#index, this.#data.count, "");
      } else if (this.#data.type === "replace") {
        if (this.#modify_char_map) CHAR_MAP.discard_immediately(char_map_line, this.#index + char_map_idx, this.#data.count);
        line = StringHelper.insert_substring(line, this.#index, this.#data.count, this.#data.value);
      }
      return line;
    }
  };
  var SingleLineParser = class extends Parser {
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, char_map_idx, ast, parsers, options) {
      return null;
    }
    // return a new ast ast_node for success, return null if the line should be removed, else return undefined
    static parse_inline(text2, CHAR_MAP, char_map_line, char_map_idx, parsers, options) {
      if (text2 === void 0 || char_map_line === void 0 || CHAR_MAP === void 0 || char_map_idx === void 0 || parsers === void 0 || options === void 0) throw Error("[YAMP]: Failed to run function parse_inline(), missing arguments to function! Expected 6");
      if (parsers.length > 0) {
        let modifiers = [];
        for (const parser of parsers) {
          if (IsTypeOf.InlineParserClass(parser)) {
            let result = parser.parse(text2, CHAR_MAP, char_map_line, char_map_idx, options);
            if (result == void 0) throw Error(`[YAMP]: Failed to run function parse_inline(), method parse() of parser ${parser.constructor.name} returned an unexpected value. Expected type Array[InlineParser].`);
            if (result.length === 0) continue;
            for (const res of result) {
              if (!(res instanceof InlineModifer)) throw Error(`[YAMP]: Failed to run function parse_inline(), method parse() of parser ${parser.constructor.name} returned an unexpected value. Expected type Array[InlineParser].`);
            }
            modifiers.push(...result);
          }
        }
        modifiers.sort((a, b) => b.index - a.index);
        for (const modifier of modifiers) {
          text2 = modifier.apply(text2, CHAR_MAP, char_map_line, char_map_idx);
        }
      }
      return text2;
    }
    // Render all html from this ast ast_node
    generate(options) {
      return null;
    }
  };
  var MultilineParser = class _MultilineParser extends SingleLineParser {
    finish() {
    }
    // This medthod is called when the next node isn't a the same node and thus this node is closed
    static try_extend(ast, ...parameters) {
      if (ast.length === 0) return false;
      let prev_ast_node = ast[ast.length - 1];
      if (prev_ast_node instanceof this) {
        return prev_ast_node.extend(...parameters);
      }
      return false;
    }
    static parse_ast(lines, CHAR_MAP, char_map_line, char_map_indices, parsers, options, allow_self = true) {
      let ast = [];
      let last_ast_node = null;
      for (let idx = 0; idx < lines.length; idx++) {
        let line = lines[idx];
        if (line === void 0) continue;
        let char_map_idx = char_map_indices[idx];
        if (char_map_idx === void 0) throw Error("[YAMP] Failed to parse AST, provided parameter char_map_indices doesn't align with the lines. It's to short!");
        const parsed = this.parse_single_line(line, lines, idx, CHAR_MAP, char_map_line + idx, char_map_idx, ast, parsers, options, allow_self);
        if (idx === lines.length - 1) {
          if (parsed instanceof _MultilineParser) {
            parsed.finish();
          } else if (parsed === Parser.EXTEND && last_ast_node instanceof _MultilineParser) {
            last_ast_node.finish();
          }
        }
        if (parsed !== Parser.EXTEND) {
          if (last_ast_node !== null && last_ast_node instanceof _MultilineParser && last_ast_node.constructor !== parsed.constructor) {
            last_ast_node.finish();
          }
          last_ast_node = parsed;
          ast.push(parsed);
          parsed.line_idx = idx;
        }
      }
      return ast;
    }
    static parse_single_line(line, lines, line_idx, CHAR_MAP, char_map_line, char_map_idx, ast, parsers, options, allow_self = false) {
      if (parsers.length > 0) {
        for (const parser of parsers) {
          if (IsTypeOf.SingleLineParserClass(parser)) {
            if (!allow_self && parser.prototype instanceof this) continue;
            CHAR_MAP.cancel_que();
            let parsed = parser.parse(line, lines, line_idx, CHAR_MAP, char_map_line, char_map_idx, ast, parsers, options);
            if (parsed !== null && parsed !== Parser.FAIL) return parsed;
          }
        }
      }
      return Paragraph.parse(line, lines, line_idx, CHAR_MAP, char_map_line, char_map_idx, ast, parsers, options);
    }
    // Extend this ast object with another line, should return true for success and false when extending failed
    extend(...parameters) {
      return false;
    }
  };
  var Paragraph = class _Paragraph extends MultilineParser {
    #text;
    #CHAR_MAP;
    #parsers;
    #options;
    #char_map_line;
    #charmap_idx;
    constructor(text2, CHAR_MAP, char_map_line, charmap_idx, parsers, options) {
      super();
      this.#text = `${text2}`;
      this.#CHAR_MAP = CHAR_MAP;
      this.#parsers = parsers;
      this.#options = options;
      this.#char_map_line = char_map_line;
      this.#charmap_idx = charmap_idx;
    }
    extend(text2) {
      this.#text += `${text2}`;
      return true;
    }
    finish() {
      this.#text = _Paragraph.parse_inline(this.#text, this.#CHAR_MAP, this.#char_map_line, this.#charmap_idx, this.#parsers, this.#options);
      this.#text = _Paragraph.escape_text(this.#text, this.#CHAR_MAP, this.#char_map_line, this.#charmap_idx, this.#parsers);
      this.#text = this.#text.replaceAll("\n", "\n<br>");
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      if (line.length <= 1 && options.add_zero_width_space_for_cursor_positions !== false) {
        line = "\u200B" + line;
        CHAR_MAP.extend_immediately(char_map_line, charmap_idx, 1);
      }
      if (!this.try_extend(ast, line)) {
        return new _Paragraph(line, CHAR_MAP, char_map_line, charmap_idx, parsers, options);
      }
      return Parser.EXTEND;
    }
    generate(options) {
      if (options.disable_paragraph_elements) {
        return this.#text;
      } else {
        return `<p>${this.#text}</p>`;
      }
    }
  };
  var Header = class _Header extends SingleLineParser {
    #text = "";
    #level = 0;
    #id;
    constructor(text2, id, level) {
      super();
      this.#text = text2;
      this.#level = level;
      this.#id = id;
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      if (line.length === 1 || !line.includes("#")) return Parser.FAIL;
      let start_idx = 0;
      while (line.charAt(start_idx) === " ") {
        CHAR_MAP.que_discard_event(char_map_line, charmap_idx + start_idx, 1);
        start_idx++;
      }
      if (line.charAt(start_idx) !== "#") return Parser.FAIL;
      CHAR_MAP.que_discard_event(char_map_line, charmap_idx + start_idx, 1);
      let heading_level = 1;
      let char = line.charAt(1 + start_idx);
      while (char === "#") {
        CHAR_MAP.que_discard_event(char_map_line, charmap_idx + start_idx + heading_level, 1);
        heading_level++;
        char = line.charAt(heading_level + start_idx);
      }
      if (heading_level === 0) return Parser.FAIL;
      let text2 = line.slice(heading_level + start_idx + 1);
      let new_charmap_idx = heading_level + start_idx + 1 + charmap_idx;
      if (char !== " " || text2.length === 0) return Parser.FAIL;
      CHAR_MAP.que_discard_event(char_map_line, charmap_idx + start_idx + heading_level, 1);
      let id = text2;
      text2 = this.parse_inline(text2, CHAR_MAP, char_map_line, new_charmap_idx, parsers, options);
      text2 = this.escape_text(text2, CHAR_MAP, char_map_line, new_charmap_idx, parsers);
      CHAR_MAP.apply_que();
      return new _Header(text2, StringHelper.turn_into_ascii(id), heading_level);
    }
    static register_escape_chars() {
      return "#";
    }
    generate(options) {
      return `<h${this.#level} id="header-${this.#id}">${this.#text}${options.enable_trailing_linebreaks ? "<br>" : ""}</h${this.#level}>`;
    }
  };
  var AlternateHeader = class _AlternateHeader extends MultilineParser {
    #text;
    #id;
    #level;
    #complete = false;
    static PRIORITY = 15;
    get is_complete() {
      return this.#complete;
    }
    constructor(text2, id, level) {
      super();
      this.#text = text2;
      this.#level = level;
      this.#id = id;
    }
    extend() {
      this.#complete = true;
      return true;
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      let prev_ast_node = line_idx > 0 ? ast[ast.length - 1] : null;
      if (line.length <= 1) return Parser.FAIL;
      if (prev_ast_node instanceof _AlternateHeader && !prev_ast_node.is_complete) {
        CHAR_MAP.discard_immediately(char_map_line, charmap_idx, line.length);
        prev_ast_node.extend();
        return Parser.EXTEND;
      }
      let next_line = line_idx < all_lines.length - 1 ? all_lines[line_idx + 1]?.trim() : "";
      if (next_line === void 0) return Parser.FAIL;
      let first_char = next_line.charAt(0);
      let last_char = next_line.charAt(0);
      if (!(first_char === "=" || first_char === "-") || !(last_char === "=" || last_char === "-") || next_line.length < 2) return Parser.FAIL;
      let success = true;
      let level = -1;
      for (let i = 0; i < next_line.length; i++) {
        let char = next_line.charAt(i);
        if (char === "=" && level === -1) {
          level = 1;
        } else if (char === "-" && level === -1) {
          level = 2;
        } else if (level === 1 && char !== "=" || level === 2 && char !== "-") {
          success = false;
          return Parser.FAIL;
        }
      }
      line = this.parse_inline(line, CHAR_MAP, char_map_line, charmap_idx, parsers, options);
      line = this.escape_text(line, CHAR_MAP, char_map_line, charmap_idx, parsers);
      if (success && level > 0) {
        return new _AlternateHeader(line, StringHelper.turn_into_ascii(line), level);
      }
      return Parser.FAIL;
    }
    register_escape_chars() {
      return "-=";
    }
    generate(options) {
      return `<h${this.#level} id="header-${this.#id}">${this.#text}<br></h${this.#level}>`;
    }
  };
  var BlockQuote = class _BlockQuote extends MultilineParser {
    #lines = [];
    #parsers = [];
    #options;
    #ast = [];
    CHAR_MAP;
    char_map_indices = [];
    char_map_line;
    constructor(text2, CHAR_MAP, char_map_line, char_map_idx, parsers, options) {
      super();
      this.#lines.push(text2);
      this.#parsers = parsers;
      this.#options = options;
      this.CHAR_MAP = CHAR_MAP;
      this.char_map_indices.push(char_map_idx);
      this.char_map_line = char_map_line;
    }
    extend(text2, char_map_idx) {
      this.#lines.push(text2);
      this.char_map_indices.push(char_map_idx);
      return true;
    }
    finish() {
      this.#ast = _BlockQuote.parse_ast(this.#lines, this.CHAR_MAP, this.char_map_line, this.char_map_indices, this.#parsers, this.#options);
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      if (line.length === 0 || !line.includes(">")) {
        return Parser.FAIL;
      }
      let start_idx = 0;
      while (line.charAt(start_idx) === " ") {
        start_idx++;
      }
      if (line.charAt(start_idx) !== ">") {
        return Parser.FAIL;
      }
      let blockquote_depth = 1;
      let char = line.charAt(1 + start_idx);
      while (char === ">") {
        blockquote_depth++;
        char = line.charAt(blockquote_depth + start_idx);
      }
      if (blockquote_depth === 0 || char !== " ") {
        return Parser.FAIL;
      }
      let new_charmap_idx = start_idx + 1 + charmap_idx;
      CHAR_MAP.que_discard_event(char_map_line, start_idx + charmap_idx, 1);
      let text2 = line.slice(start_idx + blockquote_depth === 1 ? 2 : 1);
      if (blockquote_depth === 1) {
        CHAR_MAP.que_discard_event(char_map_line, start_idx + charmap_idx + blockquote_depth, 1);
        new_charmap_idx++;
      }
      if (text2.length === 0) {
        return Parser.FAIL;
      }
      CHAR_MAP.apply_que();
      if (!this.try_extend(ast, text2, new_charmap_idx)) {
        return new _BlockQuote(text2, CHAR_MAP, char_map_line, new_charmap_idx, parsers, options);
      }
      return Parser.EXTEND;
    }
    static register_escape_chars() {
      return ">";
    }
    generate(options) {
      if (options.debug) console.log("BLOCK QUOTE AST:", this.#ast);
      let out = "<blockquote>";
      for (const ast_ast_node of this.#ast) {
        out += `${ast_ast_node.generate(options)}`;
      }
      out += "</blockquote>";
      return out;
    }
  };
  var Emphasis = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("*")) return [];
      let modifiers = [];
      let start = 0;
      let opening_count = 0;
      let closing_count = 0;
      for (let i = 0; i < input.length; i++) {
        let char = input.charAt(i);
        let prev_char = input.charAt(i - 1);
        if (char === "*") {
          if (prev_char === "\\") {
            opening_count = 0;
            start = 0;
            closing_count = 0;
            continue;
          }
          if (prev_char === "*" && closing_count === 0 || opening_count === 0) {
            if (opening_count === 0) start = i;
            opening_count++;
          } else if (opening_count > 0 && closing_count < 3) {
            closing_count++;
          }
        }
        if (closing_count > 0 && (char !== "*" || i === input.length - 1) || opening_count === closing_count && opening_count > 0 || closing_count >= 3) {
          let final_count = Math.min(opening_count, closing_count, 3);
          let start_pos = start + Math.max(0, opening_count - final_count);
          let end_pos = i - Math.max(0, closing_count - final_count);
          if (char !== "*") end_pos -= 1;
          if (final_count === 1) {
            modifiers.push(InlineModifer.new_replace(start_pos, final_count, "<em>", true));
            modifiers.push(InlineModifer.new_replace(end_pos - final_count + 1, final_count, "</em>", true));
          } else if (final_count === 2) {
            modifiers.push(InlineModifer.new_replace(start_pos, final_count, "<strong>", true));
            modifiers.push(InlineModifer.new_replace(end_pos - final_count + 1, final_count, "</strong>", true));
          } else if (final_count >= 3) {
            modifiers.push(InlineModifer.new_replace(start_pos, final_count, "<em><strong>", true));
            modifiers.push(InlineModifer.new_replace(end_pos - final_count + 1, final_count, "</strong></em>", true));
          }
          opening_count = 0;
          closing_count = 0;
        }
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "*";
    }
  };
  var UnderscoreEmphasis = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("_")) return [];
      let modifiers = [];
      let out = input;
      let start = 0;
      let opening_count = 0;
      let closing_count = 0;
      let after_word = false;
      for (let i = 0; i < input.length; i++) {
        let char = input.charAt(i);
        let prev_char = input.charAt(i - 1);
        let next_char = input.charAt(i + 1);
        if (char === "_" && prev_char !== "\\") {
          if (prev_char === "_" && closing_count === 0 || opening_count === 0) {
            if (opening_count === 0) {
              start = i;
              if (StringHelper.is_text_char(prev_char) && options.literal_mid_word_underscores) after_word = true;
            }
            if (after_word && StringHelper.is_text_char(next_char)) {
              opening_count = 0;
              after_word = false;
            } else {
              opening_count++;
            }
          } else if (opening_count > 0) {
            if (closing_count === 0 && StringHelper.is_text_char(prev_char) && options.literal_mid_word_underscores) after_word = true;
            if (after_word && StringHelper.is_text_char(next_char)) {
              opening_count = 0;
              closing_count = 0;
              after_word = false;
            }
            closing_count++;
          }
        }
        if (closing_count > 0 && (char !== "_" || i === input.length - 1) || opening_count === closing_count && opening_count > 0 || closing_count >= 3) {
          let lookahead = i + 1;
          while (input.charAt(lookahead) === "_" && lookahead < input.length) {
            lookahead++;
          }
          if (!after_word || !StringHelper.is_text_char(input.charAt(lookahead))) {
            let final_count = Math.min(opening_count, closing_count, 3);
            let start_pos = start + Math.max(0, opening_count - final_count);
            let end_pos = i - Math.max(0, closing_count - final_count);
            if (char !== "_") end_pos -= 1;
            if (final_count === 1) {
              modifiers.push(InlineModifer.new_replace(start_pos, final_count, "<em>", true));
              modifiers.push(InlineModifer.new_replace(end_pos - final_count + 1, final_count, "</em>", true));
            } else if (final_count === 2) {
              modifiers.push(InlineModifer.new_replace(start_pos, final_count, "<strong>", true));
              modifiers.push(InlineModifer.new_replace(end_pos - final_count + 1, final_count, "</strong>", true));
            } else if (final_count >= 3) {
              modifiers.push(InlineModifer.new_replace(start_pos, final_count, "<em><strong>", true));
              modifiers.push(InlineModifer.new_replace(end_pos - final_count + 1, final_count, "</strong></em>", true));
            }
            opening_count = 0;
            closing_count = 0;
          } else {
            closing_count = 0;
            i = lookahead;
          }
        }
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "_";
    }
  };
  var List = class _List extends MultilineParser {
    #items = [];
    #stack = [];
    // Used during generation
    constructor(text2, intend_count, number, is_ordered) {
      super();
      this.#items.push({
        "text": text2,
        "intend": intend_count,
        "is_ordered": is_ordered,
        "number": number
      });
    }
    extend(text2, intend_count, number, is_ordered) {
      let last_item = this.#items[this.#items.length - 1];
      if (!last_item) return false;
      if (intend_count !== 0 || last_item.is_ordered === is_ordered) {
        this.#items.push({
          "text": text2,
          "intend": intend_count,
          "is_ordered": is_ordered,
          "number": number
        });
        return true;
      } else {
        return false;
      }
    }
    static is_list_char(c) {
      if (c.length !== 1) return false;
      switch (c) {
        case "*":
        case "-":
        case "+":
          return true;
        default:
          return false;
      }
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      let intend_count = 0;
      while (StringHelper.is_whitespace(line.charAt(intend_count))) {
        CHAR_MAP.que_discard_event(char_map_line, intend_count + charmap_idx, 1);
        intend_count++;
      }
      let is_ordered = StringHelper.is_number(line.charAt(intend_count));
      let number_count = 0;
      if (is_ordered) {
        while (StringHelper.is_number(line.charAt(number_count + intend_count))) {
          CHAR_MAP.que_discard_event(char_map_line, intend_count + number_count + charmap_idx, 1);
          number_count++;
        }
        if (number_count === 0 || line.charAt(intend_count + number_count) !== ".") return Parser.FAIL;
      } else if (!this.is_list_char(line.charAt(intend_count))) {
        return Parser.FAIL;
      }
      CHAR_MAP.que_discard_event(char_map_line, intend_count + number_count + charmap_idx, 1);
      if (!StringHelper.is_whitespace(line.charAt(intend_count + number_count + 1))) return Parser.FAIL;
      CHAR_MAP.que_discard_event(char_map_line, intend_count + number_count + 1 + charmap_idx, 1);
      let number = Number(line.slice(intend_count, intend_count + number_count));
      let text2 = line.slice(intend_count + number_count + 2);
      if (text2.length === 0) return Parser.FAIL;
      let new_charmap_idx = intend_count + number_count + 2 + charmap_idx;
      text2 = this.parse_inline(text2, CHAR_MAP, char_map_line, new_charmap_idx, parsers, options);
      CHAR_MAP.apply_que();
      if (!this.try_extend(ast, text2, intend_count, number, is_ordered)) {
        return new _List(text2, intend_count, number, is_ordered);
      }
      return Parser.EXTEND;
    }
    static register_escape_chars() {
      return "*-+.";
    }
    get prev_item() {
      if (this.#stack.length === 0) return { "intend": -1, "is_ordered": null };
      let last_item = this.#stack[this.#stack.length - 1];
      if (!last_item) return { "intend": -1, "is_ordered": null };
      return last_item;
    }
    generate(options) {
      let out = "";
      let normalized_intend = [];
      for (const item of this.#items) {
        if (!normalized_intend.includes(item.intend)) {
          normalized_intend.push(item.intend);
        }
      }
      normalized_intend.sort();
      this.#stack = [];
      for (const item of this.#items) {
        let intend = normalized_intend.indexOf(item.intend);
        let prev_item = this.prev_item;
        while (prev_item && prev_item.intend > intend) {
          if (prev_item.is_ordered === null) throw Error("Failed to find ordering whilst closing list.");
          if (prev_item.is_ordered) {
            out += "</ol>";
          } else {
            out += "</ul>";
          }
          this.#stack.pop();
          prev_item = this.prev_item;
        }
        if (prev_item && prev_item.intend < intend) {
          for (let i = prev_item.intend + 1; i <= intend; i++) {
            if (item.is_ordered) {
              let list_start = item.number ? ` start="${item.number}"` : "";
              out += `<ol${list_start}>`;
            } else {
              out += `<ul>`;
            }
            prev_item = {
              "intend": i,
              "is_ordered": item.is_ordered
            };
            this.#stack.push(prev_item);
          }
        }
        if (prev_item.is_ordered !== null && prev_item.is_ordered !== item.is_ordered) {
          if (prev_item.is_ordered) {
            out += "</ol>";
          } else {
            out += "</ul>";
          }
          if (item.is_ordered) {
            out += "<ol>";
          } else {
            out += "<ul>";
          }
          let last_item = this.#stack[this.#stack.length - 1];
          if (last_item) last_item.is_ordered = item.is_ordered;
        }
        if (item.text && item.text.length > 0) out += `<li>${item.text}${options.enable_trailing_linebreaks ? "<br>" : ""}</li>`;
      }
      for (let i = this.prev_item.intend; i >= 0; i--) {
        let is_ordered = this.#stack[i]?.is_ordered;
        if (is_ordered === null) throw Error("Failed to close list, stack is too short");
        if (is_ordered) {
          out += "</ol>";
        } else {
          out += "</ul>";
        }
      }
      return out;
    }
  };
  var Code = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("`")) return [];
      let backticks = [];
      let count = 0;
      let modifiers = [];
      for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) === "`" && input.charAt(i - 1) !== "\\") {
          let start = i;
          i++;
          count = 1;
          while (input.charAt(i) === "`") {
            count++;
            i++;
            if (count >= 3) continue;
          }
          if (count >= 3) continue;
          backticks.push({
            "count": count,
            "start": start
          });
        }
      }
      if (backticks.length === 0) return [];
      for (let i = 0; i < backticks.length; i++) {
        let backtick = backticks[i];
        if (!backtick) continue;
        let success = false;
        for (let si = i + 1; si < backticks.length; si++) {
          let ending = backticks[si];
          if (!ending) continue;
          if (ending.count === backtick.count) {
            if (backtick.count > 1) CHAR_MAP.discard_immediately(char_map_line, char_map_idx + ending.start + 1, backtick.count - 1);
            if (backtick.count > 1) CHAR_MAP.discard_immediately(char_map_line, char_map_idx + backtick.start + backtick.count - 1, backtick.count - 1);
            modifiers.push(InlineModifer.new_replace(ending.start, backtick.count, "</code>\u200B"));
            modifiers.push(InlineModifer.new_replace(backtick.start, backtick.count, "<code>\u200B"));
            i = si;
            success = true;
            break;
          }
        }
        if (success) continue;
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "`";
    }
  };
  var Link = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("<") && !input.includes("[")) return [];
      let modifiers = [];
      let link_part_open = 0;
      let link_part_done = 0;
      let text_part_open = 0;
      let link_part = "";
      let text_part = "";
      for (let i = input.length - 1; i >= 0; i--) {
        let char = input.charAt(i);
        let next_char = input.charAt(i - 1);
        if (char === ")" && next_char !== "\\") {
          link_part_open += 1;
          link_part = "";
        } else if (char == "(" && next_char !== "\\" && link_part_open > 0) {
          if (link_part_open > 1) {
            link_part_open -= 1;
            continue;
          }
          link_part_open = 0;
          link_part_done = 1;
        } else if (char === "]" && next_char !== "\\" && link_part_done) {
          text_part_open += 1;
          text_part = "";
        } else if (char === "[" && next_char !== "\\" && link_part_done && text_part_open > 0) {
          if (text_part_open > 1) {
            text_part_open -= 1;
            continue;
          }
          if (next_char === "!" || link_part.length === 0 || text_part.length === 0) {
            link_part_done = 0;
            link_part_open = 0;
            text_part_open = 0;
            continue;
          }
          text_part_open = 0;
          link_part_done = 0;
          let title_start = -1;
          if (link_part.charAt(link_part.length - 1) === '"') {
            for (let idx = link_part.length - 2; idx >= 0; idx--) {
              if (link_part.charAt(idx) === '"') {
                title_start = idx;
              }
            }
          } else {
            title_start = link_part.length + 1;
          }
          let title = link_part.slice(title_start + 1, link_part.length - 1);
          let link_ = link_part.slice(0, title_start - 1);
          modifiers.push(InlineModifer.new_replace(i, 1, `<a href="${link_}" class="link" title="${title}">`, true));
          modifiers.push(InlineModifer.new_replace(i + text_part.length + 1, 3 + link_part.length, "</a>", true));
        } else if (link_part_done && !text_part_open || (link_part_open || text_part_open) && !(StringHelper.is_valid_char(char) || StringHelper.is_whitespace(char))) {
          link_part_done = 0;
          link_part_open = 0;
          text_part_open = 0;
        } else if (link_part_open) {
          link_part = char + link_part;
        } else if (text_part_open) {
          text_part = char + text_part;
        }
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "[]()<>";
    }
  };
  var Image = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("!")) return [];
      let modifiers = [];
      let link_open = false;
      let link = "";
      let end = 0;
      let image_part_open = false;
      let image_part_done = false;
      let text_part_open = false;
      let image_part = "";
      let text_part = "";
      for (let i = input.length - 1; i >= 0; i--) {
        let char = input.charAt(i);
        let next_char = input.charAt(i - 1);
        if (char === ")" && next_char !== "\\") {
          image_part_open = true;
          image_part = "";
        } else if (char == "(" && next_char !== "\\" && image_part_open) {
          image_part_open = false;
          image_part_done = true;
        } else if (char === "]" && next_char !== "\\" && image_part_done) {
          text_part_open = true;
          text_part = "";
        } else if (char === "[" && next_char === "!" && image_part_done && text_part_open) {
          text_part_open = false;
          image_part_done = false;
          if (image_part.length === 0 || text_part.length === 0) {
            image_part_open = false;
            image_part_done = false;
            text_part_open = false;
            continue;
          }
          let title_start = 0;
          if (image_part.charAt(image_part.length - 1) === '"') {
            for (let idx = image_part.length - 2; idx >= 0; idx--) {
              if (image_part.charAt(idx) === '"') {
                title_start = idx;
              }
            }
          } else {
            title_start = image_part.length + 1;
          }
          let title = image_part.slice(title_start + 1, image_part.length - 1);
          let image_source = image_part.slice(0, title_start - 1);
          modifiers.push(InlineModifer.new_replace(i - 1, text_part.length + image_part.length + 5, `<img src="${image_source}" title="${title}" alt="${text_part}">`, true));
        } else if (image_part_done && !text_part_open || (image_part_open || text_part_open) && !(StringHelper.is_valid_char(char) || StringHelper.is_whitespace(char))) {
          image_part_done = false;
          image_part_open = false;
          text_part_open = false;
        } else if (image_part_open) {
          image_part = char + image_part;
        } else if (text_part_open) {
          text_part = char + text_part;
        }
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "[]()!";
    }
    static PRIORITY = 15;
  };
  var HorizontalRule = class _HorizontalRule extends SingleLineParser {
    constructor() {
      super();
    }
    static is_horizontal_rule_char(c) {
      if (c.length === 0) return false;
      switch (c) {
        case "*":
        case "-":
        case "_":
          return true;
        default:
          return false;
      }
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      if (line.length <= 3) return Parser.FAIL;
      let selected_char = line.charAt(0);
      if (!this.is_horizontal_rule_char(selected_char)) return Parser.FAIL;
      for (let i = 1; i < line.length - 1; i++) {
        let char = line.charAt(i);
        if (!this.is_horizontal_rule_char(char) || char !== selected_char) {
          return Parser.FAIL;
        }
      }
      CHAR_MAP.discard_immediately(line_idx, charmap_idx, line.length);
      return new _HorizontalRule();
    }
    generate(options) {
      return `<hr>`;
    }
  };
  var Table = class _Table extends MultilineParser {
    #aligned = false;
    #rows = [];
    #colums = [];
    get is_aligned() {
      return this.#aligned;
    }
    get column_count() {
      return this.#colums.length;
    }
    constructor(columns) {
      super();
      this.#colums = columns;
    }
    extend(align, row = []) {
      if (align) {
        this.#aligned = true;
      } else {
        this.#rows.push(row);
      }
      return true;
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      let start_idx = 0;
      while (line.charAt(start_idx) === " ") {
        start_idx++;
      }
      if (line.charAt(start_idx) !== "|") return Parser.FAIL;
      let next_line = all_lines[line_idx + 1] ? all_lines[line_idx + 1] : "";
      let prev_node = ast[ast.length - 1];
      let text2 = "";
      if (prev_node instanceof _Table) {
        if (prev_node.is_aligned) {
          let curr_row = [];
          let cell_count = 0;
          for (let idx = start_idx + 1; idx < line.length - 1; idx++) {
            let char = line.charAt(idx);
            let prev_char = line.charAt(idx - 1);
            if (char === "|" && prev_char !== "\\") {
              let new_charmap_idx = charmap_idx + 1;
              text2 = this.parse_inline(text2, CHAR_MAP, char_map_line, charmap_idx + idx + 1, parsers, options);
              curr_row.push({
                "text": text2
              });
              text2 = "";
              cell_count++;
            } else {
              text2 += char;
            }
          }
          if (cell_count != prev_node.column_count) return Parser.FAIL;
          CHAR_MAP.discard_immediately(char_map_line, charmap_idx + start_idx, 1);
          CHAR_MAP.discard_immediately(char_map_line, line.length - 1, 1);
          prev_node.extend(false, curr_row);
          return Parser.EXTEND;
        } else {
          prev_node.extend(true);
          return Parser.EXTEND;
        }
      }
      if (!next_line || !next_line.includes("|")) return Parser.FAIL;
      let columns = [];
      let column_idx = 0;
      for (let idx = start_idx + 1; idx < line.length; idx++) {
        let char = line.charAt(idx);
        let prev_char = line.charAt(idx - 1);
        if (char === "|" && prev_char !== "\\") {
          text2 = this.parse_inline(text2, CHAR_MAP, char_map_line, charmap_idx + idx + 1, parsers, options);
          columns.push({
            "heading": text2,
            "align": "left"
          });
          text2 = "";
        } else {
          text2 += char;
        }
      }
      if (columns.length === 0 || !next_line.includes("-") || !next_line.startsWith("|")) return Parser.FAIL;
      text2 = "";
      for (let idx = 1; idx < next_line.length - 1; idx++) {
        let char = next_line.charAt(idx);
        let prev_char = next_line.charAt(idx - 1);
        if (char === "|" && prev_char !== "\\") {
          if (column_idx >= columns.length) return Parser.FAIL;
          let curr_column = columns[column_idx];
          if (!curr_column) continue;
          if (text2.startsWith(":-") && text2.endsWith("-:")) {
            curr_column.align = "center";
          } else if (text2.startsWith(":-")) {
            curr_column.align = "left";
          } else if (text2.endsWith("-:")) {
            curr_column.align = "right";
          }
          column_idx++;
          text2 = "";
        } else if (!StringHelper.is_valid_char(char)) {
          return Parser.FAIL;
        } else {
          text2 += char;
        }
      }
      if (column_idx !== columns.length) return Parser.FAIL;
      CHAR_MAP.discard_immediately(char_map_line, charmap_idx + start_idx, 1);
      CHAR_MAP.discard_immediately(char_map_line, line.length - 1, 1);
      CHAR_MAP.discard_immediately(char_map_line + 1, 0, next_line.length);
      return new _Table(columns);
    }
    static register_escape_chars() {
      return "|";
    }
    generate(options) {
      let out = "<table>";
      out += "<thead><tr>";
      for (const column of this.#colums) {
        out += `<td style="text-align: ${column.align}">${column.heading}${options.enable_trailing_linebreaks ? "<br> " : ""}</td>`;
      }
      out += "</tr></thead>";
      out += "<tbody>";
      for (const row of this.#rows) {
        out += "<tr>";
        for (const [idx, cell] of row.entries()) {
          let align = this.#colums[idx]?.align;
          out += `<td style="text-align: ${align}">${cell.text}${options.enable_trailing_linebreaks ? "<br> " : ""}</td>`;
        }
        out += "</tr>";
      }
      out += "</tbody></table>";
      return out;
    }
  };
  var CodeBlock = class _CodeBlock extends MultilineParser {
    #lines = [];
    #language;
    #ended = false;
    constructor(language) {
      super();
      this.#language = language;
    }
    get is_ended() {
      return this.#ended;
    }
    extend(text2, end_block = false) {
      if (end_block) {
        this.#ended = true;
      } else {
        this.#lines.push(text2);
      }
      return true;
    }
    static parse(line, all_lines, line_idx, CHAR_MAP, char_map_line, charmap_idx, ast, parsers, options) {
      let prev_node = ast[ast.length - 1];
      if (prev_node instanceof _CodeBlock && !prev_node.is_ended) {
        if (line.startsWith("```") && line.length === 4 && line.endsWith("\n")) {
          let offs = 0;
          if (!options.add_zero_width_space_for_cursor_positions) offs = 1;
          CHAR_MAP.discard_immediately(char_map_line, charmap_idx, line.length + offs);
          prev_node.extend("", true);
        } else {
          let text2 = "";
          for (let i = 0; i < line.length - 1; i++) {
            let char = line.charAt(i);
            if (char === "&") {
              text2 += "&amp";
              continue;
            }
            if (char === "<") {
              text2 += "&lt;";
              continue;
            }
            if (char === ">") {
              text2 += "&gt;";
              continue;
            }
            if (char === '"') {
              text2 += "&quot;";
              continue;
            }
            if (char === "'") {
              text2 += "&#39;";
              continue;
            }
            text2 += char;
          }
          prev_node.extend(text2);
        }
        return Parser.EXTEND;
      }
      if (line.startsWith("```")) {
        let success = false;
        for (let i = line_idx + 1; i < all_lines.length; i++) {
          if (all_lines[i]?.startsWith("```") && all_lines[i]?.length === 4 && all_lines[i]?.endsWith("\n")) {
            success = true;
            break;
          }
        }
        if (!success) return Parser.FAIL;
        let language = line.slice(3);
        for (let i = 0; i < language.length - 1; i++) {
          if (!StringHelper.is_text_char(language.charAt(i))) return Parser.FAIL;
        }
        CHAR_MAP.discard_immediately(char_map_line, charmap_idx, line.length);
        return new _CodeBlock(language);
      }
      return Parser.FAIL;
    }
    static register_escape_chars() {
      return "`";
    }
    generate(options) {
      let out = `<pre><code class="language-${this.#language}">`;
      for (const [idx, line] of this.#lines.entries()) {
        if (idx !== 0) {
          out += "\n";
        }
        out += line;
      }
      out += `</code></pre>`;
      if (options.add_zero_width_space_for_cursor_positions) out += '<p style="font-size: 1px; margin: 0px">&ZeroWidthSpace;</p>';
      return out;
    }
  };
  var Strikethrough = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("~")) return [];
      let squiggles = [];
      let count = 0;
      let modifiers = [];
      for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) === "~") {
          let start = i;
          i++;
          count = 1;
          while (input.charAt(i) === "~") {
            count++;
            i++;
            if (count >= 3) continue;
          }
          if (count !== 2) continue;
          squiggles.push({
            "count": count,
            "start": start
          });
        }
      }
      if (squiggles.length === 0) return [];
      for (let i = 0; i < squiggles.length; i++) {
        let squiggle = squiggles[i];
        if (!squiggle) continue;
        let success = false;
        for (let si = i + 1; si < squiggles.length; si++) {
          let ending = squiggles[si];
          if (!ending) continue;
          if (ending.count === squiggle.count) {
            modifiers.push(InlineModifer.new_replace(ending.start, squiggle.count, "</s>", true));
            modifiers.push(InlineModifer.new_replace(squiggle.start, squiggle.count, "<s>", true));
            i = si;
            success = true;
            break;
          }
        }
        if (success) continue;
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "~";
    }
  };
  var EscapeIncompleteHtml = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx) {
      let modifiers = [];
      let stack = [];
      let is_closing = false;
      let is_inside_tag = false;
      let is_html_attributes = false;
      let invalid_attributes = false;
      let attributes_double_quotes_open = false;
      let attributes_single_quotes_open = false;
      for (let i = 0; i < input.length; i++) {
        let curr_char = input.charAt(i);
        let prev_char = input.charAt(i - 1);
        if (curr_char === "<" && prev_char !== "\\") {
          if (is_inside_tag) {
            let last = stack[stack.length - 1];
            if (last !== void 0) stack.unshift(last);
            stack.splice(stack.length - 1, 1);
            is_closing = false;
          }
          stack.push({
            "full_text": "",
            "start_location": i,
            "got_closing_bracket": 0,
            "html_tag": ""
          });
          is_inside_tag = true;
        } else if (is_inside_tag && curr_char === "/" && prev_char === "<") {
          let last = stack[stack.length - 1];
          is_closing = true;
          if (last !== void 0) last.full_text += "/";
        } else if (is_inside_tag && curr_char === " ") {
          let last = stack[stack.length - 1];
          if (last !== void 0) last.full_text += " ";
          is_html_attributes = true;
        } else if (is_inside_tag && curr_char === ">" && prev_char !== "\\") {
          let last = stack[stack.length - 1];
          if (last === void 0) continue;
          last.got_closing_bracket = 1;
          last.invalid_attributes = invalid_attributes || attributes_double_quotes_open || attributes_single_quotes_open;
          if (is_closing) {
            if (stack.length < 2 || stack[stack.length - 2]?.html_tag !== stack[stack.length - 1]?.html_tag) {
              let found_idx = null;
              for (let idx = stack.length - 3; idx >= 0; idx--) {
                if (stack[idx]?.html_tag === stack[stack.length - 1]?.html_tag) {
                  found_idx = idx;
                  break;
                }
              }
              if (found_idx === null) {
                let curr_tag = stack[stack.length - 1];
                if (!curr_tag) continue;
                modifiers.push(InlineModifer.new_replace(curr_tag.start_location, 1, "&lt;"));
                modifiers.push(InlineModifer.new_replace(curr_tag.start_location + curr_tag.full_text.length + 1, 1, "&gt;"));
                stack.splice(stack.length - 1, 1);
              } else {
                const mods = this.close_html_tags(stack[found_idx], stack[stack.length - 1], stack, input, CHAR_MAP, char_map_line);
                if (mods !== null) modifiers.push(...mods);
              }
            } else {
              const mods = this.close_html_tags(stack[stack.length - 2], stack[stack.length - 1], stack, input, CHAR_MAP, char_map_line);
              if (mods !== null) modifiers.push(...mods);
            }
          } else {
            switch (stack[stack.length - 1]?.html_tag) {
              case "br":
              case "hr":
              case "img":
              case "wbr":
              case "source":
              case "track":
                let tag = stack[stack.length - 1];
                if (!tag) break;
                CHAR_MAP.discard_immediately(char_map_line, tag.start_location, tag.full_text.length + 2);
                stack.splice(stack.length - 1, 1);
              default:
                break;
            }
          }
          is_closing = false;
          is_inside_tag = false;
          is_html_attributes = false;
          attributes_double_quotes_open = false;
          attributes_single_quotes_open = false;
        } else if (is_inside_tag) {
          let last = stack[stack.length - 1];
          if (is_html_attributes) {
            if (!StringHelper.is_whitespace(curr_char) && !StringHelper.is_valid_char(curr_char)) {
              invalid_attributes = true;
            }
            if (curr_char === '"' && !attributes_single_quotes_open) {
              if (attributes_double_quotes_open) {
                attributes_double_quotes_open = false;
              } else {
                attributes_double_quotes_open = true;
              }
            }
            if (curr_char === "'" && !attributes_double_quotes_open) {
              if (attributes_single_quotes_open) {
                attributes_single_quotes_open = false;
              } else {
                attributes_single_quotes_open = true;
              }
            }
          } else {
            if (last !== void 0) last.html_tag += curr_char;
          }
          if (last !== void 0) last.full_text += curr_char;
        }
      }
      stack.sort((a, b) => a !== void 0 && b !== void 0 ? b.start_location - a.start_location : 0);
      for (const entry of stack) {
        if (entry) modifiers.push(InlineModifer.new_replace(entry.start_location, 1, "&lt;"));
        if (entry && entry.got_closing_bracket) modifiers.push(InlineModifer.new_replace(entry.start_location + entry.full_text.length + 1, 1, "&gt;"));
      }
      for (let i = 0; i < input.length; i++) {
        let char = input.charAt(i);
        if (char === "&") {
          let success = false;
          for (let si = i + 1; si < input.length; si++) {
            let search_char = input.charAt(si);
            let prev_search_char = input.charAt(si);
            if (search_char === ";" && prev_search_char !== "\\") {
              success = true;
              if (this.verify_html_entity(input.slice(i, si + 1))) {
                CHAR_MAP.discard_immediately(char_map_line, char_map_idx + i + 1, si - i);
              }
              break;
            }
          }
          if (!success) {
            modifiers.push(InlineModifer.new_replace(i, 1, "&amp;"));
          }
        }
      }
      for (let i = 0; i < input.length; i++) {
        let prev_char = input.charAt(i - 1);
        if (prev_char === "\\") {
          switch (input.charAt(i)) {
            case "<":
              CHAR_MAP.discard_immediately(char_map_line, char_map_idx + i - 1, 1);
              modifiers.push(InlineModifer.new_replace(i - 1, 2, "&lt;"));
              break;
            case ">":
              CHAR_MAP.discard_immediately(char_map_line, char_map_idx + i - 1, 1);
              modifiers.push(InlineModifer.new_replace(i - 1, 2, "&gt;"));
              break;
            case "&":
              CHAR_MAP.discard_immediately(char_map_line, char_map_idx + i - 1, 1);
              modifiers.push(InlineModifer.new_replace(i - 1, 2, "&amp;"));
              break;
          }
        }
      }
      return modifiers;
    }
    static close_html_tags(opening, closing, stack, input, CHAR_MAP, char_map_line) {
      let modifiers = [];
      if (opening === void 0 || closing === void 0) throw Error("[YAMP]: Failed to close html tags, opening and or closing tag is undefined!");
      if (opening?.invalid_attributes) {
        stack.unshift(closing);
        stack.unshift(opening);
        stack.splice(stack.length - 2, 2);
      } else {
        CHAR_MAP.discard_immediately(char_map_line, opening.start_location, opening.full_text.length + 2);
        CHAR_MAP.discard_immediately(char_map_line, closing.start_location, closing.full_text.length + 2);
        stack.splice(stack.length - 2, 2);
        let next_char = input.charAt(opening.start_location + opening.full_text.length + 2);
        if (next_char === "\n") {
          modifiers.push(InlineModifer.new_delete(opening.start_location + opening.full_text.length + 2, 1, true));
        }
        next_char = input.charAt(closing.start_location + closing.full_text.length + 2);
        if (next_char === "\n") {
          modifiers.push(InlineModifer.new_delete(closing.start_location + closing.full_text.length + 2, 1, true));
        }
        return modifiers;
      }
      return null;
    }
    // Ehh I think this is a cool solution I came up with
    static verify_html_entity(html_entity) {
      let elem = document.createElement("textarea");
      elem.innerHTML = html_entity;
      return elem.value !== html_entity;
    }
    static register_escape_chars() {
      return ";";
    }
  };
  var Color = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("]") || !input.includes("[") || !input.includes("|")) return [];
      let modifiers = [];
      let color_start = 0;
      let color_opened = false;
      let color_done = false;
      let color_end = 0;
      for (let i = 0; i < input.length; i++) {
        let char = input.charAt(i);
        if (char === "[") {
          color_start = i;
          color_opened = true;
        } else if (char === "|" && color_opened) {
          color_end = i;
          color_done = true;
        } else if (char === "]" && color_done && color_opened) {
          let color_part = input.slice(color_start + 1, color_end);
          if (color_part.length === 0 || color_end + 1 === i) {
            color_opened = false;
            color_done = false;
            continue;
          }
          modifiers.push(InlineModifer.new_replace(color_start, color_end - color_start + 1, `<span style="color: ${color_part};">`, true));
          modifiers.push(InlineModifer.new_replace(i, 1, "</span>", true));
        } else if (color_opened && !color_done && !StringHelper.is_text_char(char) && char !== "#") {
          color_opened = false;
        }
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "[|]";
    }
  };
  var Highlight = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("^")) return [];
      let backticks = [];
      let count = 0;
      let modifiers = [];
      for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) === "^" && input.charAt(i - 1) !== "\\") {
          let start = i;
          i++;
          count = 1;
          while (input.charAt(i) === "^") {
            count++;
            i++;
            if (count >= 3) continue;
          }
          backticks.push({
            "count": count,
            "start": start
          });
        }
      }
      if (backticks.length === 0) return [];
      for (let i = 0; i < backticks.length; i++) {
        let backtick = backticks[i];
        if (!backtick) continue;
        let success = false;
        for (let si = i + 1; si < backticks.length; si++) {
          let ending = backticks[si];
          if (!ending) continue;
          if (ending.count === backtick.count) {
            if (backtick.count > 1) CHAR_MAP.discard_immediately(char_map_line, char_map_idx + ending.start + 1, backtick.count - 1);
            if (backtick.count > 1) CHAR_MAP.discard_immediately(char_map_line, char_map_idx + backtick.start + backtick.count - 1, backtick.count - 1);
            modifiers.push(InlineModifer.new_replace(ending.start, backtick.count, "</mark>\u200B"));
            modifiers.push(InlineModifer.new_replace(backtick.start, backtick.count, "<mark>\u200B"));
            i = si;
            success = true;
            break;
          }
        }
        if (success) continue;
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "^";
    }
  };
  var Underlined = class extends InlineParser {
    static parse(input, CHAR_MAP, char_map_line, char_map_idx, options) {
      if (!input.includes("=")) return [];
      let equal_signs = [];
      let count = 0;
      let modifiers = [];
      for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) === "=") {
          let start = i;
          i++;
          count = 1;
          while (input.charAt(i) === "=") {
            count++;
            i++;
            if (count >= 3) continue;
          }
          if (count !== 2) continue;
          equal_signs.push({
            "count": count,
            "start": start
          });
        }
      }
      if (equal_signs.length === 0) return [];
      for (let i = 0; i < equal_signs.length; i++) {
        let squiggle = equal_signs[i];
        if (!squiggle) continue;
        let success = false;
        for (let si = i + 1; si < equal_signs.length; si++) {
          let ending = equal_signs[si];
          if (!ending) continue;
          if (ending.count === squiggle.count) {
            modifiers.push(InlineModifer.new_replace(ending.start, squiggle.count, "</u>", true));
            modifiers.push(InlineModifer.new_replace(squiggle.start, squiggle.count, "<u>", true));
            i = si;
            success = true;
            break;
          }
        }
        if (success) continue;
      }
      return modifiers;
    }
    static register_escape_chars() {
      return "=";
    }
  };
  var default_options = {
    "enabled_features": [
      // All enabled syntax features
      Header,
      AlternateHeader,
      BlockQuote,
      Emphasis,
      UnderscoreEmphasis,
      Strikethrough,
      List,
      Code,
      CodeBlock,
      Link,
      Image,
      HorizontalRule,
      Table,
      EscapeIncompleteHtml
      // Tbh you shouldn't really disable this one since that will f*ck up your charmap when the md contains html
    ],
    "disable_paragraph_elements": false,
    // Parse paragraphs without adding the <p> elements
    "literal_mid_word_underscores": true,
    // Make sure words like hello_world_stuff stay literal and don't become italic
    "add_zero_width_space_for_cursor_positions": true,
    // Insert zero-width-spaces to differenciate between before and after styling. Useful for carret positions
    "enable_trailing_linebreaks": true,
    // Put a linebreak at the end of every line, even <h1>text<br></h1>. This is also useful for carret position
    "finalize_spaces": true,
    // Determines wheter spaces will be replaced with &nbsp; so they always show a difference
    "debug": false
    // Enable any debug logging to the console
  };
  var final_options;
  var parsers_sorted;
  function set_options(options) {
    final_options = {};
    for (const [option, value] of Object.entries(default_options)) {
      if (options[option] !== void 0) {
        final_options[option] = options[option];
      } else {
        final_options[option] = default_options[option];
      }
    }
    verify_options(final_options);
    if (!final_options.enabled_features) return;
    parsers_sorted = final_options.enabled_features.sort((a, b) => b.PRIORITY - a.PRIORITY);
    clear_cache();
  }
  function parse(text2) {
    if (final_options?.debug) console.log("CACHE", structuredClone(cache));
    if (!final_options) set_options(default_options);
    if (final_options?.debug) console.log("CACHE", structuredClone(cache));
    let lines = parse_to_lines(text2);
    if (final_options?.debug) console.log("CACHE", structuredClone(cache));
    let cached = parse_cache(lines, final_options);
    if (final_options?.debug) console.log("CACHED:", cached);
    if (final_options?.debug) console.log("CACHE BEFORE CHARMAP", structuredClone(cache));
    let CHAR_MAP = CharMap.from_cache(lines, cached);
    if (final_options?.debug) console.log("CACHE", structuredClone(cache));
    const ast = gen_ast(lines, cached, CHAR_MAP, parsers_sorted, final_options);
    if (final_options?.debug) console.log("CACHE", structuredClone(cache));
    const html2 = process_ast(ast, cached, CHAR_MAP, parsers_sorted, final_options);
    if (final_options?.debug) console.log("AST:", ast);
    cache_char_map(CHAR_MAP);
    if (final_options?.debug) console.log("CACHE", structuredClone(cache));
    return {
      "html": html2,
      "char_map": CHAR_MAP.absolute_map()
    };
  }
  function parse_to_lines(text2) {
    const lines = [];
    let start = 0;
    for (let i = 0; i < text2.length; i++) {
      if (text2.charCodeAt(i) === 10) {
        lines.push(text2.slice(start, i + 1));
        start = i + 1;
      }
    }
    if (start < text2.length) {
      lines.push(text2.slice(start));
    }
    if (!lines[lines.length - 1]?.endsWith("\n")) lines[lines.length - 1] += "\n";
    return lines;
  }
  function gen_ast(lines, cached, CHAR_MAP, parsers, options) {
    for (const parser of parsers) {
      parser.init();
    }
    let ast = [];
    let last_ast_node = null;
    for (let idx = 0; idx < lines.length; idx++) {
      let line = lines[idx];
      let curr_entry = cached.entries[idx];
      if (!curr_entry || !line) continue;
      if (curr_entry.type === "node") {
        if (!curr_entry.output) throw Error("[YAMP]: Cached AST node doesn't have a valid output!");
        ast.push({ "type": "cached", "output": curr_entry.output, "line_idx": idx });
        if (curr_entry.line_count) idx += curr_entry.line_count - 1;
        if (last_ast_node !== null && last_ast_node instanceof MultilineParser) {
          if (final_options?.debug) console.log(last_ast_node);
          last_ast_node.finish();
          last_ast_node = null;
        }
        continue;
      }
      const parsed = parse_single_line(line, CHAR_MAP, lines, idx, ast, parsers, options);
      if (idx === lines.length - 1) {
        if (parsed instanceof MultilineParser) {
          parsed.finish();
        } else if (parsed === Parser.EXTEND && last_ast_node instanceof MultilineParser) {
          last_ast_node.finish();
        }
      }
      if (parsed !== Parser.EXTEND) {
        if (last_ast_node !== null && last_ast_node instanceof MultilineParser && last_ast_node.constructor !== parsed.constructor) {
          if (final_options?.debug) console.log(last_ast_node);
          if (final_options?.debug) console.log(parsed);
          last_ast_node.finish();
          last_ast_node = null;
        }
        last_ast_node = parsed;
        ast.push(parsed);
        parsed.line_idx = idx;
      }
      cache_ast_node(idx, line, parsed);
    }
    return ast;
  }
  function parse_single_line(line, CHAR_MAP, lines, idx, ast, parsers, options) {
    if (parsers.length > 0) {
      for (const parser of parsers) {
        if (IsTypeOf.SingleLineParserClass(parser) || IsTypeOf.MultilineParserClass(parser)) {
          CHAR_MAP.cancel_que();
          let parsed = parser.parse(line, lines, idx, CHAR_MAP, idx, 0, ast, parsers, options);
          if (parsed === null) throw new Error(`[YAMP]: Failed to build ast, parser ${parser} doesn't implement required method parse()!`);
          if (parsed !== Parser.FAIL) return parsed;
        }
      }
    }
    return Paragraph.parse(line, lines, idx, CHAR_MAP, idx, 0, ast, parsers, options);
  }
  function process_ast(ast, cached, CHAR_MAP, parsers, options) {
    let out = "";
    for (let i = 0; i < ast.length; i++) {
      let node = ast[i];
      let segment;
      if (!node) continue;
      if (IsTypeOf.cachedAstNode(node)) {
        segment = node.output;
      } else {
        segment = node.generate(options);
        if (!segment) continue;
        if (options.finalize_spaces !== false) segment = finalize_spaces(segment);
        cache_output(node.line_idx, segment);
      }
      if (segment == null) throw new Error(`[YAMP]: Failed to generate output, parser ${node.constructor.name} doesn't implement required method generate()!`);
      out += segment;
    }
    return out;
  }
  var cache = {
    "entries": [],
    "char_map": []
  };
  function clear_cache() {
    cache = {
      "entries": [],
      "char_map": []
    };
  }
  function parse_cache(lines, options) {
    let output = cache.entries.slice(0, lines.length);
    let char_map = cache.char_map.slice(0, lines.length);
    let prev_node_idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (cache.entries.length <= i) {
        output[i] = { "type": "parse_again" };
        char_map[i] = null;
      }
      let entry = cache.entries[i];
      if (!(entry && entry.type !== "parse_again" && entry.input && lines[i] === entry.input)) {
        if (!entry || entry.type !== "extend") {
          output[i] = { "type": "parse_again" };
          char_map[i] = null;
        }
        if (prev_node_idx >= 0) {
          let line_idx = prev_node_idx;
          if (final_options?.debug) console.log(line_idx, i);
          while (entry && entry.type === "extend" || line_idx < i) {
            output[line_idx] = { "type": "parse_again" };
            char_map[line_idx] = null;
            line_idx++;
            entry = cache.entries[line_idx];
          }
          entry = cache.entries[i];
          if (final_options?.debug) console.log(line_idx, i);
        }
      }
      if (entry && entry.type === "node") prev_node_idx = i;
    }
    while (cache.entries.length < lines.length) {
      cache.entries.push({ "type": "parse_again" });
    }
    return {
      "entries": output,
      "char_map": char_map
    };
  }
  var last_node_idx = 0;
  function cache_ast_node(line_idx, input, parsed) {
    if (final_options?.debug) console.log("APPLY", line_idx, input, parsed);
    if (parsed === Parser.EXTEND && cache && cache.entries.length > 0) {
      let last_node = cache.entries[last_node_idx];
      if (last_node && last_node.type === "node") last_node.line_count = last_node.line_count ? last_node.line_count + 1 : 1;
      cache.entries[line_idx] = {
        "type": "extend",
        "input": input
      };
    } else {
      last_node_idx = line_idx;
      cache.entries[line_idx] = {
        "type": "node",
        "input": input,
        "line_count": 1
      };
    }
  }
  function cache_output(line_idx, output) {
    let entry = cache.entries[line_idx];
    if (!entry || entry.type !== "node") return console.warn("[YAMP]: Whoops an extend line somehow got a corresponding output. Please report this as an issue.");
    entry.output = output;
  }
  function cache_char_map(char_map) {
    cache.char_map = char_map.get_copy();
  }
  function finalize_spaces(input) {
    let inside_html = false;
    let out = "";
    for (let i = 0; i < input.length; i++) {
      let char = input.charAt(i);
      if (char === "<") {
        for (let si = i; si < input.length; si++) {
          if (input.charAt(si) === ">") {
            out += input.slice(i, si);
            i = si - 1;
            break;
          }
        }
      } else if (char === " ") {
        out += "&nbsp;";
      } else {
        out += char;
      }
    }
    return out;
  }
  function verify_options(options) {
    if (!(options.enabled_features instanceof Array)) {
      throw new Error("[YAMP]: failed to parse, invalid options! Field 'enabled_features' must be of type array");
    }
    for (const parser of options.enabled_features) {
      if (!(parser.prototype instanceof Parser)) throw Error(`[YAMP]: Parser entries must be instance of Parser but found: ${parser}`);
    }
    if (options.disable_paragraph_elements !== true && options.disable_paragraph_elements !== false) {
      throw new Error("[YAMP]: failed to parse, invalid options! Field 'disable_paragraph_elements' must be of type boolean");
    }
    if (options.add_zero_width_space_for_cursor_positions !== true && options.add_zero_width_space_for_cursor_positions !== false) {
      throw new Error("[YAMP]: failed to parse, invalid options! Field 'add_zero_width_space_for_cursor_positions' must be of type boolean");
    }
    if (options.enable_trailing_linebreaks !== true && options.enable_trailing_linebreaks !== false) {
      throw new Error("[YAMP]: failed to parse, invalid options! Field 'enable_trailing_linebreaks' must be of type boolean");
    }
    if (options.finalize_spaces !== true && options.finalize_spaces !== false) {
      throw new Error("[YAMP]: failed to parse, invalid options! Field 'finalize_spaces' must be of type boolean");
    }
    if (options.debug !== true && options.debug !== false) {
      throw new Error("[YAMP]: failed to parse, invalid options! Field 'debug' must be of type boolean");
    }
  }

  // src/prismjs_highlight/mcfunction.ts
  var import_prismjs = __toESM(require_prism(), 1);
  import_prismjs.default.languages.mcfunction = {
    "comment": /^#.*/gm,
    "keyword": {
      "pattern": /(?<=run\s|^\s*?)(?:advancement|attribute|ban|ban-ip|banlist|bossbar|clear|clone|damage|data|datapack|debug|defaultgamemode|deop|difficulty|effect|enchant|execute|experience|fill|fillbiome|forceload|function|gamemode|gamerule|give|help|item|jfr|kick|kill|list|locate|loot|me|msg|op|pardon|pardon-ip|particle|perf|place|playsound|publish|random|recipe|reload|return|ride|rotate|save-all|save-off|save-on|say|schedule|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spectate|spreadplayers|stop|stopsound|summon|tag|team|teammsg|teleport|tell|tellraw|tick|time|title|tm|tp|transfer|trigger|warden_spawn_tracker|weather|whitelist|worldborder|xp)\b/gm,
      "lookbehind": true
    },
    "selector": /@[anspre]/gm,
    "namespace": /\b\w+?:[\w\/\.]+/gm,
    "number": /\b\d+[bfdBFD]?\b/gm,
    "punctuation": /[~^\\]|\$\(|(?:\)(?<=$([^)]*)))/gm,
    "operator": /:|=|\+=|-=|\*=|%=|\/|<|>|><|entity|storage|block/gm,
    "boolean": /\b(?:false|true|1b|0b)\b/gm,
    "string": {
      "pattern": /(?:(^|[^\\])"(?:\\.|[^\\"\r\n:])*"(?!\s*:))|(?<=say).*|(?<=tag=)\w*/gm,
      "lookbehind": true,
      "greedy": true
    },
    "property": {
      "pattern": /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/gm,
      "lookbehind": true,
      "greedy": true
    },
    "variable": /\b(?:align|anchored|as|at|facing|in|on|positioned|rotated|store|summon|run|(?:if|unless)|modify|from|value)\b/gm,
    "function": {
      "pattern": /(?<=if|unless|result|success)\s(?:biome|block|blocks|data|dimension|entity|function|items|loaded|predicate|score)\b/gm,
      "lookbehind": true,
      "greedy": true
    },
    "symbol": {
      "pattern": /(?:#.+?\b)|(?<=@[anspre]\[(?:.*,)?).*?(?==)/gm,
      "lookbehind": true,
      "greedy": true
    }
  };
  import_prismjs.default.languages.mcf = {
    "comment": /^#.*/gm,
    "keyword": {
      "pattern": /(?<=run\s|^\s*?)(?:advancement|attribute|ban|ban-ip|banlist|bossbar|clear|clone|damage|data|datapack|debug|defaultgamemode|deop|difficulty|effect|enchant|execute|experience|fill|fillbiome|forceload|function|gamemode|gamerule|give|help|item|jfr|kick|kill|list|locate|loot|me|msg|op|pardon|pardon-ip|particle|perf|place|playsound|publish|random|recipe|reload|return|ride|rotate|save-all|save-off|save-on|say|schedule|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spectate|spreadplayers|stop|stopsound|summon|tag|team|teammsg|teleport|tell|tellraw|tick|time|title|tm|tp|transfer|trigger|warden_spawn_tracker|weather|whitelist|worldborder|xp)\b/gm,
      "lookbehind": true
    },
    "selector": /@[anspre]/gm,
    "namespace": /\b\w+?:[\w\/\.]+/gm,
    "number": /\b\d+[bfdBFD]?\b/gm,
    "punctuation": /[~^\\]|\$\(|(?:\)(?<=$([^)]*)))/gm,
    "operator": /:|=|\+=|-=|\*=|%=|\/|<|>|><|entity|storage|block/gm,
    "boolean": /\b(?:false|true|1b|0b)\b/gm,
    "string": {
      "pattern": /(?:(^|[^\\])"(?:\\.|[^\\"\r\n:])*"(?!\s*:))|(?<=say).*|(?<=tag=)\w*/gm,
      "lookbehind": true,
      "greedy": true
    },
    "property": {
      "pattern": /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/gm,
      "lookbehind": true,
      "greedy": true
    },
    "variable": /\b(?:align|anchored|as|at|facing|in|on|positioned|rotated|store|summon|run|(?:if|unless)|modify|from|value)\b/gm,
    "function": {
      "pattern": /(?<=if|unless|result|success)\s(?:biome|block|blocks|data|dimension|entity|function|items|loaded|predicate|score)\b/gm,
      "lookbehind": true,
      "greedy": true
    },
    "symbol": {
      "pattern": /(?:#.+?\b)|(?<=@[anspre]\[(?:.*,)?).*?(?==)/gm,
      "lookbehind": true,
      "greedy": true
    }
  };

  // node_modules/dompurify/dist/purify.es.mjs
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ;
        else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  var entries = Object.entries;
  var setPrototypeOf = Object.setPrototypeOf;
  var isFrozen = Object.isFrozen;
  var getPrototypeOf = Object.getPrototypeOf;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var freeze = Object.freeze;
  var seal = Object.seal;
  var create = Object.create;
  var _ref = typeof Reflect !== "undefined" && Reflect;
  var apply = _ref.apply;
  var construct = _ref.construct;
  if (!freeze) {
    freeze = function freeze2(x) {
      return x;
    };
  }
  if (!seal) {
    seal = function seal2(x) {
      return x;
    };
  }
  if (!apply) {
    apply = function apply2(func, thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return func.apply(thisArg, args);
    };
  }
  if (!construct) {
    construct = function construct2(Func) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      return new Func(...args);
    };
  }
  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var arraySplice = unapply(Array.prototype.splice);
  var arrayIsArray = Array.isArray;
  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringToString = unapply(String.prototype.toString);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);
  var numberToString = unapply(Number.prototype.toString);
  var booleanToString = unapply(Boolean.prototype.toString);
  var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
  var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
  var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  var objectToString = unapply(Object.prototype.toString);
  var regExpTest = unapply(RegExp.prototype.test);
  var typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) {
        thisArg.lastIndex = 0;
      }
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    if (!arrayIsArray(array)) {
      return set;
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const _ref2 of entries(object)) {
      var _ref3 = _slicedToArray(_ref2, 2);
      const property = _ref3[0];
      const value = _ref3[1];
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (arrayIsArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function stringifyValue(value) {
    switch (typeof value) {
      case "string": {
        return value;
      }
      case "number": {
        return numberToString(value);
      }
      case "boolean": {
        return booleanToString(value);
      }
      case "bigint": {
        return bigintToString ? bigintToString(value) : "0";
      }
      case "symbol": {
        return symbolToString ? symbolToString(value) : "Symbol()";
      }
      case "undefined": {
        return objectToString(value);
      }
      case "function":
      case "object": {
        if (value === null) {
          return objectToString(value);
        }
        const valueAsRecord = value;
        const valueToString = lookupGetter(valueAsRecord, "toString");
        if (typeof valueToString === "function") {
          const stringified = valueToString(valueAsRecord);
          return typeof stringified === "string" ? stringified : objectToString(stringified);
        }
        return objectToString(value);
      }
      default: {
        return objectToString(value);
      }
    }
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  function isRegex(value) {
    try {
      regExpTest(value, "");
      return true;
    } catch (_unused) {
      return false;
    }
  }
  var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
  var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
  var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
  var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
  var text = freeze(["#text"]);
  var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
  var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "pointer-events", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "vector-effect", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
  var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
  var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  var IS_ALLOWED_URI = seal(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(
    /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
    // eslint-disable-line no-control-regex
  );
  var DOCTYPE_NAME = seal(/^html$/i);
  var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
  var COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
  var FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
  var SELF_CLOSING_TAG = seal(/\/>/i);
  var NODE_TYPE = {
    element: 1,
    attribute: 2,
    text: 3,
    cdataSection: 4,
    entityReference: 5,
    // Deprecated
    entityNode: 6,
    // Deprecated
    processingInstruction: 7,
    comment: 8,
    document: 9,
    documentType: 10,
    documentFragment: 11,
    notation: 12
    // Deprecated
  };
  var LITERAL_TEXT_ELEMENT_NAMES = ["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"];
  var LITERAL_TEXT_ELEMENTS = freeze(addToSet({}, LITERAL_TEXT_ELEMENT_NAMES));
  var LITERAL_TEXT_CLOSE = (function() {
    const map = {};
    arrayForEach(LITERAL_TEXT_ELEMENT_NAMES, (name) => {
      map[name] = seal(new RegExp("</" + name + "(?=[\\t\\n\\f\\r />])", "i"));
    });
    return freeze(map);
  })();
  var getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
      return null;
    }
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  var _createHooksMap = function _createHooksMap2() {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
  };
  var _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
    return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
  };
  var _resolveObjectOption = function _resolveObjectOption2(cfg, key, makeFallback) {
    const value = objectHasOwnProperty(cfg, key) ? cfg[key] : void 0;
    return value && typeof value === "object" ? clone(value) : makeFallback();
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.4.14";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let document2 = window2.document;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    window2.DocumentFragment;
    const HTMLTemplateElement = window2.HTMLTemplateElement, Node2 = window2.Node, Element2 = window2.Element, NodeFilter2 = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap;
    _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap;
    window2.HTMLFormElement;
    const DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
    const ElementPrototype = Element2.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
    const getAttributes = lookupGetter(ElementPrototype, "attributes");
    const getNodeType = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeType") : null;
    const getNodeName = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeName") : null;
    const getOwnerDocument = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "ownerDocument") : null;
    const _readNodeType = function _readNodeType2(node) {
      return getNodeType ? getNodeType(node) : node.nodeType;
    };
    const _readNodeName = function _readNodeName2(node) {
      return getNodeName ? getNodeName(node) : node.nodeName;
    };
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    let defaultTrustedTypesPolicy;
    let defaultTrustedTypesPolicyResolved = false;
    let IN_TRUSTED_TYPES_POLICY = 0;
    const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
      if (IN_TRUSTED_TYPES_POLICY > 0) {
        throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
      }
    };
    const _createTrustedHTML = function _createTrustedHTML2(html2) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createHTML(html2);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createScriptURL(scriptUrl);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
      if (!defaultTrustedTypesPolicyResolved) {
        defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        defaultTrustedTypesPolicyResolved = true;
      }
      return defaultTrustedTypesPolicy;
    };
    const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
    const importNode = originalDocument.importNode;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
    let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let SET_CONFIG_ALLOWED_TAGS = null;
    let SET_CONFIG_ALLOWED_ATTR = null;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",
      // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
      // the UA (customizable <select>) — including any on* handlers — and the
      // engine re-mirrors synchronously whenever a removal changes which
      // option/selectedcontent is current, even inside DOMPurify's inert
      // DOMParser document. Hoisting its children on removal re-inserts a fresh
      // mirror target ahead of the walk, which the engine refills, looping
      // forever (DoS) and amplifying output. Dropping its content on removal
      // (rather than hoisting) breaks that cascade; the content is a duplicate
      // of the option, which is sanitized on its own. See campaign-3 F1/F6.
      "selectedcontent",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp"
    ]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze(["mi", "mo", "mn", "ms", "mtext"]);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, {
        transform: transformCaseFunc
      });
      ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, {
        transform: transformCaseFunc
      });
      ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, {
        transform: stringToString
      });
      URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
        transform: transformCaseFunc,
        base: DEFAULT_URI_SAFE_ATTRIBUTES
      });
      DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
        transform: transformCaseFunc,
        base: DEFAULT_DATA_URI_TAGS
      });
      FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, {
        transform: transformCaseFunc
      });
      FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), {
        transform: transformCaseFunc
      });
      FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), {
        transform: transformCaseFunc
      });
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
      NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = _resolveObjectOption(
        cfg,
        "MATHML_TEXT_INTEGRATION_POINTS",
        () => addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS)
        // Default built-in map
      );
      HTML_INTEGRATION_POINTS = _resolveObjectOption(
        cfg,
        "HTML_INTEGRATION_POINTS",
        () => addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS)
        // Default built-in map
      );
      const customElementHandling = _resolveObjectOption(cfg, "CUSTOM_ELEMENT_HANDLING", () => create(null));
      CUSTOM_ELEMENT_HANDLING = create(null);
      if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
      }
      seal(CUSTOM_ELEMENT_HANDLING);
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = create(null);
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      EXTRA_ELEMENT_HANDLING.tagCheck = null;
      EXTRA_ELEMENT_HANDLING.attributeCheck = null;
      if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
        if (typeof cfg.ADD_TAGS === "function") {
          EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        } else if (arrayIsArray(cfg.ADD_TAGS)) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
        if (typeof cfg.ADD_ATTR === "function") {
          EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        } else if (arrayIsArray(cfg.ADD_ATTR)) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        const previousTrustedTypesPolicy = trustedTypesPolicy;
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        try {
          emptyHTML = _createTrustedHTML("");
        } catch (error) {
          trustedTypesPolicy = previousTrustedTypesPolicy;
          throw error;
        }
      } else if (cfg.TRUSTED_TYPES_POLICY === null) {
        trustedTypesPolicy = void 0;
        emptyHTML = "";
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
        }
        if (trustedTypesPolicy && typeof emptyHTML === "string") {
          emptyHTML = _createTrustedHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    };
    const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    };
    const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    };
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        return _checkSvgNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        return _checkMathMlNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        return _checkHtmlNamespace(tagName, parent, parentTagName);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        getParentNode(node).removeChild(node);
      } catch (_) {
        remove(node);
        if (!getParentNode(node)) {
          throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
        }
      }
    };
    const _stripAttributeNode = function _stripAttributeNode2(element, attribute, name) {
      try {
        element.removeAttributeNode(attribute);
      } catch (_) {
        try {
          element.removeAttribute(name);
        } catch (_2) {
        }
      }
    };
    const _neutralizeRoot = function _neutralizeRoot2(root) {
      _neutralizeSubtree(root);
      const childNodes = getChildNodes(root);
      if (childNodes) {
        const snapshot = [];
        arrayForEach(childNodes, (child) => {
          arrayPush(snapshot, child);
        });
        arrayForEach(snapshot, (child) => {
          try {
            remove(child);
          } catch (_) {
          }
        });
      }
      const attributes = getAttributes(root);
      if (attributes) {
        for (let i = attributes.length - 1; i >= 0; --i) {
          const attribute = attributes[i];
          const name = attribute && attribute.name;
          if (typeof name === "string") {
            _stripAttributeNode(root, attribute, name);
          }
        }
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element, attr) {
      if (!attr) {
        try {
          attr = element.getAttributeNode(name);
        } catch (_) {
          attr = null;
        }
      }
      arrayPush(DOMPurify.removed, {
        attribute: attr || null,
        from: element
      });
      try {
        if (attr) {
          element.removeAttributeNode(attr);
        } else {
          element.removeAttribute(name);
        }
      } catch (_) {
        try {
          element.removeAttribute(name);
        } catch (_2) {
        }
      }
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_) {
          }
        } else {
          try {
            element.setAttribute(name, "");
          } catch (_) {
          }
        }
      }
    };
    const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element) {
      const attributes = getAttributes(element);
      if (!attributes) {
        return;
      }
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) {
          continue;
        }
        _stripAttributeNode(element, attribute, name);
      }
    };
    const _neutralizeSubtree = function _neutralizeSubtree2(root) {
      const stack = [root];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeType = _readNodeType(node);
        if (nodeType === NODE_TYPE.element) {
          _stripDisallowedAttributes(node);
        }
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push(childNodes[i]);
          }
        }
      }
    };
    const _isPatchLinkageAttribute = function _isPatchLinkageAttribute2(lcName, lcTag) {
      if (!SAFE_FOR_XML) {
        return false;
      }
      if (lcName === "patchsrc") {
        return true;
      }
      return lcName === "for" && lcTag !== "label" && lcTag !== "output";
    };
    const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root) {
      if (!SAFE_FOR_XML) {
        return;
      }
      const stack = [root];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeType = _readNodeType(node);
        if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
          try {
            remove(node);
          } catch (_) {
          }
          continue;
        }
        if (nodeType === NODE_TYPE.element) {
          const element = node;
          const lcTag = transformCaseFunc(_readNodeName(node));
          try {
            if (element.hasAttribute && element.hasAttribute("patchsrc")) {
              element.removeAttribute("patchsrc");
            }
            if (element.hasAttribute && element.hasAttribute("for") && _isPatchLinkageAttribute("for", lcTag)) {
              element.removeAttribute("for");
            }
          } catch (_) {
          }
        }
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push(childNodes[i]);
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {
        }
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
      return createNodeIterator.call(
        doc || root,
        root,
        // eslint-disable-next-line no-bitwise
        NodeFilter2.SHOW_ELEMENT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_PROCESSING_INSTRUCTION | NodeFilter2.SHOW_CDATA_SECTION,
        null
      );
    };
    const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
      value = stringReplace(value, MUSTACHE_EXPR$1, " ");
      value = stringReplace(value, ERB_EXPR$1, " ");
      value = stringReplace(value, TMPLIT_EXPR$1, " ");
      return value;
    };
    const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
      var _node$querySelectorAl;
      node.normalize();
      const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
      const walker = createNodeIterator.call(
        doc || node,
        node,
        // eslint-disable-next-line no-bitwise
        NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_CDATA_SECTION | NodeFilter2.SHOW_PROCESSING_INSTRUCTION,
        null
      );
      let currentNode = walker.nextNode();
      while (currentNode) {
        currentNode.data = _stripTemplateExpressions(currentNode.data);
        currentNode = walker.nextNode();
      }
      const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
      if (templates) {
        arrayForEach(templates, (tmpl) => {
          if (_isDocumentFragment(tmpl.content)) {
            _scrubTemplateExpressions2(tmpl.content);
          }
        });
      }
    };
    const _isClobbered = function _isClobbered2(element) {
      const realTagName = getNodeName ? getNodeName(element) : null;
      if (typeof realTagName !== "string") {
        return false;
      }
      if (transformCaseFunc(realTagName) !== "form") {
        return false;
      }
      return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || // Realm-safe NamedNodeMap detection: equality against the cached
      // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
      // makes the direct read diverge from the cached read; a clean form
      // (same-realm OR foreign-realm) has both reads pointing at the same
      // canonical NamedNodeMap.
      element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
      // returns the integer 1 for any Element regardless of realm; direct
      // read on a clobbered form (e.g. <input name="nodeType">) returns
      // the named child element. Cheap addition — nodeType is read from
      // an internal slot, no serialization cost — and removes a residual
      // clobbering surface used by several mXSS / PI / comment branches
      // in _sanitizeElements that compare currentNode.nodeType directly.
      element.nodeType !== getNodeType(element) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
      // "childNodes" shadows the prototype getter. Direct reads of
      // form.childNodes from a clobbered form return the named child
      // instead of the real NodeList, so any walk that reads it directly
      // skips the form's real children. Compare the direct read to the
      // cached Node.prototype getter — when the form's named-property
      // getter intercepts the read, the two values differ and we flag
      // the form. This catches every clobbering child type (input,
      // select, etc.) regardless of whether the named child happens to
      // carry a numeric .length, which a typeof-based probe would miss
      // (e.g. HTMLSelectElement.length is a defined unsigned-long).
      element.childNodes !== getChildNodes(element);
    };
    const _isDocumentFragment = function _isDocumentFragment2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return getNodeType(value) === NODE_TYPE.documentFragment;
      } catch (_) {
        return false;
      }
    };
    const _isNode = function _isNode2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return typeof getNodeType(value) === "number";
      } catch (_) {
        return false;
      }
    };
    function _executeHooks(hooks2, currentNode, data) {
      if (hooks2.length === 0) {
        return;
      }
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && LITERAL_TEXT_ELEMENTS[tagName] && (_isNode(currentNode.firstElementChild) || typeof currentNode.textContent === "string" && regExpTest(LITERAL_TEXT_CLOSE[tagName], currentNode.textContent))) {
        return true;
      }
      if (currentNode.nodeType === NODE_TYPE.processingInstruction) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) {
        return true;
      }
      return false;
    };
    const _matchesNameCheck = function _matchesNameCheck2(check, name) {
      if (check instanceof RegExp) {
        return regExpTest(check, name);
      }
      if (check instanceof Function) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        return Boolean(check(name, ...args));
      }
      return false;
    };
    const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName, root) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
        return false;
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode);
        const childNodes = getChildNodes(currentNode);
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
            parentNode.insertBefore(hoisted, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    };
    const _forkSharedAllowlist = function _forkSharedAllowlist2(hookList, set, defaultSet, setConfigSet) {
      if (hookList.length === 0) {
        return set;
      }
      return set === defaultSet || set === setConfigSet ? clone(set) : set;
    };
    const _handleHookDetachedNode = function _handleHookDetachedNode2(currentNode, root) {
      if (currentNode === root || getParentNode(currentNode) !== null) {
        return false;
      }
      if (IN_PLACE) {
        _neutralizeSubtree(currentNode);
      }
      return true;
    };
    const _sanitizeElements = function _sanitizeElements2(currentNode, root) {
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (_handleHookDetachedNode(currentNode, root)) {
        return true;
      }
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(_readNodeName(currentNode));
      ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (_handleHookDetachedNode(currentNode, root)) {
        return true;
      }
      if (_isUnsafeNode(currentNode, tagName)) {
        _forceRemove(currentNode);
        return true;
      }
      if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
        const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
        if (removed === false) {
          _executeHooks(hooks.afterSanitizeElements, currentNode, null);
        }
        return removed;
      }
      const nt = _readNodeType(currentNode);
      if (nt === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        const content = _stripTemplateExpressions(currentNode.textContent);
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (FORBID_ATTR[lcName]) {
        return false;
      }
      if (_isPatchLinkageAttribute(lcName, lcTag)) {
        return false;
      }
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) {
        return true;
      }
      if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) {
        return true;
      }
      if (!nameIsPermitted) {
        return (
          // Condition a) covers a basically valid custom element tag name whose
          // tag passes the configured tagNameCheck and whose attribute name
          // passes the configured attributeNameCheck ...
          _isBasicCustomElement(lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName, lcTag) || // Condition b) covers an `is` attribute whose value passes the
          // configured tagNameCheck while customized built-in elements are
          // allowed.
          lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value)
        );
      }
      if (URI_SAFE_ATTRIBUTES[lcName]) {
        return true;
      }
      if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) {
        return true;
      }
      if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) {
        return true;
      }
      if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) {
        return true;
      }
      return !value;
    };
    const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]);
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
    };
    const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) {
        switch (trustedTypes.getAttributeType(lcTag, lcName)) {
          case "TrustedHTML": {
            return _createTrustedHTML(value);
          }
          case "TrustedScriptURL": {
            return _createTrustedScriptURL(value);
          }
        }
      }
      return value;
    };
    const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
      try {
        if (namespaceURI) {
          currentNode.setAttributeNS(namespaceURI, name, value);
        } else {
          currentNode.setAttribute(name, value);
        }
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
        } else {
          arrayPop(DOMPurify.removed);
        }
      } catch (_) {
        _removeAttribute(name, currentNode);
      }
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      const attributes = currentNode.attributes;
      if (!attributes || _isClobbered(currentNode)) {
        return;
      }
      ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      const lcTag = transformCaseFunc(currentNode.nodeName);
      while (l--) {
        const attr = attributes[l];
        const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
          _removeAttribute(name, currentNode, attr);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (lcName === "attributename" && stringMatch(value, "href")) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          value = _stripTemplateExpressions(value);
        }
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
        if (value !== initValue) {
          _setAttributeValue(currentNode, name, namespaceURI, value);
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    };
    const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode, fragment);
        _sanitizeAttributes(shadowNode);
        if (_isDocumentFragment(shadowNode.content)) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
        if (_readNodeType(shadowNode) === NODE_TYPE.element) {
          const innerSr = getShadowRoot(shadowNode);
          if (_isDocumentFragment(innerSr)) {
            _sanitizeAttachedShadowRoots(innerSr);
            _sanitizeShadowDOM2(innerSr);
          }
        }
      }
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
      const stack = [{
        node: root,
        shadow: null
      }];
      while (stack.length > 0) {
        const item = stack.pop();
        if (item.shadow) {
          _sanitizeShadowDOM2(item.shadow);
          continue;
        }
        const node = item.node;
        const nodeType = _readNodeType(node);
        const isElement = nodeType === NODE_TYPE.element;
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push({
              node: childNodes[i],
              shadow: null
            });
          }
        }
        if (isElement) {
          const rootName = getNodeName ? getNodeName(node) : null;
          if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
            const content = node.content;
            if (_isDocumentFragment(content)) {
              stack.push({
                node: content,
                shadow: null
              });
            }
          }
        }
        if (isElement) {
          const sr = getShadowRoot(node);
          if (_isDocumentFragment(sr)) {
            stack.push({
              node: null,
              shadow: sr
            }, {
              node: sr,
              shadow: null
            });
          }
        }
      }
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        dirty = stringifyValue(dirty);
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (SET_CONFIG) {
        ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
        ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
      } else {
        _parseConfig(cfg);
      }
      if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }
      if (hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      DOMPurify.removed = [];
      const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
      if (inPlace) {
        _neutralizePatchLinkage(dirty);
        const nn = _readNodeName(dirty);
        if (typeof nn === "string") {
          const tagName = transformCaseFunc(nn);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            _neutralizeRoot(dirty);
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
        if (_isClobbered(dirty)) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
        }
        try {
          _sanitizeAttachedShadowRoots(dirty);
        } catch (error) {
          _neutralizeRoot(dirty);
          throw error;
        }
      } else if (_isNode(dirty)) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
        _sanitizeAttachedShadowRoots(importedNode);
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const walkRoot = inPlace ? dirty : body;
      try {
        const nodeIterator = _createNodeIterator(walkRoot);
        while (currentNode = nodeIterator.nextNode()) {
          _sanitizeElements(currentNode, walkRoot);
          _sanitizeAttributes(currentNode);
          if (_isDocumentFragment(currentNode.content)) {
            _sanitizeShadowDOM2(currentNode.content);
          }
        }
      } catch (error) {
        if (inPlace) {
          _neutralizeRoot(dirty);
          arrayForEach(DOMPurify.removed, (entry) => {
            if (entry.element) {
              _neutralizeSubtree(entry.element);
            }
          });
        }
        throw error;
      }
      if (inPlace) {
        arrayForEach(DOMPurify.removed, (entry) => {
          if (entry.element) {
            _neutralizeSubtree(entry.element);
          }
        });
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(dirty);
        }
        return dirty;
      }
      if (RETURN_DOM) {
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(body);
        }
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = _stripTemplateExpressions(serializedHTML);
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
      SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
      SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
      SET_CONFIG_ALLOWED_TAGS = null;
      SET_CONFIG_ALLOWED_ATTR = null;
      trustedTypesPolicy = defaultTrustedTypesPolicy;
      emptyHTML = "";
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return void 0;
      }
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();

  // src/selection.ts
  var EditorSelection = class {
    #start = 0;
    #end = 0;
    #parent_element;
    #selection_mask;
    #visible = false;
    #mobile_mode = false;
    #on_thumb_down;
    #elems = [];
    constructor(parent, selection_mask, start, end, mobile_mode = false, on_thumb_down = () => {
    }) {
      this.#start = start;
      this.#end = end;
      this.#parent_element = parent;
      this.#selection_mask = selection_mask;
      this.#mobile_mode = mobile_mode;
      this.#on_thumb_down = on_thumb_down;
    }
    // -------------------------------
    //  Visiblity                            
    // -------------------------------
    apply() {
      this.#visible = true;
      this.update_render();
    }
    discard() {
      this.#visible = false;
      this.update_render();
    }
    // -------------------------------
    //  Range handeling                            
    // -------------------------------
    set_start(position) {
      this.#start = position;
      this.update_render();
    }
    set_end(position) {
      this.#end = position;
      this.update_render();
    }
    // -------------------------------
    //  Getters                            
    // -------------------------------
    // Lower and higher selection bounds
    get lo() {
      return Math.min(this.#start, this.#end);
    }
    get hi() {
      return Math.max(this.#start, this.#end);
    }
    get end() {
      return this.#end;
    }
    get start() {
      return this.#start;
    }
    get visible() {
      return this.#visible;
    }
    get length() {
      return Math.abs(this.#start - this.#end);
    }
    get is_mobile() {
      return this.#mobile_mode;
    }
    // -------------------------------
    //  Rendering                            
    // -------------------------------
    update_render() {
      for (const elem of this.#elems) {
        elem.remove();
      }
      if (this.#visible) {
        const start_node = this.#cursor_pos_to_node(Math.min(this.#start, this.#end));
        const end_node = this.#cursor_pos_to_node(Math.max(this.#start, this.#end));
        if (start_node === null || end_node === null) return;
        const range = document.createRange();
        console.log(start_node, end_node);
        range.setStart(start_node.node, start_node.offset);
        range.setEnd(end_node.node, end_node.offset);
        const parent_rect = this.#parent_element.getBoundingClientRect();
        const rects = range.getClientRects();
        for (const rect of rects) {
          const elem = document.createElement("div");
          elem.classList.add("infill-selection");
          elem.style.left = `${rect.left - parent_rect.left}px`;
          elem.style.top = `${rect.top - parent_rect.top}px`;
          elem.style.width = `${rect.width}px`;
          elem.style.height = `${rect.height}px`;
          this.#selection_mask.appendChild(elem);
          this.#elems.push(elem);
        }
        if (this.#mobile_mode && rects.length > 0) {
          const start = rects[0];
          const end = rects[rects.length - 1];
          if (end === void 0 || start === void 0) return;
          const select_start_thumb = document.createElement("div");
          select_start_thumb.classList.add("infill-editor-select-thumb", "infill-start");
          select_start_thumb.style.left = `${start.left - parent_rect.left - start.height * 1.5}px`;
          select_start_thumb.style.top = `${start.top - parent_rect.top - 10}px`;
          select_start_thumb.style.height = `${start.height * 1.5}px`;
          select_start_thumb.style.width = `${start.height * 1.5}px`;
          select_start_thumb.addEventListener("pointerdown", (e) => this.#on_thumb_down(e, "start"));
          const select_end_thumb = document.createElement("div");
          select_end_thumb.classList.add("infill-editor-select-thumb", "infill-end");
          select_end_thumb.style.left = `${end.right - parent_rect.left - 20}px`;
          select_end_thumb.style.top = `${end.top - parent_rect.top - 10}px`;
          select_end_thumb.style.height = `${end.height * 1.5}px`;
          select_end_thumb.style.width = `${end.height * 1.5}px`;
          select_end_thumb.addEventListener("pointerdown", (e) => this.#on_thumb_down(e, "end"));
          this.#selection_mask.appendChild(select_start_thumb);
          this.#selection_mask.appendChild(select_end_thumb);
          this.#elems.push(select_start_thumb);
          this.#elems.push(select_end_thumb);
        }
      }
    }
    // -------------------------------
    //  Utilities                            
    // -------------------------------
    // Get the node corresponding to the character position provided
    #cursor_pos_to_node(position) {
      if (!this.#parent_element) return null;
      const walker = document.createTreeWalker(this.#parent_element, NodeFilter.SHOW_TEXT);
      let offset = 0;
      while (true) {
        let node = walker.nextNode();
        if (!node) return null;
        if (node.nodeType === Node.TEXT_NODE) {
          const len = node.nodeValue?.length;
          if (len === void 0) continue;
          if (offset + len >= position) {
            return {
              "node": node,
              "offset": position - offset
              // Calc the local offset inside this node
            };
          }
          offset += len;
        }
      }
    }
  };

  // src/main.ts
  var import_prismjs2 = __toESM(require_prism(), 1);
  var default_options2 = {
    "nav": {
      "header": true,
      "bold": true,
      "italic": true,
      "strikethrough": true,
      "highlight": true,
      "underline": true,
      "code": true,
      "code_block": true,
      "list": true,
      "blockquote": true,
      "link": true,
      "image": true,
      "coloured": true,
      "toggle_markdown_parsing": true,
      "zoom": true,
      "export": true,
      "import": true
    },
    "enabled_features": [
      Header,
      AlternateHeader,
      BlockQuote,
      Code,
      CodeBlock,
      Color,
      Emphasis,
      Strikethrough,
      UnderscoreEmphasis,
      Highlight,
      Underlined,
      HorizontalRule,
      Image,
      Link,
      List,
      Table,
      EscapeIncompleteHtml
    ],
    "keyboard_shortcuts_enabled": true
  };
  var Editor = class {
    #parent_element;
    #options;
    #place_holder;
    #wrapper;
    #nav;
    #bott_nav;
    #bott_nav_left;
    #bott_nav_right;
    #editor;
    #input;
    #text_display;
    #selection_mask;
    #slider;
    #toggle_check;
    #history = {
      "undo_states": [],
      "redo_states": []
    };
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                         CONSTRUCTOR + HTML GEN                                                                 
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    constructor(parent_element, options = {}, width = "100%", height = "40vh", placeholder = "Enter text here, you can use markdown formatting.") {
      if (!parent_element) throw Error("[Infill]: Failed to instantiate new editor. No parent element provided!");
      this.#parent_element = parent_element;
      this.#place_holder = placeholder;
      this.#options = {};
      for (const [option, value] of Object.entries(default_options2)) {
        if (options[option] !== void 0) {
          if (typeof options[option] === "object") {
            console.log("OBJECT");
            this.#options[option] = {};
            for (const [sub_option, value2] of Object.entries(default_options2[option])) {
              if (options[option][sub_option] === void 0) {
                this.#options[option][sub_option] = default_options2[option][sub_option];
              } else {
                this.#options[option][sub_option] = options[option][sub_option];
              }
            }
          } else {
            this.#options[option] = options[option];
          }
        } else {
          this.#options[option] = default_options2[option];
        }
      }
      set_options({
        "enabled_features": this.#options.enabled_features,
        "add_zero_width_space_for_cursor_positions": true,
        "disable_paragraph_elements": false,
        "enable_trailing_linebreaks": true,
        "finalize_spaces": true,
        "literal_mid_word_underscores": true
      });
      this.#wrapper = document.createElement("div");
      this.#wrapper.classList.add("infill-editor-wrapper");
      this.#parent_element.appendChild(this.#wrapper);
      this.#wrapper.style.width = width;
      this.#wrapper.style.height = height;
      const resizeObserver = new ResizeObserver((entries2) => {
        for (const entry of entries2) {
          if (!entry.contentBoxSize) return;
          const contentBoxSize = entry.contentBoxSize[0];
          const width2 = entry.contentRect.width;
          if (width2 < 620) {
            this.#wrapper.style.height = `calc(${height} * 0.7)`;
          } else {
            this.#wrapper.style.height = height;
          }
        }
      });
      resizeObserver.observe(this.#wrapper);
      this.#nav = document.createElement("div");
      this.#nav.classList.add("infill-editor-nav");
      this.#wrapper.appendChild(this.#nav);
      let button_wrapper = document.createElement("div");
      button_wrapper.classList.add("infill-editor-nav-button-wrapper");
      this.#nav.appendChild(button_wrapper);
      let block_1 = document.createElement("div");
      block_1.classList.add("infill-editor-nav-block");
      button_wrapper.appendChild(block_1);
      if (this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("# ", "", true), "H1", `Heading 1 ${this.#options.keyboard_shortcuts_enabled ? "| CTRL H" : ""}`, "infill-align-right");
      if (this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("## ", "", true), "H2", "Heading 2", "infill-align-right");
      if (this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("### ", "", true), "H3", "Heading 3");
      if (this.#options.nav?.blockquote) this.#gen_btn(block_1, () => this.#insert_text("> ", "", true), '<i class="infill-icon infill-icon-blockquote"></i>', `Blockquote ${this.#options.keyboard_shortcuts_enabled ? "| CTRL Q" : ""}`);
      if (this.#options.nav?.code_block) this.#gen_btn(block_1, () => this.#insert_text("```", "\n```", true), '<i class="infill-icon infill-icon-codeblock"></i>', `Codeblock  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL E" : ""}`);
      if (this.#options.nav?.code) this.#gen_btn(block_1, () => this.#insert_text("``", "``", false), '<i class="infill-icon infill-icon-code"></i>', `Code  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL T" : ""}`);
      let sep_1 = document.createElement("div");
      sep_1.classList.add("infill-editor-nav-separator");
      block_1.appendChild(sep_1);
      let block_2 = document.createElement("div");
      block_2.classList.add("infill-editor-nav-block");
      button_wrapper.appendChild(block_2);
      if (this.#options.nav?.list) this.#gen_btn(block_2, () => this.#insert_text("- ", "", true), '<i class="infill-icon infill-icon-unordered-list"></i>', `Unordered list ${this.#options.keyboard_shortcuts_enabled ? "| CTRL L" : ""}`);
      if (this.#options.nav?.link) this.#gen_btn(block_2, () => this.#insert_text("1. ", "", true), '<i class="infill-icon infill-icon-ordered-list"></i>', `Ordered list | ${this.#options.keyboard_shortcuts_enabled ? "| CTRL O" : ""}`);
      if (this.#options.nav?.link) this.#gen_btn(block_2, () => this.#insert_text("[", "]()", false), '<i class="infill-icon infill-icon-link"></i>', `Link ${this.#options.keyboard_shortcuts_enabled ? "| CTRL K" : ""}`);
      if (this.#options.nav?.image) this.#gen_btn(block_2, () => this.#insert_text("![]()", "", false), '<i class="infill-icon infill-icon-image"></i>', `Picture ${this.#options.keyboard_shortcuts_enabled ? "| CTRL P" : ""}`);
      let sep_2 = document.createElement("div");
      sep_2.classList.add("infill-editor-nav-separator");
      block_2.appendChild(sep_2);
      let block_3 = document.createElement("div");
      block_3.classList.add("infill-editor-nav-block");
      button_wrapper.appendChild(block_3);
      if (this.#options.nav?.bold) this.#gen_btn(block_3, () => this.#insert_text("**", "**", false), "<strong>B</strong>", `Bold Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL B" : ""}`);
      if (this.#options.nav?.italic) this.#gen_btn(block_3, () => this.#insert_text("_", "_", false), "<em>I</em>", `Italic Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL I" : ""}`);
      if (this.#options.nav?.strikethrough) this.#gen_btn(block_3, () => this.#insert_text("~~", "~~", false), "<s>S</s>", `Strikethrough Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL S" : ""}`);
      if (this.#options.nav?.underline) this.#gen_btn(block_3, () => this.#insert_text("==", "==", false), "<u>U</u>", `Underline Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL U" : ""}`);
      if (this.#options.nav?.highlight) this.#gen_btn(block_3, () => this.#insert_text("^", "^", false), "<mark>H</mark>", `Marked Text ${this.#options.keyboard_shortcuts_enabled ? "| CTRL M" : ""}`);
      if (this.#options.nav?.coloured) this.#gen_btn(block_3, () => this.#insert_text("[|", "]", false), '<i class="infill-icon infill-icon-coloured"></i>', `Dyed Text ${this.#options.keyboard_shortcuts_enabled ? "| CTRL D" : ""}`);
      let sep_3 = document.createElement("div");
      sep_3.classList.add("infill-editor-nav-separator", "infill-end");
      block_3.appendChild(sep_3);
      let sizer = document.createElement("div");
      sizer.classList.add("infill-editor-sizer");
      this.#nav.appendChild(sizer);
      let slider_wrapper = document.createElement("div");
      slider_wrapper.classList.add("infill-slider-wrapper");
      this.#slider = document.createElement("input");
      this.#slider.setAttribute("type", "range");
      this.#slider.setAttribute("value", "50");
      this.#slider.setAttribute("value", "50");
      this.#slider.setAttribute("step", "5");
      this.#slider.setAttribute("min", "0");
      this.#slider.setAttribute("max", "100");
      this.#slider.classList.add("infill-slider");
      this.#slider.addEventListener("input", () => this.#slider_change());
      slider_wrapper.appendChild(this.#slider);
      this.#nav.appendChild(slider_wrapper);
      let toggle_wrapper = document.createElement("div");
      toggle_wrapper.classList.add("infill-toggle-wrapper");
      this.#nav.appendChild(toggle_wrapper);
      this.#toggle_check = document.createElement("input");
      this.#toggle_check.setAttribute("type", "checkbox");
      this.#toggle_check.setAttribute("checked", "");
      this.#toggle_check.classList.add("infill-toggle-check");
      this.#toggle_check.addEventListener("click", () => window.setTimeout(() => this.#click_toggle(), 100));
      this.#toggle_check.addEventListener("pointerdown", () => this.#register_focus());
      toggle_wrapper.appendChild(this.#toggle_check);
      let toggle_gutter = document.createElement("div");
      toggle_gutter.classList.add("infill-toggle-gutter");
      toggle_wrapper.appendChild(toggle_gutter);
      let toggle_gripper = document.createElement("div");
      toggle_gripper.classList.add("infill-toggle-gripper");
      toggle_wrapper.appendChild(toggle_gripper);
      this.#editor = document.createElement("div");
      this.#editor.classList.add("infill-editor");
      this.#wrapper.appendChild(this.#editor);
      this.#input = document.createElement("textarea");
      this.#input.classList.add("infill-editor-input");
      this.#input.setAttribute("name", "infill-editor-input");
      this.#input.addEventListener("beforeinput", (e) => this.#before_input(e));
      this.#input.addEventListener("input", () => this.#update_markdown_render());
      this.#input.addEventListener("blur", () => this.#update_markdown_render());
      this.#editor.appendChild(this.#input);
      this.#text_display = document.createElement("div");
      this.#text_display.classList.add("infill-editor-display");
      this.#text_display.addEventListener("pointermove", (e) => this.#editor_mouse_move(e));
      this.#text_display.addEventListener("pointerdown", (e) => e.preventDefault());
      document.addEventListener("pointerdown", (e) => this.#editor_mouse_down(e));
      document.addEventListener("pointerup", (e) => this.#editor_mouse_up(e));
      document.addEventListener("pointermove", (e) => this.#selection_thumb_move(e));
      document.addEventListener("scroll", () => this.#cancel_hold());
      this.#editor.appendChild(this.#text_display);
      this.#selection_mask = document.createElement("div");
      this.#selection_mask.classList.add("infill-editor-selection-mask");
      this.#editor.appendChild(this.#selection_mask);
      document.addEventListener("keydown", (e) => this.#on_key_down(e));
      document.addEventListener("paste", (e) => this.#paste_selection(e));
      document.addEventListener("copy", (e) => this.#copy_selection(e));
      document.addEventListener("cut", (e) => this.#cut_selection(e));
      this.#bott_nav = document.createElement("div");
      this.#bott_nav.classList.add("infill-editor-bottom-nav");
      this.#wrapper.appendChild(this.#bott_nav);
      this.#bott_nav_left = document.createElement("div");
      this.#bott_nav_left.classList.add("infill-editor-bottom-nav-left");
      this.#bott_nav.appendChild(this.#bott_nav_left);
      this.#gen_btn(this.#bott_nav_left, (e) => this.#copy_selection(navigator.clipboard), '<i class="infill-icon infill-icon-copy"></i>', "Copy | CTRL + C");
      this.#gen_btn(this.#bott_nav_left, (e) => this.#paste_selection(navigator.clipboard), '<i class="infill-icon infill-icon-paste"></i>', "Paste | CTRL + V");
      this.#gen_btn(this.#bott_nav_left, (e) => this.#cut_selection(navigator.clipboard), '<i class="infill-icon infill-icon-cut"></i>', "Cut | CTRL + X");
      let sep_4 = document.createElement("div");
      sep_4.classList.add("infill-editor-nav-separator");
      this.#bott_nav_left.appendChild(sep_4);
      this.#gen_btn(this.#bott_nav_left, (e) => this.set_cursor(Math.max(0, this.#input.selectionStart - 1)), '<i class="infill-icon infill-icon-arrow-left"></i>', "Move cursor left | Left Arrow");
      this.#gen_btn(this.#bott_nav_left, (e) => this.set_cursor(Math.min(this.#input.value.length, this.#input.selectionStart + 1)), '<i class="infill-icon infill-icon-arrow-right"></i>', "Move cursor right | Right Arrow");
      this.#bott_nav_right = document.createElement("div");
      this.#bott_nav_right.classList.add("infill-editor-bottom-nav-right");
      this.#bott_nav.appendChild(this.#bott_nav_right);
      this.#gen_btn(this.#bott_nav_right, (e) => this.#undo(e, true), '<i class="infill-icon infill-icon-undo"></i>', "Undo");
      this.#gen_btn(this.#bott_nav_right, (e) => this.#redo(e, true), '<i class="infill-icon infill-icon-redo"></i>', "Redo");
      let sep_5 = document.createElement("div");
      sep_5.classList.add("infill-editor-nav-separator");
      this.#bott_nav_right.appendChild(sep_5);
      this.#gen_btn(this.#bott_nav_right, () => this.#export_file(), '<i class="infill-icon infill-icon-export"></i>', "Export File");
      this.#gen_btn(this.#bott_nav_right, () => this.#import_file(), '<i class="infill-icon infill-icon-import"></i>', "Open File");
      this.#register_history_state();
      this.#update_markdown_render();
    }
    // -------------------------------
    //  Generate the html for a btn                            
    // -------------------------------
    #gen_btn(parent_element, on_click, inner, tooltip, ...css_classes) {
      let btn = document.createElement("div");
      btn.innerHTML = inner;
      btn.setAttribute("data-infill-tooltip", tooltip);
      btn.classList.add("infill-nav-btn", "infill-tooltip", ...css_classes);
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
      });
      parent_element.appendChild(btn);
      btn.addEventListener("click", (e) => {
        on_click(e);
      });
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                            TOP NAVIGATION                                                           
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    #insert_text(before_cursor, after_cursor, force_linebreak = false) {
      let before = "";
      let after = "";
      let inside = "";
      console.log(this.#selection);
      if (this.#selection !== null && this.#selection.visible) {
        const start = this.#map_cursor_pos(this.#selection.lo);
        const end = this.#map_cursor_pos(this.#selection.hi);
        before = this.#input.value.slice(0, start);
        inside = this.#input.value.slice(start, end);
        after = this.#input.value.slice(end);
      } else {
        const cursor_pos = this.#input.selectionStart;
        before = this.#input.value.slice(0, cursor_pos);
        after = this.#input.value.slice(cursor_pos);
      }
      console.log("TEST", before, after);
      if (before.endsWith(before_cursor) && after.startsWith(after_cursor)) {
        before = before.slice(0, before.length - before_cursor.length);
        after = after.slice(after_cursor.length);
        console.log("AFTER_REPLACE", before, after);
        this.#input.value = before + inside + after;
      } else {
        if (force_linebreak && before[before.length - 1] !== "\n" && before.length > 0) {
          before += "\n";
        }
        before += before_cursor;
        after = after_cursor + after;
        this.#input.value = before + inside + after;
      }
      if (!this.#selection?.is_mobile) window.setTimeout(() => this.set_cursor(before.length + inside.length), 1);
      if (force_linebreak) this.#selection?.discard();
      this.#update_markdown_render();
      if (this.#selection !== null && this.#selection.visible) this.#selection.update_render();
      this.#register_history_state();
    }
    // -------------------------------
    //  Slider                            
    // -------------------------------
    #slider_change() {
      let scale = 1;
      const slider_value = Number(this.#slider.value);
      scale = 0.5 * Math.pow(4, slider_value / 100);
      this.#text_display.style.fontSize = `${scale * 16}px`;
      this.#input.style.fontSize = `${scale * 16}px`;
      this.#selection?.update_render();
    }
    // -------------------------------
    //  Toggle button                            
    // -------------------------------
    #editor_had_focus = false;
    // Register if the editor is focused just before it will lose focus due to clicking on the toggle
    #register_focus() {
      this.#editor_had_focus = document.activeElement === this.#input;
    }
    #click_toggle() {
      const enabled = this.#toggle_check.checked;
      console.log("CHECK");
      if (enabled) {
        this.#wrapper.classList.remove("infill-parsing-disabled");
        window.setTimeout(() => this.set_cursor(this.#input.selectionStart, !this.#editor_had_focus), 10);
        this.#update_markdown_render();
      } else {
        this.#wrapper.classList.add("infill-parsing-disabled");
        if (this.#editor_had_focus) this.#input.focus();
      }
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                               EDITOR                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    // -------------------------------
    //  Editor typing stuff                            
    // -------------------------------
    #last_parse = {
      "html": "",
      "char_map": {
        "absolute_map": [],
        "width_map": [],
        "line_map": [],
        "line_idx_map": []
      }
    };
    #update_markdown_render() {
      let markdown_input = this.#input.value;
      if (!this.#toggle_check.checked) return;
      if (markdown_input.length === 0 && document.activeElement !== this.#input) {
        markdown_input = `<span class="infill-placeholder">${this.#place_holder}</span>`;
      }
      const cursor_pos = this.#input.selectionStart;
      markdown_input = markdown_input.slice(0, cursor_pos) + "\uE003" + markdown_input.slice(cursor_pos);
      console.log(markdown_input);
      this.#last_parse = parse(markdown_input);
      if (this.#last_parse.html === void 0) throw Error("[Infill]: whoops something went horribly wrong whilst parsing markdown. Please make an issue on github immediately.");
      console.log(this.#last_parse.html);
      let text2 = purify.sanitize(this.#last_parse.html);
      console.log(this.#last_parse.html);
      this.#text_display.innerHTML = text2;
      import_prismjs2.default.highlightAllUnder(this.#wrapper);
      this.#text_display.innerHTML = this.#text_display.innerHTML.replaceAll("\uE003", '<i class="infill-editor-cursor"></i>');
      document.getElementsByClassName("infill-editor-cursor")[0]?.scrollIntoView({
        "behavior": "instant",
        "block": "nearest",
        "inline": "center"
      });
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                           KEYBOARD
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    #on_key_down(e) {
      const key = e.key.toLowerCase();
      const is_shortcut = document.activeElement === this.#input && this.#options.keyboard_shortcuts_enabled && e.getModifierState("Control") && !(e.getModifierState("Alt") || e.getModifierState("Shift"));
      if ((key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") && !(e.getModifierState("Shift") || e.getModifierState("Ctrl"))) {
        window.setTimeout(() => this.#update_markdown_render(), 1);
      }
      if (key === "h" && is_shortcut) {
        this.#insert_text("# ", "", true);
      } else if (key === "q" && is_shortcut) {
        this.#insert_text("> ", "", true);
      } else if (key === "e" && is_shortcut) {
        this.#insert_text("```", "\n```", true);
      } else if (key === "t" && is_shortcut) {
        this.#insert_text("``", "``", false);
      } else if (key === "b" && is_shortcut) {
        this.#insert_text("**", "**", false);
      } else if (key === "i" && is_shortcut) {
        this.#insert_text("*", "*", false);
      } else if (key === "s" && is_shortcut) {
        this.#insert_text("~~", "~~", false);
      } else if (key === "u" && is_shortcut) {
        this.#insert_text("==", "==", false);
      } else if (key === "m" && is_shortcut) {
        this.#insert_text("^", "^", false);
      } else if (key === "d" && is_shortcut) {
        this.#insert_text("[|", "]", false);
      } else if (key === "l" && is_shortcut) {
        this.#insert_text("- ", "", true);
      } else if (key === "o" && is_shortcut) {
        this.#insert_text("1. ", "", true);
      } else if (key === "k" && is_shortcut) {
        this.#insert_text("[", "]()", false);
      } else if (key === "p" && is_shortcut) {
        this.#insert_text("![]()", "", false);
      }
      if (is_shortcut && "hqetbisumdlokp".includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key.length === 1 && !e.getModifierState("Control") && !e.getModifierState("Alt") && this.#selection !== null && this.#selection.visible) {
        e.preventDefault();
        e.stopPropagation();
        this.#replace_selection(e.key);
        this.#register_history_state();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && this.#selection !== null && this.#selection.visible) {
        e.preventDefault();
        e.stopPropagation();
        this.#replace_selection("");
        this.#register_history_state();
        return;
      }
      if (e.key === "a" && e.getModifierState("Control") && !(e.getModifierState("Alt") || e.getModifierState("Shift")) && this.#wrapper.contains(document.activeElement)) {
        this.#select_all(e);
        return;
      }
      if (e.key === "ArrowLeft" && e.getModifierState("Shift")) this.#select_left(e, e.getModifierState("Control"));
      if (e.key === "ArrowRight" && e.getModifierState("Shift")) this.#select_right(e, e.getModifierState("Control"));
      if (e.key === "ArrowUp" && e.getModifierState("Shift")) this.#select_up(e);
      if (e.key === "ArrowDown" && e.getModifierState("Shift")) this.#select_down(e);
      if (e.key === "ArrowLeft" && !e.getModifierState("Shift")) this.#escape_selection(e, this.#selection?.lo, true);
      if (e.key === "ArrowRight" && !e.getModifierState("Shift")) this.#escape_selection(e, this.#selection?.hi, true);
      if (e.key === "ArrowUp" && !e.getModifierState("Shift")) this.#escape_selection_up(e);
      if (e.key === "ArrowDown" && !e.getModifierState("Shift")) this.#escape_selection_down(e);
      if (e.key == "Escape") this.#escape_selection(e);
      if (e.key === "z" && e.getModifierState("Control") && !e.getModifierState("Alt")) this.#undo(e);
      if (e.key === "y" && e.getModifierState("Control") && !e.getModifierState("Alt")) this.#redo(e);
      if (e.key === "Delete" || e.key === "Backspace") {
        this.#register_history_state();
      }
    }
    #before_input(e) {
      const key = e.data;
      if (key?.length === 1) {
        if (" -".includes(key)) {
          window.setTimeout(() => this.#register_history_state(true, true), 10);
        } else {
          window.setTimeout(() => this.#register_history_state(true), 10);
        }
      }
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                          DETECT MOUSE EVENTS                                                            
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    // -------------------------------
    //  Detect clicking vs selecting                         
    // -------------------------------
    #selection = null;
    #anchor_pos = [0, 0];
    #mouse_down = false;
    #mouse_hold = false;
    #hold_timeout = null;
    #last_click = 0;
    #last_click_pos = 0;
    // -------------------------------
    //  Mouse down                            
    // -------------------------------
    #editor_mouse_down(e) {
      if (e.target === null || !(e.target instanceof Node)) return;
      if (!this.#toggle_check.checked) return;
      const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
      if (this.#last_click + 300 > Date.now() && this.#last_click_pos !== void 0 && cursor === this.#last_click_pos) {
        if (e.pointerType === "mouse") this.#select_word();
        this.#last_click = Date.now();
        return;
      }
      this.#last_click = Date.now();
      this.#last_click_pos = cursor;
      this.#mouse_hold = false;
      if (this.#selection_mask.contains(e.target)) {
        return;
      } else if (this.#editor.contains(e.target)) {
        this.#mouse_down = true;
        this.#anchor_pos = [e.clientX, e.clientY];
        this.#selection?.discard();
        if (cursor === void 0) return this.#selection = null;
        this.#target_line_offs = null;
        const mapped_pos = this.#map_cursor_pos(cursor);
        if (mapped_pos === void 0) return;
        this.#selection_anchor = mapped_pos;
        this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, cursor, cursor);
        if (e.pointerType !== "mouse") this.#hold_timeout = window.setTimeout(() => {
          if (!this.#mouse_down) return;
          this.#mouse_hold = true;
          this.#mobile_selection(mapped_pos);
          e.preventDefault();
        }, 800);
      } else if (!this.#nav.contains(e.target) && !this.#bott_nav.contains(e.target)) {
        this.#selection?.discard();
      }
    }
    #cancel_hold() {
      if (this.#hold_timeout === null) return;
      window.clearTimeout(this.#hold_timeout);
      this.#hold_timeout = null;
    }
    // -------------------------------
    //  Mouse move                            
    // -------------------------------
    #editor_mouse_move(e) {
      if (!this.#toggle_check.checked) return;
      if (this.#mouse_down && e.pointerType === "mouse" && this.#input.value.length > 0) {
        const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
        if (cursor !== void 0) this.#selection?.set_end(cursor);
      }
      if (this.#mouse_down && (this.#selection === null || !this.#selection.visible)) {
        let start_x = this.#anchor_pos[0];
        let start_y = this.#anchor_pos[1];
        if (start_x === void 0 || start_y === void 0) return;
        let dist = (start_x - e.clientX) ** 2 + (start_y - e.clientY) ** 2;
        if (dist >= 64) {
          if (e.pointerType === "mouse" && this.#input.value.length > 0) {
            this.#selection?.apply();
            this.#target_line_offs = null;
          }
          if (this.#hold_timeout !== null) {
            window.clearInterval(this.#hold_timeout);
            this.#hold_timeout = null;
          }
        }
      }
    }
    // -------------------------------
    //  Mouse Up                            
    // -------------------------------
    #editor_mouse_up(e) {
      if (!this.#toggle_check.checked) return;
      this.#selection_thumb_up(e);
      if (this.#hold_timeout !== null) {
        window.clearInterval(this.#hold_timeout);
        this.#hold_timeout = null;
      }
      if (this.#mouse_hold) {
        e.preventDefault();
        this.#mouse_down = false;
        return;
      }
      if (this.#mouse_down) {
        const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
        if (cursor !== void 0 && this.#input.value.length > 0) this.#selection?.set_end(cursor);
        if (cursor !== void 0) {
          const mapped_pos = this.#map_cursor_pos(cursor);
          if (mapped_pos !== void 0) window.setTimeout(() => this.set_cursor(mapped_pos), 10);
        } else {
          window.setTimeout(() => this.set_cursor(this.#input.value.length), 10);
        }
        this.#update_markdown_render();
      }
      this.#mouse_down = false;
    }
    // -------------------------------
    //  Create mobile selection                            
    // -------------------------------
    #mobile_selection(cursor) {
      this.#input.blur();
      const word_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let start = cursor;
      while (word_chars.includes(this.#input.value.charAt(start - 1)) && start > 0) {
        start--;
      }
      let end = cursor;
      while (word_chars.includes(this.#input.value.charAt(end)) && end < this.#input.value.length) {
        end++;
      }
      const mapped_start = this.#inverse_map_cursor_pos(start);
      const mapped_end = this.#inverse_map_cursor_pos(end);
      this.#selection?.discard();
      this.#selection = new EditorSelection(
        this.#text_display,
        this.#selection_mask,
        mapped_start,
        mapped_end,
        true,
        (e, type) => this.#selection_thumb_down(e, type)
      );
      this.#selection.apply();
      window.setTimeout(() => document.getSelection()?.removeAllRanges(), 10);
    }
    // -------------------------------
    //  Adjust mobile selection                            
    // -------------------------------
    #thumb_down = false;
    #selected_thumb = "end";
    #selection_thumb_down(e, type) {
      this.#selected_thumb = type;
      this.#thumb_down = true;
      this.#mouse_hold = true;
      this.#editor.classList.add("infill-selection-busy");
    }
    #selection_thumb_up(e) {
      this.#thumb_down = false;
      this.#editor.classList.remove("infill-selection-busy");
    }
    // Adjust selection
    #selection_thumb_move(e) {
      if (this.#thumb_down) {
        const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
        if (cursor !== void 0) {
          if (this.#selected_thumb === "start") {
            this.#selection?.set_start(cursor);
          } else {
            this.#selection?.set_end(cursor);
          }
        } else {
          if (this.#selected_thumb === "start") {
            this.#selection?.set_start(this.#last_parse.char_map.absolute_map.length);
          } else {
            this.#selection?.set_end(this.#last_parse.char_map.absolute_map.length);
          }
        }
        this.#update_markdown_render();
      }
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                       HANDLE CURSORS                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    // -------------------------------
    //  Helpers                            
    // -------------------------------
    set_cursor(position, no_focus = false, no_update = false) {
      this.#text_display.querySelector(".infill-editor-cursor")?.classList.add("infill-cursor-force-mark");
      window.setTimeout(() => this.#text_display.querySelector(".infill-editor-cursor")?.classList.remove("infill-cursor-force-mark"), 500);
      if (!no_focus) this.#input.focus();
      this.#input.selectionStart = position;
      this.#input.selectionEnd = position;
      if (!no_update) this.#update_markdown_render();
    }
    // Map a cursor pos from html to markdown
    #map_cursor_pos(position) {
      return this.#last_parse.char_map.absolute_map[position];
    }
    // Map a cusor pos from markdown to html
    #inverse_map_cursor_pos(position, map = this.#last_parse.char_map.absolute_map) {
      const last_item = map[map.length - 1];
      const first_item = map[0];
      let mapped = map.indexOf(position);
      if (last_item !== void 0 && position > last_item) return -1;
      if (first_item !== void 0 && position < first_item) return -1;
      while (mapped === -1 && position > 0) {
        position--;
        mapped = map.indexOf(position);
      }
      return mapped;
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                      HANDLE SELECTIONS                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    // -------------------------------
    //  Helpers                            
    // -------------------------------
    // Replace selected text with a replacement string
    #replace_selection(value) {
      if (this.#selection === null || value === void 0) return null;
      const start = this.#map_cursor_pos(this.#selection.lo);
      const end = this.#map_cursor_pos(this.#selection.hi);
      if (start === void 0) return null;
      const before = this.#input.value.slice(0, start);
      const inside = this.#input.value.slice(start, end);
      const after = this.#input.value.slice(end);
      this.#input.value = before + value + after;
      this.#update_markdown_render();
      this.set_cursor(start + value.length);
      this.#selection.discard();
      return inside;
    }
    // get the line idx corresponding to a character offset in html
    #get_line_idx(offs) {
      const result = this.#last_parse.char_map.line_idx_map[offs];
      if (result === void 0) return -1;
      return result;
    }
    // Create a new selection when there isn't one yet
    #init_selection(cursor_md_pos, cursor_html_pos) {
      if (this.#selection === null || !this.#selection.visible) {
        this.#target_line_offs === null;
        this.#selection_anchor = cursor_md_pos;
        this.#input.blur();
        let sel = new EditorSelection(this.#text_display, this.#selection_mask, cursor_html_pos, cursor_html_pos);
        sel.apply();
        return sel;
      }
      return this.#selection;
    }
    // Calculate the target offset when selecting up or down
    #init_target_offs(selection_pos, curr_line_map) {
      if (this.#target_line_offs === null) {
        let line_start_idx_markdown = curr_line_map[0];
        if (line_start_idx_markdown === void 0) line_start_idx_markdown = 0;
        const line_start_idx = this.#inverse_map_cursor_pos(line_start_idx_markdown);
        return selection_pos - line_start_idx;
      }
      return this.#target_line_offs;
    }
    // -------------------------------
    //  Copy                            
    // -------------------------------
    #copy_selection(e) {
      if (!this.#toggle_check.checked) return;
      if (this.#selection !== null && this.#selection.visible) {
        if (e instanceof ClipboardEvent) {
          e.preventDefault();
          e.stopPropagation();
        }
        const start = this.#map_cursor_pos(this.#selection.lo);
        const end = this.#map_cursor_pos(this.#selection.hi);
        const selected = this.#input.value.slice(start, end);
        if (e instanceof ClipboardEvent) e.clipboardData?.setData("text", selected);
        if (e instanceof Clipboard) e.writeText(selected);
      }
    }
    // -------------------------------
    //  Paste                            
    // -------------------------------
    async #paste_selection(e) {
      window.setTimeout(() => this.#register_history_state(), 10);
      if (!this.#toggle_check.checked) return;
      if (this.#selection !== null && this.#selection.visible) {
        if (e instanceof ClipboardEvent) {
          e.preventDefault();
          e.stopPropagation();
        }
        const replacement = e instanceof ClipboardEvent ? e.clipboardData?.getData("text") : await e.readText();
        if (replacement === void 0) return;
        this.#replace_selection(replacement);
      } else if (e instanceof Clipboard) {
        this.#insert_text(await e.readText(), "");
      }
    }
    // -------------------------------
    //  Cut                            
    // -------------------------------
    #cut_selection(e) {
      window.setTimeout(() => this.#register_history_state(), 10);
      if (!this.#toggle_check.checked) return;
      if (this.#selection !== null && this.#selection.visible) {
        if (e instanceof ClipboardEvent) {
          e.preventDefault();
          e.stopPropagation();
        }
        const inside = this.#replace_selection("");
        if (inside === null) return;
        if (e instanceof ClipboardEvent) e.clipboardData?.setData("text", inside);
        if (e instanceof Clipboard) e.writeText(inside);
      }
    }
    // -------------------------------
    //  Select All                            
    // -------------------------------
    #select_all(e) {
      if (!this.#toggle_check.checked) return;
      const abs_map = this.#last_parse.char_map.absolute_map;
      if (this.#selection === null || !this.#selection.visible) {
        this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, 0, abs_map.length - 1);
        this.#selection.apply();
      } else {
        this.#selection.set_start(0);
        this.#selection.set_end(abs_map.length - 1);
      }
      const targ_cursor_pos = abs_map[abs_map.length - 1];
      if (targ_cursor_pos !== void 0) this.set_cursor(targ_cursor_pos);
      e.preventDefault();
      e.stopPropagation();
    }
    // -------------------------------
    //  Select with shift                            
    // -------------------------------
    // Main helper
    #select_distance(dist) {
      if (!this.#toggle_check.checked) return;
      const cursor_md_pos = this.#input.selectionStart;
      const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
      if (cursor_html_pos === void 0) return;
      this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
      let sel_end_md = this.#map_cursor_pos(this.#selection.end + dist);
      const abs_char_map = this.#last_parse.char_map.absolute_map;
      const max_len = abs_char_map[abs_char_map.length - 1];
      if (max_len === void 0 || sel_end_md === void 0) return;
      if (sel_end_md < 0) sel_end_md = 0;
      if (sel_end_md > max_len) sel_end_md = max_len;
      this.set_cursor(sel_end_md);
      const sel_end = this.#inverse_map_cursor_pos(sel_end_md);
      const sel_start = this.#inverse_map_cursor_pos(this.#selection_anchor);
      this.#selection.set_end(sel_end);
      this.#selection.set_start(sel_start);
    }
    #target_line_offs = 0;
    #selection_anchor = 0;
    #select_left(e, ctrl) {
      if (!this.#toggle_check.checked) return;
      if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
      e.preventDefault();
      e.stopPropagation();
      console.log("SELECT");
      if (ctrl) {
        if (this.#selection !== null && this.#selection.visible && this.#selection.end > this.#selection.start) {
          const start_line_idx = this.#get_line_idx(this.#selection.start);
          const end_line_idx = this.#get_line_idx(this.#selection.end);
          if (start_line_idx === end_line_idx || end_line_idx === start_line_idx + 1) {
            this.#escape_selection(null, this.#selection.lo, true);
            return;
          }
        }
        const cursor_md_pos = this.#input.selectionStart;
        const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
        this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
        let line_idx = this.#get_line_idx(this.#selection.end);
        let prev_line_map = this.#last_parse.char_map.line_map[line_idx - 1];
        let targ_md_pos;
        if (prev_line_map === void 0) {
          targ_md_pos = this.#last_parse.char_map.absolute_map[0];
        } else {
          targ_md_pos = prev_line_map[prev_line_map.length - 1];
        }
        if (targ_md_pos === void 0) return;
        this.set_cursor(targ_md_pos);
        const targ_html_pos = this.#inverse_map_cursor_pos(targ_md_pos);
        const targ_html_start_pos = this.#inverse_map_cursor_pos(this.#selection_anchor);
        this.#selection.set_start(targ_html_start_pos);
        this.#selection.set_end(targ_html_pos);
      } else {
        this.#select_distance(-1);
      }
      this.#target_line_offs = null;
    }
    #select_right(e, ctrl) {
      if (!this.#toggle_check.checked) return;
      if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
      e.preventDefault();
      e.stopPropagation();
      this.#target_line_offs = null;
      if (ctrl) {
        if (this.#selection !== null && this.#selection.visible && this.#selection.end < this.#selection.start) {
          const start_line_idx = this.#get_line_idx(this.#selection.start);
          const end_line_idx = this.#get_line_idx(this.#selection.end);
          if (start_line_idx === end_line_idx || end_line_idx === start_line_idx - 1) {
            this.#escape_selection(null, this.#selection.hi, true);
            return;
          }
        }
        const cursor_md_pos = this.#input.selectionStart;
        const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
        this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
        let line_idx = this.#get_line_idx(this.#selection.end);
        let next_line_map = this.#last_parse.char_map.line_map[line_idx + 1];
        let targ_md_pos;
        if (next_line_map === void 0) {
          const abs_map = this.#last_parse.char_map.absolute_map;
          targ_md_pos = abs_map[abs_map.length - 1];
        } else {
          targ_md_pos = next_line_map[0];
        }
        if (targ_md_pos === void 0) return;
        targ_md_pos--;
        this.set_cursor(targ_md_pos);
        const targ_html_pos = this.#inverse_map_cursor_pos(targ_md_pos);
        const targ_html_start_pos = this.#inverse_map_cursor_pos(this.#selection_anchor);
        this.#selection.set_start(targ_html_start_pos);
        this.#selection.set_end(targ_html_pos);
      } else {
        this.#select_distance(1);
      }
    }
    #select_up(e) {
      if (!this.#toggle_check.checked) return;
      if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
      e.preventDefault();
      e.stopPropagation();
      const cursor_md_pos = this.#input.selectionStart;
      const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
      let line_idx = this.#get_line_idx(cursor_html_pos);
      this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
      const selection_pos = this.#selection.end;
      const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
      if (curr_line_map === void 0) return;
      this.#target_line_offs = this.#init_target_offs(selection_pos, curr_line_map);
      line_idx = this.#get_line_idx(this.#selection.end);
      const prev_line = this.#last_parse.char_map.line_map[line_idx - 1];
      if (prev_line === void 0) {
        var target_md_char = curr_line_map[0];
      } else {
        var target_md_char = prev_line[this.#target_line_offs];
        if (target_md_char === void 0) target_md_char = prev_line[prev_line.length - 1];
      }
      if (target_md_char === void 0) return;
      this.set_cursor(target_md_char);
      const target_end_char = this.#inverse_map_cursor_pos(target_md_char);
      const target_start_char = this.#inverse_map_cursor_pos(this.#selection_anchor);
      this.#selection.set_end(target_end_char);
      this.#selection.set_start(target_start_char);
      if (this.#selection.length === 0) {
        this.#selection.discard();
      }
    }
    #select_down(e) {
      if (!this.#toggle_check.checked) return;
      if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
      e.preventDefault();
      e.stopPropagation();
      const cursor_md_pos = this.#input.selectionStart;
      const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
      let line_idx = this.#get_line_idx(cursor_html_pos);
      this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
      const selection_pos = this.#selection.end;
      const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
      if (curr_line_map === void 0) return;
      this.#target_line_offs = this.#init_target_offs(selection_pos, curr_line_map);
      line_idx = this.#get_line_idx(this.#selection.end);
      const next_line = this.#last_parse.char_map.line_map[line_idx + 1];
      if (next_line === void 0) {
        var target_md_char = curr_line_map[curr_line_map.length - 1];
        if (target_md_char === void 0) return;
      } else {
        var target_md_char = next_line[this.#target_line_offs];
        if (target_md_char === void 0) target_md_char = next_line[next_line.length - 1];
        if (target_md_char === void 0) return;
        target_md_char--;
      }
      this.set_cursor(target_md_char);
      const target_end_char = this.#inverse_map_cursor_pos(target_md_char);
      const target_start_char = this.#inverse_map_cursor_pos(this.#selection_anchor);
      this.#selection.set_end(target_end_char);
      this.#selection.set_start(target_start_char);
      if (this.#selection.length === 0) {
        this.#selection.discard();
      }
    }
    // -------------------------------
    //  Select word                            
    // -------------------------------
    #select_word() {
      if (this.#selection !== null && this.#selection?.visible) return;
      const word_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const cursor = this.#input.selectionStart;
      let start = cursor;
      while (word_chars.includes(this.#input.value.charAt(start - 1)) && start > 0) {
        start--;
      }
      let end = cursor;
      while (word_chars.includes(this.#input.value.charAt(end)) && end < this.#input.value.length) {
        end++;
      }
      const mapped_start = this.#inverse_map_cursor_pos(start);
      const mapped_end = this.#inverse_map_cursor_pos(end);
      this.#selection?.discard();
      this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, mapped_start, mapped_end);
      this.#selection_anchor = Math.min(start, end);
      this.set_cursor(Math.max(start, end));
      this.#selection.apply();
    }
    // -------------------------------
    //  Escape selection                            
    // -------------------------------
    // Escape the selection whilst leaving the cursor position at the end of the selection
    #escape_selection(e = null, cursor_pos = void 0, unit_html = true) {
      if (this.#selection === null || !this.#selection.visible) return;
      if (!this.#toggle_check.checked) return;
      if (cursor_pos !== void 0) {
        let target_pos;
        if (unit_html) {
          target_pos = this.#last_parse.char_map.absolute_map[cursor_pos];
        } else {
          target_pos = cursor_pos;
        }
        if (target_pos === void 0) return;
        this.set_cursor(target_pos);
      }
      if (e !== null) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.#target_line_offs = null;
      this.#selection?.discard();
    }
    // Escape a selection on the left
    #escape_selection_up(e) {
      if (this.#selection === null || !this.#selection.visible) return;
      if (!this.#toggle_check.checked) return;
      e.preventDefault();
      e.stopPropagation();
      let line_idx = this.#get_line_idx(this.#selection.lo);
      const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
      const prev_line_map = this.#last_parse.char_map.line_map[line_idx - 1];
      let targ_md_pos = this.#map_cursor_pos(this.#selection.lo);
      if (curr_line_map !== void 0 && prev_line_map !== void 0) {
        const target = this.#init_target_offs(this.#selection.lo, curr_line_map);
        targ_md_pos = prev_line_map[target];
      }
      this.#escape_selection(null, targ_md_pos, false);
    }
    // Escape a selection on the left
    #escape_selection_down(e) {
      if (this.#selection === null || !this.#selection.visible) return;
      if (!this.#toggle_check.checked) return;
      e.preventDefault();
      e.stopPropagation();
      let line_idx = this.#get_line_idx(this.#selection.hi);
      const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
      const next_line_map = this.#last_parse.char_map.line_map[line_idx + 1];
      let targ_md_pos = this.#map_cursor_pos(this.#selection.hi);
      if (curr_line_map !== void 0 && next_line_map !== void 0) {
        const target = this.#init_target_offs(this.#selection.hi, curr_line_map);
        targ_md_pos = next_line_map[target];
      }
      if (targ_md_pos !== void 0) targ_md_pos--;
      this.#escape_selection(null, targ_md_pos, false);
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                       IMPORT / EXPORT FILES                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    #import_file() {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", ".txt,.md");
      input.click();
      input.addEventListener("change", (e) => {
        let file = input.files?.[0];
        let reader = new FileReader();
        input.value = "";
        if (!file) return;
        reader.readAsText(file, "UTF-8");
        reader.addEventListener("load", (e2) => {
          const result = reader.result;
          if (typeof result === "string") this.#input.value = result;
          this.#update_markdown_render();
        });
      });
    }
    #export_file() {
      const curr_date = /* @__PURE__ */ new Date();
      let default_file_name = `infill_export_${curr_date.getDate()}-${curr_date.getMonth() + 1}_${curr_date.getHours()}-${curr_date.getMinutes()}.md`;
      download_file(this.#input.value, default_file_name, "text/plain");
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                         UNDO / REDO HISTORY                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    #register_history_state(is_character_change = false, force_new_state = false) {
      log_string("Register history state");
      const item = {
        "input_value": this.#input.value,
        "cursor_pos": this.#input.selectionStart,
        "is_character_change": is_character_change
      };
      if (item.input_value === this.#history.undo_states[this.#history.undo_states.length - 1]?.input_value) {
        log_string("return history state :(");
        return;
      }
      if (is_character_change && !force_new_state && this.#history.undo_states[this.#history.undo_states.length - 1]?.is_character_change) {
        this.#history.undo_states[this.#history.undo_states.length - 1] = item;
      } else {
        this.#history.undo_states.push(item);
        if (this.#history.undo_states.length > 100) this.#history.undo_states.splice(0, 1);
      }
      this.#history.redo_states = [];
    }
    #undo(e, force_enabled = false) {
      log_string(this.#history.undo_states);
      if (!this.#toggle_check.checked && !force_enabled) return;
      e.preventDefault();
      e.stopPropagation();
      if (this.#history.undo_states.length < 2) return;
      const states = this.#history.undo_states;
      const prev_state = this.#history.undo_states.pop();
      if (prev_state !== void 0) this.#history.redo_states.push(prev_state);
      const new_state = states[states.length - 1];
      if (new_state !== void 0) this.#input.value = new_state.input_value;
      if (new_state !== void 0) this.set_cursor(new_state.cursor_pos);
    }
    #redo(e, force_enabled = false) {
      if (!this.#toggle_check.checked && !force_enabled) return;
      e.preventDefault();
      e.stopPropagation();
      if (this.#history.redo_states.length < 1) return;
      const states = this.#history.redo_states;
      const last_state = this.#history.redo_states.pop();
      if (last_state === void 0) return;
      this.#history.undo_states.push(last_state);
      this.#input.value = last_state.input_value;
      this.set_cursor(last_state.cursor_pos);
    }
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                      USER INTERACTIVE METHODS                                                                     
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    // These methods are designed to be used by the user of this library
    // -------------------------------
    //  Getters                            
    // -------------------------------
    get markdown() {
      return this.#input.value;
    }
    get html() {
      return this.#last_parse.html;
    }
    get_button_state() {
      return {
        "zoom_slider": this.#slider.value,
        "markdown_enabled": this.#toggle_check.checked
      };
    }
    get_cursor_pos() {
      return this.#input.selectionStart;
    }
    // -------------------------------
    //  Setters                            
    // -------------------------------
    set_button_state(state) {
      this.#slider.value = state.zoom_slider;
      this.#slider_change();
      this.#toggle_check.checked = state.markdown_enabled;
      this.#click_toggle();
    }
    set markdown(value) {
      this.#input.value = value;
      this.#update_markdown_render();
    }
  };
  return __toCommonJS(main_exports);
})();
/*! Bundled license information:

prismjs/prism.js:
  (**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   *)

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.14 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.14/LICENSE *)
*/
