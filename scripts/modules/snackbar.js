(function () {

  'use strict';

  var ANIMATION_SPEED = 200;

  /* ngInject */
  function suaveSnackbarService ($templateCache, $compile, $rootScope, $timeout) {
    if (!document.getElementById('su-snackbars')) {
      angular.element(document.getElementsByTagName('BODY')).append('<div class="su-snackbars" id="su-snackbars"></div>');
      angular.element(document.getElementsByTagName('BODY')).append('<div class="su-snackbars" id="su-snackbars-bottom"></div>');
    }

    var $snackbarsArea = document.getElementById('su-snackbars'),
      $snackbarsAreaBottom = document.getElementById('su-snackbars-bottom'),
      snackbarIndex = 0;

    function push (text, config, callback) {
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

      $scope.close = function () {
        $scope.remove = true;

        if (typeof callback === 'function') {
          callback();
        }

        $timeout(function () {
          angular.element(item).remove();
        }, ANIMATION_SPEED);
      };

      initItemRemoval();

      function initItemRemoval () {
        $scope.timeout = $timeout($scope.close, config.timeout || 5000);
      }

      snackbarIndex++;

      return $scope.id;
    }

    function clear () {
      angular.forEach(document.getElementsByClassName('su-snackbar'), function (snackbar) {
        $timeout.cancel(angular.element(snackbar).scope().timeout);
        angular.element(snackbar).scope().close();
      });
    }

    return {
      push: push,
      clear: clear
    };
  }

  angular.module('su-snackbar', [])
    .service('suSnackbar', suaveSnackbarService);

})();
