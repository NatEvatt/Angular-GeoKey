(function (module) {
    'use strict';

    angular
        .module('app.core')
        .factory('addToken', addToken);
    addToken.$inject = ['currentUser', '$q'];

    /* @ngInject */
    function addToken(currentUser, $q) {

        var request = function (config) {
            if (currentUser.profile.loggedIn) {
                config.headers.Authorization = 'Bearer ' + currentUser.profile.token;
            }
            return $q.when(config);
        };

        return {
            request: request
        };
    }

})();
