angular.module('diariovirtual.controllers')

.controller('ChatCtrl',
	function(
		$scope,
		$http,
		$rootScope,
		$ionicPopup,
		$ionicLoading,
		$state,
		$interval,
		$ionicSideMenuDelegate
	)
{
	$scope.amigos = [];
	$scope.URL_DIARIO = URL_DIARIO;
	var idusers = [];
	
	$scope.chatWith = function( friend )
	{
		$state.go('app.chat', { id: friend.usuario.id, amigo: friend });
		$ionicSideMenuDelegate.toggleRight();
	}
	
	if ( !$rootScope.offline )
	{
		$http.post( URL_DIARIO + 'amigo/amigos/?cache=' + Math.random(), 
		{
			iduser: $rootScope.usuario.id
		}).then( function( result )
		{
			$ionicLoading.hide();
			var json = result.data;
			if ( json.status == 'OK' )
			{
				for ( var ind in json.amigos )
				{
					json.amigos[ind].online = false;
					$scope.amigos.push( json.amigos[ind] );
					idusers.push( json.amigos[ind].usuario.id );
				}
				localStorage.amigos = JSON.stringify( $scope.amigos );
			} else
			{
				$ionicPopup.alert({
					title: 'Erro',
					template: 'Houve um erro ao buscar seus amigos, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
				});
			}
		});
	}
		
	$interval(function()
	{
		if ( !$rootScope.offline && idusers.length > 0 )
		{
			$http.post( URL_DIARIO + 'online/?cache=' + Math.random(), 
			{
				iduser: $rootScope.usuario.id,
				idusers: idusers
			}).then( function( result )
			{
				if ( result.data != 'ack' )
				{
					var json = result.data;
					if ( json.length )
					{
						for ( var ind in json )
						{
							for ( var ind2 in $scope.amigos )
							{
								if ( $scope.amigos[ind2].usuario.id == json[ind].iduser )
								{
									$scope.amigos[ind2].online = true;
									$scope.$apply();
								}
							}
						}
					}
				}
			});
		}
	}, 15000);
});