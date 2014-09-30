angular.module('demo', ['suave-ui'])
	.controller('demoController', function($scope, suSnackbar) {
		$scope.notify = function(text, config) {
			var snackbarId = suSnackbar.push(text, config, function() {
				console.log('<- Snackbar ' + snackbarId + ' closed');
			});
			console.log('-> Snackbar ' + snackbarId + ' opened');
		};
	});
