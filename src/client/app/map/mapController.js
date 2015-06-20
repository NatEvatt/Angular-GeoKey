(function () {
    'use strict';

    angular
        .module('app')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', 'uiGmapGoogleMapApi', '$window', 'common', 'dataFactory', 'oauth', '$state', 'currentUser'];

    function MapController($scope, uiGmapGoogleMapApi, $window, common, dataFactory, oauth, $state, currentUser) { //uiGmapGoogleMapApi
        uiGmapGoogleMapApi.then(function (maps) {

            $scope.map = {
                center: {
                    latitude: 45,
                    longitude: -73
                },
                zoom: 4
            };
            $scope.show = true;
            $scope.icon = 'content/images/mapIcon50.png';

            $scope.markers = [];
            var messageTemplate = 'app/core/messaging/templates/';

            function createMarkers(response) {
                $scope.allTrips = response.features; //to pass to the ng-repeat in bikeIntro
                var theFeatures = response.features;
                var i = 0;
                var idKey = 'id';
                for (var trip in theFeatures) {
                    var ret = {
                        //                        latitude: theFeatures[trip].geometry.coordinates[1],
                        //                        longitude: theFeatures[trip].geometry.coordinates[0],
                        geometry: theFeatures[trip].geometry,
                        title: theFeatures[trip].display_field.value,
                        icon: 'content/images/mapIcon50.png'

                    };
                    ret[idKey] = i;
                    $scope.markers.push(ret);
                    i++;
                }
            }

            $scope.loadIndividualTrip = function (id) {
                $window.sessionStorage.id = id;
                //$scope.clearActiveLayers();

                dataFactory.getIndividualTrip(id).success(function (features) {
                    successIndividualTrip(features);
                });
            };



            $scope.clearActiveLayers = function () {
                for (var i = 0; i < activeKmlLayers.length; i++) {
                    activeKmlLayers[i].setMap(null);
                }

                activeKmlLayers = [];
            };

            function successIndividualTrip(data) {
                //called when successful
                $scope.tripId = data.id;
                $scope.rideImgDet = 'content/' + data.properties.attributes.rideimgdet;

                //$("#headerImgDet").html(data.properties.attributes.headerimgDet);
                $scope.titleDet = data.properties.attributes.titledet;
                $scope.ridersDet = data.properties.attributes.ridersdet;
                $scope.tripDet = data.properties.attributes.tripdet;
                $scope.dateDet = data.properties.attributes.datedet;
                $scope.distanceDet = data.properties.attributes.distancedet;
                $scope.durationDet = data.properties.attributes.durationdet;
                $scope.milePerDet = data.properties.attributes.mileperdet;
                $scope.ascentDet = data.properties.attributes.ascentdet;
                $scope.descentDet = data.properties.attributes.descentdet;
                $scope.startElevDet = data.properties.attributes.startelevdet;
                $scope.finElevDet = data.properties.attributes.finelevdet;
                $scope.minElevDet = data.properties.attributes.minelevdet;
                $scope.maxElevDet = data.properties.attributes.maxelevdet;

                if (data.properties.attributes.picasalink) {
                    //$("#picasaLink a").prop("href", data.properties.attributes.picasalink);
                    $('#photoLink').show();
                    $scope.photoLink = data.properties.attributes.picasalink;
                } else {
                    $('#photoLink').hide();
                }

                var kmlLayers = data.properties.attributes.kmllayers.split('|XX|');

                //                for (var i = 0; i < kmlLayers.length; i++) {
                //                    var kmlLayer = new google.maps.KmlLayer(kmlLayers[i]);
                //                    kmlLayer.setMap(map);
                //                    activeKmlLayers.push(kmlLayer);
                //                }


                checkDetailsVisibility();
                //$scope.hideKML();
            }

            $scope.onClick = function () {
                console.log('Clicking');
                $scope.windowoptions.visible = !$scope.windowoptions.visible;
            };

            $scope.mapButtonNav = function (type) {
                switch (type) {
                case 'addATrip':
                    $state.go('createTrip');
                    break;
                case 'login':
                    userLogin();
                    break;
                case 'logout':
                    $scope.logout();
                    break;
                }
            };

            $scope.windowoptions = {
                //pixelOffset: new google.maps.Size(-1, -250, 'px', 'px'),
                visible: false
            };

            $scope.logout = function () {
                //$window.sessionStorage.token;
                currentUser.clearProfile();
                $scope.showLoggedOutButtons();
                var message = "You are successfully logged out";
                var title = "Logged Out";
                common.messaging.showSimpleMessage(messageTemplate + "simpleMessage.html", message, title);
            }

            $scope.toggleMapNav = function () {
                if ($('#floatingDiv').css('right') === '0px' && !$(this).is(':animated')) {
                    $('#floatingDiv').animate({
                        'right': '-300px'
                    });
                } else {
                    if (!$(this).is(':animated')) //perevent double click to double margin
                    {
                        $('#floatingDiv').animate({
                            'right': '0px'
                        });
                    }
                }
            };

            function showAddTripFail() {
                var theMessage = 'Please Login Before Adding a Trip';
                var errorMessage = 'Not Logged In';
                common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', theMessage, errorMessage);
            }

            function userLogin(fail) {
                common.messaging.showLoginMessage(messageTemplate + 'login.html', fail)
                    .then(function (response) {
                        oauth.retreiveToken(response.userEmail, response.userPassword)
                            .then(function (response) {
                                var theResponse = response;
                                var type = 'success';
                                var message = 'You have successfully logged in!';
                                if (response.data.access_token) {
                                    common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', message, type);
                                    $scope.showLoggedInButtons();
                                    $window.sessionStorage.token = response.data.access_token;
                                }
                            }, function (response) {
                                userLogin(true);
                            });
                    });
            }

            function getTrips() {
                dataFactory.getAllTrips().success(function (features) {
                    createMarkers(features);
                });
            }

            $scope.showLoggedInButtons = function () {
                $('#loginButton').hide();
                $('#logoutButton').show();
            };

            $scope.showLoggedOutButtons = function () {
                $('#loginButton').show();
                $('#logoutButton').hide();
            };

            $scope.editThisTrip = function (theId) {
                $state.go('editTrip', {
                    tripId: theId
                });
                //$window.location.href = '/app/editTrip/editTrip.html';
            }

            $scope.showIntro = function () {
                //$scope.showKML();
                $("#bikeDetails").hide();
                $("#bikeIntro").show();
            }

            function checkDetailsVisibility() {
                if ($scope.tripShow == false) {
                    $scope.bikeIntroShow = false;
                    $scope.tripShow = true;
                }
                //since shows aren't working
                $("#bikeDetails").show();
                $("#bikeIntro").hide();
            }

            angular.element(document).ready(function () {
                getTrips();
                var token = currentUser.profile.token;
//                if (token !== '') {
                    if (token.length > 1) {
                        $scope.showLoggedInButtons();
                    } else {
                        $scope.showLoggedOutButtons();
                    }
//                } else {
//                    $scope.showLoggedOutButtons();
//                }
            });
            
            
        });
    }
}());