angular.module('diariovirtual.controllers')
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