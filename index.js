'use strict';

var assert = require('assert'),
    extend = require('jquery-extend'),
    request = require('request'),
    Promise = require('bluebird');

var Droplet = require('./lib/droplet'),
    Region = require('./lib/region'),
    Image = require('./lib/image'),
    Key = require('./lib/key'),
    ApiEvent = require('./lib/apievent');
    
module.exports = DO;

Promise.prototype.event = function () {
    var req = this.apiRequest;
    return this.then(function (evt) {
        return new ApiEvent(evt, req);
    });
};

function DO(config) {
    function Client() {
        this.apiHost = config.apiHost;
        this.clientId = config.clientId;
        this.apiKey = config.apiKey;
        this.apiRate = config.apiRate || 1000;
        this.apiPollRate = config.apiPollRate || 5000;
        this.regions = config.regions;
    }
    ['Image', 'Droplet', 'Key', 'Region', 'Domain', 'Size', 'ApiEvent'].forEach(function (type) {
        Client[type] = require('./lib/'+type.toLowerCase())(Client, Promise);
    });

    Client.prototype.apiRequest = function (path, args) {
        if (path.indexOf('?') > -1) { assert.notEqual(this.id, void 0); }
        
        var url = this.apiHost + path.replace('?', this.id);
        var qs = extend({}, {
            client_id: this.clientId,
            api_key: this.apiKey
        }, args);

        var promise = new Promise(function (resolve, reject) {
            console.log(url, qs);
            request({ url: url, qs: qs }, function (err, res, body) {
                //console.log(body);
                if (err) { reject(new Error(err)); }
                else {
                    try { body = JSON.parse(body); }
                    catch (e) { return reject(new Error('Failed to convert JSON')); }
                    
                    if (body.status === 'ERROR') { reject(new Error(body.message)); }
                    else { resolve(body); }
                }
            });
        });
        promise.apiRequest = this.apiRequest.bind(this);
        return promise;
    };
    
    return new Client();
}
