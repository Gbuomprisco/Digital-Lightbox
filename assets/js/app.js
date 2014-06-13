/*

Digital Lightbox | Giancarlo Buomprisco, 2013.
https://github.com/Gbuomprisco/Digital-Lightbox
giancarlobuomprisco.com

*/



// Main Constructor

function Lightbox(options) {

	this.defaults = {
		'development': true
	};

	if (options) {
		$.extend(this.defaults, options);
	}

	// Toolbox class
	this.toolbar = {

		_self: this,

		// Initialize the class, makes the options
		init: function(options) {

			this.default_options = {
				'id': 'toolbar',
				'container': 'body'
			};

			$.extend(this.default_options, options);

		},

		// Check if the toolbar has been initialized
		exists: function() {
			try {

				if (($('#toolbar').length)) {
					return true;
				} else {
					return false;
				}

			} catch (e) {
				return false;
			}

		},

		// Create the structure of the toolbar and put it on the screen
		create: function(options) {

			if (!(this.exists()) && (_self.images_on_workspace().length)) {
				$('body').append('<div id="toolbar"></div>');
				this.toolbox = $('#toolbar');
				this.makeTools();
				this.toolbox.show();
			} else {
				console.warn('Toolbar not initialized, or no images on workspace');
			}

		},


		// Disable all toolbar contols
		disable: function() {
			$('#slider_brightness').slider('option', 'disabled', true);
			$('#slider_rotate').slider('option', 'disabled', true);
			$('#slider').slider('option', 'disabled', true);
			$('#slider_size').slider('option', 'disabled', true);
			$('#grayscale').attr('disabled', 'disabled');
			$('#invert').attr('disabled', 'disabled');
			$('#contrast').attr('disabled', 'disabled');
			$('#createComment').attr('disabled', 'disabled');
			$('#toolbar button').addClass('disabled').attr('disabled', true);
			$('#name_image').html("No images selected");
			$('#crop_image').fadeOut();
			$('#toolbar_compare').attr('disabled', 'disabled');
			$('.crop_button').removeClass('active');
			$('#select_all').attr('disabled', false).removeClass('disabled');
		},

		// Enable all toolbar contols
		enable: function() {
			$('#slider_brightness').slider('option', 'disabled', false);
			$('#slider_rotate').slider('option', 'disabled', false);
			$('#slider').slider('option', 'disabled', false);
			$('#slider_size').slider('option', 'disabled', false);
			$('#grayscale').attr('disabled', false);
			$('#invert').attr('disabled', false);
			$('#contrast').attr('disabled', false);
			$('#createComment').attr('disabled', false);
			$('#toolbar button').removeClass('disabled').attr('disabled', false);

		},

		// Load toolbar template
		makeTools: function() {
			var tools = this.toolbox.load('/static/js/tools_template.html', function() {
				_self.toolbar.buttons();
				_self.toolbar.stylize();
				if (document.body.style.webkitFilter === undefined) {
					$('#contrast').remove();
				}
				_self.crop.init();
				_self.toolbar.refresh();
			});

		},

		// Set opacity slider function
		opacity: function() {

			$("#slider").slider({
				slide: function(event, ui) {
					if (_self.images_on_workspace().length) {

						var opacity = (ui.value / 100);
						$.each(_self.select_group.imagesSelected, function() {
							var mini_image = $("#mini_" + this.attr('id'));
							this.children().children('img').css('opacity', opacity);
							mini_image.css('opacity', opacity);
						});
					}
				}
			});

		},

		brightness: function() {

			$("#slider_brightness").slider({
				min: 100,
				max: 300,
				value: 200,
				slide: function(event, ui) {
					$.each(_self.select_group.imagesSelected, function() {
						if (_self.images_on_workspace().length) {
							var mini_image = $("#mini_" + this.attr('id'));
							if (document.body.style.webkitFilter !== undefined) {
								this.css('-webkit-filter', 'brightness(' + ui.value / 2 + '%)');
								mini_image.css('-webkit-filter', 'brightness(' + ui.value / 2 + '%)');
							} else {
								this.css('polyfilter', 'brightness(' + ui.value / 2 + '%)');
								mini_image.css('-webkit-filter', 'brightness(' + ui.value / 2 + '%)');
							}
						}
					});
				}
			});


		},

		rotate: function() {

			$("#slider_rotate").slider({
				min: -180,
				max: 180,
				value: 0,
				step: 6,
				slide: function(event, ui) {
					$.each(_self.select_group.imagesSelected, function() {
						var mini_image = $("#mini_" + this.attr('id'));
						this.css('transform', 'rotate(' + ui.value + 'deg)');
						mini_image.css('transform', 'rotate(' + ui.value + 'deg)');
					});
				}
			});


		},

		apply_filter: function(button, filter, toggle) {

			var imagesSelected = _self.select_group.imagesSelected;
			if (toggle !== undefined && !toggle) {

				$.each(imagesSelected, function() {
					var mini_image = $("#mini_" + this.attr('id'));
					this.children().children('img').removeClass(filter);
					mini_image.removeClass(filter);
					button.removeClass('active');
				});

			} else {
				if (!button.hasClass('active')) {

					$.each(imagesSelected, function() {
						var mini_image = $("#mini_" + this.attr('id'));
						if (!(this.children().children('img').hasClass(filter))) {
							this.children().children('img').addClass(filter);
							mini_image.addClass(filter);
						}
						button.addClass('active');
					});

				} else {

					$.each(imagesSelected, function() {
						var mini_image = $("#mini_" + this.attr('id'));
						if ((this.children().children('img').hasClass(filter))) {
							this.children().children('img').removeClass(filter);
							mini_image.removeClass(filter);
						}
						button.removeClass('active');
					});

				}
			}
		},

		size: function() {
			$('#slider_size').slider({
				min: 10,
				max: 2000,
				value: 180,
				slide: function(event, ui) {
					$.each(_self.select_group.imagesSelected, function() {

						var calc_width = ui.value;

						this.children().css({
							'width': calc_width
						});

						this.css({
							'width': calc_width
						});

						this.children().children('img').css({
							'width': calc_width
						});

						var position = this.offset();

						if (position['top'] < $(window).scrollTop() || position['left'] < $(window).scrollLeft()) {
							this.animate({
								"top": $(window).scrollTop() + 100,
								"left": $(window).scrollLeft() + 100
							}, 150);
						}

						$('#mini_' + this.attr('id')).animate({
							'width': parseInt(this.children().children('img').css('width')) / 40 + "px",
							'height': parseInt(this.children().children('img').css('height')) / 30 + "px"
						}, 10);

					});
				}
			});



			this.refreshSize();

		},

		compare_toolbar: function() {
			var images = $('.selected');
			if (images.length == 2) {

				var image_src1 = $(images[0]).find('img');
				var image_src2 = $(images[1]).find('img');
				var images_urls = [image_src1.attr('src'), image_src2.attr('src')];

				$.ajax({
					type: 'POST',
					url: 'return_base64/',
					data: {
						'images': JSON.stringify(images_urls)
					},

					success: function(data) {
						var img1 = $("<img>");
						var img2 = $("<img>");

						img1.attr({
							'src': data[0],
							'width': image_src1.css('width'),
							'id': 'image_compare1'
						}).css({
							'display': 'none'
						});

						img2.attr({
							'src': data[1],
							'width': image_src2.css('width'),
							'id': 'image_compare2'
						}).css({
							'display': 'none'
						});
						console.log(img1);
						$("body").append(img1);
						$("body").append(img2);

						var image1 = document.getElementById('image_compare1');

						var image2 = document.getElementById('image_compare2');

						resemble(image1).compareTo(image2).onComplete(function(data) {
							result = data;
						}).ignoreAntialiasing();

						img1.remove();
						img2.remove();

						_self.letters.show_comparison(result);
					}
				});

			} else {
				$.fn.notify({
					'type': 'error',
					"close-button": true,
					'text': 'Choice two images to compare.'
				});
			}
		},

		clone: function() {
			var id = uniqueid();
			var images = _self.select_group.imagesSelected;
			var workspace = _self.workspaceImages.workspace;
			for (var i = 0; i < images.length; i++) {
				var image = $(images[i]);
				var new_image = image.clone(false).attr('id', id);
				new_image.data('is_clone', true);
				new_image.data('title', image.data('title') + " (clone)");
				new_image.data('original', image.attr('id'));
				new_image.data('selected', false);
				new_image.removeClass('selected');
				new_image.css({
					'position': 'absolute',
					'left': image.position().left + image.children().children('img').css('width') + 10,
					'top': image.css('top')
				});
				_self.select_group.select(new_image);
				new_image.draggable(_self.workspaceImages.draggableOptions);
				$('#' + workspace).append(new_image);
			}
		},

		selectAll: function() {

			var images = $('.image_active');
			_self.select_group.imagesSelected = [];

			$.each(images, function() {


				$(this).addClass('selected');
				$(this).data('selected', true);
				$(this).draggable({
					alsoDrag: ".selected"
				});

				$(this).find('img').resizable({
					aspectRatio: true,
					animate: true,
					alsoResize: '.selected, .selected > div, .selected > div > img',
					resize: function(event, ui) {
						if (_self.select_group.imagesSelected.length <= 1) {
							$('#mini_' + ui.element.parent().attr('id')).animate({
								'width': parseInt($(this).css('width')) / 65 + "px",
								'height': parseInt($(this).css('height')) / 55 + "px"
							}, 10);
						} else {
							$.each($('.selected'), function() {
								$('#mini_' + $(this).attr('id')).animate({
									'width': parseInt($(this).children().css('width')) / 65 + "px",
									'height': parseInt($(this).children().css('height')) / 55 + "px"
								}, 10);
							});
						}
						_self.toolbar.refreshSize();
					}
				});
				$(this).find('.ui-wrapper').css('boxShadow', '0px 0px 30px rgba(255, 246, 9, 1)');
				_self.select_group.imagesSelected.push($(this));

			});

			if ($('#open_notes').length) {
				$(this).fadeOut().remove();
			}

			this.refresh();

			if (_self.select_group.imagesSelected.length == 1) {
				$('.crop_button').removeClass('disabled');
				$('#createComment').removeClass('disabled').click(function() {
					var id = _self.select_group.imagesSelected[0].attr('id');
					_self.comments.init(false, id, false, false, false, false, false, false);
				});

				_self.comments.check_notes();

			} else {
				$('.crop_button').addClass('disabled');
				$('#createComment').addClass('disabled');
				$('#open_notes').fadeOut().remove();
			}
		},

		deselectAll: function() {
			var images = $('.image_active');

			$.each(images, function() {

				$(this).children().css('box-shadow', 'none');
				$(this).removeClass('selected');
				$(this).data('selected', false);

				$(this).draggable({
					alsoDrag: false
				});

				$(this).children().children('img').resizable('destroy');

				_self.select_group.imagesSelected = [];
			});

			$('#open_notes').fadeOut().remove();
			this.refresh();
		},

		reset: function() {
			$.each(_self.select_group.imagesSelected, function() {
				var mini_image = $("#mini_" + this.attr('id'));
				var size = this.data('size').split(',');

				this.children().css({
					'width': "180px",
					'height': "auto"
				});

				if (document.body.style.webkitFilter !== undefined) {

					this.css({
						'width': "180px",
						'height': "auto",
						'transform': "rotate(0deg)",
						'-webkit-filter': 'brightness(100%)'
					});

				} else {

					this.css({
						'width': "180px",
						'height': "auto",
						'transform': "rotate(0deg)",
						'polyfilter': 'brightness(100%)'
					});

				}

				this.children().children('img').css({
					'width': "180px",
					'height': "auto",
					'opacity': 1
				});

				mini_image.css({
					'transform': "rotate(0deg)"
				});

				var position = this.offset();

				if (position['top'] < $(window).scrollTop() || position['left'] < $(window).scrollLeft()) {
					this.animate({
						"top": $(window).scrollTop() + 100,
						"left": $(window).scrollLeft() + 100
					}, 150);
				}

				$('#mini_' + this.attr('id')).animate({
					'width': parseInt(this.children().children('img').css('width')) / 40 + "px",
					'height': parseInt(this.children().children('img').css('height')) / 30 + "px"
				}, 10);

				$('#grayscale').prop('checked', false);

			});

			this.refresh();
			this.refreshSize();
			this.apply_filter($('#grayscale'), 'grayscale', false);
			this.apply_filter($('#invert'), 'invert', false);
			this.apply_filter($('#contrast'), 'contrast', false);

		},

		stylize: function() {

			this.toolbox.addClass('box').draggable({
				stack: '.box',
				cursor: "move",
				appendTo: 'body'
			});

		},

		show: function() {

			$('#button_toolbar').tooltip('hide').fadeOut().remove();

			this.toolbox.show().animate({
				"top": this.last_style['top'],
				'left': this.last_style['left'],
				'width': this.last_style['width'],
				'height': this.last_style['height'],
				'opacity': this.last_style['opacity']
			}, 250);

		},

		hide: function() {
			$('#buttons').prepend("<img data-toggle='tooltip' title='Show Tools Box' id='button_toolbar' src='/static/img/_tools.png' />");

			this.buttons_position = $('#button_toolbar').position();
			this.last_style = this.toolbox.css(['top', 'left', 'width', 'height', 'opacity']);

			this.toolbox.animate({
				position: 'absolute',
				top: this.buttons_position['top'] + $('#buttons').position().top + 30,
				left: "2%",
				width: 0,
				height: 0,
				opacity: 0
			}, {
				duration: 250,
				complete: function() {
					$(this).hide();
					$('#button_toolbar').tooltip({
						placement: 'right',
						trigger: 'hover'
					}).click(function() {
						_self.toolbar.show();
					});
				}
			});
			return false;
		},

		buttons: function() {
			$('#closeToolbar').click(function() {
				_self.toolbar.hide($(this));
				this.is_hidden = true;
			});

			$('#reset_image').click(function() {
				_self.toolbar.reset();
			});

			$('#grayscale').click(function() {
				_self.toolbar.apply_filter($(this), 'grayscale');
			});

			$('#invert').click(function() {
				_self.toolbar.apply_filter($(this), 'invert');
			});

			if (document.body.style.webkitFilter !== undefined) {
				$('#contrast').click(function() {
					_self.toolbar.apply_filter($(this), 'contrast');
				});
			}

			$('#align').click(function() {
				_self.align.align();
			});

			$('#compare_toolbar').click(function() {
				_self.toolbar.compare_toolbar();
			});

			$('#removeImage').click(function() {

				$.each(_self.select_group.imagesSelected, function() {
					$('#mini_' + $(this).attr('id')).remove();
					_self.toolbar.disable();
					$(this).remove();
				});

				_self.select_group.imagesSelected = [];

				if ($('#toolbar .popover').length) {
					$('#toolbar .popover').remove();
				}
			});

			$('#crop_image').click(function(e) {
				_self.crop.get_image();
			});

			$('#select_all').click(function() {
				_self.toolbar.selectAll();
			});

			$('#clone').click(function() {
				_self.toolbar.clone();
			});

			$('#deselect_all').click(function() {
				_self.toolbar.deselectAll();
			});

			$('#createComment').click(function() {
				var id = _self.select_group.imagesSelected[0].attr('id');
				_self.comments.init(false, id, false, false, false, false, false, false);
			});


			this.opacity();
			this.brightness();
			this.rotate();
			this.size();

		},

		refreshSize: function() {
			var size;
			if (_self.select_group.imagesSelected.length) {
				$.each(_self.select_group.imagesSelected, function() {
					size = parseInt(this.find('img').css('width'));
				});
				$('#slider_size').slider('option', 'value', (size));
			}

		},

		refresh: function() {
			$('#images_group').popover('destroy');
			$.each(_self.select_group.imagesSelected, function(index, value) {
				var features = function() {

					var image = {};

					String.prototype.getNums = function() {
						var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
							mapN = this.match(rx) || [];
						return mapN.map(Number);
					};

					var get_rotation = function(matrix) {
						var angle;
						if (matrix !== 'none') {
							var values = matrix.split('(')[1].split(')')[0].split(',');
							var a = values[0];
							var b = values[1];
							angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
						} else {
							angle = 0;
						}
						return (angle < 0) ? angle += 360 : angle;
					};



					var name_image = '';
					if (_self.images_on_workspace().length) {
						name_image = value.data('title');
						if (_self.select_group.imagesSelected.length > 1) {
							image['name'] = "<span id='images_group'>" + _self.select_group.imagesSelected.length + " images selected</span>";
							$('#name_image').html(image['name']);

							$('#images_group').popover({
								trigger: 'click',
								placement: 'right',
								title: 'Images selected',
								container: '#toolbar',
								html: true,
								content: function() {
									var s = '';
									$.each(_self.select_group.imagesSelected, function() {
										var position = this.offset();
										var top = position.top;
										var left = position.left;

										var title = function(title) {
											if (title.length > 25) {
												return title.substr(0, 25) + '...';
											} else {
												return title;
											}
										};

										s += "<p data-image = '" + this.attr('id') + "'";
										s += "class='images_selected row-fluid'>";
										s += "<span data-coords = " + top + "," + left + " class = 'title-image-selected col-lg-9'";
										s += " title = 'Go to " + this.data('title') + "'>" + title(this.data('title')) + "</span>";
										s += " <span data-image = " + this.attr('id') + " title='Hide Image' class='icons-tool col-lg-1 hide-image glyphicon glyphicon-eye-close'></span> <span data-image = '" + this.attr('id') + "'";
										s += "title='Delete Image' class='icons-tool col-lg-1 delete-image glyphicon glyphicon-trash'></span></p>";
									});
									return s;
								}

							});

							$('#images_group').on('shown.bs.popover', function() {
								$('.images_selected .title-image-selected').click(function() {
									var coords = $(this).data('coords').split(',');
									$('html, body').animate({
										scrollTop: coords[0] - 100,
										scrollLeft: coords[1] - 100
									}, 500);
								});


								function hide() {
									var id = $(this).data('image');
									$('#' + id).fadeOut();
									$(this).removeClass('glyphicon-eye-close');
									$(this).removeClass('hide-image');
									$(this).addClass('glyphicon-eye-open');
									$(this).attr('title', 'Show Image');
									$(this).addClass('show-image');
									$(this).unbind();
									$(this).on('click', show);
								}

								function show() {
									var id = $(this).data('image');
									$('#' + id).fadeIn();
									$(this).removeClass('glyphicon-eye-open');
									$(this).removeClass('show-image');
									$(this).addClass('glyphicon-eye-close');
									$(this).attr('title', 'Hide Image');
									$(this).addClass('hide-image');
									$(this).unbind();
									$(this).on('click', hide);
								}

								$('.hide-image').on('click', hide);

								$('.title-image-selected').hover(function() {
									var id = $(this).parent().data('image');
									$('#mini_' + id).animate({
										"box-shadow": "0px 0px 8px red"
									}, 50);
								});

								$('.images_selected').mouseout(function() {
									var id = $(this).data('image');
									$('#mini_' + id).animate({
										"box-shadow": "0px 0px 2px #444"
									}, 50);
								});

								$('.delete-image').click(function() {
									var id = $(this).data('image');
									$('#' + id).fadeOut().remove();
									var imagesSelected = _self.select_group.imagesSelected;
									for (var i = 0; i < imagesSelected.length; i++) {
										if ($(imagesSelected[i]).attr('id') == id) {
											imagesSelected.splice(i, 1);
											i--;
										}
									}

									$('#mini_' + id).remove();
									_self.toolbar.refresh();

									if (_self.select_group.imagesSelected.length) {
										_self.toolbar.enable();
									} else {
										_self.toolbar.disable();
									}

									if (_self.select_group.imagesSelected.length == 1) {
										$('.crop_button').removeClass('disabled');
									} else {
										$('.crop_button').addClass('disabled');
									}

									_self.comments.check_notes();
								});

							});
						} else {

							if (name_image !== undefined && name_image.length > 28) {
								image['name'] = name_image.substr(0, 28) + '...';
							} else {
								image['name'] = name_image;
							}

							$('#name_image').html(image['name']);
							$('#name_image').attr('title', name_image);

						}

						image['opacity'] = value.children().children('img').css('opacity') * 100;
						image['rotate'] = get_rotation(value.css('transform'));
						image['width'] = value.children().children('img').css('width');

						var brightness;
						if (document.body.style.webkitFilter !== undefined) {

							if (value.css('-webkit-filter') != "none") {
								brightness = value.css('-webkit-filter').getNums() * 2 * 100;
								image['brightness'] = brightness;
							} else {
								image['brightness'] = 200;
							}

						} else {
							if (typeof document.getElementById(value.attr('id')).style.polyfilterStore != "undefined") {
								brightness = document.getElementById(value.attr('id')).style.polyfilterStore.getNums();
								image['brightness'] = brightness * 2;
							} else {
								image['brightness'] = 200;
							}
						}
					} else {
						name_image = '';
						image['opacity'] = 100;
						image['brightness'] = 200;
					}

					return image;
				};

				var image = features();
				$("#slider").slider("option", "value", image['opacity']);
				$('#slider_brightness').slider("option", "value", image['brightness']);
				$('#slider_rotate').slider("option", "value", image['rotate']);

			});

			_self.toolbar.refreshSize();
			if (_self.select_group.imagesSelected.length) {
				_self.toolbar.enable();
			} else {
				_self.toolbar.disable();
			}

		}

	};

	this.imagesBox = {
		_self: this,
		open: true,
		imagesSelected: [],
		imagesBox: $('#barLeft'),

		init: function() {
			this.buttons();
		},


		show: function() {
			this.open = true;
			$('#button_images').tooltip('hide').fadeOut().remove();

			this.imagesBox.show()
				.draggable({
					handle: '.top_box'
				}).animate({
					"top": "5%",
					'left': "20%",
					'width': "60%",
					'height': "90%",
					'opacity': 1
				}, 250);
			return false;
		},

		hide: function() {
			this.open = false;

			var button = " <img data-toggle='tooltip' title='Browse Manuscripts' id='button_images' src='/static/img/_manuscript.png' />";

			if ($("button_toolbar").length) {
				$("button_toolbar").after(button);
			} else {
				$('#buttons').prepend(button);
			}

			this.buttons_position = $('#button_images').position();

			this.imagesBox.show().animate({
				top: $('#buttons').position().top + this.buttons_position['top'] + 30,
				left: "2%",
				width: 0,
				height: 0,
				opacity: 0
			}, {
				duration: 250,
				complete: function() {
					$(this).hide();
					$('#button_images').tooltip({
						placement: 'right',
						trigger: 'hover'
					}).click(function() {
						_self.imagesBox.show();
					});
				}
			});
			return false;
		},

		buttons: function() {
			$('#close_barLeft').click(function() {
				_self.imagesBox.hide($(this));
			});

			$('#add_to_workspace').click(function() {
				_self.imagesBox.to_workspace();
			});

			$('.image').click(function() {
				_self.imagesBox.select_image($(this));
			});
		},

		is_selected: function(image) {
			if (image.data('selected')) {
				return true;
			} else {
				return false;
			}

		},

		select_image: function(image) {
			$currentImageSelected = image;
			var images = _self.imagesBox.imagesSelected;
			if (_self.imagesBox.is_selected(image)) {
				image.data('selected', false);
				image.children('img').removeClass('selected_image');
				if (images.length) {
					for (var i = 0; i < images.length; i++) {
						if (image.attr('id') == $(images[i]).attr('id')) {
							images.splice(i, 1);
							break;
						}
					}
				}
			} else {
				if (typeof image != "undefined") {
					_self.imagesBox.imagesSelected.push(image);
					image.data('selected', true);
					image.children('img').addClass('selected_image');
				}
			}


		},

		to_workspace: function(param) {
			var images = _self.imagesBox.imagesSelected;
			var images_on_workspace = $('.image');
			if (images.length) {
				var page_position = $('#overview').offset();
				for (var i = 0; i < images.length; i++) {

					var new_images = $(images[i]).unbind().removeClass('image').addClass('image_active').css({
						'top': $(window).scrollTop() + 50,
						'left': $(window).scrollLeft() + 100
					});

					if (new_images.data('external')) {
						var size = new_images.data('size').split(',');

						new_images.css({
							width: size[0] / 2
						});

						new_images.children('.ui-wrapper').css({
							width: size[0] / 2
						});

						new_images.children('.ui-wrapper').children('img').css({
							width: size[0] / 2
						});

					}
					var workspace = _self.workspaceImages.workspace;
					var original_id = new_images.attr('id');
					new_images.data('workspace', workspace);
					new_images.data('original_id', id);
					var id = new_images.attr('id');

					/*
				if ($('#' + id).length) {
					var new_id = uniqueid();
					new_images.attr('id', new_id);
				}
				*/

					$('#' + workspace).append(new_images);
					$(images[i]).dblclick(function(event) {
						_self.select_group.select($(this));
						event.stopPropagation();
					});

					var src = new_images.find('img').attr('src');
					_self.minimap.add_to_minimap($(images[i]).attr('id'), src);

				}
				if (typeof param == "undefined") {
					_self.workspaceImages.init(); // Making images draggable
				}
				_self.imagesBox.imagesSelected = []; //restore the selected elements after dragged on workspace
			} else {
				$.fn.notify({
					"type": "error",
					"close-button": true,
					"position": {
						'top': "8%",
						'left': '80%'
					},
					'text': 'You should insert at least one image.'
				});
			}
		}

	};

	this.workspaceImages = {
		_self: this,
		beingDragged: false,
		workspace: 'barRight',
		draggableOptions: {
			revert: 'valid',
			opacity: 0.7,
			cursor: "move",
			scroll: true,
			start: function(event, ui) {
				_self.workspaceImages.beingDragged = true;
			},
			drag: function(event, ui) {
				position = $(this).offset();
				_self.minimap.update_mini_map(ui);
			},
			stop: function(event, ui) {
				_self.workspaceImages.beingDragged = false;
				$(ui.helper).css('z-index', 0);
				$(event.toElement).one('click', function(e) {
					e.stopImmediatePropagation();
				});
			}
		},

		init: function() {
			this.make_images_draggable();
		},

		make_images_draggable: function() {
			var draggableOptions = this.draggableOptions;
			$('.image_active').draggable(draggableOptions).children('img').addClass('img-responsive');
		}

	};


	this.comments = {
		_self: this,
		notes: [],
		open: false,
		openFolder: false,
		currentFolder: null,

		init: function(bool, image, content, title, image_id, size, position) {
			if ($('.comment').length) {
				$('.comment').focus();
			} else {
				var image_comment, comment;
				var body = $('body');
				if (bool) {
					image_comment = image_id;
					comment = this.make_comment(image_comment, image);
					body.append(comment);
					$('#' + image_comment).children('.comment_wrapper').children('.comment_content').html(content);
					$('#' + image_comment).data('id', image_id);
					$('#' + image_comment).data('image_note', image);

					$('#' + image_comment).children('.comment_wrapper').children('.commentTitle').val(title);
					$('#' + image_comment).animate({
						'position': 'fixed',
						'top': position.top,
						'left': position.left,
						'height': size.height,
						'width': size.width
					}, 100);

				} else {
					image_comment = "note_" + image + '_' + uniqueid();
					comment = this.make_comment(image_comment, image);
					body.append(comment);
					title = $('#' + image).data('title');
					$('#' + image_comment).data('image_note', image);
					$('#' + image_comment).data('title', title);
				}

				$('#' + image_comment).draggable({
					handle: '.top_comment',
					cursor: 'move',
					stack: 'div',
					appendTo: 'body',
					zIndex: 1000
				}).resizable({
					maxHeight: 600,
					maxWidth: 700,
					minHeight: 300,
					minWidth: 350
				});

				this.buttons();
				$('#notes_alert').hide().html('');
			}
		},

		buttons: function() {

			$('.removeComment').click(function() {
				var notes = _self.comments.notes;
				var note = $(this).parent().parent('.comment');

				for (var i = 0; i < notes.length; i++) {
					for (var j = 0; j < notes[j].notes.length; j++) {
						if (notes[i].notes[j].id == note.data('id')) {
							_self.comments.notes[i].notes.splice(j, 1);
							j--;
						}
					}
				}

				note.fadeOut().remove();

				if (_self.comments.notes.length === 0) {
					$('#notes_alert').show().html("No notes created");
				} else {
					$('#notes_alert').hide().html('');
				}

				_self.comments.update_notes();
				$.fn.notify({
					'text': 'Note succesfully removed',
					'type': 'success',
					'close_button': true,
					"position": {
						'top': '8%',
						'left': '79%'
					}
				});

			});


			$('.minimizeNote').click(function() {
				_self.comments.minimizeNote($(this).parent().parent('.comment'));
				_self.comments.check_notes();
			});

			var state = function(command) {
				var result = document.queryCommandState(command);
				return result;
			};


			$('.comment_content').on('keyup', function() {

				if (state('bold')) {
					$('#bold').addClass('active');
				} else {
					$('#bold').removeClass('active');
				}

				if (state('italic')) {
					$('#italic').addClass('active');
				} else {
					$('#italic').removeClass('active');
				}

				if (state('underline')) {
					$('#underline').addClass('active');
				} else {
					$('#underline').removeClass('active');
				}

				if (state('underline')) {
					$('#underline').addClass('active');
				} else {
					$('#underline').removeClass('active');
				}

				if (state('insertUnorderedList')) {
					$('#list').addClass('active');
				} else {
					$('#list').removeClass('active');
				}

				if (state('formatBlock')) {
					$('#heading').addClass('active');
				} else {
					$('#heading').removeClass('active');
				}

			});

			$('#bold').on("click", function() {
				document.execCommand('bold', false, null);
			});

			$('#italic').on("click", function() {
				document.execCommand('italic', false, null);
			});

			$('#underline').on("click", function() {
				document.execCommand('underline', false, null);
			});

			$('#link').on("click", function() {
				var selected = document.getSelection();
				document.execCommand("insertHTML", false, "<a href='" + selected + "'>" + selected + "</a>");
			});

			$('#list').on('click', function() {
				document.execCommand("insertUnorderedList", false, null);
			});

			$('#heading').on('click', function() {
				document.execCommand("formatBlock", false, "<h3>");
			});


		},

		check_notes: function() {
			if (_self.select_group.imagesSelected.length == 1) {
				var image = _self.select_group.imagesSelected[0];
				var notes = _self.comments.notes;
				if (!$('#open_notes').length) {
					for (var i = 0; i < notes.length; i++) {
						if (notes[i].image == image.attr('id')) {
							var button = $("<button class = 'btn btn-sm btn-warning' id='open_notes'>Open notes</button>");
							$('#createComment').after(button.hide().fadeIn());
							break;
						}
					}
				} else {
					$('#open_notes').unbind('click');
				}
				$('#open_notes').click(function() {
					_self.comments.open_notes(image);
				});
			}
		},

		minimizeNote: function(note_this) {
			var note_position = note_this.position();
			var note_content, note_title;
			if (note_this.hasClass('readable_comment')) {
				note_content = note_this.children('.readable_comment_wrapper').children('.readable_comment_content').html();
				note_title = note_this.children('.readable_comment_wrapper').children('.readable_comment_commentTitle').val();
			} else {
				note_content = note_this.children('.comment_wrapper').children('.comment_content').html();
				note_title = note_this.children('.comment_wrapper').children('.commentTitle').val();
			}
			var note_id = note_this.attr('id');
			var image_id = note_this.data('image_note');
			var title = note_this.data('title');

			var size = {
				"height": note_this.css('height'),
				"width": note_this.css('width')
			};

			var note = {
				'title': note_title,
				'content': note_content,
				'position': note_position,
				'id': note_id,
				'image': image_id,
				'image_title': title,
				'size': size
			};

			var flag = false;
			for (var i = 0; i < this.notes.length; i++) {
				if (this.notes[i].image == image_id) {
					flag = false;
					break;
				} else {
					flag = true;
				}
			}


			// Updating notes into the window
			if (flag || !this.notes.length) {

				var image = {
					'image': note.image,
					'title': note.image_title,
					'notes': [note]
				};

				this.notes.push(image);

			} else {
				flag = false;
				outerloop: for (var i = 0; i < this.notes.length; i++) {
					innerloop: for (var j = 0; j < this.notes[i].notes.length; j++) {
						if (this.notes[i].notes[j].id == note_id) {
							flag = false;
							break outerloop;
						} else {
							flag = true;
							break outerloop;
						}
					}
				}
				if (flag) {
					for (var i = 0; i < this.notes.length; i++) {
						if (this.notes[i].image == image_id) {
							this.notes[i].notes.push(note);
							break;
						}
					}
				} else {
					this.notes[i].notes[j].size = size;
					this.notes[i].notes[j].content = note_content;
					this.notes[i].notes[j].title = note_title;
					this.notes[i].notes[j].position = note_position;
				}

			}

			var notes_button_position;
			if (!this.open) {
				notes_button_position = {
					'top': $('#notes_button').position().top,
					'left': "2%"
				};
			} else {
				if ($('#notes .note:last-child').length) {

					notes_button_position = {
						'top': $('#notes .note:last-child').position().top,
						'left': $('#notes .note:last-child').position().left + 50
					};

				} else {

					notes_button_position = {
						'top': $('#notes').position().top,
						'left': $('#notes').position().left + 50
					};

				}
			}

			if (this.openFolder) {
				var note_2 = '';
				console.log(note)
				console.log(this.currentFolder + ' ' + note.image)
				if (this.currentFolder == note.image) {
					note_2 += this.create_note(note.title, note.id, note.content);
				}

				$('#notes_container').append(note_2);
				_self.comments.events_on_notes();
			}

			note_this.animate({
				top: notes_button_position['top'],
				left: notes_button_position['left'],
				width: 0,
				height: 0,
				opacity: 0
			}, {
				duration: 250,
				complete: function() {
					$(this).hide().remove();
				}
			});

			this.update_notes();
		},

		make_comment: function(image, id_image) {
			var comment = "<div class='comment' id='" + image + "' data-image = '" + id_image + "'>";
			comment += "<div class='top_comment'>";
			comment += "<button class='btn btn-sm btn-danger removeComment' title='Delete Note'><span class='glyphicon glyphicon-remove'></span> Delete</button>";
			comment += "<span class='pull-right minimizeNote' title='Save note'><span style='font-weight:bold;color:white;font-size:15px;cursor:pointer;margin:0.5%;' class='glyphicon glyphicon-ok'></span></span></div>";
			comment += "<div class='comment_wrapper'>";
			comment += "<input class='commentTitle' class='hidden' placeholder='Title ...' />";
			comment += "<div class='comment_content' contenteditable></div>";
			comment += ' <div id="rich_buttons" class="btn-group" data-toggle="buttons-checkbox"><button type="button" id="bold" class="btn btn-sm" title="bold">B</button><button type="button" id="italic" class="btn btn-sm" title="italic">I</button><button type="button" id="underline" class="btn btn-sm" title="underline">U</button><button type="button" id="heading" class="btn btn-sm" title="heading"><span class="glyphicon glyphicon-header"></button><button type="button" id="link" class="btn btn-sm" title="link"><span class="glyphicon glyphicon-globe"></button><button type="button" id="list" class="btn btn-sm" title="list"><span class="glyphicon glyphicon-list"></button></div></div>';

			return comment;
		},

		makeReadableComment: function(image, id_image, title, content) {
			var comment = "<div class='readable_comment' id='" + image + "' data-image = '" + id_image + "' data-image_note = '" + id_image + "'>";
			comment += "<span class='pull-right minimizeNote' title='Minimize note' style='margin:2%;'><span style='font-weight:bold;color:#444;font-size:15px;cursor:pointer;margin:0.5%;' class='glyphicon glyphicon-remove'></span></span>";
			comment += "<div class='readable_comment_wrapper'>";
			comment += "<span class='readable_comment_commentTitle' class='hidden'>" + title + "</span>";
			comment += "<div class='readable_comment_content'>" + content + "</div></div</div>";
			return comment;
		},

		events_on_notes: function() {
			var notes = this.notes;
			$('.note .remove_comment_from_box').click(function() {
				var note = $(this).parent().parent('.note');
				for (var i = 0; i < notes.length; i++) {
					for (var j = 0; j < notes[i].notes.length; j++) {
						if (notes[i].notes[j].id == note.data('id')) {
							_self.comments.notes[i].notes.splice(j, 1);
							j--;
						}
					}
				}
				$(note).stop().animate({
					position: "absolute",
					width: "0px",
					height: "0px",
					backgroundColor: "red",
					opacity: 0
				}, {
					duration: 300,
					complete: function() {
						$(this).hide().remove();
					}
				});

				if (!notes.length) {
					$('#notes_alert').fadeIn().html("No notes created");
					_self.comments.es();
				} else {
					$('#notes_alert').hide().html('');
				}
				_self.comments.update_notes();
			});

			$('.edit_comment_from_box').click(function() {
				_self.comments.show_comment($(this));
			});

			$('.read_note').click(function() {
				_self.comments.read_note($(this));
			});
		},


		hide_notes: function() {
			var button_position = $('#notes_button');
			button_position.show();
			$('#notes').animate({
				"top": button_position.position().top,
				'left': "2%",
				'width': "0%",
				'height': "0%",
				'opacity': 0
			}, {
				duration: 250,
				complete: function() {
					$(this).hide();

					button_position.tooltip({
						placement: 'right',
						trigger: 'hover'
					});

					/*$('#notes_button').click(function(){
                            $.comments.show_notes()
                        });*/
				}
			});
			this.open = false;
		},

		create_note: function(title, id, content) {
			var notes_html = "<div class = 'note' data-id = '" + id + "'><p style='padding:0' class='note_box_title col-lg-9 col-lm-9 col-xs-9'>" + title + "</p>";
			notes_html += "<p class='pull-right'><span title='read Note' class='glyphicon glyphicon-file read_note'></span> ";
			notes_html += "<span title='Edit Note' class='glyphicon glyphicon-pencil edit_comment_from_box'></span>";
			notes_html += " <span title='Delete Note' class='glyphicon glyphicon-remove remove_comment_from_box'></span></p><div class='note_box_content'>" + content + "</div></div>";
			return notes_html;
		},

		open_notes: function(image) {
			var folder = $("<div>");
			folder.data('image', image.attr('id'));
			folder.data('image_title', image.data('title'));
			if (this.open && !this.openFolder) {
				this.openFolder_notes(folder);
			} else if (this.open && this.openFolder && this.currentFolder == image.attr('id')) {
				return;
			} else {
				this.show_notes();
				this.openFolder_notes(folder);
			}
		},

		read_note: function(note_button) {
			var notes = this.notes;
			var note = note_button.parent().parent('.note');
			for (var i = 0; i < notes.length; i++) {
				for (var j = 0; j < notes[i].notes.length; j++) {
					if (notes[i].notes[j].id == note.data('id')) {
						var id = notes[i].notes[j].id;
						var image = notes[i].notes[j].image;
						var title = notes[i].notes[j].title;
						var content = notes[i].notes[j].content;
						var position = notes[i].notes[j].position;
						var size = notes[i].notes[j].size;
						$(note).animate({
							'top': position.top,
							'left': position.left,
							'width': size.width,
							'height': size.height,
							'opacity': 1
						}, {
							duration: 400,
							complete: function() {
								$(this).hide();
								var comment = _self.comments.makeReadableComment(id, image, title, content);
								$('body').append(comment);
								$(".readable_comment").draggable().resizable().find(".minimizeNote").click(function() {
									var comment_element = $(this).parent('.readable_comment');
									_self.comments.minimizeNote(comment_element);
								});
							}
						});
					}
				}
			}
		},

		show_comment: function(note_button) {
			if (!$('.comment').length) {
				var notes = this.notes;
				var note = note_button.parent().parent('.note');
				for (var i = 0; i < notes.length; i++) {
					for (var j = 0; j < notes[i].notes.length; j++) {
						if (notes[i].notes[j].id == note.data('id')) {
							var id = notes[i].notes[j].id;
							var image = notes[i].notes[j].image;
							var title = notes[i].notes[j].title;
							var content = notes[i].notes[j].content;
							var position = notes[i].notes[j].position;
							var size = notes[i].notes[j].size;
							$(note).animate({
								'top': position.top,
								'left': position.left,
								'width': size.width,
								'height': size.height,
								'opacity': 1
							}, {
								duration: 400,
								complete: function() {
									$(this).hide();
									_self.comments.init(true, image, content, title, id, size, position);
								}
							});
						}
					}
				}
			} else {

				$.fn.notify({
					'type': 'error',
					"close-button": true,
					"position": {
						'top': "8%",
						'left': '80%'
					},
					'text': 'A note window is already open on the workspace.'
				});
			}
		},

		openFolder_notes: function(image_note) {
			this.openFolder = true;
			this.currentFolder = image_note.data('image');
			var breadcrumb = $('<div>');
			breadcrumb.attr({
				'class': 'breadcrumb',
				'display': 'none',
				'id': 'breadcrumb_notes'
			}).css({
				'border-bottom': '1px solid #ddd'
			});
			var folder = image_note.data('image');
			if (!$('#breadcrumb_notes').length) {
				$('#breadcrumb_notes_container').append(breadcrumb);
				var li = "<li><a class='link' id='to_notes'>Notes</a></li>";
				li += "<li class='active'>" + image_note.data('image_title') + "</li>";
				li += "<li class='pull-right no-before'><span style='cursor:pointer;' id='to_notes_icon' class='glyphicon glyphicon-arrow-left'></span></li>";
				$('#breadcrumb_notes').html(li);
			}

			$('#to_notes').click(function() {
				_self.comments.back_to_notes();
			});

			$('#to_notes_icon').click(function() {
				_self.comments.back_to_notes();
			});

			var note = '';

			for (var i = 0; i < this.notes.length; i++) {
				if (this.notes[i].image == image_note.data('image')) {
					for (var j = 0; j < this.notes[i].notes.length; j++) {
						note += this.create_note(this.notes[i].notes[j].title, this.notes[i].notes[j].id, this.notes[i].notes[j].content);
					}
				}
			}
			$('#notes_container').html(note);
			_self.comments.events_on_notes();
			if (!_self.comments.notes.length) {
				$('#notes_alert').show().html("No notes created");
			} else {
				$('#notes_alert').hide().html('');
			}

			$('.note_folders').fadeOut(100).remove();
		},

		back_to_notes: function() {
			$('#breadcrumb_notes, .note').hide().remove();
			this.openFolder = false;
			this.currentFolder = null;
			$('#notes_container').html('');
			this.update_notes();
		},

		update_notes: function() {
			var notes = this.notes;
			var folders = $('.note_folders');
			if (!this.openFolder) {
				for (var i = 0; i < notes.length; i++) {
					var id = $(folders[i]).data('image');
					if (notes[i].image != id) {
						var folder = $("<div class='note_folders col-lg-3'><img src='/static/img/folder-documents.png' /><span class='note_folders_title'></span></div>");
						folder.data('image', notes[i].image);
						folder.data('image_title', notes[i].title);
						folder.children('span').html(notes[i].title);
						$('#notes_container').append(folder);
						folder.click(function() {
							_self.comments.openFolder_notes($(this));
						});
					}
				}
			}
			this.clean_notes_array();
			this.check_notes();
		},

		show_notes: function() {
			var button_position = $('#notes_button').position();
			$('#notes').css({
				"top": $('#buttons').position().top + button_position.top,
				'left': "2%"
			}).show().animate({
				"top": "5%",
				'left': "20%",
				'width': "60%",
				'height': "90%",
				'opacity': 1,
				'z-index': 400
			}, {
				duration: 250,
				complete: function() {
					$('#notes_button').hide();
					//$('#notes_container').sortable();

					$('#notes_button').tooltip({
						placement: 'right',
						trigger: 'hover'
					});

					$('#close_notes').click(function() {
						_self.comments.hide_notes();
					});
				}
			}).draggable({
				handle: '.top_box'
			});

			if (!_self.comments.notes.length) {
				$('#notes_alert').fadeIn().html("No notes created");
			} else {
				$('#notes_alert').fadeOut().html('');
			}

			this.open = true;

		},

		clean_notes: function() {
			$('.note').remove();
			this.notes = [];
		},

		clean_notes_array: function() {
			var notes = this.notes;
			var flag = false;

			for (var i = 0; i < notes.length; i++) {
				if (!notes[i].notes.length) {

					if (notes[i].image == _self.select_group.imagesSelected[0].attr('id')) {
						$('#open_notes').fadeOut(300).remove();
					}
					flag = true;

					$('.note_folders').data('image', notes[i].image).remove();
					_self.comments.notes.splice(i, 1);
					i--;

				} else {
					flag = false;
				}
			}
			if (flag) {

				if (this.openFolder) {
					this.back_to_notes();
				}

			}

		}

	};

	this.crop = {

		init: function(data) {
			this.buttons(data);
		},

		crop: function(image) {
			var jcrop_api;

			var image_crop = image.children().children('img');
			$(image_crop).Jcrop({
				keySupport: false,
				setSelect: false,

				onSelect: function() {
					jcrop_api = this;
					$('#crop_image').fadeIn();

				},

				onChange: this.show_coords,

				onRelease: function() {
					jcrop_api = this;
					jcrop_api.destroy();
					$('.crop_button').removeClass('active');
					$('#crop_image').fadeOut();
				}
			});
		},

		show_coords: function(c) {
			_self.crop.coords = [c.x, c.y, c.x2, c.y2];
		},

		buttons: function() {
			$('.crop_button').click(function() {

				if (!$(this).hasClass('active')) {
					$(this).addClass('active');
					_self.crop.crop($('.selected'));
				} else {
					return false;
				}
			});

			return false;
		},


		get_image: function() {


			var image = _self.select_group.imagesSelected[0];

			var width = image.children().children('img').width();
			var height = image.children().children('img').height();

			var is_letter = function() {
				if (image.data('is_letter')) {
					return true;
				} else {
					return false;
				}
			};

			var data = {
				'id': image.attr('id'),
				'image': image.children().children('img').attr('src'),
				'is_letter': is_letter(),
				'height': height,
				'width': width,
				'box': JSON.stringify(_self.crop.coords),
				'manuscript': image.data('title')
			};

			$.ajax({
				type: 'POST',
				url: 'read-image/',
				data: data,
				beforeSend: function() {
					if (!$('#letter_wait_box').length) {
						var loader = "<div class='modal' id='letter_wait_box'><span id='letter_crop_status'>Cropping region ...</span><div id='letters_buttons_loading_box'><img src='/static/img/ajax-loader2.gif' /></div>";

						$('body').append(loader);
						$('#letter_wait_box').fadeIn();

					} else {
						$('#letters_buttons_loading_box').hide().fadeIn().html("<img src='/static/img/ajax-loader2.gif' />");
						$('#letter_crop_status').hide().fadeIn().html("Cropping region ...");
					}
					/*
                            if($.letters.open){
                                $('#top_box_letters').append('<img id="loading_letter_ajax" src="/static/img/ajax-loader.gif" />')
                            }
                            */
				},
				success: function(data) {
					_self.letters.addLetter(data);
					return false;
				},
				complete: function() {
					if (!_self.letters.open) {
						var buttons = "<button id='open-letter-box' class='btn btn-primary'>Open Letters Window</button> <button class='btn btn-danger' id='close-letter-box'>Close</button>";
						$('#letters_buttons_loading_box').hide().fadeIn().html(buttons);
						$('#letter_crop_status').hide().fadeIn().html("Region cropped!");

						$('#close-letter-box').click(function() {
							$('#letter_wait_box').fadeOut().remove();
						});

						$('#open-letter-box').click(function() {
							$('#letter_wait_box').fadeOut().remove();
							_self.letters.open_lettersbox();
						});

						$('#letter_wait_box').data('completed', true);
						return false;

					} else {
						$('#letter_wait_box').fadeOut().remove();
						$('#importing_letter_ajax').fadeOut().remove();
						return false;
					}

				},
				error: function() {
					var buttons = "<button id='open-letter-box' class='btn btn-primary'>Open Regions Window</button>";
					buttons += " <button class='btn btn-danger' id='close-letter-box'>Close</button>";
					$('#letters_buttons_loading_box').hide().fadeIn().html(buttons);
					$('#letter_crop_status').hide().fadeIn().html("Something went wrong. Try again.!");
				}

			});

		}

	};

	this.letters = {

		open: false,
		folderOpen: false,

		lettersSelected: [],

		regions: [],

		letters: $('.letter'),

		letters_div: $('#letters'),

		init: function(data) {

			this.buttons(data);

		},

		open_lettersbox: function() {
			var button_position = $('#letters_button').position();
			this.letters_div.css({
				'top': $('#buttons').position().top + button_position.top + 30,
				'left': "2%"
			});
			$('#letters_button').hide();
			this.letters_div.show().animate({
				"top": "5%",
				'left': "20%",
				'width': "60%",
				'height': "90%",
				'opacity': 1,
				'z-index': 400
			}, {
				duration: 250,
				complete: function() {

					$('#close_letters').unbind().click(function() {
						_self.letters.hide_letters();
					});

					$('#compare_letters').unbind().click(function() {
						var comparison = _self.letters.compare();
						_self.letters.show_comparison(comparison);
					});

					$('#delete_letter').unbind().click(function() {
						_self.letters.delete();
					});


					$('#load_xml').unbind().on('change', function(e) {
						_self.letters.import_xml(e);
					});

					$('#export_xml').unbind().click(function() {
						_self.letters.export_as_xml('xml');
					});

					$('#export_html').unbind().click(function() {
						_self.letters.export_as_xml('html');
					});

					$('#add_letters').unbind().click(function() {
						_self.letters.to_workspace();
					});
				}
			}).draggable({
				handle: '.top_box'
			});

			if (this.regions.length) {
				$('#export_xml').removeClass('disabled');
				$('#export_html').removeClass('disabled');
			} else {
				$('#export_xml').addClass('disabled');
				$('#export_html').addClass('disabled');
			}

			this.open = true;
		},

		hide_letters: function() {
			var button_position = $('#letters_button');
			console.log(button_position.position().top);
			console.log(button_position.offset().top);
			button_position.show();
			this.letters_div.animate({
				"top": button_position.position().top,
				'left': "2%",
				'width': "0%",
				'height': "0%",
				'opacity': 0
			}, {
				duration: 250,
				complete: function() {
					$(this).hide();
				}
			});
			this.open = false;
		},

		updateLetters: function(data) {
			if (this.regions.length) {
				var manuscript_id = $(data).data('manuscript_id');
				for (var i = 0; i < this.regions.length; i++) {
					if (this.regions[i].id == manuscript_id) {
						this.regions[i].letters.push($(data));
						if (this.folderOpen.status && this.folderOpen.manuscript ==
							this.regions[i].id) {
							var j = 0;
							$(".letter").unbind('click');
							while (j < this.regions[i].letters.length) {
								var letter = this.regions[i].letters[j];
								$('#letters_container').append(letter);
								j++;
							}
							$(".letter").click(function() {
								_self.letters.selectLetter($(this));
							});
						}
						return true;
					} else {
						continue;
					}
				}
				$('#export_xml').removeClass('disabled');
				$('#export_html').removeClass('disabled');
			} else {
				$('#export_xml').removeClass('disabled');
				$('#export_html').removeClass('disabled');
				return false;
			}
		},

		updateFolders: function(data) {
			var manuscript_title = $(data).data('manuscript');
			var manuscript_id = $(data).data('manuscript_id');
			var manuscript = $("<div>");
			manuscript.attr('class', 'manuscript_pack').addClass('col-lg-3');
			manuscript.attr('id', 'manuscript_' + manuscript_id);
			manuscript.data('title', manuscript_title);
			manuscript.append("<img src='/static/img/folder_pictures.png' />");
			manuscript.append("<div class='folder_title'>" + manuscript_title + "</div>");
			var is_selected = function() {
				if ($(data).data('selected')) {
					return true;
				} else {
					return false;
				}
			};
			var manuscripts = {
				'title': manuscript_title,
				'id': manuscript_id,
				'letters': []
			};
			manuscripts.letters.push($(data));
			this.regions.push(manuscripts);
			manuscript.data('manuscript', manuscripts);
			if (_self.letters.regions.length) {
				$('#export_xml').removeClass('disabled');
				$('#export_html').removeClass('disabled');
			} else {
				$('#export_xml').addClass('disabled');
				$('#export_html').addClass('disabled');

			}
			return manuscript;
		},

		addLetter: function(data) {
			if (this.updateLetters(data)) {
				return;
			} else {
				var manuscript = this.updateFolders(data);
				if (!this.folderOpen.status) {
					$('#letters_container').append(manuscript);
				}
				this.init($(manuscript));
			}
		},

		update_regions_folders: function() {
			var regions = _self.letters.regions;
			var data, manuscript, manuscript_id, manuscript_title, manuscript_data;
			$('#letters_container').html('');
			for (var i = 0; i < regions.length; i++) {
				manuscript_title = regions[i].title;
				manuscript_id = regions[i].id;
				manuscript = $("<div>");
				manuscript.attr('class', 'manuscript_pack').addClass('col-lg-3');
				manuscript.attr('id', 'manuscript_' + manuscript_id);
				manuscript.append("<img src='/static/img/folder_pictures.png' />");
				manuscript.append("<div class='folder_title'>" + manuscript_title + "</div>");
				manuscript_data = {
					'title': manuscript_title,
					'id': manuscript_id,
					'letters': []
				};
				for (var j = 0; j < regions[i].letters.length; j++) {
					data = regions[i].letters[j];
					manuscript_data.letters.push(regions[i].letters[j]);
				}
				manuscript.data('manuscript', manuscript_data);
				$('#letters_container').append(manuscript);
			}
			$('.manuscript_pack').click(function() {
				_self.letters.openFolder($(this));
			});

		},

		make_workable: function(letter) {
			var wrap = $("<div id='image_" + letter.attr('id') + "' class='image_active'><img src='" + letter.attr('src') + "' /></div>");
			wrap.data('is_letter', true);
			$('#barRight').append(wrap);
			if (typeof letter.data('title') == "undefined") {
				wrap.data("title", "Region");
			} else {
				wrap.data("title", letter.data('title'));
			}
			wrap.data('size', letter.data('size'));
			var page_position = $('#overview').offset();
			wrap.children().resizable({
				aspectRatio: true,
				resize: function(event, ui) {
					var element = $("#" + ui.element.parent().attr('id'));
					$('#mini_' + ui.element.parent().attr('id')).animate({
						'width': parseInt(element.css('width')) / 65 + "px",
						'height': parseInt(element.css('height')) / 55 + "px"
					}, 10);
					_self.toolbar.refreshSize();
				}
			});
			$('#image_' + letter.attr('id')).css({
				'top': page_position['top'] - 600,
				'left': $(window).scrollLeft() + 100
			}).draggable({
				revert: false,
				scroll: true,
				opacity: 0.8,
				stack: '.image_active',
				cursor: "move",
				aspectRatio: true,
				drag: function(ui, event) {
					position = $(this).offset();
					_self.minimap.update_mini_map();
				},
				stop: function(ui, event) {
					$(ui.helper).css('z-index', 0);
				}
			});

			$('#image_' + letter.attr('id')).dblclick(function(event) {
				_self.select_group.select($(this));
				event.stopPropagation();
			});

			_self.minimap.add_to_minimap('image_' + letter.attr('id'), letter.attr('src'));
			letter.remove();
		},

		is_selected: function(letter) {
			if (letter.data('selected')) {
				return true;
			} else {
				return false;
			}
		},

		selectLetter: function(letter) {
			var letters = this.lettersSelected;
			if (this.is_selected(letter)) {
				letter.data('selected', false);
				letter.css('box-shadow', '0px 0px 6px #666');
				if (letter.length) {
					for (var i = 0; i < letters.length; i++) {
						if (letter.attr('id') == $(letters[i]).attr('id')) {
							this.lettersSelected.splice(i, 1);
							i--;
							break;
						}
					}
				}
			} else {
				if (typeof letter != "undefined") {
					this.lettersSelected.push(letter);
					letter.data('selected', true);
					letter.css('boxShadow', '0px 0px 8px 6px rgba(255, 246, 9, 0.94)');
				}
			}
			var selected_letters_number = $('#selected_letters_number');
			selected_letters_number.html(this.lettersSelected.length + " selected");
		},

		buttons: function(data) {
			data.click(function() {
				_self.letters.openFolder(data);
			});
		},

		openFolder: function(data) {

			this.folderOpen = {
				status: true,
				manuscript: data.data('manuscript').id
			};

			var breadcrumb = $('<div>');

			breadcrumb.attr({
				'class': 'breadcrumb',
				'display': 'none',
				'id': 'breadcrumb_letters'
			});

			$('.manuscript_pack').fadeOut(100);
			$('#letters_container').append(breadcrumb.fadeIn(300));
			var li = "<li><a class='link' id='to_regions'>Regions</a></li>";
			li += "<li class='active'>" + data.data('manuscript').title + "</li>";
			li += "<li class='pull-right no-before'><span id='to_regions_icon' class='glyphicon glyphicon-arrow-left' style='cursor:pointer;'></span></li>";
			$('#breadcrumb_letters').html(li);
			var n = 0;
			var lettersSelected = _self.letters.lettersSelected;
			/*
		if (lettersSelected.length) {
			for (var i = 0; i < lettersSelected.length; i++) {
				console.log(lettersSelected[i].data())
				if (lettersSelected[i].data('manuscript_id') == data.data('manuscript').id) {
					n++;
					if (n > data.data('manuscript').letters.length) {
						break;
					} else {
						for (var j = 0; j < data.data('manuscript').letters.length; j++) {
							var letter = data.data('manuscript').letters[j];
							if (lettersSelected[i].attr('id') == letter.attr('id')) {
								letter.data('selected', true);
							} else {
								continue;
							}
						}
					}
				}
			}
		}
		*/
			if (lettersSelected.length) {
				for (var i = 0; i < lettersSelected.length; i++) {
					for (var j = 0; j < data.data('manuscript').letters.length; j++) {
						var letter = data.data('manuscript').letters[j];
						if (lettersSelected[i].attr('id') == letter.attr('id')) {
							letter.data('selected', true);
						} else {
							if (i > lettersSelected.length) {
								break;
							}
						}
					}

				}
			}

			i = 0;
			while (i < data.data('manuscript').letters.length) {
				var letter = data.data('manuscript').letters[i];
				$('#letters_container').append(letter.hide().fadeIn(300));
				letter.click(function() {
					_self.letters.selectLetter($(this));
				});
				i++;
			}

			$('#to_regions').click(function() {
				_self.letters.to_regions();
			});
			$('#to_regions_icon').click(function() {
				_self.letters.to_regions();
			});
		},

		to_regions: function() {
			$('.letter').remove();
			$('.manuscript_pack').fadeIn(150);
			$('#breadcrumb_letters').slideUp().remove();
			_self.letters.folderOpen.status = false;
			if (_self.letters.regions.length) {
				$('#export_xml').removeClass('disabled');
				$('#export_html').removeClass('disabled');
			} else {
				$('#export_html').addClass('disabled');
				$('#export_xml').addClass('disabled');
			}
			this.update_regions_folders();
		},


		compare: function(file, file2) {
			if (this.lettersSelected.length == 2) {
				var img1 = $("<img>");
				var img2 = $("<img>");
				img1.attr({
					'src': this.lettersSelected[0].attr('src'),
					'id': this.lettersSelected[0].attr('id')
				}).css({
					'display': 'none'
				});
				img2.attr({
					'src': this.lettersSelected[1].attr('src'),
					'id': this.lettersSelected[1].attr('id')
				}).css({
					'display': 'none'
				});
				$("body").append(img1);
				$("body").append(img2);
				var image1 = document.getElementById(img1.attr('id'));
				var image2 = document.getElementById(img2.attr('id'));
				resemble(image1).compareTo(image2).onComplete(function(data) {
					result = data;
				}).ignoreAntialiasing();
				img1.remove();
				img2.remove();
				return result;
			} else {
				$.fn.notify({
					'type': 'error',
					"close-button": true,
					'text': 'Choice two images to compare.'
				});
			}

		},

		show_comparison: function(data) {

			var box_comparison = "<div class='modal box_containers' id='comparison_box'><div id='top_comparison_box' class='top_box row-fluid'><span>" +
				"Images compared</span><span title='Close Window' id='close_comparison_box' class='pull-right'><span class='glyphicon glyphicon-remove close_box'></span></div>";
			box_comparison += "<span style='width:100%;background:#efefef;padding:1.5%;' class='pull-left'><button class='btn btn-sm btn-primary' id='image_compared_to_workspace'>Add to workspace</button></span><div class='box_container' id='images_compared_div'><div><img data-is_generated='true' data-title='Region' id='image_result_compared' src='" + data.getImageDataUrl() + "' /></div></div></div>";

			$('body').append(box_comparison);

			$('#comparison_box').show().animate({
				"top": "20%",
				'left': "27%",
				'width': "45%",
				'height': '50%',
				'opacity': 1,
				'z-index': 400
			}, {
				duration: 250,
				complete: function() {
					$('#close_comparison_box').click(function() {
						$('#comparison_box').animate({
							"top": "50%",
							'left': "50%",
							'width': "0%",
							'height': '0%',
							'opacity': 0
						}, {
							duration: 250,
							complete: function() {
								$(this).remove();
							}
						});
					});

					$('#image_result_compared').resizable({
						aspectRatio: true
					}).parent().draggable({
						zIndex: 0,
						scroll: true,
						containment: "#images_compared_div"
					});
				}
			}).draggable({
				handle: '.top_box'
			});

			$('#image_compared_to_workspace').click(function() {
				_self.letters.make_workable($('#image_result_compared'));
				$('#comparison_box').animate({
					'width': "0%",
					'height': '0%',
					'opacity': 0
				}, {
					duration: 250,
					complete: function() {
						$(this).remove();
					}
				});

			});
		},

		make_arrays: function() {

			var regions = function() {
				var ids = [];
				for (var i = 0; i < _self.letters.regions.length; i++) {
					for (var j = 0; j < _self.letters.regions[i].letters.length; j++) {
						ids.push(_self.letters.regions[i].letters[j].attr('id'));
					}
				}
				return ids;
			};

			var selected = function() {
				var ids = [];
				$.each(_self.letters.lettersSelected, function() {
					ids.push(this.attr('id'));
				});
				return ids;
			};

			var letters = {
				'regions': regions(),
				'letters': selected()
			};

			return letters;
		},

		delete: function() {
			var ids = this.make_arrays().regions;
			var ids2 = this.make_arrays().letters;
			if (this.lettersSelected.length) {
				for (var i = 0; i < ids2.length; i++) {
					for (var h = 0; h < ids.length; h++) {
						if (ids2[i] == ids[h]) {
							for (var j = 0; j < _self.letters.regions.length; j++) {
								for (var n = 0; n < _self.letters.regions[j].letters.length; n++) {
									if (_self.letters.regions[j].letters[n].attr('id') == ids2[i]) {
										_self.letters.regions[j].letters.splice(n, 1);
										n--;
										$('#' + ids2[i]).fadeOut().remove();
										if (!_self.letters.regions[j].letters.length) {
											_self.letters.to_regions();
											$("#manuscript_" + _self.letters.regions[j].id).fadeOut().remove();
											_self.letters.regions.splice(j, 1);
											j--;
											break;
										}
									}
								}
							}
						}
					}
				}
				if (_self.letters.regions.length) {
					$('#export_xml').removeClass('disabled');
					$('#export_html').removeClass('disabled');
				} else {
					$('#export_xml').addClass('disabled');
					$('#export_html').addClass('disabled');
				}
			} else {
				return false;
			}
			_self.letters.lettersSelected = [];
			var selected_letters_number = $('#selected_letters_number');
			selected_letters_number.html(this.lettersSelected.length + " selected");
		},

		to_workspace: function() {

			var regions = _self.letters.regions;

			_self.letters.lettersSelected.clean(undefined);

			if (this.lettersSelected.length) {
				for (var i = 0; i < this.lettersSelected.length; i++) {
					for (var j = 0; j < regions.length; j++) {
						for (var c = 0; c < regions[j].letters.length; c++) {
							if (regions[j].letters[c].attr('id') == this.lettersSelected[i].attr('id')) {
								regions[j].letters.splice(c, 1);
								c--;
							}
						}
						if (!regions[j].letters.length) {
							regions.splice(j, 1);
							j--;
						}
					}
					_self.letters.make_workable(this.lettersSelected[i]);
					_self.letters.lettersSelected.splice(i, 1);
					i--;
				}
			} else {
				return false;
			}

			var selected_letters_number = $('#selected_letters_number');
			selected_letters_number.html(this.lettersSelected.length + " selected");

			if (_self.letters.regions.length) {
				$('#export_xml').removeClass('disabled');
				$('#export_html').removeClass('disabled');
			} else {
				$('#export_xml').addClass('disabled');
				$('#export_html').addClass('disabled');

			}
		},

		hide_box: function() {
			$('#comparison_box').fadeOut().remove();
		},

		export_as_xml: function(value) {
			var letters = _self.letters.regions;
			var xml = "<?xml version='1.0' encoding='UTF-8'?>\n";
			xml += '<regions>\n';
			for (var i = 0; i < letters.length; i++) {
				xml += "\t<manuscript>\n";
				xml += "\t\t<id>" + letters[i].id + "</id>\n";
				xml += "\t\t<title>" + letters[i].title + "</title>\n";
				for (var j = 0; j < letters[i].letters.length; j++) {
					var letter = $(letters[i].letters[j]);
					xml += "\t\t\t<letter>\n";
					xml += "\t\t\t\t<size>" + letter.data('size') + "</size>\n";
					xml += "\t\t\t\t<id>" + letter.attr('id') + "</id>\n";
					xml += "\t\t\t\t<src>" + letter.attr('src') + "</src>\n";
					xml += "\t\t\t\t<title>" + letter.data('title') + "</title>\n";
					xml += "</letter>\n";
				}
				xml += "\t</manuscript>\n";
			}
			xml += "</regions>";

			var contentType = 'text/xml';

			var getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) ||
				(window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
				window.createObjectURL;

			xmlFile = new Blob([xml], {
				type: contentType
			});

			var a = document.createElement('a');

			if (value == 'xml') {

				a.download = 'letters.xml';
				a.id = 'clickable_link';
				a.href = getBlobURL(xmlFile);
				a.textContent = 'Download XML';
				a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
				var window_link = $("<div id='window_link'>");
				window_link.append(a);

				var p = "<p><button id='close_window_link' style='margin-top:10%;' class='btn btn-danger btn-sm'>Close Window</button></p>";

				window_link.append(p);

				if (!$('#window_link').length) {
					$('body').append(window_link.fadeIn(300));
					$('#close_window_link').on('click', function() {
						window_link.fadeOut(300).remove();
					});
					$('#clickable_link').on('click', function() {
						window_link.fadeOut(300).remove();
					});
				}

			} else {
				var XSLT_FILENAME = 'script.xsl';

				$.ajax({
					url: 'transform_xml/',
					type: 'POST',
					data: {
						'xml': xml,
						'xsl_filename': XSLT_FILENAME
					},
					success: function(data) {
						a.download = 'digipal_images.html';
						a.id = 'clickable_link';

						var htmlFile = new Blob([data], {
							type: contentType
						});
						a.href = getBlobURL(htmlFile);
						a.textContent = 'Download HTML';
						a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
						var window_link = $("<div id='window_link'>");
						window_link.append(a);

						var p = "<p><button id='close_window_link' style='margin-top:10%;' class='btn btn-danger btn-sm'>Close Window</button></p>";

						window_link.append(p);

						if (!$('#window_link').length) {
							$('body').append(window_link.fadeIn(300));
							$('#close_window_link').on('click', function() {
								window_link.fadeOut(300).remove();
							});
							$('#clickable_link').on('click', function() {
								window_link.fadeOut(300).remove();
							});
						}
					}
				});
			}
		},


		import_image: function(e) {
			var files = e.target.files;
			var file = files[0];

			var reader = new FileReader();
			reader.onload = function(ev) {
				var src = ev.target.result;
				var image = $('<img>');
				var wrap_image = $('<div>');
				var title;
				wrap_image.data('from_pc', true);
				wrap_image.attr('id', uniqueid());
				wrap_image.data('size', this.width + ',' + this.height);
				image.attr('src', src);
				if (file.name !== undefined && file.name.length > 28) {
					title = file.name.substr(0, 25) + '...';
				} else {
					title = file.name;
				}
				wrap_image.data('title', title);
				wrap_image.append(image);
				_self.imagesBox.imagesSelected.push(wrap_image);
				_self.imagesBox.to_workspace();
				_self.imagesBox.imagesSelected = [];
				return false;
			};
			reader.readAsDataURL(file);
		},


		import_xml: function(e) {
			var files = e.target.files;
			var file = files[0];

			var reader = new FileReader();
			reader.onload = function(ev) {
				var letters = ev.target.result;
				var x2jsOptionsSample = new X2JS({
					escapeMode: false,
					attributePrefix: "_",
					arrayAccessForm: "none"
				});
				var x2js = new X2JS(x2jsOptionsSample);
				var xml = _self.utils.stringToXML(letters);
				var json = x2js.xml2json(xml);
				_self.letters.importLetters(json.regions.manuscript);
				if (_self.letters.regions.length) {
					$('#export_xml').removeClass('disabled');
					$('#export_html').removeClass('disabled');
				} else {
					$('#export_xml').addClass('disabled');
					$('#export_html').addClass('disabled');

				}
			};
			reader.readAsText(file);
		},

		clean_array: function(array) {
			for (var i = 0; i < array.length; i++) {
				if (typeof array[i].id == "undefined") {
					array.splice(i, 1);
					i--;
				}
			}
			return array;
		},

		importLetters: function(array_letters) {
			var letters = array_letters;
			var array = [];
			var value, letter, i, g;
			if (letters.hasOwnProperty(length)) {
				for (var d = 0; d < letters.length; d++) {
					value = letters[d];
					for (i = 0; i < value.letter_asArray.length; i++) {
						letter = $('<img>');
						letter.attr('class', 'letter');
						letter.data('manuscript', value.title);
						letter.data('manuscript_id', value.id);
						letter.attr('id', value.letter_asArray[i].id);
						letter.attr('src', value.letter_asArray[i].src);
						letter.data('size', value.letter_asArray[i].size);
						letter.data('title', value.letter_asArray[i].title);
						array.push(letter);
					}
				}
				for (g = 0; g < array.length; g++) {
					_self.letters.addLetter(array[g]);
				}
			} else {
				for (i = 0; i < letters.letter_asArray.length; i++) {
					letter = $('<img>');
					letter.attr('class', 'letter');
					letter.data('manuscript', letters.title);
					letter.data('manuscript_id', letters.id);
					letter.attr('id', letters.letter_asArray[i].id);
					letter.attr('src', letters.letter_asArray[i].src);
					letter.data('size', letters.letter_asArray[i].size);
					letter.data('title', letters.letter_asArray[i].title);
					array.push(letter);
				}
				for (g = 0; g < array.length; g++) {
					_self.letters.addLetter(array[g]);
				}
			}
		}
	};

	this.import = {
		_self: this,
		open: false,
		manager: false,
		files: [],

		init: function() {

			this.buttons();
			this.refresh();

		},

		show: function() {
			this.open = true;
			var import_element = $('#import');
			if (!this.manager) {

				var button_position = $('#load').position();
				import_element.css({
					'top': $('#buttons').position().top + button_position['top'],
					'left': "2%"
				});
				$('#load').hide();
				import_element.show().animate({
					"top": "14%",
					'left': "28%",
					'width': "40%",
					'height': "25%",
					'opacity': 1,
					'z-index': 400
				}, {
					duration: 250,
					complete: function() {
						$('#close_import').click(function() {
							_self.import.hide();
						});


						$('#open_load_from_pc').click(function() {
							_self.import.show_manager();
						});
					}
				}).draggable({
					handle: '.top_box'
				});
			} else {
				import_element.show().animate({
					"top": "5%",
					'left': "20%",
					'width': "60%",
					'height': "90%",
					'opacity': 1,
					'z-index': 400
				}, {
					duration: 250
				}).draggable({
					handle: '.top_box'
				});
			}
		},

		hide: function() {
			this.open = false;
			$('#load').show();
			var button_position = $('#load').position();

			$('#import').animate({
				"top": $('#buttons').position().top + button_position['top'],
				'left': "2%",
				'width': "0%",
				'height': "0%",
				'opacity': 0
			}, {
				duration: 250,
				complete: function() {
					$(this).hide();
				}
			});

		},

		buttons: function() {

			$('#load').click(function() {
				_self.import.show();
			});

		},

		refresh: function() {
			var json;
			for (var i = 0, len = localStorage.length; i < len; i++) {
				var key = localStorage.key(i);
				var value = localStorage[key];
				try {
					json = JSON.parse(value);
				} catch (e) {
					continue;
				}
				if (json['session_file']) {
					this.files.push([key, value]);
				}
			}
		},

		refreshView: function() {
			var folder = '';

			for (var i = 0; i < this.files.length; i++) {
				folder += "<div class='folder' id='" + this.files[i][0] + "'><img src='/static/img/folder.png' /><div class='folder_title'>" + this.files[i][0] + "</div></div>";
			}
			$("#import").children('.box_container').html(folder);

			$('.folder').click(function() {
				_self.import.selectItem($(this));
			});

			$('.folder').click(function() {
				_self.import.loadFile($selectedItem.attr('id'));
				$selectedItem.children('img').css('opacity', 1);
				$selectedItem = undefined;
			});
		},

		selectItem: function(item) {
			if (typeof $selectedItem != "undefined") {
				$selectedItem.children('img').css('opacity', '1');
			}
			$selectedItem = item;
			$selectedItem.children('img').css('opacity', '0.5');
		},

		show_manager: function() {
			$('#import').show().animate({
				'top': "5%",
				'left': "20%",
				'width': "60%",
				'height': "90%",
				'opacity': 1,
				'z-index': 400
			}, {
				duration: 250,
				complete: function() {
					var folder = '';
					var files = _self.import.files;
					for (var i = 0; i < files.length; i++) {
						folder += "<div class='folder col-lg-3' id='" + files[i][0] + "'><img src='/static/img/folder.png' /><div class='folder_title'>" + files[i][0] + "</div></div>";
					}

					var breadcrumb = "<div class='row-fluid'><div style='line-height:2;margin:0;'";
					breadcrumb += "class='breadcrumb'><li><a id='back_to_load'>Load a session</a> </li>";
					breadcrumb += "<li class='active'>Local Manager</li>";

					breadcrumb += " <li class='pull-right no-before'><button id='load_session_button' class='btn btn-primary btn-sm'>Load</button> ";
					breadcrumb += "<button id='delete_session_button' class='btn btn-danger btn-sm'>Delete</button></li></div></div>";

					$('#top_load_box').html(breadcrumb).slideDown(100);
					$(this).children('.box_container').css('margin', 0).html(folder);

					$('.folder').click(function() {
						_self.import.selectItem($(this));
					});

					$('.folder').click(function() {
						if (typeof $selectedItem != "undefined") {
							_self.import.loadFile($selectedItem.attr('id'));
							$selectedItem.children('img').css('opacity', 1);
							$selectedItem = undefined;
						} else {
							return false;
						}
					});

					$('#load_session_button').click(function() {
						if (typeof $selectedItem != "undefined") {
							_self.import.loadFile($selectedItem.attr('id'));
							$selectedItem.children('img').css('opacity', 1);
							$selectedItem = undefined;
						} else {
							return false;
						}
					});

					$('#delete_session_button').click(function() {
						if (typeof $selectedItem != "undefined") {
							_self.import.delete_session($selectedItem.attr('id'));
							$selectedItem.children('img').css('opacity', 1);
							$selectedItem.fadeOut(300).remove();
							$selectedItem = undefined;
						} else {
							return false;
						}
					});

					_self.import.manager = true;

					$('#back_to_load').click(function() {
						var import_element = $('#import');
						var back = "<button id='open_load_from_pc' class='btn btn-primary'>Load from File</button> ";
						back += "<button id='load_from_db' class='btn btn-primary disabled'>Load from your Account</button>";

						import_element.children('.box_container').html(back);
						$('#top_load_box').slideUp(100);
						import_element.show().animate({
							"top": "14%",
							'left': "29%",
							'width': "40%",
							'height': "25%",
							'margin': 0,
							'opacity': 1,
							'z-index': 400
						}, {
							duration: 250,
							complete: function() {
								_self.import.manager = false;

								$('#open_load_from_pc').click(function() {
									_self.import.show_manager();
								});
							}
						});
					}).draggable();
				}
			});
		},

		delete_session: function(file) {
			if (file in localStorage) localStorage.removeItem(file);
			for (var i = 0; i < this.files.length; i++) {
				if (this.files[i][0] == file) {
					this.files.splice(i, 1);
					break;
				}
			}
		},

		loadFile: function(file) {
			var file_session = localStorage.getItem(file);
			_self.import.parse(file_session);
			$('#import').fadeOut();
			$('#load').fadeIn();
		},

		parse: function(file) {
			var json = JSON.parse(file);
			var images = [];
			var comments = [];
			var letters = [];
			var toolbar = json['session_properties']['toolbar'];
			for (var i = 0; i < json['image_properties'].length; i++) {
				images.push(json['image_properties'][i]['image']);
			}
			for (i = 0; i < json['session_properties']['comments'].length; i++) {
				comments.push(json['session_properties']['comments'][i]);
			}
			for (i = 0; i < json['session_properties']['letters'].length; i++) {
				letters.push(json['session_properties']['letters'][i]);
			}
			this.reset();

			_self.import.reloadImages(images, json['image_properties']);
			_self.import.importComments(comments);
			_self.import.importLetters(letters);

			if (toolbar) {
				_self.import.restoreToolbar(toolbar);
			}

			$('html, body').animate({
				scrollTop: json['session_properties']['window']['top'],
				scrollLeft: json['session_properties']['window']['left']
			}, 1000);


		},

		reloadImages: function(images, images_properties) {
			var images_loaded = [];
			var letters = [];
			for (var i = 0; i < images.length; i++) {
				if ((!images_properties[i]['properties']['is_letter'])) {
					$.ajax({
						type: 'POST',
						url: 'get-image-manuscript/',
						data: {
							'image': images[i]
						},
						async: false,
						beforeSend: function() {

						},
						success: function(data) {
							images_loaded.push(data);
						},
						complete: function(data) {

						}
					});
				} else {
					letters.push(images_properties[i]);
				}
			}
			_self.import.printImages(images_loaded, images_properties);
			_self.import.printLetters(letters);
		},

		printLetters: function(images) {
			for (var i = 0; i < images.length; i++) {
				var src = unescape(images[i]['src']);
				var image = "<div data-size = '" + images[i]['original_size'] + "' class='image_active' id='" + images[i]['image'] + "'><img src='" + unescape(src) + "' /></div>";
				$('#barRight').append(image);
				$("#" + images[i]['image']).css({
					"position": "absolute",
					"top": images[i]['position']['top'],
					"left": images[i]['position']['left'],
					"max-width": "none",
					"z-index": images[i]['properties']['z-index']
				}).draggable({
					revert: false,
					scroll: true,
					opacity: 0.8,
					stack: '.image_active',
					cursor: "move",
					aspectRatio: true,
					drag: function(ui, event) {
						position = $(this).offset();
						_self.minimap.update_mini_map();
					},
					stop: function(ui, event) {
						$(ui.helper).css('z-index', 0);
					}
				}).data("is_letter", true).children('img').css({
					"width": images[i]['size']['width'],
					'height': images[i]['size']['height']
				}).resizable({
					aspectRatio: true,
					resize: function(event, ui) {
						var element = $("#" + ui.element.parent().attr('id'));
						$('#mini_' + ui.element.attr('id')).animate({
							'width': parseInt(element.css('width')) / 65 + "px",
							'height': parseInt(element.css('height')) / 55 + "px"
						}, 10);
						_self.toolbar.refreshSize();
					}
				}).children('img').css({
					"opacity": images[i]['properties']['opacity']
				});

				$('#' + images[i]['image']).dblclick(function(event) {
					_self.select_group.select($(this));
					event.stopPropagation();
				});

				_self.minimap.add_to_minimap(images[i]['image'], src);
			}
		},


		printImages: function(images, images_properties) {
			for (var i = 0; i < images.length; i++) {
				if (images_properties) {
					var image = '<div data-external+"true" data-size = "' + images_properties[i]['original_size'] + '" data-title = "' + images[i][2] + '" class="image_active" id = "' + parseInt(images[i][1]) + '">' + images[i][0] + "<div class='image_desc col-lg-8 col-md-8 col-xs-8 offset1 image_desc'> <p><b>Manuscript</b>: " + images[i][2] + "</p> " + "<p><b>Repository</b>: " + images[i][3] + "<p><b>Place</b>: " + images[i][4] + "</p></div><br clear='all' /></div>";
					$("#barRight").append(image);

					if (images_properties[i]['image'] == images[i][1]) {

						var image_src = $('#' + images[i][1]).find('img');
						$('#' + images[i][1]).css({
							"position": "absolute",
							"top": images_properties[i]['position']['top'],
							"left": images_properties[i]['position']['left'],
							"max-width": "none",
							"max-height": "none",
							"z-index": images_properties[i]['properties']['z-index']
						}).draggable({
							revert: false,
							scroll: true,
							opacity: 0.8,
							stack: '.image_active',
							cursor: "move",
							drag: function(ui, event) {
								position = $(this).offset();
								_self.minimap.update_mini_map();
							},
							stop: function(ui, event) {
								$(ui.helper).css('z-index', 0);
							}
						}).children('img').css({
							"opacity": images_properties[i]['properties']['opacity'],
							"max-width": "none",
							"width": images_properties[i]['size']['width'],
							'height': images_properties[i]['size']['height']
						}).resizable({
							aspectRatio: true,
							resize: function(event, ui) {
								var element = $("#" + ui.element.attr('id'));
								$('#mini_' + ui.element.parent().attr('id')).animate({
									'width': parseInt(element.css('width')) / 65 + "px",
									'height': parseInt(element.css('height')) / 55 + "px"
								}, 10);
								_self.toolbar.refreshSize();
							}
						});

						$("#" + images[i][1]).dblclick(function(event) {
							_self.select_group.select($(this));
							event.stopPropagation();
						});

						_self.minimap.add_to_minimap(images[i][1], image_src);

					}
				} else {
					var image = '<div data-external="true" data-size = "' + images[i][4] + '" data-title = "' + images[i][2] + '" class="image" id = "' + parseInt(images[i][1]) + '">' + images[i][0] + "<div class='col-lg-8 col-md-8 col-xs-8 offset1 image_desc'> <p><b>Manuscript</b>: " + images[i][2] + "</p> " + "<p><b>Repository</b>: " + images[i][3] + "<p><b>Place</b>: " + images[i][4] + "</p></div><br clear='all' /></div>";
					$("#hidden_div").append(image);
					_self.imagesBox.imagesSelected.push($(image));
				}
			}
			if (_self.imagesBox.imagesSelected.length) {
				return true;
			}

		},

		importComments: function(comments) {
			_self.comments.notes = comments;
			for (var i = 0; i < comments.length; i++) {
				_self.comments.update_notes(comments[i]);
			}
		},

		importLetters: function(letters) {

			//_self.letters.regions = [];
			for (var i = 0; i < letters.length; i++) {
				for (var j = 0; j < letters[i].letters.length; j++) {
					var letter = $('<img>');
					letter.attr('class', 'letter');
					letter.attr('id', letters[i].letters[j].id);
					letter.attr('src', letters[i].letters[j].src);
					letter.data('size', letters[i].letters[j].size);
					letter.data('manuscript', letters[i].letters[j].manuscript);
					letter.data('manuscript_id', letters[i].letters[j].manuscript_id);
					letter.data('title', letters[i].letters[j].title);
					_self.letters.addLetter(letter);
				}
			}
		},

		restoreToolbar: function(toolbar) {

			_self.toolbar.init()
			_self.toolbar.create();
			_self.toolbar.refresh();
		},

		reset: function() {
			_self.comments.notes = [];
			_self.workspaceImages.imagesSelected = [];
			_self.letters.lettersSelected = [];
			$('.image_active').remove();
			$('.image').remove();
			$('.letter').remove();
			_self.minimap.clean_minimap();
			_self.comments.clean_notes();
			_self.select_group.imagesSelected = [];
			if (_self.toolbar.exists()) {
				_self.toolbar.toolbox.remove();
			}
		}

	};

	this.minimap = {
		_self: this,
		images: [],

		add_to_minimap: function(id, src) {
			var image = $("#" + id);
			var position = image.offset();
			var top = position['top'] / $(window).height() * 22;
			var left = position['left'] / $(window).width() * 40;
			var size = image.css(['width', 'height']);
			var mini_id = 'mini_' + id;
			var element = $("<img>");
			element.data('image', id);
			element.attr('id', mini_id);
			element.attr('class', 'image_map');
			element.attr('src', src);
			$('#overview').append(element);
			element.css({
				"width": parseInt(size['width']) / 20 + "px",
				"height": parseInt(size['height']) / 20 + "px",
				"top": top,
				"left": left
			});
			if (_self.workspaceImages.workspace != image.data('workspace')) {
				element.css({
					'display': 'none'
				});
			}
			this.make_scrollable(element);
			this.images.push(element);
		},

		make_scrollable: function(map_image) {
			$(map_image).click(function(event) {
				var image = map_image.data('image');
				var position = $('#' + image).offset();
				$('html, body').animate({
					scrollTop: position.top - 100,
					scrollLeft: position.left - 100
				}, 800);
				event.stopPropagation();
			});

		},

		update_mini_map: function(ui) {
			if (typeof ui != "undefined") {
				var top, left, image;
				if (ui.helper.hasClass('selected')) {
					$.each($('.selected'), function() {
						top = parseInt($(this).css('top')) / $(window).height() * 22;
						left = parseInt($(this).css('left')) / $(window).width() * 40;
						if (_self.workspaceImages.workspace == 'barRight2') {
							top = top / 2;
							left = left / 2;
						}
						image = {
							'top': top,
							'left': left
						};
						$("#mini_" + $(this).attr('id')).animate({
							'left': image['left'],
							'top': image['top']
						}, 0);
					});
				} else {
					element = ui.helper;
					top = parseInt($(this).css('top')) / $(window).height() * 22;
					left = parseInt($(this).css('left')) / $(window).width() * 40;
					if (_self.workspaceImages.workspace == 'barRight2') {
						top = top / 2;
						left = left / 2;
					}
					image = {
						'top': top,
						'left': left
					};
					$("#mini_" + element.attr('id')).animate({
						'left': image['left'],
						'top': image['top']
					}, 0);
				}
			}

		},

		clean_minimap: function() {
			var images = this.images;
			for (var i = 0; i < images.length; i++) {
				var id = $(images[i]).attr('id');
				$('#' + id).remove();
			}
			this.images = [];
		}
	};

	this.export = {
		_self: this,
		open: false,

		init: function() {

			this.buttons();
		},

		show: function() {
			this.open = true;
			var button_position = $('#save').position();
			$('#save').hide();
			$('#export').css({
				"top": $('#buttons').position().top + button_position.top,
				'left': "2%"
			}).show().animate({
				"top": "20%",
				'left': "29%",
				'width': "42%",
				'height': "35%",
				'opacity': 1,
				'z-index': 400
			}, {
				duration: 350,
				complete: function() {
					$('#close_export').click(function() {
						_self.export.hide();
					});
				}
			}).draggable();
		},

		hide: function() {
			this.open = false;
			$('#save').show();
			var button_position = $('#save').position();
			$('#export').animate({
				"top": $('#buttons').position().top + $('#save').position().top,
				'left': "2%",
				'width': "0%",
				'height': "0%",
				'opacity': 0
			}, {
				duration: 250,
				complete: function() {
					$(this).hide();
				}
			});

		},

		buttons: function() {
			$('#save').click(function() {
				_self.export.show();
			});

			$('#save_to_pc').click(function() {
				_self.export.main();
			});
		},

		exportImages: function() {
			var images = [];
			var workspace_images = $('.image_active');
			return workspace_images;
		},

		exportImagesProperties: function(images) {
			var images_properties = [];
			for (var i = 0; i < images.length; i++) {

				var position = function() {
					var get_position = $(images[i]).offset();
					return get_position;
				};

				var size = function() {
					var dimension = $(images[i]).children().children('img').css(['width', "height"]);
					return {
						"width": dimension['width'],
						'height': dimension['height']
					};
				};

				var original_size = function() {
					var size = $(images[i]).data('size');
					return size;
				};

				var zIndex = function() {
					return $(images[i]).children().children('img').css('z-index');
				};

				var get_brightness = function() {

					String.prototype.getNums = function() {
						var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
							mapN = this.match(rx) || [];
						return mapN.map(Number);
					};

					var slider_brightness = $("#slider_brightness").slider("option", "value");
					var brightness;
					if (typeof slider_brightness != 'object') {
						brightness = slider_brightness;
					} else {
						brightness = 200;
					}

					return brightness;
				};

				var propriety = {
					'opacity': $(images[i]).children().children('img').css('opacity'),
					'brightness': get_brightness(),
					'is_letter': $(images[i]).data('is_letter')
				};

				var image = {
					'image': $(images[i]).attr('id'),
					'position': position(),
					'size': size(),
					'original_size': original_size(),
					'properties': propriety,
					"z-index": zIndex()
				};

				if ($(images[i]).data('is_letter')) {
					var src = $(images[i]).children().children('img').attr('src');
					image.src = src;
				} else {
					image.src = false;
				}

				images_properties.push(image);

			}

			return images_properties;
		},

		export_letters: function() {
			var letters = _self.letters.regions;
			if (letters.length) {
				var manuscripts_extracted = [];
				var letters_extracted = [];
				for (var i = 0; i < letters.length; i++) {
					var region = {
						'manuscript': letters[i].title,
						'id': letters[i].id,
						'letters': []
					}
					for (var j = 0; j < letters[i].letters.length; j++) {
						var letter = {
							'src': letters[i].letters[j].attr('src'),
							'size': letters[i].letters[j].data('size'),
							'id': letters[i].letters[j].attr('id'),
							'manuscript': letters[i].letters[j].data('manuscript'),
							'manuscript_id': letters[i].letters[j].data('manuscript_id'),
							'title': letters[i].letters[j].data('title')
						}
						region.letters.push(letter);
					}
					manuscripts_extracted.push(region);
				}
				return manuscripts_extracted;
			} else {
				return false;
			}
		},

		export_session_properties: function() {

			var create_toolbar = function() {
				_self.toolbar.init();
				if (_self.toolbar.exists()) {

					var toolbar = {
						'position': _self.toolbar.toolbox.position()
					};

				} else {
					var toolbar = false;
				}

				return toolbar;
			};

			var letters = this.export_letters();

			var windowPosition = function() {
				return {
					'top': $(window).scrollTop(),
					'left': $(window).scrollLeft()
				};
			};

			var general_properties = {
				'toolbar': create_toolbar(),
				'comments': _self.comments.notes,
				'letters': letters,
				'window': windowPosition()
			};

			return general_properties;

		},

		create: function() {
			var images = this.exportImages();
			var image_properties = this.exportImagesProperties(images);
			var session_properties = this.export_session_properties();
			var session = {
				'session_file': true,
				'session_properties': session_properties,
				'image_properties': image_properties
			};
			return session;
		},

		main: function() {

			var data_session = _self.export.create();
			var item = $('#name_export').val();
			if (item != '') {
				console.log(data_session)
				if (localStorage.getItem(item) === null) {
					localStorage.setItem(item, JSON.stringify(data_session));
					var element = localStorage.getItem(item);
					_self.import.files.push([item, element]);

					if (_self.import.manager) {
						_self.import.refreshView();
					}

					$('#export').fadeOut();
					$('#save').fadeIn();

					$.fn.notify({
						'type': 'success',
						'text': 'Session succesfully saved',
						'close-button': true,
						"position": {
							'top': "8%",
							'left': '79%'
						}
					});

				} else {

					$.fn.notify({
						'type': 'error',
						'text': 'The name chosen already exists. Please try again',
						'close-button': true,
						"position": {
							'top': "8%",
							'left': '79%'
						}
					});

				}
			} else {

				$.fn.notify({
					'type': 'error',
					'text': 'Insert a valid name to save this session',
					'close-button': true,
					"position": {
						'top': "8%",
						'left': '79%'
					}
				});

			}

		}
	};

	this.align = {
		_self: this,

		align: function() {
			var images = $('.selected');
			var page_position = $('#overview').offset();
			var n = 0;
			var x = 0;
			var d = 0;

			var image = $(images[0]);
			image.animate({
				'position': 'fixed',
				'top': page_position.top - $(window).height() + 150 + d,
				'left': $(window).scrollLeft() + 250
			}, 250);

			for (var i = 1; i < images.length; i++) {
				img = $(images[i]);
				img.css({
					'position': 'relative',
					'top': page_position.top - $(window).height() + 150 + d,
					'left': "5px"
				});
				var n = $('.selected:last-child').offset().left;

			}
		}

	};

	this.menu = {
		_self: this,
		open: true,

		init: function() {
			this.buttons();
		},

		hide: function() {
			this.open = false;
			$('#buttons').animate({
				'left': '-10%'
			}, 300);
			$('#icon-up').css({
				'background-position': '-60px 0'
			});
		},

		show: function() {
			this.open = true;
			$('#buttons').animate({
				'left': '0'
			}, 300);
			$('#icon-up').css({
				'background-position': '-45px -15px'
			});
		},

		buttons: function() {
			$('#menu').click(function() {
				var status = _self.menu.open;
				if (!status) {
					_self.menu.show();
				} else {
					_self.menu.hide();
				}
			});
		}
	};

	this.keyboardEvents = {
		_self: this,
		init: function() {
			this.events();
		},

		events: function() {


			$(document).on('keydown', function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);

				if (e.altKey) {

					if (code == 78) {
						if (_self.comments.open) {
							_self.comments.hide_notes();
						} else {
							_self.comments.show_notes();
						}
					}

					if (code == 73) {
						if (!_self.imagesBox.open) {
							_self.imagesBox.show();
						} else {
							_self.imagesBox.hide();
						}
					}

					if (code == 82) {
						if (_self.letters.open) {
							_self.letters.hide_letters();
						} else {
							_self.letters.open_lettersbox();
						}
					}

					if (code == 83) {
						if (!_self.export.open) {
							_self.export.show();
						} else {
							_self.export.hide();
						}
					}

					if (code == 76) {
						if (_self.import.open) {
							_self.import.hide();
						} else {
							_self.import.show();
						}
					}

					if (code == 77) {
						if (_self.menu.open) {
							_self.menu.hide();
						} else {
							_self.menu.show();
						}
					}
				}


			});

		}

	};


	this.utils = {

		stringToXML: function(text) {
			try {
				var xml = null;

				if (window.DOMParser) {

					var parser = new DOMParser();
					xml = parser.parseFromString(text, "text/xml");

					var found = xml.getElementsByTagName("parsererror");

					if (!found || !found.length || !found[0].childNodes.length) {
						return xml;
					}

					return null;
				} else {

					xml = new ActiveXObject("Microsoft.XMLDOM");

					xml.async = false;
					xml.loadXML(text);

					return xml;
				}
			} catch (e) {
				// suppress
			}
		},

		getParameter: function(paramName) {
			var searchString = window.location.search.substring(1),
				i, val, params = searchString.split("&");
			var parameters = [];
			for (i = 0; i < params.length; i++) {
				val = params[i].split("=");
				if (val[0] == paramName) {
					parameters.push(unescape(val[1]));
				}
			}
			return parameters;
		},

		getAspectRatio: function(width, height) {
			var ratio = width / height;
			return (Math.abs(ratio - 4 / 3) < Math.abs(ratio - 16 / 9)) ? '4:3' : '16:9';
		},

		getCookie: function(name) {
			var cookieValue = null;
			if (document.cookie && document.cookie !== '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	};

	this.loadExternalImages = {
		_self: this,
		init: function(parameter) {

			var parameters = this.parse(parameter);
			if (!parameters.length) {
				//$.imagesBox.show();
				return;
			}
			/*
		var button = " <img data-toggle='tooltip' title='Browse Manuscripts' id='button_images' src='/static/img/_manuscript.png' />";
		$('#buttons').prepend(button);

		$('#button_images').click(function() {
			$.imagesBox.show();
		});
		*/
			var images_list = JSON.parse(parameters[0]);
			var images = [];

			for (i = 0; i < images_list.length; i++) {
				images.push(images_list[i]);
			}

			var data;
			if (parameter == 'images') {
				data = {
					'images': JSON.stringify(images)
				};
			} else {
				data = {
					'annotations': JSON.stringify(images)
				};
			}

			var request = $.get("images/", data);

			request.done(function(data) {
				if (_self.import.printImages(data)) {
					_self.imagesBox.to_workspace();
					$("#hidden_div").remove();
				}
			});


		},

		parse: function(parameter) {
			var parameters = _self.utils.getParameter(parameter);
			return parameters;
		}

	};

	this.select_group = {
		_self: this,

		imagesSelected: [],

		select: function(image) {
			if (image.hasClass('selected') === true) {
				image.find('.ui-wrapper').css('box-shadow', '0px 0px 10px 3px #444');
				image.removeClass('selected');
				image.data('selected', false);
				image.draggable({
					alsoDrag: false
				});
				image.find('img').resizable('destroy');
				for (var i = 0; i < this.imagesSelected.length; i++) {
					if ($(this.imagesSelected[i]).attr('id') == image.attr('id')) {
						this.imagesSelected.splice(i, 1);
						i--;
					}
				}

			} else {

				image.addClass('selected');
				image.data('selected', true);
				image.draggable({
					alsoDrag: ".selected"
				});
				image.find('img').resizable({
					aspectRatio: true,
					animate: true,
					alsoResize: '.selected, .selected > div, .selected > div > img',
					resize: function(event, ui) {
						if (_self.select_group.imagesSelected.length <= 1) {
							$('#mini_' + ui.element.parent().attr('id')).animate({
								'width': parseInt($(this).css('width')) / 65 + "px",
								'height': parseInt($(this).css('height')) / 55 + "px"
							}, 10);
						} else {
							$.each($('.selected'), function() {
								$('#mini_' + $(this).attr('id')).animate({
									'width': parseInt($(this).children().css('width')) / 65 + "px",
									'height': parseInt($(this).children().css('height')) / 55 + "px"
								}, 10);
							});
						}
						_self.toolbar.refreshSize();
					}

				});
				_self.select_group.imagesSelected.push(image);
			}

			image.find('.ui-wrapper').css('boxShadow', '0px 0px 30px rgba(255, 246, 9, 1)');

			if (!_self.toolbar.exists()) {
				_self.toolbar.create();
				_self.toolbar.refresh();
			} else {
				_self.toolbar.refresh();
			}

			if (this.imagesSelected.length == 1) {
				$('.crop_button').removeClass('disabled');
				$('#createComment').removeClass('disabled');

				_self.comments.check_notes();

			} else {
				$('.crop_button').addClass('disabled');
				$('#createComment').addClass('disabled');
				$('#open_notes').fadeOut().remove();
			}

			if (this.imagesSelected.length == 2) {
				$('#compare_toolbar').removeClass('disabled').attr('disabled', false);
			} else {
				$('#compare_toolbar').addClass('disabled').attr('disabled', true);
			}
		}
	};

	this.is_selected = function() {
		if (typeof $selectedImage != "undefined" && $(this).attr('id') == $selectedImage.attr('id')) {
			return true;
		} else {
			return false;
		}
	};

	this.images_on_workspace = function() {
		var images = $('.image_active');
		return images;
	};

	this.init = function() {
		_self = this;

		_self.toolbar.init();
		_self.menu.init();
		_self.imagesBox.init(); // Launch window images function

		_self.export.init();
		_self.import.init();
		_self.keyboardEvents.init();

		Array.prototype.clean = function(deleteValue) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] == deleteValue) {
					this.splice(i, 1);
					i--;
				}
			}
			return this;
		};



		// Changes XML to JSON

		var images_on_minimap = [];

		// Check if the image is selected


		// Get the images on workspace


		$('img').tooltip({
			placement: 'right',
			trigger: 'hover'
		});

		$('#marker').draggable({
			scroll: false,
			opacity: 0.5,
			cursor: 'move',
			containment: $('#overview'),
			appendTo: 'body',
			revert: 'invalid'
		});


		$(window).scroll(function(event) {
			var position = {
				'top': $(window).scrollTop() / $(window).height() * 20,
				'left': $(window).scrollLeft() / $(window).width() * 20
			};
			$('#marker').animate({
				'left': position['left'],
				'top': position['top']
			}, 0);
		});

		$('#notes_button').click(function() {
			_self.comments.show_notes();
		});

		$('#letters_button').click(function() {
			_self.letters.open_lettersbox();
		});


		var windows_flag = 0;

		var workspace_button = $('#workspace');

		function restore_window() {
			workspace_button.animate({
				'background-color': 'transparent'
			}, 50, function() {
				$('#barRight, #barRight2').animate({
					'background-color': '#ccc',
					'-moz-transform': 'scale(1)',
					'margin': '0',
					'zoom': 1
				}, 300).removeClass('toggle').unbind();
				$('#barRight').style = null;
				$('#workspace1').css('background', 'rgb(204, 204, 204');
				windows_flag = 0;
				$('html, body').css('width', '12050px');
			});

			var images = $(".image_active");
			$.each(images, function() {
				var id = $(this).attr('id');
				if (_self.workspaceImages.workspace != $(this).data('workspace')) {
					$("#mini_" + id).css({
						'display': 'none'
					});
				} else {
					$("#mini_" + id).css({
						'display': 'block'
					});
				}
			});

			_self.menu.show();
		}

		uniqueid = function() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 5; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		};


		if (document.body.style.webkitFilter !== undefined) {
			workspace_button.click(function() {
				$(this).animate({
					'background-color': '#444'
				}, 50, function() {
					if (windows_flag === 0) {
						$('#barRight, #barRight2').css({
							'background-color': '#666',
							'-moz-transform': 'scale(0.22)',
							'margin': '1%',
							'margin-top': '3.5%',
							'zoom': '11%'
						}).addClass('toggle');
						$('#barRight').css('margin-left', '5%');
						windows_flag = 1;
						$('#set_size').attr('disabled', true).addClass('disabled');

						$('html, body').css('width', 'auto');
						$('#workspace1').css('background', '#000');

						_self.menu.hide();
						$('#barRight').click(function(e) {
							_self.workspaceImages.workspace = 'barRight';
							restore_window();
							$('html, body').animate({
								scrollTop: e.clientY + 100,
								scrollLeft: e.clientX
							}, 300);
							$('#set_size').attr('disabled', false).removeClass('disabled');
						});

						$('#barRight2').click(function(e) {
							_self.workspaceImages.workspace = 'barRight2';
							restore_window();
							$('html, body').animate({
								scrollTop: e.clientY - 100,
								scrollLeft: e.clientX + 3000
							}, 300);
							$('#set_size').attr('disabled', false).removeClass('disabled');
						});

					} else {
						restore_window();
					}

				});
			});

		} else {
			workspace_button.remove();
		}


		if (!_self.defaults.development) {
			document.onmousedown = disableclick;
		}

		function disableclick(event) {
			$(document).on('contextmenu', function() {
				return false;
			});

			if (event.button == 2) {
				return false;
			}
		}

		function handleFiles(files) {
			var file = files[0];
			var reader = new FileReader();
			reader.onload = onFileReadComplete;
			reader.readAsText(file);
		}

		if (_self.utils.getParameter('images').length || _self.utils.getParameter('annotations').length) {
			_self.loadExternalImages.init('images');
			_self.loadExternalImages.init('annotations');
			_self.imagesBox.hide();
		}


		$('#search').typeahead({
			source: array_pages
		});

		var window_width = $(window).width();
		var window_height = $(window).height();
		var width, height;
		var aspect_ratio = _self.utils.getAspectRatio(window_width, window_height);

		if (aspect_ratio == '4:3') {
			width = window_width * 4.2;
			height = window_height * 4;
		} else {
			width = window_width * 4.2;
			height = window_height * 4;
		}

		$('#barRight, #barRight2').css({
			'height': height,
			'width': width
		});

		$('#overview').css({
			'height': (height / 2) / 14.5,
			'width': (width / 2) / 13
		});

		$('#overview').click(function(event) {
			event.stopPropagation();

			var body = $('body');
			var x = (event.offsetX || event.clientX - $(event.target).position().left);
			var y = (event.offsetY || event.clientY - $(event.target).position().top);
			var top = (y / $(this).height()) * 100;
			var left = (x / $(this).width()) * 100;
			var scrollLeft = ((body.width() / 100) * left) - 100;
			var scrollTop = ((body.height() / 100) * top) - 100;

			console.log(x + ':' + y);

			$('html, body').animate({
				scrollLeft: scrollLeft,
				scrollTop: scrollTop,
			}, 800);



			var pointer = $('<div>');
			pointer.addClass('pointer');

			pointer.css({
				position: 'absolute',
				left: x,
				top: y
			});

			$(this).append(pointer);
			setTimeout(function() {
				pointer.remove();
			}, 1000);
		});

		$('body', 'html').dblclick(function(event) {
			_self.toolbar.deselectAll();
			event.stopPropagation();
		});

		$('#load_image').unbind().on('change', function(e) {
			_self.letters.import_image(e);
		});

		var csrftoken = _self.utils.getCookie('csrftoken');
		$.ajaxSetup({
			headers: {
				"X-CSRFToken": csrftoken
			}
		});

	}

}

$(document).ready(function() {

	if (document.body.style.webkitFilter === undefined) {
		polyfilter_scriptpath = '/static/js/libs/lib/';
		polyfilter_skip_stylesheets = true;
		$.getScript('/static/js/libs/polyfill/cssParser.js');
		$.getScript('/static/js/libs/polyfill/css-filters-polyfill.js');
	}

	var options = {
		'development': true
	};

	$lightbox = new Lightbox(options);

	$lightbox.init();

});