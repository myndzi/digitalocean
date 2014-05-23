'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Size(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
        this.id = obj.id || this.id;
        this.name = obj.name || this.name;
        this.slug = obj.slug || this.slug;
    }
    util.inherits(Size, parent);
    
    parent.prototype.getSizes = function (filter) {
        return this.apiRequest('sizes/')
        .then(function (res) {
            var sizes = res.sizes.map(function (i) { return new Size(i); });
            if (filter) { sizes = sizes.filter(filter); }
            return sizes;
        });
    };
    return Size;
};
