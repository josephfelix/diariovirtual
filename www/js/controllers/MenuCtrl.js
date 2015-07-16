angular.module('diariovirtual.controllers')
.controller('MenuCtrl', function( $scope, $ionicPopup, $rootScope, $location, $state, $ionicSideMenuDelegate )
{
	$scope.usuario = $rootScope.usuario;
	if ( !$rootScope.usuario.facebook )
		$scope.usuario.foto = URL_DIARIO + 'upload/' + $scope.usuario.foto;
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
				$location.path('/login');
			}
		});
    }
});