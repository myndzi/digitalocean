'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Droplet(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
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
    util.inherits(Droplet, parent);
    
    parent.prototype.getDroplets = function (filter) {
        return this.apiRequest('droplets/')
        .bind(this)
        .then(function (res) {
            var droplets = res.droplets.map(function (d) { return new Droplet(d); });
            if (typeof filter === 'function') { droplets = droplets.filter(filter); }
            return droplets;
        });
    };
    parent.prototype.getDroplet = function (id) {
        return this.apiRequest('droplets/'+id)
        .bind(this)
        .then(function (res) {
            return new Droplet(res.droplet);
        });
    };
    parent.prototype.createDroplet = function (args) {
        if (args.name === void 0 ||
            (args.sizeId === void 0 && args.sizeSlug === void 0) ||
            (args.imageId === void 0 && args.imageSlug === void 0) ||
            (args.regionId === void 0 && args.regionSlug === void 0))
        {
            var err = new Error('Invalid arguments');
            err.args = args;
            return Promise.reject(err);
        }
        
        return this.apiRequest('droplets/new', {
            name: args.name,
            size_id: args.sizeId,
            size_slug: args.sizeSlug,
            image_id: args.imageId,
            image_slug: args.imageSlug,
            region_id: args.regionId,
            region_slug: args.regionSlug,
            ssh_key_ids: Array.isArray(args.keys) ? args.keys.join() : args.keys,
            private_networking: !!args.private,
            backups_enabled: !!args.backup
        });
    };
    
    Droplet.prototype.fetch = function () {
        return this.apiRequest('images/?/')
        .bind(this)
        .then(function (obj) {
            Droplet.call(this, obj.droplet);
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

    return Droplet;
};
