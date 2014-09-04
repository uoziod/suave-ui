(function () {

	function layers () {
		var self = this;

		self._elements = [];
		self._layers = [];

		angular.element(document).on('click', function(e) {
			if (self._layers.length > 0 && !searchUpInTree(e.target)) {
				var topLayer = self._layers[self._layers.length - 1],
					$topLayer = angular.element(topLayer).scope();

				$topLayer.visible = false;
				$topLayer.$apply();

				self._layers.pop();
			}
		});

		function searchUpInTree (element) {
			if (self._layers.indexOf(angular.element(element)[0]) > -1) {
				return true;
			} else if (angular.element(element).parent()[0].tagName && angular.element(element).parent()[0].tagName !== 'HTML') {
				return searchUpInTree(angular.element(element).parent());
			} else {
				return false;
			}
		}

		return {
			cacheElement: function (id, element) {
				self._elements[id] = element;
			},

			toggle: function (source, target) {
				var dropdown = angular.element(self._elements[target]),
					$dropdown = dropdown.scope();

				angular.element(source).after(dropdown);

				$dropdown.visible = !$dropdown.visible;
				$dropdown.$apply();

				if ($dropdown.visible) {
					self._layers.push(self._elements[target][0]);
				} else {
					self._layers.pop();
				}
			}
		}
	}

	/* ngInject */
	function dropdown (suLayers) {
		return {
			restrict: "E",
			template: '<div class="dropdown" ng-class="{dn: !visible}"><span ng-transclude></span></div>',
			transclude: true,
			replace: true,
			scope: true,
			link: function (scope, element, attrs) {
				suLayers.cacheElement(attrs.anchor, element);
			}
		};
	}

	/* ngInject */
	function suTarget (suLayers) {
		return {
			restrict: "A",
			scope: true,
			link: function (scope, element, attrs) {
				angular.element(element).on('click', function (e) {
					e.stopPropagation();
					e.preventDefault();
					suLayers.toggle(element, attrs.suTarget);
				});
			}
		};
	}

	angular.module('su-layers', [])
		.service('suLayers', layers)
		.directive('suDropdown', dropdown)
		.directive('suTarget', suTarget);

})();
