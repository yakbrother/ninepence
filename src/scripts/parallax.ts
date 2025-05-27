// Constants for parallax effect configuration
const VISIBILITY_THRESHOLDS = {
  IOS: 300,    // Smaller threshold for iOS devices
  DESKTOP: 500 // Standard threshold for desktop devices
} as const;

// Animation properties
const ANIMATION = {
  BACKGROUND_SCALE: 1.7,
  BACKGROUND_TRANSLATE_Z: -150,
  FOOTER_INITIAL_TRANSLATE: 100,
  OPACITY_DURATION: 0.8
} as const;

// DOM element references
let parallaxFooter: HTMLElement | null = null;
let parallaxBackground: HTMLElement | null = null;
let parallaxContent: HTMLElement | null = null;
let mainContent: HTMLElement | null = null;

// State management
let ticking = false;
let isIOS = false;

/**
 * Caches DOM element references
 */
const cacheElements = (): boolean => {
  parallaxFooter = document.querySelector('.popup-footer-container');
  parallaxBackground = document.querySelector('.popup-footer-background');
  parallaxContent = document.querySelector('.popup-footer-content');
  mainContent = document.querySelector('main');
  
  return !!(parallaxFooter && parallaxBackground && parallaxContent && mainContent);
};

/**
 * Applies iOS-specific styles if needed
 */
const applyIOSStyles = (): void => {
  if (!isIOS) {
    return;
  }
  
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
  document.body.style.position = 'relative';
};

/**
 * Initializes the footer's initial state
 */
const initFooterState = (): void => {
  if (!parallaxFooter) {
    return;
  }
  
  parallaxFooter.style.willChange = 'transform, opacity';
  parallaxFooter.style.opacity = '0';
  parallaxFooter.style.transform = 'translate3d(0, 100px, 0)';
};

/**
 * Handles the scroll event with requestAnimationFrame for better performance
 */
const handleScroll = (): void => {
  if (!parallaxFooter || !parallaxBackground || !parallaxContent || !mainContent) {
    return;
  }

  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
};

/**
 * Updates the parallax effect based on scroll position
 */
const updateParallax = (): void => {
  if (!parallaxFooter || !parallaxBackground || !parallaxContent || !mainContent) {
    return;
  }

  const scrollPosition = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const footerTop = parallaxFooter.getBoundingClientRect().top + scrollPosition;
  
  const visibilityThreshold = isIOS 
    ? VISIBILITY_THRESHOLDS.IOS 
    : VISIBILITY_THRESHOLDS.DESKTOP;
  const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
  
  if (footerTop - scrollPosition - windowHeight < visibilityThreshold) {
    // Calculate how far into the visibility zone we are (0 to 1)
    const visibilityRatio = Math.min(
      1, 
      (visibilityThreshold - (footerTop - scrollPosition - windowHeight)) / visibilityThreshold
    );
    
    // Apply transforms with hardware acceleration
    parallaxFooter.style.opacity = visibilityRatio.toString();
    parallaxFooter.style.transform = `translate3d(0, ${ANIMATION.FOOTER_INITIAL_TRANSLATE - (visibilityRatio * ANIMATION.FOOTER_INITIAL_TRANSLATE)}px, 0)`;
    
    // Apply parallax effects with hardware acceleration
    parallaxBackground.style.transform = `translate3d(0, ${-visibilityRatio * 100}px, ${ANIMATION.BACKGROUND_TRANSLATE_Z}px) scale(${ANIMATION.BACKGROUND_SCALE})`;
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
  
  // Add scroll event listener with passive for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial call to set correct state on page load
  updateParallax();
  
  // Handle iOS resize events
  if (isIOS) {
    window.addEventListener('orientationchange', updateParallax);
  }
};

/**
 * Initializes the parallax effect
 */
const initParallax = (): void => {
  // Detect iOS devices
  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Cache DOM elements
  if (!cacheElements()) {
    console.warn('Could not find all required elements for parallax effect');
    return;
  }
  
  // Apply iOS-specific styles if needed
  applyIOSStyles();
  
  // Initialize footer state
  initFooterState();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial update
  updateParallax();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallax);
} else {
  initParallax();
}

// Re-initialize on window resize with debounce
let resizeTimeout: number | null = null;
window.addEventListener('resize', () => {
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }
  resizeTimeout = window.setTimeout(initParallax, 250);
});
