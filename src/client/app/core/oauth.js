(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('oauth', oauth);

    oauth.$inject = ['$http', 'myLocalStorage'];

    /* @ngInject */
    function oauth($http, myLocalStorage) {

        var retreiveToken = function (username, password) {
            return $http({
                url: 'http://178.62.58.84:8000/oauth2/token/',
                method: 'post',
                data: $.param({
                    //uses jQuery param to serialize data
                    client_id: '28pYvreSFxlDMgSLLFv9u8eWyn3dDZuOxSgLKeoo',
                    client_secret: 'rLtFPPpqHskrrPmy1viEYP1vCGFJu443Buf4XJi9',
                    username: username,
                    password: password,
                    grant_type: 'password'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).success(function (response) {
                myLocalStorage.setProfile(username, response.access_token);
                return 'success';
            }).error(function (e) {
                return 'error ' + e.error_description;
            });

        };

        return {
            retreiveToken: retreiveToken
        };
    }

})();