'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Region(opts) {
        parent.call(this);
        this.id = opts.id || this.id;
        this.slug = opts.slug || this.slug;
        this.nodes = Array.isArray(opts.nodes) ? opts.nodes : (this.nodes || []);
    }
    util.inherits(Region, parent);
    
    parent.prototype.getRegions = function (filter) {
        return this.apiRequest('regions/')
        .bind(this)
        .then(function (res) {
            var regions = res.regions.map(function (r) { return new Region(r); });
            if (typeof filter === 'function') { regions = regions.filter(filter); }
            return regions;
        });
    };
    // this node stuff needs to come out
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
    
    return Region;
};
