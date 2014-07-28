/**
 * Images class to explore database and import images
 */

this.imagesBox = {
	_self: this,
	open: true,
	imagesSelected: [],
	imagesBox: $('#barLeft'),

	/**
	 * Attaches events
	 */
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

	},

	hide: function() {
		this.open = false;

		var button = " <div data-toggle='tooltip' data-placement='right' data-container='body' title='Browse Manuscripts' id='button_images' class='glyphicon glyphicon-search'></div>";

		var button_toolbar = $('#button_toolbar');
		var buttons = $('#buttons');
		if (button_toolbar.length) {
			button_toolbar.after(button);
		} else {
			buttons.prepend(button);
		}

		var buttons_position = $('#button_images');

		this.imagesBox.show().animate({
			top: buttons.position().top + buttons_position.position().top + 30,
			left: "2%",
			width: 0,
			height: 0,
			opacity: 0
		}, {
			duration: 250,
			complete: function() {
				$(this).hide();
				buttons_position.tooltip({
					placement: 'right',
					trigger: 'hover'
				}).click(function() {
					_self.imagesBox.show();
				});
			}
		});

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
		var images = _self.imagesBox.imagesSelected;
		if (_self.imagesBox.is_selected(image)) {
			image.data('selected', false);
			image.find('img').removeClass('selected_image');
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
				image.find('img').addClass('selected_image');
			}

		}

	},

	to_workspace: function(param) {
		var images = _self.imagesBox.imagesSelected;
		var images_on_workspace = $('.image');
		if (images.length) {
			var page_position = $('#overview').offset();
			for (var i = 0; i < images.length; i++) {

				var new_images = $(images[i]).unbind().removeClass('image selected_image').addClass('image_active');

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

				} else {
					new_images.find('img').after('<label>' + new_images.data('title') + '</label>');
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

				$(workspace).append(new_images);
				var n;
				if (!new_images.index()) {
					n = $(window).scrollLeft() + 150;
				} else {
					n = (new_images.prev().width() + 150);
				}
				var top = $(window).scrollTop() + 50;
				var left = n;

				$(images[i]).css({
					'top': top,
					'left': left,
					'position': "relative"
				});

				$(images[i]).dblclick(function(event) {
					_self.select_group.select($(this));
					event.stopPropagation();
				});

				var src = new_images.find('img').attr('src');
				//_self.minimap.add_to_minimap($(images[i]).attr('id'), src);

			}
			if (typeof param == "undefined") {
				_self.workspaceImages.init(); // Making images draggable
			}
			_self.imagesBox.imagesSelected = []; //restore the selected elements after dragged on workspace
			$('html, body').animate({
				scrollTop: new_images.position().top - 100,
				scrollLeft: (new_images.position().left - 450) + "px"
			}, 500);
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