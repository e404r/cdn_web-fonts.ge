(function () {
  'use strict';

  // Transliteration table for dual search (Georgian <-> Latin)
  const GEO_TO_LAT = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z',
    'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o',
    'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p',
    'ქ': 'k', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz',
    'წ': 'ts', 'ჭ': 'tch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
  };

  const LAT_TO_GEO = {
    'a': 'ა', 'b': 'ბ', 'g': 'გ', 'd': 'დ', 'e': 'ე', 'v': 'ვ', 'z': 'ზ',
    't': 'თ', 'i': 'ი', 'k': 'კ', 'l': 'ლ', 'm': 'მ', 'n': 'ნ', 'o': 'ო',
    'p': 'პ', 'r': 'რ', 's': 'ს', 'u': 'უ', 'q': 'ყ', 'j': 'ჯ', 'h': 'ჰ'
  };

  function transliterate(str, map) {
    return str.split('').map(char => map[char.toLowerCase()] || char).join('');
  }

  // Application State
  const state = {
    fonts: window.GEORGIAN_FONTS || [],
    searchQuery: '',
    categoryFilter: 'all',
    scriptFilter: 'all',
    customText: 'თითოეული ადამიანი იბადება თავისუფალი და თანასწორი...',
    fontSize: 28,
    cdnProvider: 'jsdelivr', // 'jsdelivr' | 'self'
    selectedSlugs: new Set(JSON.parse(localStorage.getItem('gwf_selected') || '[]')),
    loadedStyles: new Set(),
    activeModalFont: null,
    theme: localStorage.getItem('gwf_theme') || 'dark',
    siteFont: localStorage.getItem('gwf_site_font') || 'nino'
  };

  // DOM Elements Cache
  const el = {
    fontGrid: document.getElementById('fontGrid'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    customTextInput: document.getElementById('customTextInput'),
    fontSizeSlider: document.getElementById('fontSizeSlider'),
    fontSizeVal: document.getElementById('fontSizeVal'),
    fontSizeDecBtn: document.getElementById('fontSizeDecBtn'),
    fontSizeIncBtn: document.getElementById('fontSizeIncBtn'),
    siteFontSelect: document.getElementById('siteFontSelect'),
    statsCount: document.getElementById('statsCount'),
    totalFontsBadge: document.getElementById('totalFontsBadge'),
    cartBtn: document.getElementById('cartBtn'),
    cartCount: document.getElementById('cartCount'),
    drawerOverlay: document.getElementById('drawerOverlay'),
    drawerPanel: document.getElementById('drawerPanel'),
    drawerClose: document.getElementById('drawerClose'),
    selectedList: document.getElementById('selectedList'),
    emptyDrawer: document.getElementById('emptyDrawer'),
    combinedHtmlCode: document.getElementById('combinedHtmlCode'),
    combinedCssCode: document.getElementById('combinedCssCode'),
    combinedRulesCode: document.getElementById('combinedRulesCode'),
    combinedNpmCode: document.getElementById('combinedNpmCode'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    modalTitle: document.getElementById('modalTitle'),
    modalMetaBadges: document.getElementById('modalMetaBadges'),
    modalSlugSubtitle: document.getElementById('modalSlugSubtitle'),
    modalSelectBtn: document.getElementById('modalSelectBtn'),
    modalPreview: document.getElementById('modalPreview'),
    modalFontSizeSlider: document.getElementById('modalFontSizeSlider'),
    modalFontSizeVal: document.getElementById('modalFontSizeVal'),
    specFamily: document.getElementById('specFamily'),
    specWeight: document.getElementById('specWeight'),
    specScript: document.getElementById('specScript'),
    specCategory: document.getElementById('specCategory'),
    modalGlyphs: document.getElementById('modalGlyphs'),
    modalHtmlSnippet: document.getElementById('modalHtmlSnippet'),
    modalImportSnippet: document.getElementById('modalImportSnippet'),
    modalCssSnippet: document.getElementById('modalCssSnippet'),
    modalNpmSnippet: document.getElementById('modalNpmSnippet'),
    modalDownloadLinks: document.getElementById('modalDownloadLinks'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    toastContainer: document.getElementById('toastContainer')
  };

  // IntersectionObserver for lazy loading font stylesheets
  let fontObserver = null;
  if ('IntersectionObserver' in window) {
    fontObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const slug = card.dataset.slug;
          const cssFile = card.dataset.css;
          loadFontStylesheet(slug, cssFile);
          fontObserver.unobserve(card);
        }
      });
    }, { rootMargin: '300px 0px' });
  }

  // Generate public CDN URL for embeds and copy snippets
  function getFontCssUrl(slug, cssFile) {
    if (state.cdnProvider === 'self') {
      return `https://web-fonts.e404r.vip/fonts/${slug}/css/${cssFile}`;
    }
    return `https://cdn.jsdelivr.net/gh/e404r/cdn_web-fonts.ge@main/fonts/${slug}/css/${cssFile}`;
  }

  // Dynamically load font CSS file into document
  // On localhost, loads from local fonts/ folder for instant offline testing!
  function loadFontStylesheet(slug, cssFile) {
    if (state.loadedStyles.has(slug)) return;
    state.loadedStyles.add(slug);

    const link = document.createElement('link');
    link.rel = 'stylesheet';

    const isDirectHost = window.location.protocol === 'file:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('github.io') ||
      window.location.hostname.includes('web-fonts.ge') ||
      window.location.hostname.includes('e404r.vip');

    link.href = isDirectHost ? `fonts/${slug}/css/${cssFile}` : getFontCssUrl(slug, cssFile);
    link.dataset.fontSlug = slug;
    document.head.appendChild(link);
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="material-icons-round" style="color:var(--accent-secondary);font-size:20px;">check_circle</span>
      <span>${message}</span>
    `;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  // Copy to Clipboard with Button Animation
  async function copyToClipboard(text, btnElement, successMessage = 'კოპირებულია!') {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopyText(text);
      }

      showToast(successMessage);

      if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.classList.add('copied');
        btnElement.innerHTML = `<span class="material-icons-round" style="font-size:14px;">check</span> კოპირდა!`;
        setTimeout(() => {
          btnElement.classList.remove('copied');
          btnElement.innerHTML = originalHtml;
        }, 1400);
      }
    } catch (err) {
      fallbackCopyText(text);
      showToast(successMessage);
    }
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textarea);
  }

  // Filter & Search fonts
  function getFilteredFonts() {
    const query = state.searchQuery.trim().toLowerCase();
    const queryGeoToLat = transliterate(query, GEO_TO_LAT);
    const queryLatToGeo = transliterate(query, LAT_TO_GEO);

    return state.fonts.filter(font => {
      // Category filter
      if (state.categoryFilter !== 'all') {
        if (state.categoryFilter === 'BPG' && font.category !== 'BPG') return false;
        if (state.categoryFilter === 'ALK' && font.category !== 'ALK') return false;
        if (state.categoryFilter === 'Arial GEO' && font.category !== 'Arial GEO') return false;
        if (state.categoryFilter === 'DejaVu' && font.category !== 'DejaVu') return false;
        if (state.categoryFilter === 'Other' && ['BPG', 'ALK', 'Arial GEO', 'DejaVu'].includes(font.category)) return false;
      }

      // Script type filter
      if (state.scriptFilter !== 'all') {
        if (state.scriptFilter === 'Mtavruli' && font.scriptType !== 'Mtavruli') return false;
        if (state.scriptFilter === 'Mkhedruli' && font.scriptType !== 'Mkhedruli') return false;
      }

      // Search query filter (matches name, slug, category, Georgian transliteration)
      if (query) {
        const nameLower = font.name.toLowerCase();
        const slugLower = font.slug.toLowerCase();
        const catLower = font.category.toLowerCase();

        const matchDirect = nameLower.includes(query) || slugLower.includes(query) || catLower.includes(query);
        const matchGeoToLat = nameLower.includes(queryGeoToLat) || slugLower.includes(queryGeoToLat);
        const matchLatToGeo = nameLower.includes(queryLatToGeo) || slugLower.includes(queryLatToGeo);

        if (!matchDirect && !matchGeoToLat && !matchLatToGeo) {
          return false;
        }
      }

      return true;
    });
  }

  // Render font grid
  function renderGrid() {
    const filtered = getFilteredFonts();
    el.statsCount.textContent = `${filtered.length} / ${state.fonts.length}`;

    if (filtered.length === 0) {
      el.fontGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; color: var(--text-muted);">
          <div style="font-size: 44px; margin-bottom: 14px;">🔍</div>
          <h3 style="font-size: 19px; color: var(--text-primary); margin-bottom: 8px;">ფონტი ვერ მოიძებნა</h3>
          <p>სცადეთ სხვა საძიებო სიტყვა (მაგ. BPG, ALK, glaho, გლახო) ან მოხსენით ფილტრები.</p>
        </div>
      `;
      return;
    }

    el.fontGrid.innerHTML = filtered.map(font => {
      const isSelected = state.selectedSlugs.has(font.slug);
      const catClass = font.category === 'BPG' ? 'cat-bpg' : (font.category === 'ALK' ? 'cat-alk' : '');
      const formatPills = (font.formats || []).includes('woff2') ? '<span class="badge-tag format-tag">WOFF2</span>' : '<span class="badge-tag format-tag">TTF</span>';

      return `
        <article class="font-card ${isSelected ? 'selected' : ''}" data-slug="${font.slug}" data-css="${font.cssFile}">
          <div class="card-top">
            <div class="font-info">
              <span class="font-name" data-action="details" data-slug="${font.slug}" title="დეტალების და გლიფების ნახვა">${font.name}</span>
              <div class="font-badges">
                <span class="badge-tag ${catClass}">${font.category}</span>
                <span class="badge-tag">${font.scriptType}</span>
                ${font.weight !== 'Regular' ? `<span class="badge-tag">${font.weight}</span>` : ''}
                ${formatPills}
              </div>
            </div>
            <button class="btn-select-font" data-action="select" data-slug="${font.slug}" title="${isSelected ? 'არჩევის გაუქმება' : 'კალათაში დამატება'}">
              ${isSelected ? '<span class="material-icons-round" style="font-size:16px;">check</span> არჩეულია' : '<span class="material-icons-round" style="font-size:16px;">add</span> არჩევა'}
            </button>
          </div>

          <div class="card-preview" 
               style="font-family: '${font.name}', sans-serif; font-size: ${state.fontSize}px;" 
               contenteditable="true" 
               spellcheck="false"
               title="დააჭირეთ პირდაპირ რედაქტირებისთვის">
            ${escapeHtml(state.customText)}
          </div>

          <div class="card-bottom">
            <div class="quick-copy-group">
              <button class="btn-copy" data-action="copy-link" data-slug="${font.slug}" data-css="${font.cssFile}" title="HTML <link> კოპირება">
                <span class="material-icons-round" style="font-size:14px;">link</span>
                <span>&lt;link&gt;</span>
              </button>
              <button class="btn-copy" data-action="copy-import" data-slug="${font.slug}" data-css="${font.cssFile}" title="CSS @import კოპირება">
                <span class="material-icons-round" style="font-size:14px;">code</span>
                <span>@import</span>
              </button>
              <button class="btn-copy" data-action="copy-css" data-font="${font.name}" title="font-family კოდის კოპირება">
                <span class="material-icons-round" style="font-size:14px;">css</span>
                <span>CSS</span>
              </button>
            </div>
            <button class="btn-details" data-action="details" data-slug="${font.slug}" title="სრული ანბანი და გლიფები">
              <span>გლიფები</span>
              <span class="material-icons-round" style="font-size:16px;">arrow_forward</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Observe cards for lazy loading
    if (fontObserver) {
      document.querySelectorAll('.font-card').forEach(card => fontObserver.observe(card));
    } else {
      // Fallback
      filtered.slice(0, 24).forEach(f => loadFontStylesheet(f.slug, f.cssFile));
    }
  }

  // HTML escape helper
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Drawer / Multi-Select Management
  function updateDrawer() {
    const selectedCount = state.selectedSlugs.size;
    el.cartCount.textContent = selectedCount;

    localStorage.setItem('gwf_selected', JSON.stringify(Array.from(state.selectedSlugs)));

    if (selectedCount === 0) {
      el.emptyDrawer.style.display = 'block';
      el.selectedList.innerHTML = '';
      el.combinedHtmlCode.textContent = '<!-- არცერთი ფონტი არ არის არჩეული -->';
      el.combinedCssCode.textContent = '/* არცერთი ფონტი არ არის არჩეული */';
      el.combinedRulesCode.textContent = '/* არცერთი ფონტი არ არის არჩეული */';
      if (el.combinedNpmCode) el.combinedNpmCode.textContent = '# არცერთი ფონტი არ არის არჩეული';
      return;
    }

    el.emptyDrawer.style.display = 'none';

    const selectedFonts = state.fonts.filter(f => state.selectedSlugs.has(f.slug));

    // Render tag chips
    el.selectedList.innerHTML = selectedFonts.map(f => `
      <div class="selected-item-tag">
        <span>${f.name}</span>
        <button class="remove-item-btn" data-action="remove-selected" data-slug="${f.slug}" title="წაშლა">
          <span class="material-icons-round" style="font-size:16px;">close</span>
        </button>
      </div>
    `).join('');

    // Generate combined HTML snippets
    const htmlSnippets = selectedFonts.map(f => `<link rel="stylesheet" href="${getFontCssUrl(f.slug, f.cssFile)}">`).join('\n');
    el.combinedHtmlCode.textContent = htmlSnippets;

    // Generate combined CSS @import snippets
    const cssSnippets = selectedFonts.map(f => `@import url('${getFontCssUrl(f.slug, f.cssFile)}');`).join('\n');
    el.combinedCssCode.textContent = cssSnippets;

    // Generate combined CSS usage rules
    const rulesSnippets = selectedFonts.map(f => `/* ${f.name} */\n.font-${f.slug} {\n  font-family: '${f.name}', sans-serif;\n}`).join('\n\n');
    el.combinedRulesCode.textContent = rulesSnippets;

    // Generate combined NPM imports
    if (el.combinedNpmCode) {
      const npmImports = selectedFonts.map(f => `import 'georgian-fonts/fonts/${f.slug}/css/${f.cssFile}';`).join('\n');
      el.combinedNpmCode.textContent = `# 1. დააინსტალეთ პაკეტი:\nnpm install georgian-fonts\n# ან: pnpm add georgian-fonts\n\n// 2. იმპორტი თქვენს Angular / Vue / React / Vite / Next.js პროექტში:\n${npmImports}`;
    }
  }

  function toggleFontSelect(slug) {
    if (state.selectedSlugs.has(slug)) {
      state.selectedSlugs.delete(slug);
    } else {
      state.selectedSlugs.add(slug);
    }
    updateDrawer();
    renderGrid();
  }

  // Open Details Modal (Upgraded with Tabs, Specs, Interactive Glyphs, and Downloads)
  function openDetailsModal(slug) {
    const font = state.fonts.find(f => f.slug === slug);
    if (!font) return;

    state.activeModalFont = font;
    loadFontStylesheet(font.slug, font.cssFile);

    // Header info
    el.modalTitle.textContent = font.name;
    const catClass = font.category === 'BPG' ? 'cat-bpg' : (font.category === 'ALK' ? 'cat-alk' : '');
    const formatPills = (font.formats || []).includes('woff2')
      ? '<span class="badge-tag format-tag">WOFF2</span>'
      : '<span class="badge-tag format-tag">TTF</span>';

    el.modalMetaBadges.innerHTML = `
      <span class="badge-tag ${catClass}">${font.category}</span>
      <span class="badge-tag">${font.scriptType}</span>
      ${font.weight !== 'Regular' ? `<span class="badge-tag">${font.weight}</span>` : ''}
      ${formatPills}
    `;

    if (el.modalSlugSubtitle) {
      el.modalSlugSubtitle.textContent = `fonts/${font.slug}/css/${font.cssFile}`;
    }

    // Modal select button state
    if (el.modalSelectBtn) {
      const isSelected = state.selectedSlugs.has(font.slug);
      el.modalSelectBtn.classList.toggle('selected', isSelected);
      el.modalSelectBtn.innerHTML = isSelected
        ? '<span class="material-icons-round">check</span> <span>არჩეულია</span>'
        : '<span class="material-icons-round">add</span> <span>არჩევა</span>';
    }

    // Tab 1: Specs
    if (el.specFamily) el.specFamily.textContent = font.name;
    if (el.specWeight) el.specWeight.textContent = font.weight || 'Regular';
    if (el.specScript) el.specScript.textContent = font.scriptType || 'Mkhedruli';
    if (el.specCategory) el.specCategory.textContent = font.category;

    // Tab 1: Preview box
    if (el.modalPreview) {
      el.modalPreview.style.fontFamily = `'${font.name}', sans-serif`;
      el.modalPreview.style.fontSize = '36px';
    }
    if (el.modalFontSizeSlider) el.modalFontSizeSlider.value = 36;
    if (el.modalFontSizeVal) el.modalFontSizeVal.textContent = '36px';

    // Tab 2: Glyphs (Categorized: mkhedruli, mtavruli, latin, digits)
    const glyphData = [
      ...'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ'.split('').map(c => ({ char: c, cat: 'mkhedruli' })),
      ...'ႠႡႢႣႤႥႦႧႨႩႪႫႬႭႮႯႰႱႲႳႴႵႶႷႸႹႺႻႼႽႾႿჀ'.split('').map(c => ({ char: c, cat: 'mtavruli' })),
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('').map(c => ({ char: c, cat: 'latin' })),
      ...'0123456789₾$€%№!@#&*()?+=-/.,:;'.split('').map(c => ({ char: c, cat: 'digits' }))
    ];

    if (el.modalGlyphs) {
      el.modalGlyphs.innerHTML = glyphData.map(g => `
        <div class="glyph-item" data-char="${g.char}" data-cat="${g.cat}" style="font-family: '${font.name}', sans-serif;" title="დააჭირეთ კოპირებისთვის: ${g.char}">
          <span>${g.char}</span>
        </div>
      `).join('');
    }

    // Reset glyph filter to 'all'
    document.querySelectorAll('.glyph-filter-chip').forEach(c => c.classList.toggle('active', c.dataset.glyphCat === 'all'));

    // Tab 3: Integration code snippets
    const htmlSnippet = `<link rel="stylesheet" href="${getFontCssUrl(font.slug, font.cssFile)}">`;
    const importSnippet = `@import url('${getFontCssUrl(font.slug, font.cssFile)}');`;
    const cssSnippet = `/* ${font.name} */\n.font-${font.slug} {\n  font-family: '${font.name}', sans-serif;\n}`;
    const npmSnippet = `# 1. დააინსტალეთ პაკეტი:\nnpm install georgian-fonts\n# ან pnpm / yarn:\npnpm add georgian-fonts\n\n// 2. დააიმპორტეთ თქვენს Angular / React / Next.js / Vite ფაილში (მაგ. styles.scss / main.js / _app.js):\nimport 'georgian-fonts/fonts/${font.slug}/css/${font.cssFile}';\n\n/* 3. გამოიყენეთ CSS-ში: */\nbody {\n  font-family: '${font.name}', sans-serif;\n}`;

    if (el.modalHtmlSnippet) el.modalHtmlSnippet.textContent = htmlSnippet;
    if (el.modalImportSnippet) el.modalImportSnippet.textContent = importSnippet;
    if (el.modalCssSnippet) el.modalCssSnippet.textContent = cssSnippet;
    if (el.modalNpmSnippet) el.modalNpmSnippet.textContent = npmSnippet;

    // Tab 4: Direct Download cards
    const baseUrl = `https://raw.githubusercontent.com/e404r/cdn_web-fonts.ge/main/fonts/${font.slug}/fonts/`;
    const formatDescriptions = {
      woff2: 'თანამედროვე ვებისთვის — უმაღლესი ხარისხის შეკუმშვა და სისწრაფე.',
      woff: 'სტანდარტული ვებ-ფონტი — სრული თავსებადობა ყველა ბრაუზერთან.',
      ttf: 'TrueType ფორმატი — დესკტოპ ინსტალაციისთვის (Figma, Photoshop) და ვებისთვის.',
      eot: 'Embedded OpenType — ძველი Internet Explorer ბრაუზერებისთვის.',
      svg: 'Scalable Vector Graphics — ვექტორული გლიფები ძველი მობილური მოწყობილობებისთვის.'
    };

    if (el.modalDownloadLinks) {
      el.modalDownloadLinks.innerHTML = (font.formats || []).map(fmt => `
        <div class="download-card">
          <div class="download-card-top">
            <span class="download-format-pill">.${fmt.toUpperCase()}</span>
            <span class="badge-tag">ვექტორული</span>
          </div>
          <p class="download-card-desc">${formatDescriptions[fmt] || 'ფონტის ფაილი'}</p>
          <a href="${baseUrl}${font.slug}-webfont.${fmt}" download="${font.slug}.${fmt}" class="download-btn">
            <span class="material-icons-round">download</span>
            <span>ჩამოტვირთვა (.${fmt.toUpperCase()})</span>
          </a>
        </div>
      `).join('');
    }

    // Reset active tab to 'preview'
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'preview'));
    document.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.toggle('active', p.id === 'tabPanePreview'));

    el.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    el.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openDrawer() {
    updateDrawer();
    el.drawerOverlay.classList.add('active');
    el.drawerPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    el.drawerOverlay.classList.remove('active');
    el.drawerPanel.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Update Font Size
  function setFontSize(newSize) {
    const size = Math.max(16, Math.min(64, parseInt(newSize, 10)));
    state.fontSize = size;
    el.fontSizeSlider.value = size;
    el.fontSizeVal.textContent = `${size}px`;

    document.querySelectorAll('.card-preview').forEach(preview => {
      preview.style.fontSize = `${size}px`;
    });
  }

  // Event Listeners Setup
  function initEvents() {
    // Search input
    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (el.searchClearBtn) {
        el.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
      }
      renderGrid();
    });

    if (el.searchClearBtn) {
      el.searchClearBtn.addEventListener('click', () => {
        el.searchInput.value = '';
        state.searchQuery = '';
        el.searchClearBtn.style.display = 'none';
        el.searchInput.focus();
        renderGrid();
      });
    }

    // Custom preview text input
    el.customTextInput.addEventListener('input', (e) => {
      state.customText = e.target.value || 'ქართული ვებ-ფონტები';
      document.querySelectorAll('.card-preview').forEach(p => {
        p.textContent = state.customText;
      });
    });

    // Font size slider & step buttons
    el.fontSizeSlider.addEventListener('input', (e) => {
      setFontSize(e.target.value);
    });

    if (el.fontSizeDecBtn) {
      el.fontSizeDecBtn.addEventListener('click', () => {
        setFontSize(state.fontSize - 2);
      });
    }

    if (el.fontSizeIncBtn) {
      el.fontSizeIncBtn.addEventListener('click', () => {
        setFontSize(state.fontSize + 2);
      });
    }

    // Site Font Selector (Dogfooding Georgian Web Fonts)
    if (el.siteFontSelect) {
      el.siteFontSelect.value = state.siteFont;
      document.documentElement.dataset.siteFont = state.siteFont;

      el.siteFontSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        state.siteFont = val;
        document.documentElement.dataset.siteFont = val;
        localStorage.setItem('gwf_site_font', val);
        showToast(`საიტის ფონტი შეიცვალა: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // CDN Provider switcher
    document.querySelectorAll('.cdn-switch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cdn-switch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.cdnProvider = btn.dataset.provider;
        updateDrawer();
        showToast(`CDN შეიცვალა: ${state.cdnProvider === 'jsdelivr' ? 'jsDelivr' : 'web-fonts.ge'}`);
      });
    });

    // Category & Script Filter Chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.dataset.category) {
          document.querySelectorAll('.filter-chip[data-category]').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          state.categoryFilter = chip.dataset.category;
        } else if (chip.dataset.script) {
          if (chip.classList.contains('active')) {
            chip.classList.remove('active');
            state.scriptFilter = 'all';
          } else {
            document.querySelectorAll('.filter-chip[data-script]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.scriptFilter = chip.dataset.script;
          }
        }
        renderGrid();
      });
    });

    // Preset Text Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.preset;
        state.customText = text;
        el.customTextInput.value = text;
        document.querySelectorAll('.card-preview').forEach(p => {
          p.textContent = text;
        });
      });
    });

    // Delegation on Font Grid (Click events for cards)
    el.fontGrid.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const slug = target.dataset.slug;
      const cssFile = target.dataset.css;

      if (action === 'select') {
        toggleFontSelect(slug);
      } else if (action === 'copy-link') {
        const url = getFontCssUrl(slug, cssFile);
        copyToClipboard(`<link rel="stylesheet" href="${url}">`, target, 'HTML <link> კოპირებულია!');
      } else if (action === 'copy-import') {
        const url = getFontCssUrl(slug, cssFile);
        copyToClipboard(`@import url('${url}');`, target, 'CSS @import კოპირებულია!');
      } else if (action === 'copy-css') {
        const fontName = target.dataset.font;
        copyToClipboard(`font-family: '${fontName}', sans-serif;`, target, 'font-family წესი კოპირებულია!');
      } else if (action === 'details') {
        openDetailsModal(slug);
      }
    });

    // Contenteditable input sync inside card
    el.fontGrid.addEventListener('input', (e) => {
      if (e.target.classList.contains('card-preview')) {
        state.customText = e.target.innerText;
        el.customTextInput.value = state.customText;
      }
    });

    // Drawer triggers
    el.cartBtn.addEventListener('click', openDrawer);
    el.drawerClose.addEventListener('click', closeDrawer);
    el.drawerOverlay.addEventListener('click', closeDrawer);

    // Modal triggers
    el.modalClose.addEventListener('click', closeModal);
    el.modalOverlay.addEventListener('click', (e) => {
      if (e.target === el.modalOverlay) closeModal();
    });

    // Remove selected item from drawer list
    el.selectedList.addEventListener('click', (e) => {
      const btn = e.target.closest('.remove-item-btn');
      if (btn) {
        toggleFontSelect(btn.dataset.slug);
      }
    });

    // Copy snippet buttons in drawer & modal
    document.querySelectorAll('.snippet-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          copyToClipboard(targetEl.textContent, btn, 'კოდი კოპირებულია!');
        }
      });
    });

    // Modal Tab Switching
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = document.getElementById('tabPane' + tab.charAt(0).toUpperCase() + tab.slice(1));
        if (pane) pane.classList.add('active');
      });
    });

    // Modal Preview Preset Chips
    document.querySelectorAll('.modal-preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.modal-preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (el.modalPreview) {
          el.modalPreview.textContent = chip.dataset.text;
        }
      });
    });

    // Modal Font Size Slider
    if (el.modalFontSizeSlider) {
      el.modalFontSizeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        if (el.modalFontSizeVal) el.modalFontSizeVal.textContent = `${val}px`;
        if (el.modalPreview) el.modalPreview.style.fontSize = `${val}px`;
      });
    }

    // Modal Select / Add to Cart Button
    if (el.modalSelectBtn) {
      el.modalSelectBtn.addEventListener('click', () => {
        if (!state.activeModalFont) return;
        toggleFontSelect(state.activeModalFont.slug);
        const isSelected = state.selectedSlugs.has(state.activeModalFont.slug);
        el.modalSelectBtn.classList.toggle('selected', isSelected);
        el.modalSelectBtn.innerHTML = isSelected
          ? '<span class="material-icons-round">check</span> <span>არჩეულია</span>'
          : '<span class="material-icons-round">add</span> <span>არჩევა</span>';
      });
    }

    // Glyphs Click-to-Copy
    if (el.modalGlyphs) {
      el.modalGlyphs.addEventListener('click', (e) => {
        const item = e.target.closest('.glyph-item');
        if (item && item.dataset.char) {
          const char = item.dataset.char;
          copyToClipboard(char, item, `სიმბოლო კოპირდა: ${char}`);
        }
      });
    }

    // Glyphs Filter Chips
    document.querySelectorAll('.glyph-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.glyph-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.glyphCat;
        document.querySelectorAll('#modalGlyphs .glyph-item').forEach(item => {
          if (cat === 'all' || item.dataset.cat === cat) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Theme toggle
    el.themeToggleBtn.addEventListener('click', () => {
      const newTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem('gwf_theme', newTheme);
      showToast(`თემა: ${newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Focus search with '/'
      if (e.key === '/' && document.activeElement !== el.searchInput && document.activeElement !== el.customTextInput) {
        e.preventDefault();
        el.searchInput.focus();
        el.searchInput.select();
      }
      // Close modal / drawer with Escape
      if (e.key === 'Escape') {
        closeModal();
        closeDrawer();
      }
    });
  }

  // Update Dynamic Counts (Total fonts badge & category chip counters)
  function updateCounters() {
    const total = state.fonts.length;
    const badge = el.totalFontsBadge || document.getElementById('totalFontsBadge') || document.querySelector('.badge-count');
    if (badge) {
      badge.textContent = `${total} ფონტი`;
    }

    const counts = {
      all: total,
      BPG: state.fonts.filter(f => f.category === 'BPG').length,
      ALK: state.fonts.filter(f => f.category === 'ALK').length,
      'Arial GEO': state.fonts.filter(f => f.category === 'Arial GEO').length,
      DejaVu: state.fonts.filter(f => f.category === 'DejaVu').length,
      Other: state.fonts.filter(f => !['BPG', 'ALK', 'Arial GEO', 'DejaVu'].includes(f.category)).length,
    };

    document.querySelectorAll('.filter-chip[data-category]').forEach(chip => {
      const cat = chip.dataset.category;
      const countEl = chip.querySelector('.chip-count');
      if (countEl && counts[cat] !== undefined) {
        countEl.textContent = counts[cat];
      }
    });
  }

  // Initialization
  function init() {
    // Restore theme
    document.documentElement.dataset.theme = state.theme;

    // Restore site font (Default is BPG Nino Mkhedruli)
    document.documentElement.dataset.siteFont = state.siteFont;
    if (el.siteFontSelect) {
      el.siteFontSelect.value = state.siteFont;
    }

    initEvents();
    updateCounters();
    renderGrid();
    updateDrawer();
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();