angular.module("AdminManageUsersModule", []).controller("AdminManageUsersController", function($scope, $http){

    // alert("hello");
    $scope.jsonUsersArray = [];

    $scope.fxFetchAllUsers = function() {
        const url = "/admin-fetch-users";

        $http.get(url).then(fxFetchedWell, fxFetchedBad);

        function fxFetchedWell(response) {
            $scope.jsonUsersArray = response.data;
            // alert(JSON.stringify($scope.jsonUsersArray));

            // removing the timestamp from the date and changing the format from YYYY-MM-DD to DD-MM-YYYY
            for (let i = 0; i < $scope.jsonUsersArray.length; i++) {
                const element = $scope.jsonUsersArray[i];

                element.dateOfSignup = moment(element.dateOfSignup.slice(0, 10)).format('Do MMMM, YYYY');
            }
        }
        function fxFetchedBad(err) {
            alert("[ERROR]::ADMIN::FETCH_ALL_USERS:" + JSON.stringify(err));
        }
    }
})