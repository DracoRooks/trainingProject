angular.module("OrganizerTournamentHistoryModule", []).controller("OrganizerTournamentHistoryController", function($scope, $http){
    $scope.jsonArray = [];

    $scope.fxFetchAllTournaments = function() {
        var url = "/organiser-fetch-all-tournaments?";

        $http.get(url).then(fxFetchedWell, fxFetchedBad);

        function fxFetchedWell(response) {
            // alert(JSON.stringify(response));
            // alert("fetched well");

            $scope.jsonArray = response.data;
            $scope.upcomingEvents = [];
            $scope.pastEvents = [];
            
            // removing the timestamp from the date and changing the format from YYYY-MM-DD to DD-MM-YYYY
            // segregating tournaments based on if they are history or upcoming
            for (let i = 0; i < $scope.jsonArray.length; i++) {
                const element = $scope.jsonArray[i];

                element.dateOfEvent = element.dateOfEvent.slice(0, 10);
                element.lastDateOfRegistration = element.lastDateOfRegistration.slice(0, 10);
                
                //--------------------------------------------------------
                
                if(moment().isBefore(moment(element.dateOfEvent)) || moment().isSame(moment(element.dateOfEvent))) {
                    element.dateOfEvent = moment(element.dateOfEvent).format('Do MMMM, YYYY');
                    $scope.upcomingEvents.push(element);
                    // alert("new element in upcomingEvents: " + JSON.stringify($scope.upcomingEvents));
                } else if(moment().isAfter(moment(element.dateOfEvent))) {
                    $scope.pastEvents.push(element);
                    element.dateOfEvent = moment(element.dateOfEvent).format('Do MMMM, YYYY');
                    // alert("new element in pastEvents: " + JSON.stringify($scope.pastEvents));
                } else { alert("kuchh toh gadbad hai daya"); }
                
                element.lastDateOfRegistration = moment(element.lastDateOfRegistration).format('Do MMMM, YYYY');
            }
        }

        function fxFetchedBad(err) {
            alert(err.message);
        }
    }
})