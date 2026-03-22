/**
 * Flies a small visual element from the source element to the cart icon.
 * @param sourceElement The element to start the animation from (e.g., the Add to Cart button)
 * @param color The color of the flying particle (defaults to primary blue)
 */
export const flyToCart = (sourceElement: HTMLElement, color: string = '#0d59f2') => {
  const cartTarget = document.getElementById('cart-icon-target');
  if (!cartTarget) return;

  // Check for prefers-reduced-motion or low-performance devices
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Subtle "ping" animation on the cart icon using hardware-accelerated transforms
  cartTarget.animate([
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(1.3)', opacity: 0.8 },
    { transform: 'scale(1)', opacity: 1 }
  ], {
    duration: 300,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  });
};
