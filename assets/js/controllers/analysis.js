/**
 * Created by rsandoval on 10/04/16.
 */

app.controller('AnalysisController', ['$scope', '$http', '$sessionStorage', 'homeService', '$timeout', '$interval',$filter, function ($scope, $http, $sessionStorage, homeService, $timeout, $interval, $filter) {

    $scope.startDate = new Date().toISOString().slice(0, 10);
    $scope.endDate = new Date().toISOString().slice(0, 10);

    console.log($scope.startDate);
}]);
