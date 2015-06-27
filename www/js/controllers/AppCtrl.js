/**
* ----------------------------------------------------
*           Diário Virtual 0.1
*         Desenvolvido por: Moboo
*-----------------------------------------------------
*/

angular.module('diariovirtual.controllers')
.controller('AppCtrl', function( $scope, $rootScope, $location, $state )
{
	/* if ( localStorage.hasOwnProperty("login") === true )
	{
		$state.go('app.home');
		//$scope.usuario = $rootScope.usuario;
	} else
		$location.path('/login'); */
	
	localStorage.login = true;
	localStorage.usuario = JSON.stringify({nome: 'Joseph F.', foto: '#', id: 3 });
	
	if ( localStorage.hasOwnProperty("login") === true )
	{
		$rootScope.usuario = JSON.parse( localStorage.usuario );
		$scope.usuario = JSON.parse( localStorage.usuario );
	}
})