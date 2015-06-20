(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataFactory', dataFactory);

    dataFactory.$inject = ['$http'];

    function dataFactory($http) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getAllTrips: getAllTrips,
            getIndividualTrip: getIndividualTrip,
            retreiveToken: retreiveToken,
            submiEdit:submiEdit
        };

        return service;

        function getAllTrips() {
            return $http.get('http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/');
        }

        function getIndividualTrip(id) {
            return $http.get('http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/' + id + '/');
        }

        function retreiveToken(username, password) {

            return $http({
                url: 'http://178.62.58.84:8000/oauth2/token/',
                method: 'post',
                data: $.param({
                    //uses jQuery param to serialize data
                    client_id: '****************',
                    client_secret: '****************',
                    username: username,
                    password: password,
                    grant_type: 'password'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).success(function () {
                return 'success';
            }).error(function (e) {
                return 'error ' + e.error_description;
            });

        }
        
        function submiEdit(editedData, id){
//            
//            
//            var theUrl = "http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/" + id + "/";
//            
//            dataFactory.submiEdit(editedData);
//
//            var req = {
//                method: 'PATCH',
//                url: theUrl,
//                data: editedData
//            }

//            $http(req).success(function () {
//                return 'success';
//            }).error(function (e) {
//                return 'error ' + e.error_description;
//            });

            return $http({
                url: "http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/" + id + "/",
                method: 'PATCH',
                data: editedData
            }).success(function () {
                return 'success';
            }).error(function (e) {
                return 'error ' + e.error_description;
            });
        }

    }

})();