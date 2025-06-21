import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';

// Language detection configuration
const detectionOptions = {
  // Order of language detection methods
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  
  // Cache user language in localStorage
  caches: ['localStorage'],
  
  // Exclude certain detection methods if needed
  excludeCacheFor: ['cimode'],
  
  // Optional: check for language in URL path
  checkWhitelist: true,
  
  // Fallback language if detection fails
  fallbackLng: 'en',
  
  // Convert language codes (e.g., 'en-US' -> 'en')
  convertDetectedLanguage: (lng) => {
    // Extract main language code (e.g., 'en-US' -> 'en')
    const mainLang = lng.split('-')[0];
    
    // Map supported languages
    const supportedLanguages = ['en', 'hi', 'ar', 'ru'];
    
    // Return the main language if supported, otherwise fallback to English
    return supportedLanguages.includes(mainLang) ? mainLang : 'en';
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language detection
    detection: detectionOptions,
    
    // Fallback language
    fallbackLng: 'en',
    
    // Supported languages
    supportedLngs: ['en', 'hi', 'ar', 'ru'],
    
    // Debug mode (set to false in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Translation resources
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ar: { translation: ar },
      ru: { translation: ru }
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React-specific options
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    
    // Key separator (use '.' for nested keys)
    keySeparator: '.',
    
    // Nested separator for nested objects
    nsSeparator: ':',
    
    // Return empty string for missing keys instead of the key itself
    returnEmptyString: false,
    
    // Return null for missing keys
    returnNull: false,
    
    // Return the key if translation is missing
    returnObjects: false,
    
    // Join arrays with this separator
    joinArrays: false,
    
    // Post-processing
    postProcess: false,
    
    // Pre-processing
    preload: ['en'], // Preload default language
    
    // Clean code on production
    cleanCode: true,
    
    // Lowercase language codes
    lowerCaseLng: true,
    
    // Non-explicit support for whitelist
    nonExplicitSupportedLngs: false,
    
    // Load path for dynamic loading (not used here since we import directly)
    // backend: {
    //   loadPath: '/locales/{{lng}}/{{ns}}.json'
    // }
  });

// Export language utilities
export const getCurrentLanguage = () => i18n.language;
export const changeLanguage = (lng) => i18n.changeLanguage(lng);
export const getSupportedLanguages = () => ['en', 'hi', 'ar', 'ru'];

// Language information for UI
export const languageInfo = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' }
};

// Check if language is RTL
export const isRTL = (lng = getCurrentLanguage()) => {
  return languageInfo[lng]?.dir === 'rtl';
};

// Apply RTL/LTR direction to document
export const applyDirection = (lng = getCurrentLanguage()) => {
  const direction = isRTL(lng) ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
  
  // Add/remove RTL class for CSS styling
  if (isRTL(lng)) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
};

// Listen for language changes and apply direction
i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
});

// Apply initial direction
applyDirection();

export default i18n;
