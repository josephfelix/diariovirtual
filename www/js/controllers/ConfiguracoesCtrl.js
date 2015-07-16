angular.module('diariovirtual.controllers')
.controller('ConfiguracoesCtrl', function( $scope, $timeout, $rootScope, $http, $ionicLoading, $location, $ionicPopup, $cordovaCamera )
{
	$scope.config = { nome: $rootScope.usuario.nome, senha: '', senha2: '', tipo: $rootScope.usuario.tipo, foto: $rootScope.usuario.foto };
	$scope.URL_DIARIO = URL_DIARIO;
	
	$scope.alterarFoto = function()
	{
		var fonte = [
            Camera.PictureSourceType.CAMERA,
            Camera.PictureSourceType.PHOTOLIBRARY
        ];
		
		var options = {
			'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
			'title': 'Selecione a origem da foto',
			'buttonLabels': ['Tirar foto agora (Câmera)', 'Buscar da galeria'],
			'androidEnableCancelButton' : true,
			'winphoneEnableCancelButton' : true,
			'addCancelButtonWithLabel': 'Cancelar',
			'position': [20, 40]
		};
		
		window.plugins.actionsheet.show(options, function( opc )
		{
			if ( opc != 3 )
			{
				$cordovaCamera.getPicture(
				{
					quality: 100, 
					destinationType: Camera.DestinationType.FILE_URI, 
					sourceType: fonte[opc-1],
					allowEdit: true,
					encodingType: 0, 
					mediaType: Camera.MediaType.PICTURE,
					correctOrientation: true,
					targetWidth: 150,
					targetHeight: 150
				}).then(function(imageFile)
				{
					$scope.config.foto = imageFile;
					$scope.$apply();
				}, function(err){});
			}
		});
	}
	
	$scope.salvarAlteracoes = function()
	{
		var params = { iduser: $rootScope.usuario.id };
		
		if ( !$scope.config.nome || !$scope.config.nome.length )
		{
			$ionicPopup.alert({
				title: 'Erro!',
				template: 'Insira um nome valido para continuar.'
			});
			return;
		}
		
		if ( $scope.config.senha || $scope.config.senha2 )
		{
			if ( $scope.config.senha != $scope.config.senha2 )
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'As senhas nao conferem, verifique antes de continuar.'
				});
				return;
			}
		}
		
		params.nome = $scope.config.nome;
		if ( $scope.config.senha.length > 0 )
			params.senha = $scope.config.senha;
		
		if ( $scope.config.foto == '#' || $scope.config.tipo == 'FACEBOOK' )
		{
			$http.post( URL_DIARIO + 'configuracoes/salvar/?cache=' + Math.random(), params )
			.then(function(response)
			{
				var json = response.data;
				if ( json.status == 'OK' )
				{
					$rootScope.usuario.nome = params.nome;
					localStorage.usuario = JSON.stringify( $rootScope.usuario );
					$rootScope.$apply();
					$ionicPopup.alert({
						title: 'Sucesso!',
						template: 'Configura&ccedil;&otilde;es alteradas com sucesso!'
					});
					$location.path('/app/home');
				} else
				{
					$ionicPopup.alert({
						title: 'Erro!',
						template: 'Erro ao alterar seus dados, tente novamente mais tarde.'
					});
				}
			});
		} else
		{
			var imagem = $scope.config.foto;
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = imagem.substr(imagem.lastIndexOf('/')+1);
			options.mimeType = "image/jpeg";
			options.params = params;
			
			$ionicLoading.show({
				template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Alterando foto...'
			});

			var ft = new FileTransfer();
			ft.upload( 
				imagem, 
				encodeURI( URL_DIARIO + 'configuracoes/salvar/?cache=' + Math.random() ), 
				function( result )
				{
					$ionicLoading.hide();
					var json = JSON.parse( result.response );
					if ( json.status == 'OK' )
					{
						$rootScope.usuario.nome = params.nome;
						$rootScope.usuario.foto = URL_DIARIO + 'upload/' + json.foto;
						$rootScope.$apply();
						localStorage.usuario = JSON.stringify( $rootScope.usuario );
						$ionicPopup.alert({
							title: 'Sucesso',
							template: 'Configura&ccedil;&otilde;es alteradas com sucesso!'
						});
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Houve um erro ao salvar, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
						});
					}
				}, 
				function(e)
				{
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Erro',
						template: 'Houve um erro ao salvar, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
					});
				}, options);
		}
	}
	
	$scope.excluirConta = function()
	{
		navigator.notification.confirm("Tem certeza que deseja excluir sua conta? Ao excluir todos os seus dados serão perdidos e sua conta não poderá ser recuperada.", 
		function( conf )
		{
			if ( conf == 2 )
			{
				$ionicLoading.show({
					template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Excluindo conta...'
				});
				$timeout(function()
				{
					$http.post( URL_DIARIO + 'configuracoes/excluir',
					{
						iduser: $rootScope.usuario.id
					}).then(function(response)
					{
						$ionicLoading.hide();
						var json = response.data;
						if ( json.status == 'OK' )
						{
							$ionicPopup.alert({
								title: 'Sucesso!',
								template: 'Usuario excluido com sucesso, pressione OK para continuar.'
							});
							localStorage.removeItem('login');
							localStorage.removeItem('usuario');
							$rootScope.usuario = false;
							$location.path('/login');
						} else
						{
							$ionicPopup.alert({
								title: 'Erro!',
								template: 'Houve um erro ao tentar excluir seu usuario, tente novamente mais tarde.'
							});
						}
					});
				}, 3000);
			}
		}, "Excluir conta", ["Cancelar", "Excluir"]);
	}
});