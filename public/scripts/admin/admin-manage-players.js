angular.module("AdminManagePlayersModule", []).controller("AdminManagePlayersController", function($scope, $http){

    // alert("hello");
    $scope.jsonPlayersArray = [];

    $scope.fxFetchAllPlayers = function() {
        const url = "/admin-fetch-players";

        $http.get(url).then(fxFetchedWell, fxFetchedBad);

        function fxFetchedWell(response) {
            $scope.jsonPlayersArray = response.data;
            // alert(JSON.stringify($scope.jsonPlayersArray));
        }
        function fxFetchedBad(err) {
            alert("[ERROR]::ADMIN::FETCH_ALL_PLAYERS:" + JSON.stringify(err));
        }
    }
})