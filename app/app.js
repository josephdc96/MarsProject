'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'bootstrapLightbox',
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
]).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/view1'});
}])

    .controller('myApp', ['$scope', '$http', function($scope, $http, Lightbox) {
        $scope.queryURL = "https://api.nasa.gov/mars-photos/api/v1/rovers/";
        $scope.rover = "";
        $scope.date = "";
        $scope.camera = "";
        $scope.manifestURL = "https://api.nasa.gov/mars-photos/api/v1/manifests/";
        $scope.manifest = {};
        $scope.apiKey = "QVVpRu8GN1TT6dqz89kn3DQMBXcDL25RtEO2LKr9";
        $scope.photoList = {};
        $scope.photos = [];
        $scope.isDateSelectHidden = true;
        $scope.isPictureViewHidden = true;
        $scope.selectRover = function(roverName) {
            $scope.isDateSelectHidden = false;
            if (roverName === 'curiosity' || roverName === 'spirit' || roverName === 'opportunity') {
                $scope.queryURL = $scope.queryURL + "curiosity/photos";
                $scope.rover = roverName;
                $http.get($scope.manifestURL + roverName + "?api_key=" + $scope.apiKey)
                    .success(function(data) {
                        $scope.manifest = eval(data);
                        console.log(data);
                        console.log($scope.manifest);
                    })
                console.log("You have selected " + roverName);
            }
            else {

            }

        };

        var getPhotos = function() {
            $http.get($scope.queryURL + $scope.rover + "/photos?" +
                $scope.date + $scope.camera + "&api_key=" + $scope.apiKey)
                .then(function(response) {
                $scope.photoList = response.data;
            });

            for (i = 0; i < $scope.photoList.photos.length; i++) {
                $scope.photos.push({
                    'url': $scope.photoList.photos[i]["img_src"]
                })
            }
        };

        $scope.selectDate = function(date, isSol) {
            if (isSol) {
                $scope.date = "sol=" + date;
            }
            else {
                $scope.date = "earth_date=" + date;
            }

            getPhotos();
        };

        $scope.selectCamera = function(camera) {
            $scope.camera = "camera=" + camera;
            getPhotos();
        }

        $scope.openLightboxModal = function(index) {
            Lightbox.openModal($scope.images, index);
        }

        // date picker
        $scope.myDate = new Date();
        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() - 2,
            $scope.myDate.getDate());
        $scope.maxDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() + 2,
            $scope.myDate.getDate());
        $scope.onlyWeekendsPredicate = function(date) {
          var day = date.getDay();
          return day === 0 || day === 6;
        };

    }]);
