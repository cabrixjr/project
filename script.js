/* Initialize EmailJS Service */
(function() {
  if (window.emailjs) {
    emailjs.init('bAUXeTgnzlvgLP4bN');
  }
})();

document.addEventListener('DOMContentLoaded', function() {

  // Dynamic Year Setup
  const yearElem = document.getElementById('year');
  if (yearElem) yearElem.textContent = new Date().getFullYear();

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  /* ---------------- HERO SLIDER LOGIC ---------------- */
  const heroTrack = document.getElementById('heroTrack');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDotsWrap = document.getElementById('heroDots');
  let currentHeroSlide = 0;

  if (heroTrack && heroSlides.length > 0 && heroDotsWrap) {
    heroSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToHeroSlide(i));
      heroDotsWrap.appendChild(dot);
    });

    function goToHeroSlide(index) {
      currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
      heroTrack.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
      document.querySelectorAll('.hero-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentHeroSlide);
      });
    }

    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    if (heroPrev) heroPrev.addEventListener('click', () => goToHeroSlide(currentHeroSlide - 1));
    if (heroNext) heroNext.addEventListener('click', () => goToHeroSlide(currentHeroSlide + 1));

    let autoHeroSlide = setInterval(() => goToHeroSlide(currentHeroSlide + 1), 4000);
    const heroWrap = document.querySelector('.hero-slider-wrap');
    if (heroWrap) {
      heroWrap.addEventListener('mouseenter', () => clearInterval(autoHeroSlide));
      heroWrap.addEventListener('mouseleave', () => {
        autoHeroSlide = setInterval(() => goToHeroSlide(currentHeroSlide + 1), 4000);
      });
    }
  }

  /* ---------------- SERVICES DATA & RENDERING ---------------- */
  const services = [
    { id: "ecommerce", name: "E-commerce Websites", tagline: "Sell online with secure checkout and mobile money built in.", low: "850,000", high: "2,000,000", img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80" },
    { id: "small-org", name: "Small Organizational Websites", tagline: "A clean, professional site to introduce your business online.", low: "250,000", high: "550,000", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" },
    { id: "large-org", name: "Large Organizational Websites", tagline: "Full-scale site for organizations with multiple departments.", low: "700,000", high: "2,500,000", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
    { id: "restaurant", name: "Restaurant Websites", tagline: "Menus, gallery and online ordering that make mouths water.", low: "500,000", high: "1,500,000", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" },
    { id: "portals", name: "School & Office Portals", tagline: "Manage students, staff and records in one dashboard.", low: "300,000", high: "1,000,000", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80" },
    { id: "booking", name: "Booking Systems", tagline: "Let clients book appointments or services in a few taps.", low: "400,000", high: "1,500,000", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80" },
    { id: "apps", name: "Mobile Apps (Android & iOS)", tagline: "Native-feeling apps built for your business, on both stores.", low: "1,000,000", high: "5,000,000", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80" },
    { id: "student", name: "Student Test Projects", tagline: "Academic project builds for university and college coursework.", low: "200,000", high: "500,000", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" },
    { id: "maintenance", name: "Website Management & Updates", tagline: "Ongoing updates, fixes and improvements for an existing site.", low: "200,000", high: "800,000", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80" }
  ];

  const grid = document.getElementById('servicesGrid');
  const select = document.getElementById('service');

  if (grid) {
    services.forEach(s => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="service-media">
          <img src="${s.img}" alt="${s.name}" referrerpolicy="no-referrer">
        </div>
        <div class="service-body">
          <h3>${s.name}</h3>
          <p class="tagline">${s.tagline}</p>
          <div class="price-tag"><small>Starting from</small>TSh ${s.low} – ${s.high}</div>
          <button class="get-btn" data-service="${s.id}">START PROJECT NOW</button>
        </div>`;
      grid.appendChild(card);
    });

    grid.addEventListener('click', function(e) {
      const btn = e.target.closest('.get-btn');
      if (!btn) return;
      if (select) select.value = btn.dataset.service;
      const orderSec = document.getElementById('order');
      if (orderSec) orderSec.scrollIntoView({ behavior: 'smooth' });
      const nameInput = document.getElementById('name');
      if (nameInput) nameInput.focus({ preventScroll: true });
    });
  }

  if (select) {
    services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (TSh ${s.low}–${s.high})`;
      select.appendChild(opt);
    });
  }

  /* ---------------- REVIEWS DATA & SLIDER ---------------- */
  const reviews = [
    { name: "Amina R.", role: "Boutique owner, Kariakoo", quote: "AJ Web Solutions built our shop site in two weeks and our online orders picked up almost right away." },
    { name: "Juma K.", role: "Salon owner, Mikocheni", quote: "The booking system runs so smooth — clients book their own slots and we barely get phone calls now." },
    { name: "Grace M.", role: "Restaurant manager, Masaki", quote: "Our menu page looks amazing and orders come straight through to our WhatsApp. Customers love it." },
    { name: "Baraka S.", role: "Deputy head teacher", quote: "The school portal made tracking student progress so much easier for our whole staff room." },
    { name: "Fatuma H.", role: "Small business owner", quote: "Fast delivery, fair price, and they still support us months after launch whenever we need changes." },
    { name: "Elias T.", role: "NGO program officer", quote: "Professional team that actually understood what our organization needed, not just a generic template." }
  ];

  const slidesWrap = document.getElementById('reviewSlides');
  const dotsWrap = document.getElementById('reviewDots');
  let currentReview = 0;

  if (slidesWrap && dotsWrap) {
    reviews.forEach((r, i) => {
      const slide = document.createElement('div');
      slide.className = 'review-card';
      slide.innerHTML = `
        <div class="stars">★★★★★</div>
        <p class="review-quote">"${r.quote}"</p>
        <div class="review-name">${r.name}</div>
        <div class="review-role">${r.role}</div>`;
      slidesWrap.appendChild(slide);

      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToReviewSlide(i));
      dotsWrap.appendChild(dot);
    });

    function goToReviewSlide(i) {
      currentReview = (i + reviews.length) % reviews.length;
      slidesWrap.style.transform = `translateX(-${currentReview * 100}%)`;
      [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === currentReview));
    }

    const reviewPrev = document.getElementById('reviewPrev');
    const reviewNext = document.getElementById('reviewNext');
    if (reviewPrev) reviewPrev.addEventListener('click', () => goToReviewSlide(currentReview - 1));
    if (reviewNext) reviewNext.addEventListener('click', () => goToReviewSlide(currentReview + 1));

    let autoReviewSlide = setInterval(() => goToReviewSlide(currentReview + 1), 5000);
    const reviewWrap = document.querySelector('.reviews-slider');
    if (reviewWrap) {
      reviewWrap.addEventListener('mouseenter', () => clearInterval(autoReviewSlide));
      reviewWrap.addEventListener('mouseleave', () => {
        autoReviewSlide = setInterval(() => goToReviewSlide(currentReview + 1), 5000);
      });
    }
  }

  /* ---------------- DUAL EMAILJS SUBMISSION ---------------- */
  const orderForm = document.getElementById('orderForm');
  const statusDiv = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const phoneVal = document.getElementById('phone').value.trim();
      const selectedService = services.find(s => s.id === select.value);
      const serviceVal = selectedService ? selectedService.name : select.options[select.selectedIndex].text;
      const messageVal = document.getElementById('message').value.trim();

      const templateParams = {
        from_name: nameVal,
        from_email: emailVal,
        phone: phoneVal,
        service: serviceVal,
        message: messageVal
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusDiv.className = 'submit-status';
      statusDiv.style.display = 'block';
      statusDiv.textContent = '';

      // 1. Send notification to admin (template_79517jk)
      const sendAdminNotif = emailjs.send('service_m2es8ke', 'template_79517jk', templateParams);

      // 2. Send automated reply to applicant (template_cv93g1l)
      const sendClientAutoReply = emailjs.send('service_m2es8ke', 'template_cv93g1l', templateParams);

      Promise.all([sendAdminNotif, sendClientAutoReply])
        .then(function() {
          statusDiv.textContent = "Thank you! Your project request has been submitted, and a confirmation email has been sent to your inbox.";
          statusDiv.className = 'submit-status ok';
          orderForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Request';
        })
        .catch(function(error) {
          console.error('EmailJS Execution Error:', error);
          statusDiv.textContent = "Unable to dispatch message directly. Please contact us on WhatsApp (+255 612 442 097).";
          statusDiv.className = 'submit-status err';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Request';
        });
    });
  }

});