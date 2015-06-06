/**
* ----------------------------------------------------
*           Diário Virtual 0.1
*         Desenvolvido por: Moboo
*-----------------------------------------------------
*/

angular.module('diariovirtual.controllers', [])

.controller('AppCtrl', function( $scope )
{
	$scope.currentUser = null;
    $scope.setCurrentUser = function( user )
	{
		$scope.currentUser = user;
	};
})

//
//  Controller Home
//  trata pull refresh e getphoto
//
.controller ("HomeCtrl", function ($scope, $ionicActionSheet, $rootScope, $location, $ionicPopup) {	
    $scope.init = function () {
        $scope.posts = [];
        $scope.diariopublico = false;
        $scope.diariotexto = "";
        $scope.fotos = [];
        
        if( localStorage.hasOwnProperty("login") === true) {
                $rootScope.usuario = localStorage.conta;
                $rootScope.fotousu = localStorage.fotousu;
                return;
        }
        
//        localStorage.clear();
localStorage.removeItem ("login");
localStorage.removeItem ("conta");
localStorage.removeItem ("fotousu");

        $rootScope.usuario = "";
        $rootScope.fotousu = "";
        $location.path("/login");

    };
    
    $scope.logout = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Sair de sessão',
            template: '<center>Confirma logout?</center>'
        });
        
        confirmPopup.then(function(res) {
            if(res) {
//        localStorage.clear();
localStorage.removeItem ("login");
localStorage.removeItem ("conta");
localStorage.removeItem ("fotousu");
                $rootScope.usuario = "";
                $rootScope.fotousu = "";
                $location.path ("/login");
            } else
                $location.path ("/home");
        });
    };
    
    $scope.publish = function() {
        
            // Não deixa publicar vazio
        if ($scope.diariotexto === "" && $scope.fotos.length === 0) {
            $ionicPopup.alert({
                title: 'Publicação Vazia',
                template: '<center>Coloque texto ou foto na publicação</center>'
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
        var ret = sendserver ( $scope.arg );
        
        if ( ret === false ) {
            navigator.notification.alert ("Erro na publicação");
            return;
        }
        
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
    };
    
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };

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
                    targetWidth: 150,
                    targetHeight: 150
                });        

                return true;
            }
        });
    };

    function onFail () {
        navigator.notification.alert ("Erro ao carregar foto");
    }

    function onPhotoSuccess (imageData) {
        $scope.fotos.push ("data:image/jpeg;base64," + imageData);
        $scope.$apply();
    }
    
    $scope.remove = function (index) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Imagem selecionada',
       template: 'Confirma a remoção da foto'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $scope.fotos.splice ( index, 1);
       } 
     });

    };
    
    function sendserver (args) {
        navigator.notification.alert (JSON.stringify(args, null, 4));
        return true;
    }

})

//
//   Controller de Login
//
//   trata botoes de login, login Facebook e Cadastro
//

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

//
//    Controller de Profile do Facebook
//
//    Pega dados do profile e amigos do Facebook
//
.controller ("ProfileCtrl", function ($scope, $location, $rootScope) {
        
    $scope.init = function() {
        $scope.amigosselecionados = [];
    };
    
    $scope.add = function (index) {
        $scope.amigosselecionados.push ($rootScope.friends[index]);
    };
    
    $scope.envia = function () {
        $scope.arg = {};
        $scope.arg.func = "AMIGOSFB";
        $scope.arg.conta = $scope.username;
        $scope.arg.amigos = $scope.amigosselecionados;
        var ret = sendserver ( $scope.arg );

        $location.path ("/app/home");
    };       

    function sendserver (args) {
        navigator.notification.alert (JSON.stringify(args, null, 4));
        return true;
    }

})

//
//      Controller de Cadastro
//
//      trata do envio do Cadastro
//
.controller ("CadastroCtrl", function ($scope, $http, $location, $ionicActionSheet, $ionicPopup, $rootScope) {

    $scope.init = function () {
        if( localStorage.hasOwnProperty("login") === true) {
            $rootScope.usuario = localStorage.conta;
            $rootScope.fotousu = localStorage.fotousu;
            $location.path("/app/home");
        }        
    };
    
    $scope.enviar1 = function(form) {
            // undefined se for invalido ou vazio
        if ($scope.email === undefined) {
            $ionicPopup.alert({
                title: 'Erro na entrada',
                template: '<center>Email vazio ou inválido</center>'
            });
            
            return;
        }
            // formulario invalido
        if (!form.$valid) {
            $ionicPopup.alert({
                title: 'Erro na entrada',
                template: '<center>Conta/senha vazio ou inválido</center>'
            });
            
            return;
        }

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
    };    

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
});
