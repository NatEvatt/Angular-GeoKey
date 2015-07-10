(function () {
    'use strict';

    angular
        .module('app')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', 'uiGmapGoogleMapApi', '$window', 'common', 'dataFactory', 'oauth', '$state', 'currentUser', 'uiGmapIsReady'];

    function MapController($scope, uiGmapGoogleMapApi, $window, common, dataFactory, oauth, $state, currentUser, uiGmapIsReady) { //uiGmapGoogleMapApi

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 4
        };

        uiGmapIsReady.promise().then(function (maps) {

            $scope.show = true;
            $scope.icon = 'content/images/mapIcon50.png';
            $scope.markers = [];
            var messageTemplate = 'app/core/messaging/templates/';
            maps[0].map.data.setStyle({
                strokeColor: '#f7952a',
                strokeWeight: 3,
                visible: false
            });
            var features;

            maps[0].map.data.addListener('mouseover', function (event) {
                maps[0].map.data.overrideStyle(features[0], {
                    visible: false
                });
            });
            maps[0].map.data.addListener('mouseout', function (event) {
                maps[0].map.data.overrideStyle(features[0], {
                    visible: true
                });
            });

            function zoom(map) {
                var bounds = new google.maps.LatLngBounds();
                map.data.forEach(function (feature) {
                    processPoints(feature.getGeometry(), bounds.extend, bounds);
                });
                map.fitBounds(bounds);
            }

            function processPoints(geometry, callback, thisArg) {
                if (geometry instanceof google.maps.LatLng) {
                    callback.call(thisArg, geometry);
                } else if (geometry instanceof google.maps.Data.Point) {
                    callback.call(thisArg, geometry.get());
                } else {
                    geometry.getArray().forEach(function (g) {
                        processPoints(g, callback, thisArg);
                    });
                }
            }

            function createMarkers(response) {
                features = maps[0].map.data.addGeoJson(response);
                zoom(maps[0].map);
                $scope.allTrips = response.features; //to pass to the ng-repeat in bikeIntro

                var featureArray = response.features;
                var i = 0;
                for (var i = 0; i < featureArray.length; i++) {
                    //var tripName = data.jsonData[trip]['tripDet'];
                    //var latlng = data.jsonData[trip]['latlng'];
                    var firstPoint = featureArray[i].geometry.coordinates[0];

                    //                    var splitLatLng = latlng.split(",");
                    var myLatlng = new google.maps.LatLng(firstPoint[1], firstPoint[0]);
                    var image = {
                        url: 'content/images/mapIcon50.png'
                    };
                    //var image ="http://maps.google.com/mapfiles/kml/shapes/cycling.png";
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: maps[0].map,
                        id: i,
                        icon: image
                    });
                    var test;
                    google.maps.event.addListener(marker, 'mouseover', function () {
                        maps[0].map.data.overrideStyle(features[this.id], {
                            visible: true
                        });
                    });
                    google.maps.event.addListener(marker, 'mouseout', function () {
                        maps[0].map.data.overrideStyle(features[this.id], {
                            visible: false
                        });
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        $scope.loadIndividualTrip([this.id])
                    });
                }
            }

            $scope.loadIndividualTrip = function (id) {
                $window.sessionStorage.id = id;
                //$scope.clearActiveLayers();
                var dataId = getDataId(id);

                dataFactory.getIndividualTrip(dataId).success(function (features) {
                    successIndividualTrip(features);
                });
            };
            
            function getDataId(markerId){
                for (var i = 0; i <features.length; i++){
                    if(i==markerId[0]){
                        return features[i].D;   
                    }
                }
            }



            $scope.clearActiveLayers = function () {
                for (var i = 0; i < activeKmlLayers.length; i++) {
                    activeKmlLayers[i].setMap(null);
                }

                activeKmlLayers = [];
            };

            function successIndividualTrip(data) {
                //called when successful
                $scope.tripId = data.id;
                $scope.rideImgDet = 'content/images' + data.properties.rideimgdet;

                //$("#headerImgDet").html(data.properties.attributes.headerimgDet);
                $scope.titleDet = data.properties.titledet;
                $scope.ridersDet = data.properties.ridersdet;
                $scope.tripDet = data.properties.tripdet;
                $scope.dateDet = data.properties.datedet;
                $scope.distanceDet = data.properties.distancedet;
                $scope.durationDet = data.properties.durationdet;
                $scope.milePerDet = data.properties.mileperdet;
                $scope.ascentDet = data.properties.ascentdet;
                $scope.descentDet = data.properties.descentdet;
                $scope.startElevDet = data.properties.startelevdet;
                $scope.finElevDet = data.properties.finelevdet;
                $scope.minElevDet = data.properties.minelevdet;
                $scope.maxElevDet = data.properties.maxelevdet;

                if (data.properties.picasalink) {
                    //$("#picasaLink a").prop("href", data.properties.attributes.picasalink);
                    $('#photoLink').show();
                    $scope.photoLink = data.properties.picasalink;
                } else {
                    $('#photoLink').hide();
                }

                //var kmlLayers = data.properties.attributes.kmllayers.split('|XX|');

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
            });


        });
    }
}());