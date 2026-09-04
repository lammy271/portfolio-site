// Script to handle case study menu functionality in jquery

$(document).ready(function() {
    // When a case study menu item is clicked, show the corresponding case study content in the right pane
    $('.case-study-menu-item').click(function() {
        var index = $(this).index();
        var allCaseStudies = $('.case-study');
        allCaseStudies.addClass('desktop-inactive');
        allCaseStudies.eq(index-1).removeClass('desktop-inactive');
    });
});

// Script to handle case study menu functionality in jquery