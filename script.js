/**
 * ValoraWeb Studios - Script Interactivo y Gestor de Conversión
 * Código puro vanilla JavaScript (sin dependencias ni librerías pesadas)
 */

// =============================================================================
// CONFIGURACIÓN RÁPIDA (Edita aquí tus datos personales)
// =============================================================================
const CONFIG = {
  // Número de WhatsApp configurado
  whatsappNumber: '56976372477',

  // Enlace público para reservar una reunión en Google Calendar
  calendarUrl: 'https://calendar.app.google/c8Ny6ti9rQr7HCgbA',

  // Nombre comercial
  brandName: 'ValoraWeb',

  // Mensaje para compra directa de la oferta
  offerMessage: '¡Hola! Me interesa contratar el plan de página web profesional por $150.000 + IVA (con hosting y dominio por 1 año + 3 meses de gestión incluidos). ¿Cuáles son los siguientes pasos?'
};

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppWidget();
  initContactOptions();
  initPortfolioModal();
  initPortfolioTabs();
  initScrollAnimations();
  initMobileNav();
  updateStaticLinks();
});

// =============================================================================
// 1. ACTUALIZAR ENLACES ESTÁTICOS CON LA CONFIGURACIÓN
// =============================================================================
function updateStaticLinks() {
  // Enlace directo en el footer
  const footerWa = document.getElementById('footer-wa-link');
  if (footerWa) {
    footerWa.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Hola, me gustaría información sobre sus servicios web.')}`;
    footerWa.textContent = '+56 9 7637 2477';
  }


  // Botón comprar directo en la tarjeta de precios
  const btnComprarWa = document.getElementById('btn-comprar-whatsapp');
  if (btnComprarWa) {
    btnComprarWa.addEventListener('click', () => {
      openWhatsApp(CONFIG.offerMessage);
    });
  }
}

// =============================================================================
// 2. BOTÓN FLOTANTE CLÁSICO DE WHATSAPP
// =============================================================================
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('whatsapp-toggle-btn');
  const popup = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('whatsapp-popup-close');
  const chatTrigger = document.getElementById('whatsapp-chat-trigger');

  if (!toggleBtn || !popup) return;

  // Asignar el enlace directo al botón dentro del popup
  if (chatTrigger) {
    const defaultGreeting = '¡Hola! Estoy visitando su sitio web y me gustaría hacer una consulta.';
    chatTrigger.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(defaultGreeting)}`;
    chatTrigger.addEventListener('click', () => {
      popup.classList.remove('is-open');
    });
  }

  // Alternar apertura de popup
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.toggle('is-open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.classList.remove('is-open');
    });
  }

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !toggleBtn.contains(e.target)) {
      popup.classList.remove('is-open');
    }
  });

  // Mostrar automáticamente la burbuja de saludo tras 4 segundos para captar atención
  setTimeout(() => {
    if (!popup.classList.contains('is-open')) {
      popup.classList.add('is-open');
    }
  }, 4000);
}

// =============================================================================
// 3. OPCIONES DE CONTACTO: GOOGLE CALENDAR O WHATSAPP
// =============================================================================
function initContactOptions() {
  const calendarLink = document.getElementById('google-calendar-link');
  const whatsappLink = document.getElementById('contact-whatsapp-link');

  if (calendarLink) {
    calendarLink.href = CONFIG.calendarUrl;
  }

  if (whatsappLink) {
    const consultationMessage =
      '¡Hola! Estoy visitando ValoraWeb y me gustaría hacer una consulta sobre una página web antes de agendar una reunión.';

    whatsappLink.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(consultationMessage)}`;
  }
}

// =============================================================================
// 4. MODAL LIGHTBOX PARA PROYECTOS DEL PORTAFOLIO
// =============================================================================
function initPortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const closeBtn = document.getElementById('modal-close-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  if (!modal || !modalImg) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');

      modalImg.src = imgSrc;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closePortfolioModal(modal);
    });
  }

  // Cerrar al hacer clic en el backdrop (fondo oscuro)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePortfolioModal(modal);
    }
  });

  // Cerrar al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.open) {
      closePortfolioModal(modal);
    }
  });

  const modalCta = document.getElementById('modal-cta-btn');
  if (modalCta) {
    modalCta.addEventListener('click', () => {
      closePortfolioModal(modal);
    });
  }
}

function closePortfolioModal(modal) {
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

// =============================================================================
// 5. GESTIÓN DE PESTAÑAS DEL PORTAFOLIO Y RECARGA DE DEMO MÓVIL
// =============================================================================
function initPortfolioTabs() {
  const tabBtns = document.querySelectorAll('.portfolio-tab-btn');
  const tabContents = document.querySelectorAll('.portfolio-tab-content');
  const reloadBtn = document.getElementById('btn-reload-phone');
  const phoneIframe = document.getElementById('phone-demo-iframe');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('is-active'));
      tabContents.forEach(c => c.classList.remove('is-active'));

      btn.classList.add('is-active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('is-active');
      }
    });
  });

  if (reloadBtn && phoneIframe) {
    reloadBtn.addEventListener('click', () => {
      const originalSrc = phoneIframe.src;
      phoneIframe.src = 'about:blank';
      setTimeout(() => {
        phoneIframe.src = originalSrc;
        showToast('Demostración móvil reiniciada', 'success');
      }, 100);
    });
  }
}

// =============================================================================
// 6. ANIMACIONES DE DESPLAZAMIENTO SUAVE (INTERSECTION OBSERVER)
// =============================================================================
function initScrollAnimations() {
  const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elementsToReveal.forEach(el => observer.observe(el));
  } else {
    // Si el navegador no soporta IntersectionObserver, mostrar directamente
    elementsToReveal.forEach(el => el.classList.add('is-visible'));
  }
}

// =============================================================================
// 7. MENÚ MÓVIL RESPONSIVE
// =============================================================================
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-active');
  });

  // Cerrar al hacer clic en un enlace
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-active');
    });
  });
}

// =============================================================================
// UTILIDADES: APERTURA DE WHATSAPP Y NOTIFICACIONES TOAST
// =============================================================================
function openWhatsApp(message) {
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
