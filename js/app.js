'use strict';

angular.module('naanalkart', ['ngRoute','ui.bootstrap','ngFileUpload'])
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginController'
		})
		.when('/about', {
			templateUrl: 'partials/about.html',
			controller: 'AboutController'
		})
		.when('/orders', {
			templateUrl: 'partials/order-list.html',
			controller: 'OrderListController'
		})
		.when('/post/:postId', {
			templateUrl: 'partials/post-detail.html',
			controller: 'PostDetailController'
		})
		.when('/add', {
			templateUrl: 'partials/post-create.html',
			controller: 'PostCreateController'
		})
		.otherwise({
			redirectTo: '/login'
		});

		
	}])
    .directive('expand', function () {
            return {
                restrict: 'A',
                controller: ['$scope', function ($scope) {
                    $scope.$on('onExpandAll', function (event, args) {
                        $scope.expanded = args.expanded;
                    });
                }]
            };
    })
;