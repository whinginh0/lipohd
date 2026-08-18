/**
 * ============================================================
 * GERADOR DE CERTIFICADO OFICIAL — MOTOR JAVASCRIPT
 * ============================================================
 * 
 * Este arquivo renderiza o nome do aluno, a data e a assinatura
 * de forma 100% dinâmica sobre a imagem do certificado utilizando
 * a API Canvas 2D em resolução nativa (crystal-clear).
 * 
 * ⚙️ CONFIGURAÇÕES PRINCIPAIS (+100 Mapas Mentais Lipo HD):
 */

const CERT_CONFIG = {
  // 1. Caminho da Imagem Base do Certificado
  imageSrc: 'img/certificado.webp',

  // 2. Chave de Armazenamento Local (exclusiva para Lipo HD)
  storageKey: 'cert_data_lipohd_v1',

  // 3. Configurações de Renderização do Nome do Aluno ("Nome completo: ____________________")
  name: {
    xPosition: 745,       // Centralizado no meio exato do certificado (alinhado com o texto e título)
    yPosition: 660,       // Posicionado limpo e nítido acima da linha
    maxAllowedWidth: 860, // Largura máxima antes de reduzir a fonte
    initialFontSize: 32,  // Tamanho da fonte padrão
    minFontSize: 18,      // Tamanho mínimo para nomes longos
    fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
    fontWeight: '700',
    color: '#013E4B'      // Deep navy teal combinando com a identidade Lipo HD
  },

  // 4. Configurações da Data de Conclusão ("Data: ____________________")
  date: {
    xPosition: 440,       // Centro da linha de data (100% aprovado)
    yPosition: 896,       // Posição Y perfeita sobre o traço
    fontSize: 19,
    fontFamily: "'Poppins', system-ui, sans-serif",
    fontWeight: '600',
    color: '#014E5E'
  },

  // 5. Configurações da Assinatura Oficial (Após a palavra "Assinatura:")
  signature: {
    text: 'Equipe Lipo HD',
    xPosition: 1035,      // Deslocado para a direita para ficar no traço após "Assinatura:" e antes do selo
    yPosition: 892,       // Posicionado acima do traço
    fontSize: 19,         // Tamanho reduzido e proporcional para caber com elegância no campo
    fontFamily: "'Dancing Script', 'Alex Brush', cursive",
    fontWeight: '600',
    color: '#013E4B'
  }
};

(function () {
  'use strict';

  // Elements
  const formBox = document.getElementById('formBox');
  const alreadyBox = document.getElementById('alreadyBox');
  const certForm = document.getElementById('certForm');
  const nameInput = document.getElementById('nameInput');
  const submitBtn = document.getElementById('submitBtn');
  const certModal = document.getElementById('certModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const certPreviewImg = document.getElementById('certPreviewImg');
  const certLoading = document.getElementById('certLoading');

  // Display elements
  const savedNameEl = document.getElementById('savedName');
  const savedDateEl = document.getElementById('savedDate');
  const savedCodeEl = document.getElementById('savedCode');
  const printImgEl = document.getElementById('printImg');

  // Buttons
  const downloadBtns = document.querySelectorAll('.js-download-btn');
  const printBtns = document.querySelectorAll('.js-print-btn');
  const openModalBtns = document.querySelectorAll('.js-open-modal-btn');

  // Hidden Canvas
  const canvas = document.getElementById('certCanvas');
  const ctx = canvas.getContext('2d');

  let baseImage = null;
  let currentCertData = null;

  // Format today's date: DD/MM/AAAA
  function getFormattedDate(dateObj) {
    const d = dateObj || new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Generate unique verification code
  function generateAuthCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'LHD-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code += '-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Candidate image paths for robustness across all routing setups (/certificado, /certificado/, /certificado.html)
  const candidateImagePaths = [
    CERT_CONFIG.imageSrc,
    'img/certificado.webp',
    './img/certificado.webp',
    '/certificado/img/certificado.webp',
    'certificado/img/certificado.webp',
    'assets/img/certificado.webp',
    '/assets/img/certificado.webp'
  ];

  function tryLoadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load from ${src}`));
      img.src = src;
    });
  }

  // Preload base certificate image with automatic fallback
  async function preloadImage() {
    for (const src of candidateImagePaths) {
      try {
        const img = await tryLoadImage(src);
        if (img && (img.naturalWidth || img.width) > 0) {
          return img;
        }
      } catch (err) {
        // try next candidate
      }
    }
    throw new Error('Falha ao carregar imagem do certificado.');
  }

  // Render certificate to canvas and return Data URL
  async function renderCertificate(name, dateStr) {
    if (!baseImage) {
      baseImage = await preloadImage();
    }

    // Set canvas dimensions exactly equal to image resolution
    canvas.width = baseImage.naturalWidth || 1491;
    canvas.height = baseImage.naturalHeight || 1055;

    // Draw base certificate
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Wait for custom Google fonts to load
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // continue
      }
    }

    // 1. Draw Participant Name (Centered on the underline after "Nome completo:")
    const nameX = CERT_CONFIG.name.xPosition || (canvas.width / 2);
    const nameY = CERT_CONFIG.name.yPosition;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let fontSize = CERT_CONFIG.name.initialFontSize;
    ctx.font = `${CERT_CONFIG.name.fontWeight} ${fontSize}px ${CERT_CONFIG.name.fontFamily}`;

    while (ctx.measureText(name).width > CERT_CONFIG.name.maxAllowedWidth && fontSize > CERT_CONFIG.name.minFontSize) {
      fontSize -= 1;
      ctx.font = `${CERT_CONFIG.name.fontWeight} ${fontSize}px ${CERT_CONFIG.name.fontFamily}`;
    }

    ctx.fillStyle = CERT_CONFIG.name.color;
    ctx.fillText(name, nameX, nameY);

    // 2. Draw Emission Date (Centered on the underline after "Data:")
    ctx.font = `${CERT_CONFIG.date.fontWeight} ${CERT_CONFIG.date.fontSize}px ${CERT_CONFIG.date.fontFamily}`;
    ctx.fillStyle = CERT_CONFIG.date.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateStr, CERT_CONFIG.date.xPosition, CERT_CONFIG.date.yPosition);

    // 3. Draw Official Team Signature (Centered on the underline after "Assinatura:")
    ctx.font = `${CERT_CONFIG.signature.fontWeight} ${CERT_CONFIG.signature.fontSize}px ${CERT_CONFIG.signature.fontFamily}`;
    ctx.fillStyle = CERT_CONFIG.signature.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(CERT_CONFIG.signature.text, CERT_CONFIG.signature.xPosition, CERT_CONFIG.signature.yPosition);

    return canvas.toDataURL('image/png', 1.0);
  }

  // Show Certificate Modal
  function openModal() {
    if (certModal) {
      certModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close Certificate Modal
  function closeModal() {
    if (certModal) {
      certModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Download certificate PNG
  function downloadPNG() {
    if (!currentCertData || !currentCertData.dataUrl) return;

    const link = document.createElement('a');
    const safeName = (currentCertData.name || 'Certificado')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim();

    link.download = `Certificado - ${safeName}.png`;
    link.href = currentCertData.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Print certificate cleanly in 1-page landscape
  function printCertificate() {
    if (!currentCertData || !currentCertData.dataUrl) return;

    if (printImgEl) {
      printImgEl.src = currentCertData.dataUrl;
    }

    try {
      let printIframe = document.getElementById('certPrintIframe');
      if (!printIframe) {
        printIframe = document.createElement('iframe');
        printIframe.id = 'certPrintIframe';
        printIframe.style.position = 'fixed';
        printIframe.style.right = '0';
        printIframe.style.bottom = '0';
        printIframe.style.width = '0';
        printIframe.style.height = '0';
        printIframe.style.border = '0';
        printIframe.style.visibility = 'hidden';
        document.body.appendChild(printIframe);
      }

      const iframeDoc = printIframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificado - ${currentCertData.name || 'Conclusão'}</title>
            <style>
              @page {
                size: landscape;
                margin: 0;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background: #fff;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              img {
                width: 100vw;
                height: 100vh;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                display: block;
                margin: auto;
                page-break-inside: avoid;
              }
            </style>
          </head>
          <body>
            <img src="${currentCertData.dataUrl}" />
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        try {
          printIframe.contentWindow.focus();
          printIframe.contentWindow.print();
        } catch (e) {
          window.print();
        }
      }, 250);
    } catch (err) {
      window.print();
    }
  }

  // Update UI when certificate exists
  function setupAlreadyGeneratedUI(data) {
    currentCertData = data;
    formBox.classList.add('hidden');
    alreadyBox.classList.add('active');

    if (savedNameEl) savedNameEl.textContent = data.name;
    if (savedDateEl) savedDateEl.textContent = data.date;
    if (savedCodeEl) savedCodeEl.textContent = data.code || 'LHD-2026-OFIC';

    if (certPreviewImg && data.dataUrl) certPreviewImg.src = data.dataUrl;
    if (printImgEl && data.dataUrl) printImgEl.src = data.dataUrl;
  }

  // Form submission handler
  async function handleSubmit(e) {
    e.preventDefault();

    const rawName = nameInput.value.trim();
    if (!rawName || rawName.length < 3) {
      alert('Por favor, informe seu nome completo para emissão do certificado.');
      nameInput.focus();
      return;
    }

    // Capitalize names properly
    const formattedName = rawName
      .toLowerCase()
      .split(' ')
      .filter(w => w.length > 0)
      .map((word, idx) => {
        const lowerWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
        if (idx > 0 && lowerWords.includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    const dateStr = getFormattedDate();
    const code = generateAuthCode();

    try {
      submitBtn.disabled = true;
      if (certLoading) certLoading.style.display = 'flex';

      const dataUrl = await renderCertificate(formattedName, dateStr);

      const certData = {
        name: formattedName,
        date: dateStr,
        code: code,
        timestamp: new Date().toISOString(),
        dataUrl: dataUrl
      };

      // Save lightweight metadata to localStorage
      try {
        const toPersist = {
          name: formattedName,
          date: dateStr,
          code: code,
          timestamp: certData.timestamp
        };
        localStorage.setItem(CERT_CONFIG.storageKey, JSON.stringify(toPersist));
      } catch (err) {
        console.error('Storage error:', err);
      }

      setupAlreadyGeneratedUI(certData);
      if (certLoading) certLoading.style.display = 'none';

      // Open result modal
      openModal();
    } catch (err) {
      console.error('Erro ao gerar certificado:', err);
      alert('Houve um erro ao processar o certificado. Por favor, tente novamente.');
      if (certLoading) certLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  }

  // Initialize Page
  async function init() {
    // Check localStorage
    let saved = null;
    try {
      const stored = localStorage.getItem(CERT_CONFIG.storageKey);
      if (stored) {
        saved = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored certificate:', e);
    }

    if (saved && saved.name) {
      formBox.classList.add('hidden');
      alreadyBox.classList.add('active');
      if (savedNameEl) savedNameEl.textContent = saved.name;
      if (savedDateEl) savedDateEl.textContent = saved.date || getFormattedDate();
      if (savedCodeEl) savedCodeEl.textContent = saved.code || 'LHD-2026-OFIC';

      renderCertificate(saved.name, saved.date || getFormattedDate()).then(dataUrl => {
        saved.dataUrl = dataUrl;
        setupAlreadyGeneratedUI(saved);
      }).catch(err => {
        console.error('Failed to pre-render stored cert:', err);
      });
    }

    // Event listeners
    if (certForm) certForm.addEventListener('submit', handleSubmit);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (certModal) {
      certModal.addEventListener('click', (e) => {
        if (e.target === certModal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal && certModal.classList.contains('open')) {
        closeModal();
      }
    });

    downloadBtns.forEach(btn => btn.addEventListener('click', downloadPNG));
    printBtns.forEach(btn => btn.addEventListener('click', printCertificate));
    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));

    // Preload image in background
    preloadImage().then(img => {
      baseImage = img;
    }).catch(err => {
      console.warn('Preload warning:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
