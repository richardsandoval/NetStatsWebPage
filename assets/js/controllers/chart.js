'use strict';

/* Controllers */


app.controller('FlotChartDemoCtrl', ['$scope', '$http', '$sessionStorage', 'homeService', '$timeout', '$interval', function ($scope, $http, $sessionStorage, homeService, $timeout, $interval) {


    $scope.lineOpts = {};


    $scope.byFilters = [
        'minutes', 'hours', 'days'
    ];

    $scope.d0_1 = [
        [
            1457292879790,
            120.80685424804688
        ],
        [
            1457289281811,
            17.616049766540527
        ],
        [
            1457285683419,
            3.1299524307250977
        ],
        [
            1457282085185,
            0
        ],
        [
            1457278486927,
            0
        ]
    ];
    var result = [];
    $scope.d0_2 = [0, 4], [1, 4.5], [2, 7], [3, 4.5], [4, 3], [5, 3.5], [6, 6], [7, 3], [8, 4], [9, 3];

    $scope.prevDate = moment().format('YYYY/MM/DD');
    $scope.nextDate = moment().add(1, 'days').format('YYYY/MM/DD');

    //$scope.bw =

    //$scope.d0_2 = [0, 4], [1, 4.5], [2, 7], [3, 4.5], [4, 3], [5, 3.5], [6, 6], [7, 3], [8, 4], [9, 3];

    $scope.d1_1 = [[10, 120], [20, 70], [30, 70], [40, 60]];

    $scope.d1_2 = [[10, 50], [20, 60], [30, 90], [40, 35]];

    $scope.d1_3 = [[10, 80], [20, 40], [30, 30], [40, 20]];
    $scope.sizePacket = 0;
    $scope.d2 = [];
    $scope.time = {
        ago: new Date()
    };

    $scope.data = [300, 500, 100];
    //$scope.ago = new Date('2015/06/15');

    for (var i = 0; i < 20; ++i) {
        $scope.d2.push([i, Math.round(Math.sin(i) * 100) / 100]);
    }

    $scope.d3 = [
        {label: "iPhone5S", data: 40},
        {label: "iPad Mini", data: 10},
        {label: "iPad Mini Retina", data: 20},
        {label: "iPhone4S", data: 12},
        {label: "iPad Air", data: 18}
    ];

    $scope.topSrc = function () {
        $http.get('/api/analysis/rank?uname=' + $sessionStorage.data.user + '&start=' + (new Date() - 1) + '&ends=' + (new Date() + 1 ) + '&criteria=sIP', {
            headers: {
                Bearer: $sessionStorage.data.token,
                uname: $sessionStorage.data.user
            }
        }).then(function (res) {
            $scope.topDestData = [[]];
            $scope.topDestLabels = [];

            var topD = res.data;
            var labels = [];
            var datas = [];
            if (topD.length > 5) {
                for (var i = 0; i < 5; i++) {
                    var data = topD[i];
                    datas.push(data.count);
                    labels.push(data.criteria);
                }
            } else {
                topD.forEach(function (data) {
                    datas.push(data.count);
                    labels.push(data.criteria);
                });
            }
            $scope.topSrcData = datas;
            $scope.topSrcLabels = labels;
        }, function (err) {

        });
    };

    $scope.label = [];
    $scope.data = [[]];
    $scope.criteria = 'second';
    $scope.avg = 0;
    $scope.total = 0;
    $scope.time = 0;
    $scope.actualbw = 0;

    $scope.refreshData = function (criteria) {
        $scope.criteria = criteria;
        $scope.data = [];
        $scope.label = [];


        $http.get('/api/v1/sniffer/bw/' + $scope.criteria, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;

            $scope.data.push(object.data);
            $scope.label = (object.labels);

        }, function (err) {
            console.error(err);
        });

        $http.get('/api/v1/sniffer/avg', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.avg = object.avg;
            $scope.total = object.sum;
        }, function (err) {
            console.error(err);
        });

        $http.get('/api/v1/sniffer/maxtime', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            // $scope.time = new Date(object.max);
        }, function (err) {
            console.error(err);
        });

        $http.get('/api/v1/sniffer/actualbw', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;

            $scope.actualbw = object.totalbw;
        }, function (err) {
            console.error(err);
        });

    };

    $scope.checkbox = true;
    $scope.id = 0;
    $scope.onInit = function () {
        $http.get('/api/v1/user?username=' + $sessionStorage.data.user, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body[0];
            $scope.checkbox = object.status;
            $scope.id = object.id;
        }, function (err) {
            console.error(err);
        });
    };

    $scope.lastId = 0;
    $scope.onChange = function () {
        console.log('change');
        $http.put('/api/v1/user/' + $scope.id,
            {
                status: $scope.checkbox
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + $sessionStorage.token
                }
            }
        ).then(function (res) {

        }, function (err) {
            console.error(err);
        });
        if ($scope.checkbox)
            $http.post('/api/v1/data', {
                    user: $sessionStorage.data.user,
                    startDate: (new Date()).getMilliseconds()
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'JWT ' + $sessionStorage.token
                    }
                }
            ).then((res) => {
                $scope.lastId = res.data['data'].id;
                console.log($scope.lastId);
            }, (err) => {
                console.error(err);
            });
        else
            $http.put('/api/v1/data/' + $scope.lastId,
                {
                    endDate: (new Date()).getMilliseconds()
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'JWT ' + $sessionStorage.token
                    }
                }
            ).then((res)=> {

            }, (err) => {
                console.error(err);
            });


    };

//     $scope.refreshData = function (which, start, ends) {
//
//         //homeService.bw($sessionStorage, start, ends, which)
//         //    .then(function (data) {
//         //        $scope.data = [[]];
//         //        $scope.labels = [];
//         //        console.log(data);
//         //        //$scope.data.push(data.dataUse);
//         //        //$scope.labels = data.time;
//         //    })
//         //    .catch(function (err) {
//         //        console.log(err);
//         //    });
//
//         var k = 0;
//         result = [];
//         //console.log('criteria: ' + which + ' start: ' + start + ' ends: ' + ends);
//         $http.get(app.api + '/analysis/bw?uname=' + $sessionStorage.data.user + '&start=' + start + '&ends=' + ends + '&criteria=' + which, {
//             headers: {
//                 Bearer: $sessionStorage.data.token,
//                 uname: $sessionStorage.data.user
//             }
//         }).then(function (res) {
//             var labels = [];
//             var datas = [];
//             $scope.data = [[]];
//             var time = new Date(res.data.bw[res.data.bw.length - 1].time);
//             $scope.sizePacket = res.data.bw.length;
//             res.data.bw.forEach(function (data) {
//                 //var arr = new Array(2);
//                 //arr[1] = data.dataUse;
//                 //arr[0] = k++;
//                 time = new Date(data.time);
//                 labels.push(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
//                 datas.push(data.dataUse);
//
//                 //result.push(arr);
//             });
//             //console.log(result);
//             $scope.data.push(sampling(datas));
//             $scope.time.ago.setDate(time.getDate());
//             $scope.labels = (sampling(labels));
//             //$scope.label = result[0];
//             //$scope.data = result[1];
//             //$scope.bw = result;
//         }, function (err) {
//             console.log(err);
//             //$scope.bw = $scope.d0_1;
//         });
//
// //=======
// //            homeService.bw($sessionStorage, start, ends, which)
// //                .then(function (data) {
// //                    $scope.data = [[]];
// //                    $scope.labels = [];
// //                    console.log(data);
// //                    $scope.data.push(data.dataUse);
// //                    $scope.labels = data.time;
// //                })
// //                .catch(function (err) {
// //                    console.log(err);
// //                });
// //>>>>>>> 96559174277b08d27e5263332e5e513e77b06cd2
// //        };
//     };

    $scope.hostData = [];
    $scope.hostLabel = [];
    $scope.convData = [];
    $scope.convLabel = [];
    $scope.protData = [];
    $scope.protLabel = [];

    $scope.topHost = function () {
        $http.get('/api/v1/sniffer/toppages', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.hostData = object.data;
            $scope.hostLabel = object.labels;
        }, function (err) {
            console.error(err);
        })
    };

    $scope.topConv = function () {
        $http.get('/api/v1/sniffer/topconv', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.convData = object.data;
            $scope.convLabel = object.labels;
        }, function (err) {
            console.error(err);
        })
    };

    $scope.topProt = function () {
        $http.get('/api/v1/sniffer/topprot', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + $sessionStorage.token
            }
        }).then(function (res) {
            var object = res.data['data'].body;
            $scope.protData.push(object.data);
            $scope.protLabel = object.labels;
        }, function (err) {
            console.error(err);
        })
    };

    $scope.topFive = function () {
        $http.get('/api/analysis/rank?uname=' + $sessionStorage.data.user + '&start=' + (new Date() - 1) + '&ends=' + (new Date() + 1 ) + '&criteria=protocol', {
            headers: {
                Bearer: $sessionStorage.data.token,
                uname: $sessionStorage.data.user
            }
        }).then(function (res) {
            $scope.pieData = [];
            $scope.pieLabel = [];
            var p = [], d = [];
            var pieD = res.data.filter(function (f) {
                return f.criteria < 1024;
            });

            pieD.forEach(function (data) {
                d.push(data.count);
                p.push(data.criteria);
                console.log(data.criteria);
            });
            $scope.pieData = d;
            $scope.pieLabel = p;

            console.log(pieD);
        }, function (err) {
            console.error(err);
        });
    };

    $scope.topDest = function () {
        $http.get('/api/analysis/rank?uname=' + $sessionStorage.data.user + '&start=' + (new Date() - 1) + '&ends=' + (new Date() + 1 ) + '&criteria=dIP', {
            headers: {
                Bearer: $sessionStorage.data.token,
                uname: $sessionStorage.data.user
            }
        }).then(function (res) {
            $scope.topDestData = [[]];
            $scope.topDestLabels = [];

            var topD = res.data;
            var labels = [];
            var datas = [];
            if (topD.length > 5) {
                for (var i = 0; i < 5; i++) {
                    var data = topD[i];
                    datas.push(data.count);
                    labels.push(data.criteria);
                }
            } else {
                topD.forEach(function (data) {
                    datas.push(data.count);
                    labels.push(data.criteria);
                });
            }
            $scope.topDestData = datas;
            $scope.topDestLabels = labels;
        }, function (err) {
            console.log(err);
        });
    };

    var sampling = function (array) {
        if (array <= 50)
            return array;
        else {
            var n = array.length;
            var steps = Math.ceil(n / 50);
            var max = Math.floor(n / steps);
            var arr = [];
            for (var i = 0; i < max; i++) {
                arr.push(array[i * steps]);
            }
            return arr;
        }
    };

    $scope.topDestData = [[]];
    $scope.topDestLabels = [];
    $scope.pieData = [10000, 20000, 29323, 12933];
    $scope.pieLabel = ['facebook.com', 'google.com', 'instagram.com', 'netstatspucmm.com'];
    // $scope.labels = [];
    $scope.series = ['Bw/t'];
    // $scope.data = [[]];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    var refresh = function (res) {
        $scope.bw = function () {
            return res;
        }
    };

    $scope.getRandomData = function () {
        var data = [],
            totalPoints = 150;
        if (data.length > 0)
            data = data.slice(1);
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(Math.round(y * 100) / 100);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        return res;
    };

    $scope.d4 = $scope.getRandomData();

    $interval(function () {
        $scope.refreshData($scope.criteria)
    }, 2000);

    $scope.callAtTimeout = function () {
        console.log("$scope.callAtTimeout - Timeout occurred");
    };

    $timeout(function () {
        $scope.lineOpts.animation = false;
    }, 800);

}]);
