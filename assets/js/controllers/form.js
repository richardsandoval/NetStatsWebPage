'use strict';

/* Controllers */

// Form controller
app.controller('FormDemoCtrl', ['$scope', '$http', '$sessionStorage', 'homeService', '$timeout', '$interval', function ($scope, $http, $sessionStorage, homeService, $timeout, $interval) {
    $scope.smac = '';
    $scope.dmac = '';
    $scope.sourceIp = '';
    $scope.destIP = '';
    $scope.sourcePost = '';
    $scope.destPort = '';
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.totalbw = 0;
    $scope.topips = [];
    $scope.topipsreps = [];
    $scope.tophosts = [];
    $scope.topservice = [];
    $scope.por = 0.0;

    $scope.submit = function () {

        var ret = {
            sip: $scope.sourceIp,
            dip: $scope.destIP,
            stcp: $scope.sPort,
            dtcp: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        };

        ret = remove_empty(ret);

        $http.post('/api/v1/sniffer/analysisBw', ret, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            if (object.totalbw != null || object.totalbw === 'undefined')
                $scope.totalbw = object.totalbw;
            else
                $scope.totalbw = 0;
            // $scope.data.push(object.data);
            // $scope.label = (object.labels);

        }, function (err) {
            console.error(err);
        });

        $http.post('/api/v1/sniffer/topipdest', ret, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.topips = [];
            object.forEach(function (ips) {
                $scope.topips.push(ips);
            });
            // $scope.data.push(object.data);
            // $scope.label = (object.labels);

        }, function (err) {
            console.error(err);
        });


        $http.post('/api/v1/sniffer/topiprep', ret, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.topipsreps = [];
            object.forEach(function (ips) {
                $scope.topipsreps.push(ips);
            });
            // $scope.data.push(object.data);
            // $scope.label = (object.labels);

        }, function (err) {
            console.error(err);
        });

        $http.post('/api/v1/sniffer/tophost', ret, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.tophosts = [];
            object.forEach(function (ips) {
                $scope.tophosts.push(ips);
            });
            // $scope.data.push(object.data);
            // $scope.label = (object.labels);

        }, function (err) {
            console.error(err);
        });

        $http.post('/api/v1/sniffer/topservice', ret, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.topservice = [];
            object.forEach(function (ips) {
                $scope.topservice.push(ips);
            });
            // $scope.data.push(object.data);
            // $scope.label = (object.labels);

        }, function (err) {
            console.error(err);
        });

        $http.post('/api/v1/sniffer/bwconsumed', ret, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.por = object.total ;
            // object.forEach(function (ips) {
            //     $scope.topservice.push(ips);
            // });
            // $scope.data.push(object.data);
            // $scope.label = (object.labels);

        }, function (err) {
            console.error(err);
        });
    };


    var remove_empty = function (target) {

        Object.keys(target).map(function (key) {

            if (target[key] instanceof Object) {

                if (!Object.keys(target[key]).length && typeof target[key].getMonth !== 'function') {
                    delete target[key];
                }
                else {
                    remove_empty(target[key]);
                }
            }

            else if (target[key] === null || target[key] === 'undefined') {

                delete target[key];

            } else if (target[key] === '') {
                delete target[key];
            }

        });

        return target;

    };
}]);
