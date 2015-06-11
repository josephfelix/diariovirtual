angular.module('diariovirtual.controllers')
.controller("LoginCtrl", 
	function(
		$scope, 
		$http, 
		$location, 
		$rootScope, 
		$ionicPopup, 
		/*AuthService,*/ EVENTOS,
		$ionicLoading )
{
	$scope.dados = {};
	if ( localStorage.hasOwnProperty("login") === true )
	{
		$rootScope.usuario = localStorage.conta;
		$rootScope.fotousu = localStorage.fotousu;
		$location.path("/app/home");
		$scope.$apply();
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
			template: '<ion-spinner icon="lines"></ion-spinner>&nbsp;Entrando...'
		});
		
		$http.post( URL_LOGIN, 
		{
			email: email,
			senha: senha
		} ).success(function(json, status, headers, config)
		{
			$ionicLoading.hide();
			if ( !json.error )
			{
				$scope.setCurrentUser( json );
			} else
			{
				$ionicPopup.alert({
					title: 'Erro!',
					template: json.msg
				});
			}
		});
    }
    
    $scope.cadastro = function () {
        $location.path("/cadastro1");
    };
    
    $scope.randomstring = function () {
        var s= '';
        var tam = 8;
        
        var randomchar=function(){
            var n= Math.floor(Math.random()*62);
            if(n<10) return n; //1-10
            if(n<36) return String.fromCharCode(n+55); //A-Z
            return String.fromCharCode(n+61); //a-z
        };
        
        while(tam--) s+= randomchar();
        return s;
    };
    
    $scope.loginfb = function() {
        $rootScope.friends = [];

        facebookConnectPlugin.login (["email", "user_friends"], $scope.loginfbsucesso,
            function (error) {
                    // se deu erro, pode ser o access token expired
                    // tenta de novo então
                facebookConnectPlugin.login (["email", "user_friends"], $scope.loginfbsucesso,
                    function (error) {
                        navigator.notification.alert ("Erro no login do Fabcebook " + JSON.stringify (error,null,4));
                });
            });
    };
     
    $scope.loginfbsucesso = function (result) {
                if (result.status === 'connected') {
                    localStorage.accessToken = result.authResponse.accessToken;
                    $scope.pegadadosfb();
                }
    };
        
    $scope.pegadadosfb = function() {
           facebookConnectPlugin.api("me/?fields=id,name,email,friends",["user_friends"],
                function (result) {

                    localStorage.login = true;
                    $rootScope.usuario = result.name;
                    localStorage.conta = result.name;
                    $rootScope.fotousu = "https://graph.facebook.com/"+ result.id + "/picture?type=square";
                    localStorage.fotousu = $rootScope.fotousu;
                    $rootScope.friends = [];
               
                    $scope.arg = {};
                    $scope.arg.func = "LOGINFB";
                    $scope.arg.id = result.id;
                    $scope.arg.conta = result.name;
                    $scope.arg.senha = $scope.randomstring();
                    $scope.arg.email = result.email;
                    var ret = sendserver ( $scope.arg, 1 );
                                   
                    if ( ret === true )   // primeiro login 
                        $rootScope.friends = result.friends.data;
 
                    if ( $rootScope.friends.length === 0 )
                        $location.path ("/app/home");
                    else {
                        for(var i=0; i < $rootScope.friends.length; i++) {
                            $rootScope.friends[i].src = "https://graph.facebook.com/" + $rootScope.friends[i].id + "/picture?type=square";
                        }
                        $location.path("/profile");
                    }
                    $scope.$apply();
                }, 
                function (error) {
                    navigator.notification.alert ("Erro "+ error + " ao pegar dados do Facebook");
                });
    };

    function sendserver (args, fb) {
        navigator.notification.alert (JSON.stringify(args, null, 4));
        if ( fb === 1 ) {
            if( localStorage.hasOwnProperty("firstlogin") === true)
                return false;
        
            localStorage.firstlogin = true;
        }
        return true;
    }

})