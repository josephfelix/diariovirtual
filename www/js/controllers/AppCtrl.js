/**
* ----------------------------------------------------
*           Diário Virtual 0.1
*         Desenvolvido por: Moboo
*-----------------------------------------------------
*/

angular.module('diariovirtual.controllers')
.controller('AppCtrl', function( $scope )
{
	$scope.currentUser = null;
    $scope.setCurrentUser = function( user )
	{
		$scope.currentUser = user;
	};
})