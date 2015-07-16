angular.module('diariovirtual.controllers')
.controller('ChatConversationCtrl', function( $scope, $rootScope, $state, $stateParams, MockService, $ionicActionSheet, $ionicPopup, $ionicScrollDelegate, $timeout, $interval )
{
    $scope.toUser = {
		id: $stateParams.amigo.usuario.id,
		pic: $stateParams.amigo.usuario.tipo == 'FACEBOOK' ? $stateParams.amigo.usuario.foto : URL_DIARIO + 'upload/' + $stateParams.amigo.usuario.foto,
		username: $stateParams.amigo.usuario.nome
    }

    $scope.user = {
		id: $rootScope.usuario.id,
		pic: $rootScope.usuario.tipo == 'FACEBOOK' ? $rootScope.usuario.foto : URL_DIARIO + 'upload/' + $rootScope.usuario.foto,
		username: $rootScope.usuario.nome
    };

    $scope.input = {
		message: localStorage['userMessage-' + $scope.toUser.id] || ''
    };

    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    $scope.$on('$ionicView.enter', function() {
      console.log('UserMessages $ionicView.enter');

      getMessages();
      
      $timeout(function() {
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));
      }, 0);

      messageCheckTimer = $interval(function() {
        MockService.getUserMessages({
			user2: $scope.toUser.id,
			user1: $scope.user.id
		  }).then(function(data) {
			if ( JSON.stringify($scope.messages[$scope.messages.length-1]) != JSON.stringify(data[data.length-1]) )
			{
				$scope.doneLoading = true;
				$scope.messages = data;

				$timeout(function() {
				viewScroll.scrollBottom();
				}, 0);
			}
		  });
      }, 7000);
    });

    $scope.$on('$ionicView.leave', function() {
      console.log('leaving UserMessages view, destroying interval');
      // Make sure that the interval is destroyed
      if (angular.isDefined(messageCheckTimer)) {
        $interval.cancel(messageCheckTimer);
        messageCheckTimer = undefined;
      }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      if (!$scope.input.message || $scope.input.message === '') {
        localStorage.removeItem('userMessage-' + $scope.toUser.id);
      }
    });

    function getMessages() {
      // the service is mock but you would probably pass the toUser's GUID here
      MockService.getUserMessages({
        user2: $scope.toUser.id,
		user1: $scope.user.id
      }).then(function(data) {
        $scope.doneLoading = true;
        $scope.messages = data;

        $timeout(function() {
          viewScroll.scrollBottom();
        }, 0);
      });
    }

    $scope.$watch('input.message', function(newValue, oldValue) {
      console.log('input.message $watch, newValue ' + newValue);
      if (!newValue) newValue = '';
      localStorage['userMessage-' + $scope.toUser.id] = newValue;
    });

    $scope.sendMessage = function(sendMessageForm)
	{
		var message = {
			from: $scope.user.id,
			to: $scope.toUser.id,
			text: $scope.input.message
		};

      // if you do a web service call this will be needed as well as before the viewScroll calls
      // you can't see the effect of this in the browser it needs to be used on a real device
      // for some reason the one time blur event is not firing in the browser but does on devices
      keepKeyboardOpen();
      
      MockService.sendMessage(message).then(function(data) {
		  $scope.messages.push(data);
		  $scope.input.message = '';

		  $timeout(function() {
			keepKeyboardOpen();
			viewScroll.scrollBottom(true);
		  }, 0);

		/*   $timeout(function() {
			$scope.messages.push(MockService.getMockMessage());
			keepKeyboardOpen();
			viewScroll.scrollBottom(true);
		  }, 2000); */

      });
    };
    
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
		return;
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    }

    $scope.onMessageHold = function(e, itemIndex, message) {
      console.log('onMessageHold');
      console.log('message: ' + JSON.stringify(message, null, 2));
      $ionicActionSheet.show({
        buttons: [{
          text: 'Copiar mensagem'
        }, {
          text: 'Apagar mensagem'
        }],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              //cordova.plugins.clipboard.copy(message.text);

              break;
            case 1: // Delete
              // no server side secrets here :~)
              $scope.messages.splice(itemIndex, 1);
              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;
          }
          
          return true;
        }
      });
    };

    // this prob seems weird here but I have reasons for this in my app, secret!
    $scope.viewProfile = function(iduser) {
        $state.go('app.perfil', {id: iduser});
    };
    
    // I emit this event from the monospaced.elastic directive, read line 480
    $scope.$on('taResize', function(e, ta) {
      console.log('taResize');
      if (!ta) return;
      
      var taHeight = ta[0].offsetHeight;
      console.log('taHeight: ' + taHeight);
      
      if (!footerBar) return;
      
      var newFooterHeight = taHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
      
      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = newFooterHeight + 'px'; 
    });
})


// services
.factory('MockService', ['$http', '$q',
  function($http, $q) {
    var me = {};

	me.sendMessage = function(message)
	{
		var endpoint = URL_DIARIO + 'chat/post';
		return $http.post(endpoint, message).then(function(response) {
			return response.data;
		}, function(err) {
		});
	}
    me.getUserMessages = function(d) {
      var endpoint = URL_DIARIO + 'chat/get';
      return $http.post(endpoint,
	  {
		user1: d.user1,
		user2: d.user2
	  }).then(function(response) {
		if ( response.data.status == 'OK' )
			return response.data.chat;
		return {};
      }, function(err) {
        console.log('get user messages error, err: ' + JSON.stringify(
          err, null, 2));
      });
      /* var deferred = $q.defer();
      
		 setTimeout(function() {
      	deferred.resolve(getMockMessages());
	    }, 1500);
      
      return deferred.promise; */
    };

    return me;
  }
])

// fitlers
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])