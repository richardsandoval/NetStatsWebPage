/**
 * Created by risandoval on 10/12/2015.
 */

app.factory('signService', function ($http, $q) {

    return {
        signIn: signIn
    };

    function signIn(auth) {
        var defered = $q.defer();
        var promise = defered.promise;

        var err = {};
        $http.post('/api/v1/auth/signin', auth)
            .then(function (res) {
                if (res) {
                    defered.resolve(res.data);
                } else {
                    err.message = 'Email or Password not right';
                    defered.reject(err);
                }
            }, function () {
                err.message = 'Server Error';
                defered.reject(err);
            });

        return promise;
    }

});
