// Logo configuration
/* @tweakable logo size factor (higher = bigger logo) */
const logoSizeFactor = 1.11;

/* @tweakable hover scale amount for logo */
const hoverScaleAmount = 1.05;

/* @tweakable background color for logo hover */
const hoverBackgroundColor = "var(--hover)";

/* @tweakable border radius for logo */
const logoBorderRadius = "6px";

/* @tweakable padding for logo */
const logoPadding = "0 6px";

/* @tweakable height for logo container */
const logoHeight = `${38 * logoSizeFactor}px`;

/* @tweakable margin values for logo */
const logoMargin = "0 8px 0 6px";

/* @tweakable animation duration for logo hover */
const hoverTransitionDuration = "0.2s";

/* @tweakable button hover scale amount */
const buttonHoverScale = 1.05;

/* @tweakable search box font size */
const searchBoxFontSize = "17px";

/* @tweakable search box text color */
const searchBoxTextColor = "#444444";

/* @tweakable search box font family */
const searchBoxFontFamily = "'Balsamiq Sans', cursive";

/* @tweakable SVG stroke width for icons */
const svgStrokeWidth = 1.75;

/* @tweakable SVG stroke color */
const svgStrokeColor = "#000000";

/* @tweakable Left buttons spacing (higher value increases space between buttons) */
const leftButtonsSpacing = "8px";

/* @tweakable Notification button position (adjust left/right margins) */
const notificationButtonPosition = {left: "6px", right: "6px"};

/* @tweakable Left buttons margin (negative value moves buttons left) */
const leftButtonsMargin = "-12px";

/* @tweakable Right buttons margin (negative value moves buttons right) */
const rightButtonsMargin = "-px";

/* @tweakable Search box left and right margins */
const searchBoxMargins = "0 10px 0 6px";

/* @tweakable notification button size (pixels) */
const notificationButtonSize = 40;

/* @tweakable sidebar opener button size */
const sidebarOpenerButtonSize = 38;

/* @tweakable settings button size */
const settingsButtonSize = 38;

/* @tweakable settings button icon size */
const settingsIconSize = 22;

/* @tweakable sidebar button icon type (options: "hamburger", "arrow") */
const sidebarIconType = "hamburger";

/* @tweakable sidebar icon width */
const sidebarIconWidth = 24;

/* @tweakable sidebar icon height */
const sidebarIconHeight = 24;

/* @tweakable sidebar icon stroke width */
const sidebarIconStrokeWidth = 2;

/* @tweakable sidebar icon color */
const sidebarIconColor = "currentColor";

/* @tweakable settings button position */
const settingsButtonPosition = {left: "4px", right: "4px"};

document.addEventListener('DOMContentLoaded', () => {
  setupLogoInteraction();
  setupSettingsPopup();
  setupButtonInteractions();
  setupSearchBox();
  updateSvgStyles();
  adjustButtonPositions();
  adjustNotificationButton();
});

function setupLogoInteraction() {
  const logoLink = document.getElementById('logoLink');
  
  // Apply styles from configuration
  logoLink.style.borderRadius = logoBorderRadius;
  logoLink.style.padding = logoPadding;
  logoLink.style.height = logoHeight;
  logoLink.style.margin = logoMargin;
  logoLink.style.transition = `all ${hoverTransitionDuration} ease`;
  
  // Setup click handler to change favicon
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    changeFavicon();
  });
  
  // Setup hover interactions
  logoLink.addEventListener('mouseover', (e) => {
    e.currentTarget.style.transform = `scale(${hoverScaleAmount})`;
    e.currentTarget.style.backgroundColor = hoverBackgroundColor;
  });
  
  logoLink.addEventListener('mouseout', (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.backgroundColor = 'transparent';
  });
  
  // Make the logo bigger according to the size factor
  const logoImg = logoLink.querySelector('img');
  if (logoImg) {
    logoImg.style.height = `${100 * logoSizeFactor}%`;
  }
}

function setupButtonInteractions() {
  // Add hover effects to all nav buttons
  const navButtons = document.querySelectorAll('.nav-button');
  navButtons.forEach(button => {
    button.addEventListener('mouseover', (e) => {
      e.currentTarget.style.transform = `scale(${buttonHoverScale})`;
    });
    
    button.addEventListener('mouseout', (e) => {
      e.currentTarget.style.transform = 'scale(1)';
    });
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

function setupSearchBox() {
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    searchBox.style.fontFamily = searchBoxFontFamily;
    searchBox.style.fontSize = searchBoxFontSize;
    searchBox.style.color = searchBoxTextColor;
    // Update placeholder to match the edit functionality
    searchBox.placeholder = "What do you want to make today?";
  }
}

function updateSvgStyles() {
  // Update all SVG paths to have thicker strokes and black color
  const svgPaths = document.querySelectorAll('svg path');
  svgPaths.forEach(path => {
    path.setAttribute('stroke-width', svgStrokeWidth);
    path.setAttribute('stroke', svgStrokeColor);
  });
}

function adjustButtonPositions() {
  // Adjust left buttons
  const leftButtons = document.querySelectorAll('.nav-button.left');
  leftButtons.forEach(button => {
    button.style.marginLeft = leftButtonsMargin;
    button.style.marginRight = leftButtonsSpacing;
  });
  
  // Adjust right buttons
  const rightButtons = document.querySelectorAll('.nav-button.right');
  rightButtons.forEach(button => {
    button.style.marginRight = rightButtonsMargin;
  });
  
  // Adjust search box margins
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    searchContainer.style.margin = searchBoxMargins;
  }
}

function adjustNotificationButton() {
  const notificationButton = document.querySelector('.notification-button');
  if (notificationButton) {
    notificationButton.style.marginLeft = notificationButtonPosition.left;
    notificationButton.style.marginRight = notificationButtonPosition.right;
    notificationButton.style.width = `${notificationButtonSize}px`;
    notificationButton.style.height = `${notificationButtonSize}px`;
  }
  
  // Configure the sidebar opener button
  const sidebarButton = document.querySelector('.nav-button[title="Menu"]');
  if (sidebarButton) {
    sidebarButton.title = "Open Sidebar";
    sidebarButton.style.width = `${sidebarOpenerButtonSize}px`;
    sidebarButton.style.height = `${sidebarOpenerButtonSize}px`;
    
    // Use hamburger menu icon
    if (sidebarIconType === "hamburger") {
      sidebarButton.innerHTML = `
        <svg width="${sidebarIconWidth}" height="${sidebarIconHeight}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12H20M4 6H20M4 18H20" stroke="${sidebarIconColor}" stroke-width="${sidebarIconStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    } else {
      // Arrow icon as fallback
      sidebarButton.innerHTML = `
        <svg width="${sidebarIconWidth}" height="${sidebarIconHeight}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="${sidebarIconColor}" stroke-width="${sidebarIconStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
  }
  
  // Update settings button with new SVG
  const settingsButton = document.querySelector('.nav-button[title="Settings"]');
  if (settingsButton) {
    settingsButton.style.width = `${settingsButtonSize}px`;
    settingsButton.style.height = `${settingsButtonSize}px`;
    settingsButton.style.marginLeft = settingsButtonPosition.left;
    settingsButton.style.marginRight = settingsButtonPosition.right;
    
    // Use settings.svg content
    settingsButton.innerHTML = `
      <svg width="${settingsIconSize}" height="${settingsIconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
  }
}