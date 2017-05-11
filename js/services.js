'use strict';

angular.module('naanalkart')
	.factory('OrderService', function($http) {
         function errFunction(response) {
            console.log(response.status,response.statusText,response.headers);
        }
		 var obj = {};
         obj.getOrders = function(){
            return $http({
                method: "GET",
                url: 'http://localhost:3000/orders'
            }).then(function(response) { 
                return response.data;
            }, function errorCallback(response) {
                errFunction(response);
            });
        }
        
        return obj;
	});