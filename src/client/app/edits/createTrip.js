(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateTrip', CreateTrip);

    CreateTrip.$inject = ['$scope', '$http', '$window', 'common', 'dataFactory', '$location', 'uiGmapIsReady', '$timeout'];

    function CreateTrip($scope, $http, $window, common, dataFactory, $location, uiGmapIsReady, $timeout) {

        $timeout(function () {
            $scope.showMap = true;
            //$scope.$apply();
        }, 100);

        $scope.map = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 4
        };

        uiGmapIsReady.promise().then(function (maps) {
            //        uiGmapGoogleMapApi.then(function (maps) {

            $scope.polylines = [];
            $scope.submitDisabled = true;
            $scope.geoFileLoaded = false;
            $scope.theForm = {};
            var newPath = "";
            var geoJsonToSave;
            var messageTemplate = '../core/messaging/templates/';
            var theGeoJson;

            $scope.returnToMap = function () {
                window.location.href = "index.html";
            }

            $scope.submitCreateTrip = function () {
                var finishedGeoJson = createGeoJson();
                dataFactory.submitNewTrip(finishedGeoJson).success(function (data) {
                    //successIndividualTrip(data);
                    var theMessage = "You have Successfully added a new Bike Trip!";
                    common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', theMessage);
                }).error(function (e) {
                    console.log('there was an error ' + e.error);
                });
            }

            function createGeoJson() {
                return {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": geoJsonToSave
                    },
                    "properties": {
                        "titledet": $scope.theForm.titleDet
                    },
                    "meta": {
                        "category": 1
                    }
                }
            }

            function updateSubmit() {
                if ($scope.geoFileLoaded) {
                    $scope.submitDisabled = false;
                }
            }

            /*  ********* map interaction functions  ************ */

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

            function removeZValue(origGeoJson) {
                var cleanSaveGeoJson = [];
                for (var i = 0; i < origGeoJson.length; i++) {
                    var thisPoint = [
                            origGeoJson[i][0],
                            origGeoJson[i][1]
                        ]
                    cleanSaveGeoJson.push(thisPoint);
                }
                return cleanSaveGeoJson;
            }

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

                e.preventDefault();
                dropzone.classList.remove('dragover');
                var dt = e.dataTransfer;
                var files = dt.files;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var fileType = files[i].name.split('.').pop();

                    var reader = new FileReader();
                    reader.addEventListener('loadend', function (e) {
                        var result = this.result;
                        // parse the data
                        result = new DOMParser().parseFromString(result, 'text/xml');
                        var geojson;
                        // convert gpx DOM to geoJSON
                        switch (fileType) {
                        case 'gpx':
                            geojson = toGeoJSON.gpx(result);
                            break;
                        case 'kml':
                            geojson = toGeoJSON.kml(result);
                            break;
                        case 'kmz':
                            geojson = toGeoJSON.kml(result);
                            break;
                        }
                        var gmapGeoJson = convertToGmap(geojson.features[0].geometry.coordinates);
                        var firstLat = geojson.features[0].geometry.coordinates[0][1];
                        var firstLng = geojson.features[0].geometry.coordinates[0][0];
                        geoJsonToSave = removeZValue(geojson.features[0].geometry.coordinates);

                        newPath = {
                                id: 4,
                                path: gmapGeoJson,
                                stroke: {
                                    color: '#f7952a',
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
                            //$scope.polylines.push(newPath);
                            //                            maps[0].map.setCenter(new google.maps.LatLng(firstLat, firstLng));
                            //                            maps[0].map.setZoom(14);
                        theGeoJson = createGeoJson();
                        maps[0].map.data.addGeoJson(theGeoJson);
                        zoom(maps[0].map);

                        $scope.geoFileLoaded = true;
                        updateSubmit();
                        //                        new google.maps.LatLng(-37.8025182,144.9987055));
                        //                        setCenter(theGeojson[1]);
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




            /* ****** I am pretty sure that this stuff can be deleted  ****** */



            //            $scope.editTrip = function () {
            //                var id = $window.sessionStorage.id;
            //                var token = $window.sessionStorage.token;
            //                var editedData = {
            //                    "properties": {
            //                        "attributes": {
            //                            "titledet": $scope.theForm.titleDet,
            //                            "rideimgdet": $scope.theForm.rideImgDet,
            //                            "tripdet": $scope.theForm.tripDet,
            //                            "datedet": $scope.theForm.dateDet,
            //                            "ridersdet": $scope.theForm.ridersDet,
            //                            "distancedet": $scope.theForm.distanceDet,
            //                            "durationdet": $scope.theForm.durationDet,
            //                            "mileperdet": $scope.theForm.milePerDet,
            //                            "ascentdet": $scope.theForm.ascentDet,
            //                            "descentdet": $scope.theForm.descentDet,
            //                            "startelevdet": $scope.theForm.startElevDet,
            //                            "finelevdet": $scope.theForm.finElevDet,
            //                            "minelevdet": $scope.theForm.minElevDet,
            //                            "maxelevdet": $scope.theForm.maxElevDet,
            //                            "latlng": $scope.theForm.latlng,
            //                            "zoom": $scope.theForm.zoom,
            //                            "picasalink": $scope.theForm.picasaLink,
            //                            "kmllayers": $scope.theForm.kmlLayers,
            //                        }
            //                    }
            //                }
            //
            //                var theUrl = 'http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/' + id + '/';
            //
            //                var req = {
            //                    method: 'PATCH',
            //                    url: theUrl,
            //                    headers: {
            //                        'Content-Type': 'application/json',
            //                        Authorization: 'Bearer ' + token
            //                    },
            //                    data: editedData
            //                }
            //
            //                $http(req).success(function () {
            //                    BootstrapDialog.show({
            //                        title: 'Success',
            //                        message: 'Your trip has been updated',
            //                        closable: false,
            //                        buttons: [{
            //                            label: 'Continue Editing',
            //                            cssClass: 'btn-blueBorder',
            //                            action: function (dialogItself) {
            //                                dialogItself.close();
            //                            }
            //                }, {
            //                            label: 'Return to the Map',
            //                            cssClass: 'btn-orange',
            //                            action: function (dialogItself) {
            //                                $scope.returnToMap();
            //                                dialogItself.close();
            //                            }
            //                }]
            //                    });
            //                }).error(function (e) {
            //                    if (e.error == 'You are not allowed to update thecontribution') {
            //                        $scope.showSimpleMessage('You do not have permission to edit this trip');
            //                    }
            //                    console.log('there was an error ' + e.error);
            //                });
            //
            //            }

            //            $scope.loadEditTrip = function () {
            //
            //                var id = $window.sessionStorage.id
            //                var url = 'http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/' + id + '/';
            //                $.ajax({
            //                    url: url,
            //                    type: 'GET',
            //                    success: function (data) {
            //                        //called when successful
            //                        console.log(data);
            //                        //$("#headerImgDet").html(data.properties.attributes.headerimgDet);
            //
            //                        $("#ridersDet").val(data.properties.attributes.ridersdet);
            //                        $("#rideImgDet").val(data.properties.attributes.rideimgdet);
            //                        $("#titleDet").val(data.properties.attributes.titledet);
            //                        $("#tripDet").val(data.properties.attributes.tripdet);
            //                        $("#dateDet").val(data.properties.attributes.datedet);
            //                        $("#ridersDet").val(data.properties.attributes.ridersdet);
            //                        $("#distanceDet").val(data.properties.attributes.distancedet);
            //                        $("#durationDet").val(data.properties.attributes.durationdet);
            //                        $("#milePerDet").val(data.properties.attributes.mileperdet);
            //                        $("#ascentDet").val(data.properties.attributes.ascentdet);
            //                        $("#descentDet").val(data.properties.attributes.descentdet);
            //                        $("#startElevDet").val(data.properties.attributes.startelevdet);
            //                        $("#finElevDet").val(data.properties.attributes.finelevdet);
            //                        $("#latlng").val(data.properties.attributes.latlng);
            //                        $("#zoom").val(data.properties.attributes.zoom);
            //                        $("#minElevDet").val(data.properties.attributes.minelevdet);
            //                        $("#maxElevDet").val(data.properties.attributes.maxelevdet);
            //                        $("#picasaLink").val(data.properties.attributes.picasalink);
            //                        $("#kmlLayers").val(data.properties.attributes.kmllayers);
            //
            //                        /* The correct way  of doing it
            //                    
            //                                $scope.theForm.titleDet = data.properties.attributes.titledet;
            //                    
            //                                */
            //
            //                    },
            //                    error: function (e) {
            //                        console.log('there was an error ' + e.message);
            //                        //console.log(e.message);
            //                    }
            //                });
            //            }

            //            $scope.userLogin = function (fail) {
            //                common.messaging.showLoginMessage(messageTemplate + "login.html", fail).then(function (response) {
            //                    dataFactory.retreiveToken(response.userEmail, response.userPassword).then(function (response) {
            //                        var theResponse = response;
            //                        if (response.data.access_token) {
            //                            common.messaging.showSimpleMessage(messageTemplate + "simpleMessage.html", "You have successfully registered!", "Success");
            //                            $scope.showLoggedInButtons();
            //                            $window.sessionStorage.token = response.data.access_token;
            //                        }
            //                    }, function (response) {
            //                        userLogin(true)
            //                    })
            //                })
            //            }

            //            $scope.deleteTrip = function () {
            //
            //                var id = $window.sessionStorage.id
            //                var token = $window.sessionStorage.token;
            //
            //
            //                var req = {
            //                    method: 'DELETE',
            //                    url: "http://178.62.58.84:8000/api/projects/1/data-groupings/all-contributions/contributions/" + id + "/",
            //                    headers: {
            //                        'Content-Type': "application/json",
            //                        Authorization: "Bearer " + token
            //                    },
            //                    data: ""
            //                }
            //
            //                $http(req).success(function () {
            //                    BootstrapDialog.show({
            //                        title: 'Success',
            //                        message: 'Your trip has been deleted',
            //                        closable: false,
            //                        buttons: [{
            //                            label: "Return to the Map",
            //                            cssClass: 'btn-orange',
            //                            action: function (dialogItself) {
            //                                $scope.returnToMap();
            //                                dialogItself.close();
            //                            }
            //                }]
            //                    });
            //                }).error(function (e) {
            //                    console.log('there was an error ' + e.message);
            //                });
            //
            //            }

        });

    };

}());