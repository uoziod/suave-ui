(function() {

	function initGridGuidelines() {
		return {
			restrict: "A",
			link: function() {
				document.onkeydown = function (e) {
					if (e && 192 === e.keyCode && e.shiftKey && e.ctrlKey) {
						this.gridState = !this.gridState;

						if (this.gridState) {
							document.getElementsByTagName('BODY')[0].innerHTML +=
								'<div id="grid-guidelines"><div class="wrap">' +
								'<div class="col-edge-1"><div class="box"><div class="inner"></div></div></div>' +
								'<div class="col-1"><div class="box"><div class="inner"></div></div></div>' +
								'<div class="col-1"><div class="box"><div class="inner"></div></div></div>' +
								'<div class="col-1"><div class="box"><div class="inner"></div></div></div>' +
								'<div class="col-1"><div class="box"><div class="inner"></div></div></div>' +
								'<div class="col-edge-1"><div class="box"><div class="inner"></div></div></div>' +
								'<div class="left-edge"></div><div class="right-edge"></div>' +
								'</div></div>';
						} else {
							document.getElementById('grid-guidelines').remove();
						}
					}
				};
			}
		};
	}

	angular.module('suave-ui', [])
		.directive('suaveGrid', initGridGuidelines);

})();
