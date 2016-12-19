// setup event tracking
document.addEventListener('DOMContentLoaded', function () {
    ga('set', 'dimension1', 'unknown'); // dimension1 = card


    document.querySelectorAll('[track-event]').forEach(function (elem) {
        elem.addEventListener('click', function () {
            ga('send', {
                hitType: 'event',
                eventCategory: 'button',
                eventAction: 'click',
                eventLabel: elem.getAttribute('track-event')
            });
        });
    });




});



