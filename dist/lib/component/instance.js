'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var mitt = require('mitt');
var applyHook = require('./hook');
var createRenderer = require('../renderer');

module.exports = function instanceComponent(patch, container, factory) {
    var userProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var _render = createRenderer(patch, container);
    var props = userProps;
    var children = [];
    var userView = void 0;
    var store = void 0;
    var emitter = mitt();

    emitter.on('render', function () {
        _render({ usePatch: true, view: view, state: state, props: props, children: children });
    });

    var instance = factory({ emitter: emitter, props: props });

    if (typeof instance === 'function') {
        userView = instance;
    } else {
        userView = instance.view;
        store = instance.store;
    }

    var view = function view(_ref) {
        var state = _ref.state,
            props = _ref.props,
            children = _ref.children;

        return applyHook(userView({ state: state, props: props, children: children }));
    };

    var state = typeof store === 'function' ? store() : {};
    if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') throw new Error('Store function in your components should return an state object');

    return {
        render: function render(_ref2) {
            var _ref2$usePatch = _ref2.usePatch,
                usePatch = _ref2$usePatch === undefined ? false : _ref2$usePatch,
                _ref2$props = _ref2.props,
                userProps = _ref2$props === undefined ? {} : _ref2$props,
                _ref2$children = _ref2.children,
                userChildren = _ref2$children === undefined ? [] : _ref2$children;

            props = userProps;
            children = userChildren;
            return _render({ usePatch: usePatch, view: view, state: state, props: props, children: children });
        },

        state: state,
        props: props,
        emitter: emitter
    };
};