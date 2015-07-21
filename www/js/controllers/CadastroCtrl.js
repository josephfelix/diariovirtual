var dadosEnviar = {};
angular.module('diariovirtual.controllers')

.controller('CadastroCtrl', function(
		$scope, 
		$http, 
		$location, 
		$ionicActionSheet, 
		$ionicPopup, 
		$rootScope,
		$ionicLoading,
		$cordovaCamera
	)
	{
		$scope.escolheufoto = false;
		$scope.fotoUsuario = '#';
		var exclude = /[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
		var check = /@[\w\-]+\./;
		var checkend = /\.[a-zA-Z]{2,3}$/;
		
		$scope.init = function()
		{
			if ( localStorage.hasOwnProperty("login") === true )
			{
				$rootScope.usuario = JSON.parse( localStorage.usuario );
				$rootScope.$apply();
				$location.path("/app/home");
				return;
			}
		}
		
		$scope.cadastrar = function( dados )
		{
			if ( !dados )
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: Preencha seus dados para continuar!'
				});   
				return;
			}
			
			if ( !dados.nome )
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: Insira seu nome para continuar!'
				});   
				return;
			}
			
			if ( !dados.senha )
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: Insira uma senha para continuar!'
				});   
				return;
			}
			
			if ( !dados.email )
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: Insira um e-mail para continuar!'
				});   
				return;
			}
			
			if ( ( ( dados.email.search(exclude) != -1) || 
				   ( dados.email.search(check) ) == -1) ||
				   ( dados.email.search(checkend) == -1) )
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: E-mail inválido, insira um e-mail no formato exemplo@gmail.com'
				});   
				return;
			}
			
			if ( !$rootScope.offline )
			{
				$http.post( URL_DIARIO + 'registrar/verificar/?cache=' + Math.random(), dados )
				.then(function(result)
				{
					var json = result.data;
					if ( json.error == 0 )
					{
						dadosEnviar.nome = dados.nome;
						dadosEnviar.email = dados.email;
						dadosEnviar.senha = dados.senha;
						$location.path("/cadastro2");
					} else
					{
						dados.email = '';
						dados.nome = '';
						dados.senha = '';
						$ionicPopup.alert({
							title: 'Erro!',
							template: 'ERRO: ' + json.msg
						});
					}
				});
			} else
			{
				dados.email = '';
				dados.nome = '';
				dados.senha = '';
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: Ocorreu um erro no cadastro, cheque sua conexão com a internet para continuar.'
				});
			}
		}  

		$scope.selecionarFoto = function()
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
						allowEdit: true,
						encodingType: 0, 
						sourceType: fonte[opc-1],
						mediaType: Camera.MediaType.PICTURE,
						correctOrientation: true,
						targetWidth: 175,
						targetHeight: 175
					}).then(function(imageData)
					{
						$scope.fotoUsuario = imageData;
						$scope.escolheufoto = true;
					}); 
					return true;
				}
			});
		}

		$scope.completarCadastro = function()
		{
			if ( $rootScope.offline )
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: Ocorreu um erro no cadastro, cheque sua conexão com a internet para continuar.'
				});
				return;
			}
			
			if ( $scope.escolheufoto )
			{
				$ionicLoading.show({
					template: '<i class="ion-load-c"></i>&nbsp;Cadastrando...'
				});
				var imagem = $scope.fotoUsuario;
				var options = new FileUploadOptions();
				options.fileKey = "file";
				options.fileName = imagem.substr(imagem.lastIndexOf('/')+1);
				options.mimeType = "image/jpeg";
				options.params = dadosEnviar;
				
				var ft = new FileTransfer();
				ft.upload( 
					imagem, 
					encodeURI( URL_DIARIO + 'registrar/?cache=' + Math.random() ), 
					function( result )
					{
						var json = JSON.parse( result.response );
						$ionicLoading.hide();
						if ( json.error == 0 )
						{
							$rootScope.usuario = {
								nome: dadosEnviar.nome,
								email: dadosEnviar.email,
								tipo: 'CADASTRO',
								id: json.id,
								foto: URL_DIARIO + 'upload/' + json.foto,
								facebook: false
							};
							$rootScope.$apply();
							localStorage.usuario = JSON.stringify( $rootScope.usuario );
							localStorage.login = true;
							$ionicPopup.alert({
								title: 'Sucesso!',
								template: json.msg
							})
							.then(function()
							{
								$location.path("/app/home");
							});
						} else
						{
							$ionicPopup.alert({
								title: 'Erro!',
								template: 'ERRO: ' + json.msg
							});
						}
					}, 
					function(e)
					{
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: 'Erro!',
							template: 'ERRO: Ocorreu um erro no cadastro, cheque sua conexão com a internet para continuar.'
						});
					}, options);
			} else
			{
				$ionicLoading.show({
					template: '<i class="ion-load-c"></i>&nbsp;Cadastrando...'
				});
			
				dadosEnviar.foto = '#';
				$http.post( URL_DIARIO + 'registrar', dadosEnviar )
				.then(function(result)
				{
					var json = result.data;
					$ionicLoading.hide();
					if ( json.error == 0 )
					{
						$rootScope.usuario = {
							nome: dadosEnviar.nome,
							email: dadosEnviar.email,
							tipo: 'CADASTRO',
							id: json.id,
							foto: '#',
							facebook: false
						};
						$rootScope.$apply();
						localStorage.login = true;
						localStorage.usuario = JSON.stringify( $rootScope.usuario );
						$ionicPopup.alert({
							title: 'Sucesso!',
							template: json.msg
						});
						$location.path("/app/home");
					} else
					{
						$ionicPopup.alert({
							title: 'Erro!',
							template: 'ERRO: ' + json.msg
						});
					}
				});
			}
		}
	}
)