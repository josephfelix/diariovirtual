angular.module('diariovirtual.directives', ['ngSanitize'])

.directive('stopEvent', function()
{
    return {
        restrict: 'A',
        link: function (scope, element, attr)
		{
            element.bind('click', function(e)
			{
                e.stopPropagation();
            });
        }
    };
})

.directive('errorSrc', function () {
  var errorSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.errorSrc);
      });
    }
   }
   return errorSrc;
});