// main.js
(() => {
  /* -------------------------------
     ❄️ EFECTO DE NIEVE SUAVE
  --------------------------------*/
  function initSnow() {
    const canvas = document.getElementById('snowCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let DPR = Math.max(1, window.devicePixelRatio || 1);
    let W = window.innerWidth;
    let H = window.innerHeight;
    let flakes = [];
    let rafId;

    const rand = (min, max) => Math.random() * (max - min) + min;

    function resize() {
      DPR = Math.max(1, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initFlakes();
    }

    function initFlakes() {
      flakes = [];
      const count = Math.min(300, Math.max(60, Math.floor(W / 8)));
      for (let i = 0; i < count; i++) {
        flakes.push({
          x: rand(0, W),
          y: rand(-H, H),
          r: rand(0.8, 3.2),
          speedY: rand(0.3, 2.0),
          speedX: rand(-0.6, 0.6),
          opacity: rand(0.35, 0.95),
          tilt: rand(0, Math.PI * 2),
          tiltSpeed: rand(0.001, 0.02)
        });
      }
    }

    function update() {
      for (const f of flakes) {
        f.tilt += f.tiltSpeed;
        f.x += Math.sin(f.tilt) * 0.6 + f.speedX;
        f.y += f.speedY;
        if (f.y - f.r > H) {
          f.y = -10;
          f.x = rand(0, W);
        }
        if (f.x > W + 20) f.x = -20;
        if (f.x < -20) f.x = W + 20;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'white';
      for (const f of flakes) {
        ctx.globalAlpha = Math.max(0, Math.min(1, f.opacity));
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop() {
      update();
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    loop();
  }

  /* -------------------------------
     🎠 CARRUSEL PRINCIPAL
  --------------------------------*/
  function initCarousel() {
    const carousel = document.getElementById('mainCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prev = carousel.querySelector('.carousel-control.prev');
    const next = carousel.querySelector('.carousel-control.next');
    const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
    let index = 0;
    let isTransitioning = false;

    const update = (newIndex) => {
      if (isTransitioning) return;
      isTransitioning = true;

      index = newIndex;
      track.style.transform = `translateX(${-index * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });

      setTimeout(() => (isTransitioning = false), 500);
    };

    const startAutoplay = () =>
      setInterval(() => update((index + 1) % slides.length), 5000);

    prev?.addEventListener('click', () =>
      update((index - 1 + slides.length) % slides.length)
    );

    next?.addEventListener('click', () =>
      update((index + 1) % slides.length)
    );

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (index !== i) update(i);
      });
    });

    update(0);
    let autoplay = startAutoplay();

    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', () => (autoplay = startAutoplay()));

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev?.click();
      if (e.key === 'ArrowRight') next?.click();
    });
  }

  /* -------------------------------
     🚀 INICIALIZACIÓN GLOBAL
  --------------------------------*/
  function initAll() {
    initSnow();
    initCarousel();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initAll, 0);
  } else {
    document.addEventListener('DOMContentLoaded', initAll);
  }
})();
