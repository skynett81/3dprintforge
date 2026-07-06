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
  cost?: number | null;
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

export interface QueueItem {
  id: number;
  queue_id: number;
  filename: string;
  status: string;
  priority: number;
  copies: number;
  copies_completed: number;
  printer_id?: string | null;
  required_material?: string | null;
}

export interface BedHold {
  printer_id: string;
  filename?: string | null;
  queue_id?: number | null;
  held_at?: string;
}

export interface HardwareItem {
  id: number;
  category: string;
  name: string;
  brand?: string | null;
  model?: string | null;
  compatible_printers?: string | null;
  purchase_price?: number | null;
  rating?: number | null;
}

export interface LibraryFile {
  id: number;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  category?: string | null;
  print_count: number;
  last_printed?: string | null;
  estimated_filament_g?: number | null;
  added_at: string;
}

export interface KbPrinter {
  id: number;
  model: string;
  full_name: string;
  release_year?: number | null;
  build_volume?: string | null;
  max_speed?: number | null;
  has_ams?: number;
  has_enclosure?: number;
  has_camera?: number;
  price_usd?: number | null;
  wiki_url?: string | null;
}

export interface AppError {
  id: number;
  printer_id: string;
  timestamp: string;
  code: string;
  message: string;
  severity: string;
  acknowledged: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  target: number;
  current: number;
  category: string;
  earned: boolean;
  progress: number;
}

export interface ActivityDay {
  day: string;
  prints: number;
  completed: number;
  failed: number;
  cancelled: number;
  hours: number;
  filament_g: number;
}

export interface WasteStats {
  total_waste_g: number;
  total_cost: number;
  avg_per_print: number;
  cost_per_g: number;
  total_prints: number;
  prints_with_waste: number;
  total_color_changes: number;
  waste_breakdown: { purge_g: number; color_change_g: number; failed_g: number; manual_g: number; failed_prints: number };
  waste_per_day: { day: string; total: number }[];
}

export interface WasteEvent {
  id: number;
  printer_id: string;
  timestamp: string;
  waste_g: number;
  reason?: string | null;
  notes?: string | null;
}

export interface CostSummary {
  print_count: number;
  total_filament: number;
  total_electricity: number;
  total_depreciation: number;
  total_labor: number;
  total_markup: number;
  grand_total: number;
}

export interface CostRow {
  id: number;
  print_history_id: number;
  filament_cost: number;
  electricity_cost: number;
  depreciation_cost: number;
  labor_cost: number;
  markup_amount: number;
  total_cost: number;
  currency?: string | null;
  calculated_at: string;
}

export interface ScheduledPrint {
  id: number;
  title: string;
  filename: string;
  scheduled_at: string;
  printer_id?: string | null;
  status?: string | null;
}

export interface MaintComponent {
  component: string;
  label: string;
  interval_hours: number;
  hours_since_maintenance: number;
  percentage: number;
  overdue: boolean;
  last_maintenance: string | null;
}

export interface MaintenanceStatus {
  total_print_hours: number;
  total_prints: number;
  total_filament_g: number;
  components: MaintComponent[];
}

export interface Supplier {
  id: number;
  name: string;
  website?: string | null;
  lead_time_days?: number | null;
  notes?: string | null;
}

export interface POLine {
  id: number;
  po_id: number;
  description: string;
  quantity: number;
  qty_received: number;
  unit_price?: number | null;
  profile_material?: string | null;
}

export interface PurchaseOrder {
  id: number;
  supplier_id: number | null;
  reference?: string | null;
  status: string;
  supplier_name?: string | null;
  line_count: number;
  total_qty: number;
  received_qty: number;
  total_cost: number;
  order_date?: string | null;
  target_date?: string | null;
  currency?: string | null;
  lines?: POLine[];
}

export interface ReorderRow {
  material: string;
  target_g: number;
  on_hand_g: number;
  queue_demand_g: number;
  shortfall_g: number;
  spools_on_hand: number;
  suggested_spools: number;
  below_target: boolean;
}

export interface MaterialForecast {
  material: string;
  total_used_g: number;
  active_days: number;
  avg_daily_g: number;
  in_stock_g: number;
  spool_count: number;
}

export interface Predictions {
  by_material: MaterialForecast[];
  per_spool: unknown[];
}

export interface NotifChannel { enabled?: boolean; [k: string]: unknown; }
export interface NotificationConfig {
  enabled?: boolean;
  channels: Record<string, NotifChannel>;
  [k: string]: unknown;
}

export interface AppNotification {
  id: number;
  timestamp: string;
  event_type: string;
  channel: string;
  printer_id?: string | null;
  title: string;
  message: string;
  status: string;
  error_info?: string | null;
}

export interface AuthStatus {
  enabled: boolean;
  authenticated: boolean;
  requiresUsername: boolean;
  user: string | null;
}

export interface HistoryRow {
  id: number;
  printer_id: string;
  filename: string;
  status: string;
  started_at: string;
  finished_at?: string | null;
  duration_seconds?: number;
  filament_used_g?: number;
  filament_type?: string | null;
  filament_color?: string | null;
  layer_count?: number;
}

export interface Stats {
  total_prints: number;
  completed_prints: number;
  failed_prints: number;
  success_rate: number;
  total_hours: number;
  total_filament_g: number;
  avg_print_minutes: number;
  estimated_cost_nok?: number;
  monthly_trends: { month: string; total: number; completed: number; total_seconds: number; total_filament_g: number }[];
  filament_by_type: { type: string; grams: number; prints: number }[];
  top_files: { filename: string; count: number; completed: number }[];
}
