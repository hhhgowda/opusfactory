import { render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('FR-3 opens the DB and renders the landing page', async () => {
    render(<App />);
    expect(await screen.findByRole('navigation', { name: 'Main actions' })).toBeInTheDocument();
  });

  it('FR-6 renders the storage failure shell when IndexedDB is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined);
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Storage unavailable' })).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('FR-5 ?__crash=1 renders the crash failure shell', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    window.history.replaceState(null, '', '/?__crash=1');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
  });
});
