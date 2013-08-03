$(document).ready(function(){

	(function(){

		var default_options = {
			input: '#search'
		};

		var search = {
			first_requestRunning: false,

			init: function(){
				if (this.first_requestRunning) { // don't do anything if an AJAX request is pending
			        return;
			    }
				var input = $(default_options.input);
				var button = $('#search_button');
				var n = 5;
				button.click(function(){
					var data = {
						'pattern': input.val(),
						'n': n
					};
					$.ajax({
						type: 'POST',
						url: '/search/',
						data: data,
						beforeSend: function(){
							$('#ajax-loader').fadeIn();
						},
						success: function(data){
							if(data != "False"){
								var images = '';
								var count = data['count'];
								var data_manuscripts = data['manuscripts'];
								for(i = 0; i < data_manuscripts.length; i++){
									images += '<div data-size = "' + data_manuscripts[i][5] + '" data-title = "' + data_manuscripts[i][2] + '" class="image" id = "' + data_manuscripts[i][1] + '">' + data_manuscripts[i][0] + 
									"<div class='col-lg-8 image_desc'><table class='table'><tr><th>Manuscript</th><th>Repository</th><th>Place</th></tr><tr><td>" + data_manuscripts[i][2] + "</td><td>" + data_manuscripts[i][3] + 
									"</td><td>" +  data_manuscripts[i][4] + "</td></tr></table></div></div>";
								}
								$('#images_container').html(images);
								$('#results_counter').hide().fadeIn().html("Results: " + count);
							} else {
								$('body').append("<div id='notification_search' class='notify notify-error'>You should insert at least one search term</div>");
			                    $('#notification_search').notify({
			                        "close-button": false,
			                        "position": {'top':"12%", 'left': '70%'}
			                    });
							}
						},
						complete: function(){
							this.first_requestRunning = false;
							$('.image').click(function(){
                    			$.fn.imagesBox.select_image($(this));
                			});

                			function isScrollBottom(div) { 
								if ((div.scrollTop + div.clientHeight == div.scrollHeight) || (div.scrollTop + div.clientHeight >div.scrollHeight - 10)){
								 	return true;
								}
							}
							$('#images_container').data('requestRunning', false);
                			$('#images_container').scroll(function(){
                				if ($(this).data('requestRunning')) { // don't do anything if an AJAX request is pending
							        return;
							    }
                				var div = document.getElementById('images_container');
                				if(isScrollBottom(div)){
	                				data.x = data.n;
									data.n += 5;
									$.ajax({
										type:'POST',
										url:'/search/',
										data: data,
										beforeSend: function(){
											$('#ajax-loader').fadeIn();
										},
										success: function(data){
											if(data != "False"){
				                				var data = data['manuscripts'];
												for(i = 0; i < data.length; i++){
													image = '<div data-size = "' + data[i][5] + '" data-title = "' + data[i][2] + '" class="col-lg-4 image" id = "' + data[i][1] + '">' + data[i][0] + 
													"<div class='col-lg-8 image_desc'><table class='table'><tr><th>Manuscript</th><th>Repository</th><th>Place</th></tr><tr><td>" + data[i][2] + "</td><td>" + data[i][3] + 
									"</td><td>" +  data[i][4] + "</td></tr></table></div></div>";
													$('#images_container').append(image);
													$('#' +  data[i][1]).click(function(){
					                    				$.fn.imagesBox.select_image($(this));
					                				});
												}
												
											} else {
												$('body').append("<div id='notification_search' class='notify notify-error'>You should insert at least one search term</div>");
							                    $('#notification_search').notify({
							                        "close-button": false,
							                        "position": {'top':"12%", 'left': '70%'}
							                    });
						                	}
						                },
						                complete: function(data){
											$(this).data('requestRunning', false);
											
											$('#ajax-loader').fadeOut();
										}
						           
			                		});
								}
							});
							$(this).data('requestRunning', true);
							$('#ajax-loader').fadeOut();
						},

						error: function(){
							$('body').append("<div id='notification_search' class='notify notify-error'>Something went wrong. Try again.</div>");
			                $('#notification_search').notify({
		                        "close-button": false,
		                        "position": {'top':"12%", 'left': '70%'}
		                    });
						}
					});
					this.first_requestRunning = true;
					return false;
				});
			}
		}
		search.init(default_options);

	})();


});