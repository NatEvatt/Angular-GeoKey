(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('geokeyData', geokeyData);


    /* @ngInject */
    function geokeyData() {

        var params = {
            client_id: 'xxxxxxxxxxxxxxxxx',
            client_secret: 'xxxxxxxxxxxxxxxxxx',
            grant_type: 'password'
        };
        var url = 'http://xxxxxxxxxxx:8000/';
        var projectId = x;
        var categoryId = x

        return {
            params: params,
            url: url,
            projectId: projectId,
            categoryId: categoryId
        };
    }

})();
