import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  LogIn,
  Search,
  Eye,
  Shield,
  Lock,
  CheckCircle2,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react';
import {
  getAdminUserRecords,
  getAdminStats,
  getUserProfile,
  subscribeToUserChanges,
  type AdminUserRecord,
  type AdminStats,
} from '../../services/adminUserService';
import type { StudentProfile } from '../../types/studentProfile';
import { UserDetailModal } from './UserDetailModal';

function formatDate(isoStr?: string): string {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoStr;
  }
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    loggedInToday: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Selected user for Detail Modal
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load and refresh users and stats
  const refreshUserData = useCallback(() => {
    const records = getAdminUserRecords();
    const currentStats = getAdminStats();
    setUsers(records);
    setStats(currentStats);
  }, []);

  useEffect(() => {
    refreshUserData();
    const unsubscribe = subscribeToUserChanges(() => {
      refreshUserData();
    });
    return unsubscribe;
  }, [refreshUserData]);

  // Filtered users by search query
  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      return matchName || matchEmail;
    });
  }, [users, searchTerm]);

  // Open detail modal for a specific user
  const handleInspectUser = (user: AdminUserRecord) => {
    setSelectedUser(user);
    const profile = getUserProfile(user.id);
    setSelectedProfile(profile);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedUser(null);
    setSelectedProfile(null);
  };

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-white">
          User & Privacy Management
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Registered student accounts, real-time login activity, zero-PII privacy guarantee, and administrative session security.
        </p>
      </div>

      {/* 1. Dashboard Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white">
            {stats.totalUsers}
          </div>
          <div className="text-[11px] text-stone-500">Registered accounts</div>
        </div>

        {/* Active Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Active Users</span>
            <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white">
            {stats.activeUsers}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active status
          </div>
        </div>

        {/* New Users Today */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">New Users Today</span>
            <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white">
            {stats.newUsersToday}
          </div>
          <div className="text-[11px] text-stone-500">Created today</div>
        </div>

        {/* Logged In Today */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Logged In Today</span>
            <LogIn className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white">
            {stats.loggedInToday}
          </div>
          <div className="text-[11px] text-stone-500">Active today</div>
        </div>
      </div>

      {/* 2. Registered Users Management Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                Registered Edvora Users
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Live accounts created via Edvora authentication with verified profile readiness.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-950 rounded-2xl text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="p-3.5 px-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-200/70 dark:border-emerald-950/60 flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-300">
          <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            User accounts and activity are shown to authorized administrators for application management. Passwords are never displayed or recoverable through the admin interface.
          </span>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-emerald-950/60 text-stone-400 uppercase font-semibold text-[11px]">
                <th className="pb-3 px-2">User</th>
                <th className="pb-3 px-2">Email</th>
                <th className="pb-3 px-2">Created</th>
                <th className="pb-3 px-2">Last Login</th>
                <th className="pb-3 px-2 text-center">Logins</th>
                <th className="pb-3 px-2">Method</th>
                <th className="pb-3 px-2 text-center">Status</th>
                <th className="pb-3 px-2 text-center">Profile</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-emerald-950/40">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    {searchTerm ? 'No users found matching your search.' : 'No registered users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleInspectUser(u)}
                    className="hover:bg-stone-50/70 dark:hover:bg-emerald-950/20 cursor-pointer transition-colors group"
                  >
                    {/* User */}
                    <td className="py-3.5 px-2 font-bold text-stone-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {u.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-2 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                      {u.email}
                    </td>

                    {/* Created */}
                    <td className="py-3.5 px-2 text-stone-500">
                      {formatDate(u.createdAt)}
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-2 text-stone-500">
                      {formatDate(u.lastLoginAt)}
                    </td>

                    {/* Login Count */}
                    <td className="py-3.5 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-emerald-950/60 font-mono text-[11px] font-bold text-stone-700 dark:text-stone-300">
                        {u.loginCount}
                      </span>
                    </td>

                    {/* Auth Method */}
                    <td className="py-3.5 px-2 text-stone-600 dark:text-stone-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{u.authMethod}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Profile Completion */}
                    <td className="py-3.5 px-2 text-center">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] text-emerald-700 dark:text-emerald-300">
                        {u.profileCompletion}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectUser(u);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                        title="View User Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Privacy Architecture Notice */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold font-editorial text-emerald-950 dark:text-emerald-50">
              Zero-PII Privacy Architectural Guarantee
            </h3>
            <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
              Unlike commercial portals that harvest student Aadhaar numbers, phone numbers, and caste certificates into marketing databases, Edvora requires <strong>no mandatory registration or public user accounts</strong>.
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#0A1613]/70 border border-emerald-200/60 dark:border-emerald-900/40">
                <strong>Student Responses:</strong> Kept strictly in browser <code>sessionStorage</code> and cleared when tab closes.
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#0A1613]/70 border border-emerald-200/60 dark:border-emerald-900/40">
                <strong>Saved Bookmarks:</strong> Retained on student's private device via <code>localStorage</code> (never sent to server).
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#0A1613]/70 border border-emerald-200/60 dark:border-emerald-900/40">
                <strong>Admin Authority:</strong> Isolated to verified staff via HMAC SHA-256 session tokens.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Administrator Accounts Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Administrator Accounts & Permissions
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            1 Active Session
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-emerald-950/60 text-stone-400 uppercase font-semibold">
                <th className="pb-3">Identity</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Authentication Mode</th>
                <th className="pb-3">Access Level</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-emerald-950/40">
              <tr>
                <td className="py-3 font-bold text-stone-900 dark:text-white">
                  Lead Administrator (Staff)
                </td>
                <td className="py-3 text-stone-600 dark:text-stone-400">
                  Platform Owner & Curator
                </td>
                <td className="py-3 font-mono text-[11px] text-stone-500">
                  HMAC-SHA256 Token
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold text-[10px]">
                    Full CRUD / Verified / Featured
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authenticated</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Security Best Practices */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>Security & Server Configuration</span>
        </h4>
        <p className="text-xs text-stone-500 leading-relaxed">
          To modify the default administrator passphrase, define <code>ADMIN_PASSWORD</code> in your environment or <code>.env</code> file. Administrative tokens expire automatically after 24 hours of inactivity.
        </p>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        profile={selectedProfile}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
};
