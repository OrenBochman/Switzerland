module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.element = exports.compose = exports.pipe = exports.timeEnd = exports.time = exports.redux = exports.include = exports.state = exports.attrs = exports.once = exports.html = exports.create = exports.htmlKey = undefined;

	var _html = __webpack_require__(2);

	Object.defineProperty(exports, 'html', {
	    enumerable: true,
	    get: function () {
	        return _interopRequireDefault(_html).default;
	    }
	});

	var _once = __webpack_require__(3);

	Object.defineProperty(exports, 'once', {
	    enumerable: true,
	    get: function () {
	        return _interopRequireDefault(_once).default;
	    }
	});

	var _attributes = __webpack_require__(4);

	Object.defineProperty(exports, 'attrs', {
	    enumerable: true,
	    get: function () {
	        return _interopRequireDefault(_attributes).default;
	    }
	});

	var _state = __webpack_require__(7);

	Object.defineProperty(exports, 'state', {
	    enumerable: true,
	    get: function () {
	        return _interopRequireDefault(_state).default;
	    }
	});

	var _include = __webpack_require__(8);

	Object.defineProperty(exports, 'include', {
	    enumerable: true,
	    get: function () {
	        return _interopRequireDefault(_include).default;
	    }
	});

	var _redux = __webpack_require__(10);

	Object.defineProperty(exports, 'redux', {
	    enumerable: true,
	    get: function () {
	        return _interopRequireDefault(_redux).default;
	    }
	});

	var _timer = __webpack_require__(11);

	Object.defineProperty(exports, 'time', {
	    enumerable: true,
	    get: function () {
	        return _timer.time;
	    }
	});
	Object.defineProperty(exports, 'timeEnd', {
	    enumerable: true,
	    get: function () {
	        return _timer.timeEnd;
	    }
	});

	var _ramda = __webpack_require__(6);

	Object.defineProperty(exports, 'pipe', {
	    enumerable: true,
	    get: function () {
	        return _ramda.pipe;
	    }
	});
	Object.defineProperty(exports, 'compose', {
	    enumerable: true,
	    get: function () {
	        return _ramda.compose;
	    }
	});

	var _virtualDom = __webpack_require__(21);

	Object.defineProperty(exports, 'element', {
	    enumerable: true,
	    get: function () {
	        return _virtualDom.h;
	    }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @constant registry
	 * @type {WeakMap}
	 */
	const registry = new WeakMap();

	/**
	 * @constant htmlKey
	 * @type {Symbol}
	 */
	const htmlKey = exports.htmlKey = Symbol('switzerland/html');

	/**
	 * @constant implementations
	 * @type {Object}
	 */
	const implementations = {

	    v0: {
	        hooks: ['attachedCallback', 'detachedCallback'],
	        customElement: (name, blueprint) => document.registerElement(name, blueprint),
	        shadowBoundary: node => node.createShadowRoot()
	    },
	    v1: {
	        hooks: ['connectedCallback', 'disconnectedCallback'],
	        customElement: (name, blueprint) => window.customElements.define(name, blueprint),
	        shadowBoundary: node => node.attachShadow({ mode: 'open' })
	    }

	};

	/**
	 * @method htmlFor
	 * @param {Object} model
	 * @return {Object}
	 */
	const htmlFor = model => {
	    return htmlKey in model ? model.html : model;
	};

	/**
	 * @method create
	 * @param {String} name
	 * @param {Function} render
	 * @return {void}
	 */
	const create = exports.create = (name, render) => {

	    /**
	     * Determines whether we use the v0 or v1 implementation of Custom Elements.
	     *
	     * @constant implementation
	     * @type {Object}
	     */
	    const implementation = typeof window.customElements === 'undefined' ? implementations.v0 : implementations.v1;

	    /**
	     * @constant blueprint
	     * @type {Object}
	     */
	    implementation.customElement(name, class extends window.HTMLElement {

	        /**
	         * @method connectedCallback
	         * @return {void}
	         */
	        [implementation.hooks[0]]() {

	            const boundary = implementation.shadowBoundary(this);
	            const rerender = () => this.render();

	            const tree = htmlFor(render({ node: this, render: rerender }));
	            const root = (0, _virtualDom.create)(tree);

	            // See: https://github.com/Matt-Esch/virtual-dom/pull/413
	            boundary.appendChild(root);

	            registry.set(this, { node: this, tree, root });
	        }

	        /**
	         * @method disconnectedCallback
	         * @return {void}
	         */
	        [implementation.hooks[1]]() {

	            // Once the node has been removed then we perform one last pass, however the render function
	            // ensures the node is in the DOM before any reconciliation takes place, thus saving resources.
	            this.render();
	        }

	        /**
	         * @method render
	         * @return {void}
	         */
	        render() {

	            const instance = registry.get(this);

	            if (!instance) {

	                // Rejected as developer has attempted to re-render during the start-up phase.
	                // As an alternative we could queue the re-render using `setTimeout` for the next
	                // tick, but ideally the developer should setup sensible defaults and thus avoid a
	                // re-render during the start-up phase.
	                // Queue: setTimeout(this.render.bind(this));
	                return;
	            }

	            const currentTree = instance.tree;
	            const currentRoot = instance.root;
	            const node = instance.node;

	            const rerender = () => this.render();

	            const tree = htmlFor(render({ node, render: rerender }));

	            if (node.isConnected) {

	                const patches = (0, _virtualDom.diff)(currentTree, tree);
	                const root = (0, _virtualDom.patch)(currentRoot, patches);

	                registry.set(this, { node, tree, root });
	            }
	        }

	    });
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _switzerland = __webpack_require__(1);

	/**
	 * @param {Function} html
	 * @return {Function}
	 */
	exports.default = html => {

	    return props => {
	        return _extends({}, props, { [_switzerland.htmlKey]: html(props) });
	    };
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/**
	 * @constant once
	 * @type {WeakMap}
	 */
	const once = new WeakMap();

	/**
	 * @param {Function} callback
	 * @param {Function} [keyFrom]
	 * @return {Function}
	 */

	exports.default = (callback, keyFrom = props => props.node) => {

	    return props => {

	        const key = keyFrom(props);

	        // Ensure the node has an entry in the map.
	        const hasNode = once.has(key);
	        !hasNode && once.set(key, new WeakMap());

	        // Determine whether the function has been called already.
	        const hasFunction = once.get(key).has(callback);
	        !hasFunction && once.get(key).set(callback, callback(props));

	        return _extends({}, props, once.get(key).get(callback));
	    };
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _humps = __webpack_require__(5);

	var _ramda = __webpack_require__(6);

	/**
	 * @constant observers
	 * @type {WeakMap}
	 */
	const observers = new WeakMap();

	/**
	 * @constant attributes
	 * @type {WeakMap}
	 */
	const attributes = new WeakMap();

	/**
	 * @method removePrefix
	 * @param {String} name
	 * @return {String}
	 */
	const removePrefix = name => name.replace('data-', '');

	/**
	 * @method transform
	 * @param {NamedNodeMap} attributes
	 * @return {Object}
	 */
	const transform = attributes => {

	  return Object.keys(attributes).reduce((acc, index) => {

	    // Transform each attribute into a plain object.
	    const model = attributes[index];
	    const label = (0, _ramda.compose)(_humps.camelize, removePrefix);

	    return _extends({}, acc, { [label(model.nodeName)]: model.nodeValue });
	  }, Object.create(null));
	};

	/**
	 * @param {Object} props
	 * @return {Object}
	 */

	exports.default = props => {
	  const node = props.node;
	  const render = props.render;

	  // Obtain the reference to the observer, using the WeakMap to query whether we have an existing
	  // one to utilise before creating another.

	  const hasObserver = observers.has(node);
	  const observer = hasObserver ? observers.get(node) : new window.MutationObserver(() => {

	    // Remove the existing memorisation of the node's attributes before re-rendering.
	    attributes.delete(node);
	    render();
	  });

	  observer.observe(node, { attributes: true });
	  !hasObserver && observers.set(node, observer);

	  // Parse all of the attributes on the node, and nested those into the props passed.
	  const attrs = attributes.get(node) || transform(node.attributes);
	  attributes.set(node, attrs);

	  // Clean up the observer if the node is no longer present in the DOM.
	  !node.isConnected && observer.disconnect();

	  return _extends({}, props, { attrs });
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	// =========
	// = humps =
	// =========
	// Underscore-to-camelCase converter (and vice versa)
	// for strings and object keys

	// humps is copyright © 2012+ Dom Christie
	// Released under the MIT license.


	;(function (global) {

	  var _processKeys = function (convert, obj, options) {
	    if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj)) {
	      return obj;
	    }

	    var output,
	        i = 0,
	        l = 0;

	    if (_isArray(obj)) {
	      output = [];
	      for (l = obj.length; i < l; i++) {
	        output.push(_processKeys(convert, obj[i], options));
	      }
	    } else {
	      output = {};
	      for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	          output[convert(key, options)] = _processKeys(convert, obj[key], options);
	        }
	      }
	    }
	    return output;
	  };

	  // String conversion methods

	  var separateWords = function (string, options) {
	    options = options || {};
	    var separator = options.separator || '_';
	    var split = options.split || /(?=[A-Z])/;

	    return string.split(split).join(separator);
	  };

	  var camelize = function (string) {
	    if (_isNumerical(string)) {
	      return string;
	    }
	    string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
	      return chr ? chr.toUpperCase() : '';
	    });
	    // Ensure 1st char is always lowercase
	    return string.substr(0, 1).toLowerCase() + string.substr(1);
	  };

	  var pascalize = function (string) {
	    var camelized = camelize(string);
	    // Ensure 1st char is always uppercase
	    return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
	  };

	  var decamelize = function (string, options) {
	    return separateWords(string, options).toLowerCase();
	  };

	  // Utilities
	  // Taken from Underscore.js

	  var toString = Object.prototype.toString;

	  var _isObject = function (obj) {
	    return obj === Object(obj);
	  };
	  var _isArray = function (obj) {
	    return toString.call(obj) == '[object Array]';
	  };
	  var _isDate = function (obj) {
	    return toString.call(obj) == '[object Date]';
	  };
	  var _isRegExp = function (obj) {
	    return toString.call(obj) == '[object RegExp]';
	  };
	  var _isBoolean = function (obj) {
	    return toString.call(obj) == '[object Boolean]';
	  };

	  // Performant way to determine if obj coerces to a number
	  var _isNumerical = function (obj) {
	    obj = obj - 0;
	    return obj === obj;
	  };

	  // Sets up function which handles processing keys
	  // allowing the convert function to be modified by a callback
	  var _processor = function (convert, options) {
	    var callback = options && 'process' in options ? options.process : options;

	    if (typeof callback !== 'function') {
	      return convert;
	    }

	    return function (string, options) {
	      return callback(string, convert, options);
	    };
	  };

	  var humps = {
	    camelize: camelize,
	    decamelize: decamelize,
	    pascalize: pascalize,
	    depascalize: decamelize,
	    camelizeKeys: function (object, options) {
	      return _processKeys(_processor(camelize, options), object);
	    },
	    decamelizeKeys: function (object, options) {
	      return _processKeys(_processor(decamelize, options), object, options);
	    },
	    pascalizeKeys: function (object, options) {
	      return _processKeys(_processor(pascalize, options), object);
	    },
	    depascalizeKeys: function () {
	      return this.decamelizeKeys.apply(this, arguments);
	    }
	  };

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (humps), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== 'undefined' && module.exports) {
	    module.exports = humps;
	  } else {
	    global.humps = humps;
	  }
	})(undefined);

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("ramda");

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/**
	 * @constant states
	 * @type {WeakMap}
	 */
	const states = new WeakMap();

	/**
	 * @param {Object} initialState
	 * @return {Function}
	 */

	exports.default = initialState => {

	  return props => {

	    const hasState = states.has(props.node);
	    const state = hasState ? states.get(props.node) : initialState;
	    !hasState && states.set(props.node, state);

	    /**
	     * @method setState
	     * @param {Object} updatedState
	     * @return {void}
	     */
	    const setState = updatedState => {
	      states.set(props.node, _extends({}, state, updatedState));
	      props.render();
	    };

	    return _extends({}, props, { state, setState });
	  };
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _ramda = __webpack_require__(6);

	var _axios = __webpack_require__(9);

	/**
	 * @constant includes
	 * @type {WeakMap}
	 */
	const includes = new WeakMap();

	/**
	 * @constant includeMap
	 * @type {Object}
	 */
	const includeMap = [{ extensions: ['js'], tag: 'script', attrs: { type: 'text/javascript' } }, { extensions: ['css'], tag: 'style', attrs: { type: 'text/css' } }];

	/**
	 * @method fetchInclude
	 * @param {String} document
	 * @return {Promise}
	 */
	const fetchInclude = (0, _ramda.memoize)(document => {

	    return new Promise(resolve => {
	        (0, _axios.get)(document).then(response => response.data).then(resolve).catch(() => resolve(''));
	    });
	});

	/**
	 * @method attach
	 * @param files {Array|String}
	 * @return {Promise}
	 */
	const attach = files => {

	    // Group all of the files by their extension.
	    const groupedFiles = (0, _ramda.groupBy)(file => file.extension)(files.map(path => ({ path, extension: path.split('.').pop() })));

	    const mappedFiles = Object.keys(groupedFiles).map(extension => {

	        const nodeData = includeMap.find(model => model.extensions.includes(extension));
	        const files = groupedFiles[extension].map(model => model.path);
	        const containerNode = document.createElement(nodeData.tag);

	        // Apply all of the attributes defined in the `includeMap` to the node.
	        Object.keys(nodeData.attrs).map(key => containerNode.setAttribute(key, nodeData.attrs[key]));

	        // Load each file individually and then concatenate them.
	        return Promise.all(files.map(fetchInclude)).then(fileData => {
	            containerNode.innerHTML = fileData.reduce((acc, fileDatum) => `${ acc } ${ fileDatum }`).trim();
	            return containerNode.innerHTML.length ? containerNode : null;
	        });
	    });

	    return Promise.all(mappedFiles);
	};

	/**
	 * @param {Array} files
	 * @return {Function}
	 */

	exports.default = (...files) => {

	    return props => {
	        const node = props.node;


	        const addedFiles = (() => {

	            if (node.isConnected) {

	                const boundary = props.node.shadowRoot;

	                const hasCurrent = includes.has(node);
	                !hasCurrent && includes.set(node, []);
	                const current = includes.get(node);

	                // We don't want to load the same files again, so we'll see what was previously loaded.
	                const addedFiles = (0, _ramda.difference)(files, current);

	                // Memorise the current set of files.
	                includes.set(node, files);

	                if (addedFiles.length) {

	                    props.node.classList.add('resolving');
	                    props.node.classList.remove('resolved');

	                    attach(addedFiles).then(nodes => {

	                        // Remove any `null` values which means the content of the file was empty, and then append
	                        // them to the component's shadow boundary.
	                        nodes.filter(_ramda.identity).forEach(node => boundary.appendChild(node));

	                        props.node.classList.add('resolved');
	                        props.node.classList.remove('resolving');
	                    });
	                }

	                return addedFiles;
	            }

	            return [];
	        })();

	        return _extends({}, props, { files: addedFiles });
	    };
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("axios");

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/**
	 * @constant subscriptions
	 * @type {WeakMap}
	 */
	const subscriptions = new WeakMap();

	/**
	 * @param {Object} store
	 * @param {Function} [handler]
	 * @return {Function}
	 */

	exports.default = (store, handler = () => true) => {

	  return props => {

	    const has = subscriptions.has(props.node);
	    const prevState = store.getState();

	    // Subscribe to the store only if we haven't done so already.
	    !has && subscriptions.set(props.node, store.subscribe(() => handler(store.getState(), prevState) && props.render()));

	    return _extends({}, props, { store: store.getState(), dispatch: store.dispatch });
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.timeEnd = exports.time = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _shortid = __webpack_require__(12);

	/**
	 * @constant timers
	 * @type {WeakMap}
	 */
	const timers = new WeakMap();

	/**
	 * @method time
	 * @param {Object} props
	 * @return {Object}
	 */
	const time = exports.time = props => {

	  const node = props.node;
	  const has = timers.has(props.node);
	  const id = has ? timers.get(node) : `${ node.nodeName.toLowerCase() } (${ (0, _shortid.generate)() })`;
	  !has && timers.set(node, id);
	  console.time(id);
	  return _extends({}, props, { timer: id });
	};

	/**
	 * @method timeEnd
	 * @param {Object} props
	 * @return {Object}
	 */
	const timeEnd = exports.timeEnd = props => {

	  const id = timers.get(props.node);
	  console.timeEnd(id);
	  return _extends({}, props, { timer: id });
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(13);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var alphabet = __webpack_require__(14);
	var encode = __webpack_require__(16);
	var decode = __webpack_require__(18);
	var isValid = __webpack_require__(19);

	// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
	// This number should be updated every year or so to keep the generated id short.
	// To regenerate `new Date() - 0` and bump the version. Always bump the version!
	var REDUCE_TIME = 1459707606518;

	// don't change unless we change the algos or REDUCE_TIME
	// must be an integer and less than 16
	var version = 6;

	// if you are using cluster or multiple servers use this to make each instance
	// has a unique value for worker
	// Note: I don't know if this is automatically set when using third
	// party cluster solutions such as pm2.
	var clusterWorkerId = __webpack_require__(20) || 0;

	// Counter is used when shortid is called multiple times in one second.
	var counter;

	// Remember the last time shortid was called in case counter is needed.
	var previousSeconds;

	/**
	 * Generate unique id
	 * Returns string id
	 */
	function generate() {

	    var str = '';

	    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

	    if (seconds === previousSeconds) {
	        counter++;
	    } else {
	        counter = 0;
	        previousSeconds = seconds;
	    }

	    str = str + encode(alphabet.lookup, version);
	    str = str + encode(alphabet.lookup, clusterWorkerId);
	    if (counter > 0) {
	        str = str + encode(alphabet.lookup, counter);
	    }
	    str = str + encode(alphabet.lookup, seconds);

	    return str;
	}

	/**
	 * Set the seed.
	 * Highly recommended if you don't want people to try to figure out your id schema.
	 * exposed as shortid.seed(int)
	 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
	 */
	function seed(seedValue) {
	    alphabet.seed(seedValue);
	    return module.exports;
	}

	/**
	 * Set the cluster worker or machine id
	 * exposed as shortid.worker(int)
	 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
	 * returns shortid module so it can be chained.
	 */
	function worker(workerId) {
	    clusterWorkerId = workerId;
	    return module.exports;
	}

	/**
	 *
	 * sets new characters to use in the alphabet
	 * returns the shuffled alphabet
	 */
	function characters(newCharacters) {
	    if (newCharacters !== undefined) {
	        alphabet.characters(newCharacters);
	    }

	    return alphabet.shuffled();
	}

	// Export all other functions as properties of the generate function
	module.exports = generate;
	module.exports.generate = generate;
	module.exports.seed = seed;
	module.exports.worker = worker;
	module.exports.characters = characters;
	module.exports.decode = decode;
	module.exports.isValid = isValid;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var randomFromSeed = __webpack_require__(15);

	var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
	var alphabet;
	var previousSeed;

	var shuffled;

	function reset() {
	    shuffled = false;
	}

	function setCharacters(_alphabet_) {
	    if (!_alphabet_) {
	        if (alphabet !== ORIGINAL) {
	            alphabet = ORIGINAL;
	            reset();
	        }
	        return;
	    }

	    if (_alphabet_ === alphabet) {
	        return;
	    }

	    if (_alphabet_.length !== ORIGINAL.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
	    }

	    var unique = _alphabet_.split('').filter(function (item, ind, arr) {
	        return ind !== arr.lastIndexOf(item);
	    });

	    if (unique.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
	    }

	    alphabet = _alphabet_;
	    reset();
	}

	function characters(_alphabet_) {
	    setCharacters(_alphabet_);
	    return alphabet;
	}

	function setSeed(seed) {
	    randomFromSeed.seed(seed);
	    if (previousSeed !== seed) {
	        reset();
	        previousSeed = seed;
	    }
	}

	function shuffle() {
	    if (!alphabet) {
	        setCharacters(ORIGINAL);
	    }

	    var sourceArray = alphabet.split('');
	    var targetArray = [];
	    var r = randomFromSeed.nextValue();
	    var characterIndex;

	    while (sourceArray.length > 0) {
	        r = randomFromSeed.nextValue();
	        characterIndex = Math.floor(r * sourceArray.length);
	        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
	    }
	    return targetArray.join('');
	}

	function getShuffled() {
	    if (shuffled) {
	        return shuffled;
	    }
	    shuffled = shuffle();
	    return shuffled;
	}

	/**
	 * lookup shuffled letter
	 * @param index
	 * @returns {string}
	 */
	function lookup(index) {
	    var alphabetShuffled = getShuffled();
	    return alphabetShuffled[index];
	}

	module.exports = {
	    characters: characters,
	    seed: setSeed,
	    lookup: lookup,
	    shuffled: getShuffled
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	// Found this seed-based random generator somewhere
	// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

	var seed = 1;

	/**
	 * return a random number based on a seed
	 * @param seed
	 * @returns {number}
	 */
	function getNextValue() {
	    seed = (seed * 9301 + 49297) % 233280;
	    return seed / 233280.0;
	}

	function setSeed(_seed_) {
	    seed = _seed_;
	}

	module.exports = {
	    nextValue: getNextValue,
	    seed: setSeed
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var randomByte = __webpack_require__(17);

	function encode(lookup, number) {
	    var loopCounter = 0;
	    var done;

	    var str = '';

	    while (!done) {
	        str = str + lookup(number >> 4 * loopCounter & 0x0f | randomByte());
	        done = number < Math.pow(16, loopCounter + 1);
	        loopCounter++;
	    }
	    return str;
	}

	module.exports = encode;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

	function randomByte() {
	    if (!crypto || !crypto.getRandomValues) {
	        return Math.floor(Math.random() * 256) & 0x30;
	    }
	    var dest = new Uint8Array(1);
	    crypto.getRandomValues(dest);
	    return dest[0] & 0x30;
	}

	module.exports = randomByte;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var alphabet = __webpack_require__(14);

	/**
	 * Decode the id to get the version and worker
	 * Mainly for debugging and testing.
	 * @param id - the shortid-generated id.
	 */
	function decode(id) {
	    var characters = alphabet.shuffled();
	    return {
	        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
	        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
	    };
	}

	module.exports = decode;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var alphabet = __webpack_require__(14);

	function isShortId(id) {
	    if (!id || typeof id !== 'string' || id.length < 6) {
	        return false;
	    }

	    var characters = alphabet.characters();
	    var len = id.length;
	    for (var i = 0; i < len; i++) {
	        if (characters.indexOf(id[i]) === -1) {
	            return false;
	        }
	    }
	    return true;
	}

	module.exports = isShortId;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	module.exports = 0;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var diff = __webpack_require__(22);
	var patch = __webpack_require__(35);
	var h = __webpack_require__(44);
	var create = __webpack_require__(55);
	var VNode = __webpack_require__(46);
	var VText = __webpack_require__(47);

	module.exports = {
	    diff: diff,
	    patch: patch,
	    h: h,
	    create: create,
	    VNode: VNode,
	    VText: VText
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var diff = __webpack_require__(23);

	module.exports = diff;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isArray = __webpack_require__(24);

	var VPatch = __webpack_require__(25);
	var isVNode = __webpack_require__(27);
	var isVText = __webpack_require__(28);
	var isWidget = __webpack_require__(29);
	var isThunk = __webpack_require__(30);
	var handleThunk = __webpack_require__(31);

	var diffProps = __webpack_require__(32);

	module.exports = diff;

	function diff(a, b) {
	    var patch = { a: a };
	    walk(a, b, patch, 0);
	    return patch;
	}

	function walk(a, b, patch, index) {
	    if (a === b) {
	        return;
	    }

	    var apply = patch[index];
	    var applyClear = false;

	    if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index);
	    } else if (b == null) {

	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget(a)) {
	            clearState(a, patch, index);
	            apply = patch[index];
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b));
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName && a.namespace === b.namespace && a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties);
	                if (propsPatch) {
	                    apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch));
	                }
	                apply = diffChildren(a, b, patch, apply, index);
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
	                applyClear = true;
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
	            applyClear = true;
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
	            applyClear = true;
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
	        }
	    } else if (isWidget(b)) {
	        if (!isWidget(a)) {
	            applyClear = true;
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b));
	    }

	    if (apply) {
	        patch[index] = apply;
	    }

	    if (applyClear) {
	        clearState(a, patch, index);
	    }
	}

	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children;
	    var orderedSet = reorder(aChildren, b.children);
	    var bChildren = orderedSet.children;

	    var aLen = aChildren.length;
	    var bLen = bChildren.length;
	    var len = aLen > bLen ? aLen : bLen;

	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i];
	        var rightNode = bChildren[i];
	        index += 1;

	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode));
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index);
	        }

	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count;
	        }
	    }

	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, orderedSet.moves));
	    }

	    return apply;
	}

	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index);
	    destroyWidgets(vNode, patch, index);
	}

	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(patch[index], new VPatch(VPatch.REMOVE, vNode, null));
	        }
	    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children;
	        var len = children.length;
	        for (var i = 0; i < len; i++) {
	            var child = children[i];
	            index += 1;

	            destroyWidgets(child, patch, index);

	            if (isVNode(child) && child.count) {
	                index += child.count;
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index);
	    }
	}

	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b);
	    var thunkPatch = diff(nodes.a, nodes.b);
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch);
	    }
	}

	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true;
	        }
	    }

	    return false;
	}

	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(patch[index], new VPatch(VPatch.PROPS, vNode, undefinedKeys(vNode.hooks)));
	        }

	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children;
	            var len = children.length;
	            for (var i = 0; i < len; i++) {
	                var child = children[i];
	                index += 1;

	                unhook(child, patch, index);

	                if (isVNode(child) && child.count) {
	                    index += child.count;
	                }
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index);
	    }
	}

	function undefinedKeys(obj) {
	    var result = {};

	    for (var key in obj) {
	        result[key] = undefined;
	    }

	    return result;
	}

	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren);
	    var bKeys = bChildIndex.keys;
	    var bFree = bChildIndex.free;

	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        };
	    }

	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren);
	    var aKeys = aChildIndex.keys;
	    var aFree = aChildIndex.free;

	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        };
	    }

	    // O(MAX(N, M)) memory
	    var newChildren = [];

	    var freeIndex = 0;
	    var freeCount = bFree.length;
	    var deletedItems = 0;

	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0; i < aChildren.length; i++) {
	        var aItem = aChildren[i];
	        var itemIndex;

	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key];
	                newChildren.push(bChildren[itemIndex]);
	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++;
	                newChildren.push(null);
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++];
	                newChildren.push(bChildren[itemIndex]);
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++;
	                newChildren.push(null);
	            }
	        }
	    }

	    var lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex];

	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j];

	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem);
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem);
	        }
	    }

	    var simulate = newChildren.slice();
	    var simulateIndex = 0;
	    var removes = [];
	    var inserts = [];
	    var simulateItem;

	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k];
	        simulateItem = simulate[simulateIndex];

	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null));
	            simulateItem = simulate[simulateIndex];
	        }

	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key));
	                        simulateItem = simulate[simulateIndex];
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({ key: wantedItem.key, to: k });
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                                simulateIndex++;
	                            }
	                    } else {
	                        inserts.push({ key: wantedItem.key, to: k });
	                    }
	                } else {
	                    inserts.push({ key: wantedItem.key, to: k });
	                }
	                k++;
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                    removes.push(remove(simulate, simulateIndex, simulateItem.key));
	                }
	        } else {
	            simulateIndex++;
	            k++;
	        }
	    }

	    // remove all the remaining nodes from simulate
	    while (simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex];
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
	    }

	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        };
	    }

	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    };
	}

	function remove(arr, index, key) {
	    arr.splice(index, 1);

	    return {
	        from: index,
	        key: key
	    };
	}

	function keyIndex(children) {
	    var keys = {};
	    var free = [];
	    var length = children.length;

	    for (var i = 0; i < length; i++) {
	        var child = children[i];

	        if (child.key) {
	            keys[child.key] = i;
	        } else {
	            free.push(i);
	        }
	    }

	    return {
	        keys: keys, // A hash of key name to index
	        free: free // An array of unkeyed item indices
	    };
	}

	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch);
	        } else {
	            apply = [apply, patch];
	        }

	        return apply;
	    } else {
	        return patch;
	    }
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	var nativeIsArray = Array.isArray;
	var toString = Object.prototype.toString;

	module.exports = nativeIsArray || isArray;

	function isArray(obj) {
	    return toString.call(obj) === "[object Array]";
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(26);

	VirtualPatch.NONE = 0;
	VirtualPatch.VTEXT = 1;
	VirtualPatch.VNODE = 2;
	VirtualPatch.WIDGET = 3;
	VirtualPatch.PROPS = 4;
	VirtualPatch.ORDER = 5;
	VirtualPatch.INSERT = 6;
	VirtualPatch.REMOVE = 7;
	VirtualPatch.THUNK = 8;

	module.exports = VirtualPatch;

	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type);
	    this.vNode = vNode;
	    this.patch = patch;
	}

	VirtualPatch.prototype.version = version;
	VirtualPatch.prototype.type = "VirtualPatch";

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	module.exports = "2";

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(26);

	module.exports = isVirtualNode;

	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version;
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(26);

	module.exports = isVirtualText;

	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version;
	}

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";

	module.exports = isWidget;

	function isWidget(w) {
	    return w && w.type === "Widget";
	}

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

	module.exports = isThunk;

	function isThunk(t) {
	    return t && t.type === "Thunk";
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isVNode = __webpack_require__(27);
	var isVText = __webpack_require__(28);
	var isWidget = __webpack_require__(29);
	var isThunk = __webpack_require__(30);

	module.exports = handleThunk;

	function handleThunk(a, b) {
	    var renderedA = a;
	    var renderedB = b;

	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a);
	    }

	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null);
	    }

	    return {
	        a: renderedA,
	        b: renderedB
	    };
	}

	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode;

	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous);
	    }

	    if (!(isVNode(renderedThunk) || isVText(renderedThunk) || isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }

	    return renderedThunk;
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isObject = __webpack_require__(33);
	var isHook = __webpack_require__(34);

	module.exports = diffProps;

	function diffProps(a, b) {
	    var diff;

	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {};
	            diff[aKey] = undefined;
	        }

	        var aValue = a[aKey];
	        var bValue = b[aKey];

	        if (aValue === bValue) {
	            continue;
	        } else if (isObject(aValue) && isObject(bValue)) {
	            if (getPrototype(bValue) !== getPrototype(aValue)) {
	                diff = diff || {};
	                diff[aKey] = bValue;
	            } else if (isHook(bValue)) {
	                diff = diff || {};
	                diff[aKey] = bValue;
	            } else {
	                var objectDiff = diffProps(aValue, bValue);
	                if (objectDiff) {
	                    diff = diff || {};
	                    diff[aKey] = objectDiff;
	                }
	            }
	        } else {
	            diff = diff || {};
	            diff[aKey] = bValue;
	        }
	    }

	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {};
	            diff[bKey] = b[bKey];
	        }
	    }

	    return diff;
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value);
	    } else if (value.__proto__) {
	        return value.__proto__;
	    } else if (value.constructor) {
	        return value.constructor.prototype;
	    }
	}

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function isObject(x) {
		return typeof x === "object" && x !== null;
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	module.exports = isHook;

	function isHook(hook) {
	  return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var patch = __webpack_require__(36);

	module.exports = patch;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var document = __webpack_require__(37);
	var isArray = __webpack_require__(24);

	var render = __webpack_require__(39);
	var domIndex = __webpack_require__(41);
	var patchOp = __webpack_require__(42);
	module.exports = patch;

	function patch(rootNode, patches, renderOptions) {
	    renderOptions = renderOptions || {};
	    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch ? renderOptions.patch : patchRecursive;
	    renderOptions.render = renderOptions.render || render;

	    return renderOptions.patch(rootNode, patches, renderOptions);
	}

	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches);

	    if (indices.length === 0) {
	        return rootNode;
	    }

	    var index = domIndex(rootNode, patches.a, indices);
	    var ownerDocument = rootNode.ownerDocument;

	    if (!renderOptions.document && ownerDocument !== document) {
	        renderOptions.document = ownerDocument;
	    }

	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i];
	        rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions);
	    }

	    return rootNode;
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode;
	    }

	    var newNode;

	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions);

	            if (domNode === rootNode) {
	                rootNode = newNode;
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions);

	        if (domNode === rootNode) {
	            rootNode = newNode;
	        }
	    }

	    return rootNode;
	}

	function patchIndices(patches) {
	    var indices = [];

	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key));
	        }
	    }

	    return indices;
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var topLevel = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
	var minDoc = __webpack_require__(38);

	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 38 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var document = __webpack_require__(37);

	var applyProperties = __webpack_require__(40);

	var isVNode = __webpack_require__(27);
	var isVText = __webpack_require__(28);
	var isWidget = __webpack_require__(29);
	var handleThunk = __webpack_require__(31);

	module.exports = createElement;

	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document;
	    var warn = opts ? opts.warn : null;

	    vnode = handleThunk(vnode).a;

	    if (isWidget(vnode)) {
	        return vnode.init();
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text);
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode);
	        }
	        return null;
	    }

	    var node = vnode.namespace === null ? doc.createElement(vnode.tagName) : doc.createElementNS(vnode.namespace, vnode.tagName);

	    var props = vnode.properties;
	    applyProperties(node, props);

	    var children = vnode.children;

	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts);
	        if (childNode) {
	            node.appendChild(childNode);
	        }
	    }

	    return node;
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isObject = __webpack_require__(33);
	var isHook = __webpack_require__(34);

	module.exports = applyProperties;

	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName];

	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous);
	            if (propValue.hook) {
	                propValue.hook(node, propName, previous ? previous[propName] : undefined);
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue;
	            }
	        }
	    }
	}

	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName];

	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName);
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = "";
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = "";
	            } else {
	                node[propName] = null;
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue);
	        }
	    }
	}

	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined;

	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName];

	            if (attrValue === undefined) {
	                node.removeAttribute(attrName);
	            } else {
	                node.setAttribute(attrName, attrValue);
	            }
	        }

	        return;
	    }

	    if (previousValue && isObject(previousValue) && getPrototype(previousValue) !== getPrototype(propValue)) {
	        node[propName] = propValue;
	        return;
	    }

	    if (!isObject(node[propName])) {
	        node[propName] = {};
	    }

	    var replacer = propName === "style" ? "" : undefined;

	    for (var k in propValue) {
	        var value = propValue[k];
	        node[propName][k] = value === undefined ? replacer : value;
	    }
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value);
	    } else if (value.__proto__) {
	        return value.__proto__;
	    } else if (value.constructor) {
	        return value.constructor.prototype;
	    }
	}

/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";

	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.

	var noChild = {};

	module.exports = domIndex;

	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {};
	    } else {
	        indices.sort(ascending);
	        return recurse(rootNode, tree, indices, nodes, 0);
	    }
	}

	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {};

	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode;
	        }

	        var vChildren = tree.children;

	        if (vChildren) {

	            var childNodes = rootNode.childNodes;

	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1;

	                var vChild = vChildren[i] || noChild;
	                var nextIndex = rootIndex + (vChild.count || 0);

	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
	                }

	                rootIndex = nextIndex;
	            }
	        }
	    }

	    return nodes;
	}

	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false;
	    }

	    var minIndex = 0;
	    var maxIndex = indices.length - 1;
	    var currentIndex;
	    var currentItem;

	    while (minIndex <= maxIndex) {
	        currentIndex = (maxIndex + minIndex) / 2 >> 0;
	        currentItem = indices[currentIndex];

	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right;
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1;
	        } else if (currentItem > right) {
	            maxIndex = currentIndex - 1;
	        } else {
	            return true;
	        }
	    }

	    return false;
	}

	function ascending(a, b) {
	    return a > b ? 1 : -1;
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var applyProperties = __webpack_require__(40);

	var isWidget = __webpack_require__(29);
	var VPatch = __webpack_require__(25);

	var updateWidget = __webpack_require__(43);

	module.exports = applyPatch;

	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type;
	    var vNode = vpatch.vNode;
	    var patch = vpatch.patch;

	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode);
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions);
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions);
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions);
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions);
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch);
	            return domNode;
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties);
	            return domNode;
	        case VPatch.THUNK:
	            return replaceRoot(domNode, renderOptions.patch(domNode, patch, renderOptions));
	        default:
	            return domNode;
	    }
	}

	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode;

	    if (parentNode) {
	        parentNode.removeChild(domNode);
	    }

	    destroyWidget(domNode, vNode);

	    return null;
	}

	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = renderOptions.render(vNode, renderOptions);

	    if (parentNode) {
	        parentNode.appendChild(newNode);
	    }

	    return parentNode;
	}

	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode;

	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text);
	        newNode = domNode;
	    } else {
	        var parentNode = domNode.parentNode;
	        newNode = renderOptions.render(vText, renderOptions);

	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode);
	        }
	    }

	    return newNode;
	}

	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget);
	    var newNode;

	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode;
	    } else {
	        newNode = renderOptions.render(widget, renderOptions);
	    }

	    var parentNode = domNode.parentNode;

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode);
	    }

	    if (!updating) {
	        destroyWidget(domNode, leftVNode);
	    }

	    return newNode;
	}

	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode;
	    var newNode = renderOptions.render(vNode, renderOptions);

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode);
	    }

	    return newNode;
	}

	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode);
	    }
	}

	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes;
	    var keyMap = {};
	    var node;
	    var remove;
	    var insert;

	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i];
	        node = childNodes[remove.from];
	        if (remove.key) {
	            keyMap[remove.key] = node;
	        }
	        domNode.removeChild(node);
	    }

	    var length = childNodes.length;
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j];
	        node = keyMap[insert.key];
	        // this is the weirdest bug i've ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
	    }
	}

	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
	    }

	    return newRoot;
	}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isWidget = __webpack_require__(29);

	module.exports = updateWidget;

	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id;
	        } else {
	            return a.init === b.init;
	        }
	    }

	    return false;
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var h = __webpack_require__(45);

	module.exports = h;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(24);

	var VNode = __webpack_require__(46);
	var VText = __webpack_require__(47);
	var isVNode = __webpack_require__(27);
	var isVText = __webpack_require__(28);
	var isWidget = __webpack_require__(29);
	var isHook = __webpack_require__(34);
	var isVThunk = __webpack_require__(30);

	var parseTag = __webpack_require__(48);
	var softSetHook = __webpack_require__(50);
	var evHook = __webpack_require__(51);

	module.exports = h;

	function h(tagName, properties, children) {
	    var childNodes = [];
	    var tag, props, key, namespace;

	    if (!children && isChildren(properties)) {
	        children = properties;
	        props = {};
	    }

	    props = props || properties || {};
	    tag = parseTag(tagName, props);

	    // support keys
	    if (props.hasOwnProperty('key')) {
	        key = props.key;
	        props.key = undefined;
	    }

	    // support namespace
	    if (props.hasOwnProperty('namespace')) {
	        namespace = props.namespace;
	        props.namespace = undefined;
	    }

	    // fix cursor bug
	    if (tag === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined && !isHook(props.value)) {
	        props.value = softSetHook(props.value);
	    }

	    transformProperties(props);

	    if (children !== undefined && children !== null) {
	        addChild(children, childNodes, tag, props);
	    }

	    return new VNode(tag, props, childNodes, key, namespace);
	}

	function addChild(c, childNodes, tag, props) {
	    if (typeof c === 'string') {
	        childNodes.push(new VText(c));
	    } else if (typeof c === 'number') {
	        childNodes.push(new VText(String(c)));
	    } else if (isChild(c)) {
	        childNodes.push(c);
	    } else if (isArray(c)) {
	        for (var i = 0; i < c.length; i++) {
	            addChild(c[i], childNodes, tag, props);
	        }
	    } else if (c === null || c === undefined) {
	        return;
	    } else {
	        throw UnexpectedVirtualElement({
	            foreignObject: c,
	            parentVnode: {
	                tagName: tag,
	                properties: props
	            }
	        });
	    }
	}

	function transformProperties(props) {
	    for (var propName in props) {
	        if (props.hasOwnProperty(propName)) {
	            var value = props[propName];

	            if (isHook(value)) {
	                continue;
	            }

	            if (propName.substr(0, 3) === 'ev-') {
	                // add ev-foo support
	                props[propName] = evHook(value);
	            }
	        }
	    }
	}

	function isChild(x) {
	    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
	}

	function isChildren(x) {
	    return typeof x === 'string' || isArray(x) || isChild(x);
	}

	function UnexpectedVirtualElement(data) {
	    var err = new Error();

	    err.type = 'virtual-hyperscript.unexpected.virtual-element';
	    err.message = 'Unexpected virtual child passed to h().\n' + 'Expected a VNode / Vthunk / VWidget / string but:\n' + 'got:\n' + errorString(data.foreignObject) + '.\n' + 'The parent vnode is:\n' + errorString(data.parentVnode);
	    '\n' + 'Suggested fix: change your `h(..., [ ... ])` callsite.';
	    err.foreignObject = data.foreignObject;
	    err.parentVnode = data.parentVnode;

	    return err;
	}

	function errorString(obj) {
	    try {
	        return JSON.stringify(obj, null, '    ');
	    } catch (e) {
	        return String(obj);
	    }
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(26);
	var isVNode = __webpack_require__(27);
	var isWidget = __webpack_require__(29);
	var isThunk = __webpack_require__(30);
	var isVHook = __webpack_require__(34);

	module.exports = VirtualNode;

	var noProperties = {};
	var noChildren = [];

	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName;
	    this.properties = properties || noProperties;
	    this.children = children || noChildren;
	    this.key = key != null ? String(key) : undefined;
	    this.namespace = typeof namespace === "string" ? namespace : null;

	    var count = children && children.length || 0;
	    var descendants = 0;
	    var hasWidgets = false;
	    var hasThunks = false;
	    var descendantHooks = false;
	    var hooks;

	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName];
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {};
	                }

	                hooks[propName] = property;
	            }
	        }
	    }

	    for (var i = 0; i < count; i++) {
	        var child = children[i];
	        if (isVNode(child)) {
	            descendants += child.count || 0;

	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true;
	            }

	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true;
	            }

	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true;
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true;
	            }
	        } else if (!hasThunks && isThunk(child)) {
	            hasThunks = true;
	        }
	    }

	    this.count = count + descendants;
	    this.hasWidgets = hasWidgets;
	    this.hasThunks = hasThunks;
	    this.hooks = hooks;
	    this.descendantHooks = descendantHooks;
	}

	VirtualNode.prototype.version = version;
	VirtualNode.prototype.type = "VirtualNode";

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var version = __webpack_require__(26);

	module.exports = VirtualText;

	function VirtualText(text) {
	    this.text = String(text);
	}

	VirtualText.prototype.version = version;
	VirtualText.prototype.type = "VirtualText";

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var split = __webpack_require__(49);

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	module.exports = parseTag;

	function parseTag(tag, props) {
	    if (!tag) {
	        return 'DIV';
	    }

	    var noId = !props.hasOwnProperty('id');

	    var tagParts = split(tag, classIdSplit);
	    var tagName = null;

	    if (notClassId.test(tagParts[1])) {
	        tagName = 'DIV';
	    }

	    var classes, part, type, i;

	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i];

	        if (!part) {
	            continue;
	        }

	        type = part.charAt(0);

	        if (!tagName) {
	            tagName = part;
	        } else if (type === '.') {
	            classes = classes || [];
	            classes.push(part.substring(1, part.length));
	        } else if (type === '#' && noId) {
	            props.id = part.substring(1, part.length);
	        }
	    }

	    if (classes) {
	        if (props.className) {
	            classes.push(props.className);
	        }

	        props.className = classes.join(' ');
	    }

	    return props.namespace ? tagName : tagName.toUpperCase();
	}

/***/ },
/* 49 */
/***/ function(module, exports) {

	"use strict";

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = function split(undef) {

	  var nativeSplit = String.prototype.split,
	      compliantExecNpcg = /()??/.exec("")[1] === undef,

	  // NPCG: nonparticipating capturing group
	  self;

	  self = function (str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	        flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + ( // Proposed for ES6
	    separator.sticky ? "y" : ""),

	    // Firefox 3+
	    lastLastIndex = 0,

	    // Make `global` and avoid `lastIndex` issues by working with a copy
	    separator = new RegExp(separator.source, flags + "g"),
	        separator2,
	        match,
	        lastIndex,
	        lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function () {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	}();

/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';

	module.exports = SoftSetHook;

	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }

	    this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EvStore = __webpack_require__(52);

	module.exports = EvHook;

	function EvHook(value) {
	    if (!(this instanceof EvHook)) {
	        return new EvHook(value);
	    }

	    this.value = value;
	}

	EvHook.prototype.hook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = this.value;
	};

	EvHook.prototype.unhook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = undefined;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OneVersionConstraint = __webpack_require__(53);

	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);

	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

	module.exports = EvStore;

	function EvStore(elem) {
	    var hash = elem[hashKey];

	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }

	    return hash;
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Individual = __webpack_require__(54);

	module.exports = OneVersion;

	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';

	    var versionValue = Individual(enforceKey, version);

	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' + moduleName + '.\n' + 'You already have version ' + versionValue + ' installed.\n' + 'This means you cannot install version ' + version);
	    }

	    return Individual(key, defaultValue);
	}

/***/ },
/* 54 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/*global window, global*/

	var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

	module.exports = Individual;

	function Individual(key, value) {
	    if (key in root) {
	        return root[key];
	    }

	    root[key] = value;

	    return value;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var createElement = __webpack_require__(39);

	module.exports = createElement;

/***/ }
/******/ ]);