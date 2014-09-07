(function () {

	/* ngInject */
	function suaveNotifierService ($templateCache, $compile, $rootScope, $timeout) {
		if (!document.getElementById('su-notifiers')) {
			document.getElementsByTagName('BODY')[0].innerHTML += '<div id="su-notifiers"></div>';
		}

		var $notifiersArea = document.getElementById('su-notifiers'),
			notifierId = 0;

		function push (text, config) {
			var templateInstance = angular.copy($templateCache.get('notifier.tmpl')),
				compileLink = $compile(templateInstance),
				$scope = $rootScope.$new(true);

			if (!config) {
				config = {};
			}

			if (!config.color) {
				config.color = 'default';
			}

			$scope.id = 'su-notifier-' + notifierId++;
			$scope.text = text;
			$scope.config = config;

			var item = compileLink($scope);

			angular.element($notifiersArea).append(item);

			$timeout(function() {
				angular.element(item).remove();
			}, 5000);

			return $scope.id;
		}

		return {
			push: push
		}
	}

	angular.module('su-notifier', [])
		.service('suNotifier', suaveNotifierService);

})();
