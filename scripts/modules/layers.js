(function () {

	/* ngInject */
	function suaveLayersService ($rootScope, $document) {
		var self = this;

		self._elements = [];
		self._layers = [];

		$rootScope.$on('$routeChangeStart', function() {
			self._layers = [];
		});

		$document.on('keydown', function (e) {
			if (e && e.keyCode === 27) {
				popLayer();
			}
		});

		angular.element(document).on('click', function (e) {
			if (self._layers.length > 0 && !searchInLayers({caller: e.target})) {
				if (
					!searchUpInTreeByElement(e.target) ||
					!angular.equals(closestLayerFromElement(e.target), getTopLayer().element) ||
					e.target.className.search('su-popup') >= 0
					) {
					popLayer();
				}
			}
		});

		function cacheElement (id, element) {
			self._elements[id] = element;
		}

		function getById (id) {
			if (!angular.isUndefined(self._elements[id])) {
				return self._elements[id];
			}
		}

		function getLayers () {
			return self._layers;
		}

		function getTopLayer () {
			return self._layers[self._layers.length - 1];
		}

		function closestLayerFromElement (element) {
			if (element.tagName && element.tagName.toLowerCase() !== 'html') {
				if (element.className.search('su-dropdown') >= 0 || element.className.search('su-popup') >= 0) {
					return angular.element(element);
				} else {
					return closestLayerFromElement(angular.element(element).parent()[0]);
				}
			} else {
				return false;
			}
		}

		function searchInLayers (request) {
			var found = false;

			angular.forEach(self._layers, function (item) {
				if (
					(!found && request.id && angular.equals(item.id, request.id)) ||
					(!found && request.caller && angular.equals(item.caller, request.caller)) ||
					(!found && request.element && angular.equals(item.element, request.element))
					) {
					found = true;
				}
			});

			return found;
		}

		function searchUpInTreeByElement (element) {
			var found = false;

			angular.forEach(self._layers, function (item) {
				if (!found && angular.equals(item.element, angular.element(element))) {
					found = true;
				}
			});

			if (found) {
				return true;
			} else if (angular.element(element).parent()[0].tagName && angular.element(element).parent()[0].tagName !== 'HTML') {
				return searchUpInTreeByElement(angular.element(element).parent());
			}
		}

		function addToLayers (id, caller) {
			var element = angular.element(self._elements[id]),
				$element = element.scope();

			if (element.length > 0) {
				self._layers.push({
					id: id,
					element: element,
					caller: caller
				});

				angular.element(caller).after(element);

				$element.visible = true;
				$element.$apply();

				setScrollState();
			} else {
				console.warn('Layered element with id "' + id + '" not found');
			}
		}

		function popLayer () {
			if (self._layers.length > 0) {
				var $element = angular.element(getTopLayer().element).scope();

				$element.visible = false;
				$element.$apply();

				self._layers.pop();

				setScrollState();
			}
		}

		function setScrollState() {
			if (getTopLayer() && getTopLayer().element[0].className.search('su-popup') >= 0) {
				angular.element(document).find('body').addClass('no-scroll');
			} else {
				angular.element(document).find('body').removeClass('no-scroll');
			}
		}

		return {
			cacheElement: cacheElement,
			getById: getById,
			getLayers: getLayers,
			getTopLayer: getTopLayer,
			closestLayerFromElement: closestLayerFromElement,
			searchInLayers: searchInLayers,
			searchUpInTreeByElement: searchUpInTreeByElement,
			addToLayers: addToLayers,
			popLayer: popLayer
		}
	}

	/* ngInject */
	function suaveDropdown (suLayers) {
		return {
			restrict: "E",
			templateUrl: 'dropdown.tmpl',
			transclude: true,
			replace: true,
			scope: true,
			link: function (scope, element, attrs) {
				suLayers.cacheElement(attrs.anchor, element);
			}
		};
	}

	/* ngInject */
	function suavePopup (suLayers) {
		return {
			restrict: "E",
			templateUrl: 'popup.tmpl',
			transclude: true,
			replace: true,
			scope: true,
			link: function (scope, element, attrs) {
				scope.config = attrs.config ? JSON.parse(attrs.config) : {};
				suLayers.cacheElement(attrs.anchor, element);
			}
		};
	}

	/* ngInject */
	function suaveTarget (suLayers) {
		return {
			restrict: "A",
			scope: true,
			link: function (scope, element, attrs) {
				angular.element(element).on('click', function (e) {
					e.stopPropagation();
					e.preventDefault();

					if (suLayers.getLayers().length > 0 && (
							element === suLayers.getTopLayer().caller ||
							suLayers.searchInLayers({caller: element}) || !suLayers.searchUpInTreeByElement(element)
						)) {
						suLayers.popLayer();
					} else {
						suLayers.addToLayers(attrs.suTarget, element);

						if (element[0].offsetWidth < 50) {
							// TODO: use scope property instead of "addClass"
							angular.element(suLayers.getTopLayer().element).addClass('su-tiny-wrap');
						}
					}
				});
			}
		};
	}

	angular.module('su-layers', [])
		.service('suLayers', suaveLayersService)
		.directive('suDropdown', suaveDropdown)
		.directive('suPopup', suavePopup)
		.directive('suTarget', suaveTarget);

})();
