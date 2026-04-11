(function () {
  const TRIGGER_SELECTORS = [
    '#radix-_r_2a_',
    'button[aria-label="Attach"]',
    '.group\\/attach-button',
  ];

  const state = {
    wrapper: null,
    menu: null,
    trigger: null,
    fileInput: null,
    recentButton: null,
    open: false,
  };

  function findTrigger() {
    for (const selector of TRIGGER_SELECTORS) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  function findFileInput(trigger) {
    if (!trigger) return document.querySelector('input[type="file"][name="files"]');
    const form = trigger.closest('form');
    if (form) {
      const localInput = form.querySelector('input[type="file"][name="files"]');
      if (localInput) return localInput;
    }
    return document.querySelector('input[type="file"][name="files"]');
  }

  function setHoverBehavior(node) {
    if (!node) return;
    node.addEventListener('mouseenter', function () {
      node.classList.add('bg-button-ghost-hover');
    });
    node.addEventListener('mouseleave', function () {
      node.classList.remove('bg-button-ghost-hover');
    });
  }

  function createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-radix-popper-content-wrapper', '');
    wrapper.setAttribute('dir', 'ltr');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0px';
    wrapper.style.top = '0px';
    wrapper.style.minWidth = 'max-content';
    wrapper.style.zIndex = '200';
    return wrapper;
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.setAttribute('data-side', 'bottom');
    menu.setAttribute('data-align', 'start');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-orientation', 'vertical');
    menu.setAttribute('data-state', 'open');
    menu.setAttribute('data-radix-menu-content', '');
    menu.setAttribute('dir', 'ltr');
    menu.id = 'attach-menu-content';
    menu.setAttribute('aria-labelledby', 'radix-_r_2a_');
    menu.setAttribute('tabindex', '-1');
    menu.setAttribute('data-orientation', 'vertical');
    menu.className = 'overflow-auto max-h-[--radix-dropdown-menu-content-available-height] rounded-2xl bg-popover border border-border-l1 text-primary p-1 shadow-md shadow-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[var(--radix-dropdown-menu-content-transform-origin)] z-[200]';
    menu.style.outline = 'none';
    menu.style.pointerEvents = 'auto';

    const uploadItem = document.createElement('div');
    uploadItem.setAttribute('role', 'menuitem');
    uploadItem.className = 'relative select-none items-center cursor-pointer px-3 rounded-xl text-sm outline-none focus:bg-button-ghost-hover aria-disabled:opacity-50 aria-disabled:cursor-not-allowed flex flex-row pr-3 py-2.5 gap-2';
    uploadItem.setAttribute('tabindex', '-1');
    uploadItem.setAttribute('data-orientation', 'vertical');
    uploadItem.setAttribute('data-radix-collection-item', '');
    uploadItem.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] opacity-70"><path d="M11 20H8C5.79086 20 4 18.2091 4 16V10.6569C4 9.59599 4.42143 8.57857 5.17157 7.82843L7.82843 5.17157C8.57857 4.42143 9.59599 4 10.6569 4H16C18.2091 4 20 5.79086 20 8V11" stroke="currentColor" stroke-width="2"></path><path d="M21 18L18 18M18 18L15 18M18 18L18 15M18 18L18 21" stroke-width="2" stroke-linecap="square" stroke="currentColor"></path><path d="M10 4V8C10 9.10457 9.10457 10 8 10H4" stroke-width="2" stroke="currentColor"></path></svg>Upload a file';

    const recentItem = document.createElement('div');
    recentItem.setAttribute('role', 'menuitem');
    recentItem.id = 'attach-menu-recent-trigger';
    recentItem.setAttribute('aria-haspopup', 'menu');
    recentItem.setAttribute('aria-expanded', 'false');
    recentItem.setAttribute('aria-controls', 'attach-menu-recent-content');
    recentItem.setAttribute('data-state', 'closed');
    recentItem.className = 'cursor-pointer select-none items-center justify-between rounded-xl px-3 text-sm outline-none focus:bg-button-ghost-hover data-[state=open]:bg-button-ghost-hover [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 flex flex-row pr-3 py-2.5 gap-2';
    recentItem.setAttribute('tabindex', '-1');
    recentItem.setAttribute('data-orientation', 'vertical');
    recentItem.setAttribute('data-radix-collection-item', '');
    recentItem.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] opacity-70"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2.5C7.81643 2.5 7.24341 2.49895 6.77636 2.53711C6.29771 2.57623 5.84293 2.66183 5.41113 2.88184C4.75262 3.21739 4.21738 3.75262 3.88183 4.41114C3.66182 4.84294 3.57623 5.29772 3.53711 5.77637C3.49895 6.24342 3.5 6.81644 3.5 7.5V16.5C3.5 17.1836 3.49895 17.7566 3.53711 18.2236C3.57623 18.7023 3.66182 19.1571 3.88183 19.5889C4.21738 20.2474 4.75261 20.7826 5.41113 21.1182C5.84293 21.3382 6.29771 21.4238 6.77636 21.4629C7.24341 21.5011 7.81643 21.5 8.5 21.5H15.5C16.1836 21.5 16.7566 21.5011 17.2236 21.4629C17.7023 21.4238 18.1571 21.3382 18.5889 21.1182C19.2474 20.7826 19.7826 20.2474 20.1182 19.5889C20.3382 19.1571 20.4238 18.7023 20.4629 18.2236C20.501 17.7566 20.5 17.1836 20.5 16.5V10C20.5 5.85787 17.1421 2.5 13 2.5H8.5ZM12 4.5C12.5523 4.5 13 4.94772 13 5.5V6.5C13 8.433 14.567 10 16.5 10H17C17.8284 10 18.5 10.6716 18.5 11.5V16.5C18.5 17.2165 18.4997 17.6938 18.4697 18.0605C18.4408 18.4151 18.3893 18.5777 18.3369 18.6807C18.1931 18.9629 17.9629 19.1931 17.6807 19.3369C17.5777 19.3893 17.4151 19.4408 17.0605 19.4697C16.6938 19.4997 16.2165 19.5 15.5 19.5H8.5C7.78347 19.5 7.30616 19.4997 6.93945 19.4697C6.58489 19.4408 6.42228 19.3893 6.31933 19.3369C6.03709 19.1931 5.80689 18.9629 5.66308 18.6807C5.61072 18.5777 5.55924 18.4151 5.53027 18.0605C5.50031 17.6938 5.5 17.2165 5.5 16.5V7.5C5.5 6.78347 5.50031 6.30616 5.53027 5.93946C5.55924 5.5849 5.61072 5.42228 5.66308 5.31934C5.80689 5.0371 6.03709 4.8069 6.31933 4.66309C6.42228 4.61072 6.5849 4.55924 6.93945 4.53028C7.30616 4.50032 7.78347 4.5 8.5 4.5H12ZM14.9277 4.84766C16.4603 5.42133 17.6675 6.65927 18.2012 8.21094C17.8266 8.07411 17.4219 8 17 8H16.5C15.6716 8 15 7.32843 15 6.5V5.5C15 5.27589 14.9743 5.05775 14.9277 4.84766Z" fill="currentColor"></path></svg>Recent<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0 ms-auto text-fg-secondary"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>';

    setHoverBehavior(uploadItem);
    setHoverBehavior(recentItem);

    uploadItem.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const input = state.fileInput || findFileInput(state.trigger);
      if (input) input.click();
      closeMenu();
    });

    recentItem.addEventListener('mouseenter', function () {
      recentItem.setAttribute('data-state', 'open');
      recentItem.setAttribute('aria-expanded', 'true');
      recentItem.classList.add('bg-button-ghost-hover');
    });

    recentItem.addEventListener('mouseleave', function () {
      recentItem.setAttribute('data-state', 'closed');
      recentItem.setAttribute('aria-expanded', 'false');
      recentItem.classList.remove('bg-button-ghost-hover');
    });

    recentItem.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      recentItem.setAttribute('data-state', 'open');
      recentItem.setAttribute('aria-expanded', 'true');
      recentItem.classList.add('bg-button-ghost-hover');
      document.dispatchEvent(new CustomEvent('attach-menu:recent'));
    });

    menu.appendChild(uploadItem);
    menu.appendChild(recentItem);
    state.recentButton = recentItem;
    return menu;
  }

  function positionMenu() {
    if (!state.wrapper || !state.menu || !state.trigger) return;

    const rect = state.trigger.getBoundingClientRect();
    const gap = 4;
    const x = Math.round(rect.left);
    const y = Math.round(rect.bottom + gap);

    state.wrapper.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    state.wrapper.style.setProperty('--radix-popper-transform-origin', '0% 0px');
    state.wrapper.style.setProperty('--radix-popper-available-width', Math.max(0, window.innerWidth - x) + 'px');
    state.wrapper.style.setProperty('--radix-popper-available-height', Math.max(0, window.innerHeight - y) + 'px');
    state.wrapper.style.setProperty('--radix-popper-anchor-width', rect.width + 'px');
    state.wrapper.style.setProperty('--radix-popper-anchor-height', rect.height + 'px');

    state.menu.style.setProperty('--radix-dropdown-menu-content-transform-origin', 'var(--radix-popper-transform-origin)');
    state.menu.style.setProperty('--radix-dropdown-menu-content-available-width', 'var(--radix-popper-available-width)');
    state.menu.style.setProperty('--radix-dropdown-menu-content-available-height', 'var(--radix-popper-available-height)');
    state.menu.style.setProperty('--radix-dropdown-menu-trigger-width', 'var(--radix-popper-anchor-width)');
    state.menu.style.setProperty('--radix-dropdown-menu-trigger-height', 'var(--radix-popper-anchor-height)');
  }

  function openMenu() {
    state.trigger = findTrigger();
    if (!state.trigger) return;
    state.fileInput = findFileInput(state.trigger);

    closeMenu(true);

    state.wrapper = createWrapper();
    state.menu = createMenu();
    state.wrapper.appendChild(state.menu);
    document.body.appendChild(state.wrapper);

    state.open = true;
    state.trigger.setAttribute('aria-expanded', 'true');
    state.trigger.setAttribute('data-state', 'open');
    positionMenu();
    requestAnimationFrame(function () {
      positionMenu();
      state.menu.focus();
    });
  }

  function closeMenu(silent) {
    if (state.wrapper && state.wrapper.parentNode) {
      state.wrapper.parentNode.removeChild(state.wrapper);
    }
    state.wrapper = null;
    state.menu = null;
    state.recentButton = null;
    state.open = false;

    const trigger = state.trigger || findTrigger();
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('data-state', 'closed');
    }

    if (!silent && trigger) {
      // keep default behavior minimal
    }
  }

  function toggleMenu() {
    if (state.open) closeMenu();
    else openMenu();
  }

  function onDocumentPointerDown(event) {
    if (!state.open) return;
    const target = event.target;
    if (state.wrapper && state.wrapper.contains(target)) return;
    const trigger = state.trigger || findTrigger();
    if (trigger && trigger.contains(target)) return;
    closeMenu();
  }

  function onDocumentKeyDown(event) {
    if (!state.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
    }
  }

  function onWindowChange() {
    if (state.open) positionMenu();
  }

  function bindTrigger() {
    const trigger = findTrigger();
    if (!trigger || trigger.dataset.attachMenuBound === 'true') return;

    trigger.dataset.attachMenuBound = 'true';
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });
  }

  function boot() {
    bindTrigger();
    document.addEventListener('pointerdown', onDocumentPointerDown, true);
    document.addEventListener('keydown', onDocumentKeyDown, true);
    window.addEventListener('resize', onWindowChange);
    window.addEventListener('scroll', onWindowChange, true);

    const observer = new MutationObserver(function () {
      bindTrigger();
      if (state.open) positionMenu();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
