/**
 * Created by risandoval on 11/12/2015.
 */

app.factory('homeService', function ($http, $q) {

    var sampling = function (dArray) {
        var q = $q.defer();
        var SAMPLING = 30;
        var promise = q.promise;

        if (dArray.length < SAMPLING) {
            q.resolve(dArray);
        } else {
            var n = dArray.length;
            var steps = Math.ceil(n / SAMPLING);
            var max = Math.floor(n / steps);
            var callback = {
                dataUse: [],
                time: []
            };
            //for (var i = 0; i < max; i++) {
            //    callback.dataUse.push(dArray[i * steps].dataUse);
            //    callback.time.push(moment(dArray[i * steps].time).format('YYYY/MM/DD, h:mm:ss a'));
            //    for (var j = i * steps; j < steps * (i + 1); j++) {
            //        callback.dataUse[i] += dArray[j].dataUse;
            //    }
            //}
            for (var i = 0; i < max; i++) {
                callback.dataUse.push(dArray[i * steps].dataUse);
                callback.time.push(moment(dArray[i * steps].time).format('YYYY/MM/DD, h:mm:ss a'));
                for (var j = i * steps; j < steps * (i + 1); j++) {
                    callback.dataUse[i] += dArray[j].dataUse;
                }
            }
            q.resolve(callback);
        }
        return promise;
    };

    return {
        bw: bw
    };

    function bw(session, from, to, criteria) {

        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('/api/analysis/bw?uname=' + session.data.user +
            '&start=' + from + '&ends=' + to +
            '&criteria=' + criteria, {
            headers: {
                Bearer: session.data.token,
                uname: session.data.user
            }
        }).then(function (res) {
            sampling(res.data.bw)
                .then(function (data) {
                    defered.resolve(data);
                })
                .catch(function (err) {
                    defered.reject(err);
                });
        }, function (err) {
            defered.reject(err);
        });

        return promise;
    }


});