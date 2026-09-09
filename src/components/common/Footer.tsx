import React from 'react';
import { GraduationCap, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer inline-flex"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {t('siteName')}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A modern, privacy-first scholarship discovery platform dedicated to helping students
              in Gujarat and across India discover financial aid opportunities that match their
              background and aspirations.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-900/80 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free · No registration or login required</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Scholarship Programs
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('gujarat')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Gujarat Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-india')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  All India Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find')}
                  className="hover:text-blue-400 transition-colors text-left font-medium text-blue-400"
                >
                  Find My Scholarships →
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-scholarships')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  All Scholarships Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Saved Scholarships
                </button>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Official Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://mysy.guj.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  MYSY Gujarat <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digitalgujarat.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  Digital Gujarat Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  National Scholarship Portal (NSP) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  About VidyaSetu
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Important Disclaimer:</strong> {t('disclaimer')}
          </p>
          <p className="text-slate-500">
            VidyaSetu is an independent educational discovery tool and does not process applications or disburse funds directly. Always verify current notifications on respective official government and organizational portals.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VidyaSetu. Built for students with transparency.</p>
          <p className="flex items-center gap-1">
            Empowering students across Gujarat & India <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
