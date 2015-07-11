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
//            retreiveToken: retreiveToken,
            submiEdit:submiEdit,
            submitNewTrip: submitNewTrip,
            deleteTrip: deleteTrip
        };

        return service;

        function getAllTrips() {
            return $http.get(geokeyData.url+'api/projects/1/data-groupings/all-contributions/');
        }

        function getIndividualTrip(id) {
            return $http.get(geokeyData.url+'/api/projects/1/data-groupings/all-contributions/contributions/' + id + '/');
        }
        
        function submitNewTrip(geoJson) {
            return $http.post(geokeyData.url + '/api/projects/1/contributions/', geoJson);  
        }
        
        function deleteTrip(id){
            return $http.delete(geokeyData.url + 'api/projects/1/data-groupings/all-contributions/contributions/'+id+'/');  
            //http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/46/
            alert('the Trip id is '+ id);
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
        
        function submiEdit(editedData, id){
//            
//            
//            
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
                url: geokeyData.url+"/api/projects/1/data-groupings/all-contributions/contributions/" + id + "/",
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