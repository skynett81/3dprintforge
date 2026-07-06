// Shared types mirroring the 3DPrintForge production API. In a full
// migration these would be generated from the server or shared in a
// workspace package — one of the concrete wins of a typed frontend.

export interface Project {
  id: number;
  name: string;
  status?: string;
}

export interface Part {
  id: number;
  project_id: number;
  name: string;
  target_qty: number;
  completed_qty: number;
  parts_per_plate: number;
  state: 'open' | 'closed';
  filename?: string | null;
}

export interface NewPart {
  name: string;
  target_qty: number;
  parts_per_plate: number;
}

export interface Printer {
  id: string;
  name: string;
  model?: string | null;
  type?: string | null;
  vendor?: string | null;
  ip?: string | null;
  state?: string | null;
  status?: string | null;
}

export interface Spool {
  id: number;
  profile_name?: string | null;
  material?: string | null;
  color_hex?: string | null;
  color_name?: string | null;
  vendor_name?: string | null;
  remaining_weight_g: number;
  initial_weight_g: number;
  used_weight_g?: number;
  location?: string | null;
  printer_id?: string | null;
  archived?: number;
}

export interface Queue {
  id: number;
  name: string;
  status: string;
  item_count: number;
  completed_count: number;
  printing_count: number;
  auto_start: number;
  require_confirmation: number;
  priority_mode?: string | null;
}

export interface BedHold {
  printer_id: string;
  filename?: string | null;
  queue_id?: number | null;
  held_at?: string;
}
