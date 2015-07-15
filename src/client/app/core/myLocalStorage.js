(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('myLocalStorage', myLocalStorage);

    //currentUser.$inject = [];

    /* @ngInject */
    function myLocalStorage(store) {

        var USERKEY = 'utoken';
        var GEODATA = 'geojson';

        var setProfile = function (username, token) {
            profile.username = username;
            profile.token = token;
            store.set(USERKEY, profile);
        }

        var clearProfile = function () {
            profile.username = '';
            profile.token = '';
            store.remove(USERKEY);
        }

        var initialize = function () {
            var user = {
                username: '',
                token: '',
                get loggedIn() {
                    return this.token;
                }
            };

            var localUser = store.get(USERKEY);
            if (localUser) {
                user.username = localUser.username;
                user.token = localUser.token;
            }
            return user;
        }

        var profile = initialize();

        var setGeoJSON = function (geoJsonData) {
            var geoJsonStringified = JSON.stringify(geoJsonData);
            store.set(GEODATA, geoJsonData);
        }
        var clearGeoJSON = function () {
            store.remove(GEODATA);
        }

        var allGeoData = function () {
//            var localGeoData = JSON.parse(store.get(GEODATA) || '{}');
            var localGeoData = store.get(GEODATA);
            return localGeoData;
        }

        return {
            profile: profile,
            setProfile: setProfile,
            clearProfile: clearProfile,
            setGeoJSON: setGeoJSON,
            clearGeoJSON: clearGeoJSON,
            allGeoData: allGeoData
        };
    }

})();