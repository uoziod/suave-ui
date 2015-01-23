(function () {

  'use strict';

  function suaveButtonIcon () {
    return {
      restrict: 'A',
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
