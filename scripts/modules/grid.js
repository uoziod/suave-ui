(function () {

  'use strict';

  /* ngInject */
  function suaveGridGuidelines ($templateCache, $document) {
    return {
      restrict: 'A',
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

  angular.module('su-grid', [])
    .directive('suGrid', suaveGridGuidelines);

})();
