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
  // Função Utilitária: Contagem Progressiva de Números (Count-Up)
  // ----------------------------------------------------------------------------
  const animateCountUp = (element) => {
    if (!element || element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';

    const targetVal = parseFloat(element.getAttribute('data-counter'));
    if (isNaN(targetVal)) return;

    const format = element.getAttribute('data-format') || 'number';
    const duration = 1400; // 1.4 segundos de animação suave
    const startTime = performance.now();

    const formatValue = (current) => {
      if (format === 'currency') {
        return 'R$ ' + current.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else if (format === 'percent') {
        const decimals = targetVal % 1 === 0 ? 0 : 1;
        return current.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + '%';
      } else if (format === 'seconds') {
        const intVal = Math.round(current);
        return '< ' + intVal + 's';
      } else {
        const decimals = targetVal % 1 === 0 ? 0 : (targetVal.toString().split('.')[1] || '').length;
        return current.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      }
    };

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutExpo(progress);
      const currentVal = targetVal * easedProgress;

      element.textContent = formatValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = formatValue(targetVal);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Observador de Entrada no Viewport para Indicadores Numéricos Globais
  const counterElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -20px 0px'
    });

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    counterElements.forEach(el => animateCountUp(el));
  }

  // ----------------------------------------------------------------------------
  // 3. Scrollytelling 3D Cinematográfico das 4 Telas Reais com LERP & Perspectiva
  // ----------------------------------------------------------------------------
  const explodedTrack = document.getElementById('exploded-view-track');
  const scrollyScene = document.getElementById('scrolly-scene');
  const screenFrames = document.querySelectorAll('.scrolly-screen-frame');
  const captionCards = document.querySelectorAll('.scrolly-caption-card');
  const stepButtons = document.querySelectorAll('.scrolly-step-btn');
  const progressFill = document.getElementById('scrolly-progress-fill');
  const statusText = document.getElementById('exploded-status-text');

  // Pré-carregamento imediato das imagens em memória (WebP otimizado)
  const screenUrls = [
    'assets/screens/1-pdv.webp',
    'assets/screens/2-estoque.webp',
    'assets/screens/3-compras.webp',
    'assets/screens/4-dashboard.webp'
  ];
  screenUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });

  const statusLabels = [
    '✦ PDV Balcão: Vendas em Menos de 10 Segundos',
    '✦ Controle de Estoque: Alertas em Tempo Real & Baixa Automática',
    '✦ Compras & XML: Importação NF-e sem Digitação Manual',
    '✦ Dashboard Estratégico: Gestão do Teto MEI & Margem Líquida'
  ];

  if (explodedTrack && screenFrames.length > 0) {
    let targetProgress = 0;
    let currentProgress = 0;
    let isLoopRunning = false;
    let currentActiveIndex = -1;

    // Cálculo do progresso no scroll
    const updateTargetProgress = () => {
      const rect = explodedTrack.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      targetProgress = progress;

      if (!isLoopRunning) {
        isLoopRunning = true;
        requestAnimationFrame(renderLoop);
      }
    };

    const renderLoop = () => {
      // Interpolação Linear Suave (LERP 0.052) para inércia mais suave e cinematográfica
      currentProgress += (targetProgress - currentProgress) * 0.052;

      const delta = Math.abs(targetProgress - currentProgress);
      if (delta < 0.00005) {
        currentProgress = targetProgress;
      }

      // Progresso mapeado no universo das 4 telas (0 a 3)
      const p = Math.min(3, Math.max(0, currentProgress * 3));
      const isMobile = window.innerWidth <= 768;

      // Dinâmica de Perspectiva 3D suave (rotateX, rotateY e escala dinâmicos)
      if (scrollyScene) {
        if (!isMobile) {
          const baseRotX = 6.5 - currentProgress * 2;
          const dynRotX = baseRotX + Math.sin(currentProgress * Math.PI * 4) * 2.5;
          const dynRotY = -4.5 + Math.cos(currentProgress * Math.PI * 3) * 4.5;
          const dynScale = 1.0 - Math.abs(Math.sin(currentProgress * Math.PI * 3)) * 0.025;
          scrollyScene.style.transform = `rotateX(${dynRotX.toFixed(2)}deg) rotateY(${dynRotY.toFixed(2)}deg) scale(${dynScale.toFixed(3)})`;
        } else {
          const dynRotX = 2.5 + Math.sin(currentProgress * Math.PI * 3) * 1.2;
          const dynRotY = Math.cos(currentProgress * Math.PI * 2) * 1.8;
          scrollyScene.style.transform = `rotateX(${dynRotX.toFixed(2)}deg) rotateY(${dynRotY.toFixed(2)}deg)`;
        }
      }

      // ----------------------------------------------------------------------
      // Ritmo e Permanência das 4 Telas Reais:
      // - Primeiros 80% de cada etapa: tela 100% nítida e focada para leitura
      // - Últimos 20% de cada etapa: zoom-in suave + blur progressivo para revelar a próxima
      // ----------------------------------------------------------------------
      const baseIdx = Math.min(2, Math.floor(p));
      const stepFraction = p >= 3 ? 0 : (p - baseIdx); // Fração dentro da etapa (0.0 a 1.0)
      let activeIndex = baseIdx;

      if (p >= 3) {
        // Estágio final: Tela 4 (índice 3) 100% focada e em repouso
        activeIndex = 3;
        screenFrames.forEach((frame, idx) => {
          if (idx === 3) {
            frame.style.display = 'flex';
            frame.style.opacity = '1';
            frame.style.transform = 'translate3d(0, 0, 0) scale(1)';
            frame.style.filter = 'blur(0px)';
            frame.style.zIndex = '10';
            frame.classList.add('active');
          } else {
            frame.style.display = 'none';
            frame.style.opacity = '0';
            frame.classList.remove('active');
          }
        });

        captionCards.forEach((card, idx) => {
          if (idx === 3) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            card.classList.add('active');
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.classList.remove('active');
          }
        });

      } else if (stepFraction < 0.80) {
        // PRIMEIROS 80%: Tela baseIdx permanece 100% NÍTIDA, focada e sem distorção
        activeIndex = baseIdx;

        screenFrames.forEach((frame, idx) => {
          if (idx === baseIdx) {
            frame.style.display = 'flex';
            frame.style.opacity = '1';
            frame.style.transform = 'translate3d(0, 0, 0) scale(1)';
            frame.style.filter = 'blur(0px)';
            frame.style.zIndex = '10';
            frame.classList.add('active');
          } else {
            frame.style.display = 'none';
            frame.style.opacity = '0';
            frame.classList.remove('active');
          }
        });

        captionCards.forEach((card, idx) => {
          if (idx === baseIdx) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            card.classList.add('active');
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.classList.remove('active');
          }
        });

      } else {
        // ÚLTIMOS 20%: Janela de transição cinematográfica entre baseIdx e baseIdx + 1
        const t = (stepFraction - 0.80) / 0.20; // 0.0 a 1.0 durante os 20% finais
        const smoothT = t * t * (3 - 2 * t);   // Curva Smoothstep suave
        const nextIdx = baseIdx + 1;
        activeIndex = smoothT >= 0.5 ? nextIdx : baseIdx;

        screenFrames.forEach((frame, idx) => {
          if (idx === baseIdx) {
            // Tela atual saindo: zoom-in suave + blur progressivo + fade-out
            const scale = 1.0 + smoothT * 0.22;
            const blur = smoothT * 16;
            const opacity = Math.max(0, 1 - smoothT * 1.15);
            const translateZ = smoothT * 75;

            frame.style.display = opacity <= 0.001 ? 'none' : 'flex';
            frame.style.opacity = opacity.toFixed(3);
            frame.style.transform = `translate3d(0, 0, ${translateZ.toFixed(1)}px) scale(${scale.toFixed(3)})`;
            frame.style.filter = `blur(${blur.toFixed(1)}px)`;
            frame.style.zIndex = '10';
            frame.classList.toggle('active', smoothT < 0.5);

          } else if (idx === nextIdx) {
            // Próxima tela entrando: foco progressivo + escala vindo de 0.90 para 1.0
            const scale = 0.90 + smoothT * 0.10;
            const blur = (1 - smoothT) * 14;
            const opacity = Math.min(1, smoothT * 1.15);
            const translateZ = (smoothT - 1) * 45;

            frame.style.display = opacity <= 0.001 ? 'none' : 'flex';
            frame.style.opacity = opacity.toFixed(3);
            frame.style.transform = `translate3d(0, 0, ${translateZ.toFixed(1)}px) scale(${scale.toFixed(3)})`;
            frame.style.filter = `blur(${blur.toFixed(1)}px)`;
            frame.style.zIndex = '11';
            frame.classList.toggle('active', smoothT >= 0.5);

          } else {
            frame.style.display = 'none';
            frame.style.opacity = '0';
            frame.classList.remove('active');
          }
        });

        // Transição suave correspondente nos cards de legenda
        captionCards.forEach((card, idx) => {
          if (idx === baseIdx) {
            const cardOpacity = Math.max(0, 1 - smoothT * 1.25);
            const cardY = -smoothT * 16;
            const cardScale = 1 - smoothT * 0.03;
            card.style.display = cardOpacity <= 0.001 ? 'none' : 'flex';
            card.style.opacity = cardOpacity.toFixed(3);
            card.style.transform = `translateY(${cardY.toFixed(1)}px) scale(${cardScale.toFixed(3)})`;
            card.classList.toggle('active', smoothT < 0.5);

          } else if (idx === nextIdx) {
            const cardOpacity = Math.min(1, smoothT * 1.25);
            const cardY = (1 - smoothT) * 16;
            const cardScale = 0.97 + smoothT * 0.03;
            card.style.display = cardOpacity <= 0.001 ? 'none' : 'flex';
            card.style.opacity = cardOpacity.toFixed(3);
            card.style.transform = `translateY(${cardY.toFixed(1)}px) scale(${cardScale.toFixed(3)})`;
            card.classList.toggle('active', smoothT >= 0.5);

          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.classList.remove('active');
          }
        });
      }

      // Atualização dos Stepper Buttons
      stepButtons.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === activeIndex);
      });

      // Atualização do Indicador de Status Dinâmico
      if (statusText && statusLabels[activeIndex]) {
        statusText.textContent = statusLabels[activeIndex];
      }

      // Linha de progresso visual contínua
      if (progressFill) {
        progressFill.style.width = `${(currentProgress * 100).toFixed(1)}%`;
      }

      // Dispara a contagem progressiva dos números da legenda recém-ativada
      if (activeIndex !== currentActiveIndex) {
        currentActiveIndex = activeIndex;
        const activeCard = captionCards[activeIndex];
        if (activeCard) {
          const counters = activeCard.querySelectorAll('[data-counter]');
          counters.forEach(c => animateCountUp(c));
        }
      }

      if (delta >= 0.00005) {
        requestAnimationFrame(renderLoop);
      } else {
        isLoopRunning = false;
      }
    };

    window.addEventListener('scroll', updateTargetProgress, { passive: true });
    window.addEventListener('resize', updateTargetProgress, { passive: true });

    // Navegação interativa com inércia suave ao clicar nos botões do Stepper
    stepButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.getAttribute('data-step') || '0', 10);
        const rect = explodedTrack.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        // Posiciona no centro da fase de permanência nítida (40% dentro da etapa)
        const targetP = step === 3 ? 3.0 : (step + 0.40);
        const targetScroll = window.scrollY + rect.top + (targetP / 3.0) * scrollable;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      });
    });

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
