# Code Signing Setup for 3DPrintForge

## Why we need code signing

Without a valid code signing certificate:

1. **Windows Defender SmartScreen** blocks the installer on first launch
2. **Microsoft Defender Antivirus** may flag it as suspicious
3. **UAC prompt** shows "Unknown Publisher" in red

With a valid certificate, all three issues disappear.

---

## Option A: SignPath.io (FREE for open source) ⭐ Recommended

SignPath provides free **EV-level code signing** for open-source projects. This completely removes SmartScreen warnings on first install.

### Setup (one-time, ~1-2 weeks for approval)

1. Go to https://signpath.io/ and click **"Sign up for Free"**
2. Choose **"Open Source"** plan
3. Add **3DPrintForge** as a project:
   - Repository: `skynett81/3dprintforge`
   - Homepage: `https://github.com/skynett81/3dprintforge`
   - License: AGPL-3.0
4. Wait for SignPath team to approve (usually 2-5 business days)
5. Once approved, go to **Settings → API Tokens** and create a token
6. Create a **signing policy** for "Release Signing"

### GitHub Actions integration

Add the following **repository secrets** at GitHub → Settings → Secrets and variables → Actions:

- `SIGNPATH_API_TOKEN` — Your API token from SignPath
- `SIGNPATH_ORG_ID` — Your organization ID (UUID)
- `SIGNPATH_PROJECT_SLUG` — `3dprintforge` (or whatever slug you chose)
- `SIGNPATH_SIGNING_POLICY_SLUG` — `release-signing`

And set the repository variable:
- `SIGNPATH_ENABLED` = `true`

The existing `.github/workflows/release-build.yml` is already configured to use SignPath when these secrets are present. It will:

1. Build Windows installers on GitHub Actions
2. Upload them to SignPath for signing
3. Wait for signing to complete (typically 30-60 seconds)
4. Download signed installers
5. Attach them to the GitHub release

Once set up, every `git tag v1.1.19 && git push --tags` will produce **signed** Windows installers that Windows trusts immediately — **no SmartScreen warning**.

---

## Option B: Commercial Certificate

If you want instant trust without waiting for SignPath approval:

| Provider | Type | Cost | Notes |
|----------|------|------|-------|
| [Certum](https://shop.certum.eu/data-safety/code-signing-certificates/open-source-code-signing-certyficate.html) | Open-source OV | ~€30/year | Cheapest, for open source |
| [SSL.com](https://www.ssl.com/certificates/ev-code-signing/) | EV (instant trust) | ~$300/year | Fastest approval |
| [DigiCert](https://www.digicert.com/signing/code-signing-certificates) | EV | ~$500/year | Most trusted |
| [Sectigo](https://sectigostore.com/code-signing-ssl) | OV or EV | $100–450/year | Good balance |

After buying a certificate:

1. Store it as a `.pfx` file
2. Add GitHub secrets:
   - `WIN_CSC_LINK` — base64-encoded PFX file
   - `WIN_CSC_KEY_PASSWORD` — PFX password
3. electron-builder will automatically pick them up

---

## Option C: Microsoft Store submission (alternative)

Instead of code signing, submit to Microsoft Store as a Win32 app or MSIX:

1. Register at https://partner.microsoft.com/en-us/dashboard/home (~$19 one-time fee for individual)
2. Package the app as MSIX using electron-builder: `npx electron-builder --win msix`
3. Submit via Partner Center
4. Review takes 1-7 days
5. After approval, users install via Store — automatically trusted

---

## Interim Solution: Checksums + Documentation

While waiting for SignPath approval, we provide:

1. **SHA-256 checksums** for all release artifacts (uploaded as `SHA256SUMS.txt`)
2. **Clear instructions** for users to bypass SmartScreen (see `docs/WINDOWS_INSTALL.md`)
3. **Embedded metadata** in the .exe showing publisher name (visible in file Properties)
4. **Version info resources** so the installer looks professional even without signing

Users can manually verify file integrity via:

```powershell
Get-FileHash .\3DPrintForge-Setup-1.1.18.exe -Algorithm SHA256
```

---

## Status

- [x] Uploaded SHA256SUMS.txt to GitHub releases
- [x] Embedded publisher name "GeekTech — SkyNett81" in .exe metadata
- [x] Added file associations for .3mf, .stl, .gcode
- [x] Created CI workflow ready for SignPath integration
- [x] Documented SmartScreen workaround in `docs/WINDOWS_INSTALL.md`
- [ ] Apply for SignPath.io free tier (TODO for maintainer)
- [ ] Add SignPath secrets to GitHub repository
- [ ] Set `SIGNPATH_ENABLED=true` repository variable
