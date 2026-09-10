import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { EdvoraLogo } from './EdvoraLogo';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const openLegalModal = (type: 'privacy' | 'terms') => {
    if (type === 'privacy') {
      setModalContent({
        title: 'Privacy Policy',
        content:
          'At Edvora, we believe in privacy-by-design. We do not require accounts, logins, or registration. Any information you input into the scholarship questionnaire resides exclusively in your browser session and is never sold, tracked, or stored in a permanent profile database. Local bookmarks and recently viewed records are retained strictly within your local browser storage.',
      });
    } else {
      setModalContent({
        title: 'Terms of Use',
        content:
          'Edvora provides educational discovery and informational eligibility matching free of charge. We do not process official applications or disburse government funds. While we strive for absolute accuracy using verified notifications, final eligibility determinations, document verification, and awards are solely decided by the respective scholarship authorities.',
      });
    }
  };

  return (
    <footer className="bg-[#0A1613] text-stone-300 relative border-t border-[#162B25] mt-20 pt-16 pb-12 transition-colors">
      {/* Editorial Top Accent Line: Forest green to gold to forest green */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#064E3B] via-[#D97706] to-[#064E3B] opacity-75" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#162B25]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer inline-flex group"
            >
              <EdvoraLogo variant="navbar" showTagline={false} />
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed font-normal">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-[#063326] border border-emerald-800/60 px-3.5 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t('footer.freeBadge')}</span>
            </div>
          </div>

          {/* Quick Links strictly as requested */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find')}
                  className="hover:text-amber-400 transition-colors text-left font-semibold text-emerald-400"
                >
                  {t('nav.findScholarships')} →
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t('nav.exploreScholarships')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t('nav.saved')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 text-amber-300 font-semibold"
                >
                  <span>✨ {t('nav.ai', undefined, 'Ask Edvora AI')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Portals & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              {t('footer.officialPortals')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://mysy.guj.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{t('footer.mysyPortal')}</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digitalgujarat.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{t('footer.digitalGujarat')}</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{t('footer.nsp')}</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li className="pt-2 flex items-center gap-3 text-xs text-stone-400">
                <button
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-amber-400 transition-colors underline"
                >
                  {t('footer.privacyPolicy')}
                </button>
                <span>·</span>
                <button
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-amber-400 transition-colors underline"
                >
                  {t('footer.termsOfUse')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="py-6 border-b border-[#162B25] text-xs text-stone-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-stone-200">{t('footer.importantDisclaimer')}</strong> {t('disclaimer')}
          </p>
          <p className="text-stone-500">
            Edvora is an independent educational discovery tool and does not process applications or disburse funds directly. Always verify current notifications on respective official government and organizational portals.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>{t('footer.copyright', { year: String(new Date().getFullYear()) })}</p>
          <p className="flex items-center gap-1">
            {t('footer.empowering')} <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
          </p>
        </div>
      </div>

      {/* Privacy / Terms Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#142420] text-slate-900 dark:text-stone-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 dark:border-[#1E3A33] shadow-2xl">
            <h3 className="text-xl font-bold font-editorial mb-3 text-[#064E3B] dark:text-emerald-400">
              {modalContent.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
              {modalContent.content}
            </p>
            <div className="text-right">
              <button
                onClick={() => setModalContent(null)}
                className="px-5 py-2 rounded-xl bg-[#064E3B] text-amber-50 text-xs font-bold"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
