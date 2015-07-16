angular.module('diariovirtual.controllers')
.controller('AppCtrl', function( $scope, $rootScope, $location, $state )
{
	/* if ( localStorage.hasOwnProperty("login") === true )
	{
		$state.go('app.home');
		//$scope.usuario = $rootScope.usuario;
	} else
		$location.path('/login'); */
	if ( !ionic.Platform.isAndroid() )
	{
		localStorage.login = true;
		localStorage.usuario = JSON.stringify({nome: 'Joseph F.', foto: '#', id: 4 });
	}
	
	if ( localStorage.hasOwnProperty("login") === true )
	{
		$rootScope.usuario = JSON.parse( localStorage.usuario );
		$scope.usuario = JSON.parse( localStorage.usuario );
	}
	
	$rootScope.offline = false;
	document.addEventListener("offline", function()
	{
		$rootScope.offline = true;
	}, false);
})