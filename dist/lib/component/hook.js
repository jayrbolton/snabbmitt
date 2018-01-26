'use strict';

var _require = require('../symbols'),
    _snabbmitt = _require._snabbmitt;

var copyRefs = require('./copy-refs');
var noop = function noop() {};
var hooks = ['pre', 'init', 'create', 'insert', 'prepatch', 'update', 'postpatch', 'destroy', 'remove', 'post'];

module.exports = function applyHook(vnode) {
    vnode.data.hook = vnode.data.hook || {};

    var componentHooks = {
        create: function create() {
            var _ref;

            var vnode = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
            if (vnode.data[_snabbmitt]) {
                vnode.data[_snabbmitt].cvnode.elm = vnode.elm;
            }
        },
        postpatch: function postpatch(oldVnode, vnode) {
            if (oldVnode.data[_snabbmitt]) {
                var rvnode = oldVnode.data[_snabbmitt].rvnode;
                copyRefs(rvnode, vnode);
                vnode.data[_snabbmitt] = oldVnode.data[_snabbmitt];
            }
        }
    };

    var _loop = function _loop(hook) {
        if (!vnode.data.hook[hook] && !componentHooks[hook]) {
            return 'continue';
        }
        var cb = vnode.data.hook[hook] || noop;
        var componentCb = componentHooks[hook] || noop;
        vnode.data.hook[hook] = function () {
            componentCb.apply(undefined, arguments);
            cb.apply(undefined, arguments);
        };
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = hooks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var hook = _step.value;

            var _ret = _loop(hook);

            if (_ret === 'continue') continue;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return vnode;
};