angular.module("AdminManageOrganisersModule", []).controller("AdminManageOrganisersController", function($scope, $http){

    // alert("hello");
    $scope.jsonOrganisersArray = [];

    $scope.fxFetchAllOrganisers = function() {
        const url = "/admin-fetch-organisers";

        $http.get(url).then(fxFetchedWell, fxFetchedBad);

        function fxFetchedWell(response) {
            $scope.jsonOrganisersArray = response.data;
        }
        function fxFetchedBad(err) {
            alert("[ERROR]::ADMIN::FETCH_ALL_ORGANISERS:" + JSON.stringify(err));
        }
    }
})