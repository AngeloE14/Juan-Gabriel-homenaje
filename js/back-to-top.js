"use strict";
import { obtenerRendimientoDispositivo } from './utils.js';

export function inicializarBotonSubir() {
  const btn = document.getElementById("btn-subir");
  if (!btn) return;

  let visible = false;

  let animationFrameId = null;
  let originalScrollBehavior = null;
  let originalOverscrollBehavior = null;

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function getScrollingElement() {
    return document.scrollingElement || document.documentElement || document.body;
  }

  function restoreScrollStyles() {
    const docEl = document.documentElement;
    const body = document.body;
    if (originalScrollBehavior !== null) {
      docEl.style.scrollBehavior = originalScrollBehavior;
      body.style.scrollBehavior = originalScrollBehavior;
    }
    if (originalOverscrollBehavior !== null) {
      docEl.style.overscrollBehavior = originalOverscrollBehavior;
      body.style.overscrollBehavior = originalOverscrollBehavior;
    }
    originalScrollBehavior = null;
    originalOverscrollBehavior = null;
  }

  function cancelScrollAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      restoreScrollStyles();
    }
  }

  function scrollToTop() {
    const scrollingElement = getScrollingElement();
    const startY = scrollingElement.scrollTop || window.scrollY || 0;
    if (startY <= 0) return;

    const { isLowEnd, isMobile } = obtenerRendimientoDispositivo();
    const minDuration = isMobile ? 550 : 600;
    const extraDuration = isLowEnd ? 500 : 0;
    const duration = Math.min(1400, Math.max(minDuration + extraDuration, startY * (isMobile ? 0.18 : 0.22)));
    const startTime = performance.now();

    cancelScrollAnimation();

    const docEl = document.documentElement;
    const bodyEl = document.body;
    originalScrollBehavior = docEl.style.scrollBehavior || '';
    originalOverscrollBehavior = docEl.style.overscrollBehavior || '';
    docEl.style.scrollBehavior = 'auto';
    bodyEl.style.scrollBehavior = 'auto';
    docEl.style.overscrollBehavior = 'none';
    bodyEl.style.overscrollBehavior = 'none';

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutSine(progress);
      const nextY = Math.max(0, startY * (1 - ease));
      window.scrollTo(0, nextY);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        animationFrameId = null;
        restoreScrollStyles();
      }
    }

    animationFrameId = requestAnimationFrame(step);
  }

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    scrollToTop();
  }

  function onScroll() {
    const debeSerVisible = window.scrollY > 400;
    if (debeSerVisible !== visible) {
      visible = debeSerVisible;
      btn.classList.toggle("is-visible", visible);
    }
  }

  btn.addEventListener("click", onClick);

  const cancelOnInteraction = () => cancelScrollAnimation();
  window.addEventListener("wheel", cancelOnInteraction, { passive: true });
  window.addEventListener("touchstart", cancelOnInteraction, { passive: true });
  window.addEventListener("touchmove", cancelOnInteraction, { passive: true });
  window.addEventListener("pointerdown", cancelOnInteraction, { passive: true });

  window.addEventListener("scroll", onScroll, { passive: true });

  onScroll();
}
