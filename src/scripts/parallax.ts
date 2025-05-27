class ParallaxEffect {
  // Constants
  private static readonly VISIBILITY_THRESHOLDS = {
    IOS: 300,    // Smaller threshold for iOS devices
    DESKTOP: 500 // Standard threshold for desktop devices
  } as const;

  private static readonly ANIMATION = {
    BACKGROUND_SCALE: 1.7,
    BACKGROUND_TRANSLATE_Z: -150,
    FOOTER_INITIAL_TRANSLATE: 100,
    OPACITY_DURATION: 0.8
  } as const;

  private static readonly RESIZE_DEBOUNCE_DELAY = 250;
  private static readonly IOS_SCROLL_FIX_CLASS = 'ios-scroll-fix';
  private static readonly HIDDEN_CLASS = 'hidden';

  // DOM element references
  private parallaxFooter: HTMLElement | null = null;
  private parallaxBackground: HTMLElement | null = null;
  private parallaxContent: HTMLElement | null = null;
  private mainContent: HTMLElement | null = null;

  // State management
  private ticking = false;
  private isIOS = false;
  private resizeTimeout: number | null = null;
  private isInitialized = false;

  // Bind methods to maintain 'this' context
  private boundHandleScroll: () => void;
  private boundHandleResize: () => void;
  private boundCleanup: () => void;

  constructor() {
    // Bind methods
    this.boundHandleScroll = this.handleScroll.bind(this);
    this.boundHandleResize = this.handleResize.bind(this);
    this.boundCleanup = this.cleanup.bind(this);
  }

  /**
   * Caches DOM element references
   */
  private cacheElements(): void {
    this.parallaxFooter = document.querySelector('.popup-footer-container');
    this.parallaxBackground = document.querySelector('.parallax-background');
    this.parallaxContent = document.querySelector('.parallax-content');
    this.mainContent = document.querySelector('main');
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
    
    // Toggle hidden class based on visibility
    if (parallaxFooter) {
      parallaxFooter.classList.toggle(HIDDEN_CLASS, visibilityRatio <= 0);
      
      if (visibilityRatio > 0) {
        parallaxFooter.style.opacity = visibilityRatio.toString();
        parallaxFooter.style.transform = `translate3d(0, ${ANIMATION.FOOTER_INITIAL_TRANSLATE - (visibilityRatio * ANIMATION.FOOTER_INITIAL_TRANSLATE)}px, 0)`;
      }
    }
    
    // Apply parallax effects with hardware acceleration
    if (parallaxBackground) {
      parallaxBackground.style.transform = `translate3d(0, ${-visibilityRatio * 100}px, ${ANIMATION.BACKGROUND_TRANSLATE_Z}px) scale(${ANIMATION.BACKGROUND_SCALE})`;
    }
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
  
  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  
  // Initial update
  updateParallax();
  
  // Handle iOS specific events
  if (isIOS) {
    window.addEventListener('orientationchange', handleResize);
  }
  
  // Clean up on page unload
  window.addEventListener('beforeunload', cleanup);
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

  /**
   * Handles the scroll event with requestAnimationFrame for better performance
   */
  private handleScroll(): void {
    if (!this.parallaxFooter || !this.parallaxBackground || !this.parallaxContent || !this.mainContent) {
      return;
    }

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  /**
   * Updates the parallax effect based on scroll position
   */
  private updateParallax(): void {
    if (!this.parallaxFooter || !this.parallaxBackground || !this.parallaxContent || !this.mainContent) {
      return;
    }

    const scrollPosition = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const footerTop = this.parallaxFooter.getBoundingClientRect().top + scrollPosition;
    
    const visibilityThreshold = this.isIOS 
      ? ParallaxEffect.VISIBILITY_THRESHOLDS.IOS 
      : ParallaxEffect.VISIBILITY_THRESHOLDS.DESKTOP;
    const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
    
    if (footerTop - scrollPosition - windowHeight < visibilityThreshold) {
      const visibilityRatio = Math.min(
        1, 
        (visibilityThreshold - (footerTop - scrollPosition - windowHeight)) / visibilityThreshold
      );
      
      if (this.parallaxFooter) {
        this.parallaxFooter.classList.toggle(ParallaxEffect.HIDDEN_CLASS, visibilityRatio <= 0);
        
        if (visibilityRatio > 0) {
          this.parallaxFooter.style.opacity = visibilityRatio.toString();
          this.parallaxFooter.style.transform = `translate3d(0, ${ParallaxEffect.ANIMATION.FOOTER_INITIAL_TRANSLATE - (visibilityRatio * ParallaxEffect.ANIMATION.FOOTER_INITIAL_TRANSLATE)}px, 0)`;
        }
      }
      
      if (this.parallaxBackground) {
        this.parallaxBackground.style.transform = `translate3d(0, ${-visibilityRatio * 100}px, ${ParallaxEffect.ANIMATION.BACKGROUND_TRANSLATE_Z}px) scale(${ParallaxEffect.ANIMATION.BACKGROUND_SCALE})`;
      }
      
      if (this.parallaxContent) {
        this.parallaxContent.style.transform = `translate3d(0, ${-visibilityRatio * 40}px, 0)`;
      }
      
      if (!this.isIOS && this.mainContent) {
        this.mainContent.style.transform = `scale(${1 - (visibilityRatio * 0.02)})`;
      }
    }
    
    if (distanceFromBottom < 20 && this.parallaxFooter) {
      this.parallaxFooter.style.opacity = '1';
      this.parallaxFooter.style.transform = 'translate3d(0, 0, 0)';
    }
  }

  /**
   * Handles window resize with debounce
   */
  private handleResize(): void {
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = window.setTimeout(() => {
      this.updateParallax();
    }, ParallaxEffect.RESIZE_DEBOUNCE_DELAY);
  }

  /**
   * Cleans up event listeners and resets styles
   */
  public cleanup(): void {
    if (!this.isInitialized) {
      return;
    }
    
    // Remove event listeners
    window.removeEventListener('scroll', this.boundHandleScroll);
    window.removeEventListener('resize', this.boundHandleResize);
    window.removeEventListener('orientationchange', this.boundHandleResize);
    window.removeEventListener('beforeunload', this.boundCleanup);
    
    // Remove iOS specific classes
    if (this.isIOS) {
      document.documentElement.classList.remove(ParallaxEffect.IOS_SCROLL_FIX_CLASS);
      document.body.classList.remove(ParallaxEffect.IOS_SCROLL_FIX_CLASS);
    }
    
    // Reset state
    this.ticking = false;
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    
    this.isInitialized = false;
  }
}

// Initialize the parallax effect when the DOM is loaded
let parallaxEffect: ParallaxEffect | null = null;

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    parallaxEffect = new ParallaxEffect();
    parallaxEffect.init();
  });
}
