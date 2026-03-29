# CRM / Order Management System — Specification

> **Status:** Draft
> **Created:** 2026-03-29
> **Target version:** TBD
> **License requirement:** Active GeekTech.no e-commerce license

---

## 1. Overview

### Purpose

A built-in CRM and order management system for 3D print service businesses using Bambu Dashboard. This replaces and extends the existing project/order system (`projects` + `project_invoices` + `project_prints` tables) with a dedicated, customer-centric workflow designed for commercial print farms.

### Target Users

- Print farms running multiple Bambu Lab printers
- Makerspaces offering print-on-demand services
- Freelance 3D printing businesses
- Small manufacturing workshops

### License Requirement

All CRM endpoints and UI panels require an **active GeekTech.no e-commerce license** (`ecom_license.status = 'active'`). The existing license validation infrastructure in `server/db/ecommerce.js` and `server/ecom-license.js` is reused.

### Language Support

All 17 dashboard languages must be supported:

| Code   | Language              |
|--------|-----------------------|
| nb     | Norsk (bokmal)        |
| en     | English               |
| de     | Deutsch               |
| fr     | Francais              |
| es     | Espanol               |
| it     | Italiano              |
| nl     | Nederlands            |
| pl     | Polski                |
| sv     | Svenska               |
| cs     | Cestina               |
| hu     | Magyar                |
| tr     | Turkce                |
| pt_BR  | Portugues (Brasil)    |
| ja     | Japanese              |
| ko     | Korean                |
| zh_CN  | Chinese (Simplified)  |
| uk     | Ukrainian             |

### Relationship to Existing Systems

| Existing System | How CRM Interacts |
|---|---|
| `projects` table (mig v43/v88) | CRM orders can optionally link to a project. Existing projects system remains for non-commercial tracking. |
| `project_invoices` table (mig v88) | CRM introduces its own `crm_invoices` table with richer fields (PDF generation, payment tracking, due dates). Existing project invoices are not migrated. |
| `ecommerce_configs` / `ecommerce_orders` (mig v36) | External e-commerce webhook orders. CRM orders are internal/manual. A future phase may bridge them (auto-create CRM order from webhook order). |
| `cost_estimates` table (mig v84) | CRM order items reuse `estimatePrintCostAdvanced()` from `server/db/costs.js` for cost calculation. |
| `print_history` / `print_costs` | CRM order items can link to completed prints for actual cost tracking. |
| `print_queue` / `queue_items` | CRM orders can push items to print queue for scheduling. |

---

## 2. Database Schema

All tables use the `crm_` prefix to avoid conflicts with the existing `projects`/`project_invoices` tables.

### Migration: `_mig108_crm_system`

Next migration version: **108** (after current v107).

### 2.1 `crm_customers`

```sql
CREATE TABLE IF NOT EXISTS crm_customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  org_number TEXT,                        -- Organization/VAT number
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'NO',
  notes TEXT,
  tags TEXT DEFAULT '[]',                 -- JSON array of tag strings
  total_orders INTEGER DEFAULT 0,         -- Cached, updated on order create/delete
  total_revenue REAL DEFAULT 0,           -- Cached, updated on invoice paid
  currency TEXT DEFAULT 'NOK',
  deleted INTEGER DEFAULT 0,              -- Soft delete
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_crm_customers_email ON crm_customers(email);
CREATE INDEX IF NOT EXISTS idx_crm_customers_company ON crm_customers(company);
CREATE INDEX IF NOT EXISTS idx_crm_customers_deleted ON crm_customers(deleted);
```

### 2.2 `crm_orders`

```sql
CREATE TABLE IF NOT EXISTS crm_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER REFERENCES crm_customers(id),
  order_number TEXT NOT NULL UNIQUE,      -- Auto-generated: ORD-YYYYMMDD-XXXX
  status TEXT DEFAULT 'draft',            -- draft|pending|printing|completed|shipped|cancelled
  notes TEXT,
  internal_notes TEXT,                    -- Not visible on invoices/quotes
  due_date TEXT,
  currency TEXT DEFAULT 'NOK',
  discount_pct REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,         -- Flat discount (applied after percentage)
  tax_pct REAL DEFAULT 25,                -- Default Norwegian MVA
  subtotal REAL DEFAULT 0,                -- Sum of item totals (cached)
  tax_amount REAL DEFAULT 0,              -- Calculated (cached)
  total REAL DEFAULT 0,                   -- Grand total (cached)
  shipping_method TEXT,
  shipping_cost REAL DEFAULT 0,
  tracking_number TEXT,
  assigned_printer_id TEXT,               -- Preferred printer for this order
  project_id INTEGER,                     -- Optional link to existing projects table
  source TEXT DEFAULT 'manual',           -- manual|webhook|history|repeat
  source_ref TEXT,                        -- Reference ID from source (e.g., ecommerce_order id)
  priority INTEGER DEFAULT 0,             -- 0=normal, 1=high, 2=urgent
  completed_at TEXT,
  shipped_at TEXT,
  cancelled_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_crm_orders_customer ON crm_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_orders_status ON crm_orders(status);
CREATE INDEX IF NOT EXISTS idx_crm_orders_number ON crm_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_crm_orders_due ON crm_orders(due_date);
```

### 2.3 `crm_order_items`

```sql
CREATE TABLE IF NOT EXISTS crm_order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES crm_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  filename TEXT,
  file_hash TEXT,                         -- For linking to cost estimates
  quantity INTEGER DEFAULT 1,
  filament_type TEXT,
  filament_color TEXT,
  filament_weight_g REAL,
  estimated_time_min REAL,
  print_cost REAL DEFAULT 0,              -- From estimatePrintCostAdvanced()
  material_cost REAL DEFAULT 0,
  labor_cost REAL DEFAULT 0,
  electricity_cost REAL DEFAULT 0,
  depreciation_cost REAL DEFAULT 0,
  markup_amount REAL DEFAULT 0,
  unit_price REAL DEFAULT 0,              -- Manual override or calculated total per unit
  total_cost REAL DEFAULT 0,              -- unit_price * quantity
  print_history_id INTEGER,               -- Link to completed print
  queue_item_id INTEGER,                  -- Link to queue item if queued
  status TEXT DEFAULT 'pending',          -- pending|queued|printing|completed|failed|cancelled
  sort_order INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_crm_items_order ON crm_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_crm_items_status ON crm_order_items(status);
```

### 2.4 `crm_invoices`

```sql
CREATE TABLE IF NOT EXISTS crm_invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES crm_orders(id),
  customer_id INTEGER REFERENCES crm_customers(id),
  invoice_number TEXT NOT NULL UNIQUE,    -- Auto-generated: INV-YYYYMMDD-XXXX
  type TEXT DEFAULT 'invoice',            -- quote|invoice|credit_note
  status TEXT DEFAULT 'draft',            -- draft|sent|paid|overdue|cancelled
  -- Snapshot of order data at invoice time (immutable after sent)
  items TEXT NOT NULL DEFAULT '[]',       -- JSON snapshot of line items
  company_info TEXT DEFAULT '{}',         -- JSON: seller company details
  customer_info TEXT DEFAULT '{}',        -- JSON: buyer details snapshot
  subtotal REAL DEFAULT 0,
  discount_pct REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  shipping_cost REAL DEFAULT 0,
  tax_pct REAL DEFAULT 25,
  tax_amount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  currency TEXT DEFAULT 'NOK',
  payment_terms TEXT,                     -- e.g., "Net 14", "Net 30", "Due on receipt"
  payment_reference TEXT,                 -- KID number or reference
  bank_account TEXT,                      -- IBAN or account number
  due_date TEXT,
  sent_at TEXT,
  paid_at TEXT,
  pdf_path TEXT,                          -- Path to generated PDF
  notes TEXT,
  footer_text TEXT,                       -- Custom footer for invoice
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_crm_invoices_order ON crm_invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_crm_invoices_customer ON crm_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_invoices_status ON crm_invoices(status);
CREATE INDEX IF NOT EXISTS idx_crm_invoices_number ON crm_invoices(invoice_number);
```

### 2.5 `crm_order_files`

```sql
CREATE TABLE IF NOT EXISTS crm_order_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES crm_orders(id) ON DELETE CASCADE,
  order_item_id INTEGER REFERENCES crm_order_items(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  original_filename TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT,
  file_hash TEXT,
  uploaded_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_crm_files_order ON crm_order_files(order_id);
```

### 2.6 `crm_order_timeline`

```sql
CREATE TABLE IF NOT EXISTS crm_order_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES crm_orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,               -- created|status_changed|item_added|item_removed|
                                          -- invoice_created|invoice_sent|invoice_paid|
                                          -- file_uploaded|note_added|print_started|print_completed
  description TEXT,
  metadata TEXT DEFAULT '{}',             -- JSON: additional context
  timestamp TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_crm_timeline_order ON crm_order_timeline(order_id);
```

### 2.7 `crm_settings`

```sql
CREATE TABLE IF NOT EXISTS crm_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

Default settings to seed:

| Key | Default | Description |
|-----|---------|-------------|
| `company_name` | `''` | Seller company name |
| `company_address` | `''` | Seller address |
| `company_city` | `''` | Seller city |
| `company_postal_code` | `''` | Seller postal code |
| `company_country` | `'NO'` | Seller country |
| `company_org_number` | `''` | Organization/VAT number |
| `company_email` | `''` | Contact email |
| `company_phone` | `''` | Contact phone |
| `company_bank_account` | `''` | IBAN or account number |
| `company_logo_path` | `''` | Path to company logo |
| `default_tax_pct` | `'25'` | Default tax rate (Norwegian MVA) |
| `default_payment_terms` | `'Net 14'` | Default payment terms |
| `default_currency` | `'NOK'` | Default currency |
| `order_number_prefix` | `'ORD'` | Prefix for order numbers |
| `invoice_number_prefix` | `'INV'` | Prefix for invoice numbers |
| `order_number_counter` | `'0'` | Auto-increment counter |
| `invoice_number_counter` | `'0'` | Auto-increment counter |
| `invoice_footer` | `''` | Default invoice footer text |
| `default_markup_pct` | `'0'` | Default markup for CRM orders |

---

## 3. API Endpoints

All endpoints are prefixed with `/api/crm/` and require active e-commerce license.

### 3.1 License Middleware

```
Every /api/crm/* request → check ecom_license.status === 'active'
  → 403 { error: 'E-commerce license required', code: 'LICENSE_REQUIRED' }
```

Reuse the existing license check pattern from `server/api-routes.js` (search for `_ecomLicense` usage).

### 3.2 Customers

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/crm/customers` | List customers with search, pagination, sort |
| `POST` | `/api/crm/customers` | Create customer |
| `GET` | `/api/crm/customers/:id` | Get customer with order history summary |
| `PUT` | `/api/crm/customers/:id` | Update customer |
| `DELETE` | `/api/crm/customers/:id` | Soft delete (set `deleted = 1`) |
| `POST` | `/api/crm/customers/:id/restore` | Restore soft-deleted customer |

**GET /api/crm/customers query params:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search name, email, company, phone |
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 25, max: 100) |
| `sort` | string | Field to sort by (default: `created_at`) |
| `order` | string | `asc` or `desc` (default: `desc`) |
| `tag` | string | Filter by tag |
| `deleted` | bool | Include soft-deleted (default: false) |

**POST /api/crm/customers body:**

```json
{
  "name": "Ola Nordmann",
  "email": "ola@example.com",
  "phone": "+47 123 45 678",
  "company": "Nordmann AS",
  "org_number": "123456789",
  "address": "Storgata 1",
  "city": "Oslo",
  "postal_code": "0123",
  "country": "NO",
  "notes": "Prefers PLA+",
  "tags": ["retail", "repeat"]
}
```

**GET /api/crm/customers/:id response:**

```json
{
  "id": 1,
  "name": "Ola Nordmann",
  "...": "...all customer fields...",
  "orders": [
    { "id": 5, "order_number": "ORD-20260329-0005", "status": "completed", "total": 450.00, "created_at": "..." }
  ],
  "stats": {
    "total_orders": 12,
    "total_revenue": 15400.00,
    "avg_order_value": 1283.33,
    "last_order_at": "2026-03-15T10:30:00Z"
  }
}
```

### 3.3 Orders

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/crm/orders` | List orders with filters |
| `POST` | `/api/crm/orders` | Create order |
| `GET` | `/api/crm/orders/:id` | Get order with items, files, timeline |
| `PUT` | `/api/crm/orders/:id` | Update order details |
| `DELETE` | `/api/crm/orders/:id` | Cancel order (set status = `cancelled`) |
| `PATCH` | `/api/crm/orders/:id/status` | Change order status |
| `POST` | `/api/crm/orders/:id/recalculate` | Recalculate all item costs and order totals |
| `POST` | `/api/crm/orders/:id/duplicate` | Duplicate order (new draft with same items) |

**GET /api/crm/orders query params:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (comma-separated) |
| `customer_id` | int | Filter by customer |
| `search` | string | Search order number, customer name, notes |
| `from` | string | Created after (ISO date) |
| `to` | string | Created before (ISO date) |
| `priority` | int | Filter by priority |
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 25, max: 100) |
| `sort` | string | Sort field (default: `created_at`) |
| `order` | string | `asc` or `desc` (default: `desc`) |
| `overdue` | bool | Only show overdue orders |

**POST /api/crm/orders body:**

```json
{
  "customer_id": 1,
  "notes": "Rush order",
  "due_date": "2026-04-05",
  "discount_pct": 10,
  "tax_pct": 25,
  "shipping_method": "Posten",
  "shipping_cost": 79,
  "priority": 1,
  "items": [
    {
      "description": "Phone stand",
      "filename": "phone-stand-v3.3mf",
      "quantity": 5,
      "filament_type": "PLA",
      "filament_color": "Black",
      "unit_price": 45.00,
      "notes": "Use matte black"
    }
  ]
}
```

**PATCH /api/crm/orders/:id/status body:**

```json
{
  "status": "printing",
  "note": "Started printing batch 1"
}
```

Valid status transitions:

```
draft     → pending, cancelled
pending   → printing, cancelled
printing  → completed, cancelled
completed → shipped, cancelled
shipped   → (terminal)
cancelled → draft (reopen)
```

### 3.4 Order Items

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/crm/orders/:id/items` | Add item to order |
| `PUT` | `/api/crm/orders/:id/items/:itemId` | Update item |
| `DELETE` | `/api/crm/orders/:id/items/:itemId` | Remove item |
| `POST` | `/api/crm/orders/:id/items/:itemId/calculate` | Calculate cost for single item |
| `PATCH` | `/api/crm/orders/:id/items/:itemId/status` | Update item status |
| `POST` | `/api/crm/orders/:id/items/:itemId/link-print/:printId` | Link item to print history |
| `POST` | `/api/crm/orders/:id/items/:itemId/queue` | Push item to print queue |

**POST /api/crm/orders/:id/items/:itemId/calculate body:**

```json
{
  "filament_weight_g": 25.4,
  "estimated_time_min": 120,
  "spool_id": 42,
  "printer_id": "01P0930..."
}
```

Uses `estimatePrintCostAdvanced()` from `server/db/costs.js` and returns breakdown:

```json
{
  "material_cost": 6.35,
  "electricity_cost": 1.20,
  "depreciation_cost": 0.80,
  "labor_cost": 15.00,
  "markup_amount": 4.67,
  "total_cost": 28.02,
  "currency": "NOK"
}
```

### 3.5 Order from Print History

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/crm/orders/from-history/:printId` | Create order pre-filled from print history record |

**POST /api/crm/orders/from-history/:printId body:**

```json
{
  "customer_id": 1,
  "quantity": 3,
  "markup_pct": 30
}
```

Reads from `print_history` + `print_costs` to pre-fill:
- `filename` from `print_history.filename`
- `filament_type`, `filament_color`, `filament_weight_g` from print history
- `estimated_time_min` from `duration_seconds / 60`
- Cost breakdown from `print_costs` or recalculated via `estimatePrintCostAdvanced()`

### 3.6 Invoices

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/crm/orders/:orderId/invoice` | Generate invoice from order |
| `GET` | `/api/crm/invoices` | List all invoices with filters |
| `GET` | `/api/crm/invoices/:id` | Get invoice detail |
| `PATCH` | `/api/crm/invoices/:id/status` | Change status (sent/paid/overdue/cancelled) |
| `GET` | `/api/crm/invoices/:id/html` | Render invoice as HTML (for preview/PDF) |
| `GET` | `/api/crm/invoices/:id/pdf` | Download generated PDF |
| `POST` | `/api/crm/invoices/:id/regenerate` | Re-generate PDF |

**POST /api/crm/orders/:orderId/invoice body:**

```json
{
  "type": "invoice",
  "payment_terms": "Net 14",
  "notes": "Thank you for your order!",
  "footer_text": "Org.nr: 123456789 MVA"
}
```

When creating an invoice:
1. Snapshot current order items as JSON in `crm_invoices.items`
2. Snapshot customer info in `crm_invoices.customer_info`
3. Snapshot company info from `crm_settings` in `crm_invoices.company_info`
4. Calculate `due_date` from `payment_terms`
5. Auto-generate `invoice_number` using counter
6. Add timeline event to order

**PATCH /api/crm/invoices/:id/status body:**

```json
{
  "status": "paid",
  "paid_at": "2026-03-29T14:00:00Z"
}
```

When invoice is marked as paid:
- Update `crm_customers.total_revenue` (cached aggregate)
- Add timeline event to order
- If all invoices for order are paid, optionally prompt to mark order as completed

### 3.7 Files

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/crm/orders/:id/files` | Upload file (3MF/gcode/STL/image) |
| `GET` | `/api/crm/orders/:id/files` | List files for order |
| `GET` | `/api/crm/files/:fileId` | Download file |
| `DELETE` | `/api/crm/files/:fileId` | Delete file |
| `POST` | `/api/crm/orders/:id/files/:fileId/estimate` | Run cost estimator on uploaded file |

File upload uses the same 3MF/gcode parsing as the existing cost estimator (`/api/cost-estimator/upload`). Files are stored in `data/crm/files/{orderId}/`.

### 3.8 CRM Dashboard

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/crm/dashboard` | Overview statistics |

**Response:**

```json
{
  "orders": {
    "total": 156,
    "this_month": 12,
    "by_status": {
      "draft": 2,
      "pending": 5,
      "printing": 3,
      "completed": 140,
      "shipped": 4,
      "cancelled": 2
    },
    "overdue": 1
  },
  "revenue": {
    "this_month": 12500.00,
    "last_month": 9800.00,
    "this_year": 145000.00,
    "currency": "NOK"
  },
  "invoices": {
    "unpaid_count": 3,
    "unpaid_total": 4200.00,
    "overdue_count": 1,
    "overdue_total": 1500.00
  },
  "customers": {
    "total": 45,
    "new_this_month": 3
  },
  "top_customers": [
    { "id": 1, "name": "Nordmann AS", "total_revenue": 52000.00, "order_count": 28 }
  ],
  "recent_orders": [
    { "id": 200, "order_number": "ORD-20260329-0200", "customer_name": "...", "status": "pending", "total": 450.00, "created_at": "..." }
  ],
  "monthly_revenue": [
    { "month": "2026-01", "revenue": 11200.00, "order_count": 9 },
    { "month": "2026-02", "revenue": 9800.00, "order_count": 8 },
    { "month": "2026-03", "revenue": 12500.00, "order_count": 12 }
  ]
}
```

### 3.9 CRM Settings

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/crm/settings` | Get all CRM settings |
| `PUT` | `/api/crm/settings` | Update settings (partial) |
| `POST` | `/api/crm/settings/logo` | Upload company logo |

### 3.10 Export

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/crm/export/orders` | Export orders as CSV |
| `GET` | `/api/crm/export/customers` | Export customers as CSV |
| `GET` | `/api/crm/export/invoices` | Export invoices as CSV |

Query params: `from`, `to`, `status`, `customer_id`.

---

## 4. Frontend UI Plan

### 4.1 Sidebar Section

New sidebar section, only visible when `ecom_license.status === 'active'`:

```
Bedrift (Business)
  ├── Oversikt (Dashboard)
  ├── Kunder (Customers)
  ├── Ordrer (Orders)
  ├── Fakturaer (Invoices)
  └── Innstillinger (CRM Settings)
```

This should follow the same pattern as the existing sidebar sections in `public/index.html`. The section visibility is controlled by checking the license status from `/api/ecommerce/license` (already used by existing e-commerce features).

### 4.2 Panel Architecture

Each view is a standalone panel component, following the existing pattern from `public/js/components/order-panel.js` and `public/js/components/cost-estimator-panel.js`:

| Panel File | Purpose |
|---|---|
| `public/js/components/crm-dashboard-panel.js` | CRM overview with stats, charts, recent activity |
| `public/js/components/crm-customers-panel.js` | Customer list, search, CRUD |
| `public/js/components/crm-orders-panel.js` | Order list, filters, status management |
| `public/js/components/crm-order-detail-panel.js` | Single order view with items, files, timeline |
| `public/js/components/crm-invoices-panel.js` | Invoice list and management |
| `public/js/components/crm-settings-panel.js` | Company info, defaults, templates |

Each panel uses:
- `_tl(key, fallback)` pattern for translations (same as existing panels)
- `_esc(s)` for HTML escaping
- Tab bars where appropriate
- Overlay panel rendering (`overlay-panel-body`)

### 4.3 CRM Dashboard Panel

**Stats strip** (4 cards, same pattern as `order-panel.js` line 75-80):
- Active orders count
- Revenue this month
- Unpaid invoices count
- Overdue orders count

**Charts:**
- Revenue by month (bar chart, last 6 months) — use the existing chart rendering pattern or simple CSS bar chart
- Orders by status (horizontal stacked bar or pill badges)

**Lists:**
- Recent orders (last 10, clickable)
- Top 5 customers by revenue
- Upcoming deadlines

### 4.4 Customers Panel

**List view:**
- Search bar (searches name, email, company, phone)
- Tag filter pills
- Sortable columns: Name, Company, Orders, Revenue, Last Order, Created
- Pagination
- "New Customer" button

**Customer detail** (slide-in or overlay):
- Contact info (editable inline)
- Order history table
- Revenue stats
- Notes
- Delete (soft) / Restore

### 4.5 Orders Panel

**List view:**
- Status filter tabs: All | Draft | Pending | Printing | Completed | Shipped | Cancelled
- Search bar
- Priority badges (normal / high / urgent)
- Overdue indicator (red if past due_date)
- Sortable columns: Order #, Customer, Status, Total, Due Date, Created
- Bulk actions: change status, export
- "New Order" button

**New Order form:**
- Customer select (search/autocomplete, or "New Customer" inline)
- Order items list:
  - Description, Quantity, Unit Price (manual or calculated)
  - "Calculate Cost" button per item (opens cost estimator integration)
  - "Upload File" button (3MF/gcode for auto-estimation)
  - Remove item button
- Discount %, flat discount, tax %
- Shipping method + cost
- Due date, priority, notes
- Running total display (subtotal, discount, tax, shipping, total)
- Save as Draft / Create Order

### 4.6 Order Detail Panel

**Header:**
- Order number + status badge
- Customer name (clickable to customer detail)
- Priority badge
- Due date (with overdue warning)
- Action buttons: Edit, Change Status, Generate Invoice, Duplicate, Cancel

**Tabs:**
1. **Items** — Table of order items with status, cost breakdown, actions
2. **Files** — Uploaded files with download/delete, drag-and-drop upload zone
3. **Invoice** — Linked invoices with status, PDF download
4. **Timeline** — Activity log (status changes, notes, prints linked, invoices)

**Items table columns:**
- Description, Filename, Qty, Material, Status, Unit Price, Total
- Actions: Edit, Calculate Cost, Link to Print, Push to Queue, Remove

### 4.7 Invoice Panel

**List view:**
- Status filter tabs: All | Draft | Sent | Paid | Overdue | Cancelled
- Search by invoice number, customer name
- Columns: Invoice #, Customer, Order #, Total, Status, Due Date, Created

**Invoice detail:**
- Preview (rendered HTML, same format as PDF)
- Actions: Send (mark as sent), Mark Paid, Download PDF, Regenerate

**Invoice template** (HTML rendered):
- Company logo + info (top left)
- Invoice number + date (top right)
- Customer info block
- Line items table: Description, Qty, Unit Price, Total
- Subtotal, Discount, Shipping, Tax, Grand Total
- Payment terms, bank account, reference
- Footer text

### 4.8 CRM Settings Panel

**Sections:**
- Company Information (name, address, org number, email, phone, logo upload)
- Invoice Defaults (tax rate, payment terms, currency, footer text)
- Order Numbering (prefix, next number)
- Invoice Numbering (prefix, next number)
- Default Markup %

### 4.9 Print History Integration

On the existing print history detail view, add a new button:

**"Create Order from Print"** button

- Only visible when e-commerce license is active
- Opens a modal/overlay pre-filled with:
  - Filename from print
  - Filament type, color, weight from print data
  - Duration converted to estimated_time_min
  - Cost breakdown from `print_costs` or recalculated
- User selects/creates customer, sets quantity and markup
- Creates a new CRM order in `draft` status

---

## 5. Cost Integration

### 5.1 Per-Item Cost Calculation

Reuse `estimatePrintCostAdvanced()` from `server/db/costs.js` (lines 329-386).

**Input parameters per item:**
- `filament_weight_g` — from file analysis or manual input
- `estimated_time_min` — from file analysis or manual input
- `spool_id` — optional, for accurate filament cost
- `printer_id` — optional, for printer-specific electricity/wear rates

**Output breakdown stored on `crm_order_items`:**
- `material_cost` — filament cost per gram * weight
- `electricity_cost` — wattage * hours * rate
- `depreciation_cost` — machine cost / lifetime hours * duration
- `labor_cost` — hourly rate * (duration + setup time)
- `markup_amount` — subtotal * markup%

### 5.2 Order Total Calculation

```
for each item:
  item.total_cost = item.unit_price * item.quantity

order.subtotal = SUM(item.total_cost) + order.shipping_cost
discount = (order.subtotal * order.discount_pct / 100) + order.discount_amount
order.tax_amount = (order.subtotal - discount) * order.tax_pct / 100
order.total = order.subtotal - discount + order.tax_amount
```

### 5.3 Unit Price Strategy

The `unit_price` per item can be set in two ways:
1. **Calculated:** Use `estimatePrintCostAdvanced()` result as base, then apply per-order markup
2. **Manual override:** User sets a custom unit price directly

The UI should show both the calculated cost (as reference) and allow manual override.

### 5.4 File Upload Cost Estimation

When a user uploads a 3MF or gcode file to an order item:
1. Parse file using the same logic as `/api/cost-estimator/upload`
2. Extract: filament weight, estimated print time, filament type
3. Run `estimatePrintCostAdvanced()` with extracted data
4. Auto-populate item fields: `filament_weight_g`, `estimated_time_min`, cost breakdown
5. User reviews and confirms/adjusts

---

## 6. Invoice Generation

### 6.1 HTML Template

Invoices are rendered as HTML first, then optionally converted to PDF.

Template structure:
```html
<div class="crm-invoice">
  <header>
    <div class="company-info">Logo, Name, Address, Org#, Email, Phone</div>
    <div class="invoice-meta">Invoice #, Date, Due Date, Reference</div>
  </header>
  <div class="customer-info">Name, Company, Address, Org#</div>
  <table class="line-items">
    <thead>Description | Qty | Unit Price | Total</thead>
    <tbody>...items...</tbody>
  </table>
  <div class="totals">
    Subtotal | Discount | Shipping | Tax (X%) | Grand Total
  </div>
  <div class="payment-info">Bank Account, Payment Reference, Terms</div>
  <footer>Custom footer text</footer>
</div>
```

### 6.2 PDF Generation

**Approach:** Server-side HTML-to-PDF using one of:

| Option | Pros | Cons |
|--------|------|------|
| **puppeteer** | High fidelity, full CSS support | Heavy dependency (~300MB) |
| **jsPDF + html2canvas** | Client-side, no server dep | Inconsistent rendering |
| **pdfkit** | Lightweight, server-side | No HTML rendering, manual layout |
| **html-pdf-node** (puppeteer-based) | Simple API | Still needs Chromium |

**Recommended:** `pdfkit` for lightweight server-side generation, or allow the user to "Print to PDF" from the HTML preview in the browser. Start with browser-based PDF (window.print()) in Phase 4, add server-side generation later.

### 6.3 Storage

Generated PDFs stored in: `data/crm/invoices/{YYYY}/{invoice_number}.pdf`

---

## 7. Implementation Phases

### Phase 1: Database + Core API (Backend)

**Scope:** Database migration, CRM settings, customer CRUD, order CRUD

**Files to create:**
- `server/db/crm.js` — All CRM database functions (customers, orders, items, invoices, settings, timeline)
- Add migration `_mig108_crm_system` to `server/db/migrations.js`
- Add `export * from './crm.js'` to `server/db/index.js`

**Files to modify:**
- `server/api-routes.js` — Add all `/api/crm/*` route handlers with license check middleware

**Endpoints in this phase:**
- All customer endpoints (3.2)
- All order endpoints (3.3)
- All order item endpoints (3.4)
- CRM settings endpoints (3.9)

**Validation rules:**
- Customer: `name` required, `email` validated if provided
- Order: `customer_id` must reference existing non-deleted customer
- Order item: `description` required, `quantity` >= 1
- Status transitions enforced per state machine (3.3)

**Estimated effort:** 2-3 days

### Phase 2: Customer + Order UI

**Scope:** Frontend panels for customer and order management

**Files to create:**
- `public/js/components/crm-customers-panel.js`
- `public/js/components/crm-orders-panel.js`
- `public/js/components/crm-order-detail-panel.js`
- `public/js/components/crm-settings-panel.js`
- `public/css/crm.css` — CRM-specific styles

**Files to modify:**
- `public/index.html` — Add sidebar section, load new JS/CSS
- `public/js/app.js` — Panel routing for CRM views

**Features:**
- Customer list with search, create/edit modal
- Order list with status filters
- Order create form with item management
- Order detail view with item table
- CRM settings form (company info)
- Sidebar section with license check visibility

**Estimated effort:** 4-5 days

### Phase 3: Cost Calculation + File Upload

**Scope:** Integrate cost estimator into orders, file upload with auto-estimation

**Files to create:**
- `server/crm-files.js` — File upload handler, storage management

**Files to modify:**
- `server/api-routes.js` — Add file upload/download endpoints
- `public/js/components/crm-order-detail-panel.js` — Add file upload zone, cost calculation buttons

**Features:**
- Upload 3MF/gcode per order item
- Auto-parse and calculate cost using existing `estimatePrintCostAdvanced()`
- Show cost breakdown per item (material, electricity, wear, labor, markup)
- Manual unit price override
- Order total recalculation with discount/tax/shipping

**Estimated effort:** 2-3 days

### Phase 4: Print History Integration + Queue

**Scope:** Create orders from print history, push items to print queue

**Files to modify:**
- `public/js/components/history-panel.js` (or equivalent) — Add "Create Order" button
- `server/api-routes.js` — Add from-history endpoint, queue push endpoint

**Features:**
- "Create Order from Print" button on print history detail
- Pre-populate order item from print data
- Link completed prints to order items
- Push order items to print queue
- Auto-update item status when linked print completes

**Estimated effort:** 2 days

### Phase 5: Invoice + Dashboard

**Scope:** Invoice generation, CRM dashboard with stats

**Files to create:**
- `public/js/components/crm-dashboard-panel.js`
- `public/js/components/crm-invoices-panel.js`
- `server/crm-invoice-template.js` — HTML invoice template renderer

**Files to modify:**
- `server/api-routes.js` — Add invoice and dashboard endpoints

**Features:**
- Generate invoice from order (snapshot line items)
- Invoice HTML preview
- Browser-based PDF export (window.print)
- Invoice status management (draft/sent/paid/overdue)
- CRM dashboard with stats cards, revenue chart, recent orders
- Top customers list

**Estimated effort:** 3-4 days

### Phase 6: Polish + i18n

**Scope:** Translations, export, notifications, edge cases

**Files to modify:**
- All 17 language files in `public/lang/*.json`
- All CRM panel files (ensure all strings use `_tl()`)

**Features:**
- Add all `crm.*` translation keys to all 17 language files
- CSV export for orders, customers, invoices
- Order timeline with detailed event descriptions
- Email notification hooks (order status changes) — optional, depends on notification system
- Responsive design adjustments
- Keyboard shortcuts
- Loading states, error handling, empty states

**Estimated effort:** 3-4 days

### Total Estimated Effort: 16-21 days

---

## 8. i18n Translation Keys

All keys are prefixed with `crm.` to avoid conflicts with existing translations.

### 8.1 Navigation

```
crm.nav_business                  = "Business" / "Bedrift"
crm.nav_dashboard                 = "Dashboard" / "Oversikt"
crm.nav_customers                 = "Customers" / "Kunder"
crm.nav_orders                    = "Orders" / "Ordrer"
crm.nav_invoices                  = "Invoices" / "Fakturaer"
crm.nav_settings                  = "CRM Settings" / "CRM-innstillinger"
```

### 8.2 Common

```
crm.save                          = "Save" / "Lagre"
crm.cancel                        = "Cancel" / "Avbryt"
crm.delete                        = "Delete" / "Slett"
crm.edit                          = "Edit" / "Rediger"
crm.create                        = "Create" / "Opprett"
crm.search                        = "Search..." / "Sok..."
crm.no_results                    = "No results found" / "Ingen resultater"
crm.loading                       = "Loading..." / "Laster..."
crm.confirm_delete                = "Are you sure you want to delete this?" / "Er du sikker pa at du vil slette dette?"
crm.export_csv                    = "Export CSV" / "Eksporter CSV"
crm.actions                       = "Actions" / "Handlinger"
crm.notes                         = "Notes" / "Notater"
crm.created_at                    = "Created" / "Opprettet"
crm.updated_at                    = "Updated" / "Oppdatert"
crm.currency                      = "Currency" / "Valuta"
crm.total                         = "Total" / "Totalt"
crm.subtotal                      = "Subtotal" / "Delsum"
crm.tax                           = "Tax" / "MVA"
crm.discount                      = "Discount" / "Rabatt"
crm.page_of                       = "Page {current} of {total}" / "Side {current} av {total}"
```

### 8.3 Customers

```
crm.customer                      = "Customer" / "Kunde"
crm.customers                     = "Customers" / "Kunder"
crm.new_customer                  = "New Customer" / "Ny kunde"
crm.edit_customer                 = "Edit Customer" / "Rediger kunde"
crm.customer_name                 = "Name" / "Navn"
crm.customer_email                = "Email" / "E-post"
crm.customer_phone                = "Phone" / "Telefon"
crm.customer_company              = "Company" / "Firma"
crm.customer_org_number           = "Org. Number" / "Org.nr"
crm.customer_address              = "Address" / "Adresse"
crm.customer_city                 = "City" / "By"
crm.customer_postal_code          = "Postal Code" / "Postnr"
crm.customer_country              = "Country" / "Land"
crm.customer_tags                 = "Tags" / "Tagger"
crm.customer_total_orders         = "Total Orders" / "Totale ordrer"
crm.customer_total_revenue        = "Total Revenue" / "Total omsetning"
crm.customer_deleted              = "Customer deleted" / "Kunde slettet"
crm.customer_restored             = "Customer restored" / "Kunde gjenopprettet"
crm.customer_no_orders            = "No orders yet" / "Ingen ordrer enda"
crm.customer_last_order           = "Last Order" / "Siste ordre"
crm.customer_avg_order            = "Avg Order Value" / "Snitt ordreverdi"
crm.customer_since                = "Customer since" / "Kunde siden"
```

### 8.4 Orders

```
crm.order                         = "Order" / "Ordre"
crm.orders                        = "Orders" / "Ordrer"
crm.new_order                     = "New Order" / "Ny ordre"
crm.edit_order                    = "Edit Order" / "Rediger ordre"
crm.order_number                  = "Order #" / "Ordre #"
crm.order_status                  = "Status" / "Status"
crm.order_due_date                = "Due Date" / "Frist"
crm.order_priority                = "Priority" / "Prioritet"
crm.order_notes                   = "Notes" / "Notater"
crm.order_internal_notes          = "Internal Notes" / "Interne notater"
crm.order_shipping                = "Shipping" / "Frakt"
crm.order_shipping_method         = "Shipping Method" / "Fraktmetode"
crm.order_shipping_cost           = "Shipping Cost" / "Fraktkostnad"
crm.order_tracking                = "Tracking Number" / "Sporingsnummer"
crm.order_discount_pct            = "Discount %" / "Rabatt %"
crm.order_discount_amount         = "Discount Amount" / "Rabattbelop"
crm.order_tax_pct                 = "Tax %" / "MVA %"
crm.order_duplicate               = "Duplicate Order" / "Dupliser ordre"
crm.order_recalculate             = "Recalculate Costs" / "Beregn kostnader pa nytt"
crm.order_create_invoice          = "Generate Invoice" / "Generer faktura"
crm.order_from_history            = "Create Order from Print" / "Opprett ordre fra utskrift"
crm.order_overdue                 = "Overdue" / "Forsinket"
crm.order_no_items                = "No items yet" / "Ingen elementer enda"
crm.order_select_customer         = "Select Customer" / "Velg kunde"
crm.order_assigned_printer        = "Assigned Printer" / "Tilordnet printer"

crm.status_draft                  = "Draft" / "Utkast"
crm.status_pending                = "Pending" / "Venter"
crm.status_printing               = "Printing" / "Printer"
crm.status_completed              = "Completed" / "Fullfort"
crm.status_shipped                = "Shipped" / "Sendt"
crm.status_cancelled              = "Cancelled" / "Kansellert"

crm.priority_normal               = "Normal" / "Normal"
crm.priority_high                 = "High" / "Hoy"
crm.priority_urgent               = "Urgent" / "Haster"
```

### 8.5 Order Items

```
crm.item                          = "Item" / "Element"
crm.items                         = "Items" / "Elementer"
crm.add_item                      = "Add Item" / "Legg til element"
crm.item_description              = "Description" / "Beskrivelse"
crm.item_filename                 = "File" / "Fil"
crm.item_quantity                 = "Quantity" / "Antall"
crm.item_unit_price               = "Unit Price" / "Enhetspris"
crm.item_total                    = "Total" / "Totalt"
crm.item_filament_type            = "Filament Type" / "Filamenttype"
crm.item_filament_color           = "Color" / "Farge"
crm.item_filament_weight          = "Weight (g)" / "Vekt (g)"
crm.item_estimated_time           = "Est. Time" / "Est. tid"
crm.item_calculate_cost           = "Calculate Cost" / "Beregn kostnad"
crm.item_cost_breakdown           = "Cost Breakdown" / "Kostnadsfordeling"
crm.item_material_cost            = "Material" / "Materiale"
crm.item_electricity_cost         = "Electricity" / "Strom"
crm.item_depreciation_cost        = "Wear" / "Slitasje"
crm.item_labor_cost               = "Labor" / "Arbeid"
crm.item_markup                   = "Markup" / "Paslag"
crm.item_push_to_queue            = "Push to Queue" / "Legg i ko"
crm.item_link_print               = "Link to Print" / "Koble til utskrift"
crm.item_upload_file              = "Upload File" / "Last opp fil"

crm.item_status_pending           = "Pending" / "Venter"
crm.item_status_queued            = "Queued" / "I ko"
crm.item_status_printing          = "Printing" / "Printer"
crm.item_status_completed         = "Completed" / "Fullfort"
crm.item_status_failed            = "Failed" / "Feilet"
crm.item_status_cancelled         = "Cancelled" / "Kansellert"
```

### 8.6 Invoices

```
crm.invoice                       = "Invoice" / "Faktura"
crm.invoices                      = "Invoices" / "Fakturaer"
crm.new_invoice                   = "New Invoice" / "Ny faktura"
crm.invoice_number                = "Invoice #" / "Fakturanr"
crm.invoice_date                  = "Invoice Date" / "Fakturadato"
crm.invoice_due_date              = "Due Date" / "Forfallsdato"
crm.invoice_payment_terms         = "Payment Terms" / "Betalingsbetingelser"
crm.invoice_payment_ref           = "Payment Reference" / "Betalingsreferanse"
crm.invoice_bank_account          = "Bank Account" / "Bankkonto"
crm.invoice_preview               = "Preview" / "Forhandsvisning"
crm.invoice_download_pdf          = "Download PDF" / "Last ned PDF"
crm.invoice_mark_sent             = "Mark as Sent" / "Merk som sendt"
crm.invoice_mark_paid             = "Mark as Paid" / "Merk som betalt"
crm.invoice_regenerate            = "Regenerate" / "Generer pa nytt"

crm.invoice_type_quote            = "Quote" / "Tilbud"
crm.invoice_type_invoice          = "Invoice" / "Faktura"
crm.invoice_type_credit           = "Credit Note" / "Kreditnota"

crm.invoice_status_draft          = "Draft" / "Utkast"
crm.invoice_status_sent           = "Sent" / "Sendt"
crm.invoice_status_paid           = "Paid" / "Betalt"
crm.invoice_status_overdue        = "Overdue" / "Forfalt"
crm.invoice_status_cancelled      = "Cancelled" / "Kansellert"
```

### 8.7 Dashboard

```
crm.dashboard_title               = "Business Overview" / "Bedriftsoversikt"
crm.dashboard_active_orders       = "Active Orders" / "Aktive ordrer"
crm.dashboard_revenue_month       = "Revenue This Month" / "Omsetning denne mnd"
crm.dashboard_revenue_year        = "Revenue This Year" / "Omsetning i ar"
crm.dashboard_unpaid_invoices     = "Unpaid Invoices" / "Ubetalte fakturaer"
crm.dashboard_overdue_orders      = "Overdue Orders" / "Forsinket ordrer"
crm.dashboard_new_customers       = "New Customers" / "Nye kunder"
crm.dashboard_top_customers       = "Top Customers" / "Topp kunder"
crm.dashboard_recent_orders       = "Recent Orders" / "Siste ordrer"
crm.dashboard_monthly_revenue     = "Monthly Revenue" / "Manedlig omsetning"
crm.dashboard_orders_by_status    = "Orders by Status" / "Ordrer etter status"
```

### 8.8 Settings

```
crm.settings_title                = "CRM Settings" / "CRM-innstillinger"
crm.settings_company_info         = "Company Information" / "Firmainformasjon"
crm.settings_company_name         = "Company Name" / "Firmanavn"
crm.settings_company_address      = "Address" / "Adresse"
crm.settings_company_city         = "City" / "By"
crm.settings_company_postal       = "Postal Code" / "Postnr"
crm.settings_company_country      = "Country" / "Land"
crm.settings_company_org          = "Org. Number" / "Org.nr"
crm.settings_company_email        = "Email" / "E-post"
crm.settings_company_phone        = "Phone" / "Telefon"
crm.settings_company_bank         = "Bank Account" / "Bankkonto"
crm.settings_company_logo         = "Company Logo" / "Firmalogo"
crm.settings_invoice_defaults     = "Invoice Defaults" / "Fakturastandarder"
crm.settings_default_tax          = "Default Tax %" / "Standard MVA %"
crm.settings_default_terms        = "Default Payment Terms" / "Standard betalingsbetingelser"
crm.settings_default_currency     = "Default Currency" / "Standardvaluta"
crm.settings_default_markup       = "Default Markup %" / "Standard paslag %"
crm.settings_invoice_footer       = "Invoice Footer" / "Fakturabunntekst"
crm.settings_order_prefix         = "Order Number Prefix" / "Ordrenummer-prefiks"
crm.settings_invoice_prefix       = "Invoice Number Prefix" / "Fakturanummer-prefiks"
crm.settings_saved                = "Settings saved" / "Innstillinger lagret"
```

### 8.9 Timeline Events

```
crm.timeline_order_created        = "Order created" / "Ordre opprettet"
crm.timeline_status_changed       = "Status changed to {status}" / "Status endret til {status}"
crm.timeline_item_added           = "Item added: {description}" / "Element lagt til: {description}"
crm.timeline_item_removed         = "Item removed: {description}" / "Element fjernet: {description}"
crm.timeline_invoice_created      = "Invoice {number} created" / "Faktura {number} opprettet"
crm.timeline_invoice_sent         = "Invoice {number} sent" / "Faktura {number} sendt"
crm.timeline_invoice_paid         = "Invoice {number} paid" / "Faktura {number} betalt"
crm.timeline_file_uploaded        = "File uploaded: {filename}" / "Fil lastet opp: {filename}"
crm.timeline_note_added           = "Note added" / "Notat lagt til"
crm.timeline_print_linked         = "Print linked: {filename}" / "Utskrift koblet: {filename}"
crm.timeline_print_completed      = "Print completed: {filename}" / "Utskrift fullfort: {filename}"
crm.timeline_cost_calculated      = "Costs recalculated" / "Kostnader beregnet pa nytt"
crm.timeline_order_duplicated     = "Order duplicated from #{source}" / "Ordre duplisert fra #{source}"
```

### 8.10 Errors

```
crm.error_license_required        = "E-commerce license required" / "E-handelslisens pakrevd"
crm.error_customer_not_found      = "Customer not found" / "Kunde ikke funnet"
crm.error_order_not_found         = "Order not found" / "Ordre ikke funnet"
crm.error_invoice_not_found       = "Invoice not found" / "Faktura ikke funnet"
crm.error_invalid_status          = "Invalid status transition" / "Ugyldig statusovergang"
crm.error_name_required           = "Name is required" / "Navn er pakrevd"
crm.error_description_required    = "Description is required" / "Beskrivelse er pakrevd"
crm.error_quantity_invalid        = "Quantity must be at least 1" / "Antall ma vaere minst 1"
crm.error_file_too_large          = "File is too large (max 100 MB)" / "Filen er for stor (maks 100 MB)"
crm.error_unsupported_file        = "Unsupported file type" / "Ustottet filtype"
```

---

## 9. Security Considerations

### 9.1 Input Validation

All API endpoints must validate:
- String lengths (max 255 for names, 1000 for notes)
- Email format validation
- Phone number format (basic)
- Numeric ranges (quantity >= 1, percentages 0-100, costs >= 0)
- Status values against allowed enums
- File types for uploads (3MF, gcode, STL, images only)
- File size limits (100 MB per file)

### 9.2 SQL Injection Prevention

All database queries use parameterized statements (already the pattern in all existing `server/db/*.js` files).

### 9.3 XSS Prevention

All user-provided strings rendered in HTML must be escaped using the `_esc()` pattern (already used in all existing panel components).

### 9.4 Authorization

- All `/api/crm/*` endpoints require active e-commerce license
- If user authentication is enabled, CRM access should require admin or manager role
- File download endpoints must verify the file belongs to a valid order

### 9.5 File Upload Security

- Validate file extensions and MIME types
- Store uploaded files outside the public web root (`data/crm/files/`)
- Generate unique filenames (UUID) to prevent path traversal
- Scan file headers (magic bytes) to verify file type matches extension

### 9.6 Rate Limiting

CRM endpoints should inherit the existing global rate limiting (200 req/min per the dashboard's current configuration).

---

## 10. Data Storage Locations

| Content | Path |
|---------|------|
| Uploaded order files | `data/crm/files/{orderId}/{uuid}-{filename}` |
| Generated invoice PDFs | `data/crm/invoices/{YYYY}/{invoice_number}.pdf` |
| Company logo | `data/crm/logo.{ext}` |

The `data/` directory is the existing data storage root used by the Bambu Dashboard.

---

## 11. Future Considerations (Out of Scope for v1)

These are intentionally deferred to keep the initial implementation focused:

- **Email sending:** Actually sending invoices/notifications via email (SMTP integration)
- **E-commerce bridge:** Auto-creating CRM orders from webhook-received e-commerce orders
- **Recurring orders:** Template-based repeat orders on a schedule
- **Multi-currency:** Full multi-currency support with exchange rates
- **Customer portal:** Web portal where customers can view their orders/invoices
- **Payment integration:** Stripe/Vipps payment links on invoices
- **Inventory reservation:** Reserve filament stock for pending orders
- **Reports:** Advanced business analytics and reporting (profit margins, customer lifetime value, etc.)
- **Webhooks/API:** Outgoing webhooks for CRM events (order created, invoice paid, etc.)
- **Import:** Bulk import customers/orders from CSV
