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

export interface FilamentProfile {
  id: number;
  name: string;
  material: string;
  color_name?: string | null;
  color_hex?: string | null;
  vendor_id?: number | null;
  density?: number | null;
  diameter?: number | null;
  nozzle_temp_min?: number | null;
  nozzle_temp_max?: number | null;
}

export interface StorageLocation {
  id: number;
  name: string;
  description?: string | null;
  min_spools?: number | null;
  max_spools?: number | null;
  min_weight_kg?: number | null;
}

export interface StockMovement {
  source: string;
  type: string;
  delta_g: number | null;
  reason?: string | null;
  ref_type?: string | null;
  ref_id?: number | null;
  location_from?: string | null;
  location_to?: string | null;
  timestamp: string;
  spool_label?: string | null;
  spool_color?: string | null;
}

export interface InventoryStats {
  total_spools: number;
  total_remaining_g: number;
  total_used_g: number;
  total_cost: number;
  low_stock_count: number;
  by_material: { material: string; count: number; remaining_g: number }[];
  by_vendor: { vendor: string | null; count: number; remaining_g: number; total_cost: number }[];
}

export interface PartCategory {
  id: number;
  name: string;
  parent_id?: number | null;
  icon?: string | null;
  default_location_id?: number | null;
  default_unit?: string;
  part_count?: number;
}

export interface InvPart {
  id: number;
  ipn?: string | null;
  name: string;
  description?: string | null;
  category_id?: number | null;
  type: string;
  unit: string;
  min_stock: number;
  image?: string | null;
  notes?: string | null;
  is_active: number;
  filament_profile_id?: number | null;
  shop_product_id?: number | null;
  category_name?: string | null;
  total_stock: number;
  stock_item_count?: number;
  low?: number;
}

export interface StockItem {
  id: number;
  part_id: number;
  location_id?: number | null;
  quantity: number;
  batch?: string | null;
  serial?: string | null;
  status: string;
  purchase_price?: number | null;
  supplier_id?: number | null;
  expiry?: string | null;
  qr_uid?: string | null;
  part_name?: string;
  part_unit?: string;
  part_ipn?: string | null;
  location_name?: string | null;
}

export interface StockMove {
  id: number;
  stock_item_id?: number | null;
  part_id?: number | null;
  delta: number;
  balance?: number | null;
  reason?: string | null;
  ref_type?: string | null;
  created_at: string;
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
  last_used_at?: string | null;
  first_used_at?: string | null;
  purchase_date?: string | null;
  lot_number?: string | null;
  expiry_date?: string | null;
  last_dried_at?: string | null;
  pressure_advance_k?: number | null;
  short_id?: string | null;
  is_favorite?: number;
}

export interface SpoolEvent {
  id: number;
  spool_id: number;
  event_type: string;
  details?: string | null;
  actor?: string | null;
  timestamp: string;
}

export interface DryingStatusRow {
  id: number;
  last_dried_at?: string | null;
  profile_name?: string | null;
  material?: string | null;
  color_hex?: string | null;
  vendor_name?: string | null;
  max_days_without_drying?: number | null;
  drying_status?: string;
  days_since_dried?: number | null;
}

export interface StockTarget {
  material: string;
  min_weight_g: number;
  notes?: string | null;
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

export interface ProtectionEvent {
  id: number;
  printer_id: string;
  timestamp: string;
  event_type: string;
  action_taken?: string | null;
  resolved: number;
  notes?: string | null;
}

export interface GuardSettings {
  enabled: number;
  snooze_until?: string | null;
  [k: string]: unknown;
}
export interface GuardStatus {
  settings: GuardSettings;
  alerts: ProtectionEvent[];
}

export interface TelemetryPoint {
  time_bucket: string;
  nozzle_temp?: number | null;
  bed_temp?: number | null;
  chamber_temp?: number | null;
  fan_cooling?: number | null;
  fan_aux?: number | null;
  fan_chamber?: number | null;
  print_progress?: number | null;
}

export interface BackupFile {
  filename: string;
  size: number;
  created_at: string;
}

export interface CrmOrderItem {
  id: number;
  order_id: number;
  description: string;
  quantity: number;
  material_cost?: number | null;
  item_cost?: number | null;
  total_cost?: number | null;
  filament_type?: string | null;
}

export interface CrmOrder {
  id: number;
  customer_id: number | null;
  order_number: string;
  status: string;
  total_cost: number;
  currency: string;
  notes?: string | null;
  due_date?: string | null;
  created_at: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_company?: string | null;
  items?: CrmOrderItem[];
}

export interface CrmInvoice {
  id: number;
  order_id: number;
  invoice_number: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  due_date?: string | null;
  paid_at?: string | null;
  created_at: string;
  order_number?: string | null;
  customer_name?: string | null;
}

export interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  total_orders?: number;
  total_revenue?: number;
}

export interface SystemInfo {
  uptime_seconds: number;
  node_version: string;
  platform: string;
  printer_count: number;
  db_size: number;
  db_version: number;
  memory_mb: number;
  hostname: string;
  pid: number;
}

export interface FirmwareRow {
  id: number;
  printer_id: string;
  module: string;
  sw_ver: string;
  latest_available: string | null;
  update_available: number;
  release_url?: string | null;
}

export interface FirmwareInfo {
  lastCheckAt: string;
  inProgress: boolean;
  availableUpdates: FirmwareRow[];
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
  image_url?: string | null;
  specs?: string | null;
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
  has_lidar?: number;
  price_usd?: number | null;
  wiki_url?: string | null;
  nozzle_temp_max?: number | null;
  heated_bed_max?: number | null;
  weight_kg?: number | null;
  nozzle_type?: string | null;
  supported_nozzle_sizes?: string | null;
  pros?: string | null;
  cons?: string | null;
  tips?: string | null;
  supported_filaments?: string | null;
  connectivity?: string | null;
  image_url?: string | null;
}

export interface HmsInfo {
  code: string;
  description: string | null;
  wiki_url?: string;
}

export interface AppError {
  id: number;
  printer_id: string;
  timestamp: string;
  code: string;
  message: string;
  severity: string;
  acknowledged: number;
  context?: string | null;
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

export interface FilByPrinter {
  printer_id: string;
  material: string;
  total_used_g: number;
  total_waste_g: number;
  total_prints: number;
  avg_daily_g: number;
}

export interface FilWeekly {
  week: string;
  material: string;
  used_g: number;
  waste_g: number;
  prints: number;
  success_rate: number;
}

export interface FilCostRow {
  material: string;
  vendor: string | null;
  spool_count: number;
  avg_cost_per_g: number;
  min_cost_per_g: number;
  max_cost_per_g: number;
  total_spent: number;
}

export interface MaterialEfficiency {
  material: string;
  brand: string | null;
  print_count: number;
  avg_g_per_print: number;
  g_per_hour: number;
  avg_print_minutes: number;
  success_rate: number;
}

export interface MaintCostItem {
  id: number;
  component: string;
  cost: number;
  currency?: string | null;
  description?: string | null;
  timestamp?: string | null;
}

export interface MaintenanceCosts {
  printer_id: string;
  total: number;
  currency: string;
  items: MaintCostItem[];
}

export interface MaintenanceLogEntry {
  id: number;
  printer_id: string;
  component: string;
  action: string;
  timestamp: string;
  notes?: string | null;
  nozzle_type?: string | null;
  nozzle_diameter?: number | null;
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
  contact?: string | null;
  currency?: string | null;
  lead_time_days?: number | null;
  notes?: string | null;
  part_count?: number;
}

export interface SupplierPart {
  id: number;
  supplier_id: number;
  filament_profile_id?: number | null;
  sku?: string | null;
  price?: number | null;
  currency?: string | null;
  url?: string | null;
  in_stock?: number | null;
  profile_name?: string | null;
  material?: string | null;
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

export interface AmsDetail {
  sourceColor?: string;   // colour assigned in the slice (RGBA hex)
  targetColor?: string;   // actual AMS filament colour used at print time (RGBA hex)
  filamentType?: string;
  weight?: number;
}
export interface CloudTask {
  title?: string;
  designTitle?: string;
  cover?: string;
  amsDetailMapping?: AmsDetail[];
}

export interface PrintCost {
  filament_cost?: number;
  electricity_cost?: number;
  depreciation_cost?: number;
  labor_cost?: number;
  markup_amount?: number;
  total_cost?: number;
  currency?: string;
}

export interface FilamentUsed {
  spool_id: number;
  color_hex: string | null;
  multi_color_hexes?: string | null;
  material: string | null;
  name: string | null;
  color_name: string | null;
  used_g: number | null;
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
  filament_brand?: string | null;
  layer_count?: number;
  waste_g?: number | null;
  color_changes?: number | null;
  nozzle_type?: string | null;
  nozzle_diameter?: number | null;
  max_nozzle_temp?: number | null;
  max_bed_temp?: number | null;
  max_chamber_temp?: number | null;
  speed_level?: number | null;
  tray_id?: number | null;
  notes?: string | null;
  model_name?: string | null;
  model_url?: string | null;
  estimated_filament_g?: number | null;
  filament_accuracy_pct?: number | null;
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
