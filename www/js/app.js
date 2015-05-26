/* global angular: false */
/* global window: false */
/* global cordova: false */
/* global StatusBar: false */
/* global navigator: false */
/* global document: false */
/* global Camera: false */
/* global alert: false */
/* global $http: false */
/* global localStorage: false */


// Facebook APP_ID e APP_NAME (DiarioVirtual) colocados no plugin


angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $location, $ionicPopup) {
  $ionicPlatform.ready(function() {
      
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

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
//    controller: 'AppCtrl'
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
  
    .state('app.logout', {
    url: "/logout",
    views: {
      'menuContent': {
        templateUrl: "templates/logout.html"
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
  $urlRouterProvider.otherwise('/app/home');
});
