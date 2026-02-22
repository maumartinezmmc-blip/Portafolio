document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Efecto Rotatorio del Obturador al hacer Scroll
  const root = document.documentElement;
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(() => {
      const scrollPosition = window.scrollY;
      const rotation = scrollPosition * 0.05; 
      root.style.setProperty('--scroll-rotation', `${rotation}deg`);
    });
  });

   // 2. Lógica del Carrusel (Solo Autoplay y Scroll)
  const track = document.getElementById('hero-track');
  let autoplayInterval;

  if (track) {
    const moveNext = () => {
      // Si llegamos al final, vuelve al inicio
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Avanza exactamente el ancho de una pantalla
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      }
    };

    const startAutoplay = () => { 
      autoplayInterval = setInterval(moveNext, 3000); 
    };

    const stopAutoplay = () => { 
      clearInterval(autoplayInterval); 
    };

    // Iniciar autoplay
    startAutoplay();

    // Pausar cuando el usuario interactúa (mouse o touch)
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, {passive: true});
    track.addEventListener('touchend', startAutoplay);
  }

  // 3. Animaciones de Entrada (Intersection Observer)
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

  // 4. Filtro de Portafolio
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 400); 
        }
      });
    });
  });

  // 5. Menú Móvil
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

// 6. Reproductor de Audio on Hover
  const audioBtn = document.getElementById('hover-audio-btn');
  const audioEl = document.getElementById('showcase-audio');

  if (audioBtn && audioEl) {
    audioBtn.addEventListener('mouseenter', () => {
      // Intenta reproducir el audio. Algunos navegadores bloquean el autoplay
      // si el usuario no ha interactuado con la página primero.
      let playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("La reproducción automática fue prevenida por el navegador.");
        });
      }
    });

    audioBtn.addEventListener('mouseleave', () => {
      audioEl.pause();
      audioEl.currentTime = 0; // Reinicia la pista al quitar el mouse
    });
  }


// 7. Manejo del Formulario de Contacto
const contactForm = document.querySelector('.contact-form');
const feedback = document.getElementById('form-feedback');

if (contactForm && feedback) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Mostrar el mensaje
    feedback.classList.remove('hidden');
    feedback.style.opacity = '1';

    // Opcional: Limpiar los campos del formulario
    contactForm.reset();

    // Configurar el cierre automático después de 5 segundos (5000ms)
    setTimeout(() => {
      feedback.style.opacity = '0'; // Efecto de desvanecimiento
      
      // Esperar a que termine la animación de opacidad para ocultarlo por completo
      setTimeout(() => {
        feedback.classList.add('hidden');
      }, 500); 
      
    }, 5000);
  });
}

// 8. Desbloqueo de Audio por Interacción
const audioOverlay = document.getElementById('audio-unlock-overlay');
const showcaseAudio = document.getElementById('showcase-audio');

if (audioOverlay) {
  // Escuchar clic en toda la ventana
  window.addEventListener('click', () => {
    // Ocultar el aviso
    audioOverlay.classList.add('hidden');
    
    // "Cargar" el audio silenciosamente para que el navegador lo marque como listo
    if (showcaseAudio) {
      showcaseAudio.load(); 
    }
  }, { once: true }); // El evento solo se ejecuta una vez
}

// Actualiza tu sección de hover para que sea más robusta
const audioBtn = document.getElementById('hover-audio-btn');

if (audioBtn && showcaseAudio) {
  audioBtn.addEventListener('mouseenter', () => {
    const playPromise = showcaseAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Si aún así falla, el error será silencioso
        console.log("Audio pausado esperando interacción.");
      });
    }
  });

  audioBtn.addEventListener('mouseleave', () => {
    showcaseAudio.pause();
    showcaseAudio.currentTime = 0;
  });
}

  
});


