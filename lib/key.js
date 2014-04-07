'use strict';

var Promise = require('bluebird');

module.exports = Key;

function Key(obj, apiRequest) {
    if (typeof obj === 'number') { obj = { id: number }; }
    this.reqFn = apiRequest || this.reqFn;
    this.id = obj.id || this.id;
    this.name = obj.name || this.name;
    this.publicKey = obj.ssh_pub_key || this.publicKey;
    this.privateKey = obj.ssh_priv_key || this.privateKey;
}
Key.prototype.apiRequest = function (url, args) {
    return this.reqFn(url.replace('?', this.id), args);
};
Key.prototype.fetch = function () {
    var self = this;
    
    return this.apiRequest('ssh_keys/?/').then(function (obj) {
        console.log(obj);
        Key.call(self, obj.ssh_key);
        return self;
    });
};
Key.prototype.edit = function (newKey) {
    return this.apiRequest('ssh_keys/?/edit/', { ssh_pub_key: newKey });
};
Key.prototype.destroy = function () {
    return this.apiRequest('ssh_keys/?/destroy/');
};
