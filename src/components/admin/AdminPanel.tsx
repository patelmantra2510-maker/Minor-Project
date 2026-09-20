import React, { useState, useEffect, useCallback } from 'react';
import { AdminProvider, useAdmin } from './AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { ScholarshipManagement } from './ScholarshipManagement';
import { ScholarshipFormModal } from './ScholarshipFormModal';
import { ScholarshipDetailModal } from './ScholarshipDetailModal';
import { CategoryManagement } from './CategoryManagement';
import { UserManagement } from './UserManagement';
import { AnalyticsView } from './AnalyticsView';
import { EdvoraLogo } from '../common/EdvoraLogo';
import { useScholarships } from '../../context/ScholarshipContext';
import {
  getAdminStats,
  getAdminCategories,
  saveScholarship as apiSaveScholarship,
  deleteScholarship as apiDeleteScholarship,
  toggleFeatureScholarship as apiToggleFeature,
  toggleVerifyScholarship as apiToggleVerify,
} from '../../services/scholarshipService';
import type { Scholarship } from '../../types/scholarship';
import {
  LayoutDashboard,
  GraduationCap,
  FolderTree,
  Users,
  BarChart3,
  LogOut,
  ExternalLink,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (route: string) => void;
}

const AdminPanelContent: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { isAuthenticated, token, logout } = useAdmin();
  const { scholarships, refreshScholarships } = useScholarships();

  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'scholarships' | 'categories' | 'users' | 'analytics'
  >('dashboard');

  const [stats, setStats] = useState<any>(null);
  const [categoriesData, setCategoriesData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [inspectingScholarship, setInspectingScholarship] = useState<Scholarship | null>(null);

  // Mobile sidebar drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch admin stats & categories from real DB
  const loadAdminData = useCallback(async () => {
    if (!token) return;
    setLoadingStats(true);
    try {
      const [statsRes, catRes] = await Promise.all([
        getAdminStats(token).catch(() => null),
        getAdminCategories(token).catch(() => null),
      ]);
      if (statsRes) setStats(statsRes);
      if (catRes) setCategoriesData(catRes);
    } catch (e) {
      console.warn('Failed to load admin telemetry:', e);
    } finally {
      setLoadingStats(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadAdminData();
    }
  }, [isAuthenticated, token, loadAdminData]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingScholarship(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (scholarship: Scholarship) => {
    setInspectingScholarship(scholarship);
  };

  const handleSave = async (data: Scholarship) => {
    if (!token) return;
    await apiSaveScholarship(data, token);
    await refreshScholarships();
    await loadAdminData();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await apiDeleteScholarship(id, token);
    await refreshScholarships();
    await loadAdminData();
  };

  const handleToggleFeature = async (id: string, isFeatured: boolean) => {
    if (!token) return;
    await apiToggleFeature(id, isFeatured, token);
    await refreshScholarships();
    await loadAdminData();
  };

  const handleToggleVerify = async (id: string, isVerified: boolean) => {
    if (!token) return;
    await apiToggleVerify(id, isVerified, token);
    await refreshScholarships();
    await loadAdminData();
  };

  const handleCategoryFilter = (_category: string) => {
    setCurrentTab('scholarships');
  };

  // If not authenticated, render login screen
  if (!isAuthenticated) {
    return <AdminLogin onBackToSite={() => onNavigate('home')} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap, badge: scholarships.length },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'users', label: 'Users & Privacy', icon: Users },
    { id: 'analytics', label: 'AI & Engine', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0A1613] text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#101D19]/90 backdrop-blur-md border-b border-stone-200/90 dark:border-emerald-950/70 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-emerald-950"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <EdvoraLogo variant="navbar" showTagline={false} />
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300/60 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleOpenAdd}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Scholarship</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-emerald-900/60 bg-stone-50 dark:bg-[#0A1613] hover:bg-stone-100 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            onClick={logout}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Layout: Sidebar + Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="p-4 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 px-3 py-2">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#064E3B] text-amber-50 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-emerald-950/40 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isActive
                          ? 'bg-emerald-900 text-amber-300'
                          : 'bg-stone-100 dark:bg-emerald-950 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick System Health Box */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs text-xs space-y-2.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              System Environment
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-stone-500">Database:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">SQLite 3 (WAL)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-stone-500">Live Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Online & Syncing</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-stone-500">Records:</span>
              <span className="font-bold font-mono">{scholarships.length} schemes</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-stone-900/60 backdrop-blur-xs flex flex-col">
            <div className="bg-white dark:bg-[#101D19] p-6 space-y-4 border-b border-stone-200 dark:border-emerald-950">
              <div className="flex items-center justify-between">
                <EdvoraLogo variant="navbar" showTagline={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold ${
                        isActive
                          ? 'bg-[#064E3B] text-amber-50'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-emerald-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 dark:bg-emerald-950 text-stone-600 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {currentTab === 'dashboard' && (
            <AdminDashboard
              stats={stats}
              loading={loadingStats}
              onNavigateTab={(tab) => setCurrentTab(tab as any)}
              onOpenAddModal={handleOpenAdd}
              onEditScholarship={handleEdit}
              onViewDetails={handleViewDetails}
              onViewPublicSite={() => onNavigate('home')}
            />
          )}

          {currentTab === 'scholarships' && (
            <ScholarshipManagement
              scholarships={scholarships}
              loading={loadingStats}
              onOpenAddModal={handleOpenAdd}
              onEditScholarship={handleEdit}
              onViewDetails={handleViewDetails}
              onDeleteScholarship={handleDelete}
              onToggleFeature={handleToggleFeature}
              onToggleVerify={handleToggleVerify}
              onRefresh={async () => {
                await refreshScholarships();
                await loadAdminData();
              }}
            />
          )}

          {currentTab === 'categories' && (
            <CategoryManagement
              categoriesData={categoriesData || stats?.categories}
              onFilterCategory={handleCategoryFilter}
            />
          )}

          {currentTab === 'users' && <UserManagement />}

          {currentTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Modals */}
      <ScholarshipFormModal
        scholarship={editingScholarship}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
      />

      <ScholarshipDetailModal
        scholarship={inspectingScholarship}
        onClose={() => setInspectingScholarship(null)}
        onEdit={(s) => {
          setInspectingScholarship(null);
          handleEdit(s);
        }}
      />
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  return (
    <AdminProvider>
      <AdminPanelContent onNavigate={onNavigate} />
    </AdminProvider>
  );
};
