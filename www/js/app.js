/**
* ----------------------------------------------------
*           Diário Virtual 0.1
*         Desenvolvido por: Moboo
*-----------------------------------------------------
*/

angular.module('diariovirtual.controllers', []);
angular.module('diariovirtual', ['ionic', 'diariovirtual.controllers', 'ngCordova'])

.run(function($ionicPlatform, $location, $ionicPopup, $rootScope) {
  $ionicPlatform.ready(function() {
      
      /* $ionicPlatform.registerBackButtonAction(function(e){
        if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
        } else {
                $rootScope.backButtonPressedOnceToExit = true;
                window.plugins.toast.showShortCenter(
                "Tecle novamente o botáo de voltar para sair",function(a){},function(b){}
                );
                setTimeout(function(){
                    $rootScope.backButtonPressedOnceToExit = false;
                },2000);
            }
        e.preventDefault();
        return false;
  },101); */

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
    
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
//  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.navBar.alignTitle("center");
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
//    controller: 'AppCtrl'
  })
  
	.state('login', {
		url: "/login",
		cache: false,
		templateUrl: "templates/login.html"
	})

  .state('profile', {
    url: "/profile",
    cache: false,
    templateUrl: "templates/profile.html"
  })

  .state('cadastro1', {
    url: "/cadastro1",
    cache: false,
    templateUrl: "templates/cadastro1.html"
  })

  .state('cadastro2', {
    url: "/cadastro2",
    cache: false,
    templateUrl: "templates/cadastro2.html"
  })

  .state('app.home', {
    url: "/home",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/home.html"
      }
    }
  })
  
  .state('app.diario', {
    url: "/diario",
    views: {
      'menuContent': {
        templateUrl: "templates/diario.html"
      }
    }
  })
  
  .state('app.notificacoes', {
    url: "/notificacoes",
    views: {
      'menuContent': {
        templateUrl: "templates/notificacoes.html"
      }
    }
  })
  
  .state('app.mensagens', {
    url: "/mensagens",
    views: {
      'menuContent': {
        templateUrl: "templates/mensagens.html"
      }
    }
  })
  
  .state('app.solicitacoes', {
    url: "/solicitacoes",
    views: {
      'menuContent': {
        templateUrl: "templates/solicitacoes.html"
      }
    }
  })
  
  .state('app.procurar', {
    url: "/procurar",
    views: {
      'menuContent': {
        templateUrl: "templates/procurar.html"
      }
    }
  })
  
  .state('app.amigos', {
    url: "/amigos",
    views: {
      'menuContent': {
        templateUrl: "templates/amigos.html"
      }
    }
  })
  
  .state('app.configuracoes', {
    url: "/configuracoes",
    views: {
      'menuContent': {
        templateUrl: "templates/configuracoes.html"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})

.factory ("AuthService", function ($http, Session) {
    var authService = {};
          
    authService.login = function (credentials) {
        return $http
            .post('/login', credentials)
            .then(function (res) {
                Session.create(res.data.id, res.data.user.id);
                return res.data.user;
            });
    };
 
    authService.isAuthenticated = function () {
        return !!Session.userId;
    };
})

.service('Session', function () {
    this.create = function (sessionId, userId) {
        this.id = sessionId;
        this.userId = userId;
    };

    this.destroy = function () {
        this.id = null;
        this.userId = null;
    };
})

.constant ( "EVENTOS", {
    loginSuccess: "sucesso-login",
    loginFailed:  "falha-login",
    logoutSucess: "sucesso-logout"
});

