// Enhanced parallax scrolling effect for the footer
document.addEventListener('DOMContentLoaded', () => {
  const parallaxFooter = document.querySelector('.popup-footer-container');
  const parallaxBackground = document.querySelector('.popup-footer-background');
  const parallaxContent = document.querySelector('.popup-footer-content');
  const mainContent = document.querySelector('main');
  
  if (!parallaxFooter || !parallaxBackground || !parallaxContent || !mainContent) return;
  
  // Initial state - footer is hidden
  parallaxFooter.style.opacity = '0';
  parallaxFooter.style.transform = 'translateY(100px)';
  
  // Function to handle scroll effect
  function handleScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    const footerTop = parallaxFooter.getBoundingClientRect().top + window.scrollY;
    const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
    
    // Start showing the footer when we're close to it
    const footerVisibilityStart = 500; // px before the footer - increased for earlier reveal
    
    if (footerTop - scrollPosition - windowHeight < footerVisibilityStart) {
      // Calculate how far into the visibility zone we are (0 to 1)
      const visibilityRatio = Math.min(
        1, 
        (footerVisibilityStart - (footerTop - scrollPosition - windowHeight)) / footerVisibilityStart
      );
      
      // Apply opacity and slide-up based on scroll position
      parallaxFooter.style.opacity = visibilityRatio.toString();
      parallaxFooter.style.transform = `translateY(${100 - (visibilityRatio * 100)}px)`;
      
      // Apply more dramatic parallax effect to the background
      parallaxBackground.style.transform = `translateZ(-150px) scale(1.7) translateY(${-visibilityRatio * 100}px)`;
      
      // Apply parallax effect to the content
      parallaxContent.style.transform = `translateZ(0) translateY(${-visibilityRatio * 40}px)`;
      
      // Add a subtle effect to the main content as well
      mainContent.style.transform = `scale(${1 - (visibilityRatio * 0.02)})`;
    }
    
    // When we're at the bottom of the page, ensure footer is fully visible
    if (distanceFromBottom < 20) {
      parallaxFooter.style.opacity = '1';
      parallaxFooter.style.transform = 'translateY(0)';
    }
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Initial call to set correct state on page load
  handleScroll();
});
