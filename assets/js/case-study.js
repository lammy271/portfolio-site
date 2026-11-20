(function () {
	var toc = document.querySelector('.case-study-toc');
	if (!toc) return;

	var links = toc.querySelectorAll('.case-study-toc-link[href^="#"]');
	var sections = [];

	links.forEach(function (link) {
		var href = link.getAttribute('href');
		if (!href || href === '#top') return;
		var section = document.getElementById(href.slice(1));
		if (section) sections.push({ link: link, section: section });
	});

	function setActive(activeLink) {
		links.forEach(function (link) {
			link.classList.toggle('is-active', link === activeLink);
		});
	}

	function readingLine() {
		var header = document.getElementById('header');
		var headerHeight = header ? header.getBoundingClientRect().height : 0;
		return Math.max(headerHeight + 16, window.innerHeight * 0.22);
	}

	function updateActive() {
		if (!sections.length) return;

		var line = readingLine();
		var active = sections[0];
		for (var i = 0; i < sections.length; i++) {
			if (sections[i].section.getBoundingClientRect().top <= line) {
				active = sections[i];
			}
		}
		setActive(active.link);
	}

	var desktopMq = window.matchMedia('(min-width: 1024px)');
	var atEnd = false;
	var END_ON = 80;
	var END_OFF = 220;
	var endMatter = document.querySelector('.cs-end');
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var tocMoveTimer = 0;

	function distanceFromBottom() {
		var el = document.scrollingElement || document.documentElement;
		return el.scrollHeight - el.scrollTop - el.clientHeight;
	}

	function clearTocMove() {
		if (tocMoveTimer) {
			window.clearTimeout(tocMoveTimer);
			tocMoveTimer = 0;
		}
		toc.style.transition = '';
		toc.style.transform = '';
	}

	function playTocMove(applyState) {
		clearTocMove();
		if (reduceMotion.matches) {
			applyState();
			return;
		}

		var from = toc.getBoundingClientRect();
		applyState();
		var to = toc.getBoundingClientRect();
		var dy = from.top - to.top;
		if (Math.abs(dy) < 1) {
			clearTocMove();
			return;
		}

		toc.style.transition = 'none';
		toc.style.transform = atEnd
			? 'translateY(calc(-50% + ' + dy + 'px))'
			: 'translateY(' + dy + 'px)';

		window.requestAnimationFrame(function () {
			window.requestAnimationFrame(function () {
				toc.style.transition = 'transform 250ms ease-in-out';
				toc.style.transform = '';
				tocMoveTimer = window.setTimeout(clearTocMove, 300);
			});
		});
	}

	function dockToc() {
		if (atEnd || !desktopMq.matches) return;
		playTocMove(function () {
			atEnd = true;
			toc.classList.add('is-end');
		});
	}

	function undockToc() {
		if (!atEnd) return;
		playTocMove(function () {
			atEnd = false;
			toc.classList.remove('is-end');
		});
	}

	function updateTocEnd() {
		if (!desktopMq.matches) {
			undockToc();
			return;
		}
		if (endMatter) return;

		var dist = distanceFromBottom();
		if (!atEnd && dist <= END_ON) dockToc();
		else if (atEnd && dist > END_OFF) undockToc();
	}

	if (endMatter && typeof IntersectionObserver === 'function') {
		var endObserver = new IntersectionObserver(function (entries) {
			if (!desktopMq.matches) {
				undockToc();
				return;
			}
			if (entries[0].isIntersecting) dockToc();
			else undockToc();
		}, {
			threshold: 0,
			rootMargin: '0px 0px -8% 0px'
		});
		endObserver.observe(endMatter);
	}

	var ticking = false;
	function onScrollOrResize() {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(function () {
			ticking = false;
			updateActive();
			updateTocEnd();
		});
	}

	window.addEventListener('scroll', onScrollOrResize, { passive: true });
	document.addEventListener('scroll', onScrollOrResize, { capture: true, passive: true });
	document.body.addEventListener('scroll', onScrollOrResize, { passive: true });
	window.addEventListener('resize', onScrollOrResize);

	links.forEach(function (link) {
		link.addEventListener('click', function (event) {
			var href = link.getAttribute('href');
			if (href === '#top') {
				event.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
				setActive(sections[0] ? sections[0].link : null);
				return;
			}

			var target = document.getElementById(href.slice(1));
			if (!target) return;

			event.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			setActive(link);
		});
	});

	updateActive();
	updateTocEnd();
})();

(function () {
	var DESKTOP_MQ = '(min-width: 1024px)';
	var article = document.querySelector('.case-study-article');
	if (!article) return;

	function isDesktop() {
		return window.matchMedia(DESKTOP_MQ).matches;
	}

	var sections = article.querySelectorAll('.case-study-section');
	var hasImages = false;
	sections.forEach(function (section) {
		var imgs = Array.prototype.slice.call(section.querySelectorAll('img'));
		if (!imgs.length) return;
		hasImages = true;
		imgs.forEach(function (img, index) {
			img.classList.add('cs-lightbox-trigger');
			img.addEventListener('click', function () {
				if (!isDesktop()) return;
				openAt(imgs, index);
			});
		});
	});
	if (!hasImages) return;

	var root = document.createElement('div');
	root.className = 'cs-lightbox';
	root.hidden = true;
	root.setAttribute('role', 'dialog');
	root.setAttribute('aria-modal', 'true');
	root.setAttribute('aria-label', 'Image viewer');
	root.setAttribute('tabindex', '-1');
	root.innerHTML =
		'<div class="cs-lightbox-scrim"></div>' +
		'<button type="button" class="cs-lightbox-nav cs-lightbox-prev" aria-label="Previous image">' +
			'<img src="../assets/image/thin_arrow_left.svg" alt="" width="37" height="37">' +
		'</button>' +
		'<img class="cs-lightbox-image" alt="">' +
		'<button type="button" class="cs-lightbox-nav cs-lightbox-next" aria-label="Next image">' +
			'<img src="../assets/image/thin_arrow_right.svg" alt="" width="37" height="37">' +
		'</button>' +
		'<button type="button" class="cs-lightbox-close" aria-label="Close">&times;</button>';
	document.documentElement.appendChild(root);

	var view = root.querySelector('.cs-lightbox-image');
	var prevBtn = root.querySelector('.cs-lightbox-prev');
	var nextBtn = root.querySelector('.cs-lightbox-next');
	var closeBtn = root.querySelector('.cs-lightbox-close');
	var currentImgs = [];
	var currentIndex = 0;

	function show() {
		var img = currentImgs[currentIndex];
		view.src = img.currentSrc || img.src;
		view.alt = img.alt || '';
		var many = currentImgs.length > 1;
		prevBtn.hidden = !many;
		nextBtn.hidden = !many;
	}

	function openAt(imgs, index) {
		currentImgs = imgs;
		currentIndex = index;
		show();
		root.hidden = false;
		root.classList.add('is-open');
		document.documentElement.classList.add('cs-lightbox-open');
		document.body.classList.add('cs-lightbox-open');
		root.focus({ preventScroll: true });
	}

	function close() {
		if (root.hidden) return;
		root.hidden = true;
		root.classList.remove('is-open');
		document.documentElement.classList.remove('cs-lightbox-open');
		document.body.classList.remove('cs-lightbox-open');
		view.removeAttribute('src');
	}

	function step(delta) {
		if (currentImgs.length < 2) return;
		currentIndex = (currentIndex + delta + currentImgs.length) % currentImgs.length;
		show();
	}

	root.querySelector('.cs-lightbox-scrim').addEventListener('click', close);
	closeBtn.addEventListener('click', function (event) {
		event.stopPropagation();
		close();
	});
	view.addEventListener('click', function (event) {
		event.stopPropagation();
	});
	prevBtn.addEventListener('click', function (event) {
		event.stopPropagation();
		step(-1);
	});
	nextBtn.addEventListener('click', function (event) {
		event.stopPropagation();
		step(1);
	});

	document.addEventListener('keydown', function (event) {
		if (root.hidden || !isDesktop()) return;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			step(-1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			step(1);
		}
	});

	window.addEventListener('resize', function () {
		if (!isDesktop()) close();
	});
})();
