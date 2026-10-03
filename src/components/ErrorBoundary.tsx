import { Component, type ComponentChildren } from 'preact';
import { logError, StorageUnavailableError } from '../db/db';
import { FailureShell } from './FailureShell';

interface Props {
  children: ComponentChildren;
}
interface State {
  error: unknown;
}

/** Catches render/lifecycle errors anywhere below it and shows the failure shell (FR-5). */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  componentDidCatch(error: unknown) {
    const kind = error instanceof StorageUnavailableError ? 'storage' : 'crash';
    void logError(kind, error);
  }

  render() {
    const { error } = this.state;
    if (error) {
      const kind = error instanceof StorageUnavailableError ? 'storage' : 'crash';
      return <FailureShell kind={kind} error={error} />;
    }
    return this.props.children;
  }
}
