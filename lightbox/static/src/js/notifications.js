(function($) {
	var requestRunning = false;

	$.fn.notify = function(options) {

		var default_options = {
			'position': {
				'top': '5%',
				'left': '75%'
			},
			'type': 'default',
			'duration': 5000,
			'text': '',
			'animate': true,
			'close_button': false
		};

		var settings = $.extend(default_options, options);

		if (!requestRunning) {
			requestRunning = true;

			var element = $('<div>');
			$('body').append(element);

			var types = ['error', 'default', 'success'];

			var methods = {

				getType: function() {
					if (options !== undefined) {
						if ((options.type !== undefined) && ($.inArray(options.type, types) < 0)) {
							throw "Choice a type among 'success', 'default' or 'error', or leave blank the variable";
						}
					}
				},

				closeButton: function() {
					if (settings.close_button) {
						element.append('<span class="close-button">x</span>');
						$('.close-button').click(function() {
							element.fadeOut().remove();
							requestRunning = false;
						});
					} else {
						return false;
					}
				},

				init: function() {

					try {
						if (options.type) {
							element.removeClass().addClass('notify notify-' + options.type);
						} else {
							element.addClass('notify-' + default_options.type);
						}

						if (options['text']) {
							element.html(options.text);
						}

					} catch (e) {
						return null;
					}


					element.css({
						'left': settings.position.left + '%',
						'display': 'block'
					});

					this.getType();
					this.closeButton();

					if (settings.animate) {

						element.animate({
							top: "0%",
							opacity: 0.13
						}, {
							duration: 150
						}).animate({
							opacity: 0.88,
							top: parseInt(settings.position.top) + 2 + "%",
						}, {
							duration: 150
						}).animate({
							top: parseInt(settings.position.top) - 3 + "%",
						}, {
							duration: 650
						}).animate({
							opacity: 1,
							top: parseInt(settings.position.top) + 1 + "%",
						}, {
							duration: 550
						}).animate({
							opacity: 1,
						}, {
							duration: settings.duration
						}).animate({
							opacity: 0.99
						}, {
							duration: 150
						}).animate({
							opacity: 0.66
						}, {
							duration: 100
						}).animate({
							opacity: 0.33
						}, {
							duration: 50
						}).animate({
							opacity: 0,
						}, {
							duration: 100,
							complete: function() {
								element.css({
									'display': 'none',
									'top': '0%'
								}).remove();
								requestRunning = false;
							}
						});
					} else {

						element.css({
							'opacity': 1,
							'top': settings.position.top
						});

						setTimeout(function() {
							element.remove();
							requestRunning = false;
						}, settings.duration);

					}
				}
			};
			methods.init();
		}
	};
})(jQuery);