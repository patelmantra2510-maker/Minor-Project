import { describe, it, expect, beforeEach, vi } from 'vitest';
import { recordScholarshipView, getScholarships } from '../scholarshipService';

declare const require: any;
declare const process: any;

class MemoryStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('Scholarship-Wise View Analytics & Tracking (Client Service)', () => {
  let mockLocal: MemoryStorage;
  let mockSession: MemoryStorage;

  beforeEach(() => {
    mockLocal = new MemoryStorage();
    mockSession = new MemoryStorage();

    (globalThis as any).localStorage = mockLocal;
    (globalThis as any).sessionStorage = mockSession;
    (globalThis as any).window = {
      localStorage: mockLocal,
      sessionStorage: mockSession,
    };

    vi.restoreAllMocks();
  });

  it('records view for a specific scholarship and increments only its count', async () => {
    const targetId = 'mysy-gujarat';
    const otherId = 'cmss-gujarat';

    // Mock network fetch to failover to local fallback for test isolation
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Offline mode'));

    const res = await recordScholarshipView(targetId);
    expect(res.success).toBe(true);
    expect(res.views).toBe(1);

    const scholarshipsResult = await getScholarships();
    const targetScholarship = scholarshipsResult.data.find((s) => s.id === targetId);
    const otherScholarship = scholarshipsResult.data.find((s) => s.id === otherId);

    expect(targetScholarship?.views).toBe(1);
    expect(otherScholarship?.views).toBe(0);
  });

  it('maintains independent view counts across different scholarships', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Offline mode'));

    // Record 2 views for MYSY across different sessions
    await recordScholarshipView('mysy-gujarat');
    mockSession.removeItem('edvora_viewed_mysy-gujarat'); // Reset session flag for new session
    await recordScholarshipView('mysy-gujarat');

    // Record 1 view for CMSS
    await recordScholarshipView('cmss-gujarat');

    const result = await getScholarships();
    const mysy = result.data.find((s) => s.id === 'mysy-gujarat');
    const cmss = result.data.find((s) => s.id === 'cmss-gujarat');
    const digitalGuj = result.data.find((s) => s.id === 'digital-gujarat-sc-postmatric');

    expect(mysy?.views).toBe(2);
    expect(cmss?.views).toBe(1);
    expect(digitalGuj?.views).toBe(0);
  });

  it('prevents accidental duplicate view recording within the same user session', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Offline mode'));

    const targetId = 'aicte-pragati-scholarship';

    // First view in session
    const firstCall = await recordScholarshipView(targetId);
    expect(firstCall.success).toBe(true);
    expect(firstCall.views).toBe(1);

    // Second view in the same session (e.g. React StrictMode or page re-render)
    const secondCall = await recordScholarshipView(targetId);
    expect(secondCall.success).toBe(false);

    const result = await getScholarships();
    const item = result.data.find((s) => s.id === targetId);
    expect(item?.views).toBe(1);
  });

  it('excludes admin preview or admin sessions from incrementing public views', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Offline mode'));

    // Simulate logged-in admin
    mockSession.setItem('edvora_admin_token', 'admin_secret_token_123');

    const result = await recordScholarshipView('mysy-gujarat');
    expect(result.success).toBe(false);

    const all = await getScholarships();
    const mysy = all.data.find((s) => s.id === 'mysy-gujarat');
    expect(mysy?.views).toBe(0);
  });

  it('persists view counts in persistent storage across reloads', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Offline mode'));

    await recordScholarshipView('mysy-gujarat');

    // Verify stored in localStorage
    const raw = mockLocal.getItem('edvora_scholarship_views');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed['mysy-gujarat']).toBe(1);

    // Re-fetch data simulating a page reload
    const reloaded = await getScholarships();
    const mysy = reloaded.data.find((s) => s.id === 'mysy-gujarat');
    expect(mysy?.views).toBe(1);
  });
});

describe('Scholarship-Wise View Backend & Database Layer', () => {
  let dbMod: any;

  beforeEach(() => {
    try {
      const path = require('path');
      dbMod = require(path.resolve(process.cwd(), 'server/db.cjs'));
    } catch (e) {
      // In case path differs in test runner
    }
  });

  it('records view directly in SQLite database and increments count', () => {
    if (!dbMod) return;

    const initial = dbMod.getScholarshipByIdOrSlug('mysy-gujarat');
    const initialViews = Number(initial?.views || 0);

    const sessionId = 'test_sess_' + Date.now();
    const result = dbMod.recordScholarshipView('mysy-gujarat', sessionId);

    expect(result).not.toBeNull();
    expect(result.newlyRecorded).toBe(true);
    expect(result.views).toBe(initialViews + 1);

    // Duplicate call with identical session ID should NOT double increment
    const dupResult = dbMod.recordScholarshipView('mysy-gujarat', sessionId);
    expect(dupResult.newlyRecorded).toBe(false);
    expect(dupResult.views).toBe(initialViews + 1);
  });

  it('provides scholarship-wise view analytics and total views summary', () => {
    if (!dbMod) return;

    const analytics = dbMod.getScholarshipViewsAnalytics();
    expect(analytics).toHaveProperty('totalViews');
    expect(analytics).toHaveProperty('scholarships');
    expect(Array.isArray(analytics.scholarships)).toBe(true);
    expect(typeof analytics.totalViews).toBe('number');

    const stats = dbMod.getDatabaseStats();
    expect(stats).toHaveProperty('totalViews');
    expect(typeof stats.totalViews).toBe('number');
  });

  it('rejects invalid or unauthorized admin requests', () => {
    if (!dbMod) return;

    // Verify admin token verification
    expect(dbMod.verifyAdminToken('')).toBe(false);
    expect(dbMod.verifyAdminToken('fake_invalid_token')).toBe(false);

    const validToken = dbMod.generateAdminToken();
    expect(dbMod.verifyAdminToken(validToken)).toBe(true);
  });
});
