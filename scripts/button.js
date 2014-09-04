(function() {

	/* ngInject */
	function buttonIcon($sce) {
		return {
			restrict: "A",
			template: '<button><span ng-bind-html="renderHtml(value)"></span></button>',
			replace: true,
			scope: true,
			link: function(scope, element, attrs) {
				scope.renderHtml = function(html) {
					return $sce.trustAsHtml(html);
				};

				scope.value = '<span class="mr5 fa ' + attrs.suIcon + '"></span> ' + attrs.value;
			}
		};
	}

	/* ngInject */
	function buttonIconInCircle($sce) {
		return {
			restrict: "A",
			template: '<button class="circle"><span ng-bind-html="renderHtml(value)"></span></button>',
			replace: true,
			scope: true,
			link: function(scope, element, attrs) {
				scope.renderHtml = function(html) {
					return $sce.trustAsHtml(html);
				};

				scope.value = '<div class="icon fa ' + attrs.suIconCircle + '"></div><div class="text">' + attrs.value + '</div>';
			}
		};
	}

	angular.module('su-button', [])
		.directive('suIcon', buttonIcon)
		.directive('suIconCircle', buttonIconInCircle);

})();
