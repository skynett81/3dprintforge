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
