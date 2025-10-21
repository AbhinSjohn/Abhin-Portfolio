// app.js — interactive behavior for the portfolio template
(function () {
	'use strict';

	// Tiny helper
	const $ = (sel, root = document) => root.querySelector(sel);

	// Respect reduce motion
	const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Set footer year
	function setYear() {
		const yearEl = $('#year');
		if (yearEl) yearEl.textContent = new Date().getFullYear();
	}

	// Accessible nav toggle
	function initNav() {
		const toggle = $('#nav-toggle');
		const nav = $('#site-nav');
		if (!toggle || !nav) return;

		if (!nav.id) nav.id = 'site-nav';
		toggle.setAttribute('aria-controls', nav.id);
		toggle.setAttribute('aria-expanded', 'false');

		function openNav() {
			nav.classList.add('is-open');
			toggle.setAttribute('aria-expanded', 'true');
			nav.style.display = '';
		}
		function closeNav() {
			nav.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
			if (window.innerWidth <= 600) nav.style.display = 'none';
		}

		toggle.addEventListener('click', () => {
			const expanded = toggle.getAttribute('aria-expanded') === 'true';
			if (expanded) closeNav(); else openNav();
		});

		// Close on Escape
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closeNav();
		});

		// Close after clicking a local link
		nav.addEventListener('click', (e) => {
			const a = e.target.closest('a');
			if (!a) return;
			const href = a.getAttribute('href') || '';
			if (href.startsWith('#')) closeNav();
		});
	}

	// Smooth-internal links
	function initSmoothScroll() {
		document.addEventListener('click', (e) => {
			const a = e.target.closest('a');
			if (!a) return;
			const href = a.getAttribute('href') || '';
			if (!href.startsWith('#') || href === '#') return;
			const target = document.querySelector(href);
			if (!target) return;
			e.preventDefault();
			if (prefersReducedMotion) {
				target.scrollIntoView(true);
			} else {
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	}

	// Contact form handler (client-only stub)
	function initContactForm() {
		const form = $('#contact-form');
		const status = $('#form-status');
		if (!form) return;
		const submitBtn = form.querySelector('[type="submit"]');

		function showStatus(msg, error = false) {
			if (!status) return;
			status.textContent = msg;
			status.style.color = error ? '#fca5a5' : '';
		}

		function isValidEmail(email) {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		}

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const fd = new FormData(form);
			const name = (fd.get('name') || '').toString().trim();
			const email = (fd.get('email') || '').toString().trim();
			const message = (fd.get('message') || '').toString().trim();

			if (!name || !email || !message) {
				showStatus('Please fill in all fields.', true);
				return;
			}
			if (!isValidEmail(email)) {
				showStatus('Please enter a valid email.', true);
				return;
			}

			if (submitBtn) submitBtn.disabled = true;
			showStatus('Sending…');

			// Replace this with a real network request
			setTimeout(() => {
				form.reset();
				if (submitBtn) submitBtn.disabled = false;
				showStatus('Thanks — I will get back to you soon.');
			}, 900);
		});
	}

	function init() {
		setYear();
		initNav();
		initSmoothScroll();
		initContactForm();
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
