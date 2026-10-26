import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[Edvora ErrorBoundary] Caught unhandled rendering error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = (): void => {
    this.handleReset();
    if (typeof window !== 'undefined') {
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#FAF8F5] dark:bg-[#0C1513] text-stone-900 dark:text-stone-100">
          <div className="max-w-lg w-full bg-white dark:bg-[#142420] border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 sm:p-8 shadow-lg text-center space-y-5 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-7 h-7 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
                An unexpected error interrupted this page. Your saved data remains safe.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#1A2E28] border border-stone-200 dark:border-stone-800 text-left overflow-auto max-h-32 text-xs font-mono text-stone-700 dark:text-stone-300">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-[#1C3630] hover:bg-stone-200 dark:hover:bg-[#23453E] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold border border-stone-200 dark:border-[#23453E] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
