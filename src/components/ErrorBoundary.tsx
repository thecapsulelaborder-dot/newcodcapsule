import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-[#F8F6F1] rounded-[2.5rem] border border-red-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
            ⚠️
          </div>
          <h3 className="text-base font-black text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-4">
            {this.state.error?.message || "An unexpected error occurred while rendering this section."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-capsule-accent text-white text-xs font-bold rounded-full shadow-md hover:bg-opacity-90 transition-all cursor-pointer"
          >
            Retry Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
