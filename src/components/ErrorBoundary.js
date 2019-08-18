/* eslint-disable no-console */
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log({ error, info });
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div
          style={{
            backgroundColor: 'grey',
            display: 'inline-block',
            padding: 10,
          }}
        >
          <h3>Something went wrong. Can&apos;t render this part.</h3>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
