angular.module('diariovirtual.controllers')

.controller('SolicitacoesCtrl',
	function(
		$scope,
		$http,
		$location,
		$rootScope, 
		$timeout, 
		$ionicPopup,
		$ionicLoading
	)
{
	$scope.pendentes = [];
	$scope.URL_DIARIO = URL_DIARIO;
	
	if ( localStorage.pendentes )
		$scope.pendentes = JSON.parse( localStorage.pendentes );
		
	$scope.aceitar = function( amigo )
	{
		$http.post( URL_DIARIO + 'amigo/aceitar/?cache=' + Math.random(), 
		{
			iduser: $rootScope.usuario.id,
			idfriend: amigo.usuario.id
		}).then( function( result )
		{
			var json = result.data;
			if ( json.status == 'OK' )
			{
				$scope.pendentes.splice( $scope.pendentes.indexOf( amigo ), 1 );
				localStorage.pendentes = false;
			} else
			{
				$ionicPopup.alert({
					title: 'Erro',
					template: 'Houve um erro ao aceitar a solicitacao de ' + amigo.usuario.nome + ', cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
				});
			}
		});
	}
	
	$scope.rejeitar = function( amigo )
	{
		$http.post( URL_DIARIO + 'amigo/recusar/?cache=' + Math.random(), 
		{
			iduser: $rootScope.usuario.id,
			idfriend: amigo.usuario.id
		}).then( function( result )
		{
			var json = result.data;
			if ( json.status == 'OK' )
			{
				$scope.pendentes.splice( $scope.pendentes.indexOf( amigo ), 1 );
				localStorage.pendentes = false;
			} else
			{
				$ionicPopup.alert({
					title: 'Erro',
					template: 'Houve um erro ao recusar a solicitacao de ' + amigo.usuario.nome + ', cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
				});
			}
		});
	}
	
	$scope.doRefresh = function()
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
		});
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'amigo/pendentes/?cache=' + Math.random(), 
			{
				iduser: $rootScope.usuario.id
			}).then( function( result )
			{
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
				var json = result.data;
				if ( json.status == 'OK' )
				{
					$scope.pendentes = [];
					for ( var ind in json.pendentes )
					{
						$scope.pendentes.push( json.pendentes[ind] );
					}
					localStorage.pendentes = JSON.stringify( $scope.pendentes );
				} else
				{
					$ionicPopup.alert({
						title: 'Erro',
						template: 'Houve um erro ao buscar suas solicitacoes, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
					});
				}
			});
		}, 3000);
	}
	
	if ( !$scope.pendentes.length )
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
		});
		
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'amigo/pendentes/?cache=' + Math.random(), 
			{
				iduser: $rootScope.usuario.id
			}).then( function( result )
			{
				$ionicLoading.hide();
				var json = result.data;
				if ( json.status == 'OK' )
				{
					for ( var ind in json.pendentes )
					{
						$scope.pendentes.push( json.pendentes[ind] );
					}
					localStorage.pendentes = JSON.stringify( $scope.pendentes );
				} else
				{
					$ionicPopup.alert({
						title: 'Erro',
						template: 'Houve um erro ao buscar suas solicitacoes, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
					});
				}
			});
		}, 3000);
	}
});