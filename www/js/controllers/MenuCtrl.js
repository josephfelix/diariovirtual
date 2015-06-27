angular.module('diariovirtual.controllers')
.controller('MenuCtrl', function( $scope, $ionicPopup, $rootScope, $location )
{
	try{
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
				localStorage.removeItem('login');
				localStorage.removeItem('usuario');
				$rootScope.usuario = false;
				$location.path('/login');
			}
		});
    }
	}catch(er){alert(er);}
});