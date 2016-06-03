// Creates the queryCtrl Module and Controller Note that it depends on 'geolocation' and 'geservice' modules
var queryCtrl = angular.module('queryCtrl', ['geolocation','gservice']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice) {

    // Initialize variables
    $scope.formData = {};
    var queryBody = {};

    //Functions

    // Get user's actual coordinages based on HTML5 at window load
    geolocation.getLocation().then(function(data) {
        coords = {lat: data.coords.latitude, long: data.coords.longitude};

        // Set the latitude and longitude equal to HTML5 coordinates
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    });

    // Get coordinates based on mouse click. When a click event is detected...
    $rootScope.$on("clicked", function() {

        // Run the geservice functions associated with identifying coordinates
        $scope.$apply(function() {
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    // Take query parametes and incorporate into a JSON queryBody
    $scope.queryUsers = function() {

        // Assemble Query Body
        var queryBody = {
            longitude:      parseFloat($scope.formData.longitude),
            latitude:       parseFloat($scope.formData.latitude),
            distance:       parseFloat($scope.formData.distance),
            male:           $scope.formData.male,
            female:         $scope.formData.female,
            other:          $scope.formData.other,
            minAge:         $scope.formData.minage,
            maxAge:         $scope.formData.maxage,
            favlang:        $scope.formData.favlang,
            htmlverified:   $scope.formData.htmlverified,
        };

        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/query', queryBody)

            // Store the filtered results in queryResuts
            .success(function(queryResults) {

                // Query Body and Result log
                console.log('QueryBody', queryBody);
                console.log('QueryResults', queryResults);

                // Pass the filtered results to the Google Map Service and refresh the map
                gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

                // Count the number of records retrieved for the panel-footer
                $scope.queryCount = queryResults.length;
            })
            .error(function(err) {
                console.log('Erro ao realizar a consulta',err);
            });
    };
});
