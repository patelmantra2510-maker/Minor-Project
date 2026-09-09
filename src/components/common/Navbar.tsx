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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#0C1513]/90 backdrop-blur-md border-b border-[#E8E2D7] dark:border-[#1A2E28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
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
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#065F46] ${
                    isActive
                      ? 'text-[#064E3B] dark:text-emerald-400 bg-emerald-50/80 dark:bg-[#142420] font-bold shadow-2xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-[#064E3B] dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-[#142420]/60'
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
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-[#065F46] dark:bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Language & Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#142420] border border-transparent hover:border-stone-200 dark:hover:border-[#1E3A33] transition-colors flex items-center gap-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                title="Change language"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
                <span className="uppercase">{language}</span>
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
                        {lang === 'hi' && 'हिंदी'}
                        {lang === 'gu' && 'ગુજરાતી'}
                      </span>
                      {language === lang && <span className="text-amber-500 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#142420] border border-transparent hover:border-stone-200 dark:hover:border-[#1E3A33] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#142420] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] dark:bg-[#0C1513] border-b border-stone-200 dark:border-[#1A2E28] px-4 pt-2 pb-6 space-y-1.5 animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const isActive =
              currentRoute === item.route ||
              (item.route === 'explore' && (currentRoute === 'all-scholarships' || currentRoute.startsWith('scholarships/')));

            return (
              <button
                key={item.key}
                onClick={() => handleLinkClick(item.route)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-[#142420] text-[#064E3B] dark:text-emerald-400 font-bold'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#142420]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {item.key === 'saved' && (
                    <Bookmark
                      className={`w-4 h-4 ${
                        savedIds.length > 0 ? 'fill-amber-500 text-amber-500' : 'text-stone-400'
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                </span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
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
