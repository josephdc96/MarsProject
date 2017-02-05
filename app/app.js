'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.bootstrap',
    'ui.bootstrap.datepickerPopup',
    'bootstrapLightbox',
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
])

    .controller('myApp', ['$scope', '$http', function($scope, $http, Lightbox) {
        $scope.queryURL = "https://api.nasa.gov/mars-photos/api/v1/rovers/";
        $scope.rover = "";
        $scope.date = "";
        $scope.camera = "camera=all";
        $scope.manifestURL = "https://api.nasa.gov/mars-photos/api/v1/manifests/";
        $scope.manifest = {photo_manifest: {max_date: "2000-01-01", landing_date: "1990-01-01"}};
        //$scope.apiKey = "DEMO_KEY"
        $scope.apiKey = "QVVpRu8GN1TT6dqz89kn3DQMBXcDL25RtEO2LKr9";
        $scope.photoList = {};
        $scope.photos = [];
        $scope.isDateSelectHidden = true;
        $scope.isPictureViewHidden = true;
        $scope.pictureError = true;
        $scope.solDate = "0";
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date($scope.manifest.photo_manifest.max_date),
            minDate: new Date($scope.manifest.photo_manifest.landing_date),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        $scope.selectRover = function(roverName) {
            $scope.photoList = {}
            $scope.isDateSelectHidden = false;
            if (roverName === 'curiosity' || roverName === 'spirit' || roverName === 'opportunity') {

                $scope.rover = roverName;
                $http.get($scope.manifestURL + roverName + "?api_key=" + $scope.apiKey)
                    .success(function(data) {
                        $scope.manifest = eval(data);
                        console.log(data);
                        console.log($scope.manifest);
                        $scope.dateOptions.maxDate = new Date($scope.manifest.photo_manifest.max_date);
                        $scope.dateOptions.minDate = new Date($scope.manifest.photo_manifest.landing_date);
                    })
                console.log("You have selected " + roverName);
            }
            else {

            }
        };

        var getPhotos = function() {
            $scope.photos = [];
            $http.get($scope.queryURL + $scope.rover + "/photos?" +
                $scope.date + $scope.camera + "&api_key=" + $scope.apiKey)
                .success(function(data) {
                    console.log($scope.queryURL + $scope.rover + "/photos?" +
                        $scope.date + $scope.camera + "&api_key=" + $scope.apiKey);
                    $scope.photoList = eval(data);
                    console.log(data);
                    console.log($scope.photoList)
                    for (var i = 0; i < $scope.photoList.photos.length; i++) {
                        $scope.photos.push({
                            'url': $scope.photoList.photos[i]["img_src"]
                        })
                    }
                })
            /*$.ajax({
                type: "GET",
                url: $scope.queryURL + $scope.rover + "/photos?" + $scope.date + $scope.camera + "&api_key=" + $scope.apiKey,
                dataType: "json",
                success: function(data) {
                    $scope.photoList = eval(data);
                    console.log(data);
                    console.log($scope.photoList)
                    for (var i = 0; i < $scope.photoList.photos.length; i++) {
                        $scope.photos.push({
                            'url': $scope.photoList.photos[i]["img_src"]
                        })
                    }
                }
            })*/
        };

        $scope.selectDate = function(isSol) {
            if (isSol) {
                $scope.date = "sol=" + $scope.solDate;
            }
            else {
                $scope.date = "earth_date=" + moment($scope.dt).format("YYYY-D-M");
            }

<<<<<<< HEAD
=======
            if ($scope.camera != "camera=all") {
                $scope.camera = "&camera=" + $scope.camera;
            }
            else {
                $scope.camera = "";
            }

>>>>>>> one
            getPhotos();
            console.log($scope.photoList);
            if (angular.equals({}, $scope.photoList) || $scope.photoList.photos.length === 0) {
                $scope.isPictureViewHidden = true;
                $scope.pictureError = false;
            }
            else {
                $scope.isPictureViewHidden = false;
                $scope.pictureError = true;
            }
        };

        $scope.selectCamera = function(camera, isCamera) {
            if (isCamera) {
                $scope.camera = "&camera=" + camera;
            }
            else {
                $scope.camera = "";
            }
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
