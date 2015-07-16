angular.module('diariovirtual.controllers')
.controller('NotificacoesCtrl', function( $scope, $timeout, $rootScope, $http, $ionicLoading )
{
	$scope.notifications = [];
	$scope.$apply();
	
	$scope.doRefresh = function()
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
		});
		
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'amigo/notifications/?cache=' + Math.random(), 
			{
				iduser: $rootScope.usuario.id
			}).then( function( result )
			{
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
				var json = result.data;
				$scope.notifications = [];
				for ( var ind in json )
				{
					$scope.notifications.push( json[ind] );
				}
				$scope.$apply();
			});
		}, 3000);
	}
	
	if ( !$rootScope.notifications || !$rootScope.notifications.length )
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
		});
		
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'amigo/notifications/?cache=' + Math.random(), 
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
				$rootScope.notifications = $scope.notifications;
				$scope.$apply();
			});
		}, 3000);
	} else
		$scope.notifications = $rootScope.notifications;
});