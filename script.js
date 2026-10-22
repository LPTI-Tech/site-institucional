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

  // 4. Tratamento do Formulário de Contato com Envio Real para contato@lptitech.com.br
  window.handleFormSubmit = async function(e) {
    e.preventDefault();

    const form = document.getElementById('contact-form');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const company = document.getElementById('company').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    const submitBtn = document.getElementById('submit-btn');
    const feedbackBox = document.getElementById('form-feedback');

    // Desabilitar botão e exibir estado de carregamento
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando mensagem...</span>';
    feedbackBox.style.display = 'none';

    try {
      const payload = {
        name: name,
        email: email,
        phone: phone,
        company: company || 'Não informado',
        service: service,
        message: message,
        _subject: `[LPTI Tech] Solicitação de Contato: ${name} (${service})`,
        _template: 'table',
        _captcha: 'false'
      };

      const response = await fetch('https://formsubmit.co/ajax/contato@lptitech.com.br', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || (result && (result.success === 'true' || result.success === true))) {
        feedbackBox.className = 'form-feedback success';
        feedbackBox.style.display = 'block';
        feedbackBox.innerHTML = `
          <strong>Mensagem enviada com sucesso!</strong><br>
          Olá, <strong>${name}</strong>! Sua solicitação referente a <em>${service}</em> foi transmitida diretamente para nossa equipe (<code>contato@lptitech.com.br</code>).
          Retornaremos em seu e-mail <strong>${email}</strong> ou telefone/WhatsApp <strong>${phone}</strong> em até 2 horas comerciais.
          <br><br>
          <a href="https://wa.me/5531988004560?text=Ol%C3%A1!%20Meu%20nome%20%C3%A9%20${encodeURIComponent(name)}%2C%20da%20empresa%20${encodeURIComponent(company || 'Minha Empresa')}.%20Acabei%20de%20enviar%20uma%20solicita%C3%A7%C3%A3o%20pelo%20site%20sobre%20${encodeURIComponent(service)}." target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm" style="display: inline-block; margin-top: 8px;">
            💬 Prefere atendimento imediato? Fale agora no WhatsApp &rarr;
          </a>
        `;

        submitBtn.innerHTML = '<span>Solicitação Enviada ✓</span>';
        form.reset();
      } else {
        throw new Error(result.message || 'Resposta inesperada do endpoint de envio');
      }
    } catch (err) {
      console.warn('Envio via AJAX encontrou restrição de rede/CORS, submetendo via POST nativo:', err);
      // Fallback 1: se for bloqueio de CORS/Adblock no fetch, submete o formulário via POST nativo
      if (form) {
        submitBtn.innerHTML = '<span>Transmitindo dados...</span>';
        form.submit();
        return;
      }

      // Fallback 2: exibe opções alternativas de contato
      feedbackBox.className = 'form-feedback error';
      feedbackBox.style.display = 'block';
      feedbackBox.innerHTML = `
        <strong>Não foi possível enviar automaticamente.</strong><br>
        Envie sua mensagem diretamente para nosso e-mail oficial: <a href="mailto:contato@lptitech.com.br" style="color: #1976D2; font-weight: 600;">contato@lptitech.com.br</a> ou chame nossa equipe no WhatsApp:
        <br><br>
        <a href="https://wa.me/5531988004560?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20sobre%20${encodeURIComponent(service)}." target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm" style="display: inline-block; margin-top: 8px;">
          💬 Chamar no WhatsApp (31) 98800-4560 &rarr;
        </a>
      `;
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Tentar Novamente</span>';
    }
  };
});
