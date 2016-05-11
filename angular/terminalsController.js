/**
 * Created by USER on 5/11/2016.
 */

var ipc = require('electron').ipcRenderer;
var app = angular.module('FeatherQ', []);
app.controller('terminalsController', function($scope, $http) {
    $scope.app_url = 'http://localhost:8000';
    $scope.services = [];
    $scope.terminals = [];

    //to be changed
    $scope.user_id = 43;
    $scope.business_id = 168;


    $scope.getServices = function(){
        $http.get($scope.app_url + '/business/businessdetails/' + $scope.business_id).success(function(response){
            console.log(response);
            $scope.services = response.business.services;
            $scope.terminals = response.business.terminals;
        })
    };

    $scope.selectTerminal = function(){
        ipc.send('terminal-chosen');
    };

    $scope.isAssignedUser = function(user_id, terminal_id){
        terminals = $scope.terminals
        assigned = false;
        for(terminal in terminals){
            if(terminals[terminal].terminal_id == terminal_id){
                for(user in terminals[terminal].users){
                    if(terminals[terminal].users[user].user_id == user_id){
                        assigned = true;
                    }
                }
            }
        }
        return assigned;
    }

    $scope.getServices();

});