import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface GoogleRecaptchaRef {
  reset: () => void;
  getResponse: () => string;
}

interface GoogleRecaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (err?: any) => void;
  className?: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact' | 'invisible';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: (err?: any) => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    __edvoraRecaptchaLoaded?: boolean;
  }
}

const SCRIPT_ID = 'edvora-google-recaptcha-script';

export const GoogleRecaptcha = forwardRef<GoogleRecaptchaRef, GoogleRecaptchaProps>(
  ({ onVerify, onExpire, onError, className = '' }, ref) => {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);

    const siteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined)?.trim();
    const isConfigured = Boolean(siteKey && siteKey.length > 5 && !siteKey.includes('your-'));

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (typeof window !== 'undefined' && window.grecaptcha && widgetIdRef.current !== null) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch {
            // ignore reset errors
          }
        }
      },
      getResponse: () => {
        if (typeof window !== 'undefined' && window.grecaptcha && widgetIdRef.current !== null) {
          try {
            return window.grecaptcha.getResponse(widgetIdRef.current);
          } catch {
            return '';
          }
        }
        return '';
      },
    }));

    useEffect(() => {
      if (!isConfigured || !siteKey || !containerRef.current) return;

      let isMounted = true;

      const renderWidget = () => {
        if (!containerRef.current || !isMounted || !window.grecaptcha) return;
        try {
          // Clear any existing contents in the container
          containerRef.current.innerHTML = '';
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            theme: theme === 'dark' ? 'dark' : 'light',
            callback: (token: string) => {
              if (isMounted) onVerify(token);
            },
            'expired-callback': () => {
              if (isMounted && onExpire) onExpire();
            },
            'error-callback': (err: any) => {
              if (isMounted && onError) onError(err);
            },
          });
        } catch {
          // Catch potential re-render collisions
        }
      };

      // Check if script is already present
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.grecaptcha) {
            window.grecaptcha.ready(renderWidget);
          }
        };
        document.head.appendChild(script);
      } else if (window.grecaptcha) {
        window.grecaptcha.ready(renderWidget);
      }

      return () => {
        isMounted = false;
      };
    }, [isConfigured, siteKey, theme, onVerify, onExpire, onError]);

    if (!isConfigured) {
      // In development or when site key is not configured, gracefully omit the widget.
      return null;
    }

    return (
      <div
        className={`flex justify-center my-3 overflow-hidden rounded-xl ${className}`}
        data-testid="google-recaptcha-wrapper"
      >
        <div ref={containerRef} aria-label="Google reCAPTCHA Verification" />
      </div>
    );
  }
);

GoogleRecaptcha.displayName = 'GoogleRecaptcha';
