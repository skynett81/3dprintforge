import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { CommandPalette, type CommandItem } from './CommandPalette';

const items: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', group: undefined },
  { id: 'fleet', label: 'Fleet', group: 'Operate' },
  { id: 'guard', label: 'Print Guard', group: 'Operate' },
  { id: 'inventory', label: 'Filament', group: 'Inventory' },
];

function renderPalette(onSelect = vi.fn(), onClose = vi.fn()) {
  render(
    <I18nProvider lang="en">
      <CommandPalette open items={items} onSelect={onSelect} onClose={onClose} />
    </I18nProvider>,
  );
  return { onSelect, onClose };
}

describe('CommandPalette', () => {
  it('filters items by query and selects on click', () => {
    const { onSelect, onClose } = renderPalette();
    const input = screen.getByPlaceholderText('Jump to…');
    fireEvent.change(input, { target: { value: 'guard' } });
    expect(screen.getByText('Print Guard')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Print Guard'));
    expect(onSelect).toHaveBeenCalledWith('guard');
    expect(onClose).toHaveBeenCalled();
  });

  it('supports keyboard navigation and Enter', () => {
    const { onSelect } = renderPalette();
    const input = screen.getByPlaceholderText('Jump to…');
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // move to 2nd item (Fleet)
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('fleet');
  });

  it('closes on Escape', () => {
    const { onClose } = renderPalette();
    fireEvent.keyDown(screen.getByPlaceholderText('Jump to…'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('shows an empty state when nothing matches', () => {
    renderPalette();
    fireEvent.change(screen.getByPlaceholderText('Jump to…'), { target: { value: 'zzzzz' } });
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('shows recents + actions on empty query and runs an action', () => {
    const themeRun = vi.fn();
    const onSelect = vi.fn();
    render(
      <I18nProvider lang="en">
        <CommandPalette
          open
          items={items}
          onSelect={onSelect}
          onClose={vi.fn()}
          recent={[{ id: 'fleet', label: 'Fleet', group: 'Recent' }]}
          actions={[{ id: 'act:theme', label: 'Switch to light theme', group: 'Actions', run: themeRun }]}
        />
      </I18nProvider>,
    );
    // Section headers from the grouped empty-state.
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Switch to light theme'));
    expect(themeRun).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled(); // run() takes precedence
  });

  it('merges async data-search results and deep-links on select', async () => {
    const onSelect = vi.fn();
    const search = vi.fn(async (): Promise<CommandItem[]> => [
      { id: '#/history/42', label: 'Benchy hull', group: 'History' },
    ]);
    render(
      <I18nProvider lang="en">
        <CommandPalette open items={items} onSelect={onSelect} onClose={vi.fn()} search={search} />
      </I18nProvider>,
    );
    fireEvent.change(screen.getByPlaceholderText('Jump to…'), { target: { value: 'benchy' } });
    await waitFor(() => expect(search).toHaveBeenCalledWith('benchy'));
    const row = await screen.findByText('Benchy hull');
    fireEvent.click(row);
    expect(onSelect).toHaveBeenCalledWith('#/history/42');
  });
});
