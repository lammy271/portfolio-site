// Script to handle case study menu functionality in jquery

var motionReady = import('https://cdn.jsdelivr.net/npm/motion@12.5.0/+esm');

function animateCaseStudyPreview(element) {
    if (!element) {
        return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.style.opacity = '1';
        element.style.transform = 'none';
        return;
    }
    motionReady.then(function(motion) {
        motion.animate(element, { opacity: [0, 1], y: [15, 0] }, { duration: 0.15, ease: 'easeOut' });
    });
}

$(document).ready(function() {
    var allCaseStudies = $('.case-study');
    var desktopQuery = window.matchMedia('(width >= 1024px)');

    function showCaseStudy(href) {
        if (!desktopQuery.matches) {
            allCaseStudies.removeClass('desktop-inactive');
            return;
        }
        allCaseStudies.addClass('desktop-inactive');
        var $visible = allCaseStudies.filter('[data-href="' + href + '"]');
        $visible.removeClass('desktop-inactive');
        animateCaseStudyPreview($visible[0]);
    }

    function setActiveMenuItem($item) {
        $('.case-study-menu-item')
            .removeClass('active')
            .removeAttr('aria-current');
        $item.addClass('active').attr('aria-current', 'true');
    }

    function syncLayout() {
        var $active = $('.case-study-menu-item.active');
        if (!$active.length) {
            $active = $('.case-study-menu-item').first();
            setActiveMenuItem($active);
        }
        showCaseStudy($active.attr('href'));
    }

    var $defaultMenuItem = $('.case-study-menu-item').first();
    setActiveMenuItem($defaultMenuItem);
    syncLayout();

    $('.case-study-menu-item').on('mouseenter', function() {
        if (!desktopQuery.matches) return;
        var $item = $(this);
        showCaseStudy($item.attr('href'));
        setActiveMenuItem($item);
    });

    if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', syncLayout);
    } else if (typeof desktopQuery.addListener === 'function') {
        desktopQuery.addListener(syncLayout);
    }
});
