(function () {
	function inCaseStudies() {
		return /\/case_studies\//.test(window.location.pathname);
	}

	function init() {
		var menuBtn = document.getElementById('menu-btn');
		if (!menuBtn) return;

		var mobileQuery = window.matchMedia('(width < 1024px)');
		var menu = document.getElementById('site-nav-menu');
		var closeIcon = document.getElementById('menu-close');

		function ensureMarkup() {
			if (!closeIcon) {
				closeIcon = document.createElement('span');
				closeIcon.id = 'menu-close';
				closeIcon.setAttribute('aria-hidden', 'true');
				menuBtn.appendChild(closeIcon);
			}

			if (menu) return;

			var prefix = inCaseStudies() ? '../' : '';
			menu = document.createElement('nav');
			menu.id = 'site-nav-menu';
			menu.setAttribute('aria-label', 'Site');
			menu.innerHTML =
				'<p class="site-nav-index helv-bold txt-md spc-xxs">index</p>' +
				'<ul class="site-nav-primary">' +
					'<li><a class="helv-lite txt-lg spc-xxs" href="' + prefix + 'index.html">1. WORK</a></li>' +
					'<li><a class="helv-lite txt-lg spc-xxs" href="' + prefix + 'about.html">2. ABOUT ME</a></li>' +
					'<li><a class="helv-lite txt-lg spc-xxs" href="mailto:hi@annylongdesign.com">3. CONTACT</a></li>' +
				'</ul>' +
				'<ul class="site-nav-files">' +
					'<li><a class="helv-lite txt-lg spc-xxs" href="' + prefix + 'index.html">Portfolio PDF</a></li>' +
					'<li><a class="helv-lite txt-lg spc-xxs" href="' + prefix + 'assets/file/Anny_Long_Resume_2026.pdf" target="_blank" rel="noopener noreferrer">Resume PDF</a></li>' +
					'<li><a class="helv-lite txt-lg spc-xxs" href="https://www.linkedin.com/in/annylong" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>' +
				'</ul>';
			document.body.appendChild(menu);
		}

		function setOpen(open) {
			ensureMarkup();
			document.body.classList.toggle('nav-open', open);
			menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
			menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
		}

		function isOpen() {
			return document.body.classList.contains('nav-open');
		}

		ensureMarkup();
		menuBtn.setAttribute('role', 'button');
		menuBtn.setAttribute('tabindex', '0');
		menuBtn.setAttribute('aria-controls', 'site-nav-menu');
		menuBtn.setAttribute('aria-expanded', 'false');
		menuBtn.setAttribute('aria-label', 'Open menu');

		menuBtn.addEventListener('click', function (event) {
			if (!mobileQuery.matches) return;
			event.preventDefault();
			event.stopPropagation();
			setOpen(!isOpen());
		}, true);

		menuBtn.addEventListener('keydown', function (event) {
			if (!mobileQuery.matches) return;
			if (event.key !== 'Enter' && event.key !== ' ') return;
			event.preventDefault();
			setOpen(!isOpen());
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' && isOpen()) {
				setOpen(false);
			}
		});

		if (typeof mobileQuery.addEventListener === 'function') {
			mobileQuery.addEventListener('change', function () {
				if (!mobileQuery.matches) setOpen(false);
			});
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
