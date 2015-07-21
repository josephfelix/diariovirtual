angular.module('diariovirtual.controllers')

.controller('CommentsCtrl',
	function(
		$scope,
		$http,
		$location,
		$rootScope, 
		$timeout, 
		$ionicPopup,
		$ionicLoading,
		$stateParams,
		$state
	)
{
	$scope.post = {};
	$scope.URL_DIARIO = URL_DIARIO;
	$scope.usuario = $rootScope.usuario;
	$scope.comments = [];
	
	$scope.doRefresh = function()
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
		});
		$http.post( URL_DIARIO + 'comments/get/?cache=' + Math.random(), 
		{
			idatt: $stateParams.id
		}).then( function( result )
		{
			$ionicLoading.hide();
			var json = result.data;
			if ( json.status == 'OK' )
			{
				$scope.post = json.post;
				for ( var ind in json.post.comments.comments )
				{
					$scope.comments.push(json.post.comments.comments[ind]);
				}
			}
		});
	}
	
	$scope.apagarComentario = function( comment )
	{
		if ( comment.usuario.id == $rootScope.usuario.id )
		{
			$ionicPopup.confirm(
			{
				title: 'Remover coment&aacute;rio',
				template: 'Tem certeza que deseja remover este coment&aacute;rio?'
			})
			.then(function(res)
			{
			   if ( res )
			   {
					if ( !$rootScope.offline )
					{
						$http.post( URL_DIARIO + 'comments/delete/?cache=' + Math.random(), 
						{
							idcomment: comment.idcomment
						}).then( function( result )
						{
							var json = result.data;
							if ( json.status == 'OK' )
							{
								if ( $scope.post.comments.total > 0 )
									$scope.post.comments.total--;
								$scope.comments.splice( $scope.comments.indexOf( comment ), 1 );
							} else
								$ionicPopup.alert({
									title: 'Erro',
									template: 'Ocorreu um erro ao tentar apagar este coment&aacute;rio. Por favor, tente novamente mais tarde!'
								});
						});
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: '&Eacute; necess&aacute;rio conex&atilde;o com a internet para apagar este coment&aacute;rio!'
						});
					}
				} 
			});
		}
	}
	
	$scope.verPerfil = function( id )
	{
		$state.go('app.perfil', {id: id});
	}
	
	$scope.enviarComentario = function( comentario )
	{
		if ( !$rootScope.offline )
		{
			$ionicLoading.show({
				template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
			});
			if ( $scope.comentario.length )
			{
				$http.post( URL_DIARIO + 'comments/post/?cache=' + Math.random(), 
				{
					idatt: $stateParams.id,
					iduser: $rootScope.usuario.id,
					comentario: $scope.comentario
				}).then( function( result )
				{
					$ionicLoading.hide();
					var json = result.data;
					if ( json.status == 'OK' )
					{
						$scope.comentario = '';
						$scope.comments.push( json.post );
						$scope.post.comments.total++;
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Ocorreu um erro ao comentar esta publica&ccedil;&atilde;o, por favor, tente novamente mais tarde!'
						});
					}
				});
			}
		} else
		{
			$ionicPopup.alert({
				title: 'Erro',
				template: '&Eacute; necess&aacute;rio conex&atilde;o com a internet para comentar esta publica&ccedil;&atilde;o!'
			});
		}
	}
	
	$ionicLoading.show({
		template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
	});
	$http.post( URL_DIARIO + 'comments/get/?cache=' + Math.random(), 
	{
		idatt: $stateParams.id
	}).then( function( result )
	{
		$ionicLoading.hide();
		var json = result.data;
		if ( json.status == 'OK' )
		{
			$scope.post = json.post;
			for ( var ind in json.post.comments.comments )
			{
				$scope.comments.push(json.post.comments.comments[ind]);
			}
		}
	});
});