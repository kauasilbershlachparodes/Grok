(function () {
  const STORAGE_KEY = 'grok-model-select-mode';
  const WRAPPER_ATTR = 'data-model-select-menu-wrapper';
  const MENU_ATTR = 'data-model-select-menu';
  const TRIGGER_SELECTOR = '#model-select-trigger';

  const OPTIONS = [
    {
      key: 'auto',
      label: 'Auto',
      description: 'Chooses Fast or Expert',
      icon: `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] ">
          <path d="M6.5 12.5L11.5 17.5M6.5 12.5L11.8349 6.83172C13.5356 5.02464 15.9071 4 18.3887 4H20V5.61135C20 8.09292 18.9754 10.4644 17.1683 12.1651L11.5 17.5M6.5 12.5L2 11L5.12132 7.87868C5.68393 7.31607 6.44699 7 7.24264 7H11M11.5 17.5L13 22L16.1213 18.8787C16.6839 18.3161 17 17.553 17 16.7574V13" stroke="currentColor" stroke-linecap="square"></path>
          <path d="M4.5 16.5C4.5 16.5 4 18 4 20C6 20 7.5 19.5 7.5 19.5" stroke="currentColor"></path>
        </svg>`,
    },
    {
      key: 'fast',
      label: 'Fast',
      description: 'Quick responses - Grok 4.20',
      icon: `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] ">
          <path d="M5 14.25L14 4L13 9.75H19L10 20L11 14.25H5Z" stroke="currentColor" stroke-width="2"></path>
        </svg>`,
    },
    {
      key: 'expert',
      label: 'Expert',
      description: 'Thinks hard - Grok 4.20',
      icon: `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] ">
          <path d="M19 9C19 12.866 15.866 17 12 17C8.13398 17 4.99997 12.866 4.99997 9C4.99997 5.13401 8.13398 3 12 3C15.866 3 19 5.13401 19 9Z" class="fill-yellow-100 dark:fill-yellow-300 origin-center transition-[transform,opacity] duration-100 scale-0 opacity-0"></path>
          <path d="M15 16.1378L14.487 15.2794L14 15.5705V16.1378H15ZM8.99997 16.1378H9.99997V15.5705L9.51293 15.2794L8.99997 16.1378ZM18 9C18 11.4496 16.5421 14.0513 14.487 15.2794L15.5129 16.9963C18.1877 15.3979 20 12.1352 20 9H18ZM12 4C13.7598 4 15.2728 4.48657 16.3238 5.33011C17.3509 6.15455 18 7.36618 18 9H20C20 6.76783 19.082 4.97946 17.5757 3.77039C16.0931 2.58044 14.1061 2 12 2V4ZM5.99997 9C5.99997 7.36618 6.64903 6.15455 7.67617 5.33011C8.72714 4.48657 10.2401 4 12 4V2C9.89382 2 7.90681 2.58044 6.42427 3.77039C4.91791 4.97946 3.99997 6.76783 3.99997 9H5.99997ZM9.51293 15.2794C7.4578 14.0513 5.99997 11.4496 5.99997 9H3.99997C3.99997 12.1352 5.81225 15.3979 8.48701 16.9963L9.51293 15.2794ZM9.99997 19.5001V16.1378H7.99997V19.5001H9.99997ZM10.5 20.0001C10.2238 20.0001 9.99997 19.7763 9.99997 19.5001H7.99997C7.99997 20.8808 9.11926 22.0001 10.5 22.0001V20.0001ZM13.5 20.0001H10.5V22.0001H13.5V20.0001ZM14 19.5001C14 19.7763 13.7761 20.0001 13.5 20.0001V22.0001C14.8807 22.0001 16 20.8808 16 19.5001H14ZM14 16.1378V19.5001H16V16.1378H14Z" fill="currentColor"></path>
          <path d="M9 16.0001H15" stroke="currentColor"></path>
          <path d="M12 16V12" stroke="currentColor" stroke-linecap="square"></path>
          <g>
            <path d="M20 7L19 8" stroke="currentColor" stroke-linecap="round" class="transition-[transform,opacity] duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"></path>
            <path d="M20 9L19 8" stroke="currentColor" stroke-linecap="round" class="transition-[transform,opacity] duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"></path>
            <path d="M4 7L5 8" stroke="currentColor" stroke-linecap="round" class="transition-[transform,opacity] duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"></path>
            <path d="M4 9L5 8" stroke="currentColor" stroke-linecap="round" class="transition-[transform,opacity] duration-100 ease-in-out translate-x-0 translate-y-0 opacity-0"></path>
          </g>
        </svg>`,
    },
  ];

  const CHECK_ICON = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] size-4 opacity-100">
      <path d="M19.7998 6.59961L10.1221 19.5039L4.30762 13.9219L5.69238 12.4785L9.87793 16.4961L18.2002 5.40039L19.7998 6.59961Z" fill="currentColor"></path>
    </svg>`;

  const HEAVY_BLOCK = `
    <div role="menuitem" class="relative px-3 rounded-xl text-sm outline-none focus:bg-button-ghost-hover aria-disabled:opacity-50 aria-disabled:cursor-not-allowed cursor-pointer select-none py-1.5 ps-2.5 flex flex-row items-center text-secondary opacity-75 pr-2" tabindex="-1" data-orientation="vertical" data-radix-collection-item="" data-model-static-item="heavy">
      <div class="flex flex-row items-center justify-between w-full gap-3">
        <div class="flex flex-row items-center gap-3">
          <div class="flex items-center justify-center size-[18px] overflow-hidden shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] ">
              <rect x="4" y="4" width="5" height="5" stroke="currentColor" stroke-width="2"></rect>
              <rect x="15" y="4" width="5" height="5" stroke="currentColor" stroke-width="2"></rect>
              <rect x="15" y="15" width="5" height="5" stroke="currentColor" stroke-width="2"></rect>
              <path d="M11 18H10C7.79086 18 6 16.2091 6 14V13" stroke="currentColor" stroke-width="2"></path>
            </svg>
          </div>
          <div class="flex flex-col items-start">
            <div class="flex items-center gap-1"><span class="font-semibold text-sm">Heavy</span></div>
            <span class="text-xs text-secondary line-clamp-1">Powered by Grok 4.20</span>
          </div>
        </div>
      </div>
    </div>`;

  const UPSELL_BLOCK = `
    <div role="menuitem" class="relative select-none cursor-pointer px-3 py-2 rounded-xl text-sm outline-none focus:bg-button-ghost-hover aria-disabled:opacity-50 aria-disabled:cursor-not-allowed group/mode-select-upsell flex flex-col items-start border border-border-l1 bg-surface-l3 data-[disabled]:opacity-100 data-[disabled]:pointer-events-auto" tabindex="-1" data-orientation="vertical" data-radix-collection-item="" data-model-static-item="upsell">
      <div class="flex flex-row items-center justify-between w-full gap-3">
        <div class="flex flex-col justify-center">
          <span class="flex items-center -my-1 h-7 overflow-hidden text-fg-primary">
            <svg width="248" height="65" viewBox="0 0 248 65" fill="none" xmlns="http://www.w3.org/2000/svg" class="!h-7 !w-auto"><g filter="url(#filter0_i_3682_180386)"><path fill-rule="evenodd" clip-rule="evenodd" d="M43.7186 27.4612L25.9882 40.5653L51.387 15.0223V15.0451L58.7231 7.7002C58.5911 7.88701 58.4591 8.06926 58.3271 8.25152C52.7522 15.9381 50.0308 19.6971 52.2152 29.1015L52.2016 29.0878C53.7079 35.4895 52.0969 42.5884 46.8952 47.7963C40.3373 54.3666 29.8428 55.8292 21.2006 49.915L27.226 47.122C32.7418 49.2908 38.7763 48.3385 43.1134 43.9963C47.4504 39.6541 48.4243 33.3298 46.2444 28.0672C45.8303 27.0694 44.5879 26.8188 43.7186 27.4612ZM22.4885 23.3422C17.1958 28.6367 16.1263 37.8178 22.3292 43.7502L22.3247 43.7548L5.39062 58.9002C6.45033 57.4391 7.76256 56.0579 9.0738 54.6777L9.07384 54.6777L9.12695 54.6218L9.13789 54.6102C12.8842 50.6683 16.5974 46.7612 14.3287 41.2397C11.2886 33.8447 13.059 25.1785 18.6885 19.5422C24.541 13.6873 33.1605 12.211 40.36 15.1772C41.9529 15.7695 43.3409 16.6125 44.424 17.3962L38.4122 20.1756C32.8146 17.8245 26.4023 19.4238 22.4885 23.3422ZM175.307 45.9806C167.498 45.9806 162.841 40.357 162.841 32.6888C162.841 24.9484 167.664 19.1882 175.459 19.1882C181.551 19.1882 186.01 22.2843 187.062 28.0446H182.385C181.696 24.7685 178.94 22.9325 175.459 22.9325C169.839 22.9325 167.374 27.7565 167.374 32.6888C167.374 37.621 169.839 42.4091 175.459 42.4091C180.826 42.4091 183.182 38.5569 183.364 35.3529H175.278V31.6251H187.497L187.477 33.5741C187.477 40.8163 184.501 45.9806 175.307 45.9806ZM224.19 45.5062V19.8012H228.287V36.7656V45.5062H224.19ZM228.287 36.7656L236.953 26.8935H241.92L234.125 35.3539L241.993 45.5062H237.098L230.725 36.7828L228.287 36.7656ZM211.769 45.9364C205.678 45.9364 202.378 41.6523 202.378 36.18C202.378 30.6718 205.678 26.4237 211.769 26.4237C217.897 26.4237 221.16 30.6718 221.16 36.18C221.16 41.6523 217.897 45.9364 211.769 45.9364ZM206.657 36.18C206.657 40.4282 208.977 42.5524 211.769 42.5524C214.597 42.5524 216.881 40.4282 216.881 36.18C216.881 31.932 214.597 29.7719 211.769 29.7719C208.977 29.7719 206.657 31.932 206.657 36.18ZM190.976 29.8442V45.5049H195.073V30.3483H201.745V26.8922H194.421L190.976 29.8442ZM65.3359 37.8292C65.687 42.4631 69.2327 46.1843 76.0432 46.1843C81.9409 46.1843 86.1887 43.3407 86.1887 38.6366C86.1887 34.4941 83.3803 32.5633 78.5006 31.475L74.6389 30.5623C71.7954 29.9304 70.2507 28.9123 70.2507 27.0868C70.2507 24.84 72.3922 23.4007 75.5166 23.4007C78.5357 23.4007 80.7473 24.7347 81.0984 28.14H85.4164C85.1356 23.1199 81.2388 19.855 75.5166 19.855C69.8646 19.855 66.0029 22.9092 66.0029 27.3677C66.0029 32.142 70.0752 33.6165 73.7262 34.459L77.5527 35.3015C80.6069 36.0037 81.8356 37.2675 81.8356 38.9174C81.8356 41.4801 79.2729 42.6035 76.0432 42.6035C72.6379 42.6035 70.2507 41.3046 69.7242 37.8292H65.3359ZM95.8831 45.9386C91.2141 45.9386 89.6343 43.2003 89.6343 39.3387V27.3677H93.6012V39.1281C93.6012 41.1993 94.7948 42.5684 96.9012 42.5684C100.096 42.5684 101.676 40.1812 101.676 37.127V27.3677H105.642V45.5173H101.851V42.428H101.781C100.517 44.8503 98.516 45.9386 95.8831 45.9386ZM109.433 27.3677V52.4682H113.4V43.0599H113.506C114.769 45.1662 117.227 45.9386 119.087 45.9386C124.423 45.9386 127.267 41.5855 127.267 36.4249C127.267 31.2644 124.423 26.9113 119.087 26.9113C117.227 26.9113 114.769 27.6836 113.506 29.7899H113.4V27.3677H109.433ZM118.21 42.6386C114.734 42.6386 113.295 39.5493 113.295 36.4249C113.295 33.1952 114.734 30.1761 118.21 30.1761C121.755 30.1761 123.125 33.1952 123.125 36.4249C123.125 39.5493 121.755 42.6386 118.21 42.6386ZM138.266 45.9386C132.579 45.9386 129.349 41.9365 129.349 36.4249C129.349 30.7729 132.579 26.9113 137.95 26.9113C143.181 26.9113 146.375 30.457 146.551 35.9334L144.831 37.5483H133.386C133.702 40.778 135.422 42.7088 138.266 42.7088C140.337 42.7088 141.811 41.6206 142.549 39.6195H146.481C145.568 43.7971 142.479 45.9386 138.266 45.9386ZM133.491 34.7047H142.619C142.198 31.6154 140.407 30.0357 137.95 30.0357C135.703 30.0357 133.983 31.7559 133.491 34.7047ZM149.472 30.2463V45.5173H153.439V30.7378H159.899V27.3677H152.807L149.472 30.2463Z" fill="currentColor"></path></g><defs><filter id="filter0_i_3682_180386" x="5.39062" y="7.7002" width="236.602" height="51.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="0.655766"></feOffset><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect1_innerShadow_3682_180386"></feBlend></filter></defs></svg>
          </span>
          <p class="text-xs text-secondary pt-1">Unlock extended capabilities</p>
        </div>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 [&_svg]:shrink-0 select-none bg-button-filled text-fg-invert hover:bg-button-filled-hover disabled:hover:bg-button-filled h-8 px-3 text-xs rounded-full font-semibold" type="button" aria-label="Sign in">Sign in</button>
      </div>
    </div>`;

  let trigger = null;
  let wrapper = null;
  let menu = null;
  let currentMode = getStoredMode();
  let bound = false;
  let observer = null;

  function getStoredMode() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return OPTIONS.some((option) => option.key === value) ? value : 'auto';
    } catch (error) {
      return 'auto';
    }
  }

  function setStoredMode(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // ignore storage errors
    }
  }

  function getCurrentOption() {
    return OPTIONS.find((option) => option.key === currentMode) || OPTIONS[0];
  }

  function getTrigger() {
    return document.querySelector(TRIGGER_SELECTOR);
  }

  function updateTriggerLabel() {
    trigger = getTrigger();
    if (!trigger) return;

    const labelNode = trigger.querySelector('.truncate.text-sm.font-semibold');
    if (labelNode) {
      labelNode.textContent = getCurrentOption().label;
    }
  }

  function updateTriggerState(isOpen) {
    trigger = getTrigger();
    if (!trigger) return;

    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    trigger.setAttribute('data-state', isOpen ? 'open' : 'closed');

    const chevron = trigger.querySelector('svg.size-4');
    if (chevron) {
      chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
    }
  }

  function renderSelectableItems() {
    return OPTIONS.map((option) => {
      const selected = option.key === currentMode;
      return `
        <div
          role="menuitem"
          class="relative px-3 rounded-xl text-sm outline-none focus:bg-button-ghost-hover aria-disabled:opacity-50 aria-disabled:cursor-not-allowed cursor-pointer select-none text-primary py-1.5 ps-2.5 flex flex-row items-center"
          tabindex="-1"
          data-orientation="vertical"
          data-radix-collection-item=""
          data-model-option="${option.key}"
        >
          <div class="flex flex-row items-center gap-3">
            <div class="flex items-center justify-center size-[18px] overflow-hidden shrink-0">${option.icon}</div>
            <div class="flex flex-col items-start">
              <div class="flex items-center gap-1"><span class="font-semibold text-sm">${option.label}</span></div>
              <span class="text-xs text-secondary line-clamp-1">${option.description}</span>
            </div>
          </div>
          <span class="ms-auto flex items-center ${selected ? 'opacity-100' : 'opacity-0'}">${CHECK_ICON}</span>
        </div>`;
    }).join('');
  }

  function buildMenuMarkup() {
    return `
      <div ${WRAPPER_ATTR}="" style="position: fixed; left: 0px; top: 0px; transform: translate(0px, 0px); min-width: max-content; --radix-popper-transform-origin: 100% 0px; z-index: auto;" dir="ltr">
        <div
          ${MENU_ATTR}=""
          data-side="bottom"
          data-align="end"
          role="menu"
          aria-orientation="vertical"
          data-state="open"
          data-radix-menu-content=""
          dir="ltr"
          id="radix-model-select-content"
          aria-labelledby="model-select-trigger"
          class="overflow-auto max-h-[--radix-dropdown-menu-content-available-height] rounded-2xl bg-popover border border-border-l1 text-primary shadow-md shadow-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[var(--radix-dropdown-menu-content-transform-origin)] p-1 min-w-[240px]"
          style="outline: none; --radix-dropdown-menu-content-transform-origin: var(--radix-popper-transform-origin); --radix-dropdown-menu-content-available-width: var(--radix-popper-available-width); --radix-dropdown-menu-content-available-height: var(--radix-popper-available-height); --radix-dropdown-menu-trigger-width: var(--radix-popper-anchor-width); --radix-dropdown-menu-trigger-height: var(--radix-popper-anchor-height); pointer-events: auto; width: 240px;"
          tabindex="-1"
          data-orientation="vertical"
        >
          ${renderSelectableItems()}
          ${HEAVY_BLOCK}
          ${UPSELL_BLOCK}
        </div>
      </div>`;
  }

  function attachHoverState(node) {
    if (!node || node.dataset.hoverBound === 'true') return;
    node.dataset.hoverBound = 'true';

    node.addEventListener('mouseenter', function () {
      if (!node.hasAttribute('data-model-static-item')) {
        node.classList.add('bg-button-ghost-hover');
      }
    });

    node.addEventListener('mouseleave', function () {
      node.classList.remove('bg-button-ghost-hover');
    });
  }

  function ensureMenu() {
    removeMenu();
    document.body.insertAdjacentHTML('beforeend', buildMenuMarkup());
    wrapper = document.querySelector(`[${WRAPPER_ATTR}]`);
    menu = document.querySelector(`[${MENU_ATTR}]`);

    if (!wrapper || !menu) return;

    const signInButton = menu.querySelector('button[aria-label="Sign in"]');
    if (signInButton) {
      signInButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }

    menu.querySelectorAll('[role="menuitem"]').forEach(attachHoverState);

    menu.querySelectorAll('[data-model-option]').forEach((item) => {
      item.addEventListener('click', function () {
        const nextMode = item.getAttribute('data-model-option');
        if (!nextMode || nextMode === currentMode) {
          closeMenu();
          return;
        }

        currentMode = nextMode;
        setStoredMode(nextMode);
        updateTriggerLabel();
        closeMenu();
      });
    });
  }

  function positionMenu() {
    trigger = getTrigger();
    if (!trigger || !wrapper || !menu) return;

    const rect = trigger.getBoundingClientRect();
    wrapper.style.visibility = 'hidden';
    wrapper.style.transform = 'translate(0px, 0px)';
    wrapper.style.setProperty('--radix-popper-anchor-width', `${rect.width}px`);
    wrapper.style.setProperty('--radix-popper-anchor-height', `${rect.height}px`);
    wrapper.style.setProperty('--radix-popper-available-width', `${window.innerWidth}px`);
    wrapper.style.setProperty('--radix-popper-available-height', `${Math.max(0, window.innerHeight - rect.bottom - 8)}px`);

    const menuWidth = 240;
    const menuRect = menu.getBoundingClientRect();
    const finalWidth = menuRect.width || menuWidth;
    const left = Math.max(8, Math.min(rect.right - finalWidth, window.innerWidth - finalWidth - 8));
    const top = Math.min(rect.bottom + 8, window.innerHeight - menuRect.height - 8);

    wrapper.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    wrapper.style.visibility = 'visible';
  }

  function openMenu() {
    trigger = getTrigger();
    if (!trigger) return;

    ensureMenu();
    positionMenu();
    updateTriggerState(true);
  }

  function closeMenu() {
    removeMenu();
    updateTriggerState(false);
  }

  function removeMenu() {
    wrapper = document.querySelector(`[${WRAPPER_ATTR}]`);
    if (wrapper) wrapper.remove();
    wrapper = null;
    menu = null;
  }

  function toggleMenu() {
    if (document.querySelector(`[${WRAPPER_ATTR}]`)) {
      closeMenu();
      return;
    }
    openMenu();
  }

  function onDocumentPointerDown(event) {
    const openWrapper = document.querySelector(`[${WRAPPER_ATTR}]`);
    const currentTrigger = getTrigger();
    if (!openWrapper || !currentTrigger) return;

    if (openWrapper.contains(event.target) || currentTrigger.contains(event.target)) {
      return;
    }

    closeMenu();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  function onViewportChange() {
    if (document.querySelector(`[${WRAPPER_ATTR}]`)) {
      positionMenu();
    }
  }

  function bindTrigger() {
    trigger = getTrigger();
    if (!trigger || trigger.dataset.modelSelectMenuBound === 'true') return false;

    trigger.dataset.modelSelectMenuBound = 'true';
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      toggleMenu();
    });

    updateTriggerLabel();
    updateTriggerState(false);
    return true;
  }

  function bindGlobalEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener('mousedown', onDocumentPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
  }

  function init() {
    const ready = bindTrigger();
    bindGlobalEvents();

    if (ready || observer) return;

    observer = new MutationObserver(function () {
      if (bindTrigger()) {
        updateTriggerLabel();
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
