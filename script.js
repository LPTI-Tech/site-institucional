// ==============================================================================
// LPTI TECH - JAVASCRIPT OFICIAL DO SITE INSTITUCIONAL
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu Mobile Drawer Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Sombra e Elevação da Navbar ao Rolar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Scrollspy: Destacar Link Ativo no Menu conforme Rola a Página
  const sections = document.querySelectorAll('section[id]');
  
  function updateScrollSpy() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(nl => nl.classList.remove('active'));
          targetNavLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy);

  // 4. Tratamento do Formulário de Contato
  window.handleFormSubmit = function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const company = document.getElementById('company').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    const submitBtn = document.getElementById('submit-btn');
    const feedbackBox = document.getElementById('form-feedback');

    // Desabilitar botão durante envio
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando solicitação...</span>';

    setTimeout(() => {
      feedbackBox.className = 'form-feedback success';
      feedbackBox.style.display = 'block';
      feedbackBox.innerHTML = `
        <strong>Obrigado, ${name}!</strong><br>
        Sua mensagem sobre <em>${service}</em> foi recebida com sucesso.
        Nossos consultores entrarão em contato pelo telefone/WhatsApp <strong>${phone}</strong> ou e-mail <strong>${email}</strong> em até 2 horas úteis.
        <br><br>
        <a href="https://wa.me/5531995165451?text=Ol%C3%A1!%20Meu%20nome%20%C3%A9%20${encodeURIComponent(name)}%2C%20da%20empresa%20${encodeURIComponent(company || 'Minha Empresa')}.%20Acabei%20de%20enviar%20uma%20solicita%C3%A7%C3%A3o%20pelo%20site%20sobre%20${encodeURIComponent(service)}." target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm" style="display: inline-block; margin-top: 8px;">
          Falar agora mesmo no WhatsApp &rarr;
        </a>
      `;

      submitBtn.innerHTML = '<span>Solicitação Enviada ✓</span>';
      document.getElementById('contact-form').reset();
    }, 800);
  };
});
