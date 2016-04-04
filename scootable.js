angular.module('scootable', [])

.controller('mainController', function($scope,$http) {
   $scope.sortType = 'id'; 
   $scope.sortReverse = 'false';

   $http.get('https://crossorigin.me/https://app.scoot.co/api/v1/scooters.json').
    success(function(data, status, headers, config) {
      $scope.scooters = data.scooters;
    })
  
});
