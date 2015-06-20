(function () {
    'use strict';

    var app = angular.module('app', [
        /* Angular */

        /* Third Party*/
        'uiGmapgoogle-maps',
        'ui.router',

        /* Mine */
        'app.core'
        ]);

    app.config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, $httpProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });

        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'main.html',
                controller: 'MapController',
                data: {
                    requireLogin: false
                }
            })
            .state('editsShell', {
                url: '/edits',
                templateUrl: 'app/edits/editsShell.html',
                controller: 'EditsShell'
            })
                .state('createTrip', {
                    url: '/createTrip',
                    parent: 'editsShell',
                    templateUrl: 'app/edits/create-trip.html',
                    controller: 'CreateTrip',
                    data: {
                        requireLogin: true
                    }
                })
                .state('editTrip', {
                    url: '/editTrip/:tripId',
                    parent: 'editsShell',
                    templateUrl: 'app/edits/edit-trip.html',
                    controller: 'EditTrip',
                    data: {
                        requireLogin: true
                    }
                });

        $urlRouterProvider.otherwise('main');

        $httpProvider.interceptors.push('addToken', 'loginRedirect');
    });

    app.run(function ($rootScope, currentUser, common, oauth, $state) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;

            if (requireLogin && currentUser.profile.token === '') {
                userLogin();
            }

            function userLogin() {
                event.preventDefault();
                common.messaging.showLoginMessage('app/core/messaging/templates/login.html')
                    .then(function (response) {
                        oauth.retreiveToken(response.userEmail, response.userPassword)
                            .then(function (response) {
                                return $state.go(toState.name, toParams);
                            }, function (response) {
                                userLogin(true);
                            });
                    });
            }
        });
    })
})();