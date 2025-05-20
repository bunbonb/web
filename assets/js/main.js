/*
	Eventually by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function() {

	"use strict";

	var	$body = document.querySelector('body');

	// Methods/polyfills.

		// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
			!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

		// canUse
			window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

		// window.addEventListener
			(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			window.setTimeout(function() {
				$body.classList.remove('is-preload');
			}, 100);
		});

	// Background Slideshow
		(function() {
			var settings = {
				images: {
					'images/bg01.jpg': 'center',
					'images/bg02.jpg': 'center',
					'images/bg03.jpg': 'center'
				},
				delay: 6000
			};
			var pos = 0, lastPos = 0,
				$wrapper, $bgs = [], $bg,
				k;

			$wrapper = document.getElementById('bg');
			if (!$wrapper) return;

			for (k in settings.images) {
				$bg = document.createElement('div');
				$bg.style.backgroundImage = 'url("' + k + '")';
				$bg.style.backgroundPosition = settings.images[k];
				$wrapper.appendChild($bg);
				$bgs.push($bg);
			}

			$bgs[pos].classList.add('visible');
			$bgs[pos].classList.add('top');

			if ($bgs.length == 1) return;

			window.setInterval(function() {
				lastPos = pos;
				pos++;
				if (pos >= $bgs.length) pos = 0;
				$bgs[lastPos].classList.remove('top');
				$bgs[pos].classList.add('visible');
				$bgs[pos].classList.add('top');
				window.setTimeout(function() {
					$bgs[lastPos].classList.remove('visible');
				}, settings.delay / 2);
			}, settings.delay);
		})();

	// Carousel logic (full-page frames with mouse swipe)
		(function() {
			const frames = document.querySelectorAll('.carousel-frame');
			const prevBtn = document.getElementById('carousel-prev');
			const nextBtn = document.getElementById('carousel-next');
			let current = 0;
			let animating = false;

			function showFrame(idx) {
				if (animating || idx === current) return;
				animating = true;
				frames[current].classList.remove('active');
				frames[current].classList.add('fade-out');
				frames[idx].classList.add('fade-in');
				frames[idx].classList.add('active');
				setTimeout(() => {
					frames[current].classList.remove('fade-out');
					frames[idx].classList.remove('fade-in');
					current = idx;
					animating = false;
				}, 400);
			}

			prevBtn.addEventListener('click', function() {
				const idx = (current - 1 + frames.length) % frames.length;
				showFrame(idx);
			});
			nextBtn.addEventListener('click', function() {
				const idx = (current + 1) % frames.length;
				showFrame(idx);
			});

			// Mouse swipe support
			let startX = null;
			let dragging = false;

			function onMouseDown(e) {
				if (animating) return;
				dragging = true;
				startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
			}
			function onMouseMove(e) {
				if (!dragging) return;
				// Prevent scrolling while dragging
				e.preventDefault();
			}
			function onMouseUp(e) {
				if (!dragging) return;
				let endX = e.type === 'touchend'
					? (e.changedTouches && e.changedTouches[0].clientX)
					: e.clientX;
				let deltaX = endX - startX;
				dragging = false;
				if (Math.abs(deltaX) > 60) { // threshold
					if (deltaX < 0) {
						// swipe left, next
						const idx = (current + 1) % frames.length;
						showFrame(idx);
					} else {
						// swipe right, prev
						const idx = (current - 1 + frames.length) % frames.length;
						showFrame(idx);
					}
				}
			}

			const carouselArea = document.body;
			carouselArea.addEventListener('mousedown', onMouseDown);
			carouselArea.addEventListener('mousemove', onMouseMove);
			carouselArea.addEventListener('mouseup', onMouseUp);
			carouselArea.addEventListener('mouseleave', () => { dragging = false; });
			// Touch support for mobile
			carouselArea.addEventListener('touchstart', onMouseDown, {passive: false});
			carouselArea.addEventListener('touchmove', onMouseMove, {passive: false});
			carouselArea.addEventListener('touchend', onMouseUp);

		})();

	// Signup Form logic (only for the first frame)
		(function() {
			var $form = document.querySelectorAll('#signup-form')[0];
			if (!$form) return;
			var $submit = $form.querySelector('input[type="submit"]');
			var $message = document.createElement('span');
			$message.classList.add('message');
			$form.appendChild($message);

			$message._show = function(type, text) {
				$message.innerHTML = text;
				$message.classList.add(type);
				$message.classList.add('visible');
				window.setTimeout(function() {
					$message._hide();
				}, 3000);
			};
			$message._hide = function() {
				$message.classList.remove('visible');
			};

			$form.addEventListener('submit', function(event) {
				event.stopPropagation();
				event.preventDefault();
				$message._hide();
				$submit.disabled = true;
				window.setTimeout(function() {
					$form.reset();
					$submit.disabled = false;
					$message._show('success', 'Thank you!');
				}, 750);
			});
		})();

})();