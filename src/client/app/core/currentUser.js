(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentUser', currentUser);

    //currentUser.$inject = [];

    /* @ngInject */
    function currentUser(store) {

        var USERKEY = 'utoken';

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
            if(localUser){
                user.username = localUser.username;
                user.token = localUser.token;
            }
            return user;
        }

        var profile = initialize();

        return {
            profile: profile,
            setProfile: setProfile,
            clearProfile:clearProfile
        };
    }

})();