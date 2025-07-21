const module = angular.module("PlayerBrowseTournamentModule", []);
const controller = module.controller("PlayerBrowseTournamentController", function($scope, $http){

    fxDistinctSports();
    fxDistinctCities();
    
    // *****************************    FETCHING FILTERED EVENTS    *****************************
    $scope.fxFetchFilteredTournaments = function(){
        // alert("hello");
        // alert($scope.selectSportPlayerBrowse);
        // alert($scope.selectCityPlayerBrowse);
        const url = "/player-fetch-filtered-tournaments"
                    + "?sport=" + $scope.selectSportPlayerBrowse
                    + "&city=" + $scope.selectCityPlayerBrowse
                    + "&age=" + $scope.rangeAgePlayerBrowse;
        
        $http.get(url).then(fxFetchedWell, fxFetchedBad);
        
        function fxFetchedWell(response) {
            $scope.jsonArray = response.data;
            $scope.upcomingEvents = []; // re-initialising both scope arrays to flush previous ones
            $scope.pastEvents = [];
            
            // alert(JSON.stringify(response));
            // removing the timestamp from the date and changing the format from YYYY-MM-DD to DD-MM-YYYY
            // segregating tournaments based on if they are history or upcoming
            for (let i = 0; i < $scope.jsonArray.length; i++) {
                const element = $scope.jsonArray[i];

                element.dateOfEvent = element.dateOfEvent.slice(0, 10);
                element.lastDateOfRegistration = element.lastDateOfRegistration.slice(0, 10);
                
                //--------------------------------------------------------
                
                if(moment().isAfter(moment(element.dateOfEvent))) {
                    // alert("new element in pastEvents:\n" + JSON.stringify(element));
                    element.dateOfEvent = moment(element.dateOfEvent).format('Do MMMM, YYYY');
                    $scope.pastEvents.push(element);
                } else if(moment().isBefore(moment(element.dateOfEvent))) {
                    // alert("new element in upcomingEvents:\n" + JSON.stringify(element));
                    element.dateOfEvent = moment(element.dateOfEvent).format('Do MMMM, YYYY');
                    $scope.upcomingEvents.push(element);
                } else { alert("kuchh toh gadbad hai daya"); }
                
                element.lastDateOfRegistration = moment(element.lastDateOfRegistration).format('Do MMMM, YYYY');
            }
        }

        function fxFetchedBad(err) {
            alert(err.message);
        }
    }

    // *****************************    FETCHING DISTINCT FILTER OPTION ARRAYS    *****************************

    // SPORTS
    function fxDistinctSports () {
        // alert("hello");
        $scope.sportArray = [];

        const url = "/player-fetch-distinct-sports";

        $http.get(url).then(fxFetchedWell, fxFetchedBad);

        function fxFetchedWell(response) {
            $scope.sportArray = response.data;
        }

        function fxFetchedBad(err) {
            alert(err.message);
        }
    }

    // CITIES
    function fxDistinctCities () {
        // alert("hello");
        $scope.cityArray = [];

        const url = "/player-fetch-distinct-cities";

        $http.get(url).then(fxFetchedWell, fxFetchedBad);

        function fxFetchedWell(response) {
            $scope.cityArray = response.data;
        }

        function fxFetchedBad(err) {
            alert(err.message);
        }
    }

    // *****************************    MISC. FUNCTIONS    *****************************
    function fxResetFilters() {
        alert("hello");
        $scope.selectSportPlayerBrowse = $scope.selectSportPlayerBrowse[0];
        $scope.selectCityPlayerBrowse = $scope.selectCityPlayerBrowse[0];
        console.log($scope.selectSportPlayerBrowse);
        console.log($scope.selectSportPlayerBrowse[0]);
    }

    $scope.fxSetFilterAgeRange = function() {
        const url = "/player-fetch-min-max-ages";

        $http.get(url).then(fxFetchedWell, fxFetchedBad);
        function fxFetchedWell(response) {
            // alert(JSON.stringify(response));
            // alert(response.data[0].min);
            $scope.minAge = response.data[0].min;
            $scope.maxAge = response.data[0].max;
            $scope.rangeAgePlayerBrowse = response.data[0].min;
            $scope.outputAgePlayerBrowse = response.data[0].min;
        }

        function fxFetchedBad(err) {
            alert(err.message);
        }
    }

    $scope.setRangeOutput = function() {
        $scope.outputAgePlayerBrowse = $scope.rangeAgePlayerBrowse;
    }
})