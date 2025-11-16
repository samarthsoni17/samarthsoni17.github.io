/**
 * =====================================================
 * MAIN JAVASCRIPT FILE FOR SAMARTH SONI'S PORTFOLIO
 * =====================================================
 * This file handles all interactive functionality across the website;
 * Provides smooth scrolling, animations, and dynamic user experience enhancements
 */

// =====================================================
// STRICT MODE
// =====================================================
'use strict'; // Enables strict mode for better error catching; Prevents accidental global variables and catches common mistakes

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * DEBOUNCE FUNCTION: Limits how often a function can be called
 * @param {Function} func - The function to debounce; Original function that will be rate-limited
 * @param {number} wait - Wait time in milliseconds; Delay before function executes after last call
 * @returns {Function} Debounced function; Wrapped version that delays execution
 * WHY: Improves performance by preventing excessive function calls during scroll/resize events
 */
function debounce(func, wait) {
  let timeout; // Stores the timeout ID; Used to cancel previous timeout if function is called again

  // Return a new function that wraps the original; Creates the debounced version
  return function executedFunction(...args) {
    // Spread operator collects all arguments; Preserves original function's parameters

    const later = () => {
      // Arrow function for timeout callback; Maintains lexical 'this' binding
      clearTimeout(timeout); // Clear the timeout; Prevents memory leaks
      func(...args); // Execute the original function with arguments; Runs after wait period
    };

    clearTimeout(timeout); // Cancel previous timeout; Resets the delay on each call
    timeout = setTimeout(later, wait); // Set new timeout; Schedules execution after wait period
  };
}

/**
 * THROTTLE FUNCTION: Ensures a function is called at most once per specified time period
 * @param {Function} func - The function to throttle; Original function to rate-limit
 * @param {number} limit - Time limit in milliseconds; Minimum time between function calls
 * @returns {Function} Throttled function; Wrapped version that limits call frequency
 * WHY: Prevents performance issues from functions firing too rapidly during continuous events
 */
function throttle(func, limit) {
  let inThrottle; // Flag to track if we're in throttle period; Prevents multiple executions

  return function(...args) {
    // Return throttled function; Wraps original with timing logic

    if (!inThrottle) {
      // Check if we're not currently throttling; Only execute if enough time has passed
      func.apply(this, args); // Call original function with proper context; Executes immediately on first call
      inThrottle = true; // Set throttle flag; Prevents further calls during throttle period

      setTimeout(() => {
        // Schedule flag reset; Allows next call after limit period
        inThrottle = false; // Reset throttle flag; Re-enables function execution
      }, limit);
    }
  };
}

/**
 * CHECK IF ELEMENT IS IN VIEWPORT: Determines if element is visible on screen
 * @param {Element} element - DOM element to check; The element we want to detect visibility for
 * @returns {boolean} True if element is in viewport; Indicates visibility status
 * WHY: Used for scroll animations to trigger when elements come into view
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect(); // Get element position relative to viewport; Returns size and position data

  return (
    rect.top >= 0 && // Top edge is below viewport top; Element is not scrolled past
    rect.left >= 0 && // Left edge is to the right of viewport left; Element is horizontally visible
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && // Bottom edge is above viewport bottom; Element hasn't scrolled out of view
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) // Right edge is to the left of viewport right; Element is fully horizontally visible
  );
  // All conditions must be true; Ensures element is completely in viewport
}

// =====================================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// =====================================================

/**
 * SMOOTH SCROLL IMPLEMENTATION: Creates polished navigation experience
 * WHY: Native browser jump is jarring; Smooth scrolling provides professional, pleasant UX
 */
function initSmoothScroll() {
  // Select all anchor links that point to IDs (internal page links); Targets navigation and in-page links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  // Add click event listener to each anchor link; Intercepts default link behavior
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Event listener callback; Fires when link is clicked

      const href = this.getAttribute('href'); // Get the link's href value; Contains the target element ID

      // Check if href is just '#' or empty; Prevents errors with placeholder links
      if (href === '#' || href === '') {
        e.preventDefault(); // Prevent default jump; Stops browser from doing anything
        return; // Exit function; No scrolling needed for empty anchors
      }

      const targetElement = document.querySelector(href); // Find the target element by ID; Gets the element to scroll to

      // If target element exists on the page; Ensures element is present before scrolling
      if (targetElement) {
        e.preventDefault(); // Prevent default jump behavior; Stops instant jump to allow smooth scroll

        // Get the navigation bar to account for sticky header offset; Prevents content from hiding behind nav
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 0; // Get nav height or 0 if no nav; Calculates offset needed

        // Calculate target scroll position accounting for nav height; Positions content below sticky nav
        const targetPosition = targetElement.offsetTop - navHeight - 20; // 20px extra padding for breathing room; Prevents content from touching nav

        // Smooth scroll to target position; Uses built-in smooth scrolling API
        window.scrollTo({
          top: targetPosition, // Vertical scroll position; Where to scroll to
          behavior: 'smooth' // Smooth animation; Creates gradual scroll instead of instant jump
        });

        // Update URL without jumping; Changes URL to reflect current section
        if (history.pushState) {
          // Check if browser supports History API; Ensures compatibility
          history.pushState(null, null, href); // Update URL in address bar; Allows bookmarking and sharing of specific sections
        }
      }
    });
  });
}

// =====================================================
// SCROLL ANIMATIONS (FADE IN ON SCROLL)
// =====================================================

/**
 * SCROLL REVEAL ANIMATIONS: Animates elements as they enter viewport
 * WHY: Creates engaging, dynamic experience; Draws attention to content as user scrolls
 */
function initScrollAnimations() {
  // Select all cards for animation; Targets main content containers
  const cards = document.querySelectorAll('.card');

  // Initially hide cards that will animate; Prepares them for reveal animation
  cards.forEach((card, index) => {
    // Loop through each card with index; Index used for stagger effect

    // Add initial invisible state; CSS will transition to visible
    card.style.opacity = '0'; // Start invisible; Will fade in
    card.style.transform = 'translateY(30px)'; // Start below final position; Will slide up
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`; // Staggered animation; Each card delays slightly more than previous
  });

  /**
   * CHECK AND ANIMATE CARDS: Reveals cards when they enter viewport
   * WHY: Triggered by scroll to create progressive reveal effect
   */
  function checkAndAnimateCards() {
    cards.forEach(card => {
      // Loop through all cards; Check each one's visibility

      if (isInViewport(card)) {
        // If card is visible in viewport; Time to animate it
        card.style.opacity = '1'; // Fade to fully visible; Completes fade-in
        card.style.transform = 'translateY(0)'; // Move to final position; Completes slide-up
      }
    });
  }

  // Check on page load in case some cards are already visible; Animates cards in initial viewport
  checkAndAnimateCards();

  // Check on scroll with throttling for performance; Prevents excessive function calls
  window.addEventListener('scroll', throttle(checkAndAnimateCards, 100)); // 100ms throttle; Limits checks to every 100ms for smooth performance
}

// =====================================================
// ACTIVE NAVIGATION HIGHLIGHTING
// =====================================================

/**
 * NAVIGATION HIGHLIGHT: Updates active nav link based on scroll position
 * WHY: Provides visual feedback showing user's current page section
 */
function initActiveNavigation() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]'); // Select nav links pointing to page sections; Targets only internal navigation
  const sections = document.querySelectorAll('section[id]'); // Select all sections with IDs; These are the scrollable sections to track

  /**
   * UPDATE ACTIVE LINK: Highlights navigation link for current section
   * WHY: Called on scroll to keep navigation in sync with scroll position
   */
  function updateActiveLink() {
    let currentSection = ''; // Store the current section ID; Tracks which section is in view

    // Find which section is currently in viewport; Determines active section
    sections.forEach(section => {
      const sectionTop = section.offsetTop; // Get section's top position; Starting point of section
      const sectionHeight = section.clientHeight; // Get section height; Total height of section
      const scrollPosition = window.pageYOffset; // Get current scroll position; How far user has scrolled

      // Get nav height to account for sticky header; Adjusts for fixed navigation
      const nav = document.querySelector('nav');
      const navHeight = nav ? nav.offsetHeight : 0;

      // Check if scroll position is within this section; Determines if section is active
      if (scrollPosition >= sectionTop - navHeight - 100 && scrollPosition < sectionTop + sectionHeight - navHeight) {
        currentSection = section.getAttribute('id'); // Store current section ID; This is the active section
      }
    });

    // Update nav link styling; Apply active class to current section's link
    navLinks.forEach(link => {
      link.classList.remove('active'); // Remove active class from all links; Reset before adding to current

      const href = link.getAttribute('href'); // Get link's target; The section it points to
      if (href === `#${currentSection}`) {
        // If link matches current section; This is the active link
        link.classList.add('active'); // Add active class; Highlights current section in nav
      }
    });
  }

  // Update on scroll with throttling; Keeps nav updated as user scrolls
  window.addEventListener('scroll', throttle(updateActiveLink, 100)); // 100ms throttle; Balances responsiveness with performance

  // Initial update on page load; Sets correct active link on page load
  updateActiveLink();
}

// =====================================================
// LAZY LOADING IMAGES
// =====================================================

/**
 * LAZY LOAD IMAGES: Loads images only when near viewport
 * WHY: Improves initial page load performance; Images load only when needed
 * NOTE: Modern browsers support native lazy loading (loading="lazy" attribute)
 * This function provides fallback for older browsers
 */
function initLazyLoading() {
  // Check if browser supports native lazy loading; Modern browsers have this built-in
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported; Use browser's built-in lazy loading

    const images = document.querySelectorAll('img[loading="lazy"]'); // Select images with loading attribute; These will lazy load automatically
    images.forEach(img => {
      if (img.dataset.src) {
        // Check if image has data-src; Fallback for images using data attributes
        img.src = img.dataset.src; // Set actual src from data-src; Triggers image loading
      }
    });
  } else {
    // Native lazy loading not supported; Implement custom lazy loading

    const images = document.querySelectorAll('img[data-src]'); // Select images with data-src attribute; These need custom lazy loading

    /**
     * LAZY LOAD IMAGE: Loads image when it enters viewport
     * @param {Element} img - Image element to lazy load
     * WHY: Only loads images when user is about to see them
     */
    function lazyLoad(img) {
      img.src = img.dataset.src; // Set actual src from data-src; Triggers image download
      img.removeAttribute('data-src'); // Remove data-src attribute; Marks image as loaded
    }

    // Create Intersection Observer for efficient lazy loading; Modern API for detecting element visibility
    if ('IntersectionObserver' in window) {
      // Check if IntersectionObserver is supported; Most modern browsers support this

      const imageObserver = new IntersectionObserver((entries) => {
        // Create observer instance; Watches for images entering viewport

        entries.forEach(entry => {
          // Loop through observed elements; Check each image
          if (entry.isIntersecting) {
            // If image is entering viewport; Time to load it
            lazyLoad(entry.target); // Load the image; Triggers download
            imageObserver.unobserve(entry.target); // Stop observing this image; No longer needed after loading
          }
        });
      });

      images.forEach(img => imageObserver.observe(img)); // Observe all lazy images; Start watching for viewport entry
    } else {
      // Fallback for browsers without IntersectionObserver; Use scroll events instead

      function checkLazyImages() {
        images.forEach(img => {
          if (isInViewport(img)) {
            // If image is in viewport; Load it
            lazyLoad(img);
          }
        });
      }

      window.addEventListener('scroll', throttle(checkLazyImages, 200)); // Check on scroll; Throttled for performance
      checkLazyImages(); // Initial check; Load any images already in viewport
    }
  }
}

// =====================================================
// PERFORMANCE OPTIMIZATION: REDUCE REFLOWS AND REPAINTS
// =====================================================

/**
 * OPTIMIZE ANIMATIONS: Prevents layout thrashing during animations
 * WHY: Improves animation performance by batching DOM reads and writes
 */
function optimizePerformance() {
  // Use requestAnimationFrame for smooth animations; Syncs with browser's repaint cycle
  let ticking = false; // Flag to prevent multiple rAF calls; Ensures we only have one rAF scheduled

  /**
   * OPTIMIZED SCROLL HANDLER: Batches scroll event handling
   * WHY: Prevents multiple expensive operations per frame
   */
  function onScroll() {
    if (!ticking) {
      // If we don't have a rAF scheduled; Prevent duplicate scheduling
      window.requestAnimationFrame(() => {
        // Schedule for next animation frame; Runs at optimal timing for smooth performance
        // Scroll-based operations would go here; Placeholder for future scroll effects
        ticking = false; // Reset flag; Allow next rAF to be scheduled
      });
      ticking = true; // Set flag; Prevents scheduling another rAF before this one executes
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true }); // Passive listener improves scroll performance; Tells browser this won't call preventDefault()
}

// =====================================================
// LOADING ANIMATION
// =====================================================

/**
 * PAGE LOAD ANIMATION: Smooth transition when page loads
 * WHY: Creates polished initial experience; Masks content loading
 */
function initPageLoad() {
  // Add loaded class to body when page is fully loaded; Triggers CSS animations
  window.addEventListener('load', () => {
    document.body.classList.add('loaded'); // Add loaded class; CSS can use this to trigger transitions

    // Remove any loading indicators if they exist; Hides loading spinner or overlay
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.opacity = '0'; // Fade out loader; Smooth transition
      setTimeout(() => {
        loader.style.display = 'none'; // Hide loader; Remove from layout after fade
      }, 300); // Wait for fade animation; Matches CSS transition duration
    }
  });
}

// =====================================================
// CONSOLE MESSAGE (EASTER EGG FOR DEVELOPERS)
// =====================================================

/**
 * DEVELOPER EASTER EGG: Friendly message in console
 * WHY: Fun touch for developers who inspect the site; Shows attention to detail
 */
function initConsoleMessage() {
  // Check if console is available; Prevents errors in older browsers
  if (console && console.log) {
    console.log('%c👋 Hello, Developer!', 'color: #075AAB; font-size: 20px; font-weight: bold;'); // Styled console message; Catches developer's attention
    console.log('%cInterested in the code? Check out the GitHub repository!', 'color: #2C3E50; font-size: 14px;'); // Second message; Invites exploration
    console.log('%chttps://github.com/samarthsoni17', 'color: #3A7BC8; font-size: 14px;'); // GitHub link; Directs to repository
  }
}

// =====================================================
// HANDLE EXTERNAL LINKS
// =====================================================

/**
 * EXTERNAL LINK HANDLING: Opens external links in new tabs safely
 * WHY: Improves UX by keeping site open while opening references; Adds security attributes
 */
function initExternalLinks() {
  // Select all links pointing to external domains; Finds links to other websites
  const externalLinks = document.querySelectorAll('a[href^="http"]');

  externalLinks.forEach(link => {
    // Get the link's hostname; Extract domain
    const linkHost = new URL(link.href).hostname;
    const currentHost = window.location.hostname;

    // If link points to external domain; Check if it's not internal
    if (linkHost !== currentHost) {
      link.setAttribute('target', '_blank'); // Open in new tab; Keeps current site open
      link.setAttribute('rel', 'noopener noreferrer'); // Security attributes; Prevents window.opener exploit and removes referrer
    }
  });
}

// =====================================================
// KEYBOARD NAVIGATION ENHANCEMENT
// =====================================================

/**
 * KEYBOARD NAVIGATION: Improves accessibility for keyboard users
 * WHY: Ensures site is fully navigable without mouse; Critical for accessibility
 */
function initKeyboardNav() {
  // Add visible focus styles for keyboard navigation; Makes focus state obvious
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      // If Tab key is pressed; User is navigating with keyboard
      document.body.classList.add('keyboard-nav'); // Add class to show focus outlines; CSS can style focus states
    }
  });

  // Remove focus styles when mouse is used; Cleaner appearance for mouse users
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav'); // Remove class; Hides focus outlines for mouse interaction
  });

  // Escape key closes any open modals or overlays; Standard UX pattern
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // If Escape key is pressed; User wants to close overlays
      // Close any modals or overlays here; Placeholder for future modal functionality
      const modals = document.querySelectorAll('.modal.active');
      modals.forEach(modal => modal.classList.remove('active'));
    }
  });
}

// =====================================================
// INITIALIZATION
// =====================================================

/**
 * INITIALIZE ALL FEATURES: Main initialization function
 * WHY: Central place to initialize all interactive features; Ensures proper execution order
 */
function init() {
  // Wait for DOM to be fully loaded before initializing; Ensures all elements exist
  if (document.readyState === 'loading') {
    // DOM is still loading; Wait for it
    document.addEventListener('DOMContentLoaded', initializeFeatures); // Run when DOM is ready; Ensures elements are available
  } else {
    // DOM is already loaded; Run immediately
    initializeFeatures();
  }
}

/**
 * INITIALIZE ALL FEATURES: Calls all initialization functions
 * WHY: Organized approach to feature initialization; Makes codebase maintainable
 */
function initializeFeatures() {
  // Initialize all features in logical order; Some features may depend on others

  initSmoothScroll(); // Enable smooth scrolling; Must run early for immediate effect
  initScrollAnimations(); // Set up scroll-based animations; Depends on elements being in DOM
  initActiveNavigation(); // Enable navigation highlighting; Needs sections to be present
  initLazyLoading(); // Set up lazy loading; Improves performance
  initPageLoad(); // Handle page load animations; Runs once on load
  initExternalLinks(); // Configure external links; Security and UX enhancement
  initKeyboardNav(); // Enhance keyboard navigation; Accessibility feature
  initConsoleMessage(); // Show developer message; Fun easter egg
  optimizePerformance(); // Set up performance optimizations; Improves overall responsiveness

  console.log('✅ All features initialized successfully!'); // Confirmation message; Helpful for debugging
}

// =====================================================
// RUN INITIALIZATION
// =====================================================
// Start the initialization process; Entry point for all JavaScript functionality
init();

/**
 * =====================================================
 * END OF MAIN JAVASCRIPT FILE
 * =====================================================
 * Total features implemented:
 * 1. Smooth scrolling for anchor links
 * 2. Scroll-based reveal animations
 * 3. Active navigation highlighting
 * 4. Lazy loading images (with fallback)
 * 5. Performance optimizations
 * 6. Page load animations
 * 7. External link handling
 * 8. Keyboard navigation enhancements
 * 9. Developer console easter egg
 * 10. Utility functions (debounce, throttle, viewport check)
 *
 * All features are fully commented explaining WHAT each line does and WHY
 * =====================================================
 */
