(function () {
	var toc = document.querySelector('.case-study-toc');
	if (!toc) return;

	var links = toc.querySelectorAll('.case-study-toc-link[href^="#"]');
	var sections = [];

	links.forEach(function (link) {
		var id = link.getAttribute('href').slice(1);
		var section = document.getElementById(id);
		if (section) sections.push({ link: link, section: section });
	});

	function setActive(activeLink) {
		links.forEach(function (link) {
			link.classList.toggle('is-active', link === activeLink);
		});
	}

	links.forEach(function (link) {
		link.addEventListener('click', function (event) {
			var href = link.getAttribute('href');
			if (href === '#top') {
				event.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
				setActive(null);
				return;
			}

			var id = href.slice(1);
			var target = document.getElementById(id);
			if (!target) return;

			event.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			setActive(link);
		});
	});

	if (sections.length && 'IntersectionObserver' in window) {
		var observer = new IntersectionObserver(
			function (entries) {
				var visible = entries
					.filter(function (entry) { return entry.isIntersecting; })
					.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });

				if (visible.length) {
					var match = sections.find(function (item) {
						return item.section === visible[0].target;
					});
					if (match) setActive(match.link);
				}
			},
			{ rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] }
		);

		sections.forEach(function (item) {
			observer.observe(item.section);
		});
	}
})();
