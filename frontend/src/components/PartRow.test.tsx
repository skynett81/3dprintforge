import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PartRow } from './PartRow';
import type { Part } from '../types';

const part: Part = {
  id: 1, project_id: 1, name: 'Chassis',
  target_qty: 100, completed_qty: 40, parts_per_plate: 10, state: 'open',
};

const noop = () => {};

describe('PartRow', () => {
  it('renders name, progress count and per-plate', () => {
    render(<PartRow part={part} onCredit={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText('Chassis')).toBeInTheDocument();
    expect(screen.getByText('40/100')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('shows the done badge for a closed part', () => {
    render(<PartRow part={{ ...part, state: 'closed', completed_qty: 100 }} onCredit={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('fires onCredit when + plate is clicked', () => {
    const onCredit = vi.fn();
    render(<PartRow part={part} onCredit={onCredit} onEdit={noop} onDelete={noop} />);
    fireEvent.click(screen.getByText('+ plate'));
    expect(onCredit).toHaveBeenCalledWith(part);
  });

  it('fires onEdit when the edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<PartRow part={part} onCredit={noop} onEdit={onEdit} onDelete={noop} />);
    fireEvent.click(screen.getByTitle('Edit'));
    expect(onEdit).toHaveBeenCalledWith(part);
  });
});
