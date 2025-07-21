angular.module("organiserProfileModule", []).controller("organiserProfileController", function($scope, $http){
    $scope.states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal"
    ];
    $scope.fxSaveData = function(){
        var url = "/organiser-profile-savedata";
        alert("ALERT::fxSaveData_ORG_PROFILE: " + JSON.stringify($scope.organiserData));
        
        $http.get(url).then(fxGood, fxBad);
        
        function fxGood(response){
            alert("ALERT::fxSaveData_ORG_PROFILE::INFO " + response);
        }
        function fxBad(err){
            alert("ALERT::fxSaveData_ORG_PROFILE::ERROR " + err.message);
        }
    }

    $scope.activeUserOrganiserEmail = localStorage.getItem("activeUser");
})