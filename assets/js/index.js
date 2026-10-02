// Script to handle case study menu functionality in jquery

$(document).ready(function() {
    var allCaseStudies = $('.case-study');

    function showCaseStudy(href) {
        allCaseStudies.addClass('desktop-inactive');
        allCaseStudies.filter('[href="' + href + '"]').removeClass('desktop-inactive');
    }

    function setActiveMenuItem($item) {
        $('.case-study-menu-item')
            .removeClass('active')
            .removeAttr('aria-current');
        $item.addClass('active').attr('aria-current', 'true');
    }

    var $defaultMenuItem = $('.case-study-menu-item').first();
    setActiveMenuItem($defaultMenuItem);
    showCaseStudy($defaultMenuItem.attr('href'));

    $('.case-study-menu-item').on('mouseenter', function() {
        var $item = $(this);
        showCaseStudy($item.attr('href'));
        setActiveMenuItem($item);
    });
});
