import React from 'react';
import { ErrorPage } from '../../pages/ErrorPage';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Application ErrorBoundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      return (
        <ErrorPage
          code={500}
          title="একটি অপ্রত্যাশিত সমস্যা হয়েছে"
          message="ওয়েবসাইটের এই অংশটি লোড করতে একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পেজটি রিলোড করুন বা হোমপেজে ফিরে যান।"
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          onNavigate={this.props.onNavigate}
        />
      );
    }

    return this.props.children;
  }
}
