(function (module) {
    'use strict';

    angular
        .module('app.core')
        .factory('loginRedirect', loginRedirect);
    loginRedirect.$inject = ['$q'];

    /* @ngInject */
    function loginRedirect($q) {

        var responseError = function (response) {
            if (response.status == 401 || response.status == 403) {
//                alert('Your Session has timed out, please login before continuing');
//                userLogin();
//                
//                function userLogin(fail) {
//                    common.messaging.showLoginMessage(messageTemplate + 'login.html', fail)
//                        .then(function (response) {
//                            oauth.retreiveToken(response.userEmail, response.userPassword)
//                                .then(function (response) {
//                                    var theResponse = response;
//                                    var type = 'success';
//                                    var message = 'You have successfully logged in!';
//                                    if (response.data.access_token) {
//                                        common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', message, type);
//                                        $scope.showLoggedInButtons();
//                                        $window.sessionStorage.token = response.data.access_token;
//                                    }
//                                }, function (response) {
//                                    userLogin(true);
//                                });
//                        });
//                }
            }
            return $q.reject(response);
        };

        return {
            responseError: responseError
        };
    }

})();