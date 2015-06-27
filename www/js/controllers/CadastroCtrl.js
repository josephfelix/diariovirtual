var dadosEnviar = {};
angular.module('diariovirtual.controllers')

.controller('CadastroCtrl', function(
		$scope, 
		$http, 
		$location, 
		$ionicActionSheet, 
		$ionicPopup, 
		$rootScope,
		$ionicLoading
	)
	{
		var exclude = /[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
		var check = /@[\w\-]+\./;
		var checkend = /\.[a-zA-Z]{2,3}$/;
		
		$scope.init = function()
		{
			if ( localStorage.hasOwnProperty("login") === true )
			{
				$rootScope.usuario = JSON.parse( localStorage.usuario );
				$location.path("/app/home");
				return;
			}
		}
		
		$scope.fotoUsuario = '#';
		
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
					template: 'ERRO: E-mail inválido, insira um e-mail no formato exemplo@diariovirtual.com.br'
				});   
				return;
			}
			
			var networkState = navigator.connection.type;
			if ( networkState != Connection.NONE )
			{
				$http.post( URL_DIARIO + 'registrar/verificar', dados )
				.success(function(json, status, headers, config)
				{
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
				})
				.error(function(json, status, headers, config)
				{
					dados.email = '';
					dados.nome = '';
					dados.senha = '';
					$ionicPopup.alert({
						title: 'Erro!',
						template: 'ERRO: Ocorreu um erro no cadastro, cheque sua conexão com a internet para continuar.'
					});
				});
			} else
			{
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
		
			var hideSheet = $ionicActionSheet.show(
			{
				buttons: [
					{ text: '<i class="icon ion-camera"></i>&nbsp;Tirar foto' },
					{ text: '<i class="icon ion-images"></i>&nbsp;Selecionar da galeria' }
				],
				titleText: 'Selecione a origem da foto',
				cancelText: 'Cancelar',
				buttonClicked: function(index)
				{
					navigator.camera.getPicture(function(imageData)
					{
						$scope.fotoUsuario = imageData;
						$scope.escolheufoto = true;
					}, function()
					{
						$ionicPopup.alert({
							title: 'Erro!',
							template: 'ERRO: Ocorreu um erro ao selecionar sua foto, tente novamente.'
						});
					},
					{ 
						quality: 50, 
						destinationType: Camera.DestinationType.DATA_URL, 
						sourceType: fonte[index],
						mediaType: Camera.MediaType.PICTURE,
						correctOrientation: true,
						targetWidth: 175,
						targetHeight: 175
					}); 
					return true;
				}
			});
		}

		$scope.completarCadastro = function()
		{
			if ( $scope.escolheufoto )
				dadosEnviar.foto = $scope.fotoUsuario;
			else
				dadosEnviar.foto = "#";
			
			$ionicLoading.show({
				template: '<ion-spinner icon="lines"></ion-spinner>&nbsp;Cadastrando...'
			});
		
			$http.post( URL_DIARIO + 'registrar', dadosEnviar )
			.success(function(json, status, headers, config)
			{
				$ionicLoading.hide();
				if ( json.error == 0 )
				{
					localStorage.login = true;
					window.usuario = {
						nome: dadosEnviar.nome,
						email: dadosEnviar.email,
						foto: dadosEnviar.foto,
						id: json.id,
						facebook: false
					};
					localStorage.usuario = JSON.stringify( window.usuario );
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
			})
			.error(function(json, status, headers, config)
			{
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Erro!',
					template: 'ERRO: Ocorreu um erro no cadastro, cheque sua conexão com a internet para continuar.'
				});
			});
		}
	}
)