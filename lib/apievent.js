'use strict';

var Promise = require('bluebird');

module.exports = ApiEvent;

function ApiEvent(evt, apiRequest) {
    if (typeof apiRequest !== 'function') {
        return Promise.reject('ApiEvent: Must supply a request function');
    }
    if (typeof evt.event_id !== 'number') {
        return Promise.reject('ApiEvent: Server response didn\'t provide an event id');
    }

    var dly = this.apiPollRate || 7500,
        deferred = Promise.defer();
    
    var req = function () { return apiRequest('events/' + evt.event_id + '/'); };
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
}
