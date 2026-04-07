/* === Presentation App === */

const PresentationApp = (() => {
  let windowState = null;
  let currentSlide = 0;
  let transitioning = false;
  let keyHandler = null;

  // Arrow SVGs
  const ARROW_LEFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
  const ARROW_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

  // --- Slide Definitions ---
  function getSlides() {
    const t = (key) => I18N.t(key);

    return [
      // Slide 1 - Title
      {
        className: 'pres-title-slide',
        render: () => `
          <div class="accent-line"></div>
          <h1>${t('s1.title')}</h1>
          <p class="subtitle">${t('s1.subtitle')}</p>
          <div class="pres-title-terminal">
            ${terminal('Warp', [
              { prompt: true, text: 'claude --version' },
              { output: true, text: 'Claude Code v1.0.0' },
              { prompt: true, text: '', cursor: true },
            ])}
          </div>
        `,
      },

      // Slide 2 - Agenda
      {
        render: () => `
          <div class="pres-slide-number">${t('s2.title')}</div>
          <h2>${t('s2.title')}</h2>
          <div class="accent-line"></div>
          <div class="pres-list">
            ${numberedItem(1, t('s2.i1'))}
            ${numberedItem(2, t('s2.i2'))}
            ${numberedItem(3, t('s2.i3'))}
            ${numberedItem(4, t('s2.i4'))}
            ${numberedItem(5, t('s2.i5'))}
            ${numberedItem(6, t('s2.i6'))}
            ${numberedItem(7, t('s2.i7'))}
            ${numberedItem(8, t('s2.i8'))}
          </div>
        `,
      },

      // Slide 3 - What is Warp
      {
        render: () => `
          <div class="pres-slide-number">01</div>
          <h2>${t('s3.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s3.desc')}</p>
          <div class="pres-cards">
            ${card(t('s3.f1.title'), t('s3.f1.desc'))}
            ${card(t('s3.f2.title'), t('s3.f2.desc'))}
            ${card(t('s3.f3.title'), t('s3.f3.desc'))}
          </div>
          <a class="pres-link" href="https://www.warp.dev" target="_blank" rel="noopener">
            warp.dev <span class="pres-link-arrow">--&gt;</span>
          </a>
        `,
      },

      // Slide 4 - Installing Warp
      {
        render: () => `
          <div class="pres-slide-number">02</div>
          <h2>${t('s4.title')}</h2>
          <div class="accent-line"></div>
          <div class="pres-list">
            ${numberedItem(1, t('s4.s1'))}
            ${numberedItem(2, t('s4.s2'))}
            ${numberedItem(3, t('s4.s3'))}
            ${numberedItem(4, t('s4.s4'))}
          </div>
          ${terminal('Warp', [
            { prompt: true, text: 'brew install --cask warp' },
            { output: true, text: '==> Downloading https://releases.warp.dev/stable/...' },
            { output: true, text: '==> Installing Cask warp' },
            { output: true, text: '==> Moving App \'Warp.app\' to \'/Applications/Warp.app\'' },
            { output: true, text: '==> warp was successfully installed!' },
          ])}
        `,
      },

      // Slide 5 - Claude Code
      {
        render: () => `
          <div class="pres-slide-number">03</div>
          <h2>${t('s5.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s5.desc')}</p>
          ${terminal('Warp', [
            { prompt: true, text: 'npm install -g @anthropic-ai/claude-code' },
            { output: true, text: 'added 1 package in 12s' },
            { prompt: true, text: 'claude --version' },
            { output: true, text: 'Claude Code v1.0.0' },
          ])}
          <p style="margin-top:12px; font-style:italic; color:var(--text-disabled);">${t('s5.alt')}</p>
        `,
      },

      // Slide 6 - Codex
      {
        render: () => `
          <div class="pres-slide-number">04</div>
          <h2>${t('s6.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s6.desc')}</p>
          ${terminal('Warp', [
            { prompt: true, text: 'npm install -g @openai/codex' },
            { output: true, text: 'added 1 package in 8s' },
            { prompt: true, text: 'codex --help' },
            { output: true, text: 'Usage: codex [options] [prompt]' },
            { output: true, text: '' },
            { output: true, text: 'Options:' },
            { output: true, text: '  -m, --model <model>   Model to use' },
            { output: true, text: '  -q, --quiet           Quiet mode' },
          ])}
        `,
      },

      // Slide 7 - Gemini CLI
      {
        render: () => `
          <div class="pres-slide-number">05</div>
          <h2>${t('s7.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s7.desc')}</p>
          ${terminal('Warp', [
            { prompt: true, text: 'npm install -g @google/gemini-cli' },
            { output: true, text: 'added 1 package in 10s' },
            { prompt: true, text: 'gemini --version' },
            { output: true, text: 'Gemini CLI v0.1.0' },
          ])}
        `,
      },

      // Slide 8 - Brave & Security
      {
        render: () => `
          <div class="pres-slide-number">06</div>
          <h2>${t('s8.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s8.desc')}</p>
          <div class="pres-cards">
            ${card(t('s8.f1.title'), t('s8.f1.desc'))}
            ${card(t('s8.f2.title'), t('s8.f2.desc'))}
            ${card(t('s8.f3.title'), t('s8.f3.desc'))}
          </div>
          <a class="pres-link" href="https://brave.com" target="_blank" rel="noopener">
            brave.com <span class="pres-link-arrow">--&gt;</span>
          </a>
        `,
      },

      // Slide 9 - Setting Up Claude Code
      {
        render: () => `
          <div class="pres-slide-number">07</div>
          <h2>${t('s9.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s9.desc')}</p>
          <div class="pres-list">
            ${numberedItem(1, t('s9.s1'))}
            ${numberedItem(2, t('s9.s2'))}
            ${numberedItem(3, t('s9.s3'))}
            ${numberedItem(4, t('s9.s4'))}
          </div>
          ${terminal('Warp', [
            { prompt: true, text: 'claude' },
            { output: true, text: 'Welcome to Claude Code!' },
            { output: true, text: '' },
            { output: true, text: 'To get started, authenticate your account:' },
            { output: true, text: 'Opening browser for authentication...' },
            { output: true, text: '' },
            { output: true, text: 'Authentication successful. You are now logged in.' },
          ])}
        `,
      },

      // Slide 10 - Using Docs for Auto Install
      {
        render: () => `
          <div class="pres-slide-number">08</div>
          <h2>${t('s10.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s10.desc')}</p>
          ${terminal('Warp Agent', [
            { prompt: true, text: 'Paste the documentation here and I will install everything for you' },
            { output: true, text: '' },
            { output: true, text: '[Pasted: Claude Code installation guide]' },
            { output: true, text: '' },
            { output: true, text: 'Reading documentation...' },
            { output: true, text: 'Step 1: Checking Node.js version... v20.11.0 OK' },
            { output: true, text: 'Step 2: Installing package... done' },
            { output: true, text: 'Step 3: Verifying installation... done' },
            { output: true, text: '' },
            { output: true, text: 'All steps completed successfully.' },
          ])}
          <p style="margin-top:12px; font-style:italic; color:var(--text-disabled);">${t('s10.example')}</p>
        `,
      },

      // Slide 11 - Creating Folders
      {
        render: () => `
          <div class="pres-slide-number">09</div>
          <h2>${t('s11.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s11.desc')}</p>
          ${terminal('Claude Code', [
            { prompt: true, text: 'Create a project structure with src, tests, and docs folders' },
            { output: true, text: '' },
            { output: true, text: 'Creating project structure...' },
            { output: true, text: '' },
            { output: true, text: 'mkdir -p src tests docs' },
            { output: true, text: 'touch src/index.js tests/index.test.js docs/README.md' },
            { output: true, text: '' },
            { output: true, text: 'Done. Created the following structure:' },
          ])}
          <div class="pres-tree">
            <div><span class="folder">project/</span></div>
            <div>&nbsp;&nbsp;<span class="folder">src/</span></div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="file">index.js</span></div>
            <div>&nbsp;&nbsp;<span class="folder">tests/</span></div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="file">index.test.js</span></div>
            <div>&nbsp;&nbsp;<span class="folder">docs/</span></div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="file">README.md</span></div>
          </div>
        `,
      },

      // Slide 12 - Excel Files
      {
        render: () => `
          <div class="pres-slide-number">10</div>
          <h2>${t('s12.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s12.desc')}</p>
          ${terminal('Claude Code', [
            { prompt: true, text: 'Create an Excel file with columns: Name, Hours, Department' },
            { output: true, text: '' },
            { output: true, text: 'Installing xlsx package...' },
            { output: true, text: 'Creating spreadsheet with columns: Name, Hours, Department' },
            { output: true, text: 'Adding sample data rows...' },
            { output: true, text: 'Applying formatting and auto-width...' },
            { output: true, text: '' },
            { output: true, text: 'Created: employee_hours.xlsx' },
            { output: true, text: '  - 3 columns, 10 rows with sample data' },
            { output: true, text: '  - Headers formatted in bold' },
          ])}
        `,
      },

      // Slide 13 - Reusable Commands
      {
        render: () => `
          <div class="pres-slide-number">11</div>
          <h2>${t('s13.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s13.desc')}</p>
          ${terminal('Warp', [
            { prompt: true, text: 'echo \'alias newproject="mkdir -p src tests docs && touch src/index.js"\' >> ~/.zshrc' },
            { output: true, text: '' },
            { prompt: true, text: 'source ~/.zshrc' },
            { output: true, text: '' },
            { prompt: true, text: 'newproject' },
            { output: true, text: '' },
            { prompt: true, text: 'ls' },
            { output: true, text: 'src/    tests/    docs/' },
          ])}
          <p style="margin-top:12px; font-style:italic; color:var(--text-disabled);">${t('s13.example')}</p>
        `,
      },

      // Slide 14 - Team Task
      {
        render: () => `
          <div class="pres-slide-number">12</div>
          <h2>${t('s14.title')}</h2>
          <div class="accent-line"></div>
          <p>${t('s14.desc')}</p>
          <div class="pres-checklist">
            ${checkItem(t('s14.t1'))}
            ${checkItem(t('s14.t2'), 'npm install -g @openai/codex')}
            ${checkItem(t('s14.t3'), 'npm install -g @anthropic-ai/claude-code')}
            ${checkItem(t('s14.t4'))}
            ${checkItem(t('s14.t5'))}
            ${checkItem(t('s14.t6'))}
          </div>
        `,
      },

      // Slide 15 - Resources
      {
        render: () => `
          <div class="pres-slide-number">13</div>
          <h2>${t('s15.title')}</h2>
          <div class="accent-line"></div>
          <div class="pres-list">
            ${bulletItem(`<strong>${t('s15.warp')}</strong> - <a class="pres-link" href="https://warp.dev" target="_blank" rel="noopener">warp.dev</a>`)}
            ${bulletItem(`<strong>${t('s15.claude')}</strong> - <a class="pres-link" href="https://docs.anthropic.com/en/docs/claude-code" target="_blank" rel="noopener">docs.anthropic.com</a>`)}
            ${bulletItem(`<strong>${t('s15.codex')}</strong> - <a class="pres-link" href="https://github.com/openai/codex" target="_blank" rel="noopener">github.com/openai/codex</a>`)}
            ${bulletItem(`<strong>${t('s15.gemini')}</strong> - <a class="pres-link" href="https://github.com/google-gemini/gemini-cli" target="_blank" rel="noopener">github.com/google-gemini/gemini-cli</a>`)}
            ${bulletItem(`<strong>${t('s15.brave')}</strong> - <a class="pres-link" href="https://brave.com" target="_blank" rel="noopener">brave.com</a>`)}
          </div>
          <p style="margin-top:24px;">${t('s15.desc')}</p>
        `,
      },

      // Slide 16 - End
      {
        className: 'pres-end-slide',
        render: () => `
          <div class="accent-line" style="margin-left:auto;margin-right:auto;"></div>
          <h1>${t('s16.title')}</h1>
          <p class="subtitle">${t('s16.subtitle')}</p>
        `,
      },
    ];
  }

  // --- Helpers ---

  function terminal(title, lines) {
    const body = lines.map(line => {
      if (line.prompt) {
        return `<span class="prompt">$ </span><span class="command">${line.text}</span>${line.cursor ? '<span class="cursor"></span>' : ''}`;
      }
      return `<span class="output">${line.text}</span>`;
    }).join('\n');

    return `
      <div class="pres-terminal">
        <div class="pres-terminal-bar">
          <span class="pres-terminal-dot red"></span>
          <span class="pres-terminal-dot yellow"></span>
          <span class="pres-terminal-dot green"></span>
          <span class="pres-terminal-title">${title}</span>
        </div>
        <div class="pres-terminal-body">${body}</div>
      </div>
    `;
  }

  function numberedItem(num, text) {
    return `<div class="pres-list-item"><span class="pres-list-num">${num}</span><span>${text}</span></div>`;
  }

  function bulletItem(html) {
    return `<div class="pres-list-item"><span class="pres-list-bullet"></span><span>${html}</span></div>`;
  }

  function card(title, desc) {
    return `<div class="pres-card"><div class="pres-card-title">${title}</div><div class="pres-card-desc">${desc}</div></div>`;
  }

  function checkItem(text, code) {
    const codeHtml = code ? ` <code>${code}</code>` : '';
    return `<div class="pres-check-item"><div class="pres-check-box"></div><span>${text}${codeHtml}</span></div>`;
  }

  // --- Core ---

  function launch() {
    // If already open, just focus
    const existing = WindowManager.get('presentation');
    if (existing) {
      if (existing.isMinimized) {
        WindowManager.restore('presentation');
      } else {
        WindowManager.focus('presentation');
      }
      return;
    }

    currentSlide = 0;

    windowState = WindowManager.create({
      id: 'presentation',
      titleKey: 'app.presentation',
      width: Math.min(960, window.innerWidth - 80),
      height: Math.min(640, window.innerHeight - 140),
      minWidth: 500,
      minHeight: 380,
      onClose: destroy,
    });

    OS.addToTaskbar('presentation');
    buildUI(windowState.contentEl);
    renderSlide(0);
    setupKeyboard();

    // Re-render on language change
    document.addEventListener('i18n:changed', onLangChange);
  }

  function destroy() {
    OS.removeFromTaskbar('presentation');
    if (keyHandler) {
      document.removeEventListener('keydown', keyHandler);
      keyHandler = null;
    }
    document.removeEventListener('i18n:changed', onLangChange);
    windowState = null;
  }

  function onLangChange() {
    if (!windowState) return;
    renderSlide(currentSlide, false);
    updateNav();
  }

  function buildUI(container) {
    container.innerHTML = `
      <div class="pres-container">
        <div class="pres-viewport" id="presViewport"></div>
        <div class="pres-nav">
          <button class="pres-nav-arrow" id="presPrev">${ARROW_LEFT}</button>
          <div class="pres-nav-center">
            <div class="pres-nav-dots" id="presDots"></div>
            <span class="pres-nav-counter" id="presCounter"></span>
          </div>
          <button class="pres-nav-arrow" id="presNext">${ARROW_RIGHT}</button>
        </div>
      </div>
    `;

    // Build dots
    const dotsEl = container.querySelector('#presDots');
    const slides = getSlides();
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'pres-nav-dot';
      dot.setAttribute('data-slide', i);
      dot.addEventListener('click', () => goToSlide(i));
      dotsEl.appendChild(dot);
    }

    // Nav buttons
    container.querySelector('#presPrev').addEventListener('click', prevSlide);
    container.querySelector('#presNext').addEventListener('click', nextSlide);
  }

  function renderSlide(index, animate = true) {
    const viewport = document.getElementById('presViewport');
    if (!viewport) return;

    const slides = getSlides();
    const slide = slides[index];

    if (animate && viewport.querySelector('.pres-slide.active')) {
      const direction = index > currentSlide ? 'left' : 'right';
      const oldSlide = viewport.querySelector('.pres-slide.active');

      // Animate out
      oldSlide.classList.remove('active');
      oldSlide.classList.add(direction === 'left' ? 'exit-to-left' : 'exit-to-right');

      // Create new slide
      const newSlide = createSlideElement(slide, index);
      newSlide.classList.add('active');
      newSlide.classList.add(direction === 'left' ? 'enter-from-right' : 'enter-from-left');
      viewport.appendChild(newSlide);

      transitioning = true;
      setTimeout(() => {
        oldSlide.remove();
        newSlide.classList.remove('enter-from-right', 'enter-from-left');
        transitioning = false;
      }, 350);
    } else {
      // No animation (initial render or language change)
      viewport.innerHTML = '';
      const newSlide = createSlideElement(slide, index);
      newSlide.classList.add('active');
      viewport.appendChild(newSlide);
    }

    currentSlide = index;
    updateNav();
  }

  function createSlideElement(slide, index) {
    const el = document.createElement('div');
    el.className = `pres-slide ${slide.className || ''}`;
    el.innerHTML = slide.render();
    return el;
  }

  function updateNav() {
    const slides = getSlides();
    const total = slides.length;
    const container = windowState?.contentEl;
    if (!container) return;

    // Counter
    const counter = container.querySelector('#presCounter');
    if (counter) {
      counter.textContent = `${currentSlide + 1} ${I18N.t('nav.of')} ${total}`;
    }

    // Dots
    const dots = container.querySelectorAll('.pres-nav-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // Arrows
    const prev = container.querySelector('#presPrev');
    const next = container.querySelector('#presNext');
    if (prev) prev.disabled = currentSlide === 0;
    if (next) next.disabled = currentSlide === total - 1;
  }

  function nextSlide() {
    if (transitioning) return;
    const slides = getSlides();
    if (currentSlide < slides.length - 1) {
      renderSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (transitioning) return;
    if (currentSlide > 0) {
      renderSlide(currentSlide - 1);
    }
  }

  function goToSlide(index) {
    if (transitioning || index === currentSlide) return;
    renderSlide(index);
  }

  function setupKeyboard() {
    keyHandler = (e) => {
      // Only handle if the presentation window is focused
      const win = document.getElementById('win-presentation');
      if (!win || !win.classList.contains('focused')) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(getSlides().length - 1);
      }
    };
    document.addEventListener('keydown', keyHandler);
  }

  return { launch, destroy };
})();
