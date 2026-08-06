document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach((section) => observer.observe(section));

  AOS.init({
    duration: 900,
    once: true,
    offset: 100
  });

  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 18)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.8 + 0.2
    }));
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawParticles();

  const quizSelects = document.querySelectorAll('.unit-card select');
  quizSelects.forEach((select) => {
    select.addEventListener('change', () => {
      const parent = select.closest('.unit-card');
      const feedback = parent.querySelector('.quiz-feedback');
      const selectedValue = select.value;
      const correctValue = select.dataset.correct || '';

      if (!feedback) return;
      if (selectedValue === correctValue) {
        feedback.textContent = '✅ Correcto. Muy bien.';
        feedback.style.color = '#7af3ff';
      } else {
        feedback.textContent = '❌ Respuesta incorrecta. Inténtalo de nuevo.';
        feedback.style.color = '#ff6b6b';
      }
    });
  });
  
  // Lógica para reproducir/pausar la música (requiere interacción del usuario)
  const audio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');

  if (musicToggle && audio && musicIcon) {
    musicToggle.addEventListener('click', async () => {
      try {
        if (audio.paused) {
          await audio.play();
          musicIcon.classList.remove('fa-play');
          musicIcon.classList.add('fa-pause');
        } else {
          audio.pause();
          musicIcon.classList.remove('fa-pause');
          musicIcon.classList.add('fa-play');
        }
      } catch (err) {
        console.warn('Error al reproducir audio:', err);
        alert('El navegador bloqueó la reproducción automática. Pulsa reproducir de nuevo.');
      }
    });

    audio.addEventListener('ended', () => {
      musicIcon.classList.remove('fa-pause');
      musicIcon.classList.add('fa-play');
    });
  }

  // Lightbox para ampliar imágenes con la clase .img-zoomable
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('img.img-zoomable').forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

});
