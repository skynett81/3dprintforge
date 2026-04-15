# Installing 3DPrintForge on Windows

## ⚠️ Windows Defender SmartScreen Warning

When you run the installer or portable version for the first time, **Windows SmartScreen may block it** with a message like:

> **Windows protected your PC**
> Microsoft Defender SmartScreen prevented an unrecognized app from starting.

This happens because the installer isn't yet **code-signed** with a Microsoft-trusted certificate. It does **not** mean the software is malicious — it means the binary is new and unknown to Microsoft.

---

## ✅ How to install anyway

### Option 1: Bypass SmartScreen (recommended for first install)

1. Download the installer from the [official GitHub release](https://github.com/skynett81/3dprintforge/releases/latest)
2. **Right-click the downloaded `.exe` → Properties**
3. At the bottom of the General tab, check the **"Unblock"** checkbox
4. Click **OK**
5. Double-click the `.exe` to run it
6. If SmartScreen still appears, click **"More info"** → **"Run anyway"**

### Option 2: Verify the file integrity first (more secure)

Before running, verify the SHA-256 hash matches the published checksum:

1. Download both the `.exe` and `SHA256SUMS.txt` from the release
2. Open PowerShell in the download folder and run:

```powershell
Get-FileHash .\3DPrintForge-Setup-1.1.18.exe -Algorithm SHA256
```

3. Compare the hash with the value in `SHA256SUMS.txt`:

```
ccc5b191c38a0942c45473600c5a5bdd11a117f45412d0583a8e020ecfb5f9d9  3DPrintForge-Setup-1.1.18.exe
4d10765d18d60469bcedd04ec560769f04344112a32afa5e76524bcb0c2d306b  3DPrintForge-Portable-1.1.18.exe
```

4. If the hashes match, the file is exactly what was published by the developer.

### Option 3: Temporarily disable SmartScreen (not recommended)

Go to **Windows Security → App & browser control → Reputation-based protection settings**, and toggle off "Check apps and files".
**Re-enable it after installing 3DPrintForge.**

---

## 🔒 Why isn't it signed?

Code signing certificates for Windows cost between **$100 and $500 per year** from commercial CAs (DigiCert, Sectigo, etc.). For an open-source project, we're working on enrolling in **[SignPath.io](https://signpath.io/)**, which provides free EV code signing for open source — but approval can take a few weeks.

Once approved, all future releases will be signed and SmartScreen will no longer warn.

---

## 🐞 Reporting a false positive to Microsoft

If you want to help fix this for everyone, you can submit the file to Microsoft's false-positive review:

1. Go to https://www.microsoft.com/en-us/wdsi/filesubmission
2. Select **"I want to submit... a file for malware analysis"**
3. Upload `3DPrintForge-Setup-1.1.18.exe`
4. Select **"Software developer"** as the role
5. In the comment, write: `This is 3DPrintForge, a self-hosted 3D printer dashboard. Open source on GitHub: https://github.com/skynett81/3dprintforge`

After enough submissions, Microsoft will whitelist it.

---

## 🚀 After install

Once running, 3DPrintForge:

- Starts **server** automatically as a child process on first launch
- Loads the dashboard at `https://localhost:3443`
- Adds a **system tray icon** showing printer count
- Uses **auto-signed SSL certs** (self-signed for localhost only, NOT the same as code signing)
- Checks for updates automatically via the built-in updater

Configure your printers via the setup wizard on first launch.

---

## Alternative installation methods

- **Portable:** `3DPrintForge-Portable-1.1.18.exe` — no install needed, runs standalone
- **ZIP extraction:** Unpack the `win-unpacked` folder from the Linux builds (not distributed)
- **Docker:** `docker pull skynett81/3dprintforge` (see main README)

---

For support, open an issue at https://github.com/skynett81/3dprintforge/issues
