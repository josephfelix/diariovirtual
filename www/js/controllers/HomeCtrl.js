angular.module('diariovirtual.controllers')
.controller('HomeCtrl', 
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
		$timeout,
		$cordovaSocialSharing
	)
{
	try
	{
		$scope.posts = [];
		if ( localStorage.hasOwnProperty('postsTimeline') )
			$scope.posts = JSON.parse( localStorage.postsTimeline );
		
		$scope.diariopublico = true;
		$scope.diariotexto = "";
		$scope.fotos = [];
		$scope.URL_DIARIO = URL_DIARIO;
		var postLikes;
		var limit = 20;
		
		if ( localStorage.postLikes )
		{
			postLikes = JSON.parse( localStorage.postLikes );
		} else
		{
			localStorage.postLikes = '[]';
			postLikes = [];
		}
		
		
		
		$scope.init = function()
		{
			if ( localStorage.hasOwnProperty('login') === false )
			{
				$location.path('/login');
				return;
			}
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
			
			
			var imagem = $scope.fotos[0];
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = imagem.substr(imagem.lastIndexOf('/')+1);
			options.mimeType = "image/jpeg";
			
			var params = {};
			params.publico = $scope.diariopublico;
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
						$scope.$apply();
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
					iduser: post.usuario.id
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
		
		$scope.carregarMais = function()
		{
			limit = limit + 20;
			$ionicLoading.show({
				template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
			});
			$http.post( URL_DIARIO + 'timeline/get/?cache=' + Math.random(), 
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
				localStorage.postsTimeline = JSON.stringify( $scope.posts );
			});
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
		
		$scope.doRefresh = function()
		{
			$ionicLoading.show({
				template: '<i class="ion-load-c"></i>&nbsp;Carregando...'
			});
			
			$timeout(function()
			{
				$http.post( URL_DIARIO + 'timeline/get/?cache=' + Math.random(), 
				{
					iduser: $rootScope.usuario.id
				}).then( function( result )
				{
					$ionicLoading.hide();
					var json = result.data;
					$scope.posts = [];
					if ( json.length )
					{
						for ( var ind in json )
						{
							$scope.posts.push( json[ind] );
						}
					}
					$scope.$apply();
					localStorage.postsTimeline = JSON.stringify( $scope.posts );
					$scope.$broadcast('scroll.refreshComplete');
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
						quality: 100, 
						destinationType: Camera.DestinationType.FILE_URI, 
						sourceType: fonte[opc-1],
						allowEdit: true,
						encodingType: 0, 
						mediaType: Camera.MediaType.PICTURE,
						correctOrientation: true,
						targetWidth: 350,
						targetHeight: 350
					}).then(function(imageFile)
					{
						$scope.fotos.push( imageFile );
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
		
		$scope.closeModal = function()
		{
			$scope.modal.hide();
			$scope.foto_atual = '';
		}
		
		if ( !localStorage.postsTimeline )
		{
			if ( !$rootScope.offline )
			{
				$ionicLoading.show({
					template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
				});
				$timeout(function()
				{
					$http.post( URL_DIARIO + 'timeline/get/?cache=' + Math.random(), 
					{
						iduser: $rootScope.usuario.id
					}).then( function( result )
					{
						$ionicLoading.hide();
						var json = result.data;
						if ( json.length )
						{
							for ( var ind in json )
							{
								$scope.posts.push( json[ind] );
							}
						}
						$scope.$apply();
						localStorage.postsTimeline = JSON.stringify( $scope.posts );
					});
				}, 3000);
			} else
			{
				$ionicPopup.alert({
					title: 'Erro',
					template: '&Eacute; necess&aacute;rio conex&atilde;o com a internet para buscar as postagens de sua linha do tempo!'
				});
			}
		}
	} catch(er){}
})