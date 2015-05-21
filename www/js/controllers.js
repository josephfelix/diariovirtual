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
.controller ("HomeCtrl", function ($scope) {

    $scope.diariopublico = false;
    
    $scope.publish = function() {
        navigator.notification.alert ("Enviando http: " + $scope.diariotexto + " " + $scope.diariopublico);
    };
    
    $scope.doRefresh = function() {
//        $scope.todos.unshift({name: 'Incoming todo ' + Date.now()})

        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };

    
    $scope.getphoto = function () { 
        navigator.camera.getPicture(onPhotoURISuccess, onFail, { 
            quality: 50, 
            destinationType: Camera.DestinationType.FILE_URI, 
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 100,
            targetHeight: 100
        });
        
    };

    function onPhotoURISuccess (imageURI) {
      var dispImage = document.getElementById('dispImage');
      dispImage.style.display = 'block';
      dispImage.src = imageURI;
    }
    
    function onFail () {
        navigator.notification.alert ("Erro na camera");
    }

})

//
//   Controller de Login
//
//   trata botoes de login, login Facebook e Cadastro
//

.controller ("LoginCtrl", function ($scope, $cordovaOauth, $location) {
 
    $scope.login = function () {
        navigator.notification.alert ("Enviando http: " + $scope.data.username + " " + $scope.data.password);
        $location.path ("/app/home");
    };
    
    $scope.cadastro = function () {
            $location.path("/cadastro");
    };
    
    $scope.loginfb = function() {
        $cordovaOauth.facebook("1579417432308760", ["email", "user_friends"]).then(function(result) {
            localStorage.accessToken = result.access_token;
            $scope.token = result.access_token;
            $location.path("/app/profile");
    }, function(error) {
            navigator.notification.alert("Erro ao logar no Facebook");
        });

    };
})

//
//    Controller de Profile do Facebook
//
//    Pega dados do profile e amigos do Facebook
//
.controller ("ProfileCtrl", function ($scope, $http, $location) {
    
    $scope.init = function() {
        if( localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.3/me", { params: { access_token: localStorage.accessToken, fields: "id,name,gender,email,picture", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                navigator.notification.alert("Erro There was a problem getting your profile.");
            });
            
            $http.get("https://graph.facebook.com/v2.3/me/friends", { params: { access_token: localStorage.accessToken, format: "json" }}).then(function(result) {
                $scope.friends = result.data.data;
            }, function(error) {
                navigator.notification.alert("There was a problem getting your friends.");
            });
            
        } else {
            navigator.notification.alert("Not signed in");
            $location.path("/login");
        }
    };    
})

//
//      Controller de Cadastro
//
//      trata do envio do Cadastro
//
.controller ("CadastroCtrl", function ($scope, $http, $location) {
    
    $scope.enviar = function() {
        navigator.notification.alert ("Enviando http: " + $scope.data.username + " " +  $scope.data.password + " " + $scope.data.email);
        $location.path ("/app/home");
    };    

    $scope.getphoto = function () { 
        navigator.camera.getPicture(onPhotoURISuccess, onFail, { 
            quality: 50, 
            destinationType: Camera.DestinationType.FILE_URI, 
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 100,
            targetHeight: 100
        });        
    };

    function onPhotoURISuccess (imageURI) {
      var dispImage = document.getElementById('profileImage');
      dispImage.style.display = 'block';
      dispImage.src = imageURI;
    }
    
    function onFail () {
        navigator.notification.alert ("Erro na camera");
    }
});
/*
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
*/
