/* ═══════════════════════════════════════════════
   CYBER WAVE — app.js  v3
   Features: Theme toggle · Nav · Hero slider
             Particles · Reveal · Counters
             Pricing auto-slide · Smooth scroll
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNavigation();
    initHeroSlider();
    initParticles();
    initReveal();
    initCounters();
    initPricingSlider();
    initSmoothScroll();
});

/* ══════════════════════
   THEME TOGGLE
══════════════════════ */
function initTheme() {
    const html   = document.documentElement;
    const btn    = document.getElementById('themeToggle');

    // Persist choice
    const saved = localStorage.getItem('cw-theme') || 'dark';
    html.setAttribute('data-theme', saved);

    if (!btn) return;

    btn.addEventListener('click', function () {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('cw-theme', next);
    });
}

/* ══════════════════════
   NAVIGATION
══════════════════════ */
function initNavigation() {
    const nav       = document.getElementById('navigation');
    const navInner  = nav && nav.querySelector('.nav-inner');
    const navLinks  = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (!nav) return;

    window.addEventListener('scroll', function () {
        navInner && navInner.classList.toggle('scrolled', window.scrollY > 60);
        highlightActive();
    }, { passive: true });

    hamburger && hamburger.addEventListener('click', function () {
        this.classList.toggle('open');
        navLinks && navLinks.classList.toggle('open');
        document.body.style.overflow =
            navLinks && navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks && navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            hamburger && hamburger.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', function (e) {
        if (navLinks && navLinks.classList.contains('open') && !nav.contains(e.target)) {
            hamburger && hamburger.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    function highlightActive() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 260) current = s.id;
        });
        navLinks && navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }
}

/* ══════════════════════
   HERO BACKGROUND SLIDER
══════════════════════ */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.slide-dots .dot');
    let cur = 0, timer;

    function goTo(i) {
        slides[cur].classList.remove('active');
        dots[cur] && dots[cur].classList.remove('active');
        cur = (i + slides.length) % slides.length;
        slides[cur].classList.add('active');
        dots[cur] && dots[cur].classList.add('active');
    }

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));

    function reset() { clearInterval(timer); timer = setInterval(() => goTo(cur + 1), 6000); }
    reset();
}

/* ══════════════════════
   PARTICLES
══════════════════════ */
function initParticles() {
    const box = document.getElementById('particles');
    if (!box) return;
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const s = 2 + Math.random() * 3;
        p.style.cssText = `
            width:${s}px;height:${s}px;
            left:${Math.random()*100}%;top:${Math.random()*100}%;
            animation-delay:${Math.random()*5}s;
            animation-duration:${3+Math.random()*5}s;
            opacity:${0.3+Math.random()*0.6};
        `;
        box.appendChild(p);
    }
}

/* ══════════════════════
   REVEAL ON SCROLL
══════════════════════ */
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const siblings = Array.from(
                entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
            );
            const delay = siblings.indexOf(entry.target) * 90;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════
   ANIMATED COUNTERS
══════════════════════ */
function initCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { count(e.target); obs.unobserve(e.target); }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

function count(el) {
    const target = +el.getAttribute('data-target');
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const dur = 2200, start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3.5);

    (function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const v = Math.floor(ease(p) * target);
        el.textContent = prefix + (target >= 1000 ? v.toLocaleString() : v) + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = prefix + (target >= 1000 ? target.toLocaleString() : target) + suffix;
    })(start);
}

/* ══════════════════════
   PRICING SLIDER  — auto + manual + swipe + pause on hover
══════════════════════ */
function initPricingSlider() {
    const track   = document.getElementById('pricingTrack');
    const prevBtn = document.getElementById('psPrev');
    const nextBtn = document.getElementById('psNext');
    const dotsBox = document.getElementById('psDots');
    const progBar = document.getElementById('psProgressBar');
    if (!track) return;

    const slides = track.querySelectorAll('.pricing-slide');
    const total  = slides.length;
    const DELAY  = 4000;
    let cur = 0, autoTimer, paused = false;

    /* Build dots */
    function buildDots() {
        if (!dotsBox) return;
        dotsBox.innerHTML = '';
        const vis  = getVisible();
        const nDot = Math.max(1, total - vis + 1);
        for (let i = 0; i < nDot; i++) {
            const d = document.createElement('button');
            d.className = 'ps-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => { goTo(i); resetAuto(); });
            dotsBox.appendChild(d);
        }
    }

    function getVisible() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getSlideW() {
        const gap = parseFloat(window.getComputedStyle(track).gap) || 22;
        return slides[0].getBoundingClientRect().width + gap;
    }

    function goTo(i) {
        const vis  = getVisible();
        const max  = Math.max(0, total - vis);
        cur = Math.max(0, Math.min(i, max));
        track.style.transform = `translateX(-${cur * getSlideW()}px)`;
        dotsBox && dotsBox.querySelectorAll('.ps-dot').forEach((d, j) =>
            d.classList.toggle('active', j === cur));
    }

    /* Progress bar */
    function startProg() {
        if (!progBar) return;
        progBar.style.transition = 'none';
        progBar.style.width = '0%';
        void progBar.offsetWidth;
        progBar.style.transition = `width ${DELAY}ms linear`;
        progBar.style.width = '100%';
    }
    function stopProg() {
        if (!progBar) return;
        progBar.style.transition = 'none';
        progBar.style.width = '0%';
    }

    function startAuto() {
        clearInterval(autoTimer);
        if (!paused) startProg();
        autoTimer = setInterval(() => {
            if (paused) return;
            const vis = getVisible();
            const max = Math.max(0, total - vis);
            goTo(cur >= max ? 0 : cur + 1);
            startProg();
        }, DELAY);
    }
    function resetAuto() { stopProg(); clearInterval(autoTimer); startAuto(); }

    /* Buttons */
    prevBtn && prevBtn.addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(cur + 1); resetAuto(); });

    /* Pause on hover */
    track.addEventListener('mouseenter', () => { paused = true; stopProg(); clearInterval(autoTimer); });
    track.addEventListener('mouseleave', () => { paused = false; resetAuto(); });

    /* Touch swipe */
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const d = tx - e.changedTouches[0].clientX;
        if (Math.abs(d) > 40) { goTo(cur + (d > 0 ? 1 : -1)); resetAuto(); }
    });

    /* Mouse drag */
    let drag = false, dx = 0;
    track.addEventListener('mousedown', e => { drag = true; dx = e.clientX; track.style.cursor = 'grabbing'; });
    document.addEventListener('mouseup', e => {
        if (!drag) return;
        drag = false; track.style.cursor = '';
        const d = dx - e.clientX;
        if (Math.abs(d) > 40) { goTo(cur + (d > 0 ? 1 : -1)); resetAuto(); }
    });

    /* Resize */
    let rt;
    window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => { buildDots(); goTo(0); resetAuto(); }, 220);
    });

    buildDots(); goTo(0); startAuto();
}

/* ══════════════════════
   SMOOTH SCROLL
══════════════════════ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (!t) return;
            e.preventDefault();
            const navH = (document.getElementById('navigation') || {}).offsetHeight || 80;
            window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - navH - 10, behavior: 'smooth' });
        });
    });
}
