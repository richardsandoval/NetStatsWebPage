/**
 * Created by rsandoval on 10/04/16.
 */

app.controller('AnalysisController', ['$scope', '$http', '$sessionStorage', 'homeService', '$timeout', '$interval', $filter, function ($scope, $http, $sessionStorage, homeService, $timeout, $interval, $filter) {

    $scope.smac = '';
    $scope.dmac = '';
    $scope.sourceIp = '';
    $scope.destIP = '';
    $scope.sourcePost = '';
    $scope.destPort = '';
    $scope.startDate = new Date();
    $scope.endDate = new Date();

    $scope.submit = function () {

        var ret = {
            smac: $scope.smac,
            dmac: $scope.dmac,
            sourceIp: $scope.sourceIp,
            destIP: $scope.destIP,
            sourcePost: $scope.sourcePost,
            destPort: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        };

        console.log(ret);
    };
}]);
