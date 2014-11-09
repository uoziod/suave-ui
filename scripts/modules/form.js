(function () {

	/* ngInject */
	function suavePlaceholder ($templateCache, $timeout, $sce) {
		return {
			restrict: "A",
			scope: true,
			compile: function (tElement) {
				tElement.replaceWith($templateCache.get('placeholder.tmpl'));

				var classes = tElement.attr('class'),
					input = tElement.clone().removeAttr('class').removeAttr('su-placeholder').removeAttr('su-placeholder-right');

				return function (scope, element, attrs) {
					scope.position = attrs.suPlaceholderRight ? 'right' : 'left';
					scope.placeholder = $sce.trustAsHtml(attrs.suPlaceholder || attrs.suPlaceholderRight);

					$timeout(function () {
						var placeholder = element[0].getElementsByClassName('su-placeholder')[0],
							placeholderWidth = placeholder.clientWidth,
							wholeWidth = parseInt(attrs.suWidth, 10),
							cssShift = 5;

						if (wholeWidth > placeholderWidth) {
							angular.element(input).css({
								'width': (wholeWidth - placeholderWidth - cssShift) + 'px'
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

						angular.element(element).addClass(classes);
					});

					element.find('su-transclude').append(input);
				};
			}
		};
	}

	/* ngInject */
	function suaveSelect ($templateCache) {
		return {
			restrict: "E",
			scope: true,
			compile: function (tElement) {
				var self = this;

				tElement.replaceWith($templateCache.get('select.tmpl'));

				if (!self.elements) {
					self.elements = [];
				}

				if (!self.doOnce) {
					angular.element(document).on('click', function(e) {
						for (var i = 0, len = self.elements.length; i < len; i++) {
							angular.element(self.elements[i]).scope().visible = false;
							angular.element(self.elements[i]).scope().$apply();
						}
					});

					self.doOnce = true;
				}

				return function(scope, element, attrs) {
					self.elements.push(element[0]);

					var optionsNodes = tElement.children();

					scope.options = [];

					for (var i = 0, len = optionsNodes.length; i < len; i++) {
						scope.options.push({
							index: i,
							value: optionsNodes[i].value,
							body: optionsNodes[i].innerHTML
						});
					}

					scope.className = attrs.class;
					scope.name = attrs.name;
					scope.current = scope.options[0];
					scope.width = attrs.suWidth;

					scope.select = function(option) {
						scope.current = option;
					};

					angular.element(element).on('click', function(e) {
						e.stopPropagation();

						var originalVisibilityState = scope.visible;

						for (var i = 0, len = self.elements.length; i < len; i++) {
							var elScope = angular.element(self.elements[i]).scope();
							elScope.visible = false;
							elScope.$apply();
						}

						scope.visible = !originalVisibilityState;
						scope.$apply();
					});
				}
			}
		}
	}

	angular.module('su-form', [])
		.directive('suPlaceholder', suavePlaceholder)
		.directive('suPlaceholderRight', suavePlaceholder)
		.directive('suSelect', suaveSelect);

})();
