import { fireEvent, render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { StorageUnavailableError } from '../db/db';
import { ErrorBoundary } from './ErrorBoundary';
import { FailureShell } from './FailureShell';

function Boom({ error }: { error: Error }): null {
  throw error;
}

describe('ErrorBoundary / FailureShell', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('FR-5 shows the crash failure shell when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom error={new Error('kaboom')} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveAttribute('data-kind', 'crash');
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('kaboom')).toBeInTheDocument();
  });

  it('FR-6 shows the storage variant for StorageUnavailableError', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom error={new StorageUnavailableError('nope')} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveAttribute('data-kind', 'storage');
  });

  it('FR-5 Reload button calls the reload handler', () => {
    const onReload = vi.fn();
    render(<FailureShell onReload={onReload} />);
    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));
    expect(onReload).toHaveBeenCalledOnce();
  });
});
