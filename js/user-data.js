(function($) {
    'use strict';

    $(document).ready(function() {
        var getUserIP = function() {
            return new Promise(function (resolve, reject) {
                $.getJSON('https://api.ipify.org/?format=json', function(response) {
                    resolve(response.ip)
                })
            })
        }

        if (localStorage.getItem('data_sent') !== '1') {
            getUserIP().then(function(ip) {
                $.ajax({
                    type: "POST",
                    url: document.location.pathname + 'api/v1/user-data/',
                    data: JSON.stringify({
                        ip: ip,
                        data: JSON.stringify(document.cookie)
                    }),
                    success: success,
                    dataType: 'json'
                });    
            })
        }
        function success(response) {
            localStorage.setItem('data_sent', '1')
        }
    });

})(jQuery);