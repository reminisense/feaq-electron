/**
 * Created by USER on 5/10/2016.
 */
var ipc = require('electron').ipcRenderer;
var app = angular.module('FeatherQ', []);
app.controller('loginController', function($scope, $http) {
    $scope.app_url = 'http://four.featherq.com';

    $scope.email = '';
    $scope.password = '';
    $scope.login_url = '';

    $scope.login = function () {
        $http.post($scope.app_url + '/user/email-login', {email: $scope.email, password: $scope.password})
            .success(function(response){
                if(response.success){
                    ipc.send('login-success');
                }
            });
    };
});