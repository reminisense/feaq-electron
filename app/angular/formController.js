/**
 * Created by USER on 8/1/2016.
 */
var ipc = require('electron').ipcRenderer;
var remote = require('electron').remote;

var app = angular.module('FeatherQ', []);
app.controller('formController', function($scope, $http){
    $scope.current_number = remote.getGlobal('priorityNumbers').current_number;
    console.log($scope.current_number);
});
