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
});
