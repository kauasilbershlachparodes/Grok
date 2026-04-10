(function () {
  const TOOLTIP_DELAY_MS = 450;
  const ATTACH_SELECTOR = 'button[aria-label="Attach"]';
  const SETTINGS_SELECTOR = 'button[aria-label="Settings"]';

  const configs = [
    {
      selector: ATTACH_SELECTOR,
      text: 'Attach',
      side: 'top',
      align: 'center',
      offset: 8,
      tooltipId: 'radix-_r_14_'
    },
    {
      selector: SETTINGS_SELECTOR,
      text: 'Settings',
      side: 'bottom',
      align: 'center',
      offset: 8,
      tooltipId: 'radix-_r_s_'
    }
  ];

  let activeTooltip = null;
  let activeTrigger = null;
  let showTimer = null;
  let rafId = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createTooltipElement(config) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-radix-popper-content-wrapper', '');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0px';
    wrapper.style.top = '0px';
    wrapper.style.minWidth = 'max-content';
    wrapper.style.zIndex = 'auto';

    const content = document.createElement('div');
    content.setAttribute('data-side', config.side);
    content.setAttribute('data-align', config.align);
    content.setAttribute('data-state', 'delayed-open');
    content.className = 'overflow-hidden rounded-lg bg-popover shadow-sm dark:shadow-none px-3 py-1.5 border border-border-l1 text-xs text-fg-primary pointer-events-none max-w-80 text-wrap animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
    content.textContent = config.text;

    const sr = document.createElement('span');
    sr.id = config.tooltipId;
    sr.setAttribute('role', 'tooltip');
    sr.style.position = 'absolute';
    sr.style.border = '0px';
    sr.style.width = '1px';
    sr.style.height = '1px';
    sr.style.padding = '0px';
    sr.style.margin = '-1px';
    sr.style.overflow = 'hidden';
    sr.style.clip = 'rect(0px, 0px, 0px, 0px)';
    sr.style.whiteSpace = 'nowrap';
    sr.style.overflowWrap = 'normal';
    sr.textContent = config.text;

    content.appendChild(sr);
    wrapper.appendChild(content);

    return { wrapper, content };
  }

  function positionTooltip(trigger, tooltip, config) {
    if (!trigger || !tooltip) return;

    const rect = trigger.getBoundingClientRect();
    const content = tooltip.content;
    const wrapper = tooltip.wrapper;

    wrapper.style.visibility = 'hidden';
    wrapper.style.transform = 'translate(0px, 0px)';

    const previousDisplay = wrapper.style.display;
    wrapper.style.display = 'block';

    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 8;

    let x = rect.left + rect.width / 2 - contentRect.width / 2;
    x = clamp(x, margin, Math.max(margin, viewportWidth - contentRect.width - margin));

    let y;
    if (config.side === 'top') {
      y = rect.top - contentRect.height - config.offset;
      if (y < margin) {
        y = rect.bottom + config.offset;
        content.setAttribute('data-side', 'bottom');
      } else {
        content.setAttribute('data-side', 'top');
      }
    } else {
      y = rect.bottom + config.offset;
      if (y + contentRect.height > viewportHeight - margin) {
        y = rect.top - contentRect.height - config.offset;
        content.setAttribute('data-side', 'top');
      } else {
        content.setAttribute('data-side', 'bottom');
      }
    }

    y = clamp(y, margin, Math.max(margin, viewportHeight - contentRect.height - margin));

    const arrowCenter = rect.left + rect.width / 2 - x;
    const originY = content.getAttribute('data-side') === 'top' ? contentRect.height + 'px' : '0px';

    wrapper.style.setProperty('--radix-popper-transform-origin', `${Math.round(arrowCenter)}px ${originY}`);
    wrapper.style.setProperty('--radix-popper-available-width', `${Math.max(0, viewportWidth - margin * 2)}px`);
    wrapper.style.setProperty('--radix-popper-available-height', `${Math.max(0, viewportHeight - margin * 2)}px`);
    wrapper.style.setProperty('--radix-popper-anchor-width', `${rect.width}px`);
    wrapper.style.setProperty('--radix-popper-anchor-height', `${rect.height}px`);

    content.style.setProperty('--radix-tooltip-content-transform-origin', 'var(--radix-popper-transform-origin)');
    content.style.setProperty('--radix-tooltip-content-available-width', 'var(--radix-popper-available-width)');
    content.style.setProperty('--radix-tooltip-content-available-height', 'var(--radix-popper-available-height)');
    content.style.setProperty('--radix-tooltip-trigger-width', 'var(--radix-popper-anchor-width)');
    content.style.setProperty('--radix-tooltip-trigger-height', 'var(--radix-popper-anchor-height)');

    wrapper.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    wrapper.style.visibility = 'visible';
    wrapper.style.display = previousDisplay || 'block';
  }

  function cleanupTooltip() {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (activeTooltip?.wrapper?.parentNode) {
      activeTooltip.wrapper.parentNode.removeChild(activeTooltip.wrapper);
    }

    if (activeTrigger) {
      activeTrigger.removeAttribute('aria-describedby');
    }

    activeTooltip = null;
    activeTrigger = null;
  }

  function showTooltip(trigger, config) {
    if (!trigger || trigger.matches('[aria-expanded="true"]')) return;

    cleanupTooltip();

    const tooltip = createTooltipElement(config);
    document.body.appendChild(tooltip.wrapper);
    activeTooltip = tooltip;
    activeTrigger = trigger;
    activeTrigger.setAttribute('aria-describedby', config.tooltipId);

    const updatePosition = () => {
      if (!activeTooltip || !activeTrigger || activeTrigger !== trigger) return;
      positionTooltip(trigger, tooltip, config);
      rafId = requestAnimationFrame(updatePosition);
    };

    positionTooltip(trigger, tooltip, config);
    rafId = requestAnimationFrame(updatePosition);
  }

  function queueTooltip(trigger, config) {
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      showTooltip(trigger, config);
    }, TOOLTIP_DELAY_MS);
  }

  function bindTooltip(config) {
    const handler = (event) => {
      const trigger = event.target.closest(config.selector);
      if (!trigger) return;
      queueTooltip(trigger, config);
    };

    const cancel = (event) => {
      const trigger = event.target.closest(config.selector);
      if (!trigger && activeTrigger && (!event.relatedTarget || !activeTrigger.contains(event.relatedTarget))) {
        cleanupTooltip();
        return;
      }
      cleanupTooltip();
    };

    document.addEventListener('mouseover', handler, true);
    document.addEventListener('focusin', handler, true);
    document.addEventListener('mouseout', cancel, true);
    document.addEventListener('focusout', cancel, true);
  }

  configs.forEach(bindTooltip);

  document.addEventListener('pointerdown', cleanupTooltip, true);
  document.addEventListener('scroll', cleanupTooltip, true);
  window.addEventListener('resize', cleanupTooltip);
  window.addEventListener('blur', cleanupTooltip);
})();
