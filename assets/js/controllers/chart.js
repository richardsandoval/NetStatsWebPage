'use strict';

/* Controllers */


app.controller('FlotChartDemoCtrl', ['$scope', '$http', '$sessionStorage', 'homeService', function ($scope, $http, $sessionStorage, homeService) {


        $scope.byFilters = [
            'minutes', 'hours', 'days'
        ];

        $scope.d0_1 = [[1, 6.5], [2, 6.5], [3, 7], [4, 8], [5, 7.5], [6, 7], [7, 6.8], [8, 7], [9, 7.2], [10, 7], [11, 6.8], [12, 7]];
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


        $scope.refreshData = function (which, start, ends) {

			//homeService.bw($sessionStorage, start, ends, which)
			//    .then(function (data) {
			//        $scope.data = [[]];
			//        $scope.labels = [];
			//        console.log(data);
			//        //$scope.data.push(data.dataUse);
			//        //$scope.labels = data.time;
			//    })
			//    .catch(function (err) {
			//        console.log(err);
			//    });

			var k = 0;
			result = [];
			//console.log('criteria: ' + which + ' start: ' + start + ' ends: ' + ends);
			$http.get(app.api + '/analysis/bw?uname=' + $sessionStorage.data.user + '&start=' + start + '&ends=' + ends + '&criteria=' + which, {
				headers: {
					Bearer: $sessionStorage.data.token,
					uname: $sessionStorage.data.user
				}
			}).then(function (res) {
				var labels = [];
				var datas = [];
				$scope.data = [[]];
				var time = new Date(res.data.bw[res.data.bw.length - 1].time);
				$scope.sizePacket = res.data.bw.length;
				res.data.bw.forEach(function (data) {
					//var arr = new Array(2);
					//arr[1] = data.dataUse;
					//arr[0] = k++;
					time = new Date(data.time);
					labels.push(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
					datas.push(data.dataUse);

					//result.push(arr);
				});
				//console.log(result);
				$scope.data.push(sampling(datas));
				$scope.time.ago.setDate(time.getDate());
				$scope.labels = (sampling(labels));
				//$scope.label = result[0];
				//$scope.data = result[1];
				//$scope.bw = result;
			}, function (err) {
				console.log(err);
				//$scope.bw = $scope.d0_1;
			});

//=======
//            homeService.bw($sessionStorage, start, ends, which)
//                .then(function (data) {
//                    $scope.data = [[]];
//                    $scope.labels = [];
//                    console.log(data);
//                    $scope.data.push(data.dataUse);
//                    $scope.labels = data.time;
//                })
//                .catch(function (err) {
//                    console.log(err);
//                });
//>>>>>>> 96559174277b08d27e5263332e5e513e77b06cd2
//        };
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
        $scope.pieData = [];
        $scope.pieLabel = [];
        $scope.labels = [];
        $scope.series = ['Bw/t'];
        $scope.data = [[]];
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
    }]);
