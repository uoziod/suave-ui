(function () {

	function suavePlaceholder ($templateCache, $timeout) {
		return {
			restrict: "A",
			scope: true,
			compile: function (tElement) {
				tElement.replaceWith($templateCache.get('placeholder.tmpl'));

				var input = tElement.clone();

				return function (scope, element, attrs) {
					scope.position = attrs.suPlaceholderRight ? 'right' : 'left';
					scope.placeholder = attrs.suPlaceholder || attrs.suPlaceholderRight;

					$timeout(function () {
						var placeholder = element[0].getElementsByClassName('su-placeholder')[0],
							placeholderWidth = placeholder.clientWidth,
							wholeWidth = parseInt(attrs.suWidth, 10);

						if (wholeWidth > placeholderWidth) {
							angular.element(input).css({
								'width': (wholeWidth - placeholderWidth) + 'px'
							});
						}

						angular.element(placeholder).bind('mousedown', function(e) {
							e.preventDefault();
							element.find('input')[0].focus();
						});

						if (scope.position === 'left') {
							angular.element(input).css({
								'padding-left': placeholderWidth + 'px'
							});
						}

						if (scope.position === 'right') {
							angular.element(input).css({
								'padding-right': placeholderWidth + 'px'
							});
						}
					});

					element.find('su-transclude').append(input);
				};
			}
		};
	}

	angular.module('su-form', [])
		.directive('suPlaceholder', suavePlaceholder)
		.directive('suPlaceholderRight', suavePlaceholder);

})();
