'use strict';

var extend = require('jquery-extend'),
    request = require('request'),
    Promise = require('bluebird');

var Droplet = require('./lib/droplet'),
    Region = require('./lib/region'),
    Image = require('./lib/image'),
    Key = require('./lib/key');
    
var config = require('./config');

function pRequest(url, qs) {
    return new Promise(function (resolve, reject) {
        console.log({ url: url, qs: qs });
        request({ url: url, qs: qs }, function (err, res, body) {
            if (err) { reject(new Error(err)); }
            else {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    return reject(new Error('Failed to convert JSON'));
                }
                
                if (body.status === 'ERROR') {
                    reject(new Error(body.message));
                } else {
                    console.log(body);
                    resolve(body);
                }
            }
        });
    });
}
/*
GET https://api.digitalocean.com/droplets/new?
client_id=[client_id]&
api_key=[api_key]&
name=[droplet_name]&
size_id=[size_id]&
image_id=[image_id]&
region_id=[region_id]&
ssh_key_ids=[ssh_key_id1],[ssh_key_id2]
*/
function DO(config) {
    this.apiHost = config.apiHost;
    this.clientId = config.clientId;
    this.apiKey = config.apiKey;
}
DO.prototype.apiRequest = function (path, args) {
    var qs = extend({}, {
        client_id: this.clientId,
        api_key: this.apiKey
    }, args);
    return pRequest(this.apiHost + path, qs);
};

DO.Droplet = Droplet;
DO.prototype.getDroplets = function () {
    var req = this.apiRequest.bind(this);
    
    return this.apiRequest('droplets/')
    .then(function (res) {
        if (res.status === 'OK') {
            return res.droplets.map(function (d) {
                return new Droplet(d, req);
            });
        }
    });
};
DO.prototype.createDroplet = function (args) {
    if (args.name === void 0 ||
        args.size === void 0 ||
        args.image === void 0 ||
        args.region === void 0)
    {
        var err = new Error('Invalid arguments');
        err.args = args;
        return Promise.reject(err);
    }
    
    return this.apiRequest('droplets/new', {
        name: args.name,
        size_id: args.sizeId,
        image_id: args.imageId,
        region_id: args.regionId,
        ssh_key_ids: Array.isArray(args.keys) ? args.keys.join() : args.keys,
        private_networking: !!args.private,
        backups_enabled: !!args.backup
    });
};

DO.prototype.getRegions = function () {
    var req = this.apiRequest.bind(this);
    
    return this.apiRequest('regions/')
    .then(function (res) {
        return res.regions.map(function (r) { return new Region(r, req); });
    });
};

DO.Image = Image;
DO.prototype.getImages = function () {
    return this.apiRequest('images/')
    .then(function (res) { return res.images; });
};

DO.Key = Key;
DO.prototype.getKeys = function () {
    var req = this.apiRequest.bind(this);
    
    return this.apiRequest('ssh_keys/')
    .then(function (res) {
        return Promise.map(res.ssh_keys, function (k) {
            var key = new Key(k, req);
            return key.fetch();
        });
    });
};

var foo = new DO(config);
foo.getDroplets().then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.error(err.stack);
});
