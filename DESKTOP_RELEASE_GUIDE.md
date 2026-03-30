# Desktop Release Guide

This guide covers the current desktop release process for DATTools, including
signing expectations, the explicit auto-update decision, and the QA checklist
to run before publishing a release.

## Release trigger

- Desktop artifacts are built by GitHub Actions when a `v*` tag is pushed.
- The workflow creates or updates a draft GitHub Release.
- Current targets:
  - Windows: NSIS installer with offline WebView2 runtime
  - macOS: DMG for Intel and Apple Silicon
  - Linux: AppImage

## macOS signing and notarization

The release workflow now supports the secret-based macOS signing flow that
Tauri documents for GitHub Actions.

Secrets expected by the workflow:

- `APPLE_CERTIFICATE`: base64-encoded `.p12` certificate export
- `APPLE_CERTIFICATE_PASSWORD`: password for the exported `.p12`
- `APPLE_ID`: Apple account email
- `APPLE_PASSWORD`: app-specific Apple password
- `APPLE_TEAM_ID`: Apple developer team ID
- `KEYCHAIN_PASSWORD`: temporary CI keychain password
- `APPLE_SIGNING_IDENTITY`: optional explicit signing identity override

Behavior:

- If the certificate secrets are present on macOS runners, the workflow imports
  the certificate into a temporary keychain and signs the bundle.
- If notarization credentials are also present, Tauri can notarize the macOS
  build during packaging.
- If the secrets are absent, the build still runs, but the output remains
  unsigned or unnotarized and will show stronger trust warnings.

## Windows signing status

Windows signing is not enabled in repo config yet because no certificate or
provider-specific settings are available in this repository.

Chosen default when signing is added:

- Prefer a provider-managed custom `signCommand` flow, such as Azure Trusted
  Signing, instead of storing a long-lived `.pfx` in GitHub secrets.

Alternative:

- A legacy OV certificate import on the Windows runner is still possible, but
  it is a weaker default because it requires handling certificate material in
  CI and still may not eliminate SmartScreen warnings immediately.

## Auto-update decision

Auto-update is deferred for now.

Reasoning:

- Tauri’s updater adds a plugin, updater permissions, signing keys, and a
  release feed contract.
- The current desktop distribution path is still maturing and should stabilize
  around signed installers first.
- For this editor, direct installer downloads are a reasonable v1 release path.

Revisit auto-update after:

- signed desktop releases are working end-to-end
- at least one tagged desktop release has shipped successfully
- the release artifact naming and publication flow are stable

## Release QA checklist

Pre-tag:

- [ ] `src-tauri/tauri.conf.json` version matches the intended release tag
- [ ] `npm run fmt:check`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build:web`
- [ ] `GITHUB_REPOSITORY=joshua-bone/DATTools npm run build:web:pages`
- [ ] `npm run generate:desktop-icon`

After pushing the tag:

- [ ] GitHub Actions starts all four desktop jobs
- [ ] Draft GitHub Release contains Windows, macOS Intel, macOS Apple Silicon,
      and Linux artifacts
- [ ] Release notes mention whether builds are signed and notarized

Windows smoke test:

- [ ] Installer launches and completes cleanly
- [ ] App icon and publisher metadata look correct in the installer
- [ ] SmartScreen/signature behavior matches the expected signing state
- [ ] App opens a `.dat` file
- [ ] App opens a `.json` levelset
- [ ] App saves a `.dat` file to a chosen path
- [ ] App reopens and works offline after install

macOS smoke test:

- [ ] DMG opens correctly
- [ ] App icon renders correctly in Finder and Launchpad
- [ ] Gatekeeper/notarization behavior matches the expected signing state
- [ ] App opens a `.dat` file
- [ ] App opens a `.json` levelset
- [ ] App saves a `.dat` file to a chosen path
- [ ] App reopens and works offline after install

Linux smoke test:

- [ ] AppImage is executable and launches
- [ ] App icon renders correctly in the desktop shell
- [ ] App opens a `.dat` file
- [ ] App opens a `.json` levelset
- [ ] App saves a `.dat` file to a chosen path
- [ ] App reopens and works offline after install

Release finalization:

- [ ] Finalize release notes
- [ ] Publish the GitHub Release
- [ ] Record any platform-specific issues or unsigned-build caveats
