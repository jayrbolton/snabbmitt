'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('./lib/component'),
    instanceComponent = _require.instanceComponent,
    _component = _require.component;

var defaultPatch = void 0;

function defineArgs(args) {
    var props = {};
    var children = [];

    if (args.length === 2) {
        var _args = _slicedToArray(args, 2);

        props = _args[0];
        children = _args[1];
    } else if (args.length === 1) {
        if (Array.isArray(args[0])) {
            children = args[0];
        } else {
            props = args[0];
        }
    }

    return [props, children];
}

function snabbmitt() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var patch = void 0;

    if (typeof args[0] === 'function') {
        patch = args[0];
    } else if (args.length === 0 && defaultPatch) {
        patch = defaultPatch;
    } else {
        var snabbdom = require('snabbdom');
        if (args.length === 0) {
            patch = snabbdom.init([]);
        } else {
            patch = snabbdom.init.apply(snabbdom, args);
        }
    }

    if (!defaultPatch) {
        defaultPatch = patch;
    }

    return {
        run: function run(container, factory) {
            var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var instance = instanceComponent(patch, container, factory, props);
            return instance.render({ usePatch: true, props: props });
        },
        component: function component(factory) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return _component.apply(undefined, [patch, factory].concat(_toConsumableArray(defineArgs(args))));
        }
    };
}

exports.component = function (factory) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
    }

    return _component.apply(undefined, [defaultPatch, factory].concat(_toConsumableArray(defineArgs(args))));
};

exports.snabbmitt = snabbmitt;

