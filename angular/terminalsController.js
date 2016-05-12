/**
 * Created by USER on 5/11/2016.
 */

var ipc = require('electron').ipcRenderer;
var remote = require('electron').remote;

var app = angular.module('FeatherQ', []);
app.controller('terminalsController', function($scope, $http) {
    $scope.app_url = remote.getGlobal('urls').app_url;
    $scope.services = [];
    $scope.terminals = [];

    //to be changed
    $scope.user_id = remote.getGlobal('ids').user_id;
    $scope.business_id = remote.getGlobal('ids').business_id;


    $scope.getServices = function(){
        $http.get($scope.app_url + '/business/businessdetails/' + $scope.business_id).success(function(response){
            $scope.services = response.business.services;
            $scope.terminals = response.business.terminals;
        })
    };

    $scope.selectTerminal = function(service_id, terminal_id){
        remote.getGlobal('ids').service_id = service_id;
        remote.getGlobal('ids').terminal_id = terminal_id;
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