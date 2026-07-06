import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueueItemRow } from './QueueItemRow';
import type { QueueItem } from '../types';

const item: QueueItem = {
  id: 5, queue_id: 3, filename: 'chassis_v3.gcode', status: 'pending',
  priority: 2, copies: 10, copies_completed: 3,
};
const noop = () => {};

describe('QueueItemRow', () => {
  it('renders filename, status, copies and priority', () => {
    render(<QueueItemRow item={item} onSave={noop} onDelete={noop} />);
    expect(screen.getByText('chassis_v3.gcode')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('3/10')).toBeInTheDocument();
    expect(screen.getByText('P2')).toBeInTheDocument();
  });

  it('edits copies and saves the new value', () => {
    const onSave = vi.fn();
    render(<QueueItemRow item={item} onSave={onSave} onDelete={noop} />);
    fireEvent.click(screen.getByTitle('Edit'));
    const copies = screen.getByLabelText('Copies') as HTMLInputElement;
    fireEvent.change(copies, { target: { value: '25' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith(5, { copies: 25, priority: 2 });
  });

  it('fires onDelete', () => {
    const onDelete = vi.fn();
    render(<QueueItemRow item={item} onSave={noop} onDelete={onDelete} />);
    fireEvent.click(screen.getByTitle('Delete'));
    expect(onDelete).toHaveBeenCalledWith(item);
  });
});
