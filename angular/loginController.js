/**
 * Created by USER on 5/10/2016.
 */
var ipc = require('electron').ipcRenderer;
var remote = require('electron').remote;

var app = angular.module('FeatherQ', []);
app.controller('loginController', function($scope, $http) {
    $scope.app_url = remote.getGlobal('urls').app_url;
    $scope.user_id = remote.getGlobal('ids').user_id;
    $scope.loading = false;

    $scope.businesses = [];
    $scope.selected_business = 0;

    $scope.email = '';
    $scope.password = '';
    $scope.login_url = '';

    $scope.login = function () {
        $scope.loading = true;
        $http.post($scope.app_url + '/user/email-login', {email: $scope.email, password: $scope.password})
            .success(function(response){
                $scope.loading = false;
                if(response.success){
                    $scope.getAssignedBusinesses();
                }else{
                    alert('Fail');
                }
            }).error(function(response){
                alert(response.error);
            });
    };

    $scope.getAssignedBusinesses = function () {
        $scope.loading = true;
        $http.get($scope.app_url + '/business/assigned-businesses').success(function(response){
            if(response.user_id){
                remote.getGlobal('ids').user_id = response.user_id;
                $scope.user_id = response.user_id;
                $scope.businesses = response.businesses;
                $scope.loading = false;
            }
        }).error(function(response){
            if(response.error.message){
                alert(response.error.message);
                $scope.loading = false;
            }
        });
    };

    $scope.selectBusiness = function (business_id){
        remote.getGlobal('ids').business_id = business_id;
        ipc.send('login-success');
    };
});