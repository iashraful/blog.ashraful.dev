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

    $(document).ready(function() {
        // Get latest post from medium
        // Using... https://rss2json.com
        // Random Number is just not for caching the api on that url. I want to fetch every time
        var randomNumber = parseInt(Math.random() * 1000)
        var username = '_ashraful'
        var url = "https://medium.com/feed/@" + username + '?v=' + randomNumber;
        var converterUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + url;

        $.get(converterUrl, function(data) {
            console.log(data)
            produceBlogpost(data.items);
        });


        // Produce blog post
        var produceBlogpost = function(posts) {
            var blogPostsUL = $('#blog-posts-ul');
            var postBody = '';
            for (var i=0; i<posts.length; i++) {
                var postDesc = posts[i].description;
                postBody += '<li class="blog-post">' + postDesc.slice(0, 500) + '...';
                postBody += '<a href="'+ posts[i].link +'" target="_blank">Read More</a></li>'
                // postBody += '<h4>' + posts[i].title +'</h4>'
            }
            blogPostsUL.fadeIn().html(postBody);
        };
    })


})(jQuery); 
