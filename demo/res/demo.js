(function () {

  'use strict';

  angular.module('demo', ['suave-ui'])
    .controller('DemoController', function ($scope, $timeout, suSnackbar) {
      $scope.notify = function (text, config) {
        var snackbarId = suSnackbar.push(text, config, function () {
          console.log('<- Snackbar ' + snackbarId + ' closed');
        });
        console.log('-> Snackbar ' + snackbarId + ' opened');
      };

      $scope.removeSnackbars = function () {
        suSnackbar.clear();
      };

      $scope.onOpen = function () {
        console.log('onOpen');
        $scope.loading = true;

        $scope.timeout = $timeout(function () {
          $scope.loading = false;
        }, 1000);
      };

      $scope.onClose = function () {
        console.log('onClose');
        $timeout.cancel($scope.timeout);
        $scope.loading = false;
      };
    });

}());
