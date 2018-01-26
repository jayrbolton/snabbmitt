'use strict';

var _require = require('../symbols'),
    _snabbmitt = _require._snabbmitt;

var instanceComponent = require('./instance');
var copyRefs = require('./copy-refs');

module.exports = function component(patch, factory) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var children = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    if (!factory.sel) {
        factory.sel = 'component';
    }

    return {
        sel: factory.sel,
        key: props.key,
        data: {
            hook: {
                init: function init(vnode) {
                    var instance = instanceComponent(patch, null, factory, props);
                    var cvnode = instance.render({ props: props, children: children });

                    if (factory.sel === 'component') {
                        // from now we know the indentity of this type of components
                        factory.sel = cvnode.sel;
                    }

                    cvnode.data[_snabbmitt] = {
                        instance: instance,
                        factory: factory,
                        cvnode: cvnode,
                        rvnode: vnode
                    };
                    copyRefs(vnode, cvnode);
                },
                prepatch: function prepatch(oldVnode, vnode) {
                    var cvnode = oldVnode.data[_snabbmitt].instance.render({ props: props, children: children });
                    cvnode.data[_snabbmitt] = oldVnode.data[_snabbmitt];
                    cvnode.data[_snabbmitt].rvnode = vnode;
                    cvnode.elm = oldVnode.elm;
                    copyRefs(vnode, cvnode);
                }
            }
        }
    };
};