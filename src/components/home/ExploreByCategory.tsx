import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Users,
  Award,
  Layers,
  HeartHandshake,
  Heart,
  Cpu,
  BookmarkCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface ExploreByCategoryProps {
  onSelectCategory: (filterType: string, filterValue: string) => void;
}

export const ExploreByCategory: React.FC<ExploreByCategoryProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'ug',
      name: 'Undergraduate',
      description: 'B.E., B.Tech, MBBS, B.Sc, B.Com, B.A.',
      filterType: 'education',
      filterValue: 'Undergraduate',
      icon: GraduationCap,
      badge: 'Most Popular',
    },
    {
      id: 'diploma',
      name: 'Diploma',
      description: 'Polytechnic & technical diploma streams',
      filterType: 'education',
      filterValue: 'Diploma',
      icon: Layers,
    },
    {
      id: 'girls',
      name: 'Girls / Women',
      description: 'AICTE Pragati, Kanya Kelavani, Kotak Kanya',
      filterType: 'gender',
      filterValue: 'Female',
      icon: Heart,
      badge: 'Special Grants',
    },
    {
      id: 'technical',
      name: 'Technical Education',
      description: 'Engineering, Technology, Architecture, Pharmacy',
      filterType: 'type',
      filterValue: 'Technical',
      icon: Cpu,
    },
    {
      id: 'merit',
      name: 'Merit-Based',
      description: 'DST INSPIRE, CMSS, PM-USP CSSS',
      filterType: 'type',
      filterValue: 'Merit',
      icon: Award,
    },
    {
      id: 'need',
      name: 'Need-Based / Means',
      description: 'Financial hardship & tuition assistance',
      filterType: 'type',
      filterValue: 'Need-based',
      icon: HeartHandshake,
    },
    {
      id: 'sc-st',
      name: 'SC / ST Scholarships',
      description: 'Digital Gujarat Post-Matric & central welfare',
      filterType: 'category',
      filterValue: 'SC',
      icon: Users,
    },
    {
      id: 'ews-sebc',
      name: 'EWS / OBC / SEBC',
      description: 'Tuition subsidies & maintenance allowances',
      filterType: 'category',
      filterValue: 'SEBC/OBC',
      icon: ShieldCheck,
    },
    {
      id: 'school',
      name: 'Schooling (9-12)',
      description: 'Pre-matric and post-matric board students',
      filterType: 'education',
      filterValue: 'School',
      icon: BookOpen,
    },
    {
      id: 'pg',
      name: 'Postgraduate',
      description: 'M.E., M.Tech, MBA, M.Sc, M.A., MD',
      filterType: 'education',
      filterValue: 'Postgraduate',
      icon: BookmarkCheck,
    },
    {
      id: 'phd',
      name: 'PhD & Research',
      description: 'SHODH Fellowship & doctoral research grants',
      filterType: 'education',
      filterValue: 'PhD',
      icon: Sparkles,
      badge: 'Fellowships',
    },
    {
      id: 'disability',
      name: 'Disability / Divyang',
      description: 'AICTE Saksham & special assistance aid',
      filterType: 'type',
      filterValue: 'Special',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 bg-[#FAF8F5] dark:bg-[#0C1513] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] dark:text-emerald-400">
            Browse By Focus Area
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial mt-1">
            Explore Scholarships by Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
            Click on any segment to view matching verified scholarship programs across India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#065F46] dark:text-emerald-400 flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-amber-100 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    {cat.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#065F46] dark:group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-[#1C3630] flex items-center justify-between text-[11px] font-semibold text-[#065F46] dark:text-emerald-400">
                  <span>Explore Schemes</span>
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
