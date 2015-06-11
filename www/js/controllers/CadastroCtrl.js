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
		
		$scope.init = function () {
			if( localStorage.hasOwnProperty("login") === true) {
				$rootScope.usuario = localStorage.conta;
				$rootScope.fotousu = localStorage.fotousu;
				$location.path("/app/home");
			}
		};
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
			
			$ionicLoading.show({
				template: '<ion-spinner icon="lines"></ion-spinner>&nbsp;Cadastrando...'
			});
		
			$http.post( URL_CADASTRO, dados )
			.success(function(json, status, headers, config)
			{
				$ionicLoading.hide();
				if ( json.status == 'OK' )
				{
					$scope.arg = {};
					$scope.arg.func = "CADASTRO";
					$scope.arg.conta = $scope.username;
					$scope.arg.senha = $scope.password;
					$scope.arg.email = $scope.email;        
					var ret = sendserver ( $scope.arg );

					if ( ret === true ) {
						$rootScope.escolheufoto = false;
						$rootScope.fotousu = "";
						localStorage.conta = $scope.username;
						$location.path ("/cadastro2");
					} else {
						navigator.notification.alert ("Erro ao tentar criar cadastro");
					}
				} else
				{
					$ionicPopup.alert({
						title: 'Erro!',
						template: 'ERRO: Ocorreu um erro no servidor, tente novamente mais tarde.'
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

		$scope.getphoto = function() {    

			var fonte = [
				Camera.PictureSourceType.CAMERA,
				Camera.PictureSourceType.PHOTOLIBRARY
			];
		

			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: 'Câmera' },
					{ text: 'Galeria' }
				],
				titleText: 'Selecione a origem da foto',
				cancelText: 'Cancelar',
				cancel: function() {
					// add cancel code..
					},
				buttonClicked: function(index) {
					navigator.camera.getPicture(onPhotoSuccess, onFail, { 
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
		};

		$scope.enviar2 = function () {
			if ( $rootScope.escolheufoto ) {
				$scope.arg = {};
				$scope.arg.conta = localStorage.conta;
				$scope.arg.func = "CADASTRO";
				$scope.arg.foto = $rootScope.dispImage.src;
				var ret = sendserver ( $scope.arg );
				
				if ( ret === false ) {
					navigator.notification.alert ("Erro ao tentar cadastrar");
					$location.path ("/cadastro");
					return;
				} else
					$rootScope.fotousu = $rootScope.dispImage.src;                
			} else {
				$rootScope.fotousu = "img/anonimo.jpg";
			}
				
			localStorage.login = true;
			localStorage.fotousu = $rootScope.fotousu;
			$rootScope.usuario = localStorage.conta;
					
			$rootScope.escolheufoto = false;
			$location.path ("/app/home");
			$scope.$apply();
		};    

		function onPhotoSuccess (imageData) {
			$rootScope.dispImage = document.getElementById('profileImage');
			$rootScope.dispImage.src = "data:image/jpeg;base64," + imageData;
			$rootScope.escolheufoto = true;
		}
		
		function onFail () {
			navigator.notification.alert ("Erro ao carregar foto");
		}
		
		function sendserver (args) {
			navigator.notification.alert (JSON.stringify(args, null, 4));
			return true;
		}
	}
)