'use strict';

module.exports = function (parent, Promise) {
    parent.prototype.ApiEvent = Promise.method(function (evtId) {
        if (typeof evtId !== 'number') {
            throw new Error('Invalid event id');
        }

        var self = this,
            dly = self.apiPollRate || 7500,
            deferred = Promise.defer();
        
        var req = function () { return self.apiRequest('events/' + evtId + '/'); };
        var poll = function () {
            return Promise
            .delay(dly)
            .then(req)
            .then(function (res) {
                deferred.progress(res.event.percentage || 0);
                if (res.event.action_status === 'done') {
                    deferred.resolve(res);
                } else {
                    return poll();
                }
            })
            .catch(function (err) {
                deferred.reject(err);
            })
        };
        poll();
        
        return deferred.promise;
    });
};