$(document).ready(function(){

	(function(){

		var default_options = {
			input: '#search'
		};

		var search = {
			init: function(){
				var input = $(default_options.input);
				var button = $('#search_button');
				button.click(function(e){
					e.preventDefault();
					$.ajax({
						type:'POST',
						url:'/search/',
						data: { 'pattern':  input.val() },
						beforeSend: function(){
							$('#ajax-loader').fadeIn();
						},
						success: function(data){
							if(data != "False"){
								var images = '';
								for(i = 0; i < data.length; i++){
									images += '<div data-size = "' + data[i][5] + '" data-title = "' + data[i][2] + '" class="image" id = "' + data[i][1] + '">' + data[i][0] + 
									"<div class='image_desc'> <p><b>Manuscript</b>: " + data[i][2] + "</p> " +
									"<p><b>Repository</b>: " + data[i][3] + 
									"<p><b>Place</b>: " +  data[i][4] + "</p></div><br clear='all' /></div>";
								}
								$('#images_container').html(images);
								$('#results_counter').hide().fadeIn().html("Results: " + data.length);
							} else {
								$('body').append("<div id='notification_search' class='notify notify-error'>You should insert at least one search term</div>");
			                    $('#notification_search').notify({
			                        "close-button": false,
			                        "position": {'top':"12%", 'left': '70%'}
			                    });
							}
						},
						complete: function(){
							$('#ajax-loader').fadeOut();
							$('.image').click(function(){
                    			$.fn.imagesBox.select_image($(this));
                			});
						},

						error: function(){
							$('body').append("<div id='notification_search' class='notify notify-error'>Something went wrong. Try again.</div>");
			                $('#notification_search').notify({
		                        "close-button": false,
		                        "position": {'top':"12%", 'left': '70%'}
		                    });
						}
					});
				});
			}
		}
		search.init(default_options);

	})();


});