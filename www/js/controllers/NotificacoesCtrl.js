angular.module('diariovirtual.controllers')
.controller('NotificacoesCtrl', function( $scope, $timeout, $rootScope, $http, $ionicLoading )
{
	$scope.notifications = [];
	
	$ionicLoading.show({
		template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
	});
	
	$timeout(function()
	{
		$http.post( URL_DIARIO + 'amigo/notifications', 
		{
			iduser: $rootScope.usuario.id
		}).then( function( result )
		{
			$ionicLoading.hide();
			var json = result.data;
			for ( var ind in json )
			{
				$scope.notifications.push( json[ind] );
			}
			$scope.$apply();
		});
	}, 3000);
});