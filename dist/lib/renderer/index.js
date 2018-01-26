"use strict";

module.exports = function createRenderer(patch, container) {
    var vnode = container;

    function render(_ref) {
        var usePatch = _ref.usePatch,
            view = _ref.view,
            state = _ref.state,
            props = _ref.props,
            children = _ref.children;

        if (usePatch && vnode && (vnode.elm || vnode.parentNode)) {
            vnode = patch(vnode, view({ state: state, props: props, children: children }));
        } else {
            vnode = view({ state: state, props: props, children: children });
        }

        return vnode;
    }

    return render;
};