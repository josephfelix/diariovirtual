angular.module('diariovirtual.controllers')
.controller('DiarioCtrl', 
	function(
		$scope, 
		$ionicActionSheet, 
		$rootScope, 
		$location, 
		$ionicPopup,
		$cordovaCamera,
		$http,
		$ionicModal,
		$ionicLoading,
		$timeout
	)
{
	try
	{
		$scope.posts = [];
		$scope.diariotexto = "";
		$scope.fotos = [];
		var limit = 20;
		
		if ( localStorage.postsDiario )
			$scope.posts = JSON.parse( localStorage.postsDiario );
		
		$scope.init = function()
		{
			if ( localStorage.hasOwnProperty('login') === false )
			{
				$location.path('/login');
				return;
			}
		}
		
		$scope.carregarMais = function()
		{
			limit = limit + 20;
			$ionicLoading.show({
				template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
			});
			$http.post( URL_DIARIO + 'diario/get/?cache=' + Math.random(), 
			{
				iduser: $rootScope.usuario.id,
				limit: limit
			}).then( function( result )
			{
				$ionicLoading.hide();
				var json = result.data;
				$scope.posts = [];
				for ( var ind in json )
				{
					$scope.posts.push( json[ind] );
				}
				$scope.$apply();
				localStorage.postsDiario = JSON.stringify( $scope.posts );
			});
		}
		
		$scope.publish = function()
		{
			if ( !$scope.diariotexto.length && !$scope.fotos.length )
			{
				$ionicPopup.alert({
					title: 'Erro',
					template: 'Insira um texto ou foto para publicar!'
				});
				return;
			}
			
			if ( $scope.fotos.length )
			{
				var imagem = $scope.fotos[0];
				var options = new FileUploadOptions();
				options.fileKey = "file";
				options.fileName = imagem.substr(imagem.lastIndexOf('/')+1);
				options.mimeType = "image/jpeg";
				
				var params = {};
				params.publico = false;
				params.texto = $scope.diariotexto;
				params.iduser = $rootScope.usuario.id;

				options.params = params;
				
				$ionicLoading.show({
					template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Publicando...'
				});

				var ft = new FileTransfer();
				ft.upload( 
					imagem, 
					encodeURI( URL_DIARIO + 'timeline/post/?cache=' + Math.random() ), 
					function( result )
					{
						$ionicLoading.hide();
						var json = JSON.parse( result.response );
						if ( json.status == 'OK' )
						{
							$scope.posts.unshift(json);
							$scope.diariotexto = "";
							$scope.fotos = [];
						} else
						{
							$ionicPopup.alert({
								title: 'Erro',
								template: 'Houve um erro ao publicar, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
							});
						}
					}, 
					function(e)
					{
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Houve um erro ao publicar, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
						});
					}, options);
			} else
			{
				$ionicLoading.show({
					template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Publicando...'
				});
				$http.post( URL_DIARIO + 'timeline/post/?cache=' + Math.random(),
				{
					publico: false,
					texto: $scope.diariotexto,
					iduser: $rootScope.usuario.id
				})
				.then(function(response)
				{
					$ionicLoading.hide();
					var json = response.data;
					if ( json.status == 'OK' )
					{
						$scope.posts.unshift(json);
						$scope.diariotexto = "";
						$scope.fotos = [];
					} else
					{
						$ionicPopup.alert({
							title: 'Erro',
							template: 'Houve um erro ao publicar, cheque sua conex&atilde;o com a internet e tente novamente mais tarde.!'
						});
					}
				});
			}
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
		
		$scope.doRefresh = function()
		{
			$ionicLoading.show({
				template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
			});
			
			$timeout(function()
			{
				$http.post( URL_DIARIO + 'diario/get/?cache=' + Math.random(), 
				{
					iduser: $rootScope.usuario.id
				}).then( function( result )
				{
					$ionicLoading.hide();
					$scope.$broadcast('scroll.refreshComplete');
					var json = result.data;
					$scope.posts = [];
					for ( var ind in json )
					{
						$scope.posts.unshift( json[ind] );
					}
					localStorage.postsDiario = JSON.stringify( $scope.posts );
					$scope.$apply();
				});
			}, 3000);
		}
		
		$scope.getphoto = function()
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
						quality: 50, 
						destinationType: Camera.DestinationType.DATA_URL, 
						sourceType: fonte[opc-1],
						mediaType: Camera.MediaType.PICTURE,
						correctOrientation: true,
						targetWidth: 350,
						targetHeight: 350
					}).then(function(imageData)
					{
						$scope.fotos.push("data:image/jpeg;base64," + imageData);
						$scope.$apply();
					}, function(err){});
				}
			});
		}
		
		$scope.remove = function( index )
		{
			$ionicPopup.confirm(
			{
				title: 'Remover foto',
				template: 'Tem certeza que deseja remover esta foto da postagem?'
			})
			.then(function(res)
			{
			   if ( res )
			   {
					$scope.fotos.splice(index, 1);
			   } 
			});
		}
		
		if ( !localStorage.postsDiario )
		{
			if ( !$rootScope.offline )
			{
				$ionicLoading.show({
					template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
				});
				
				$timeout(function()
				{
					$http.post( URL_DIARIO + 'diario/get/?cache=' + Math.random(), 
					{
						iduser: $rootScope.usuario.id
					}).then( function( result )
					{
						$ionicLoading.hide();
						var json = result.data;
						for ( var ind in json )
						{
							$scope.posts.unshift( json[ind] );
						}
						$scope.$apply();
						localStorage.postsDiario = JSON.stringify( $scope.posts );
					});
				}, 3000);
			} else
			{
				$ionicPopup.alert({
					title: 'Erro',
					template: '&Eacute; necess&aacute;rio conex&atilde;o com a internet para buscar suas publica&ccedil;&otilde;es em seu diario!'
				});
			}
		}
	} catch(er){}
});