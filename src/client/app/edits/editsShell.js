(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditsShell', EditsShell);

    EditsShell.$inject = ['$scope', '$state', 'currentUser'];

    function EditsShell($scope, $state, currentUser) {

        $scope.goHome = function() {
            $state.go('main');
        };

        $scope.logout = function() {
            currentUser.clearProfile();
            $state.go('main');
        };
    }

}());
