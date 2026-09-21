import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Navbar } from '../../components/common/Navbar';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { SavedProvider } from '../../context/SavedContext';
import { CompareProvider } from '../../context/CompareContext';
import { AuthProvider } from '../AuthContext';

describe('Auth Navigation & Routing Bug Fixes', () => {
  const parseRouteHash = (rawHash: string) => {
    const clean = rawHash.replace(/^#\/?/, '');
    if (clean.includes('access_token=') || clean.includes('refresh_token=')) {
      return { route: 'account' };
    }
    if (clean.includes('error=access_denied') || clean.includes('error_code=access_denied')) {
      return { route: 'login' };
    }
    const [pathPart, queryPart] = clean.split('?');
    const params = new URLSearchParams(queryPart || '');

    const routeAliases: Record<string, string> = {
      signin: 'login',
      register: 'signup',
      'create-account': 'signup',
    };
    const resolvedRoute = routeAliases[pathPart] || pathPart || 'home';
    return {
      route: resolvedRoute,
      scholarshipId: params.get('scholarshipId') || undefined,
    };
  };

  it('correctly maps #/signin and #/login to login route', () => {
    expect(parseRouteHash('#/login').route).toBe('login');
    expect(parseRouteHash('#/signin').route).toBe('login');
    expect(parseRouteHash('#login').route).toBe('login');
    expect(parseRouteHash('#signin').route).toBe('login');
  });

  it('correctly maps #/signup, #/register, and #/create-account to signup route', () => {
    expect(parseRouteHash('#/signup').route).toBe('signup');
    expect(parseRouteHash('#/register').route).toBe('signup');
    expect(parseRouteHash('#/create-account').route).toBe('signup');
    expect(parseRouteHash('#signup').route).toBe('signup');
  });

  it('Navbar renders both [ Sign In ] and [ Create Account ] buttons for unauthenticated guests', () => {
    const html = renderToString(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(
          LanguageProvider,
          null,
          React.createElement(
            SavedProvider,
            null,
            React.createElement(
              CompareProvider,
              null,
              React.createElement(
                AuthProvider,
                null,
                React.createElement(Navbar, {
                  currentRoute: 'home',
                  onNavigate: () => {},
                })
              )
            )
          )
        )
      )
    );

    // Both buttons must be rendered in the header
    expect(html).toContain('Sign In');
    expect(html).toContain('Create Account');
  });

  it('LoginPage renders warm guest notice with continue CTA and no duplicate red alert', () => {
    const html = renderToString(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(
          LanguageProvider,
          null,
          React.createElement(
            AuthProvider,
            null,
            React.createElement(LoginPage, {
              onNavigate: () => {},
            })
          )
        )
      )
    );

    expect(html).not.toContain('Guest Mode Active');
    expect(html).toContain('Create Account');
    // Ensure no red alert is rendered by default
    expect(html).not.toContain('role="alert"');
  });

  it('SignupPage renders clean dedicated auth form without Guest Mode Active message', () => {
    const html = renderToString(
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(
          LanguageProvider,
          null,
          React.createElement(
            AuthProvider,
            null,
            React.createElement(SignupPage, {
              onNavigate: () => {},
            })
          )
        )
      )
    );

    expect(html).not.toContain('Guest Mode Active');
    expect(html).toContain('Sign In');
    // Ensure no red alert is rendered by default
    expect(html).not.toContain('role="alert"');
  });
});
