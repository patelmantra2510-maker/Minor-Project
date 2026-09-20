import React from 'react';
import { FolderTree, GraduationCap, Layers, ArrowRight } from 'lucide-react';

interface CategoryManagementProps {
  categoriesData: any;
  onFilterCategory: (category: string) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categoriesData,
  onFilterCategory,
}) => {
  const social = categoriesData?.socialCategories || {};
  const education = categoriesData?.educationLevels || {};
  const types = categoriesData?.scholarshipTypes || {};

  return (
    <div className="space-y-8 animate-page-enter">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-white">
          Category Distribution & Taxonomies
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Real-time aggregation of how scholarships in your database map to social categories, education levels, and scheme classifications.
        </p>
      </div>

      {/* Social Categories */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Social Categories
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(social).map(([cat, count]: [string, any]) => (
            <div
              key={cat}
              onClick={() => onFilterCategory(cat)}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {cat}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {count} scholarships eligible
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Education Levels */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Education Levels
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(education).map(([lvl, count]: [string, any]) => (
            <div
              key={lvl}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-stone-900 dark:text-white">
                  {lvl}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {count} schemes
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Scholarship Types */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Scheme Classifications
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(types).map(([tp, count]: [string, any]) => (
            <div
              key={tp}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-stone-900 dark:text-white">
                  {tp}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {count} schemes
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
