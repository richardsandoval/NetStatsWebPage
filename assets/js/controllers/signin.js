'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$state', '$sessionStorage', 'signService', function ($scope, $state, $sessionStorage, signService) {

    if ($sessionStorage.data) {
        $state.go('app.dashboard-v1');
    } else {
        $state.go('access.signin');
    }

    $scope.user = {};
    $scope.authError = null;

    $scope.login = function () {
        var auth = {
            username: $scope.user.email,
            password: $scope.user.password
        };

        signService.signIn(auth)
            .then(function (response) {
                $sessionStorage.data = response.data;
                $sessionStorage.token = response.data['token'];
                $state.go('app.dashboard-v2');
            })
            .catch(function (err) {
                console.log(err);
                $scope.authError = err.message;
            });

    };
}]);
