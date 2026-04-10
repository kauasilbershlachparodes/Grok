// src/js/settings-menu.js
(() => {
  const THEME_STORAGE_KEY = 'grok-theme-preference';
  const VIEWPORT_MARGIN = 8;
  const GAP = 8;
  const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

  const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

  const getThemePreference = () => {
    try {
      const value = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (value === 'light' || value === 'dark' || value === 'system') {
        return value;
      }
    } catch (_error) {
      // noop
    }

    return 'dark';
  };

  const getResolvedTheme = (preference) => {
    if (preference === 'light' || preference === 'dark') {
      return preference;
    }

    return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
  };

  const applyTheme = (preference) => {
    const normalized = preference === 'light' || preference === 'dark' || preference === 'system'
      ? preference
      : 'dark';

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (_error) {
      // noop
    }

    const resolved = getResolvedTheme(normalized);
    const root = document.documentElement;

    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
    root.setAttribute('data-theme-preference', normalized);

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta instanceof HTMLMetaElement) {
      themeColorMeta.setAttribute('content', resolved === 'dark' ? '#1e1f22' : '#f9f8f7');
    }

    document.dispatchEvent(new CustomEvent('stage:theme-change', {
      detail: { preference: normalized, resolved }
    }));
  };

  const buildMenuMarkup = (triggerId, menuId, activeTheme) => {
    const stateFor = (value) => (activeTheme === value ? 'delayed-open' : 'closed');
    const activeClassFor = (value) => (activeTheme === value ? ' bg-button-ghost-hover' : '');
    const describedBy = activeTheme === 'dark' ? ' aria-describedby="radix-theme-active"' : '';

    return `
      <div data-side="bottom" data-align="end" role="menu" aria-orientation="vertical" data-state="closed" data-radix-menu-content="" dir="ltr" id="${menuId}" aria-labelledby="${triggerId}" class="overflow-auto max-h-[--radix-dropdown-menu-content-available-height] rounded-2xl bg-popover border border-border-l1 text-primary p-1 shadow-md shadow-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[var(--radix-dropdown-menu-content-transform-origin)] min-w-36 space-y-0.5" tabindex="-1" data-orientation="vertical" style="outline: none; --radix-dropdown-menu-content-transform-origin: var(--radix-popper-transform-origin); --radix-dropdown-menu-content-available-width: var(--radix-popper-available-width); --radix-dropdown-menu-content-available-height: var(--radix-popper-available-height); --radix-dropdown-menu-trigger-width: var(--radix-popper-anchor-width); --radix-dropdown-menu-trigger-height: var(--radix-popper-anchor-height); pointer-events: auto;">
        <div class="w-full px-1 pt-1 pb-1">
          <div class="flex items-stretch w-full gap-2 justify-stretch">
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 [&_svg]:shrink-0 select-none text-fg-primary hover:bg-button-ghost-hover disabled:hover:bg-transparent border border-transparent h-10 w-full rounded-lg${activeClassFor('light')}" type="button" value="light" data-state="${stateFor('light')}" data-settings-theme="light">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
            </button>
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 [&_svg]:shrink-0 select-none text-fg-primary hover:bg-button-ghost-hover disabled:hover:bg-transparent border border-transparent h-10 w-full rounded-lg${activeClassFor('dark')}" type="button" value="dark" data-state="${stateFor('dark')}" data-settings-theme="dark"${describedBy}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path></svg>
            </button>
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 [&_svg]:shrink-0 select-none text-fg-primary hover:bg-button-ghost-hover disabled:hover:bg-transparent border border-transparent h-10 w-full rounded-lg${activeClassFor('system')}" type="button" value="system" data-state="${stateFor('system')}" data-settings-theme="system">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor-smartphone"><path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"></path><path d="M10 19v-3.96 3.15"></path><path d="M7 19h5"></path><rect width="6" height="10" x="16" y="12" rx="2"></rect></svg>
            </button>
          </div>
        </div>
        <div role="menuitem" class="relative flex select-none items-center cursor-pointer px-3 py-2 rounded-xl text-sm outline-none focus:bg-button-ghost-hover aria-disabled:opacity-50 aria-disabled:cursor-not-allowed" tabindex="-1" data-orientation="vertical" data-radix-collection-item="" data-settings-action="language">Language</div>
        <span id="radix-theme-active" role="tooltip" style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">Active theme</span>
      </div>
    `;
  };

  const initSettingsMenu = () => {
    const trigger = document.querySelector('button[aria-label="Settings"]');
    if (!(trigger instanceof HTMLButtonElement) || trigger.dataset.settingsMenuBound === 'true') {
      return;
    }

    trigger.dataset.settingsMenuBound = 'true';

    const triggerId = trigger.id || createId('radix-settings-trigger');
    const menuId = createId('radix-settings-menu');
    trigger.id = triggerId;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-state', 'closed');

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-radix-popper-content-wrapper', '');
    wrapper.setAttribute('dir', 'ltr');
    wrapper.hidden = true;
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0px';
    wrapper.style.top = '0px';
    wrapper.style.transform = 'translate(0px, 0px)';
    wrapper.style.minWidth = 'max-content';
    wrapper.style.setProperty('--radix-popper-transform-origin', '100% 0px');
    wrapper.style.zIndex = 'auto';
    wrapper.style.setProperty('--radix-popper-available-width', '0px');
    wrapper.style.setProperty('--radix-popper-available-height', '0px');
    wrapper.style.setProperty('--radix-popper-anchor-width', '0px');
    wrapper.style.setProperty('--radix-popper-anchor-height', '0px');
    wrapper.style.pointerEvents = 'none';
    wrapper.innerHTML = buildMenuMarkup(triggerId, menuId, getThemePreference());
    document.body.appendChild(wrapper);

    const menu = wrapper.firstElementChild;
    if (!(menu instanceof HTMLElement)) {
      return;
    }

    let isOpen = false;
    const darkMediaQuery = window.matchMedia(DARK_MEDIA_QUERY);

    const getThemeButtons = () => Array.from(menu.querySelectorAll('[data-settings-theme]'));

    const syncThemeButtons = () => {
      const activeTheme = getThemePreference();
      getThemeButtons().forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) {
          return;
        }

        const isActive = button.value === activeTheme;
        button.setAttribute('data-state', isActive ? 'delayed-open' : 'closed');
        button.classList.toggle('bg-button-ghost-hover', isActive);

        if (isActive && button.value === 'dark') {
          button.setAttribute('aria-describedby', 'radix-theme-active');
        } else {
          button.removeAttribute('aria-describedby');
        }
      });
    };

    const syncTriggerState = () => {
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      trigger.setAttribute('data-state', isOpen ? 'open' : 'closed');
    };

    const updatePosition = () => {
      wrapper.hidden = false;

      const rect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const x = Math.round(Math.min(
        Math.max(VIEWPORT_MARGIN, rect.right - menuRect.width),
        window.innerWidth - menuRect.width - VIEWPORT_MARGIN
      ));
      const y = Math.round(Math.min(
        Math.max(VIEWPORT_MARGIN, rect.bottom + GAP),
        window.innerHeight - menuRect.height - VIEWPORT_MARGIN
      ));
      const availableWidth = Math.max(0, window.innerWidth - x - VIEWPORT_MARGIN);
      const availableHeight = Math.max(0, window.innerHeight - y - VIEWPORT_MARGIN);

      wrapper.style.transform = `translate(${x}px, ${y}px)`;
      wrapper.style.setProperty('--radix-popper-transform-origin', '100% 0px');
      wrapper.style.setProperty('--radix-popper-available-width', `${availableWidth}px`);
      wrapper.style.setProperty('--radix-popper-available-height', `${availableHeight}px`);
      wrapper.style.setProperty('--radix-popper-anchor-width', `${Math.round(rect.width)}px`);
      wrapper.style.setProperty('--radix-popper-anchor-height', `${Math.round(rect.height)}px`);
    };

    const closeMenu = ({ focusTrigger = false } = {}) => {
      if (!isOpen) {
        return;
      }

      isOpen = false;
      wrapper.hidden = true;
      wrapper.style.pointerEvents = 'none';
      menu.setAttribute('data-state', 'closed');
      syncTriggerState();

      if (focusTrigger) {
        window.requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
      }
    };

    const openMenu = () => {
      if (isOpen) {
        return;
      }

      isOpen = true;
      wrapper.hidden = false;
      wrapper.style.pointerEvents = 'auto';
      menu.setAttribute('data-state', 'open');
      syncThemeButtons();
      syncTriggerState();
      updatePosition();
      window.requestAnimationFrame(() => menu.focus({ preventScroll: true }));
    };

    const toggleMenu = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (isOpen) {
        closeMenu({ focusTrigger: false });
      } else {
        openMenu();
      }
    };

    trigger.addEventListener('click', toggleMenu);
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        toggleMenu(event);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        openMenu();
      } else if (event.key === 'Escape') {
        closeMenu({ focusTrigger: true });
      }
    });

    menu.addEventListener('click', (event) => {
      event.stopPropagation();

      const themeButton = event.target.closest('[data-settings-theme]');
      if (themeButton instanceof HTMLButtonElement) {
        applyTheme(themeButton.value);
        syncThemeButtons();
        return;
      }

      const action = event.target.closest('[data-settings-action="language"]');
      if (action instanceof HTMLElement) {
        closeMenu({ focusTrigger: false });
      }
    });

    menu.addEventListener('keydown', (event) => {
      const items = [
        ...getThemeButtons(),
        ...Array.from(menu.querySelectorAll('[data-settings-action]'))
      ].filter((item) => item instanceof HTMLElement);

      if (!items.length) {
        return;
      }

      const currentIndex = items.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu({ focusTrigger: true });
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        items[(currentIndex + 1 + items.length) % items.length]?.focus({ preventScroll: true });
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus({ preventScroll: true });
      } else if (event.key === 'Home') {
        event.preventDefault();
        items[0]?.focus({ preventScroll: true });
      } else if (event.key === 'End') {
        event.preventDefault();
        items[items.length - 1]?.focus({ preventScroll: true });
      } else if (event.key === 'Tab') {
        closeMenu({ focusTrigger: false });
      }
    });

    menu.addEventListener('pointerdown', (event) => event.stopPropagation());
    menu.addEventListener('pointerup', (event) => event.stopPropagation());
    menu.addEventListener('touchstart', (event) => event.stopPropagation(), { passive: true });
    menu.addEventListener('touchmove', (event) => event.stopPropagation(), { passive: true });
    menu.addEventListener('touchend', (event) => event.stopPropagation(), { passive: true });
    menu.addEventListener('scroll', (event) => event.stopPropagation(), { passive: true });

    document.addEventListener('pointerdown', (event) => {
      if (!isOpen) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!wrapper.contains(target) && !trigger.contains(target)) {
        closeMenu({ focusTrigger: false });
      }
    });

    window.addEventListener('resize', () => {
      if (isOpen) {
        updatePosition();
      }
    }, { passive: true });

    window.addEventListener('scroll', () => {
      if (isOpen) {
        updatePosition();
      }
    }, { passive: true, capture: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        closeMenu({ focusTrigger: false });
      }
    });

    window.addEventListener('blur', () => {
      closeMenu({ focusTrigger: false });
    });

    const handleSystemThemeChange = () => {
      if (getThemePreference() === 'system') {
        applyTheme('system');
        syncThemeButtons();
      }
    };

    if (typeof darkMediaQuery.addEventListener === 'function') {
      darkMediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof darkMediaQuery.addListener === 'function') {
      darkMediaQuery.addListener(handleSystemThemeChange);
    }

    syncThemeButtons();
    applyTheme(getThemePreference());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsMenu, { once: true });
  } else {
    initSettingsMenu();
  }
})();
