import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PartRow } from './PartRow';
import type { Part } from '../types';

const part: Part = {
  id: 1, project_id: 1, name: 'Chassis',
  target_qty: 100, completed_qty: 40, parts_per_plate: 10, state: 'open',
};

describe('PartRow', () => {
  it('renders name, progress count and per-plate', () => {
    render(<PartRow part={part} onCredit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Chassis')).toBeInTheDocument();
    expect(screen.getByText('40/100')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('shows the done badge for a closed part', () => {
    render(<PartRow part={{ ...part, state: 'closed', completed_qty: 100 }} onCredit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('fires onCredit when +plate is clicked', () => {
    const onCredit = vi.fn();
    render(<PartRow part={part} onCredit={onCredit} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('+ plate'));
    expect(onCredit).toHaveBeenCalledWith(part);
  });
});
