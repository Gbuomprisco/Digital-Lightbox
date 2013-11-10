(function(){

	$.fn.import_session = {

		init: function(){
			this.buttons();
		},

		loadFile: function(file){

			var files = !!file ? file : [];
			if ( !files.length || !window.FileReader ) return;
			var reader = new FileReader();

			reader.readAsDataURL( files[0] );

	        // When loaded, set image data as background of page
	        reader.onloadend = function(){
			    console.log(this.result);
			}
		},

		buttons: function(){
			$('#load_from_pc').on("change", function(){
				$.fn.import_session.loadFile(this.files);
			});
		}

	}

})();