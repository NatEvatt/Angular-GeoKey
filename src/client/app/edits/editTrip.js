(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditTrip', EditTrip);

    EditTrip.$inject = ['$scope', '$http', '$window', 'common', 'dataFactory', '$location', '$stateParams', '$state', 'oauth'];

    function EditTrip($scope, $http, $window, common, dataFactory, $location, $stateParams, $state, oauth) {

        var messageTemplate = 'app/core/messaging/templates/';
        $scope.tripId = $stateParams.tripId;

        $scope.submitEditTrip = function () {
            var id = $stateParams.tripId;
            var submitData = {
                "properties": $scope.theForm
            }
            dataFactory.submitEdit(submitData, id).success(function (data) {
                //successIndividualTrip(data);
                var theMessage = "Your Edits have been added successfully";
                common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', theMessage);
            }).error(function (e) {
                if (e.error == "You are not allowed to update thecontribution") {
                    $scope.userLogin();
                }
                console.log('there was an error ' + e.error);
            })
        }

        $scope.loadEditTrip = function () {
            dataFactory.getIndividualTrip($scope.tripId).success(function (data) {
                $scope.fields = data.meta.category.fields;
                $scope.theForm = data.properties;
            });
        }

        $scope.userLogin = function (fail) {
            common.messaging.showLoginMessage(messageTemplate + "login.html", fail)
                .then(function (response) {
                    oauth.retreiveToken(response.userEmail, response.userPassword)
                        .then(function (response) {
                            common.messaging.showSimpleMessage(messageTemplate + "simpleMessage.html", "You have logged in, try submitting your records again", "Success");
                        }, function (response) {
                            userLogin(true);
                        });
                });
        }

        $scope.confirmDeleteTrip = function (id) {
            common.messaging.showDeleteWarning(messageTemplate + "deleteWarning.html", id)
                .then(function (response) {
                    if (response) {
                        dataFactory.deleteTrip(response.id)
                            .then(function (response) {
                                var theResponse = response;
                                var type = 'success';
                                var message = 'You have successfully Deleted your trip';
                                common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', message, type);
                                $state.go('main');
                            }, function (response) {
                                console.log('there was an error');
                            });
                    } else {
                        console.log('there was an error');
                    }
                });
        }

        angular.element(document).ready(function () {
            $scope.loadEditTrip();
        });

    };

}());