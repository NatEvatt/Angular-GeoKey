(function () {
    'use strict';

    angular
        .module('app')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', 'uiGmapGoogleMapApi', '$window', 'common', 'dataFactory', 'oauth', '$state', 'myLocalStorage', 'uiGmapIsReady'];

    function MapController($scope, uiGmapGoogleMapApi, $window, common, dataFactory, oauth, $state, myLocalStorage, uiGmapIsReady) { //uiGmapGoogleMapApi

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 4
        };

        uiGmapIsReady.promise().then(function (maps) {

            $scope.show = true;
            $scope.clickedId;
            $scope.icon = 'content/images/mapIcon50.png';
            $scope.markers = [];
            var messageTemplate = 'app/core/messaging/templates/';
            maps[0].map.data.setStyle({
                strokeColor: '#f7952a',
                strokeWeight: 3,
                visible: false
            });
            var features;
            maps[0].map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

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

            function zoomIndividual(id) {
                var bounds = new google.maps.LatLngBounds();
                maps[0].map.data.forEach(function (feature) {
                    var theLetter = getLetterVar(feature);
                    if (feature[theLetter] == id) {
                        processPoints(feature.getGeometry(), bounds.extend, bounds);
                        makeVisible(feature);
                    }
                });
                maps[0].map.fitBounds(bounds);
            }

            function getLetterVar(feature) {
                //This function is necessary because the feature id changes variable (annoying)
                var theLetter = "";
                var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
                _.each(alphabet, function (letter) {
                    if(!isNaN(feature[letter])){
                        theLetter = letter;
                    }
                });
                return theLetter;
            }

            function makeVisible(feature) {
                maps[0].map.data.overrideStyle(feature, {
                    visible: true
                });
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

            function hideMarkers() {
                for (var i = 0; i < $scope.markers.length; i++) {
                    $scope.markers[i].setVisible(false);
                }
            }

            function showMarkers() {
                for (var i = 0; i < $scope.markers.length; i++) {
                    $scope.markers[i].setVisible(true);
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

                    var markerTitle = String(i);
                    var dataId = getDataId(i)
                        //var image ="http://maps.google.com/mapfiles/kml/shapes/cycling.png";
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: maps[0].map,
                        id: dataId,
                        icon: image,
                        title: markerTitle
                    });
                    var test;
                    google.maps.event.addListener(marker, 'mouseover', function () {
                        maps[0].map.data.overrideStyle(features[this.title], {
                            visible: true
                        });
                    });
                    google.maps.event.addListener(marker, 'mouseout', function () {
                        if ($scope.clickedId !== this.id) {
                            maps[0].map.data.overrideStyle(features[this.title], {
                                visible: false
                            })
                        }
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        $scope.clickedId = this.id;
                        maps[0].map.data.overrideStyle(features[this.title], {
                            visible: true
                        });
                        $scope.loadIndividualTrip([this.id])
                    });
                    $scope.markers.push(marker);
                }
            }

            $scope.loadIndividualTrip = function (id) {
                //                  Fields not being returned yet in the all_contributions so need to make another call to GeoKey
                //                var featureId = getFeatureId(id);
                //                var allFeatures = myLocalStorage.allGeoData();
                //                var individualTrip = allFeatures.features[featureId];
                //                successIndividualTrip(individualTrip);
                $(".mapLoader").css("display","block");
                dataFactory.getIndividualTrip(id).success(function (features) {
                    successIndividualTrip(features);
                });
            };

            function getDataId(markerId) {
                for (var i = 0; i < features.length; i++) {
                    if (i == markerId) {
                        var theLetter = getLetterVar(features[i])
                        return features[i][theLetter];
                    }
                }
            }

            function getFeatureId(markerId) {
                for (var i = 0; i < features.length; i++) {
                    if (features[i].D == markerId) {
                        return i;
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
                $scope.fields = data.meta.category.fields;
                $scope.properties = data.properties;
                if (typeof data.properties.image === 'undefined') {
                    $scope.properties.image = 'no_image.jpg';
                };
                $scope.creator = data.meta.creator.display_name;
                $scope.updator = data.meta.updator;
                $scope.tripId = data.id;
                //                var featureId = getFeatureId(data.id);
                zoomIndividual(data.id);
                hideMarkers();

                //                        set visibility of this feature


                //                $scope.rideImgDet = 'content/images/' + data.properties.rideimgdet;

                //
                //                if (data.properties.picasalink) {
                //                    //$("#picasaLink a").prop("href", data.properties.attributes.picasalink);
                //                    $('#photoLink').show();
                //                    $scope.photoLink = data.properties.picasalink;
                //                } else {
                //                    $('#photoLink').hide();
                //                }

                checkDetailsVisibility();
                $(".mapLoader").css("display","none");
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
                case 'refreshMap':
                    myLocalStorage.clearGeoJSON();
                    getTrips();
                    break;
                }
            };

            $scope.windowoptions = {
                //pixelOffset: new google.maps.Size(-1, -250, 'px', 'px'),
                visible: false
            };

            $scope.logout = function () {
                //$window.sessionStorage.token;
                myLocalStorage.clearProfile();
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
                        if (response == 'register') {
                            registerUser();
                        } else {
                            oauth.retreiveToken(response.userEmail, response.userPassword)
                                .then(function (response) {
                                    var theResponse = response;
                                    var type = 'success';
                                    var message = 'You have successfully logged in!';
                                    if (response.data.access_token) {
                                        common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', message, type);
                                        $scope.showLoggedInButtons();
                                        //                                    $window.sessionStorage.token = response.data.access_token;
                                    }
                                }, function (response) {
                                    userLogin(true);
                                });
                        }
                    });
            }

            function registerUser(fail) {
                common.messaging.showRegistration(messageTemplate + 'register.html', fail)
                    .then(function (response) {
                        if (response.password1 == response.password2 && response.email && response.display_name) {
                            dataFactory.registerNewUser(response)
                                .success(function (response) {
                                    var message = "You have successfully Registered! Login to start adding trips to the map.";
                                    var title = "Registration";
                                    common.messaging.showSimpleMessage(messageTemplate + "simpleMessage.html", message, title);
                                })
                                .error(function (response) {
                                    console.log('There has been an error ' + response);
                                })
                                //Finish the error result here
                        } else {
                            registerUser(true)
                        }
                    });
            }

            function getTrips() {

                //Check if there is geo data stored in the browser's local storage, if not get data from GeoKey
                var localGeoJson = myLocalStorage.allGeoData();
                if (localGeoJson) {
                    createMarkers(localGeoJson);
                } else {
                    dataFactory.getAllTrips().success(function (response) {
                        myLocalStorage.setGeoJSON(response);
                        createMarkers(response);
                    });
                }
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
                $scope.clickedId = "";
                showMarkers();
                zoom(maps[0].map);
                $("#bikeDetails").hide();
                $("#bikeIntro").show();
                //turn off visibility of route again
                maps[0].map.data.forEach(function (feature) {
                    maps[0].map.data.overrideStyle(feature, {
                        visible: false
                    });
                });
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
                var token = myLocalStorage.profile.token;
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