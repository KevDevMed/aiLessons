/* === Window Manager === */

const WindowManager = (() => {
  let windows = {};
  let zCounter = 100;
  const layer = () => document.getElementById('osWindowLayer');

  function create(config) {
    const {
      id,
      titleKey,
      width = 900,
      height = 600,
      minWidth = 400,
      minHeight = 300,
      onClose,
      onMinimize,
      onRestore,
    } = config;

    if (windows[id]) {
      focus(id);
      return windows[id];
    }

    // Create window element
    const win = document.createElement('div');
    win.className = 'os-window';
    win.id = `win-${id}`;
    win.style.width = `${width}px`;
    win.style.height = `${height}px`;

    // Center on screen
    const layerEl = layer();
    const layerRect = layerEl.getBoundingClientRect();
    const left = Math.max(20, (layerRect.width - width) / 2);
    const top = Math.max(20, (layerRect.height - height) / 2);
    win.style.left = `${left}px`;
    win.style.top = `${top}px`;

    // Title bar
    const titlebar = document.createElement('div');
    titlebar.className = 'os-window-titlebar';

    const controls = document.createElement('div');
    controls.className = 'os-window-controls';

    const btnClose = document.createElement('div');
    btnClose.className = 'os-window-control close';
    btnClose.title = 'Close';

    const btnMin = document.createElement('div');
    btnMin.className = 'os-window-control minimize';
    btnMin.title = 'Minimize';

    const btnMax = document.createElement('div');
    btnMax.className = 'os-window-control maximize';
    btnMax.title = 'Maximize';

    controls.append(btnClose, btnMin, btnMax);

    const title = document.createElement('div');
    title.className = 'os-window-title';
    title.setAttribute('data-i18n', titleKey);
    title.textContent = I18N.t(titleKey);

    // Spacer to balance the controls on the right
    const spacer = document.createElement('div');
    spacer.style.width = '54px';
    spacer.style.flexShrink = '0';

    titlebar.append(controls, title, spacer);

    // Content area
    const content = document.createElement('div');
    content.className = 'os-window-content';

    // Resize handle
    const resize = document.createElement('div');
    resize.className = 'os-window-resize';

    win.append(titlebar, content, resize);
    layerEl.appendChild(win);

    // Trigger open animation
    requestAnimationFrame(() => {
      win.classList.add('visible');
      focus(id);
    });

    // State
    const state = {
      id,
      el: win,
      contentEl: content,
      isMinimized: false,
      isMaximized: false,
      savedRect: null,
    };

    windows[id] = state;

    // --- Event Handlers ---

    // Focus on click
    win.addEventListener('pointerdown', () => focus(id));

    // Close
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      close(id);
    });

    // Minimize
    btnMin.addEventListener('click', (e) => {
      e.stopPropagation();
      minimize(id);
    });

    // Maximize
    btnMax.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMaximize(id);
    });

    // Double-click titlebar to maximize
    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.os-window-controls')) return;
      toggleMaximize(id);
    });

    // Drag
    setupDrag(win, titlebar, state);

    // Resize
    setupResize(win, resize, state, minWidth, minHeight);

    // Store callbacks
    state.onClose = onClose;
    state.onMinimize = onMinimize;
    state.onRestore = onRestore;

    // Update on language change
    const langHandler = () => {
      title.textContent = I18N.t(titleKey);
    };
    document.addEventListener('i18n:changed', langHandler);
    state._langHandler = langHandler;

    return state;
  }

  function focus(id) {
    const state = windows[id];
    if (!state) return;

    // Remove focused from all windows
    Object.values(windows).forEach(w => w.el.classList.remove('focused'));

    // Add focused to this window
    zCounter++;
    state.el.style.zIndex = zCounter;
    state.el.classList.add('focused');
  }

  function close(id) {
    const state = windows[id];
    if (!state) return;

    state.el.classList.remove('visible');
    state.el.classList.add('closing');

    setTimeout(() => {
      state.el.remove();
      document.removeEventListener('i18n:changed', state._langHandler);
      if (state.onClose) state.onClose();
      delete windows[id];
    }, 250);
  }

  function minimize(id) {
    const state = windows[id];
    if (!state || state.isMinimized) return;

    state.isMinimized = true;
    state.el.classList.add('minimized');
    if (state.onMinimize) state.onMinimize();
  }

  function restore(id) {
    const state = windows[id];
    if (!state || !state.isMinimized) return;

    state.isMinimized = false;
    state.el.classList.remove('minimized');
    focus(id);
    if (state.onRestore) state.onRestore();
  }

  function toggleMaximize(id) {
    const state = windows[id];
    if (!state) return;

    if (state.isMaximized) {
      // Restore
      state.isMaximized = false;
      state.el.classList.remove('maximized');
      if (state.savedRect) {
        state.el.style.left = state.savedRect.left;
        state.el.style.top = state.savedRect.top;
        state.el.style.width = state.savedRect.width;
        state.el.style.height = state.savedRect.height;
      }
    } else {
      // Maximize
      state.savedRect = {
        left: state.el.style.left,
        top: state.el.style.top,
        width: state.el.style.width,
        height: state.el.style.height,
      };
      state.isMaximized = true;
      state.el.classList.add('maximized');
    }
  }

  function setupDrag(win, titlebar, state) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titlebar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.os-window-controls')) return;
      if (state.isMaximized) return;

      isDragging = true;
      const rect = win.getBoundingClientRect();
      const layerRect = layer().getBoundingClientRect();
      offsetX = e.clientX - rect.left + layerRect.left;
      offsetY = e.clientY - rect.top + layerRect.top;

      titlebar.setPointerCapture(e.pointerId);
      win.style.transition = 'none';
    });

    titlebar.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      requestAnimationFrame(() => {
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        win.style.left = `${newLeft}px`;
        win.style.top = `${Math.max(0, newTop)}px`;
      });
    });

    titlebar.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      win.style.transition = '';
    });
  }

  function setupResize(win, handle, state, minW, minH) {
    let isResizing = false;
    let startX, startY, startW, startH;

    handle.addEventListener('pointerdown', (e) => {
      if (state.isMaximized) return;

      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = win.offsetWidth;
      startH = win.offsetHeight;

      handle.setPointerCapture(e.pointerId);
      win.style.transition = 'none';
      e.stopPropagation();
    });

    handle.addEventListener('pointermove', (e) => {
      if (!isResizing) return;

      requestAnimationFrame(() => {
        const newW = Math.max(minW, startW + (e.clientX - startX));
        const newH = Math.max(minH, startH + (e.clientY - startY));
        win.style.width = `${newW}px`;
        win.style.height = `${newH}px`;
      });
    });

    handle.addEventListener('pointerup', () => {
      if (!isResizing) return;
      isResizing = false;
      win.style.transition = '';
    });
  }

  function isOpen(id) {
    return !!windows[id] && !windows[id].isMinimized;
  }

  function get(id) {
    return windows[id] || null;
  }

  function toggleWindow(id) {
    const state = windows[id];
    if (!state) return;

    if (state.isMinimized) {
      restore(id);
    } else if (state.el.classList.contains('focused')) {
      minimize(id);
    } else {
      focus(id);
    }
  }

  return {
    create,
    focus,
    close,
    minimize,
    restore,
    toggleMaximize,
    toggleWindow,
    isOpen,
    get,
  };
})();
