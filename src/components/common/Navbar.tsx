import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSaved } from '../../context/SavedContext';
import { useLanguage } from '../../context/LanguageContext';
import type { SupportedLanguage } from '../../data/translations';
import {
  GraduationCap,
  Sun,
  Moon,
  Bookmark,
  Menu,
  X,
  Compass,
  Sparkles,
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

  const navLinks = [
    { key: 'home', label: t('home'), route: 'home' },
    { key: 'find', label: t('findScholarships'), route: 'find', highlight: true },
    { key: 'all', label: t('allScholarships'), route: 'all-scholarships' },
    { key: 'gujarat', label: t('gujaratScholarships'), route: 'gujarat' },
    { key: 'national', label: t('allIndiaScholarships'), route: 'all-india' },
    {
      key: 'saved',
      label: `${t('savedScholarships')} (${savedIds.length})`,
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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{t('siteName')}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                  Beta
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Gujarat & All-India Discovery
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive =
                currentRoute === item.route ||
                (item.route === 'home' && currentRoute === '') ||
                (item.route === 'all-scholarships' && currentRoute.startsWith('scholarships/'));

              if (item.highlight) {
                return (
                  <button
                    key={item.key}
                    onClick={() => handleLinkClick(item.route)}
                    className="ml-1 mr-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.key}
                  onClick={() => handleLinkClick(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.key === 'saved' && (
                    <Bookmark
                      className={`w-4 h-4 ${
                        savedIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                  {item.hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
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
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Change language"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {(['en', 'gu', 'hi'] as SupportedLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        language === lang
                          ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>
                        {lang === 'en' && 'English'}
                        {lang === 'gu' && 'ગુજરાતી'}
                        {lang === 'hi' && 'हिंदी'}
                      </span>
                      {language === lang && <span className="text-blue-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.key}
                onClick={() => handleLinkClick(item.route)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  item.highlight
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : isActive
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.key === 'find' && <Compass className="w-4 h-4" />}
                  {item.key === 'saved' && <Bookmark className="w-4 h-4" />}
                  {item.label}
                </span>
                {item.hasBadge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
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
