(function (module) {
    'use strict';

    angular
        .module('app.core')
        .factory('addToken', addToken);
    addToken.$inject = ['myLocalStorage', '$q'];

    /* @ngInject */
    function addToken(myLocalStorage, $q) {

        var request = function (config) {
            if (myLocalStorage.profile.loggedIn) {
                config.headers.Authorization = 'Bearer ' + myLocalStorage.profile.token;
            }
            return $q.when(config);
        };

        return {
            request: request
        };
    }

})();
