---
sidebar_position: 1
title: Authentication
description: Manage users, roles, permissions, API keys, and two-factor authentication with TOTP
---

# Authentication

Bambu Dashboard supports multiple users with role-based access control, API keys, and optional two-factor authentication (2FA) via TOTP.

Go to: **https://localhost:3443/#settings** → **Users and access**

## Users

### Creating a user

1. Go to **Settings → Users**
2. Click **New user**
3. Fill in:
   - **Username** — used for login
   - **Email address**
   - **Password** — minimum 12 characters recommended
   - **Role** — see roles below
4. Click **Create**

The new user can now log in at **https://localhost:3443/login**.

### Changing password

1. Go to **Profile** (top right corner → click on the username)
2. Click **Change password**
3. Fill in the current password and new password
4. Click **Save**

Administrators can reset others' passwords from **Settings → Users → [User] → Reset password**.

## Roles

| Role | Description |
|------|-------------|
| **Administrator** | Full access — all settings, users, and features |
| **Operator** | Control printers, view everything, but cannot change system settings |
| **Guest** | Read only — view dashboard, history, and statistics |
| **API user** | API access only — no web interface |

### Custom roles

1. Go to **Settings → Roles**
2. Click **New role**
3. Choose permissions individually:
   - View dashboard / history / statistics
   - Control printers (pause/stop/start)
   - Manage filament inventory
   - Manage queue
   - View camera stream
   - Change settings
   - Manage users
4. Click **Save**

## API keys

API keys provide programmatic access without logging in.

### Creating an API key

1. Go to **Settings → API keys**
2. Click **New key**
3. Fill in:
   - **Name** — descriptive name (e.g. "Home Assistant", "Python script")
   - **Expiry date** — optional, set for security
   - **Permissions** — choose role or specific permissions
4. Click **Generate**
5. **Copy the key now** — it is only shown once

### Using the API key

Add to the HTTP header for all API calls:
```
Authorization: Bearer YOUR_API_KEY
```

See [API Playground](../verktoy/playground) for testing.

:::danger Secure storage
API keys have the same access as the user they are linked to. Store them securely and rotate them regularly.
:::

## TOTP 2FA

Enable two-factor authentication with an authenticator app (Google Authenticator, Authy, Bitwarden, etc.):

### Enabling 2FA

1. Go to **Profile → Security → Two-factor authentication**
2. Click **Enable 2FA**
3. Scan the QR code with the authenticator app
4. Enter the generated 6-digit code to confirm
5. Save the **recovery codes** (10 single-use codes) in a secure place
6. Click **Activate**

### Logging in with 2FA

1. Enter username and password as usual
2. Enter the 6-digit TOTP code from the app
3. Click **Log in**

### Enforced 2FA for all users

Administrators can require 2FA for all users:

1. Go to **Settings → Security → Enforce 2FA**
2. Enable the setting
3. Users without 2FA will be forced to set it up at next login

## Session management

- Default session duration: 24 hours
- Adjust under **Settings → Security → Session duration**
- View active sessions per user and end individual sessions
