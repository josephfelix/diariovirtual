angular.module('diariovirtual.controllers')
.controller('MenuCtrl', function( $scope, $ionicPopup, $rootScope, $location, $state, $ionicSideMenuDelegate )
{
	$scope.usuario = $rootScope.usuario;
	$scope.URL_DIARIO = URL_DIARIO;
	
	$scope.verPerfil = function( usuario )
	{
		$state.go('app.perfil', {id: usuario.id});
		$ionicSideMenuDelegate.toggleLeft();
	}
	$scope.logout = function()
	{
		$ionicPopup.confirm(
		{
			title: 'Aviso',
			template: 'Tem certeza que deseja sair do Diario Virtual?'
		})
		.then(function(res)
		{
			if ( res )
			{
				localStorage.clear();
				$rootScope.usuario = false;
				$rootScope.$apply();
				$location.path('/login');
			}
		});
    }
});