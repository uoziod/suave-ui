(function () {

	angular.module('suave-ui', [
		'su-templates',
		'su-grid',
		'su-form',
		'su-button',
		'su-layers',
		'su-snackbar'
	]);

})();

angular.module("su-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("button.tmpl","<button ng-class=\"type\">\n	<span ng-if=\"icon\" class=\"su-icon fa {{icon}}\"></span>\n	<span class=\"su-text\">{{value}}</span>\n</button>\n");
$templateCache.put("dropdown.tmpl","<div class=\"su-dropdown\" ng-class=\"{\'su-dn\': !visible}\">\n	<div ng-if=\"loading\" class=\"su-spinner\">\n		<i class=\"fa fa-circle-o-notch fa-spin\"></i>\n	</div>\n	<span ng-if=\"!loading\" ng-transclude></span>\n</div>\n");
$templateCache.put("grid-guidelines.tmpl","<div id=\"su-gridguide\">\n	<div class=\"su-wrap\">\n		<div class=\"su-col-edge-1\">\n			<div class=\"su-box\">\n				<div class=\"su-inner\"></div>\n			</div>\n		</div>\n		<div class=\"su-col-1\">\n			<div class=\"su-box\">\n				<div class=\"su-inner\"></div>\n			</div>\n		</div>\n		<div class=\"su-col-1\">\n			<div class=\"su-box\">\n				<div class=\"su-inner\"></div>\n			</div>\n		</div>\n		<div class=\"su-col-1\">\n			<div class=\"su-box\">\n				<div class=\"su-inner\"></div>\n			</div>\n		</div>\n		<div class=\"su-col-1\">\n			<div class=\"su-box\">\n				<div class=\"su-inner\"></div>\n			</div>\n		</div>\n		<div class=\"su-col-edge-1\">\n			<div class=\"su-box\">\n				<div class=\"su-inner\"></div>\n			</div>\n		</div>\n		<div class=\"su-left-edge\"></div>\n		<div class=\"su-right-edge\"></div>\n	</div>\n</div>\n");
$templateCache.put("placeholder.tmpl","<span class=\"su-placeholder-wrap\">\n	<su-transclude></su-transclude>\n	<span class=\"su-placeholder su-left\" ng-if=\"position === \'left\'\"><span ng-bind-html=\"placeholder\"></span></span>\n	<span class=\"su-placeholder su-right\" ng-if=\"position === \'right\'\"><span ng-bind-html=\"placeholder\"></span></span>\n</span>\n");
$templateCache.put("popup.tmpl","<div class=\"su-popup\"\n     ng-class=\"{\n         \'su-no-padding\': config.noPadding,\n         \'su-with-menu\': config.menu\n     }\"\n     ng-show=\"visible\">\n	<div class=\"su-inner\"\n	     ng-style=\"{\n	         \'width\': config.customWidth + \'px\'\n	     }\">\n		<a ng-if=\"!config.noCloseButton\" class=\"su-close\" ng-click=\"close()\"><i class=\"fa fa-close\"></i></a>\n		<div ng-if=\"config.title\" class=\"su-title\"><h2>{{config.title}}</h2></div>\n		<div class=\"su-wrap\">\n			<div class=\"su-menu\"\n				 ng-if=\"config.menu\">\n				<ul>\n					<li ng-repeat=\"item in config.menu\"\n						class=\"{{item.type && \'su-\' + item.type}}\"\n						ng-class=\"{\'su-active\': section === item.target}\"\n						ng-click=\"item.type !== \'divider\' && setSection(item.target)\">\n						{{item.title}}\n					</li>\n				</ul>\n			</div>\n			<div class=\"su-container\">\n				<div ng-if=\"loading\" class=\"su-spinner\">\n					<i class=\"fa fa-circle-o-notch fa-spin\"></i>\n				</div>\n				<span ng-show=\"!loading\" ng-transclude></span>\n			</div>\n		</div>\n		<div class=\"su-clear\"></div>\n	</div>\n</div>\n");
$templateCache.put("section.tmpl","<div class=\"su-section\" ng-class=\"{\'su-visible\': visible}\" ng-transclude></div>\n");
$templateCache.put("select.tmpl","<span>\n	<span class=\"su-select\"\n	      ng-style=\"{\'width\': width + \'px\'}\"\n	      ng-class=\"{\'su-open\': visible}\">\n		<input type=\"hidden\" name=\"{{name}}\" value=\"{{selectedItemsValuesList}}\" />\n		<span class=\"su-current\" ng-class=\"className\">\n			<span class=\"su-inner\">\n				<span ng-if=\"selectedItems.length === 0 && !!maxSelection\">{{emptyValue || \'Nothing is selected\'}}</span>\n				<span ng-repeat=\"item in selectedItems\">\n					{{item.body}}<span ng-if=\"$index < selectedItems.length - 1\">, </span>\n				</span>\n				<i class=\"fa fa-caret-down\"></i>\n			</span>\n		</span>\n		<span class=\"su-options\">\n			<span class=\"su-option\"\n			      ng-repeat=\"option in optionsList\"\n			      ng-class=\"{\'su-selected\': option.isSelected}\"\n			      ng-click=\"select($event, option)\">\n				<input type=\"checkbox\"\n				       ng-if=\"!!maxSelection\"\n				       ng-model=\"option.isSelected\">\n				{{option.body}}\n			</span>\n		</span>\n	</span>\n</span>\n");
$templateCache.put("snackbar.tmpl","<div class=\"su-snackbar {{config.color}} animated\"\n     ng-class=\"{\n         \'fadeInUp\'               : !config.bottom,\n         \'fadeInDown\'             : config.bottom,\n         \'fadeOutUp su-slide-up\'  : remove && !config.bottom,\n         \'fadeOutDown su-slide-up\': remove && config.bottom\n     }\">\n	<a class=\"su-close\" ng-click=\"close()\"><span class=\"fa fa-times-circle\"></span></a>\n	{{text}}\n</div>\n");}]);
(function () {

	function suaveButtonIcon () {
		return {
			restrict: "A",
			templateUrl: 'button.tmpl',
			replace: true,
			scope: true,
			link: function (scope, element, attrs) {
				scope.value = attrs.value;
				scope.icon = attrs.suIcon || false;
				scope.type = attrs.buttonType ? 'su-' + attrs.buttonType : false;
			}
		};
	}

	angular.module('su-button', [])
		.directive('suIcon', suaveButtonIcon);

})();

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
	suavePlaceholder.$inject = ["$templateCache", "$timeout", "$sce"];

	/* ngInject */
	function suaveSelect ($templateCache, $document) {
		return {
			restrict: "E",
			scope: true,
			compile: function (tElement) {
				var self = this;

				tElement.replaceWith($templateCache.get('select.tmpl'));

				if (!self.elements) {
					self.elements = [];
				}

				$document.on('keydown', function (e) {
					if (e && e.keyCode === 27) {
						angular.forEach(self.elements, function(element) {
							var eScope = angular.element(element).scope();
							eScope.visible = false;
							eScope.$apply();
						});
					}
				});

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

					scope.optionsList = [];

					var selectedIndex = 0;

					for (var i = 0, len = optionsNodes.length; i < len; i++) {
						if (optionsNodes[i].selected) {
							selectedIndex = i;
						}

						scope.optionsList.push({
							index: i,
							value: optionsNodes[i].value,
							body: optionsNodes[i].innerHTML,
							isSelected: optionsNodes[i].selected
						});
					}

					scope.className = attrs.class;
					scope.name = attrs.name;
					scope.width = attrs.suWidth;
					scope.minSelection = parseInt(attrs.suMin, 10);
					scope.maxSelection = attrs.suMax;
					scope.emptyValue = attrs.suEmptyValue;

					updateSelectedItems();

					scope.select = function($event, option) {
						if (!angular.isUndefined(scope.maxSelection)) {
							$event.stopPropagation();
						}

						if (angular.isUndefined(scope.maxSelection)) {
							angular.forEach(scope.optionsList, function(option) {
								option.isSelected = false;
							});
						}

						option.isSelected = !option.isSelected;
						if (scope.selectedItems.length === scope.minSelection && !option.isSelected) {
							option.isSelected = !option.isSelected;
						}
						if (!angular.isUndefined(scope.maxSelection) && parseInt(scope.maxSelection, 10) > 0 && scope.selectedItems.length === parseInt(scope.maxSelection, 10) && option.isSelected) {
							option.isSelected = !option.isSelected;
						}

						updateSelectedItems();
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

					function updateSelectedItems () {
						scope.selectedItems = [];
						scope.selectedItemsValuesList = '';

						angular.forEach(scope.optionsList, function(option) {
							if (option.isSelected) {
								scope.selectedItems.push(option);
								scope.selectedItemsValuesList += option.value + ',';
							}
						});

						if (scope.selectedItemsValuesList.length > 0) {
							scope.selectedItemsValuesList = scope.selectedItemsValuesList.substring(0, scope.selectedItemsValuesList.length - 1)
						}

						if (angular.isUndefined(scope.maxSelection) && scope.selectedItems.length === 0) {
							scope.optionsList[0].isSelected = true;
							updateSelectedItems();
						}
					}
				}
			}
		}
	}
	suaveSelect.$inject = ["$templateCache", "$document"];

	angular.module('su-form', [])
		.directive('suPlaceholder', suavePlaceholder)
		.directive('suPlaceholderRight', suavePlaceholder)
		.directive('suSelect', suaveSelect);

})();

(function () {

	/* ngInject */
	function suaveGridGuidelines ($templateCache, $document) {
		return {
			restrict: "A",
			link: function () {
				$document.on('keydown', function (e) {
					if (e && e.keyCode === 192 && e.shiftKey && e.ctrlKey) {
						this.gridState = !this.gridState;

						if (this.gridState) {
							angular.element(document.getElementsByTagName('BODY')).append($templateCache.get('grid-guidelines.tmpl'));
						} else {
							angular.element(document.getElementById('su-gridguide')).remove();
						}
					}
				});
			}
		};
	}
	suaveGridGuidelines.$inject = ["$templateCache", "$document"];

	angular.module('su-grid', [])
		.directive('suGrid', suaveGridGuidelines);

})();

(function () {

	/* ngInject */
	function suaveLayersService ($rootScope, $document) {
		var self = this;

		self._elements = {};
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

		function cacheElement (id, element, attrs) {
			self._elements[id] = {
				element: element,
				attrs: attrs
			};
		}

		function getById (id) {
			if (!angular.isUndefined(self._elements[id])) {
				return self._elements[id].element;
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
			var cachedItem = self._elements[id];

			if (cachedItem) {
				var element = angular.element(cachedItem.element),
					$element = element.scope();

				if (typeof $element[cachedItem.attrs.suOpen] === 'function') {
					$element[cachedItem.attrs.suOpen]();
				}

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
				console.warn('Layered element "' + id + '" not found');
			}
		}

		function popLayer (skipApply) {
			if (self._layers.length > 0) {
				var topItem = self._layers[self._layers.length - 1],
					cachedItem = self._elements[topItem.id],
					$element = angular.element(getTopLayer().element).scope();

				if (typeof $element[cachedItem.attrs.suClose] === 'function') {
					$element[cachedItem.attrs.suClose]();
				}

				$element.visible = false;

				if (!skipApply) {
					$element.$apply();
				}

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
	suaveLayersService.$inject = ["$rootScope", "$document"];

	/* ngInject */
	function suaveDropdown (suLayers) {
		return {
			restrict: "E",
			templateUrl: 'dropdown.tmpl',
			transclude: true,
			replace: true,
			scope: true,
			priority: 5,
			link: function (scope, element, attrs) {
				suLayers.cacheElement(attrs.suAnchor, element, attrs);
			}
		};
	}
	suaveDropdown.$inject = ["suLayers"];

	/* ngInject */
	function suavePopup ($rootScope, suLayers) {
		return {
			restrict: "E",
			templateUrl: 'popup.tmpl',
			transclude: true,
			replace: true,
			scope: true,
			priority: 5,
			link: function (scope, element, attrs) {
				scope.config = attrs.suConfig ? JSON.parse(attrs.suConfig) : {};

				scope.setSection = function(section) {
					scope.section = section;
					if (scope.prevSeciton !== scope.section) {
						$rootScope.$emit('suSetSection', section);
					}
					scope.prevSeciton = section;
				};

				if (scope.config.menu) {
					scope.setSection(scope.config.menu[0]['target']);
				}

				scope.close = function() {
					suLayers.popLayer(true);
				};

				suLayers.cacheElement(attrs.suAnchor, element, attrs);
			}
		};
	}
	suavePopup.$inject = ["$rootScope", "suLayers"];

	function suaveSection ($rootScope) {
		return {
			restrict: "E",
			templateUrl: 'section.tmpl',
			transclude: true,
			replace: true,
			scope: true,
			priority: 10,
			link: function (scope, element, attrs) {
				$rootScope.$on('suSetSection', function(event, section) {
					scope.visible = section === attrs.suAnchor;

					if (scope.visible) {
						if (typeof scope[attrs.suOpen] === 'function') {
							scope[attrs.suOpen]();
						}

						if (
							!angular.isUndefined($rootScope.suPreviousView) &&
							typeof scope[$rootScope.suPreviousView.attrs.suClose] === 'function'
						) {
							scope[$rootScope.suPreviousView.attrs.suClose]();
						}

						$rootScope.suPreviousView = {
							section: section,
							attrs: attrs
						};
					}
				});
			}
		};
	}
	suaveSection.$inject = ["$rootScope"];

	/* ngInject */
	function suaveTarget (suLayers) {
		return {
			restrict: "A",
			scope: true,
			priority: 10,
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
							angular.element(suLayers.getTopLayer().element).addClass('su-tiny-wrap');
						}
					}
				});
			}
		};
	}
	suaveTarget.$inject = ["suLayers"];

	angular.module('su-layers', [])
		.service('suLayers', suaveLayersService)
		.directive('suDropdown', suaveDropdown)
		.directive('suPopup', suavePopup)
		.directive('suSection', suaveSection)
		.directive('suTarget', suaveTarget);

})();

(function () {

	var ANIMATION_SPEED = 200;

	/* ngInject */
	function suaveSnackbarService($templateCache, $compile, $rootScope, $timeout) {
		if (!document.getElementById('su-snackbars')) {
			angular.element(document.getElementsByTagName('BODY')).append('<div class="su-snackbars" id="su-snackbars"></div>');
			angular.element(document.getElementsByTagName('BODY')).append('<div class="su-snackbars" id="su-snackbars-bottom"></div>');
		}

		var $snackbarsArea = document.getElementById('su-snackbars'),
			$snackbarsAreaBottom = document.getElementById('su-snackbars-bottom'),
			snackbarIndex = 0;

		function push(text, config, callback) {
			var templateInstance = angular.copy($templateCache.get('snackbar.tmpl')),
				compileLink = $compile(templateInstance),
				$scope = $rootScope.$new(true);

			if (!config) {
				config = {};
			}

			if (!config.color) {
				config.color = 'default';
			}

			config.color = 'su-' + config.color;

			angular.extend($scope, {
				id: 'su-snackbar-' + snackbarIndex,
				text: text,
				config: config
			});

			var item = compileLink($scope);

			if (config.bottom) {
				angular.element($snackbarsAreaBottom).prepend(item);
			} else {
				angular.element($snackbarsArea).append(item);
			}

			item
				.on('mouseover', function () {
					$timeout.cancel($scope.timeout);
				})
				.on('mouseout', function () {
					initItemRemoval();
				});

			$scope.close = function() {
				$scope.remove = true;

				if (typeof callback === "function") {
					callback();
				}

				$timeout(function () {
					angular.element(item).remove();
				}, ANIMATION_SPEED);
			};

			initItemRemoval();

			function initItemRemoval() {
				$scope.timeout = $timeout($scope.close, config.timeout || 5000);
			}

			snackbarIndex++;

			return $scope.id;
		}

		function clear() {
			angular.forEach(document.getElementsByClassName('su-snackbar'), function(snackbar) {
				$timeout.cancel(angular.element(snackbar).scope().timeout);
				angular.element(snackbar).scope().close();
			});
		}

		return {
			push: push,
			clear: clear
		}
	}
	suaveSnackbarService.$inject = ["$templateCache", "$compile", "$rootScope", "$timeout"];

	angular.module('su-snackbar', [])
		.service('suSnackbar', suaveSnackbarService);

})();

//# sourceMappingURL=app.js.map