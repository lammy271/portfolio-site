// Script to handle case study menu functionality in jquery

$(document).ready(function() {
    var allCaseStudies = $('.case-study');

    function showCaseStudy(href) {
        allCaseStudies.addClass('desktop-inactive');
        allCaseStudies.filter('[href="' + href + '"]').removeClass('desktop-inactive');
    }

    // When a case study menu item is hovered, show the corresponding case study in the right pane
    $('.case-study-menu-item').on('mouseenter', function() {
        showCaseStudy($(this).attr('href'));
    });
});