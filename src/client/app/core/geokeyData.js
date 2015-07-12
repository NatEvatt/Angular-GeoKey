(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('geokeyData', geokeyData);

    //currentUser.$inject = [];

    /* @ngInject */
    function geokeyData() {

        var params = {
            client_id: '28pYvreSFxlDMgSLLFv9u8eWyn3dDZuOxSgLKeoo',
            client_secret: 'rLtFPPpqHskrrPmy1viEYP1vCGFJu443Buf4XJi9',
            grant_type: 'password'
        };
        var url = 'http://178.62.58.84:8000/';
        var projectId = 4;
        var categoryId = 7

        return {
            params: params,
            url: url,
            projectId: projectId,
            categoryId: categoryId
        };
    }

})();