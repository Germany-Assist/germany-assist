import React from "react";
import FallbackUI from "./FallbackUI";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    //TODO IMPORTANT in production i will replace with Sentry
    console.error("ErrorBoundary caught:", error);
    console.error("Component stack:", info.componentStack);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} onRetry={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
