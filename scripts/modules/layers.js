(function () {

  'use strict';

  /* ngInject */
  function suaveLayersService ($rootScope, $document) {

    /*jshint validthis:true */
    var self = this;

    self._elements = {};
    self._layers = [];

    $rootScope.$on('$routeChangeStart', function () {
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
          !searchUpInTreeByElement(e.target) || !angular.equals(closestLayerFromElement(e.target), getTopLayer().element) ||
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

    function setScrollState () {
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
    };
  }

  /* ngInject */
  function suaveDropdown (suLayers) {
    return {
      restrict: 'E',
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

  /* ngInject */
  function suavePopup ($rootScope, suLayers) {
    return {
      restrict: 'E',
      templateUrl: 'popup.tmpl',
      transclude: true,
      replace: true,
      scope: true,
      priority: 5,
      link: function (scope, element, attrs) {
        scope.config = attrs.suConfig ? JSON.parse(attrs.suConfig) : {};

        scope.setSection = function (section) {
          scope.section = section;
          if (scope.prevSeciton !== scope.section) {
            $rootScope.$emit('suSetSection', section);
          }
          scope.prevSeciton = section;
        };

        if (scope.config.menu) {
          scope.setSection(scope.config.menu[0].target);
        }

        scope.close = function () {
          suLayers.popLayer(true);
        };

        suLayers.cacheElement(attrs.suAnchor, element, attrs);
      }
    };
  }

  function suaveSection ($rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'section.tmpl',
      transclude: true,
      replace: true,
      scope: true,
      priority: 10,
      link: function (scope, element, attrs) {
        $rootScope.$on('suSetSection', function (event, section) {
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

  /* ngInject */
  function suaveTarget (suLayers) {
    return {
      restrict: 'A',
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

  angular.module('su-layers', [])
    .service('suLayers', suaveLayersService)
    .directive('suDropdown', suaveDropdown)
    .directive('suPopup', suavePopup)
    .directive('suSection', suaveSection)
    .directive('suTarget', suaveTarget);

})();
