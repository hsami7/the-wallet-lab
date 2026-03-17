/**
 * Flies a small visual element from the source element to the cart icon.
 * @param sourceElement The element to start the animation from (e.g., the Add to Cart button)
 * @param color The color of the flying particle (defaults to primary blue)
 */
export const flyToCart = (sourceElement: HTMLElement, color: string = '#0d59f2') => {
  const cartTarget = document.getElementById('cart-icon-target');
  if (!cartTarget || !sourceElement) return;

  // Get coordinates
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = cartTarget.getBoundingClientRect();

  // Create the flying particle
  const particle = document.createElement('div');
  
  // Style the particle
  particle.style.position = 'fixed';
  particle.style.left = `${sourceRect.left + sourceRect.width / 2 - 10}px`;
  particle.style.top = `${sourceRect.top + sourceRect.height / 2 - 10}px`;
  particle.style.width = '20px';
  particle.style.height = '20px';
  particle.style.backgroundColor = color;
  particle.style.borderRadius = '50%';
  particle.style.zIndex = '9999';
  particle.style.pointerEvents = 'none';
  particle.style.boxShadow = `0 0 15px ${color}80`;
  particle.style.opacity = '0.8';
  
  // Add to body
  document.body.appendChild(particle);

  // Animation keyframes
  const animation = particle.animate([
    {
      transform: 'scale(1) translate(0, 0)',
      opacity: 0.8
    },
    {
      transform: `scale(0.2) translate(${targetRect.left - sourceRect.left}px, ${targetRect.top - sourceRect.top}px)`,
      opacity: 0.2
    }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
  });

  // Finish and cleanup
  animation.onfinish = () => {
    particle.remove();
    
    // Subtle "ping" animation on the cart icon when it arrives
    cartTarget.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)', backgroundColor: `${color}20` },
      { transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
  };
};
