import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSaved } from '../../context/SavedContext';
import { useLanguage } from '../../context/LanguageContext';
import type { SupportedLanguage } from '../../data/translations';
import { EdvoraLogo } from './EdvoraLogo';
import {
  Sun,
  Moon,
  Bookmark,
  Menu,
  X,
  Globe,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { savedIds } = useSaved();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Subtle scroll state for floating depth
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [langDropdownOpen]);

  // Navigation: Home, Find Scholarships, Explore Scholarships, ✨ AI, Saved, About
  const navLinks = [
    { key: 'home', label: t('nav.home', undefined, 'Home'), route: 'home' },
    { key: 'find', label: t('nav.findScholarships', undefined, 'Find Scholarships'), route: 'find' },
    { key: 'explore', label: t('nav.exploreScholarships', undefined, 'Explore Scholarships'), route: 'explore' },
    { key: 'ai', label: '✨ ' + t('nav.ai', undefined, 'AI'), route: 'ai' },
    {
      key: 'saved',
      label: t('nav.saved', undefined, 'Saved'),
      route: 'saved',
      badgeCount: savedIds.length,
    },
    { key: 'about', label: t('nav.about', undefined, 'About'), route: 'about' },
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  // Determine active nav item strictly from application route
  const getActiveKey = () => {
    if (currentRoute === 'home' || currentRoute === '') return 'home';
    if (currentRoute === 'find') return 'find';
    if (
      currentRoute === 'explore' ||
      currentRoute === 'all-scholarships' ||
      currentRoute.startsWith('scholarships/') ||
      currentRoute === 'gujarat' ||
      currentRoute === 'all-india'
    ) {
      return 'explore';
    }
    if (currentRoute === 'ai' || currentRoute.startsWith('ai')) return 'ai';
    if (currentRoute === 'saved') return 'saved';
    if (currentRoute === 'about') return 'about';
    return 'home';
  };

  const activeKey = getActiveKey();

  // AnimatedTabs clip-path sliding transition logic
  const navContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const isInitialMount = useRef(true);

  const updateClipPath = () => {
    const container = navContainerRef.current;
    const activeEl = activeTabRef.current;
    if (container && activeEl) {
      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeEl;
      const clipLeft = offsetLeft;
      const clipRight = container.offsetWidth - (offsetLeft + offsetWidth);
      const clipTop = offsetTop;
      const clipBottom = container.offsetHeight - (offsetTop + offsetHeight);

      container.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px round 9999px)`;
    }
  };

  useLayoutEffect(() => {
    const container = navContainerRef.current;
    if (!container) return;

    if (isInitialMount.current) {
      // Immediate snap on initial load without jump or delay
      container.style.transition = 'none';
      updateClipPath();
      const raf = requestAnimationFrame(() => {
        if (container) {
          container.style.transition = 'clip-path 0.28s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        isInitialMount.current = false;
      });
      return () => cancelAnimationFrame(raf);
    } else {
      updateClipPath();
    }
  }, [activeKey, language, savedIds.length]);

  useEffect(() => {
    window.addEventListener('resize', updateClipPath);
    if (document.fonts?.ready) {
      document.fonts.ready.then(updateClipPath);
    }
    return () => window.removeEventListener('resize', updateClipPath);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 select-none px-3 sm:px-6 lg:px-8 ${
        isScrolled ? 'pt-1.5 sm:pt-2' : 'pt-2.5 sm:pt-3'
      }`}
    >
      {/* Floating White Card Container (Subtle Premium Depth) */}
      <div
        className={`max-w-7xl mx-auto bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-2xl transition-all duration-300 px-4 sm:px-6 ${
          isScrolled
            ? 'border border-[#DFD8CC] dark:border-[#23453E] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.45)]'
            : 'border border-[#E8E2D7] dark:border-[#1E3A33] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_-3px_rgba(0,0,0,0.3)]'
        }`}
      >
        <div className="flex items-center justify-between h-16">
          {/* Edvora Logo & Wordmark (Unchanged) */}
          <button
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46] rounded-xl text-left transition-opacity hover:opacity-90 shrink-0"
            aria-label="Edvora Home"
          >
            <div className="hidden sm:block">
              <EdvoraLogo variant="navbar" />
            </div>
            <div className="sm:hidden">
              <EdvoraLogo variant="mobile" />
            </div>
          </button>

          {/* Desktop Navigation Links with AnimatedTabs Clip-Path Transition */}
          <nav className="hidden lg:flex relative items-center">
            {/* 1. Clipped Active Layer (Revealed strictly over the active item via clip-path) */}
            <div
              ref={navContainerRef}
              className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
              style={{ clipPath: 'inset(0 100% 0 0 round 9999px)' }}
              aria-hidden="true"
            >
              <div className="relative flex items-center gap-1 xl:gap-2 w-full h-full bg-[#EAF3EE] dark:bg-[#163328] border border-[#D1E7DD] dark:border-emerald-800/80 shadow-2xs rounded-full">
                {navLinks.map((item) => (
                  <div
                    key={item.key}
                    className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#064E3B] dark:text-emerald-300 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {item.key === 'saved' && (
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          savedIds.length > 0 ? 'fill-amber-500 text-amber-500' : 'text-[#065F46] dark:text-emerald-400'
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-200 text-amber-950 dark:bg-amber-900/70 dark:text-amber-200 border border-amber-400/80 dark:border-amber-600/60 leading-none shadow-2xs">
                        {item.badgeCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Base Layer (Interactive buttons with subtle hover feedback & accessibility) */}
            <div className="relative flex items-center gap-1 xl:gap-2">
              {navLinks.map((item) => {
                const isActive = activeKey === item.key;

                return (
                  <button
                    key={item.key}
                    ref={isActive ? activeTabRef : null}
                    onClick={() => handleLinkClick(item.route)}
                    className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 relative flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer text-stone-700 dark:text-stone-300 hover:text-[#065F46] dark:hover:text-emerald-300 hover:bg-stone-100/70 dark:hover:bg-[#1C3630]/60 hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    {item.key === 'saved' && (
                      <Bookmark
                        className={`w-3.5 h-3.5 transition-colors ${
                          savedIds.length > 0 ? 'fill-amber-500 text-amber-500' : 'text-stone-400 group-hover:text-stone-600'
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-[#2A2315] dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50 leading-none shadow-2xs">
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right Action Icons: Language, Divider & Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer ${
                  langDropdownOpen
                    ? 'bg-stone-100 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 border border-stone-200 dark:border-[#1E3A33]'
                    : 'text-stone-700 dark:text-stone-300 hover:text-[#064E3B] dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-[#1C3630]/60 border border-transparent'
                }`}
                title="Change language"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 stroke-[2]" />
                <span className="uppercase text-xs font-semibold tracking-wide">{language}</span>
                <ChevronDown
                  className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${
                    langDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#142420] rounded-2xl shadow-xl border border-[#E8E2D7] dark:border-[#1E3A33] py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {(['en', 'hi', 'gu'] as SupportedLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-stone-50 dark:hover:bg-[#1C3630] transition-colors ${
                        language === lang
                          ? 'text-[#064E3B] dark:text-emerald-400 font-bold bg-emerald-50/70 dark:bg-emerald-950/40'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>
                        {lang === 'en' && 'English'}
                        {lang === 'hi' && 'हिन्दी (Hindi)'}
                        {lang === 'gu' && 'ગુજરાતી (Gujarati)'}
                      </span>
                      {language === lang && (
                        <span className="text-xs text-[#064E3B] dark:text-emerald-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtle Vertical Divider */}
            <span className="h-4 w-[1px] bg-stone-200 dark:bg-[#1E3A33] mx-1 hidden sm:inline-block" />

            {/* Theme Toggle (Premium Compact Circular Control) */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-400 bg-stone-50/80 dark:bg-[#182E29] border border-[#E8E2D7] dark:border-[#23453E] hover:border-amber-300 dark:hover:border-amber-600/60 hover:bg-amber-50/60 dark:hover:bg-[#203D34] shadow-2xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 stroke-[2]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20 stroke-[2]" />
              )}
            </button>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1C3630] focus:outline-none focus:ring-2 focus:ring-[#065F46] ml-1 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#064E3B] dark:text-emerald-400" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Preserved Responsive UX) */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-2xl shadow-xl p-3 sm:p-4 space-y-1 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const isActive = activeKey === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleLinkClick(item.route)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'text-[#064E3B] dark:text-emerald-300 bg-[#EAF3EE] dark:bg-[#163328] font-bold border border-[#D1E7DD] dark:border-emerald-800/70'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630]/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.key === 'saved' && (
                    <Bookmark
                      className={`w-4 h-4 ${
                        savedIds.length > 0 ? 'fill-amber-500 text-amber-500' : 'text-stone-400'
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                </div>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-[#2A2315] dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50 leading-none">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
