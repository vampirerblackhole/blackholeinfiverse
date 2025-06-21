import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { getCurrentLanguage, changeLanguage, isRTL, languageInfo } from '../i18n';

/**
 * Custom hook that extends react-i18next's useTranslation with additional utilities
 * @param {string} namespace - Optional namespace for translations
 * @returns {object} Translation utilities and functions
 */
export const useTranslation = (namespace = 'translation') => {
  const { t, i18n, ready } = useI18nextTranslation(namespace);

  /**
   * Enhanced translation function with fallback support
   * @param {string} key - Translation key
   * @param {object} options - Translation options (interpolation, fallback, etc.)
   * @returns {string} Translated text
   */
  const translate = (key, options = {}) => {
    try {
      const translation = t(key, options);
      
      // If translation returns the key itself, it means translation is missing
      if (translation === key && options.fallback) {
        return options.fallback;
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return options.fallback || key;
    }
  };

  /**
   * Get current language code
   * @returns {string} Current language code (e.g., 'en', 'hi', 'ar', 'ru')
   */
  const currentLanguage = getCurrentLanguage();

  /**
   * Change the current language
   * @param {string} lng - Language code to switch to
   * @returns {Promise} Promise that resolves when language is changed
   */
  const switchLanguage = async (lng) => {
    try {
      await changeLanguage(lng);
      
      // Trigger a custom event for components that need to react to language changes
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: lng, isRTL: isRTL(lng) } 
      }));
      
      return true;
    } catch (error) {
      console.error('Error switching language:', error);
      return false;
    }
  };

  /**
   * Check if current language is right-to-left
   * @returns {boolean} True if current language is RTL
   */
  const isCurrentLanguageRTL = isRTL(currentLanguage);

  /**
   * Get language information for the current language
   * @returns {object} Language info (name, nativeName, flag, dir)
   */
  const currentLanguageInfo = languageInfo[currentLanguage];

  /**
   * Get all available languages with their information
   * @returns {object} Object with language codes as keys and language info as values
   */
  const availableLanguages = languageInfo;

  /**
   * Get supported language codes
   * @returns {string[]} Array of supported language codes
   */
  const supportedLanguages = Object.keys(languageInfo);

  /**
   * Format text based on current language direction
   * @param {string} text - Text to format
   * @returns {string} Formatted text
   */
  const formatText = (text) => {
    if (!text) return '';
    
    // For RTL languages, you might want to add specific formatting
    if (isCurrentLanguageRTL) {
      // Add any RTL-specific text formatting here if needed
      return text;
    }
    
    return text;
  };

  /**
   * Get direction class for CSS styling
   * @returns {string} CSS class for direction ('ltr' or 'rtl')
   */
  const directionClass = isCurrentLanguageRTL ? 'rtl' : 'ltr';

  /**
   * Get text alignment based on language direction
   * @returns {string} CSS text-align value
   */
  const textAlign = isCurrentLanguageRTL ? 'right' : 'left';

  /**
   * Get flex direction based on language direction
   * @returns {string} CSS flex-direction value
   */
  const flexDirection = isCurrentLanguageRTL ? 'row-reverse' : 'row';

  /**
   * Translate with automatic fallback to English
   * @param {string} key - Translation key
   * @param {object} options - Translation options
   * @returns {string} Translated text with fallback
   */
  const tWithFallback = (key, options = {}) => {
    const translation = translate(key, options);
    
    // If translation failed and we're not in English, try English fallback
    if (translation === key && currentLanguage !== 'en') {
      try {
        return t(key, { ...options, lng: 'en' });
      } catch (error) {
        console.warn(`Fallback translation failed for key "${key}":`, error);
        return key;
      }
    }
    
    return translation;
  };

  /**
   * Check if translations are loaded and ready
   * @returns {boolean} True if translations are ready
   */
  const isReady = ready;

  /**
   * Get loading state
   * @returns {boolean} True if i18n is still loading
   */
  const isLoading = !ready;

  return {
    // Core translation functions
    t: translate,
    tWithFallback,
    translate,
    
    // Language management
    currentLanguage,
    switchLanguage,
    changeLanguage: switchLanguage, // Alias for consistency
    
    // Language information
    isRTL: isCurrentLanguageRTL,
    languageInfo: currentLanguageInfo,
    availableLanguages,
    supportedLanguages,
    
    // Formatting utilities
    formatText,
    directionClass,
    textAlign,
    flexDirection,
    
    // State
    isReady,
    isLoading,
    
    // Original i18n instance for advanced usage
    i18n
  };
};

export default useTranslation;
