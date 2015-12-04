(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateTrip', CreateTrip);

    CreateTrip.$inject = ['$scope', '$http', '$window', 'common', 'dataFactory', '$location', 'uiGmapIsReady', '$timeout', '$state', 'geokeyData'];

    function CreateTrip($scope, $http, $window, common, dataFactory, $location, uiGmapIsReady, $timeout, $state, geokeyData) {

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

            returnFields();
            $scope.theForm = {};
            $scope.submitDisabled = true;
            $scope.geoFileLoaded = false;
            var geoJsonToSave;
            var featureArray = [];
            var geoJsonCoordinates;
            var messageTemplate = 'app/core/messaging/templates/';
            var theGeoJson;

            $scope.returnToMap = function () {
                window.location.href = "index.html";
            }

            $scope.submitCreateTrip = function () {
                var finishedGeoJson = createFeature();
                var howdy;
                                dataFactory.submitNewTrip(finishedGeoJson).success(function (data) {
                                    //successIndividualTrip(data);
                                    var theMessage = "You have Successfully added a new Bike Trip!";
                                    common.messaging.showSimpleMessage(messageTemplate + 'simpleMessage.html', theMessage);
                                    $state.go('main');
                                }).error(function (e) {
                                    console.log('there was an error ' + e.error);
                                });
            }

            function createFeature() {
                var theFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": geoJsonCoordinates
                    },
                    "properties": $scope.theForm,
                    "meta": {
                        "category": geokeyData.categoryId
                    }
                }
                featureArray.push(theFeature);
                return theFeature;
            }

            function createFinalGeoJson() {
                var finalGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "meta": {
                        "category": 70
                    },
            "geometry": {
                "type": "LineString",
                "coordinates": [
          [
            32.728271484375,
            38.298559092254344
          ],
          [
            32.486572265625,
            38.89103282648849
          ],
          [
            33.71704101562499,
            39.18117526158749
          ],
          [
            33.519287109375,
            39.47860556892209
          ],
          [
            34.288330078125,
            39.757879992021756
          ],
          [
            34.541015625,
            38.976492485539424
          ],
          [
            34.134521484375,
            38.62545397209084
          ],
          [
            33.519287109375,
            38.16047628099622
          ]
        ]
            }
    }, {
            "type": "Feature",
            "properties": {},
            "meta": {
                        "category": 70
                    },
            "geometry": {
                "type": "LineString",
                "coordinates": [
          [
            34.1015625,
            37.640334898059486
          ],
          [
            33.28857421875,
            37.11652618491117
          ],
          [
            33.83789062499999,
            36.641977814705946
          ],
          [
            33.211669921875,
            36.16448788632064
          ],
          [
            33.33251953125,
            35.038992046780784
          ]
        ]
            }
    }
  ]
}
                
//                var finalGeoJSON;
//                if (featureArray.length > 1) {

                    //                        {
                    //                            "type": "FeatureCollection",
                    //                            "features":
                    //                        }
                    //                    }
                    //                    ]
                    //            }

//                    for (var i = 0; i < featureArray.length; i++) {
//
//                    }
                    //Create feature collection
                    //loop through coordinates array for all features to be saved
//                } else {
//                    //Create single feature geojson 
//                    finalGeoJSON = {
//                        "type": "Feature",
//                        "geometry": {
//                            "type": "LineString",
//                            "coordinates": geoJsonCoordinates
//                        },
//                        "properties": $scope.theForm,
//                        "meta": {
//                            "category": geokeyData.categoryId
//                        }
//                    }
//                }
                return finalGeoJSON;
            }

            function returnFields() {
                dataFactory.returnFields().success(function (data) {
                    $scope.fields = data.fields;
                }).error(function (e) {
                    console.log('No fields were found at this project id and category id.  Check your values in geokeyData.js');
                });
            }

            function updateSubmit() {
                if ($scope.geoFileLoaded) {
                    $scope.submitDisabled = false;
                }
            }

            /*  ********* map interaction functions  ************ */
            //function to get all coordinate features
            function convertToGmap(features) {
                var gmapGeoJson = [];
                for (var i = 0; i < features.length; i++) { //loop through each feature
                    var gmapGeoJson = reverseCoordinates(features[i].geometry.coordinates) //send to reverseLatLons
                }
                return gmapGeoJson;
            }

            function reverseCoordinates(origGeoJson) {
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
                        var geojson;
                        // convert gpx DOM to geoJSON
                        switch (fileType) {
                        case 'gpx':
                            result = new DOMParser().parseFromString(result, 'text/xml');
                            geojson = toGeoJSON.gpx(result);
                            break;
                        case 'kml':
                            result = new DOMParser().parseFromString(result, 'text/xml');
                            geojson = toGeoJSON.kml(result);
                            break;
                        case 'kmz':
                            result = new DOMParser().parseFromString(result, 'text/xml');
                            geojson = toGeoJSON.kml(result);
                            break;
                        case 'json':
                            geojson = JSON.parse(result);
                            break;
                        }
                        var gmapGeoJson = convertToGmap(geojson.features);
                        //                        var firstLat = geojson.features[0].geometry.coordinates[0][1];
                        //                        var firstLng = geojson.features[0].geometry.coordinates[0][0];
                        geoJsonCoordinates = removeZValue(geojson.features[0].geometry.coordinates);

                        //                        newPath = {
                        //                            id: 4,
                        //                            path: gmapGeoJson,
                        //                            stroke: {
                        //                                color: '#f7952a',
                        //                                weight: 3
                        //                            },
                        //                            editable: false,
                        //                            draggable: false,
                        //                            geodesic: false,
                        //                            visible: true
                        //                        }

                        theGeoJson = createFeature();
                        maps[0].map.data.addGeoJson(theGeoJson);
                        zoom(maps[0].map);

                        $scope.geoFileLoaded = true;
                        updateSubmit();
                    });
                    reader.readAsText(file);
                }
                return false;
            });

        });

    };

}());