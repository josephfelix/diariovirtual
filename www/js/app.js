// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
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

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
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
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});