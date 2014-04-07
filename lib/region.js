'use strict';

module.exports = Region;

function Region(opts) {
    this.id = opts.id || this.id;
    this.slug = opts.slug || this.slug;
    this.nodes = Array.isArray(opts.nodes) ? opts.nodes : (this.nodes || []);
}
Region.prototype.addNode = function (node) {
    if (this.nodes.indexOf(node) === -1) {
        this.nodes.push(node);
    }
    return node;
};
Region.prototype.removeNode = function (node) {
    var node = this.findNode(node);
    if (node) {
        this.nodes.splice(this.nodes.indexOf(node), 1);
    }
    return node;
};
Region.prototype.findNode = function (node) {
    var i, x;
    if (typeof node === 'number') {
        for (i = 0; x = this.nodes.length; i < x) {
            if (this.nodes[i].id === node) {
                return this.nodes[i];
            }
        }
        return null;
    } else if (typeof node === 'string') {
        for (i = 0; x = this.nodes.length; i < x) {
            if (this.nodes[i].slug === node) {
                return this.nodes[i];
            }
        }
        return null;
    } else {
        i = this.nodes.indexOf(node);
        if (i > -1) return node;
        return null;
    }
};
