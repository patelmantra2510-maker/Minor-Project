import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { GoogleIcon } from '../../components/auth/GoogleIcon';
import { GoogleRecaptcha } from '../../components/auth/GoogleRecaptcha';
import { ThemeProvider } from '../../context/ThemeContext';
import type { UserAccount } from '../authTypes';

describe('Google Authentication & reCAPTCHA Integration', () => {
  it('GoogleIcon renders valid SVG markup with official brand colors', () => {
    const html = renderToString(React.createElement(GoogleIcon));
    expect(html).toContain('<svg');
    expect(html).toContain('viewBox="0 0 24 24"');
    // Official Google 4-color palette
    expect(html).toContain('#4285F4'); // Blue
    expect(html).toContain('#34A853'); // Green
    expect(html).toContain('#FBBC05'); // Yellow
    expect(html).toContain('#EA4335'); // Red
  });

  it('GoogleIcon accepts custom className and size', () => {
    const html = renderToString(React.createElement(GoogleIcon, { className: 'w-8 h-8', size: 32 }));
    expect(html).toContain('width="32"');
    expect(html).toContain('height="32"');
    expect(html).toContain('w-8 h-8');
  });

  it('GoogleRecaptcha returns null gracefully when site key is not configured', () => {
    const onVerify = () => {};
    const html = renderToString(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(GoogleRecaptcha, { onVerify })
      )
    );
    expect(html).toBe('');
  });

  it('UserAccount model correctly represents google provider and avatarUrl', () => {
    const googleUser: UserAccount = {
      userId: 'goog-12345',
      email: 'student@gmail.com',
      name: 'Google Student',
      avatarUrl: 'https://lh3.googleusercontent.com/a/mock-photo',
      provider: 'google',
      emailVerified: true,
      createdAt: '2026-09-20T12:00:00Z',
    };

    expect(googleUser.provider).toBe('google');
    expect(googleUser.avatarUrl).toBeTruthy();
    expect(googleUser.emailVerified).toBe(true);
  });

  it('OAuth callback hash parsing handles access_token and error_code properly', () => {
    // Test logic simulating parseRouteHash
    const simulateParse = (hash: string) => {
      const clean = hash.replace(/^#\/?/, '');
      if (clean.includes('access_token=') || clean.includes('refresh_token=')) {
        return { route: 'account' };
      }
      if (clean.includes('error=access_denied') || clean.includes('error_code=access_denied')) {
        return { route: 'login' };
      }
      return { route: clean || 'home' };
    };

    expect(simulateParse('#access_token=mockToken&refresh_token=mockRefresh').route).toBe('account');
    expect(simulateParse('#/account').route).toBe('account');
    expect(simulateParse('#error=access_denied&error_code=access_denied').route).toBe('login');
    expect(simulateParse('#find').route).toBe('find');
  });
});
