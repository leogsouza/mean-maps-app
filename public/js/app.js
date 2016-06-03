// Declares the initial Angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('meanMapApp', ['addCtrl', 'geolocation', 'gservice', 'ngRoute'])

    // Configures Angular routing -- showing the relevant view and controller when needed
    .config(function($routeProvider) {

        // Join Team Control panel
        $routeProvider.when('/join', {
            controller: 'addCtrl',
            templateUrl: 'partials/addForm.html'
        }).when('/find', {
            templateUrl: 'partials/queryForm.html'
        }).otherwise({redirectTo: '/join'});
    });
