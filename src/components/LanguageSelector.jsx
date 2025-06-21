import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSelector = ({ 
  className = '', 
  variant = 'default', // 'default', 'compact', 'mobile'
  showFlag = true,
  showNativeName = true,
  position = 'bottom-right' // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  const { 
    currentLanguage, 
    switchLanguage, 
    availableLanguages, 
    supportedLanguages,
    t,
    isRTL 
  } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleLanguageChange = async (languageCode) => {
    setIsOpen(false);
    await switchLanguage(languageCode);
  };

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 200; // Approximate height
    const viewportHeight = window.innerHeight;

    let top = buttonRect.bottom + 8; // 8px gap below button
    let left = buttonRect.right - 200; // Align right edge

    // Adjust if dropdown would go off screen
    if (top + dropdownHeight > viewportHeight) {
      top = buttonRect.top - dropdownHeight - 8; // Show above button
    }

    if (left < 8) {
      left = 8; // Minimum left margin
    }

    setDropdownPosition({ top, left });
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const currentLangInfo = availableLanguages[currentLanguage];

  // Get position classes
  const getPositionClasses = () => {
    const baseClasses = 'fixed z-[99999]';
    switch (position) {
      case 'bottom-left':
        return `${baseClasses}`;
      case 'top-right':
        return `${baseClasses}`;
      case 'top-left':
        return `${baseClasses}`;
      case 'bottom-right':
      default:
        return `${baseClasses}`;
    }
  };

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          button: 'px-2 py-1 text-sm',
          dropdown: 'w-[180px]',
          item: 'px-3 py-2 text-sm'
        };
      case 'mobile':
        return {
          button: 'px-4 py-3 text-base w-full justify-between',
          dropdown: 'w-full max-w-[280px]',
          item: 'px-4 py-3 text-base'
        };
      default:
        return {
          button: 'px-3 py-2 text-sm',
          dropdown: 'w-[200px]',
          item: 'px-4 py-2 text-sm'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Language Selector Button */}
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className={`
          ${styles.button}
          inline-flex items-center gap-2 
          bg-black/20 backdrop-blur-md 
          border border-white/20 rounded-lg 
          text-white hover:bg-white/10 
          transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-orange-500/50
          ${isOpen ? 'bg-white/10' : ''}
          ${isRTL ? 'flex-row-reverse' : ''}
        `}
        aria-label={t('language.selector')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Globe icon for compact variant or when no flag */}
        {(variant === 'compact' || !showFlag) && (
          <Globe size={16} className="text-orange-400" />
        )}
        
        {/* Flag and language info */}
        {showFlag && variant !== 'compact' && (
          <span className="text-lg" role="img" aria-label={currentLangInfo?.name}>
            {currentLangInfo?.flag}
          </span>
        )}
        
        {/* Language name */}
        {variant !== 'compact' && (
          <span className="font-medium">
            {showNativeName ? currentLangInfo?.nativeName : currentLangInfo?.name}
          </span>
        )}
        
        {/* Dropdown arrow */}
        <ChevronDown 
          size={16} 
          className={`text-gray-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu - Rendered via Portal */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className={`
            ${getPositionClasses()}
            ${styles.dropdown}
            bg-black/90 backdrop-blur-md
            border border-white/20 rounded-lg
            shadow-xl shadow-black/50
            animate-in fade-in-0 zoom-in-95 duration-200
          `}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            overflow: 'visible',
            maxHeight: 'none',
            height: 'auto',
            zIndex: 99999,
            position: 'fixed'
          }}
          role="menu"
          aria-orientation="vertical"
        >
          {supportedLanguages.map((langCode) => {
            const langInfo = availableLanguages[langCode];
            const isSelected = langCode === currentLanguage;
            
            return (
              <button
                key={langCode}
                onClick={() => handleLanguageChange(langCode)}
                className={`
                  ${styles.item}
                  w-full text-left flex items-center gap-3
                  hover:bg-white/10 transition-colors duration-150
                  focus:outline-none focus:bg-white/10
                  ${isSelected ? 'bg-orange-500/20 text-orange-300' : 'text-white'}
                  ${isRTL ? 'flex-row-reverse text-right' : ''}
                `}
                role="menuitem"
                aria-current={isSelected ? 'true' : 'false'}
              >
                {/* Flag */}
                <span 
                  className="text-lg flex-shrink-0" 
                  role="img" 
                  aria-label={langInfo.name}
                >
                  {langInfo.flag}
                </span>
                
                {/* Language names */}
                <div className="flex flex-col">
                  <span className="font-medium">
                    {langInfo.nativeName}
                  </span>
                  {langInfo.name !== langInfo.nativeName && (
                    <span className="text-xs text-gray-400">
                      {langInfo.name}
                    </span>
                  )}
                </div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

LanguageSelector.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'compact', 'mobile']),
  showFlag: PropTypes.bool,
  showNativeName: PropTypes.bool,
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
};

export default LanguageSelector;
