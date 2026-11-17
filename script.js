// ==============================================================================
// LPTI TECH & GESTOR MEI - JAVASCRIPT OFICIAL DA LANDING PAGE 2.0
// Scrollytelling, Vista Explodida 3D, IntersectionObserver & Conversão
// LPTI Tech — Desenvolvido por Leônidas Paulino
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------------------------
  // 1. Menu Mobile Drawer com Trava de Overflow
  // ----------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    const toggleMenu = (forceState) => {
      const isOpen = typeof forceState === 'boolean' ? forceState : navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    };

    hamburgerBtn.addEventListener('click', () => toggleMenu());

    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // ----------------------------------------------------------------------------
  // 2. Elevação da Navbar ao Rolar a Página
  // ----------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ----------------------------------------------------------------------------
  // 3. Vista Explodida 3D com LERP & Easing Cúbico (easeInOutCubic)
  // ----------------------------------------------------------------------------
  const explodedTrack = document.getElementById('exploded-view-track');
  const modelStack = document.querySelector('.exploded-model-stack');
  const layer1 = document.getElementById('exploded-layer-1');
  const layer2 = document.getElementById('exploded-layer-2');
  const layer3 = document.getElementById('exploded-layer-3');
  const callout1 = document.getElementById('callout-1');
  const callout2 = document.getElementById('callout-2');
  const callout3 = document.getElementById('callout-3');
  const explodedStatus = document.getElementById('exploded-status-text');

  if (explodedTrack && layer1 && layer2 && layer3) {
    let targetProgress = 0;
    let currentProgress = 0;
    let isLoopRunning = false;

    // Curva de interpolação cúbica (easeInOutCubic)
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const updateTargetProgress = () => {
      const rect = explodedTrack.getBoundingClientRect();
      const trackHeight = explodedTrack.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      const rawProgress = -rect.top / trackHeight;
      targetProgress = Math.max(0, Math.min(1, rawProgress));

      if (!isLoopRunning) {
        isLoopRunning = true;
        requestAnimationFrame(renderLoop);
      }
    };

    const renderLoop = () => {
      // Interpolação Linear Suave (LERP)
      currentProgress += (targetProgress - currentProgress) * 0.08;

      const delta = Math.abs(targetProgress - currentProgress);
      if (delta < 0.0001) {
        currentProgress = targetProgress;
      }

      // Fases com transição cúbica:
      // 0.00 a 0.16: montado (0)
      // 0.16 a 0.50: abrindo com easeInOutCubic (0 -> 1)
      // 0.50 a 0.78: totalmente explodido (1)
      // 0.78 a 0.98: fechando com easeInOutCubic (1 -> 0)
      // 0.98 a 1.00: montado (0)
      let separation = 0;
      let statusLabel = '✦ Terminal Integrado: Pronto para Vender';

      if (currentProgress < 0.16) {
        separation = 0;
        statusLabel = '✦ Terminal Integrado: Pronto para Vender';
      } else if (currentProgress >= 0.16 && currentProgress < 0.50) {
        const t = (currentProgress - 0.16) / 0.34;
        separation = easeInOutCubic(Math.max(0, Math.min(1, t)));
        statusLabel = '✦ Vista Explodida: Revelando a Engenharia';
      } else if (currentProgress >= 0.50 && currentProgress < 0.78) {
        separation = 1;
        statusLabel = '✦ 3 Camadas em Ação: PDV, Blindagem & Nuvem';
      } else if (currentProgress >= 0.78 && currentProgress < 0.98) {
        const t = (currentProgress - 0.78) / 0.20;
        separation = 1 - easeInOutCubic(Math.max(0, Math.min(1, t)));
        statusLabel = '✦ Reagrupamento: Hardware e Software Unificados';
      } else {
        separation = 0;
        statusLabel = '✦ Terminal Pronto: Conheça os Módulos Práticos ↓';
      }

      // Aplicação das transformações aceleradas por GPU
      const isMobile = window.innerWidth <= 768;
      const spreadY = isMobile ? 110 : 195;
      const spreadZ = isMobile ? 35 : 110;

      // Dinâmica de inclinação isométrica acentuada: pico em rotateX(52deg) rotateZ(-28deg)
      if (modelStack) {
        if (!isMobile) {
          const rotX = 46 + separation * 6;   // 46deg -> 52deg
          const rotZ = -24 - separation * 4;  // -24deg -> -28deg
          modelStack.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
        } else {
          modelStack.style.transform = `rotateX(35deg) rotateZ(-12deg)`;
        }
      }

      layer1.style.transform = `translate3d(0, ${-separation * spreadY}px, ${separation * spreadZ}px)`;
      layer2.style.transform = `translate3d(0, 0, 0)`;
      layer3.style.transform = `translate3d(0, ${separation * spreadY}px, ${-separation * spreadZ}px)`;

      // Transição suave de opacidade dos callout cards
      const calloutOpacity = Math.max(0, Math.min(1, (separation - 0.20) / 0.55));
      if (callout1) callout1.style.opacity = calloutOpacity;
      if (callout2) callout2.style.opacity = calloutOpacity;
      if (callout3) callout3.style.opacity = calloutOpacity;

      if (explodedStatus) {
        explodedStatus.textContent = statusLabel;
      }

      if (delta >= 0.0001) {
        requestAnimationFrame(renderLoop);
      } else {
        isLoopRunning = false;
      }
    };

    window.addEventListener('scroll', updateTargetProgress, { passive: true });
    window.addEventListener('resize', updateTargetProgress, { passive: true });

    // Chamada inicial
    updateTargetProgress();
  }

  // ----------------------------------------------------------------------------
  // 4. Tabs Interativas: O Caos do Empreendedor vs Gestor MEI (Ato 2)
  // ----------------------------------------------------------------------------
  const segmentData = {
    marmitarias: {
      beforeTitle: 'O Sufoco na Cozinha & no Delivery',
      beforeItems: [
        'Comandas de papel engorduradas se perdendo entre a chapa e o fogão.',
        'Taxas de até 27% retidas por marketplaces em clientes que já são seus.',
        'Acerto com motoboy feito de cabeça no fim da noite com prejuízo invisível.',
        'Falta de embalagem e insumos no meio do horário de pico do almoço.'
      ],
      afterTitle: 'Operação Ágil, Entregas na Hora & Lucro no Bolso',
      afterItems: [
        'Painel de delivery em tempo real: Recebido, Em Preparo, Na Rota e Entregue.',
        'Canal próprio de pedidos sem comissões abusivas aos intermediários.',
        'Cálculo automático da taxa de entrega e fechamento limpo das corridas do motoboy.',
        'Estoque de carnes, embalagens e bebidas monitorado com alerta de reposição.'
      ]
    },
    comercios: {
      beforeTitle: 'Fila no Balcão & Susto no Estoque',
      beforeItems: [
        'Fila no caixa porque a maquininha é lenta e o sistema trava toda hora.',
        'Cliente querendo comprar e descobrindo que o item acabou na prateleira.',
        'Caderninho de fiado com notas soltas e calote recorrente.',
        'Sensação de vender muito o mês inteiro e não ver a cor do dinheiro.'
      ],
      afterTitle: 'Venda em 10 Segundos & Controle Total',
      afterItems: [
        'PDV ultrarrápido com leitor de código de barras e teclas de atalho instantâneas.',
        'Alerta de estoque mínimo antes que o produto esgote no fornecedor.',
        'Histórico do cliente com controle seguro de contas a receber e crediário.',
        'Indicador transparente de "Quanto Sobrou" após deduzir custos e compras.'
      ]
    },
    servicos: {
      beforeTitle: 'Amadorismo nos Orçamentos & Medo do Teto',
      beforeItems: [
        'Propostas enviadas como mensagem de texto desorganizada no WhatsApp.',
        'Medo de estourar o limite do MEI (R$ 81.000,00) e ser desenquadrado.',
        'Esquecimento da guia do DAS gerando juros, multas e bloqueio de benefícios.',
        'Desespero na hora de fazer a Declaração Anual sem saber o faturamento exato.'
      ],
      afterTitle: 'Propostas em PDF & CNPJ 100% Blindado',
      afterItems: [
        'Orçamentos profissionais em PDF gerados e enviados em 1 clique para o cliente.',
        'Régua visual do teto anual do MEI com aviso preventivo de segurança.',
        'Alerta automático do DAS dia 20 com botão para copiar código Pix na hora.',
        'Relatório anual consolidado pronto para preencher a declaração DASN-SIMEI.'
      ]
    }
  };

  const tabButtons = document.querySelectorAll('.segment-tab-btn');
  const beforeTitleEl = document.getElementById('comparison-before-title');
  const beforeListEl = document.getElementById('comparison-before-list');
  const afterTitleEl = document.getElementById('comparison-after-title');
  const afterListEl = document.getElementById('comparison-after-list');

  if (tabButtons.length > 0 && beforeTitleEl && beforeListEl && afterTitleEl && afterListEl) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const segment = btn.getAttribute('data-segment');
        const data = segmentData[segment];
        if (!data) return;

        // Transição suave de conteúdo
        beforeTitleEl.style.opacity = '0';
        beforeListEl.style.opacity = '0';
        afterTitleEl.style.opacity = '0';
        afterListEl.style.opacity = '0';

        setTimeout(() => {
          beforeTitleEl.textContent = data.beforeTitle;
          beforeListEl.innerHTML = data.beforeItems
            .map(item => `<li class="comparison-item"><span class="item-icon">✕</span> <span>${item}</span></li>`)
            .join('');

          afterTitleEl.textContent = data.afterTitle;
          afterListEl.innerHTML = data.afterItems
            .map(item => `<li class="comparison-item"><span class="item-icon">✓</span> <span>${item}</span></li>`)
            .join('');

          beforeTitleEl.style.opacity = '1';
          beforeListEl.style.opacity = '1';
          afterTitleEl.style.opacity = '1';
          afterListEl.style.opacity = '1';
        }, 180);
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 5. IntersectionObserver para Revelação Gradual de Seções ([data-reveal])
  // ----------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback para navegadores legados
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ----------------------------------------------------------------------------
  // 6. Formulário de Contato com Envio Assíncrono e Fallback WhatsApp
  // ----------------------------------------------------------------------------
  window.handleFormSubmit = async function(e) {
    e.preventDefault();

    const form = document.getElementById('contact-form');
    const name = document.getElementById('name').value.trim();
    const segment = document.getElementById('segment').value;
    const phone = document.getElementById('phone').value.trim();
    const challenge = document.getElementById('challenge').value.trim();
    const submitBtn = document.getElementById('submit-btn');
    const feedbackBox = document.getElementById('form-feedback');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processando solicitação...</span>';
    feedbackBox.style.display = 'none';

    try {
      const payload = {
        name: name,
        segment: segment,
        phone: phone,
        challenge: challenge,
        _subject: `[Gestor MEI 2.0] Demonstração Solicitada: ${name} (${segment})`,
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
          <strong>Solicitação recebida com sucesso!</strong><br>
          Olá, <strong>${name}</strong>! Leônidas entrará em contato via WhatsApp no número <strong>${phone}</strong> para agendar a demonstração personalizada para o seu ramo (<em>${segment}</em>).
          <br><br>
          <a href="https://wa.me/5531988004560?text=Ol%C3%A1!%20Meu%20nome%20%C3%A9%20${encodeURIComponent(name)}%2C%20do%20ramo%20${encodeURIComponent(segment)}.%20Acabei%20de%20solicitar%20a%20demonstra%C3%A7%C3%A3o%20do%20Gestor%20MEI%20no%20site." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display: inline-block; margin-top: 6px;">
            💬 Prefere atendimento imediato? Falar agora no WhatsApp &rarr;
          </a>
        `;

        submitBtn.innerHTML = '<span>Solicitação Enviada ✓</span>';
        form.reset();
      } else {
        throw new Error(result.message || 'Falha ao transmitir dados');
      }
    } catch (err) {
      console.warn('Fallback ativado para formulário:', err);
      // Fallback 1: se for bloqueio de CORS/Adblock, tenta post nativo
      if (form) {
        submitBtn.innerHTML = '<span>Transmitindo dados...</span>';
        form.submit();
        return;
      }

      // Fallback 2: exibe botão direto WhatsApp
      feedbackBox.className = 'form-feedback error';
      feedbackBox.style.display = 'block';
      feedbackBox.innerHTML = `
        <strong>Não foi possível enviar automaticamente.</strong><br>
        Clique abaixo para falar diretamente com nosso especialista no WhatsApp:
        <br><br>
        <a href="https://wa.me/5531988004560?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20Gestor%20MEI%20para%20o%20meu%20neg%C3%B3cio." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
          💬 Falar no WhatsApp (31) 98800-4560 &rarr;
        </a>
      `;
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Tentar Novamente</span>';
    }
  };
});
