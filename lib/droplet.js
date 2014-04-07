'use strict';

var Promise = require('bluebird');

module.exports = Droplet;

function Droplet(obj, apiRequest) {
    if (typeof obj === 'number') { obj = { id: number }; }
    this.reqFn = apiRequest || this.reqFn;
    this.id = obj.id || this.id;
    this.name = obj.name || this.name;
    this.type = /^CC/.test(this.name) ? 'cc' : 'node';
    this.imageId = obj.image_id || this.imageId;
    this.sizeId = obj.size_id || this.sizeId;
    this.regionId = obj.region_id || this.regionId;
    this.backupsActive = obj.backups_active !== void 0 ? obj.backups_active : this.backupsActive;
    this.ipAddress = obj.ip_address || this.ipAddress;
    this.privateIpAddress = obj.private_ip_address || this.privateIpAddress;
    this.locked = obj.locked !== void 0 ? obj.locked : this.locked;
    this.status = obj.status || this.status;
    this.createdAt = obj.created_at || this.createdAt;
}
Droplet.prototype.apiRequest = function (url, args) {
    return this.reqFn(url.replace('?', this.id), args);
};
Droplet.prototype.fetch = function () {
    var self = this;
    
    return this.apiRequest('images/?/').then(function (obj) {
        Droplet.call(self, obj.droplet);
        return self;
    });
};
Droplet.prototype.reboot = function () {
    return this.apiRequest('droplets/?/reboot/');
};
Droplet.prototype.powerCycle = function () {
    return this.apiRequest('droplets/?/power_cycle/');
};
Droplet.prototype.shutdown = function () {
    return this.apiRequest('droplets/?/shutdown/');
};
Droplet.prototype.powerOff = function () {
    return this.apiRequest('droplets/?/power_off/');
};
Droplet.prototype.powerOn = function () {
    return this.apiRequest('droplets/?/power_on/');
};
Droplet.prototype.resetRootPassword = function () {
    return this.apiRequest('droplets/?/password_reset/');
};
Droplet.prototype.resize = function (newSize) {
    return this.apiRequest('droplets/?/resize/', { size_id: newSize });
};
Droplet.prototype.snapshot = function (name) {
    if (typeof name !== 'string') { return Promise.reject(new Error('Invalid snapshot name')); }
    return this.apiRequest('droplets/?/snapshot/');
};
Droplet.prototype.restore = function (imageId) {
    return this.apiRequest('droplets/?/restore/', { image_id: imageId });
};
Droplet.prototype.rebuild = function (imageId) {
    return this.apiRequest('droplets/?/rebuild/', { image_id: imageId });
};
Droplet.prototype.rename = function (newName) {
    if (typeof name !== 'string') { return Promise.reject(new Error('Invalid droplet name')); }
    return this.apiRequest('droplets/?/rename/', { name: newName });
};
Droplet.prototype.destroy = function (scrub) {
    return this.apiRequest('droplets/?/destroy/', { scrub_data: !!scrub });
};
