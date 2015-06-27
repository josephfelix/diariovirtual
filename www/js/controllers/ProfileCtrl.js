angular.module('diariovirtual.controllers')

.controller("ProfileCtrl", 
	function(
		$scope,
		$http,
		$location,
		$rootScope, 
		$ionicPopup,
		$ionicLoading
	)
{        
    $scope.init = function() {
        $scope.amigosselecionados = [];
    };
    
    $scope.adicionarAmigo = function( friend )
	{
		alert( JSON.stringify( friend ) );
        //$scope.amigosselecionados.push( friend );
    };
    
    $scope.envia = function () {
        $scope.arg = {};
        $scope.arg.func = "AMIGOSFB";
        $scope.arg.conta = $scope.username;
        $scope.arg.amigos = $scope.amigosselecionados;
        var ret = sendserver ( $scope.arg );

        $location.path ("/app/home");
    };       

    function sendserver (args) {
        navigator.notification.alert (JSON.stringify(args, null, 4));
        return true;
    }

})