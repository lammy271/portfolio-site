(function () {
	var toc = document.querySelector('.case-study-toc');
	if (!toc) return;

	// #region agent log
	function debugLayoutMetrics() {
		var prose = document.querySelector('#impact .case-study-prose');
		var label = document.querySelector('#impact .case-study-prose-label');
		var gallery = document.querySelector('.case-study-gallery-duo');
		var panelGrid = document.querySelector('.case-study-panel-grid');
		var imgs = gallery ? gallery.querySelectorAll('img') : [];
		var impactSection = document.querySelector('#impact');
		var impactStyle = impactSection ? window.getComputedStyle(impactSection) : null;
		var vw = window.innerWidth;
		var content = prose ? prose.querySelector('.case-study-prose-content') : null;
		var proseRect = prose ? prose.getBoundingClientRect() : null;
		var contentRect = content ? content.getBoundingClientRect() : null;
		var galleryRect = gallery ? gallery.getBoundingClientRect() : null;
		var panelRect = panelGrid ? panelGrid.getBoundingClientRect() : null;
		var labelRect = label ? label.getBoundingClientRect() : null;
		var galleryStyle = gallery ? window.getComputedStyle(gallery) : null;
		var imgGapPx = imgs.length >= 2 ? (imgs[1].getBoundingClientRect().left - imgs[0].getBoundingClientRect().right).toFixed(1) : null;
		var imgGapPct = galleryRect && imgGapPx ? ((parseFloat(imgGapPx) / galleryRect.width) * 100).toFixed(1) : null;
		var imgTops = [];
		imgs.forEach(function (img) { imgTops.push(img.getBoundingClientRect().top); });
		var topsAligned = imgTops.length >= 2 && Math.abs(imgTops[0] - imgTops[1]) < 2;
		var proseWidthVw = proseRect ? (proseRect.width / vw * 100).toFixed(1) : null;
		var galleryWidthVw = galleryRect ? (galleryRect.width / vw * 100).toFixed(1) : null;
		var panelWidthVw = panelRect ? (panelRect.width / vw * 100).toFixed(1) : null;
		fetch('http://127.0.0.1:7894/ingest/965b0629-cd14-47af-b7f9-cb4a6fa0e4f7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d70457'},body:JSON.stringify({sessionId:'d70457',location:'case-study.js:layout',message:'Impact spacing diagnostics',data:{vw:vw,impactPaddingTop:impactStyle?impactStyle.paddingTop:null,impactPaddingBottom:impactStyle?impactStyle.paddingBottom:null,impactPaddingTopVw:impactStyle?((parseFloat(impactStyle.paddingTop)/vw)*100).toFixed(1):null,impactPaddingBottomVw:impactStyle?((parseFloat(impactStyle.paddingBottom)/vw)*100).toFixed(1):null,galleryGap:galleryStyle?galleryStyle.columnGap:null,imgGapPctOfGallery:imgGapPct,imgTopsAligned:topsAligned},timestamp:Date.now(),runId:'impact-spacing',hypothesisId:'H1'})}).catch(function(){});
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', debugLayoutMetrics);
	} else {
		debugLayoutMetrics();
	}
	// #endregion

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
