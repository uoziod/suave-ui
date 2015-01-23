(function () {

  'use strict';

  /* ngInject */
  function suavePlaceholder ($templateCache, $timeout, $sce) {
    return {
      restrict: 'A',
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

            angular.element(placeholder).bind('mousedown', function (e) {
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
  function suaveSelect ($templateCache, $document) {
    return {
      restrict: 'E',
      scope: true,
      compile: function (tElement) {
        var self = this;

        tElement.replaceWith($templateCache.get('select.tmpl'));

        if (!self.elements) {
          self.elements = [];
        }

        $document.on('keydown', function (e) {
          if (e && e.keyCode === 27) {
            angular.forEach(self.elements, function (element) {
              var eScope = angular.element(element).scope();
              eScope.visible = false;
              eScope.$apply();
            });
          }
        });

        if (!self.doOnce) {
          angular.element(document).on('click', function () {
            for (var i = 0, len = self.elements.length; i < len; i++) {
              angular.element(self.elements[i]).scope().visible = false;
              angular.element(self.elements[i]).scope().$apply();
            }
          });

          self.doOnce = true;
        }

        return function (scope, element, attrs) {
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

          scope.select = function ($event, option) {
            if (!angular.isUndefined(scope.maxSelection)) {
              $event.stopPropagation();
            }

            if (angular.isUndefined(scope.maxSelection)) {
              angular.forEach(scope.optionsList, function (option) {
                option.isSelected = false;
              });
            }

            option.isSelected = !option.isSelected;

            if (scope.selectedItems.length === scope.minSelection && !option.isSelected) {
              option.isSelected = !option.isSelected;
            }

            if (
              !angular.isUndefined(scope.maxSelection) &&
              parseInt(scope.maxSelection, 10) > 0 && scope.selectedItems.length === parseInt(scope.maxSelection, 10) && option.isSelected
            ) {
              option.isSelected = !option.isSelected;
            }

            updateSelectedItems();
          };

          scope.checkboxDiversion = function (option) {
            option.isSelected = !option.isSelected;
          };

          angular.element(element).on('click', function (e) {
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

            angular.forEach(scope.optionsList, function (option) {
              if (option.isSelected) {
                scope.selectedItems.push(option);
                scope.selectedItemsValuesList += option.value + ',';
              }
            });

            if (scope.selectedItemsValuesList.length > 0) {
              scope.selectedItemsValuesList = scope.selectedItemsValuesList.substring(0, scope.selectedItemsValuesList.length - 1);
            }

            if (angular.isUndefined(scope.maxSelection) && scope.selectedItems.length === 0) {
              scope.optionsList[0].isSelected = true;
              updateSelectedItems();
            }
          }
        };
      }
    };
  }

  angular.module('su-form', [])
    .directive('suPlaceholder', suavePlaceholder)
    .directive('suPlaceholderRight', suavePlaceholder)
    .directive('suSelect', suaveSelect);

})();
