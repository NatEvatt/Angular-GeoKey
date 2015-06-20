(function () {

    var app = angular.module('app');
    var SimpleController = function($scope) {

        
        //            var mapOptions = {
//                zoom: 4,
//                center: new google.maps.LatLng(40.0000, -98.0000),
//                mapTypeId: google.maps.MapTypeId.TERRAIN
//            };

            //$scope.map = new maps.Map(document.getElementById('map'), mapOptions);
            $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
            $scope.lat = 45;

            $scope.markers = [];

//            var infoWindow = new google.maps.InfoWindow();
//
//            var createMarker = function (info) {
//                var marker = new google.maps.Marker({
//                    map: $scope.map,
//                    position: new google.maps.LatLng(info.lat, info.long),
//                    title: info.city
//                });
//                marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
//
//                google.maps.event.addListener(marker, 'click', function () {
//                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
//                    infoWindow.open($scope.map, marker);
//                });
//
//                $scope.markers.push(marker);
//            };
//
//            for (var i = 0; i < cities.length; i++) {
//                createMarker(cities[i]);
//            }
//
//            $scope.openInfoWindow = function (e, selectedMarker) {
//                e.preventDefault();
//                google.maps.event.trigger(selectedMarker, 'click');
//            };
//
//        });

        
        
    };

    app.controller('SimpleController', SimpleController);

}());
