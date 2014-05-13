'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Image(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
        this.id = obj.id || this.id;
        this.name = obj.name || this.name;
        this.distribution = obj.distribution || this.distribution;
        this.slug = obj.slug || this.slug;
        this.public = obj.public !== void 0 ? obj.public : this.public;
    }
    util.inherits(Image, parent);
    
    parent.prototype.getImages = function (filter) {
        return this.apiRequest('images/')
        .then(function (res) {
            console.log(res.images);
            var images = res.images.map(function (i) { return new Image(i); });
            if (filter) { images = images.filter(filter); }
            return images;
        });
    };
    
    Image.prototype.fetch = function () {
        var self = this;
        
        return this.apiRequest('images/?/').then(function (obj) {
            Image.call(self, obj.image);
            return self;
        });
    };
    Image.prototype.destroy = function () {
        return this.apiRequest('images/?/destroy/');
    };
    Image.prototype.transfer = function (newRegion) {
        return this.apiRequest('images/?/transfer', { region_id: newRegion });
    };
    Image.prototype.getImages = function () {
        return this.apiRequest('images/')
        .then(function (res) { return res.images; });
    };
    
    return Image;
};
