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
            var editedData = {
                'properties': {
                    "titledet": $("#titleDet").val(),
                    "rideimgdet": $("#rideImgDet").val(),
                    "tripdet": $("#tripDet").val(),
                    "datedet": $("#dateDet").val(),
                    "ridersdet": $("#ridersDet").val(),
                    "distancedet": $("#distanceDet").val(),
                    "durationdet": $("#durationDet").val(),
                    "mileperdet": $("#milePerDet").val(),
                    "ascentdet": $("#ascentDet").val(),
                    "descentdet": $("#descentDet").val(),
                    "startelevdet": $("#startElevDet").val(),
                    "finelevdet": $("#finElevDet").val(),
                    "latlng": $("#latlng").val(),
                    "zoom": $("#zoom").val(),
                    "minelevdet": $("#minElevDet").val(),
                    "maxelevdet": $("#maxElevDet").val(),
                    "picasalink": $("#picasaLink").val(),
                    "kmllayers": $("#kmlLayers").val()
                }
            }

            dataFactory.submiEdit(editedData, id).success(function (data) {
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
                //successIndividualTrip(data);
                console.log(data);
                $("#ridersDet").val(data.properties.ridersdet);
                $("#rideImgDet").val(data.properties.rideimgdet);
                $("#titleDet").val(data.properties.titledet);
                $("#tripDet").val(data.properties.tripdet);
                $("#dateDet").val(data.properties.datedet);
                $("#ridersDet").val(data.properties.ridersdet);
                $("#distanceDet").val(data.properties.distancedet);
                $("#durationDet").val(data.properties.durationdet);
                $("#milePerDet").val(data.properties.mileperdet);
                $("#ascentDet").val(data.properties.ascentdet);
                $("#descentDet").val(data.properties.descentdet);
                $("#startElevDet").val(data.properties.startelevdet);
                $("#finElevDet").val(data.properties.finelevdet);
                $("#latlng").val(data.properties.latlng);
                $("#zoom").val(data.properties.zoom);
                $("#minElevDet").val(data.properties.minelevdet);
                $("#maxElevDet").val(data.properties.maxelevdet);
                $("#picasaLink").val(data.properties.picasalink);
                $("#kmlLayers").val(data.properties.kmllayers);

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