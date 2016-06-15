/**
 * Created by USER on 5/10/2016.
 */
var ipc = require('electron').ipcRenderer;
var remote = require('electron').remote;
var fs = require('fs');

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
            var fileData = null;
            fs.readFile('app/settings.json', 'utf-8', function(err, fileContent){
                if(fileContent != undefined){
                    fileData =  JSON.parse(fileContent);
                    remote.getGlobal('ids').user_id = response.user_id;
                    remote.getGlobal('ids').business_id = fileData.business_id;
                    $scope.businesses = response.businesses;
                    $scope.selectBusiness(fileData.business_id);
                    $scope.loading = false;
                }else if(remote.getGlobal('ids').business_id !== null){
                    remote.getGlobal('ids').user_id = response.user_id;
                    $scope.businesses = response.businesses;
                    $scope.selectBusiness(remote.getGlobal('ids').business_id);
                    $scope.loading = false;
                }else if(response.user_id){
                    remote.getGlobal('ids').user_id = response.user_id;
                    $scope.user_id = response.user_id;
                    $scope.businesses = response.businesses;
                    $scope.loading = false;
                }
            });
        }).error(function(response){
            if(response.error.message){
                alert(response.error.message);
                $scope.loading = false;
            }
        });
    };

    $scope.selectBusiness = function (business_id){
        remote.getGlobal('ids').business_id = business_id;

        //get Business Name
        for(var business_index in $scope.businesses){
            if($scope.businesses[business_index].business_id == business_id){
                remote.getGlobal('names').business_name = $scope.businesses[business_index].name;
            }
        }
        alert(remote.getGlobal('names').business_name);
        ipc.send('login-success');
    };
});