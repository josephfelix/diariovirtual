/* global angular: false */
/* global window: false */
/* global cordova: false */
/* global StatusBar: false */
/* global navigator: false */
/* global document: false */
/* global Camera: false */
/* global $http: false */
/* global localStorage: false */

angular.module('starter.controllers', [])

//
//  Controller Home
//  trata pull refresh e getphoto
//
.controller ("HomeCtrl", function ($scope, $ionicActionSheet, $rootScope) {

    
    $scope.fonte = [
        Camera.PictureSourceType.CAMERA,
        Camera.PictureSourceType.PHOTOLIBRARY
    ];
    
    
    $scope.init = function () {
        $scope.posts = [];
        $scope.diariopublico = false;
        $scope.dispImage = document.getElementById('dispImage');
        $scope.temfoto = false;
    };
    
    $scope.publish = function() {        
        $scope.arg = {};
        $scope.arg.func = "PUBLISH";
        $scope.arg.texto = $scope.diariotexto;
        $scope.arg.publico = $scope.diariopublico;
        $scope.arg.foto = $scope.dispImage.src;
        var ret = sendserver ( $scope.arg );
        
        var temp = {};
        if ($rootScope.fotousu)
            temp.ownerimg = $rootScope.fotousu;
        else
            temp.ownerimg = "img/anonimo.jpg";
        temp.ownername = $rootScope.usuario;
        temp.date = (new Date()).toString().split(' ').splice(1,3).join(' ');
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
//        $scope.todos.unshift({name: 'Incoming todo ' + Date.now()})

        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };

    
    $scope.getphoto = function() {    

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
                    sourceType: $scope.fonte[index],
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
    }

})

//
//   Controller de Login
//
//   trata botoes de login, login Facebook e Cadastro
//

.controller ("LoginCtrl", function ($scope, $cordovaOauth, $http, $location, $rootScope) {

    $scope.login = function () {
        $scope.arg = {};
        $scope.arg.func = "LOGIN";
        $scope.arg.conta = $scope.username;
        $scope.arg.senha = $scope.password;
        $scope.arg.id = 0;
        var ret = sendserver ( $scope.arg );

        if ( ret === true ) {
            localStorage.login = true;
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
    
    $scope.loginfb = function() {
        $rootScope.friends = [];
        
        $cordovaOauth.facebook("1579417432308760", ["email", "user_friends"]).then(function(result) {
            localStorage.accessToken = result.access_token;
            localStorage.login = true;
            $scope.token = result.access_token;
            $scope.pegadadosfb();
    }, function(error) {
            navigator.notification.alert("Erro ao logar no Facebook");
        });
    };
    
    
    $scope.pegadadosfb = function() {
        if( localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.3/me", { params: { access_token: localStorage.accessToken, fields: "id,name,gender,email,picture", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;

                $scope.arg = {};
                $scope.arg.func = "LOGINFB";
                $scope.arg.id = $scope.profileData.id;
                $scope.arg.conta = $scope.profileData.name;
                $scope.arg.email = $scope.profileData.email;
                var ret = sendserver ( $scope.arg );
                
            }, function(error) {
                navigator.notification.alert("Erro ao tentar ler profile.");
            });
            
            $http.get("https://graph.facebook.com/v2.3/me/friends", { params: { access_token: localStorage.accessToken, format: "json" }}).then(function(result) {
                $rootScope.friends = result.data.data;

               if ( $rootScope.friends.length === 0 )
                   $location.path ("/app/home");
               else {
                    for(var i = 0; i < $rootScope.friends.length; i++) {
                        $rootScope.friends[i].src = "https://graph.facebook.com/" + $rootScope.friends[i].id + "/picture";
                    }

                    $location.path("/app/profile");
                }
            }, function(error) {
                navigator.notification.alert("Erro ao tentar ler amigos.");
            });
            
        } else {
            navigator.notification.alert("Not signed in");
            $location.path("/login");
        }
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
        $scope.lista = [];
    };
    
    $scope.add = function (index) {
        $scope.lista.push ($rootScope.friends[index]);
    };
    
    $scope.envia = function () {
        $scope.arg = {};
        $scope.arg.func = "AMIGOSFB";
        $scope.arg.lista = $scope.lista;
        var ret = sendserver ( $scope.arg );

        $location.path ("/app/home");
    };       

    function sendserver (args) {
        navigator.notification.alert (JSON.stringify(args, null, 4));
    }

})

//
//      Controller de Cadastro
//
//      trata do envio do Cadastro
//
.controller ("CadastroCtrl", function ($scope, $http, $location, $ionicActionSheet, $rootScope) {
    
    $scope.fonte = [
        Camera.PictureSourceType.CAMERA,
        Camera.PictureSourceType.PHOTOLIBRARY
    ];
    
    $scope.enviar1 = function() {
        $scope.arg = {};
        $scope.arg.func = "CADASTRO";
        $scope.arg.conta = $scope.username;
        $scope.arg.senha = $scope.password;
        $scope.arg.email = $scope.email;        
        var ret = sendserver ( $scope.arg );

        $scope.escolheufoto = false;
        $rootScope.usuario = $scope.username;
        $rootScope.fotousu = "";
        $location.path ("/cadastro2");
    };    

    $scope.getphoto = function() {    

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
                    sourceType: $scope.fonte[index],
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
        if ( $scope.escolheufoto ) {
            $rootScope.fotousu = $scope.dispImage.src;
            
            $scope.arg = {};
            $scope.arg.func = "CADASTRO";
            $scope.arg.foto = $scope.dispImage.src;
            var ret = sendserver ( $scope.arg );
        }
        $location.path ("/app/home");
    };    

    function onPhotoSuccess (imageData) {
        $scope.dispImage = document.getElementById('profileImage');
        $scope.dispImage.src = "data:image/jpeg;base64," + imageData;
        $scope.escolheufoto = true;
    }
    
    function onFail () {
        navigator.notification.alert ("Erro ao carregar foto");
    }
    
    function sendserver (args) {
        navigator.notification.alert (JSON.stringify(args, null, 4));
    }
});
