angular.module('diariovirtual.controllers')
.controller("LoginCtrl", 
	function(
		$scope, 
		$http, 
		$location, 
		$rootScope, 
		$ionicPopup, 
		$ionicLoading,
		$cordovaFacebook )
{
	$scope.dados = {};
	if ( localStorage.hasOwnProperty("login") === true )
	{
		$rootScope.usuario = JSON.parse( localStorage.usuario );
		$location.path("/app/home");
		return;
	}

    $scope.login = function( dados )
	{			
        if ( !dados.email )
		{
            $ionicPopup.alert({
                title: 'Erro!',
                template: 'Preencha o campo de e-mail para continuar.'
            });
            return;
        }
		
		if ( !dados.senha )
		{
			$ionicPopup.alert({
                title: 'Erro!',
                template: 'Preencha o campo de senha para continuar.'
            });
            return;
		}
		
		$ionicLoading.show({
			template: '<i class="ion-load-c ion-spin-animation"></i>&nbsp;Entrando...'
		});
		
		if ( !$rootScope.offline )
		{			
			$http.post( URL_DIARIO + 'login/?cache=' + Math.random(), 
			{
				email: dados.email,
				senha: dados.senha
			} )
			.then(function(response)
			{
				$ionicLoading.hide();
				var json = response.data;
				if ( json.error == 0 )
				{
					$rootScope.usuario = {
						nome: json.nome,
						email: json.email,
						tipo: 'CADASTRO',
						id: json.id,
						foto: URL_DIARIO + 'upload/' + json.foto,
						facebook: false
					};
					localStorage.usuario = JSON.stringify( $rootScope.usuario );
					localStorage.login = true;
					$location.path("/app/home");
				} else
				{
					$ionicPopup.alert({
						title: 'Erro!',
						template: json.msg
					});
				}
			});
		} else
		{
			$ionicPopup.alert({
				title: 'Erro!',
				template: 'ERRO: Ocorreu um erro no cadastro, cheque sua conexao com a internet para continuar.'
			});
		}
    }
    
    $scope.irParaCadastro = function()
	{
        $location.path("/cadastro1");
    };
    
    $scope.loginFacebook = function()
	{
        $scope.friends = [];
        $cordovaFacebook.login(["email", "user_friends"]) 
		.then(function(result)
		{
			if ( result.status === 'connected' )
			{
                $cordovaFacebook.api("me/?fields=id,name,email,friends", ["user_friends"])
				.then(function(result)
				{
					$http.post( URL_DIARIO + 'login/facebook/?cache=' + Math.random(), 
					{
						nome: result.name,
						email: result.email,
						id: result.id
					})
					.then( function( ret )
					{
						var json = ret.data;
						localStorage.login = true;
						$rootScope.usuario = {
							nome: json.nome,
							email: json.email,
							tipo: 'FACEBOOK',
							id: json.id,
							foto: 'http://graph.facebook.com/'+result.id+'/picture?fields=url&type=square',
							facebook: true
						};
						localStorage.usuario = JSON.stringify( $rootScope.usuario );
						
						if ( json.firstlogin )
						{
							$scope.friends = result.friends.data;
							if ( $scope.friends.length )
							{
								for ( var ind in $scope.friends )
									$scope.friends[ind].src = "http://graph.facebook.com/" + $scope.friends[ind].id + "/picture?fields=url&type=square";
								$location.path("/profile");
							} else
								$location.path("/app/home");
						} else
						{
							$location.path("/app/home");
						}
					});
				}, 
				function (error)
				{
					$ionicPopup.alert({
						title: 'Erro!',
						template: 'ERRO: Ocorreu um erro no login, cheque sua conexao com a internet para continuar.'
					});
				});
            }
		},
		function (error)
		{
			$ionicPopup.alert({
				title: 'Erro!',
				template: 'ERRO: Ocorreu um erro no login, cheque sua conexao com a internet para continuar.'
			});
		});
    }
})