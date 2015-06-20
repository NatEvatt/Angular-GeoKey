(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateTrip', CreateTrip);

    CreateTrip.$inject = ['$scope', '$http', '$window', 'common', 'dataFactory', '$location', 'uiGmapGoogleMapApi'];

    function CreateTrip($scope, $http, $window, common, dataFactory, $location, uiGmapGoogleMapApi) {

        uiGmapGoogleMapApi.then(function (maps) {

            var el = angular.element();

            $scope.map = {
                center: {
                    latitude: 32.925146,
                    longitude: -116.968797
                },
                zoom: 14
            };

            $scope.polylines = [];

            var messageTemplate = '../core/messaging/templates/';

            $scope.editTrip = function () {
                var id = $window.sessionStorage.id;
                var token = $window.sessionStorage.token;
                var editedData = {
                    "properties": {
                        "attributes": {
                            "titledet": $scope.theForm.titleDet,
                            "rideimgdet": $scope.theForm.rideImgDet,
                            "tripdet": $scope.theForm.tripDet,
                            "datedet": $scope.theForm.dateDet,
                            "ridersdet": $scope.theForm.ridersDet,
                            "distancedet": $scope.theForm.distanceDet,
                            "durationdet": $scope.theForm.durationDet,
                            "mileperdet": $scope.theForm.milePerDet,
                            "ascentdet": $scope.theForm.ascentDet,
                            "descentdet": $scope.theForm.descentDet,
                            "startelevdet": $scope.theForm.startElevDet,
                            "finelevdet": $scope.theForm.finElevDet,
                            "minelevdet": $scope.theForm.minElevDet,
                            "maxelevdet": $scope.theForm.maxElevDet,
                            "latlng": $scope.theForm.latlng,
                            "zoom": $scope.theForm.zoom,
                            "picasalink": $scope.theForm.picasaLink,
                            "kmllayers": $scope.theForm.kmlLayers,
                        }
                    }
                }

                var theUrl = 'http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/' + id + '/';

                var req = {
                    method: 'PATCH',
                    url: theUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
                    },
                    data: editedData
                }

                $http(req).success(function () {
                    BootstrapDialog.show({
                        title: 'Success',
                        message: 'Your trip has been updated',
                        closable: false,
                        buttons: [{
                            label: 'Continue Editing',
                            cssClass: 'btn-blueBorder',
                            action: function (dialogItself) {
                                dialogItself.close();
                            }
                }, {
                            label: 'Return to the Map',
                            cssClass: 'btn-orange',
                            action: function (dialogItself) {
                                $scope.returnToMap();
                                dialogItself.close();
                            }
                }]
                    });
                }).error(function (e) {
                    if (e.error == 'You are not allowed to update thecontribution') {
                        $scope.showSimpleMessage('You do not have permission to edit this trip');
                    }
                    console.log('there was an error ' + e.error);
                });

            }

            $scope.showSimpleMessage = function (message) {
                BootstrapDialog.show({
                    title: 'Bike Touring Map',
                    message: message,
                    closable: true,
                    buttons: [{
                        label: 'Close',
                        cssClass: 'btn-orange',
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                }]
                });
            }

            $scope.loadEditTrip = function () {

                var id = $window.sessionStorage.id
                var url = 'http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/' + id + '/';
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function (data) {
                        //called when successful
                        console.log(data);
                        //$("#headerImgDet").html(data.properties.attributes.headerimgDet);

                        $("#ridersDet").val(data.properties.attributes.ridersdet);
                        $("#rideImgDet").val(data.properties.attributes.rideimgdet);
                        $("#titleDet").val(data.properties.attributes.titledet);
                        $("#tripDet").val(data.properties.attributes.tripdet);
                        $("#dateDet").val(data.properties.attributes.datedet);
                        $("#ridersDet").val(data.properties.attributes.ridersdet);
                        $("#distanceDet").val(data.properties.attributes.distancedet);
                        $("#durationDet").val(data.properties.attributes.durationdet);
                        $("#milePerDet").val(data.properties.attributes.mileperdet);
                        $("#ascentDet").val(data.properties.attributes.ascentdet);
                        $("#descentDet").val(data.properties.attributes.descentdet);
                        $("#startElevDet").val(data.properties.attributes.startelevdet);
                        $("#finElevDet").val(data.properties.attributes.finelevdet);
                        $("#latlng").val(data.properties.attributes.latlng);
                        $("#zoom").val(data.properties.attributes.zoom);
                        $("#minElevDet").val(data.properties.attributes.minelevdet);
                        $("#maxElevDet").val(data.properties.attributes.maxelevdet);
                        $("#picasaLink").val(data.properties.attributes.picasalink);
                        $("#kmlLayers").val(data.properties.attributes.kmllayers);

                        /* The correct way  of doing it
                    
                                $scope.theForm.titleDet = data.properties.attributes.titledet;
                    
                                */

                    },
                    error: function (e) {
                        console.log('there was an error ' + e.message);
                        //console.log(e.message);
                    }
                });
            }

            $scope.userLogin = function (fail) {
                common.messaging.showLoginMessage(messageTemplate + "login.html", fail).then(function (response) {
                    dataFactory.retreiveToken(response.userEmail, response.userPassword).then(function (response) {
                        var theResponse = response;
                        if (response.data.access_token) {
                            common.messaging.showSimpleMessage(messageTemplate + "simpleMessage.html", "You have successfully registered!", "Success");
                            $scope.showLoggedInButtons();
                            $window.sessionStorage.token = response.data.access_token;
                        }
                    }, function (response) {
                        userLogin(true)
                    })
                })
            }

            $scope.retrieveAccessToken = function () {


                var url = "http://178.62.58.84:8000/oauth2/access_token";
                var jsonArray = {
                    client_id: "************************",
                    client_secret: "********************",
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

            function convertToGmap(origGeoJson) {
                var gmapGeoJson = [];
                for (var i = 0; i < origGeoJson.length; i++) {
                    var thisPoint = {
                        latitude: origGeoJson[i][1],
                        longitude: origGeoJson[i][0]
                    }
                    gmapGeoJson.push(thisPoint);
                }
                return gmapGeoJson;
            }

            $scope.showDeleteLocationPopup = function (options, id) {
                if (options === true) {
                    $scope.displayLocationDeletePopup = true;
                } else {
                    $scope.displayLocationDeletePopup = false;
                }
                $scope.locationId = id;
            };
            var dropzone = document.getElementById("createTripMap")
                // Cancel the drag events, so the browser will not navigate
            dropzone.addEventListener('dragover', function (e) {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
            dropzone.addEventListener('dragleave', function (e) {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            });
            // Handle file drop
            dropzone.addEventListener('drop', function (e) {

                $scope.mapOptions = {
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                
                var mapDiv = document.getElementsByClassName("angular-google-map");
                //var map = plugin.google.maps.Map.getMap(div, mapOptions);
                theMap = new google.maps.Map(mapDiv, $scope.mapOptions);
                
                e.preventDefault();
                dropzone.classList.remove('dragover');
                var dt = e.dataTransfer;
                var files = dt.files;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var reader = new FileReader();
                    reader.addEventListener('loadend', function (e) {
                        var result = this.result;
                        // parse the data
                        result = new DOMParser().parseFromString(result, 'text/xml');
                        // convert gpx DOM to geoJSON
                        var geojson = toGeoJSON.gpx(result);
                        var theGeojson = convertToGmap(geojson.features[0].geometry.coordinates);

                        var newPath = {
                            id: 4,
                            path: theGeojson,
                            stroke: {
                                color: '#000000',
                                weight: 3
                            },
                            editable: false,
                            draggable: false,
                            geodesic: false,
                            visible: true
                                //                            icons: [{
                                //                                icon: {
                                //                                    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                                //                                },
                                //                                offset: '25px',
                                //                                repeat: '50px'
                                //                                }]
                        }
                        $scope.polylines.push(newPath);

                        setCenter(theGeojson[1]);
                        // set the overlay styles and draw the overlay
                        //                        for (var i in geojson.features) {
                        //                            var feature = geojson.features[i];
                        //                            feature.properties.stroke = 'rgba(240,40,0,0.8)';
                        //                            feature.properties['stroke-width'] = 5;
                        //                            feature.properties['marker-color'] = '#f02800';
                        //                            feature.properties.title = feature.properties.name;
                        //                        }
                        //                        var featureLayer = map.featureLayer.setGeoJSON(geojson);
                        //                        map.fitBounds(featureLayer.getBounds());
                    });
                    reader.readAsText(file);
                }
                return false;
            });

        });
    };

}());