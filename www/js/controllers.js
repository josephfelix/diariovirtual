/* global angular: false */
/* global window: false */
/* global cordova: false */
/* global StatusBar: false */
/* global navigator: false */
/* global document: false */
/* global Camera: false */
/* global $http: false */
/* global localStorage: false */
/* global facebookConnectPlugin: false */


angular.module('starter.controllers', [])

//
//  Controller Home
//  trata pull refresh e getphoto
//
.controller ("HomeCtrl", function ($scope, $ionicActionSheet, $rootScope, $location) {

    
    $scope.init = function () {
        $scope.posts = [];
        $scope.diariopublico = false;
        $scope.dispImage = document.getElementById('dispImage');
        $scope.temfoto = false;
        
        if( localStorage.hasOwnProperty("login") === true) {
                $rootScope.usuario = localStorage.conta;
                return;
        }
        
        localStorage.clear();
        $rootScope.usuario = "";
        $rootScope.fotousu = "";
        $location.path("/login");

    };
    
    $scope.logout = function () {
        localStorage.clear();
        $rootScope.usuario = "";
        $rootScope.fotousu = "";
        $location.path ("/login");
    };
    
    $scope.publish = function() {
        
        var monName = new Array ("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set",  "Out", "Nov", "Dez");
        var hoje = new Date();
        
        $scope.arg = {};
        $scope.arg.func = "PUBLISH";
        $scope.arg.conta = $rootScope.usuario;
        $scope.arg.texto = $scope.diariotexto;
        $scope.arg.publico = $scope.diariopublico;
        $scope.arg.foto = $scope.dispImage.src;
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
        if ( $scope.temfoto )
            temp.img = $scope.dispImage.src;
        else
            temp.img = "";
        temp.publico = $scope.diariopublico;
        $scope.posts.push (temp);
        
        $scope.diariotexto = "";
        $scope.dispImage.style.display = "none";
        $scope.temfoto = false;
        
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
        $scope.dispImage.style.display = 'block';
        $scope.dispImage.src = "data:image/jpeg;base64," + imageData;
        $scope.temfoto = true;
    }
    
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

.controller ("LoginCtrl", function ($scope, $cordovaOauth, $http, $location, $rootScope) {        
    $scope.init = function () {
        $scope.username = "";
        $scope.password = "";
        
        if( localStorage.hasOwnProperty("login") === true) {
                $rootScope.usuario = localStorage.conta;
                $location.path("/app/home");
                $scope.$apply();
        }        
    };

    $scope.login = function () {
        $scope.arg = {};
        $scope.arg.func = "LOGIN";
        $scope.arg.conta = $scope.username;
        $scope.arg.senha = $scope.password;
        $scope.arg.id = 0;
        var ret = sendserver ( $scope.arg );

        if ( ret === true ) {
            localStorage.login = true;
            localStorage.conta = $scope.username;
            $rootScope.usuario = $scope.username;
            $rootScope.fotousu = "";
            $location.path ("/app/home");
        } else {
            navigator.notification.alert ("Conta/Senha Inválida");
            $scope.username = "";
            $scope.password = "";
        }
    };
    
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

        facebookConnectPlugin.login (["email", "user_friends"],
            function (result) {
                if (result.status === 'connected') {
                    localStorage.accessToken = result.authResponse.accessToken;
                    $scope.pegadadosfb();
                } else
                    navigator.notification.alert ("Erro ao tentar logar no Facebook");
            }, function (error) {
alert (JSON.stringify (error,null,4));
                navigator.notification.alert ("Erro " + error + " no login do Facebook");                
            });
    };
        
    $scope.pegadadosfb = function() {
           facebookConnectPlugin.api("me/?fields=id,name,email,friends",["user_birthday"],
                function (result) {

                    localStorage.login = true;
                    localStorage.conta = result.name;
                    $rootScope.usuario = result.name;

                    $scope.arg = {};
                    $scope.arg.func = "LOGINFB";
                    $scope.arg.id = result.id;
                    $scope.arg.conta = result.name;
                    $scope.arg.senha = $scope.randomstring();
                    $scope.arg.email = result.email;
                    var ret = sendserver ( $scope.arg );
                    
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

    function sendserver (args) {
        navigator.notification.alert (JSON.stringify(args, null, 4));
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
.controller ("CadastroCtrl", function ($scope, $http, $location, $ionicActionSheet, $rootScope) {

    $scope.init = function () {
        if( localStorage.hasOwnProperty("login") === true) {
            $rootScope.usuario = localStorage.conta;
            $location.path("/app/home");
        }        
    };
    
    $scope.enviar1 = function() {
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
        }
            
        localStorage.login = true;
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
