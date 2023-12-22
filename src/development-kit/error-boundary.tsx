import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.FunctionComponent;
  onError?(): void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false } as const;

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    const { children, fallback: Fallback } = this.props;

    if (this.state.hasError) {
      return <Fallback />;
    }

    return children;
  }
}

export default ErrorBoundary;
