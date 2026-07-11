// this is a wrapper for the ErrorBoundary component to be used in the app

import ErrorBoundary from "@/components/tools/ErrorBoundary";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

class ErrorBoundaryWrapper extends Component<Props> {
  render() {
    return <ErrorBoundary>{this.props.children}</ErrorBoundary>;
  }
}

export default ErrorBoundaryWrapper;
