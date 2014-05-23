'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Domain(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
        this.id = obj.id || this.id;
        this.name = obj.name || this.name;
        this.ttl = obj.ttl || this.ttl;
        this.liveZoneFile = obj.live_zone_file || this.liveZoneFile;
        this.error = obj.error || this.error;
        this.zoneFileWithError = obj.zone_file_with_error || this.zoneFileWithError;
        this.records = obj.records || this.records;
    }
    util.inherits(Domain, parent);
    
    parent.prototype.getDomains = function (filter) {
        return this.apiRequest('domains')
        .bind(this)
        .then(function (res) {
            var domains = res.domains.map(function (d) { return new Domain(d); });
            if (typeof filter === 'function') { domains = domains.filter(filter); }
            return domains;
        });
    };
    Domain.prototype.fetchRecords = function () {
        return this.apiRequest('domains/?/records')
        .bind(this)
        .then(function (res) {
            Domain.call(this, { records: res.records });
            return this;
        });
    };
    Domain.prototype.editDnsRecord = function (id, args) {
        return this.apiRequest('domains/?/records/' + id + '/edit', {
            name: args.name,
            record_type: args.recordType,
            data: args.data
        })
        .bind(this)
    };
    Domain.prototype.addDnsRecord = function (args) {
        return this.apiRequest('domains/?/records/new', {
            name: args.name,
            record_type: args.recordType,
            data: args.data
        })
        .bind(this)
    };

    return Domain;
};
