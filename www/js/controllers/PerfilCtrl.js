angular.module('diariovirtual.controllers')

.controller('PerfilCtrl',
	function(
		$scope,
		$http,
		$location,
		$rootScope, 
		$timeout, 
		$ionicPopup,
		$ionicLoading,
		$stateParams,
		$ionicModal,
		$cordovaSocialSharing
	)
{
	var postLikes;
	
	if ( localStorage.postLikes )
	{
		postLikes = JSON.parse( localStorage.postLikes );
	} else
	{
		localStorage.postLikes = '[]';
		postLikes = [];
	}
		
	$scope.usuario = {};
	$scope.atts = [];
	$scope.URL_DIARIO = URL_DIARIO;
	
	if ( $rootScope.offline )
	{
		$ionicPopup.alert({
			title: 'Erro',
			template: '&Eacute; necess&aacute;rio conex&atilde;o com a internet para visualizar este perfil!'
		});
		$location.path('/app/home');
		return;
	}
	
	$scope.comment = function( att )
	{
		$state.go('app.comment', {id: att.idatt});
	}
	
	$scope.aceitar = function( amigo )
	{
		$http.post( URL_DIARIO + 'amigo/aceitar/?cache=' + Math.random(), 
		{
			iduser: $rootScope.usuario.id,
			idfriend: amigo.id
		}).then( function( result )
		{
			var json = result.data;
			if ( json.status == 'OK' )
			{
				$scope.usuario.amigo = 2;
				localStorage.pendentes = false;
			} else
			{
				$ionicPopup.alert({
					title: 'Erro',
					template: 'Houve um erro ao aceitar a solicitacao de ' + amigo.nome + ', cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
				});
			}
		});
	}
	
	$scope.rejeitar = function( amigo )
	{
		$ionicPopup.confirm(
		{
			title: 'Recusar amigo',
			template: 'Tem certeza que deseja recusar a solicita&ccedil;&atilde;o de amizade de ' + amigo.nome + '?'
		})
		.then(function(res)
		{
		   if ( res )
		   {
				$http.post( URL_DIARIO + 'amigo/recusar/?cache=' + Math.random(), 
				{
					iduser: $rootScope.usuario.id,
					idfriend: amigo.id
				}).then( function( result )
				{
					var json = result.data;
					if ( json.status == 'OK' )
					{
						$scope.usuario.amigo = 1;
						localStorage.pendentes = false;
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Houve um erro ao recusar a solicitacao de ' + amigo.nome + ', cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
						});
					}
				});
			}
		});
	}
	
	$scope.verFacebook = function( friend )
	{
		navigator.app.loadUrl('http://www.facebook.com/profile.php?id=' + friend.fbid, { openExternal:true });
	}
	
	$scope.openPhoto = function( filename )
	{
		$scope.nome_usuario = $rootScope.usuario.nome;
		$scope.foto_atual = URL_DIARIO + 'upload/' + filename;
		
		$ionicModal.fromTemplateUrl('abrir_foto.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	}

	$scope.like = function( post )
	{
		if ( postLikes.indexOf( post ) == -1 )
		{
			post.likes++;
			postLikes.push(post);
			$http.post( URL_DIARIO + 'like/?cache=' + Math.random(),
			{
				idpost: post.idatt,
				iduser: post.iduser
			})
			.then(function(response)
			{
				var json = response.data;
				if ( json.status == 'FAIL' )
				{
					post.likes--;
				} else
				{
					localStorage.postLikes = JSON.stringify( postLikes );
				}
			});
		}
	}
	
	$scope.share = function( post )
	{
		var options = {
			'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
			'title': 'Compartilhar em',
			'buttonLabels': ['Whatsapp', 'Twitter'],
			'androidEnableCancelButton' : true,
			'winphoneEnableCancelButton' : true,
			'addCancelButtonWithLabel': 'Cancelar',
			'position': [20, 40]
		};
		var message = post.texto;
		var link = '';
		var image = post.fotos[0];
		
		window.plugins.actionsheet.show(options, function( opc )
		{
			switch ( opc )
			{
				case 1:
				  $cordovaSocialSharing
					.shareViaWhatsApp(message, image, link)
					.then(function(result) {
					}, function(err) {
					});
				break;
				case 2:
					$cordovaSocialSharing
					.shareViaTwitter(message, image, link)
					.then(function(result) {
					}, function(err) {
					});
				break;
			}
		});
	}
	
	$scope.adicionarAmigo = function( friend )
	{
		$ionicPopup.confirm(
		{
			title: 'Adicionar amigo',
			template: 'Tem certeza que deseja adicionar ' + friend.nome + ' na sua lista de amigos?'
		})
		.then(function(res)
		{
			if ( res )
			{
				$ionicLoading.show({
					template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Adicionando amigo...'
				});
				$http.post( URL_DIARIO + 'amigo/add', 
				{
					iduser: $rootScope.usuario.id,
					idfriend: friend.id
				}).then( function( result )
				{
					$ionicLoading.hide();
					var json = result.data;
					if ( json.status == 'OK' )
					{
						$scope.usuario.amigo = true;
						$ionicPopup.alert({
							title: 'Sucesso',
							template: 'Agora voc&eacute; e ' + friend.nome + ' s&atilde;o amigos!'
						});
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Houve um erro ao adicionar ' + friend.nome + ', cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
						});
					}
				});
			}
		});
	}
	
	$scope.excluirAmigo = function( friend )
	{
		$ionicPopup.confirm(
		{
			title: 'Remover amigo',
			template: 'Tem certeza que deseja excluir ' + friend.nome + ' de sua lista de amigos?'
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
					idfriend: friend.id
				}).then( function( result )
				{
					$ionicLoading.hide();
					var json = result.data;
					if ( json.status == 'OK' )
					{
						$scope.usuario.amigo = false;
						localStorage.amigos = false;
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Houve um erro ao excluir ' + friend.nome + ', cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
						});
					}
				});
		   } 
		});
	}
	
	if ( $stateParams.id )
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c"></i>&nbsp;Carregando...'
		});
		
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'perfil/?cache=' + Math.random(), 
			{
				iduser: $stateParams.id,
				myid: $rootScope.usuario.id
			}).then( function( result )
			{
				$ionicLoading.hide();
				var json = result.data;
				if ( json.status == 'OK' )
				{
					$scope.usuario = json.usuario;
					$scope.atts = json.atts.reverse();
				}
			});
		});
	} else
		$location.path('/app/home');
});