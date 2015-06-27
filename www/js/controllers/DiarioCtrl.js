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
		$ionicLoading,
		$timeout
	)
{
	try{
	$scope.posts = [];
	$scope.diariopublico = true;
	$scope.diariotexto = "";
	$scope.fotos = [];
	
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
	}
	
	$scope.doRefresh = function()
	{
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
					targetWidth: 150,
					targetHeight: 150
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
	
	$ionicLoading.show({
		template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Carregando...'
	});
	
	$timeout(function()
	{
		$http.post( URL_DIARIO + 'diario/get', 
		{
			iduser: $rootScope.usuario.id
		}).then( function( result )
		{
			$ionicLoading.hide();
			var json = result.data;
			for ( var ind in json )
			{
				$scope.posts.push( json[ind] );
			}
			$scope.$apply();
		});
	}, 3000);
	}catch(er){alert(er);}
});