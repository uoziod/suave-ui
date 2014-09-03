(function() {

	/* ngInject */
	function suaveButtonIcon($sce) {
		return {
			restrict: "A",
			template: '<button><span ng-bind-html="renderHtml(value)"></span></button>',
			replace: true,
			scope: true,
			link: function(scope, element, attrs) {
				scope.renderHtml = function(html) {
					return $sce.trustAsHtml(html);
				};

				scope.value = '<span class="mr-nano fa ' + attrs.suIcon + '"></span> ' + attrs.value;
			}
		};
	}

	/* ngInject */
	function suaveButtonIconInCircle($sce) {
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
		.directive('suIcon', suaveButtonIcon)
		.directive('suIconCircle', suaveButtonIconInCircle);

})();
