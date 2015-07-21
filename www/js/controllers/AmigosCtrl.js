angular.module('diariovirtual.controllers')

.controller('AmigosCtrl',
	function(
		$scope,
		$http,
		$location,
		$rootScope, 
		$timeout, 
		$ionicPopup,
		$ionicLoading,
		$state
	)
{
	$scope.amigos = [];
	$scope.URL_DIARIO = URL_DIARIO;
	
	if ( localStorage.amigos )
		$scope.amigos = JSON.parse( localStorage.amigos );
	
	$scope.unfriend = function( friend )
	{
		$ionicPopup.confirm(
		{
			title: 'Remover amigo',
			template: 'Tem certeza que deseja excluir ' + friend.usuario.nome + ' de sua lista de amigos?'
		})
		.then(function(res)
		{
		   if ( res )
		   {
				$ionicLoading.show({
					template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Removendo amigo...'
				});
				$http.post( URL_DIARIO + 'amigo/unfriend', 
				{
					iduser: $rootScope.usuario.id,
					idfriend: friend.usuario.id
				}).then( function( result )
				{
					$ionicLoading.hide();
					var json = result.data;
					if ( json.status == 'OK' )
					{
						$scope.amigos.splice( $scope.amigos.indexOf( friend ), 1 );
						localStorage.amigos = JSON.stringify( $scope.amigos );
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Houve um erro ao excluir ' + friend.usuario.nome + ', cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
						});
					}
				});
		   } 
		});
	}
	
	$scope.verPerfil = function( id )
	{
		$state.go('app.perfil', {id: id});
	}
	
	$scope.doRefresh = function()
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
		});
		
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'amigo/amigos', 
			{
				iduser: $rootScope.usuario.id
			}).then( function( result )
			{
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
				var json = result.data;
				if ( json.status == 'OK' )
				{
					$scope.amigos = [];
					for ( var ind in json.amigos )
					{
						$scope.amigos.push( json.amigos[ind] );
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
		}, 3000);
	}
	
	if ( !$scope.amigos.length )
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
		});
		
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'amigo/amigos', 
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
						$scope.amigos.push( json.amigos[ind] );
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
		}, 3000);
	}
});