# Desktop Release Guide

This guide covers the current desktop release process for DATTools, including
signing expectations, the explicit auto-update decision, and the QA checklist
to run before publishing a release.

## Release trigger

- Pushing to `main` now runs the auto-release workflow.
- That workflow computes the next version, creates a `v*` tag, and then calls
  the desktop build workflow with that tag.
- The desktop build workflow creates or updates a published GitHub Release.
- Current targets:
  - Windows: NSIS installer with offline WebView2 runtime
  - macOS: DMG for Intel and Apple Silicon
  - Linux: AppImage

Versioning behavior:

- If there are no prior `v*` tags, the first automated release uses the current
  `package.json` version.
- After that, every push to `main` releases by default.
- `feat:` commits bump `minor`.
- `!:` or `BREAKING CHANGE:` bumps `major`.
- Any other commit still releases and bumps `patch`.

Implementation detail:

- The auto-release workflow does not push version-bump commits to `main`.
- When it needs a new version, it creates a synthetic tagged release commit in
  CI so your local branch does not have to constantly pull automation commits.

## macOS signing and notarization

Unsigned macOS builds are the default.

The release workflow only enables the secret-based macOS signing flow when the
repository Actions variable `MACOS_SIGNING_ENABLED` is set to `true`.

If that variable is unset or set to any other value:

- macOS artifacts are still built
- macOS artifacts are unsigned and unnotarized
- Apple certificate secrets are ignored

If you later want signed/notarized macOS builds, set:

- `MACOS_SIGNING_ENABLED=true`

Secrets expected by the workflow:

- `APPLE_CERTIFICATE`: base64-encoded `.p12` certificate export
- `APPLE_CERTIFICATE_PASSWORD`: password for the exported `.p12`
- `APPLE_ID`: Apple account email
- `APPLE_PASSWORD`: app-specific Apple password
- `APPLE_TEAM_ID`: Apple developer team ID
- `KEYCHAIN_PASSWORD`: temporary CI keychain password
- `APPLE_SIGNING_IDENTITY`: optional explicit signing identity override

Certificate preparation:

- Export the Apple signing certificate as a `.p12`.
- Encode that file for the `APPLE_CERTIFICATE` secret with:
  `openssl base64 -A -in certificate.p12 -out certificate-base64.txt`
- Store the `.p12` export password in `APPLE_CERTIFICATE_PASSWORD`.

Behavior:

- If `MACOS_SIGNING_ENABLED=true` and the certificate secrets are present on
  macOS runners, the workflow imports the certificate into a temporary keychain
  and signs the bundle.
- If notarization credentials are also present, Tauri can notarize the macOS
  build during packaging.
- Otherwise, the build still runs, but the output remains unsigned or
  unnotarized and will show stronger trust warnings.

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

Before enabling automated releases in repo settings:

- [ ] `Actions -> General -> Workflow permissions = Read and write permissions`
- [ ] Branch/ruleset settings allow GitHub Actions to push release tags

Per-push gate checks:

- [ ] `npm run fmt:check`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build:web`
- [ ] `GITHUB_REPOSITORY=joshua-bone/DATTools npm run build:web:pages`

Only when desktop icon source art changes:

- [ ] `npm run generate:desktop-icon`

After the auto-release workflow runs:

- [ ] Workflow creates or reuses the expected `v*` tag
- [ ] GitHub Actions starts all four desktop jobs
- [ ] Published GitHub Release contains Windows, macOS Intel, macOS Apple Silicon,
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
- [ ] Record any platform-specific issues or unsigned-build caveats
