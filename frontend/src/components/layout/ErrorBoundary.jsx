import { Component } from 'react';
import ErrorPage from '../../pages/ErrorPage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('LifeGrid crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return <ErrorPage error={this.state.error} onReset={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
