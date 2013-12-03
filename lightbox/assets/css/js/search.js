/*

Digital Lightbox | Giancarlo Buomprisco, 2013.
https://github.com/Gbuomprisco/Digital-Lightbox/tree/development
giancarlobuomprisco.com

*/


$(document).ready(function() {

	(function() {

		var default_options = {
			input: '#search'
		};

		var search = {
			first_requestRunning: false,

			init: function() {
				if (this.first_requestRunning) { // don't do anything if an AJAX request is pending
					return;
				}
				var input = $(default_options.input);
				var button = $('#search_button');
				var n = 5;
				var ajax_loader = $('#ajax-loader');

				function load_data() {
					var data = {
						'pattern': input.val(),
						'n': n
					};
					$.ajax({
						type: 'POST',
						url: '/search/',
						data: data,
						beforeSend: function() {
							ajax_loader.fadeIn();
						},
						success: function(data) {
							if (data != "False") {
								var images = '';
								var count = data['count'];
								var data_manuscripts = data['manuscripts'];
								for (i = 0; i < data_manuscripts.length; i++) {
									images += '<div data-size = "' + data_manuscripts[i][5] + '" data-title = "' + data_manuscripts[i][2] + '" class="col-lg-4 col-md-4 col-xs-4 image" id = "' + data_manuscripts[i][1] + '">' + data_manuscripts[i][0] +
										"<div class='col-lg-8 col-md-8 col-xs-8 offset1 image_desc'><table class='table'><tr><th>Manuscript</th><th>Repository</th><th>Place</th></tr><tr><td>" + data_manuscripts[i][2] + "</td><td>" + data_manuscripts[i][3] +
										"</td><td>" + data_manuscripts[i][4] + "</td></tr></table></div></div>";
								}
								$('#images_container').html(images);
								$('#results_counter').hide().fadeIn().html("<span class='label label-default'>Results: " + count + "</span>");
							} else {
								$('body').append("<div id='notification_search' class='notify notify-error'>You should insert at least one search term</div>");
								$('#notification_search').notify({
									"close-button": false,
									"position": {
										'top': "8%",
										'left': '80%'
									}
								});
							}
						},
						complete: function() {
							this.first_requestRunning = false;
							$('.image').click(function() {
								$.imagesBox.select_image($(this));
							});
							$('#load_more').attr('disabled', false).click(load_scroll);


							$('#images_container').data('requestRunning', false);

							function load_scroll() {
								if ($(this).data('requestRunning')) { // don't do anything if an AJAX request is pending
									return;
								}

								data.x = data.n;
								data.n += 5;
								$.ajax({
									type: 'POST',
									url: '/search/',
									data: data,
									beforeSend: function() {
										$('#ajax-loader').fadeIn();
									},
									success: function(data) {
										if (data != "False") {
											var data = data['manuscripts'];
											for (i = 0; i < data.length; i++) {
												image = '<div data-size = "' + data[i][5] + '" data-title = "' + data[i][2] + '" class="col-lg-4 col-md-4 col-xs-4 image" id = "' + data[i][1] + '">' + data[i][0] +
													"<div class='col-lg-8 col-md-8 col-xs-8 offset1 image_desc'><table class='table'><tr><th>Manuscript</th><th>Repository</th><th>Place</th></tr><tr><td>" + data[i][2] + "</td><td>" + data[i][3] +
													"</td><td>" + data[i][4] + "</td></tr></table></div></div>";
												$('#images_container').append(image);

											}


										} else {
											$('body').append("<div id='notification_search' class='notify notify-error'>You should insert at least one search term</div>");
											$('#notification_search').notify({
												"close-button": false,
												"position": {
													'top': "8%",
													'left': '80%'
												}
											});
										}
									},
									complete: function(data) {
										$(this).data('requestRunning', false);

										$('.image').unbind('click');
										$('.image').click(function() {
											$.imagesBox.select_image($(this));
										});
										$('.image img').on('load', function() {
											ajax_loader.fadeOut();
										});
									}

								});
							}

							function isScrollBottom(div) {
								if ((div.scrollTop + div.clientHeight == div.scrollHeight) || (div.scrollTop + div.clientHeight > div.scrollHeight)) {
									return true;
								}
							}
							var div = document.getElementById('images_container');
							$('#images_container').scroll(function() {
								if (isScrollBottom(div)) {
									load_scroll();
									ajax_loader.fadeOut();
								}
							});
							$(this).data('requestRunning', true);
							$('.image img').on('load', function() {
								ajax_loader.fadeOut();
							});
						},

						error: function() {
							$('body').append("<div id='notification_search' class='notify notify-error'>Something went wrong. Try again.</div>");
							$('#notification_search').notify({
								"close-button": false,
								"position": {
									'top': "8%",
									'left': '80%'
								}
							});
						}
					});
					this.first_requestRunning = true;
					return false;
				}
				button.click(load_data);
			}
		}
		search.init(default_options);
	})();

});