import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSaved } from '../../context/SavedContext';
import { useLanguage } from '../../context/LanguageContext';
import type { SupportedLanguage } from '../../data/translations';
import {
  Sun,
  Moon,
  Bookmark,
  Menu,
  X,
  Sparkles,
  Globe,
  Compass,
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
    { key: 'find', label: t('findScholarships'), route: 'find', highlight: true },
    { key: 'explore', label: t('exploreScholarships'), route: 'explore' },
    {
      key: 'saved',
      label: `${t('saved')} (${savedIds.length})`,
      route: 'saved',
      hasBadge: savedIds.length > 0,
    },
    { key: 'about', label: t('about'), route: 'about' },
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#0C1513]/95 backdrop-blur-md border-b border-[#E8E2D7] dark:border-[#1A2E28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name: Edvora */}
          <div
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-xl p-1"
          >
            {/* Edvora Logo Mark */}
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-[#E2DACB] dark:border-[#1E3A33] group-hover:scale-105 transition-transform bg-white dark:bg-[#142420] flex items-center justify-center">
              <img
                src="/edvora-logo.png"
                alt="Edvora Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to SVG if image not rendered
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-[#064E3B] dark:text-emerald-400 font-editorial flex items-center gap-1.5">
                <span>Edvora</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide uppercase hidden sm:block">
                Scholarships That Fit You
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive =
                currentRoute === item.route ||
                (item.route === 'home' && currentRoute === '') ||
                (item.route === 'explore' && (currentRoute === 'all-scholarships' || currentRoute.startsWith('scholarships/')));

              if (item.highlight) {
                return (
                  <button
                    key={item.key}
                    onClick={() => handleLinkClick(item.route)}
                    className="ml-2 mr-1 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.key}
                  onClick={() => handleLinkClick(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors relative flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isActive
                      ? 'text-[#064E3B] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                      : 'text-stone-700 dark:text-stone-300 hover:text-[#064E3B] dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {item.key === 'saved' && (
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedIds.length > 0 ? 'fill-amber-500 text-amber-500' : ''
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                  {item.hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
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
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  item.highlight
                    ? 'bg-[#064E3B] text-amber-100 font-bold shadow-xs'
                    : isActive
                    ? 'bg-emerald-50 dark:bg-[#142420] text-[#064E3B] dark:text-emerald-400 font-bold'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#142420]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.key === 'find' && <Sparkles className="w-4 h-4 text-amber-400" />}
                  {item.key === 'explore' && <Compass className="w-4 h-4" />}
                  {item.key === 'saved' && <Bookmark className="w-4 h-4" />}
                  {item.label}
                </span>
                {item.hasBadge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                    {savedIds.length}
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
