var google_analytics_id = 'UA-4163510-7',
    google_conversion_id = 1066984310,
    google_conversion_language = "en",
    google_conversion_format = "3",
    google_conversion_color = "ffffff",
    google_conversion_label = "tz8UCI7LzVoQ9sbj_AM",
    google_remarketing_only = false,
    google_mapsapi_key = 'AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM',
    google_mapsapi_sensor = false;

// Partner`s banners
var brands = [
    {
        name: 'Chamberlain',
        url: 'http://www.chamberlain.com/',
        logo: 'chamberlain-logo.webp'
    },
    {
        name: 'LiftMaster',
        url: 'https://www.liftmaster.com',
        logo: 'liftmaster-logo.webp'
    },
    {
        name: 'Craftsman',
        url: 'http://www.craftsman.com',
        logo: 'craftsman-logo.webp'
    },
    {
        name: 'Raynor',
        url: 'http://www.raynor.com',
        logo: 'raynor-logo.webp'
    },
    {
        name: 'Stanley Tools',
        url: 'http://www.stanleytools.com/',
        logo: 'stanleytools-logo.webp'
    },
    {
        name: 'Genie',
        url: 'http://www.genielift.com/',
        logo: 'genie-logo.webp'
    },
    {
        name: 'Amarr',
        url: 'http://www.amarr.com/',
        logo: 'amarr-logo.webp'
    },
    {
        name: 'Clopay',
        url: 'http://www.clopay.com/',
        logo: 'clopay-logo.webp'
    },
    {
        name: 'Waine Dalton',
        url: 'http://www.wayne-dalton.com/',
        logo: 'wayne-dalton-logo.webp'
    }
];
var draw_logo = function (brand, li) {
    'use strict';
    var img_logo = document.createElement('img'),
        a = document.createElement('a');

    img_logo.src = 'img/brands/' + brand.logo;
    img_logo.setAttribute('class', 'logo');
    img_logo.addEventListener('error', function () {
        nowebp(this, 'png')
    });

    a.href = brand.url;
    a.appendChild(img_logo);

    li.appendChild(a);
    return li;
};

/* Map */
var geocoder;
var map;

function codeAddress(address) {
    'use strict';
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            //console.log(results[0].geometry.location);
            map.setCenter(results[0].geometry.location);
            return new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function initialize() {
    var canvas = document.getElementById('map-canvas');
    canvas.style.height = '380px';

    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: 8
    }
    map = new google.maps.Map(canvas, mapOptions);

    codeAddress(document.getElementById("address").innerText);
}


addEventListener('DOMContentLoaded', function () {

    var brand_list = document.getElementById('brand-list');
    if (!brand_list.getAttribute('data-added')) {
            [].forEach.call(brands, function (brand) {

            var li = document.createElement('li');
            li = draw_logo(brand, li);

            brand_list.appendChild(li);
        });
        brand_list.setAttribute('data-added', true);
    }

    // webp alternative
    [].forEach.call(document.querySelectorAll('[data-alt]'), function (img) {
        img.addEventListener('error', function () {
            nowebp(this, img.getAttribute('data-alt'))
        });
    });

    // Google Maps API
    var googleapis = document.createElement("script");
    googleapis.type = "text/javascript";
    googleapis.src = "http://maps.googleapis.com/maps/api/js?key=" + google_mapsapi_key + "&sensor=" + google_mapsapi_sensor;
    //!window['google'] || google.maps.event.addDomListener(window, 'load', initialize);
    //googleapis.addEventListener('load', initialize);
    document.body.appendChild(googleapis);

});

var till = document.getElementById('top-navbar'),
    tillOffsetTop = till.offsetTop;
addEventListener('scroll', function () {
    till.setAttribute('class', till.getAttribute('class').replace(/ fixed/, '') + (window.pageYOffset > tillOffsetTop ? ' fixed' : ''));
});


(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', google_analytics_id, 'auto');
ga('send', 'pageview');