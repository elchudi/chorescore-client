
angular.module('user', ['ngResource'])

.factory('User', ['$resource', '$location', function($resource, $location){
    var urlApi = 'http://192.168.10.178:800/api/users/:userId';
    return $resource(urlApi, {}, { });
}])
   
 ;


