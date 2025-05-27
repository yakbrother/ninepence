// Enhanced parallax scrolling effect for the footer with iOS support
const initParallax = (): void => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Request animation frame for smoother performance
  let ticking = false;
  
  const parallaxFooter = document.querySelector('.popup-footer-container') as HTMLElement;
  const parallaxBackground = document.querySelector('.popup-footer-background') as HTMLElement;
  const parallaxContent = document.querySelector('.popup-footer-content') as HTMLElement;
  const mainContent = document.querySelector('main') as HTMLElement;
  
  if (!parallaxFooter || !parallaxBackground || !parallaxContent || !mainContent) {
    return;
  }
  
  // iOS-specific styles
  if (isIOS) {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'relative';
  }
  
  // Initial state - footer is hidden
  parallaxFooter.style.willChange = 'transform, opacity';
  parallaxFooter.style.opacity = '0';
  parallaxFooter.style.transform = 'translate3d(0, 100px, 0)';
  
  // Function to handle scroll effect with requestAnimationFrame
  const updateParallax = (): void => {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const footerTop = parallaxFooter.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
    const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
    
    // Start showing the footer when we're close to it
    const footerVisibilityStart = isIOS ? 300 : 500; // Smaller threshold for iOS
    
    if (footerTop - scrollPosition - windowHeight < footerVisibilityStart) {
      // Calculate how far into the visibility zone we are (0 to 1)
      const visibilityRatio = Math.min(
        1, 
        (footerVisibilityStart - (footerTop - scrollPosition - windowHeight)) / footerVisibilityStart
      );
      
      // Use transform3d for hardware acceleration
      parallaxFooter.style.opacity = visibilityRatio.toString();
      parallaxFooter.style.transform = `translate3d(0, ${100 - (visibilityRatio * 100)}px, 0)`;
      
      // Apply parallax effects with hardware acceleration
      parallaxBackground.style.transform = `translate3d(0, ${-visibilityRatio * 100}px, -150px) scale(1.7)`;
      parallaxContent.style.transform = `translate3d(0, ${-visibilityRatio * 40}px, 0)`;
      
      // Only apply scale effect if not on iOS for better performance
      if (!isIOS) {
        mainContent.style.transform = `scale(${1 - (visibilityRatio * 0.02)})`;
      }
    }
    
    // When we're at the bottom of the page, ensure footer is fully visible
    if (distanceFromBottom < 20) {
      parallaxFooter.style.opacity = '1';
      parallaxFooter.style.transform = 'translate3d(0, 0, 0)';
    }
  }
  
  // Throttle scroll events with requestAnimationFrame
  const handleScroll = (): void => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  // Add scroll event listener with passive for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial call to set correct state on page load
  updateParallax();
  
  // Handle iOS resize events
  if (isIOS) {
    window.addEventListener('orientationchange', updateParallax);
    window.addEventListener('resize', updateParallax);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallax);
} else {
  initParallax();
}
