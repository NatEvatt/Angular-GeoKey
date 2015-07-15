(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataFactory', dataFactory);

    dataFactory.$inject = ['$http', 'geokeyData'];

    function dataFactory($http, geokeyData) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getAllTrips: getAllTrips,
            getIndividualTrip: getIndividualTrip,
            submitEdit: submitEdit,
            submitNewTrip: submitNewTrip,
            deleteTrip: deleteTrip,
            returnFields: returnFields,
            registerNewUser: registerNewUser
        };

        return service;

        function getAllTrips() {
            return $http.get(geokeyData.url + 'api/projects/' + geokeyData.projectId + '/data-groupings/all-contributions/');
        }

        function getIndividualTrip(id) {
            return $http.get(geokeyData.url + '/api/projects/' + geokeyData.projectId + '/data-groupings/all-contributions/contributions/' + id + '/');
        }

        function submitNewTrip(geoJson) {
            return $http.post(geokeyData.url + '/api/projects/' + geokeyData.projectId + '/contributions/', geoJson);
        }

        function registerNewUser(json) {
            json.client_id = geokeyData.params.client_id;
            return $http.post(geokeyData.url + 'api/user/', json);
        }

        function deleteTrip(id) {
            return $http.delete(geokeyData.url + 'api/projects/' + geokeyData.projectId + '/data-groupings/all-contributions/contributions/' + id + '/');
        }

        function submitEdit(editedData, id) {

            return $http({
                url: geokeyData.url + '/api/projects/' + geokeyData.projectId + '/data-groupings/all-contributions/contributions/' + id + '/',
                method: 'PATCH',
                data: editedData
            }).success(function () {
                return 'success';
            }).error(function (e) {
                return 'error ' + e.error_description;
            });
        }

        function returnFields() {
            return $http.get(geokeyData.url + 'api/projects/' + geokeyData.projectId + '/categories/' + geokeyData.categoryId + '/');
        }

        //        function retreiveToken(username, password) {
        //
        //            return $http({
        //                url: geokeyData.url+'/oauth2/token/',
        //                method: 'post',
        //                data: $.param(
        ////                    //uses jQuery param to serialize data
        ////                    client_id: '28pYvreSFxlDMgSLLFv9u8eWyn3dDZuOxSgLKeoo',
        ////                    client_secret: 'rLtFPPpqHskrrPmy1viEYP1vCGFJu443Buf4XJi9',
        ////                    username: username,
        ////                    password: password,
        ////                    grant_type: 'password'
        //                    geokeyData.params
        //                ),
        //                headers: {
        //                    'Content-Type': 'application/x-www-form-urlencoded'
        //                },
        //            }).success(function () {
        //                return 'success';
        //            }).error(function (e) {
        //                return 'error ' + e.error_description;
        //            });
        //
        //        }

    }

})();