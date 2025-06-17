"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BackendError } from "@/lib/error";
import { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error instanceof BackendError) {
      toast.error(error.message || "Une erreur serveur est survenue");
    } else {
      console.error("Caught error:", error, errorInfo);
    }
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError && error && !(error instanceof BackendError)) {
      return (
        <div className="flex justify-center items-center min-h-[40vh] px-4">
          <Card className="max-w-xl w-full">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-red-600">
                Une erreur est survenue
              </h2>
              <p className="text-sm text-muted-foreground">
                <strong>{error.name}:</strong> {error.message}
              </p>
              <pre className="text-xs text-gray-500 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
