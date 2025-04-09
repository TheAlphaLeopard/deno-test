// Configuration - Tweakable values
/* @tweakable the size factor for the logo (higher = bigger logo) */
const logoSizeFactor = 1.11;

/* @tweakable hover scale amount for interactive elements */
const hoverScaleAmount = 1.05;

/* @tweakable the size of the search button icon in pixels */
const searchButtonIconSize = 14;

/* @tweakable SVG stroke width for navigation icons */
const svgStrokeWidth = 1.75;

/* @tweakable notification button size (pixels) */
const notificationButtonSize = 40;

/* @tweakable sidebar opener button size (pixels) */
const sidebarOpenerButtonSize = 38;

/* @tweakable settings button size (pixels) */
const settingsButtonSize = 38;

/* @tweakable sidebar icon type (options: "hamburger", "arrow") */
const sidebarIconType = "hamburger";

document.addEventListener('DOMContentLoaded', () => {
  setupLogoInteraction();
  setupSettingsPopup();
  updateSvgStyles();
  updateButtonSizes();
});

function setupLogoInteraction() {
  const logoLink = document.getElementById('logoLink');
  
  // Make the logo bigger according to the size factor
  const logoImg = logoLink.querySelector('img');
  if (logoImg) {
    logoImg.style.height = `${100 * logoSizeFactor}%`;
  }
  
  // Setup click handler to change favicon
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    changeFavicon();
  });
}

function changeFavicon() {
  const favicon = document.querySelector("link[rel='icon']");
  const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
  
  if (favicon) {
    favicon.href = "/generating.ico";
  }
  
  if (appleTouchIcon) {
    appleTouchIcon.href = "/generating.ico";
  }
}

function setupSettingsPopup() {
  const settingsButton = document.getElementById('settingsButton');
  const settingsPopup = document.getElementById('settingsPopup');
  
  // Toggle settings popup when button is clicked
  settingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPopup.classList.toggle('show');
  });
  
  // Close settings popup when clicking outside
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.settings-popup') && !event.target.closest('[title="Settings"]')) {
      settingsPopup.classList.remove('show');
    }
  });
}

function updateSvgStyles() {
  // Update all SVG paths to have configured stroke width
  const svgPaths = document.querySelectorAll('svg path');
  svgPaths.forEach(path => {
    if (path.hasAttribute('stroke')) {
      path.setAttribute('stroke-width', svgStrokeWidth);
    }
  });
  
  // Update search button icon size
  const searchButtonSvg = document.querySelector('.search-button svg');
  if (searchButtonSvg) {
    searchButtonSvg.setAttribute('width', searchButtonIconSize);
    searchButtonSvg.setAttribute('height', searchButtonIconSize);
  }
}

function updateButtonSizes() {
  // Set notification button size
  const notificationButton = document.querySelector('.notification-button');
  if (notificationButton) {
    notificationButton.style.width = `${notificationButtonSize}px`;
    notificationButton.style.height = `${notificationButtonSize}px`;
  }
  
  // Set sidebar button size
  const sidebarButton = document.querySelector('.nav-button[title="Menu"]');
  if (sidebarButton) {
    sidebarButton.style.width = `${sidebarOpenerButtonSize}px`;
    sidebarButton.style.height = `${sidebarOpenerButtonSize}px`;
    
    // Use configured icon type
    updateSidebarIcon(sidebarButton);
  }
  
  // Set settings button size
  const settingsButton = document.querySelector('.nav-button[title="Settings"]');
  if (settingsButton) {
    settingsButton.style.width = `${settingsButtonSize}px`;
    settingsButton.style.height = `${settingsButtonSize}px`;
  }
}

function updateSidebarIcon(sidebarButton) {
  // Use hamburger menu icon or arrow based on configuration
  if (sidebarIconType === "hamburger") {
    sidebarButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12H20M4 6H20M4 18H20" stroke="currentColor" stroke-width="${svgStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else {
    // Arrow icon as fallback
    sidebarButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="${svgStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
}