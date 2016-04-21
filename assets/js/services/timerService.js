/**
 * Created by rsandoval on 03/04/16.
 */

app.factory('timerService', function ($scope, $timeout) {
    return {
        refresh: function () {
            $scope.data = [];
            $scope.label = [];
            $http.get('/api/v1/sniffer/bw/' + $scope.criteria, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + $sessionStorage.token
                }
            }).then(function (res) {
                return response.data;
            }, function (err) {
                console.error(err);
            })
        }
    }
});
