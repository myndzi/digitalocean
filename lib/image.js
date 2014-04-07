'use strict';

var Promise = require('bluebird');

module.exports = Image;

function Image(obj, apiRequest) {
    if (typeof obj === number) { obj = { id: number }; }
    this.reqFn = apiRequest || this.reqFn;
    this.id = obj.id || this.id;
    this.name = obj.name || this.name;
    this.distribution = obj.distribution || this.distribution;
    this.slug = obj.slug || this.slug;
    this.public = obj.public !== void 0 ? obj.public : this.public;
}
Image.prototype.apiRequest = function (url, args) {
    return this.reqFn(url.replace('?', this.id), args);
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
