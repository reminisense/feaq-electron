/**
 * Created by USER on 5/10/2016.
 */

var ipc = require('electron').ipcRenderer;
var remote = require('electron').remote;

var app = angular.module('FeatherQ', []);
app.controller('queueController', function($scope, $http){
    $scope.app_url = remote.getGlobal('urls').app_url;
    $scope.websocket_url = remote.getGlobal('urls').websocket_url;
    $scope.websocket = new WebSocket($scope.websocket_url);

    $scope.business_id = remote.getGlobal('ids').business_id;
    $scope.service_id = remote.getGlobal('ids').service_id;
    $scope.terminal_id = remote.getGlobal('ids').terminal_id;

    $scope.current_number = null;
    $scope.next_number = null;
    $scope.numbers_in_line = null;
    $scope.called = false;
    $scope.rating = 3;

    $scope.callPressed = function(){
        if($scope.current_number){
            $scope.call();
        }else{
            $scope.issueAndCall();
        }
    };

    $scope.issueAndCall = function(){
        $http.post($scope.app_url + '/issuenumber/insertspecific/' + $scope.service_id + '/' + $scope.terminal_id, {priority_number : $scope.next_number})
            .success(function(response){
                $scope.current_number = response.number;
                $scope.call();
            });
    };

    $scope.call = function(){
        $http.get($scope.app_url + '/processqueue/callnumber/' + $scope.current_number.transaction_number + '/' + $scope.terminal_id)
            .success(function(response){
                $scope.updateBroadcast();
            });
    };

    $scope.drop = function(){
        $http.get($scope.app_url + '/processqueue/dropnumber/' + $scope.current_number.transaction_number)
            .success(function(response){
                $scope.updateBroadcast();
                $http.get($scope.app_url + '/rating/userratings/'+ 0 + '/' + $scope.current_number.email + '/' + $scope.terminal_id + '/' + 3 + '/' + $scope.current_number.transaction_number);
                $scope.rating = 3;
            });
    };

    $scope.done = function(){
        $http.get($scope.app_url + '/processqueue/servenumber/' + $scope.current_number.transaction_number)
            .success(function(response){
                $scope.updateBroadcast();
                $http.get($scope.app_url + '/rating/userratings/'+ $scope.rating + '/' + $scope.current_number.email + '/' + $scope.terminal_id + '/' + 3 + '/' + $scope.current_number.transaction_number);
                $scope.rating = 3;
            });
    };

    $scope.next = function(){
        $http.get($scope.app_url + '/processqueue/servenumber/' + $scope.current_number.transaction_number)
            .success(function(response){
                $http.get($scope.app_url + '/rating/userratings/'+ $scope.rating + '/' + $scope.current_number.email + '/' + $scope.terminal_id + '/' + 3 + '/' + $scope.current_number.transaction_number);
                $scope.rating = 3;
                $http.get($scope.app_url + '/processqueue/allnumbers/' + $scope.service_id + '/' + $scope.terminal_id)
                    .success(function(response){
                        $scope.current_number = response.numbers.unprocessed_numbers[0];
                        $scope.next_number = response.numbers.next_number;
                        $scope.callPressed();
                    });
            });
    }

    $scope.getNextNumber = function(){
        $http.get($scope.app_url + '/processqueue/allnumbers/' + $scope.service_id + '/' + $scope.terminal_id)
            .success(function(response){
                $scope.current_number = response.numbers.unprocessed_numbers[0];
                $scope.called = $scope.current_number && $scope.current_number.time_called ? true : false;
                $scope.next_number = response.numbers.next_number;
                $scope.numbers_in_line = response.numbers.uncalled_numbers.length + response.numbers.timebound_numbers.length;
            });
    };

    $scope.updateBroadcast = function(){
        $http.get($scope.app_url + '/processqueue/update-broadcast/' + $scope.business_id)
            .success(function(response){
                $scope.sendWebsocket();
            });
    }

    $scope.websocket.onopen = function(response) { // connection is open
        $scope.getNextNumber();
    }
    $scope.websocket.onmessage = function(response){
        $scope.getNextNumber();
    }



    $scope.sendWebsocket = function(){
        $scope.websocket.send(JSON.stringify({
            business_id : $scope.business_id,
            broadcast_update : true,
            broadcast_reload: false
        }));
    };

    ////for testing
    //setInterval(function(){
    //    $scope.getNextNumber();
    //}, 2000);
});