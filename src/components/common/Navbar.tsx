import React, { useState } from 'react';
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

  // Exact required navigation: Home, Find Scholarships, Explore Scholarships, Saved, About
  const navLinks = [
    { key: 'home', label: t('home'), route: 'home' },
    { key: 'find', label: t('findScholarships'), route: 'find' },
    { key: 'explore', label: t('exploreScholarships'), route: 'explore' },
    {
      key: 'saved',
      label: t('saved'),
      route: 'saved',
      badgeCount: savedIds.length,
    },
    { key: 'about', label: t('about'), route: 'about' },
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 pt-2 sm:pt-3 px-3 sm:px-6 lg:px-8 transition-colors select-none">
      {/* Floating White Card Container (Matching Reference Mockup) */}
      <div className="max-w-7xl mx-auto bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md border border-[#E8E2D7] dark:border-[#1E3A33] rounded-2xl shadow-xs px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Edvora Logo & Wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46] rounded-xl text-left transition-opacity hover:opacity-90"
            aria-label="Edvora Home"
          >
            <div className="hidden sm:block">
              <EdvoraLogo variant="navbar" />
            </div>
            <div className="sm:hidden">
              <EdvoraLogo variant="mobile" />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive =
                currentRoute === item.route ||
                (item.route === 'home' && currentRoute === '') ||
                (item.route === 'explore' &&
                  (currentRoute === 'all-scholarships' || currentRoute.startsWith('scholarships/')));

              return (
                <button
                  key={item.key}
                  onClick={() => handleLinkClick(item.route)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer ${
                    isActive
                      ? 'text-[#064E3B] dark:text-emerald-300 bg-[#EAF3EE] dark:bg-emerald-950/70 border border-[#D1E7DD] dark:border-emerald-800/80 shadow-2xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-[#064E3B] dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-[#1C3630]'
                  }`}
                >
                  {item.key === 'saved' && (
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedIds.length > 0 ? 'fill-amber-500 text-amber-500' : 'text-stone-400'
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Language, Divider & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 py-1.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1C3630] border border-transparent hover:border-stone-200 dark:hover:border-[#1E3A33] transition-colors flex items-center gap-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer"
                title="Change language"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#142420] rounded-2xl shadow-xl border border-stone-200 dark:border-[#1E3A33] py-1.5 z-50 animate-in fade-in zoom-in-95">
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
            <span className="h-5 w-[1px] bg-stone-200 dark:bg-[#1E3A33] mx-0.5 hidden sm:inline-block" />

            {/* Theme Toggle (Warm Gold Sun in light mode, Moon in dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-[#1C3630] transition-colors focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              )}
            </button>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#142420] focus:outline-none focus:ring-2 focus:ring-[#065F46] ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-2xl shadow-xl p-4 space-y-1 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const isActive =
              currentRoute === item.route ||
              (item.route === 'home' && currentRoute === '') ||
              (item.route === 'explore' &&
                (currentRoute === 'all-scholarships' || currentRoute.startsWith('scholarships/')));

            return (
              <button
                key={item.key}
                onClick={() => handleLinkClick(item.route)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'text-[#064E3B] dark:text-emerald-300 bg-[#EAF3EE] dark:bg-[#1C3630] font-bold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630]/60'
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
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
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
