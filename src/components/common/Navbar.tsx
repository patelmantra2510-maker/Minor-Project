import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
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
  CircleUserRound,
  User,
  LogIn,
  UserPlus,
  LogOut,
  SlidersHorizontal,
  Sparkles,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { savedIds } = useSaved();
  const { openCompareModal } = useCompare();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);


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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (langDropdownOpen || profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [langDropdownOpen, profileDropdownOpen]);

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

            {/* Desktop Auth CTAs: Sign In + Create Account (Hidden when authenticated) */}
            {!loading && !isAuthenticated && (
              <div className="hidden sm:flex items-center gap-1.5 mr-0.5">
                <button
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 dark:text-stone-200 hover:text-[#064E3B] dark:hover:text-emerald-300 hover:bg-stone-100/80 dark:hover:bg-[#182E29] transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title={t('auth.profileDropdown.signIn', undefined, 'Sign In')}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
                  <span>{t('auth.profileDropdown.signIn', undefined, 'Sign In')}</span>
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 shadow-2xs hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title={t('auth.createAccountBtn', undefined, 'Create Account')}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t('auth.createAccountBtn', undefined, 'Create Account')}</span>
                </button>
              </div>
            )}

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

            {/* Profile / Account Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                disabled={loading}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer hover:scale-105 active:scale-95 ${
                  loading
                    ? 'bg-stone-100 dark:bg-[#182E29] border border-[#E8E2D7] dark:border-[#23453E] cursor-default'
                    : isAuthenticated
                    ? 'bg-[#064E3B] text-amber-50 font-bold text-xs shadow-xs border border-emerald-700'
                    : profileDropdownOpen
                    ? 'bg-stone-100 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 border border-stone-300 dark:border-[#23453E]'
                    : 'text-stone-700 dark:text-stone-300 bg-stone-50/80 dark:bg-[#182E29] border border-[#E8E2D7] dark:border-[#23453E] hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
                title={loading ? 'Checking session...' : isAuthenticated ? user?.email : 'Account'}
                aria-label="User Account"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-300 dark:border-stone-600 border-t-[#064E3B] dark:border-t-emerald-400 animate-spin" />
                ) : isAuthenticated ? (
                  <span>{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
                ) : (
                  <CircleUserRound className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#142420] rounded-2xl shadow-xl border border-[#E8E2D7] dark:border-[#1E3A33] py-2 z-50 animate-in fade-in zoom-in-95">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-stone-100 dark:border-[#1E3A33]">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          {t('auth.profileDropdown.yourAccount', undefined, 'Your Account')}
                        </span>
                        <p className="text-xs font-bold text-[#064E3B] dark:text-emerald-300 truncate mt-0.5">
                          {user?.name || 'Student Account'}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('find');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
                          <span>{t('auth.profileDropdown.myProfile', undefined, 'My Profile')}</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('account');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
                          <span>{t('auth.profileDropdown.account', undefined, 'Account')}</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('saved');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>
                            {t('auth.profileDropdown.savedScholarships', undefined, 'Saved Scholarships')}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            openCompareModal();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
                          <span>{t('auth.profileDropdown.compare', undefined, 'Compare')}</span>
                        </button>
                      </div>

                      <div className="border-t border-stone-100 dark:border-[#1E3A33] pt-1">
                        <button
                          onClick={async () => {
                            setProfileDropdownOpen(false);
                            await logout();
                            onNavigate('home');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('auth.profileDropdown.logOut', undefined, 'Log Out')}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-1.5 border-b border-stone-100 dark:border-[#1E3A33] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                          Account
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {t('auth.profileDropdown.guestBadge', undefined, 'Guest Mode')}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('login');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#1C3630] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
                          <span>{t('auth.profileDropdown.signIn', undefined, 'Sign In')}</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('signup');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#064E3B] dark:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{t('auth.profileDropdown.createAccount', undefined, 'Create Account')}</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('find');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#1C3630] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{t('auth.profileDropdown.continueAsGuest', undefined, 'Continue as Guest')}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

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

          {/* Mobile Auth Actions */}
          <div className="pt-2 border-t border-stone-200 dark:border-[#1E3A33] space-y-1">
            {loading ? (
              <div className="px-4 py-2.5 text-xs text-stone-400 dark:text-stone-500 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-stone-300 dark:border-stone-600 border-t-[#064E3B] dark:border-t-emerald-400 animate-spin" />
                <span>Checking session...</span>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-xs text-stone-500 dark:text-stone-400">
                  Signed in as <strong className="text-[#064E3B] dark:text-emerald-300">{user?.name || user?.email}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2 px-4 py-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('account');
                    }}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 text-center flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('auth.profileDropdown.account', undefined, 'Account')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('find');
                    }}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 text-center flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{t('auth.profileDropdown.myProfile', undefined, 'My Profile')}</span>
                  </button>
                </div>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    onNavigate('home');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.profileDropdown.logOut', undefined, 'Log Out')}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="py-2 text-center text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-[#1C3630] rounded-xl"
                >
                  {t('auth.profileDropdown.signIn', undefined, 'Sign In')}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('signup');
                  }}
                  className="py-2 text-center text-xs font-semibold text-amber-50 bg-[#064E3B] rounded-xl"
                >
                  {t('auth.profileDropdown.createAccount', undefined, 'Create Account')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
