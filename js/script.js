(function($) {
    'use strict';


    // mixItUp
    $( ".filters-menu li a" ).on('click' , function( event ) {
        event.preventDefault();
    });

    $('#Container').mixItUp({
        load: {
          filter: '.category-1'
        },
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(this).attr('href');
        var container = $('#container')
        if (target === "#portfo") {
          if (!container.mixItUp('isLoaded')) {
            container.mixItUp();
          }
        }
    });


    // preoader
    $(window).on('load', function() { // makes sure the whole site is loaded 
        $('#status').fadeOut(); // will first fade out the loading animation 
        $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
        $('body').delay(350).css({'overflow':'visible'});
    });
    

    $('.details-wrapper .tab-pane').mCustomScrollbar();


})(jQuery); 
