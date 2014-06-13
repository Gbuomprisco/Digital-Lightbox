(function( $ ){

  $.fn.notify = function(options) {

    var default_options = {
        'position': {'top': '5%', 'left': '75%'},
        'type': 'default',
        'duration': 5000,
        'close-button': false
    }

    element = this;

    var types = ['error', 'default', 'success'];
    

    var methods = {
        
        getType: function(){
            if(options === undefined){
                null;
            } else {
                if((options['type'] != undefined) && ($.inArray(options['type'], types) < 0)){
                    throw "Choice a type among 'success', 'default' or 'error', or leave blank the variable"
                }
            }
        },

        closeButton: function(){
            if(options['close-button'] == true){
                element.append('<span class="close-button">x</span>');
                $('.close-button').click(function(){
                    element.css({'visibility': 'hidden', 'top': '0%', 'opacity': '0'});
                });
            }
        },

        init : function() {

            this.getType();
            this.closeButton();

            try {
                if(options['type']){
                    element.removeClass().addClass('notify notify-' + options['type']);
                } else {
                    element.addClass('notify-' + default_options['type']);
                }
            } catch(e){
                null;
            }

            var settings = $.extend(default_options, options);

            element.css({
                'left': default_options['position']['left']
            });

            element.css('visibility', 'visible');
            element.animate({
                top: "0%",
                opacity: 0.4
            }, { duration: 100 }
            ).animate({
                opacity: 0.6,
                top: default_options['position']['top']
            }, { duration: 100 }
            ).animate({
                opacity: 0.9
            }, { duration: 100 }
            ).animate({
                opacity: 1
            }, { duration: default_options['duration'] }
            ).animate({
                opacity: 0.8
            }, { duration: 150 }
            ).animate({
                opacity: 0.4
            }, { duration: 100 }
            ).animate({
                opacity: 0.2
            }, { duration: 50 }
            ).animate({
                opacity: 0,
            }, { duration: 100, complete: function() {
                element.css({'visibility':'hidden', 'top':'0%'});
            }
            });
            

         }
    }

    return methods.init();
  };
})( jQuery );
