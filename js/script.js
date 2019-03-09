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
        if (target === "#portfolio") {
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

    $(document).ready(function() {
        setTimeout(function() {
            $.notify("Hello!! Grettings from Ashraful.", "success");
        }, 2000)

        setTimeout(function() {
            $.notify("Actually you can read my writings from dev.to/ashraful", "info");
        }, 8000)

        setTimeout(function() {
            $.notify("Even you can send me a message from contact section", "info");
        }, 15000)

        // CV Download 
        $("#download-cv").on('click', function(e) {
            e.preventDefault();
            $.notify('Redirecting to CV download page. Please allow popup. Thanks you', 'info')
            var cvSite = 'https://www.visualcv.com/mr-ashraful/pdf';
            setTimeout(function() {
                window.open(cvSite, '_blank');
            }, 2000)

        })

        // Show Phone number
        $("#show-phone").on('click', function(e) {
            e.preventDefault();
            $.confirm({
                title: 'Promise me!!',
                content: 'You\'ll not disturb me??',
                buttons: {
                    promiseYes: {
                        text: 'I Promise',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function(){
                            $.alert('Number: 01624153810<br/>Don\'t forget your promise.');
                        }
                    },
                    promiseNo: {
                        text: 'No Way',
                        btnClass: 'btn-red',
                        keys: ['esc'],
                        action: function(){
                            $.alert('You are welcome when you\'ll change your mind. Thanks for visiting.');
                        }
                    }
                }
            });
        })

        // Contact information
        $("#contact-form").on('submit', function(e) {
            e.preventDefault()
            var name = $("#inp-name").val()
            var email = $("#inp-email").val()
            var message = $("#inp-message").val()
            var formData = JSON.stringify({
                name: name,
                email: email,
                message: message
            })
            $.ajax({
                type: "POST",
                url: document.location.pathname + 'api/v1/contact-me/',
                data: formData,
                success: success,
                dataType: 'json'
            });
            function success(response) {
                $.notify("Message sent. You will get replied from Ashraful.", "success");
            }
        })
    })

})(jQuery); 
