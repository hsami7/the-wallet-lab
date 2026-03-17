/**
 * Flies a small visual element from the source element to the cart icon.
 * @param sourceElement The element to start the animation from (e.g., the Add to Cart button)
 * @param color The color of the flying particle (defaults to primary blue)
 */
export const flyToCart = (sourceElement: HTMLElement, color: string = '#0d59f2') => {
  const cartTarget = document.getElementById('cart-icon-target');
  if (!cartTarget) return;

  // Subtle "ping" animation on the cart icon
  cartTarget.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.3)', backgroundColor: `${color}20` },
    { transform: 'scale(1)' }
  ], {
    duration: 300,
    easing: 'ease-out'
  });
};
