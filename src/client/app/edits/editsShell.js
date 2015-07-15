(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditsShell', EditsShell);

    EditsShell.$inject = ['$scope', '$state', 'myLocalStorage'];

    function EditsShell($scope, $state, myLocalStorage) {

        $scope.goHome = function() {
            $state.go('main');
        };

        $scope.logout = function() {
            myLocalStorage.clearProfile();
            $state.go('main');
        };
    }

}());
