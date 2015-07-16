angular.module('diariovirtual.controllers')
.controller('MensagensCtrl', function( $scope, $timeout, $rootScope, $http, $ionicLoading, $state )
{
	$scope.messages = [];
	$scope.URL_DIARIO = URL_DIARIO;
	
	$scope.verConversa = function( friend )
	{
		$state.go('app.chat', { id: friend.usuario.id, amigo: friend });
	}
	
	$ionicLoading.show({
		template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
	});
	
	$timeout(function()
	{
		$http.post( URL_DIARIO + 'mensagens/?cache=' + Math.random(), 
		{
			iduser: $rootScope.usuario.id
		}).then( function( result )
		{
			$ionicLoading.hide();
			var json = result.data;
			for ( var ind in json )
			{
				$scope.messages.push( json[ind] );
			}
			$scope.$apply();
		});
	}, 3000);
});