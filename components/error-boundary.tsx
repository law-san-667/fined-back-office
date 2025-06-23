"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import React, { type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <div className="w-full max-w-md rounded-lg border border-destructive bg-white p-8 shadow-md shadow-destructive/10">
              <div className="mb-4 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="mb-4 text-center text-2xl font-bold">
                Oops, something went wrong
              </h2>
              <p className="mb-6 text-center text-gray-600">
                {this.state.error?.message || "An unexpected error occurred."}
              </p>
              <div className="flex justify-center">
                <Button variant={"outline"} onClick={this.resetErrorBoundary}>
                  Try again
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
