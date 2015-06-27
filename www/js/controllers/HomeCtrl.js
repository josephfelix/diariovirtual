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
		$ionicLoading,
		$timeout
	)
{
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
        if ( !$scope.diariotexto.length && !$scope.fotos.length )
		{
            $ionicPopup.alert({
                title: 'Erro',
                template: 'Insira um texto ou foto para publicar!'
            });
            return;
        }
        
        var monName = new Array ("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set",  "Out", "Nov", "Dez");
        var hoje = new Date();
        
        $scope.arg = {};
        $scope.arg.func = "PUBLISH";
        $scope.arg.conta = $rootScope.usuario;
        $scope.arg.texto = $scope.diariotexto;
        $scope.arg.publico = $scope.diariopublico;
        $scope.arg.fotos = $scope.fotos;
       /*  var ret = sendserver ( $scope.arg );
        
        if ( ret === false )
		{
            navigator.notification.alert ("Erro na publicação");
            return;
        } */
        
        var temp = {};
        if ($rootScope.fotousu)
            temp.ownerimg = $rootScope.fotousu;
        else
            temp.ownerimg = "img/anonimo.jpg";
        temp.ownername = $rootScope.usuario;

        temp.date = hoje.getDate () + " " + monName[hoje.getMonth()]   +  " "  +     hoje.getFullYear ();

        temp.texto = $scope.diariotexto;
        temp.fotos = [];
        temp.fotos = $scope.fotos;
        temp.publico = $scope.diariopublico;
        $scope.posts.unshift (temp);
        
        $scope.diariotexto = "";
        $scope.fotos = [];
        $scope.diariopublico = false;
        
        $scope.$apply();        
    }
    
    $scope.doRefresh = function()
	{
		$ionicLoading.show({
			template: '<i class="ion-load-c"></i>&nbsp;Carregando...'
		});
		
		$timeout(function()
		{
			$http.post( URL_DIARIO + 'timeline/get', 
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
		$http.post( URL_DIARIO + 'timeline/get', 
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
})