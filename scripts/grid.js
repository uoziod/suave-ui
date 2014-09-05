(function() {

	/* ngInject */
	function suaveGridGuidelines($templateCache) {
		return {
			restrict: "A",
			link: function() {
				document.onkeydown = function (e) {
					if (e && 192 === e.keyCode && e.shiftKey && e.ctrlKey) {
						this.gridState = !this.gridState;

						if (this.gridState) {
							document.getElementsByTagName('BODY')[0].innerHTML += $templateCache.get('gridguide.tmpl');
						} else {
							document.getElementById('su-gridguide').remove();
						}
					}
				};
			}
		};
	}

	angular.module('su-grid', [])
		.directive('suGrid', suaveGridGuidelines);

})();
