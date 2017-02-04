'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
]).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/view1'});
}])

    .controller('myApp', ['$scope', '$http', function($scope, $http) {
        $scope.queryURL = "https://api.nasa.gov/mars-photos/api/v1/rovers/";
        $scope.rover = "";
        $scope.manifestURL = "https://api.nasa.gov/mars-photos/api/v1/manifests/";
        $scope.manifest = {};
        $scope.apiKey = "QVVpRu8GN1TT6dqz89kn3DQMBXcDL25RtEO2LKr9";
        $scope.photoList = {};

        $scope.selectRover = function(roverName) {
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
            $http.get($scope.queryURL + "&api_key=" + $scope.apiKey).then(function(response) {
                $scope.photoList = response.data;
            });
        };

        $scope.selectDate = function(date, isSol) {
            if (isSol) {
                $scope.queryURL = $scope.queryURL + "?sol=" + date;
            }
            else {
                $scope.queryURL = $scope.queryURL + "?earth_date=" + date;
            }

            getPhotos();
        };

        $scope.selectCamera = function(camera) {
            $scope.queryURL = $scope.queryURL + "&camera=" + camera;
            getPhotos();
        }

    }]);
