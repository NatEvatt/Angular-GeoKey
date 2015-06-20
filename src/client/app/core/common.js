(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('common', common);

    common.$inject = ['$rootScope', 'messaging'];

    /* @ngInject */
    function common($rootScope, messaging) {
        var throttles = {};

        var service = {
            // common angular dependencies
            /*$broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            // generic
            createSearchThrottle: createSearchThrottle,
            debouncedThrottle: debouncedThrottle,
            isNumber: isNumber,
            logger: logger, // for accessibility
            replaceLocationUrlGuidWithId: replaceLocationUrlGuidWithId,
            textContains: textContains
            */
            messaging: messaging // for accessibility
        };

        return service;
    }

})();