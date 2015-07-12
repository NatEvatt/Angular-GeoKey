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
            var newPath = "";
            var geoJsonToSave;
            var messageTemplate = 'app/core/messaging/templates/';
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
                    $state.go('main');
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
                        "title": $scope.theForm.title
                    },
                    "meta": {
                        "category": geokeyData.categoryId
                    }
                }
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
                        }

                        theGeoJson = createGeoJson();
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