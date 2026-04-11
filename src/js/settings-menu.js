// src/js/settings-menu.js
(() => {
  const THEME_STORAGE_KEY = 'grok-theme-preference';
  const LANGUAGE_STORAGE_KEY = 'grok-language-preference';
  const VIEWPORT_MARGIN = 8;
  const GAP = 6;
  const ALIGN_OFFSET_X = 7;
  const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
  const LANGUAGES = [
    ['ar', 'العربية', 'Arabic'],
    ['ar-SA', 'العربية (السعودية)', 'Arabic (Saudi Arabia)'],
    ['bn', 'বাংলা', 'Bengali'],
    ['cs', 'Čeština', 'Czech'],
    ['de', 'Deutsch', 'German'],
    ['en', 'English', ''],
    ['es', 'Español', 'Spanish'],
    ['fa', 'فارسی', 'Persian'],
    ['fil', 'Filipino', 'Filipino'],
    ['fr', 'Français', 'French'],
    ['gu', 'ગુજરાતી', 'Gujarati'],
    ['hi', 'हिन्दी', 'Hindi'],
    ['hu', 'Magyar', 'Hungarian'],
    ['id', 'Bahasa Indonesia', 'Indonesian'],
    ['it', 'Italiano', 'Italian'],
    ['ja', '日本語', 'Japanese'],
    ['ko', '한국어', 'Korean'],
    ['mr', 'मराठी', 'Marathi'],
    ['nl', 'Nederlands', 'Dutch'],
    ['pl', 'Polski', 'Polish'],
    ['pt', 'Português', 'Portuguese'],
    ['ro', 'Română', 'Romanian'],
    ['ru', 'Русский', 'Russian'],
    ['sv', 'Svenska', 'Swedish'],
    ['ta', 'தமிழ்', 'Tamil'],
    ['te', 'తెలుగు', 'Telugu'],
    ['tr', 'Türkçe', 'Turkish'],
    ['uk-UA', 'Українська мова', 'Ukrainian'],
    ['vi', 'Tiếng Việt', 'Vietnamese'],
    ['zh', '简体中文', 'Simplified Chinese'],
    ['zh-TW', '繁體中文', 'Traditional Chinese']
  ];

  const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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

  const normalizeLanguage = (value) => {
    const supported = new Set(LANGUAGES.map(([code]) => code));
    if (supported.has(value)) {
      return value;
    }

    const lower = String(value || '').toLowerCase();
    const direct = LANGUAGES.find(([code]) => code.toLowerCase() === lower);
    if (direct) {
      return direct[0];
    }

    const prefix = LANGUAGES.find(([code]) => lower.startsWith(code.toLowerCase()));
    return prefix ? prefix[0] : 'en';
  };

  const getLanguagePreference = () => {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored) {
        return normalizeLanguage(stored);
      }
    } catch (_error) {
      // noop
    }

    return normalizeLanguage(document.documentElement.lang || navigator.language || 'en');
  };

  const applyLanguage = (languageCode) => {
    const normalized = normalizeLanguage(languageCode);

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    } catch (_error) {
      // noop
    }

    document.documentElement.lang = normalized;
    document.documentElement.setAttribute('data-language-preference', normalized);

    document.dispatchEvent(new CustomEvent('stage:language-change', {
      detail: { language: normalized }
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

  const buildLanguageItemsMarkup = (activeLanguage, filter) => {
    const normalizedFilter = String(filter || '').trim().toLocaleLowerCase();
    const filtered = normalizedFilter
      ? LANGUAGES.filter(([code, nativeName, englishName]) => {
          const haystack = `${code} ${nativeName} ${englishName}`.toLocaleLowerCase();
          return haystack.includes(normalizedFilter);
        })
      : LANGUAGES;

    const checkIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] size-4" data-testid="check-icon"><path d="M19.7998 6.59961L10.1221 19.5039L4.30762 13.9219L5.69238 12.4785L9.87793 16.4961L18.2002 5.40039L19.7998 6.59961Z" fill="currentColor"></path></svg>';

    return filtered.map(([code, nativeName, englishName], index) => {
      const isActive = code === activeLanguage;
      const content = englishName
        ? `${escapeHtml(nativeName)}<span class="text-muted-foreground">${escapeHtml(englishName)}</span>`
        : `${escapeHtml(nativeName)}${isActive ? checkIcon : ''}`;
      const trailing = englishName && isActive ? checkIcon : '';
      const elementId = `settings-language-option-${index}-${code.replace(/[^a-zA-Z0-9_-]/g, '')}`;

      return `<div class="relative flex select-none items-center gap-2 px-3.5 py-3 text-sm outline-none after:absolute after:inset-1 after:rounded-lg after:transition after:pointer-events-none ease-in-out focus:after:bg-card-hover [&amp;[data-selected='true']]:after:bg-card-hover justify-between cursor-pointer" id="${elementId}" cmdk-item="" role="option" aria-disabled="false" aria-selected="${isActive ? 'true' : 'false'}" data-disabled="false" data-selected="${isActive ? 'true' : 'false'}" data-value="${escapeHtml(code)}" tabindex="0">${content}${trailing}</div>`;
    }).join('');
  };

  const buildLanguageDialogMarkup = (activeLanguage, filter, ids) => `
    <div data-state="open" class="fixed inset-0 bg-overlay backdrop-blur-[2px] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" style="pointer-events: auto;" data-aria-hidden="true" aria-hidden="true" data-language-overlay="true"></div>
    <div role="dialog" id="${ids.dialog}" aria-labelledby="${ids.title}" data-state="open" class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] gap-4 dark:border dark:border-border-l1 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] focus:outline-none bg-background rounded-2xl outline-none h-[calc(100dvh-64px-128px)] w-full md:w-[400px] max-w-3xl flex flex-col md:h-[min(500px,90dvh)]" data-analytics-name="language_selector" tabindex="-1" style="pointer-events: auto;" data-language-dialog="true">
      <div class="space-y-1.5 text-center sm:text-left py-3 flex flex-row items-center gap-2">
        <div class="flex min-w-0 flex-1 flex-col gap-1.5">
          <h2 id="${ids.title}" class="text-lg font-semibold leading-none tracking-tight sr-only">Language Selector</h2>
        </div>
      </div>
      <div tabindex="-1" class="flex w-full flex-col overflow-hidden rounded-xl text-popover-foreground" cmdk-root="">
        <label cmdk-label="" for="${ids.input}" id="${ids.label}" style="position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px;"></label>
        <div class="flex items-center border-b-2 border-input-border px-3" cmdk-input-wrapper="">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2 h-4 w-4 shrink-0 opacity-50"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          <input class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search language" cmdk-input="" autocomplete="off" autocorrect="off" spellcheck="false" aria-autocomplete="list" role="combobox" aria-expanded="true" aria-controls="${ids.list}" aria-labelledby="${ids.label}" id="${ids.input}" type="text" value="${escapeHtml(filter || '')}">
        </div>
        <div class="overflow-y-auto overflow-x-hidden p-1" cmdk-list="" role="listbox" aria-label="Suggestions" id="${ids.list}" style="--cmdk-list-height: 1395.0px;">
          <div cmdk-list-sizer="">${buildLanguageItemsMarkup(activeLanguage, filter)}</div>
        </div>
      </div>
    </div>
  `;

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

    const dialogPortal = document.getElementById('dialog-portal') || (() => {
      const portal = document.createElement('div');
      portal.id = 'dialog-portal';
      document.body.appendChild(portal);
      return portal;
    })();

    let isOpen = false;
    let isLanguageDialogOpen = false;
    let languageFilter = '';
    let previousBodyOverflow = '';
    const darkMediaQuery = window.matchMedia(DARK_MEDIA_QUERY);
    const languageDialogIds = {
      dialog: createId('radix-language-dialog'),
      title: createId('radix-language-title'),
      label: createId('radix-language-label'),
      input: createId('radix-language-input'),
      list: createId('radix-language-list')
    };

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
        Math.max(VIEWPORT_MARGIN, rect.right - menuRect.width - ALIGN_OFFSET_X),
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

    const closeLanguageDialog = ({ focusTrigger = false } = {}) => {
      if (!isLanguageDialogOpen) {
        return;
      }

      isLanguageDialogOpen = false;
      dialogPortal.innerHTML = '';
      document.body.style.overflow = previousBodyOverflow;

      if (focusTrigger) {
        window.requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
      }
    };

    const renderLanguageDialog = () => {
      dialogPortal.innerHTML = buildLanguageDialogMarkup(getLanguagePreference(), languageFilter, languageDialogIds);

      const dialog = dialogPortal.querySelector('[data-language-dialog="true"]');
      const overlay = dialogPortal.querySelector('[data-language-overlay="true"]');
      const input = dialogPortal.querySelector(`#${CSS.escape(languageDialogIds.input)}`);
      const list = dialogPortal.querySelector(`#${CSS.escape(languageDialogIds.list)}`);

      if (!(dialog instanceof HTMLElement) || !(overlay instanceof HTMLElement) || !(input instanceof HTMLInputElement) || !(list instanceof HTMLElement)) {
        return;
      }

      overlay.addEventListener('click', () => closeLanguageDialog({ focusTrigger: true }));
      dialog.addEventListener('click', (event) => event.stopPropagation());
      dialog.addEventListener('pointerdown', (event) => event.stopPropagation());

      input.addEventListener('input', () => {
        languageFilter = input.value;
        renderLanguageDialog();
      });

      list.addEventListener('click', (event) => {
        const option = event.target.closest('[data-value]');
        if (!(option instanceof HTMLElement)) {
          return;
        }

        applyLanguage(option.getAttribute('data-value') || 'en');
        languageFilter = '';
        closeLanguageDialog({ focusTrigger: true });
      });

      list.querySelectorAll('[data-value]').forEach((option) => {
        option.addEventListener('keydown', (event) => {
          const items = Array.from(list.querySelectorAll('[data-value]')).filter((node) => node instanceof HTMLElement);
          const currentIndex = items.indexOf(option);

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            applyLanguage(option.getAttribute('data-value') || 'en');
            languageFilter = '';
            closeLanguageDialog({ focusTrigger: true });
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            items[(currentIndex + 1) % items.length]?.focus({ preventScroll: true });
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            items[(currentIndex - 1 + items.length) % items.length]?.focus({ preventScroll: true });
          } else if (event.key === 'Escape') {
            event.preventDefault();
            closeLanguageDialog({ focusTrigger: true });
          }
        });
      });

      window.requestAnimationFrame(() => {
        input.focus({ preventScroll: true });
        input.setSelectionRange(input.value.length, input.value.length);
      });
    };

    const openLanguageDialog = () => {
      if (isLanguageDialogOpen) {
        return;
      }

      closeMenu({ focusTrigger: false });
      isLanguageDialogOpen = true;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      renderLanguageDialog();
    };

    const openMenu = () => {
      if (isOpen || isLanguageDialogOpen) {
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
        closeLanguageDialog({ focusTrigger: true });
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
        languageFilter = '';
        openLanguageDialog();
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
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (isLanguageDialogOpen) {
        const dialog = dialogPortal.querySelector('[data-language-dialog="true"]');
        const overlay = dialogPortal.querySelector('[data-language-overlay="true"]');

        if (overlay instanceof HTMLElement && overlay.contains(target)) {
          closeLanguageDialog({ focusTrigger: true });
          return;
        }

        if (dialog instanceof HTMLElement && !dialog.contains(target) && !trigger.contains(target)) {
          closeLanguageDialog({ focusTrigger: false });
        }

        return;
      }

      if (!isOpen) {
        return;
      }

      if (!wrapper.contains(target) && !trigger.contains(target)) {
        closeMenu({ focusTrigger: false });
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (isLanguageDialogOpen) {
          event.preventDefault();
          closeLanguageDialog({ focusTrigger: true });
        } else if (isOpen) {
          event.preventDefault();
          closeMenu({ focusTrigger: true });
        }
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
        closeLanguageDialog({ focusTrigger: false });
        closeMenu({ focusTrigger: false });
      }
    });

    window.addEventListener('blur', () => {
      closeLanguageDialog({ focusTrigger: false });
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
    applyLanguage(getLanguagePreference());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsMenu, { once: true });
  } else {
    initSettingsMenu();
  }
})();
