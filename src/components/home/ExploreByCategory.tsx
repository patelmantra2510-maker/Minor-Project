import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  HeartHandshake,
  Cpu,
  BookmarkCheck,
  Heart,
  Users,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface ExploreByCategoryProps {
  onSelectCategory: (filterType: string, filterValue: string) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  filterType: string;
  filterValue: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const ExploreByCategory: React.FC<ExploreByCategoryProps> = ({ onSelectCategory }) => {
  const { t } = useLanguage();

  const categories: CategoryItem[] = [
    {
      id: 'school',
      name: t('categories.school', undefined, 'School'),
      description: t('categories.schoolDesc', undefined, 'Pre-matric and higher secondary (Classes 9–12)'),
      filterType: 'education',
      filterValue: 'School',
      icon: BookOpen,
    },
    {
      id: 'diploma',
      name: t('categories.diploma', undefined, 'Diploma'),
      description: t('categories.diplomaDesc', undefined, 'Polytechnic & technical diploma programs'),
      filterType: 'education',
      filterValue: 'Diploma',
      icon: Layers,
    },
    {
      id: 'iti',
      name: t('categories.iti', undefined, 'ITI'),
      description: t('categories.itiDesc', undefined, 'Industrial Training Institutes & vocational trade certificates'),
      filterType: 'education',
      filterValue: 'ITI',
      icon: Cpu,
    },
    {
      id: 'ug',
      name: t('categories.ug', undefined, 'Undergraduate'),
      description: t('categories.ugDesc', undefined, 'B.E., B.Tech, MBBS, B.Sc, B.Com, B.A. degrees'),
      filterType: 'education',
      filterValue: 'Undergraduate',
      icon: GraduationCap,
    },
    {
      id: 'pg',
      name: t('categories.pg', undefined, 'Postgraduate'),
      description: t('categories.pgDesc', undefined, 'M.Tech, MBA, M.Sc, M.A., MD post-graduate studies'),
      filterType: 'education',
      filterValue: 'Postgraduate',
      icon: BookmarkCheck,
    },
    {
      id: 'phd',
      name: t('categories.phd', undefined, 'PhD'),
      description: t('categories.phdDesc', undefined, 'Doctoral research programs and fellowship grants'),
      filterType: 'education',
      filterValue: 'PhD',
      icon: Sparkles,
    },
    {
      id: 'technical',
      name: t('categories.technical', undefined, 'Technical Education'),
      description: t('categories.technicalDesc', undefined, 'Engineering, Technology, Architecture, Pharmacy schemes'),
      filterType: 'type',
      filterValue: 'Government',
      icon: Cpu,
    },
    {
      id: 'girls',
      name: t('categories.girls', undefined, 'Girls / Women'),
      description: t('categories.girlsDesc', undefined, 'Special female student grants (AICTE Pragati, Kanya Kelavani)'),
      filterType: 'gender',
      filterValue: 'Female',
      icon: Heart,
    },
    {
      id: 'sc-st',
      name: t('categories.scst', undefined, 'SC / ST'),
      description: t('categories.scstDesc', undefined, 'Scheduled Caste & Scheduled Tribe post-matric initiatives'),
      filterType: 'category',
      filterValue: 'SC',
      icon: Users,
    },
    {
      id: 'ews-sebc',
      name: t('categories.ewsSebc', undefined, 'EWS / OBC / SEBC'),
      description: t('categories.ewsSebcDesc', undefined, 'Economically Weaker & Socially Backward class scholarships'),
      filterType: 'category',
      filterValue: 'SEBC/OBC',
      icon: ShieldCheck,
    },
    {
      id: 'merit',
      name: t('categories.merit', undefined, 'Merit Based'),
      description: t('categories.meritDesc', undefined, 'Academic excellence awards & percentile cutoffs'),
      filterType: 'type',
      filterValue: 'Merit',
      icon: Award,
    },
    {
      id: 'need',
      name: t('categories.need', undefined, 'Need Based'),
      description: t('categories.needDesc', undefined, 'Income ceiling and family financial hardship support'),
      filterType: 'type',
      filterValue: 'Need-based',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] dark:bg-[#0C1513] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#065F46] dark:text-emerald-400">
            {t('homePage.categoryEyebrow', undefined, 'Education Discovery')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-stone-100 font-editorial mt-2 tracking-tight">
            {t('homePage.categoryTitle', undefined, 'Explore by Category')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2.5">
            {t('homePage.categorySubtitle', undefined, 'Select an academic tier or scholarship focus to view verified opportunities.')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.filterType, cat.filterValue)}
                className="group p-5 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#065F46] dark:hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-amber-100 transition-colors">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#065F46] dark:group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-[#1C3630] flex items-center justify-between text-[11px] font-semibold text-[#065F46] dark:text-emerald-400">
                  <span>{t('homePage.exploreSchemes', undefined, 'Explore Schemes')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
