import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './locales/i18n.tsx';
import { typography } from './styles/typography.ts';

// Dynamic typography loader
if (typeof window !== 'undefined') {
  try {
    const linkId = 'dynamic-typography-font-link';
    let linkTag = document.getElementById(linkId) as HTMLLinkElement;
    if (!linkTag && typography.importUrl) {
      linkTag = document.createElement('link');
      linkTag.id = linkId;
      linkTag.rel = 'stylesheet';
      linkTag.href = typography.importUrl;
      document.head.appendChild(linkTag);
    }

    // Dynamic style tag generation to support automatic font-switching across all supported languages
    const styleId = 'dynamic-typography-lang-styles';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    let cssRules = `
      :root {
        --font-sans-family: ${typography.fonts.body};
        --font-heading-family: ${typography.fonts.heading};
        --font-mono-family: ${typography.fonts.mono};
      }
    `;

    Object.entries(typography.languages).forEach(([lang, fonts]) => {
      cssRules += `
        html[lang="${lang}"], :root[lang="${lang}"] {
          --font-sans-family: ${fonts.sans};
          --font-heading-family: ${fonts.serif};
          --font-mono-family: ${fonts.mono};
        }
        html[lang="${lang}"] body, html[lang="${lang}"] input, html[lang="${lang}"] button, html[lang="${lang}"] select, html[lang="${lang}"] textarea, html[lang="${lang}"] .font-sans {
          font-family: ${fonts.sans} !important;
        }
        html[lang="${lang}"] .font-serif {
          font-family: ${fonts.serif} !important;
        }
        html[lang="${lang}"] .font-mono {
          font-family: ${fonts.mono} !important;
        }
      `;
    });

    styleTag.innerHTML = cssRules;
  } catch (err) {
    console.error('Failed to load dynamic typography configurations:', err);
  }
}

// Suppress and ignore benign Vite WebSocket / HMR connection errors and unhandled rejections in preview mode
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      const strReason = reason ? (reason.message || reason.stack || String(reason) || '') : '';
      if (/websocket|ws:\/\/|wss:\/\/|vite|hmr/i.test(strReason)) {
        // Prevent browser console clutter and error triggers for expected sandbox constraints
        event.preventDefault();
        event.stopPropagation();
      }
    } catch (err) {
      // Safe fallback
    }
  });

  window.addEventListener('error', (event) => {
    try {
      const msg = event.message || '';
      const errorStr = event.error ? (event.error.message || event.error.stack || String(event.error) || '') : '';
      if (
        /websocket|ws:\/\/|wss:\/\/|vite|hmr/i.test(msg) ||
        /websocket|ws:\/\/|wss:\/\/|vite|hmr/i.test(errorStr)
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    } catch (err) {
      // Safe fallback
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);


