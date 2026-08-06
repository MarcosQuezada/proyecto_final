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

  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabPanels.forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  const codeEditor = document.getElementById('code-editor');
  const codeRunBtn = document.getElementById('code-run-btn');
  const codeOutput = document.getElementById('code-output');

  if (codeEditor && codeRunBtn && codeOutput) {
    codeRunBtn.addEventListener('click', () => {
      const code = codeEditor.value.trim();
      if (!code) {
        codeOutput.textContent = 'Escribe algo de código primero.';
        return;
      }

      const hasIf = /\bif\b/.test(code);
      const hasElse = /\belse\b/.test(code);
      const hasFor = /\bfor\b/.test(code);
      const hasPrint = /\bprint\(/.test(code);
      const hasAssignment = /=/.test(code);
      const lines = code.split('\n').length;
      let message = `Tu código tiene ${lines} línea(s).\n`;
      if (hasAssignment) message += '✅ Usa asignación con `=` como en Python 3.\n';
      if (hasIf) message += '✅ Contiene un `if`.\n';
      if (hasElse) message += '✅ Contiene un `else`.\n';
      if (hasFor) message += '✅ Contiene un `for`.\n';
      if (hasPrint) message += '✅ Usa `print()` con paréntesis, propio de Python 3.\n';
      if (!hasIf && !hasElse && !hasFor && !hasPrint) {
        message += 'Intenta escribir un `if`, `else`, `for` o `print()` en tu código.';
      }
      codeOutput.textContent = message;
    });
  }

  const binaryQuestion = document.getElementById('binary-question');
  const binaryAnswer = document.getElementById('binary-answer');
  const binaryCheckBtn = document.getElementById('binary-check-btn');
  const binaryNewBtn = document.getElementById('binary-new-btn');
  const binaryFeedback = document.getElementById('binary-feedback');

  if (binaryQuestion && binaryAnswer && binaryCheckBtn && binaryNewBtn && binaryFeedback) {
    const binaryExercises = [
      { question: '1 + 1', answer: '10' },
      { question: '0 + 1', answer: '1' },
      { question: '0 + 0', answer: '0' },
      { question: '1 + 0', answer: '1' },
      { question: '1 + 1 + 0', answer: '10' },
      { question: '1 + 1 + 1', answer: '11' }
    ];

    let currentExercise = 0;

    const setExercise = (index) => {
      currentExercise = index % binaryExercises.length;
      const exercise = binaryExercises[currentExercise];
      binaryQuestion.textContent = `Ejercicio: ${exercise.question} = ?`;
      binaryAnswer.value = '';
      binaryFeedback.textContent = '';
      binaryFeedback.style.color = '#eaf7ff';
    };

    const checkAnswer = () => {
      const exercise = binaryExercises[currentExercise];
      const userValue = binaryAnswer.value.trim();
      if (userValue === '') {
        binaryFeedback.textContent = 'Escribe una respuesta antes de verificar.';
        binaryFeedback.style.color = '#ffcc00';
        return;
      }

      if (userValue === exercise.answer) {
        binaryFeedback.textContent = `✅ Correcto: ${exercise.question} = ${exercise.answer}`;
        binaryFeedback.style.color = '#7af3ff';
      } else {
        binaryFeedback.textContent = `❌ Incorrecto. La respuesta correcta es ${exercise.answer}.`; 
        binaryFeedback.style.color = '#ff6b6b';
      }
    };

    binaryCheckBtn.addEventListener('click', checkAnswer);
    binaryNewBtn.addEventListener('click', () => {
      const nextIndex = (currentExercise + 1) % binaryExercises.length;
      setExercise(nextIndex);
    });

    setExercise(0);
  }

  
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

  // Reproductor flotante de esquina con lista de reproducción
  const cornerAudio = document.getElementById('corner-audio');
  const cpPlay = document.getElementById('cp-play');
  const cpPlayIcon = document.getElementById('cp-play-icon');
  const cpPrev = document.getElementById('cp-prev');
  const cpNext = document.getElementById('cp-next');
  const cpProgress = document.getElementById('cp-progress');
  const cpProgressFill = document.getElementById('cp-progress-fill');
  const cpTitle = document.getElementById('cp-title');

  if (cornerAudio && cpPlay && cpPlayIcon && cpProgress && cpProgressFill) {
      const playlist = [
        'audio/user-track.mp3',
        'audio/user-track-3.mp3',
        'audio/user-track-4.mp3'
      ];
      const trackTitles = [
        'Michael Jackson - Bad',
        'Eminem - Without Me',
        "Elton John - I'm Still Standing"
      ];
    let currentTrack = 0;

    const loadTrack = (index, autoplay = false) => {
      if (!playlist[index]) return;
      currentTrack = index;
      cornerAudio.src = playlist[index];
      cornerAudio.load();
      if (cpTitle) cpTitle.textContent = trackTitles[index] || playlist[index];
      cpProgressFill.style.width = '0%';
      if (autoplay) {
        cornerAudio.play().then(() => {
          cpPlayIcon.classList.remove('fa-play');
          cpPlayIcon.classList.add('fa-pause');
        }).catch((err) => { console.warn('Reproducción bloqueada:', err); });
      } else {
        cpPlayIcon.classList.remove('fa-pause');
        cpPlayIcon.classList.add('fa-play');
      }
    };

    // Cargar pista inicial (sin autoplay)
    loadTrack(currentTrack, false);

    cpPlay.addEventListener('click', async () => {
      try {
        if (cornerAudio.paused) {
          await cornerAudio.play();
          cpPlayIcon.classList.remove('fa-play');
          cpPlayIcon.classList.add('fa-pause');
        } else {
          cornerAudio.pause();
          cpPlayIcon.classList.remove('fa-pause');
          cpPlayIcon.classList.add('fa-play');
        }
      } catch (err) {
        console.warn('Error al reproducir corner-audio:', err);
        alert('El navegador bloqueó la reproducción. Pulsa reproducir de nuevo.');
      }
    });

    cornerAudio.addEventListener('timeupdate', () => {
      if (!cornerAudio.duration || isNaN(cornerAudio.duration)) return;
      const pct = (cornerAudio.currentTime / cornerAudio.duration) * 100;
      cpProgressFill.style.width = `${pct}%`;
    });

    cpProgress.addEventListener('click', (e) => {
      const rect = cpProgress.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      if (cornerAudio.duration && !isNaN(cornerAudio.duration)) cornerAudio.currentTime = pct * cornerAudio.duration;
    });

    cpPrev.addEventListener('click', () => {
      const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
      loadTrack(prevIndex, true);
    });

    cpNext.addEventListener('click', () => {
      const nextIndex = (currentTrack + 1) % playlist.length;
      loadTrack(nextIndex, true);
    });

    cornerAudio.addEventListener('ended', () => {
      // Avanza automáticamente a la siguiente pista
      const nextIndex = (currentTrack + 1) % playlist.length;
      loadTrack(nextIndex, true);
    });
  }

});
