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
    var amigosSelecionados = [];
    
    $scope.adicionarAmigo = function( friend )
	{
		alert( JSON.stringify( friend ) );
        amigosSelecionados.push( friend );
    }
    
    $scope.envia = function()
	{
		alert(amigosSelecionados.length + " amigos selecionados");
        /* $scope.arg = {};
        $scope.arg.func = "AMIGOSFB";
        $scope.arg.conta = $scope.username;
        $scope.arg.amigos = $scope.amigosselecionados;
        $location.path ("/app/home"); */
    }
});