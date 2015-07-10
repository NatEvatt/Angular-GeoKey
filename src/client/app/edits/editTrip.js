(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditTrip', EditTrip);

    EditTrip.$inject = ['$scope', '$http', '$window', 'common', 'dataFactory', '$location', '$stateParams', '$state', 'oauth'];

    function EditTrip($scope, $http, $window, common, dataFactory, $location, $stateParams, $state, oauth) {

        var messageTemplate = 'app/core/messaging/templates/';
        $scope.tripId = $stateParams.tripId;
        $scope.theForm = {};

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
                    var theMessage = "You do not have permission to edit this trip";
                    $scope.userLogin();
                    //                    common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', theMessage); 
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
            //})
        }

        $scope.retrieveAccessToken = function () {

            var url = "http://178.62.58.84:8000/oauth2/access_token";
            var jsonArray = {
                client_id: "355a7b6c308e1880e7a2",
                client_secret: "338d00867b2db3a0ec06554cbbd20cff8c9ed5a2",
                username: "natevatt@gmail.com",
                password: "punkface",
                grant_type: "password"
            };

            $.ajax({
                url: url,
                type: 'POST',
                data: jsonArray,
                success: function (data) {
                    console.log('I am in the success');
                    $window.sessionStorage.token = data.access_token;
                },
                error: function (e) {
                    console.log('there was an error ' + e.message);
                    //console.log(e.message);
                }
            });

        };

        $scope.confirmDeleteTrip = function () {

            BootstrapDialog.show({
                title: 'WARNING',
                message: 'Are you sure that you would like to delete this trip? Once deleted, it is gone forever...',
                closable: false,
                buttons: [{
                    label: "No, Keep It",
                    cssClass: 'btn-blueBorder',
                    action: function (dialogItself) {
                        dialogItself.close();
                    }
                }, {
                    label: 'YES, Delete It',
                    cssClass: 'btn-orange',
                    action: function (dialogItself) {
                        $scope.deleteTrip();
                        dialogItself.close();
                    }
                }]
            });
        }

        $scope.deleteTrip = function () {

            var id = $window.sessionStorage.id
            var token = $window.sessionStorage.token;


            var req = {
                method: 'DELETE',
                url: "http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/" + id + "/",
                headers: {
                    'Content-Type': "application/json",
                    Authorization: "Bearer " + token
                },
                data: ""
            }

            $http(req).success(function () {
                BootstrapDialog.show({
                    title: 'Success',
                    message: 'Your trip has been deleted',
                    closable: false,
                    buttons: [{
                        label: "Return to the Map",
                        cssClass: 'btn-orange',
                        action: function (dialogItself) {
                            $scope.returnToMap();
                            dialogItself.close();
                        }
                }]
                });
            }).error(function (e) {
                console.log('there was an error ' + e.message);
            });

        }

        $scope.returnToMap = function () {
            window.location.href = "index.html";
        }

        $scope.showDeleteLocationPopup = function (options, id) {
            if (options === true) {
                $scope.displayLocationDeletePopup = true;
            } else {
                $scope.displayLocationDeletePopup = false;
            }
            $scope.locationId = id;
        };

        $scope.editsLogin = function (username, password) {
            alert(username, password);
        }

        angular.element(document).ready(function () {
            $scope.loadEditTrip();
        });

    };

}());