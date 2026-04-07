/* === OS Shell === */

const OS = (() => {
  // SVG Icons
  const ICONS = {
    presentation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
      <path d="M7 8h4"/>
      <path d="M7 11h6"/>
    </svg>`,
    browser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>`,
    terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <path d="M7 8l4 4-4 4"/>
      <path d="M13 16h4"/>
    </svg>`,
    files: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>`,
  };

  const TASKBAR_ICONS = {
    presentation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
    </svg>`,
  };

  // Desktop apps config
  const DESKTOP_APPS = [
    { id: 'presentation', icon: 'presentation', titleKey: 'app.presentation', launch: () => PresentationApp.launch() },
    { id: 'browser', icon: 'browser', titleKey: 'app.browser', launch: null },
    { id: 'terminal', icon: 'terminal', titleKey: 'app.terminal', launch: null },
    { id: 'files', icon: 'files', titleKey: 'app.files', launch: null },
  ];

  // Running apps for taskbar
  const runningApps = new Map();

  function init() {
    I18N.init();
    renderDesktopIcons();
    startClock();
    setupLanguageToggle();
    setupTaskbar();
  }

  function renderDesktopIcons() {
    const desktop = document.getElementById('osDesktop');
    desktop.innerHTML = '';

    DESKTOP_APPS.forEach(app => {
      const icon = document.createElement('div');
      icon.className = 'os-desktop-icon';
      icon.setAttribute('data-app-id', app.id);

      icon.innerHTML = `
        <div class="os-desktop-icon-img">${ICONS[app.icon]}</div>
        <span class="os-desktop-icon-label" data-i18n="${app.titleKey}">${I18N.t(app.titleKey)}</span>
      `;

      // Double-click to launch
      icon.addEventListener('dblclick', () => {
        if (app.launch) {
          icon.classList.add('launching');
          setTimeout(() => icon.classList.remove('launching'), 400);
          app.launch();
        }
      });

      // Single click to select
      icon.addEventListener('click', () => {
        desktop.querySelectorAll('.os-desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
      });

      desktop.appendChild(icon);
    });

    // Click desktop to deselect
    desktop.addEventListener('click', (e) => {
      if (e.target === desktop) {
        desktop.querySelectorAll('.os-desktop-icon').forEach(i => i.classList.remove('selected'));
      }
    });
  }

  function startClock() {
    const clockEl = document.getElementById('osClock');
    function updateClock() {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      clockEl.textContent = `${h}:${m}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  function setupLanguageToggle() {
    const btn = document.getElementById('langToggle');
    btn.addEventListener('click', () => {
      I18N.toggle();
      btn.textContent = I18N.t('os.lang.toggle');
    });
  }

  function setupTaskbar() {
    // Taskbar is populated when apps are launched/closed
  }

  function addToTaskbar(appId, iconSvg) {
    if (runningApps.has(appId)) return;

    const taskbar = document.getElementById('osTaskbar');
    const item = document.createElement('div');
    item.className = 'os-taskbar-item active';
    item.setAttribute('data-app-id', appId);
    item.innerHTML = `${iconSvg || TASKBAR_ICONS[appId] || ICONS[appId]}<div class="os-taskbar-item-dot"></div>`;

    item.addEventListener('click', () => {
      WindowManager.toggleWindow(appId);
    });

    taskbar.appendChild(item);
    runningApps.set(appId, item);
  }

  function removeFromTaskbar(appId) {
    const item = runningApps.get(appId);
    if (item) {
      item.remove();
      runningApps.delete(appId);
    }
  }

  // Listen for language changes to update desktop icons
  document.addEventListener('i18n:changed', () => {
    document.querySelectorAll('.os-desktop-icon-label[data-i18n]').forEach(el => {
      el.textContent = I18N.t(el.getAttribute('data-i18n'));
    });
  });

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    addToTaskbar,
    removeFromTaskbar,
  };
})();
