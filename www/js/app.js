angular.module('diariovirtual.controllers', []);
angular.module('diariovirtual', [
	'ionic', 
	'diariovirtual.directives', 
	'diariovirtual.controllers', 
	'ngCordova'
])

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
		templateUrl: "templates/menu.html"
	})
  
	.state('login', {
		url: "/login",
		cache: false,
		templateUrl: "templates/login.html"
	})
	
	.state('termos', {
		url: "/termos",
		cache: false,
		templateUrl: "templates/termos.html"
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
	
	//$urlRouterProvider.otherwise('/login');
	$urlRouterProvider.otherwise( localStorage.hasOwnProperty("login") ? 'app/home' : '/login' );
});