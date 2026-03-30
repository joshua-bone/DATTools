# Tauri Desktop Rollout Plan

This plan tracks the work to ship a downloadable cross-platform desktop version
of the DATTools editor that works offline.

## Approach

- [x] Choose desktop wrapper: Tauri
- [x] Keep the existing web editor as the source of truth
- [x] Plan for multiple PRs instead of one large PR
- [ ] Ship downloadable installers for Windows, macOS, and Linux

## Success Criteria

- [ ] Desktop app launches fully offline
- [ ] `.dat` and `.json` files can be opened from the desktop app
- [ ] Edited files can be saved back to disk without browser download flows
- [ ] Existing GitHub Pages web build still works
- [ ] GitHub Releases publish platform-specific desktop artifacts

## PR 1: Desktop-Ready Web Layer

Goal: remove browser-only assumptions from the editor so the frontend can run
inside either GitHub Pages or a Tauri shell.

- [x] Add a small platform abstraction layer for:
  - open file
  - save DAT
  - save JSON
  - open external links
- [x] Move current browser implementations behind that abstraction
- [x] Split Vite config or build-time env handling so:
  - GitHub Pages keeps repo-base asset paths
  - desktop build uses local-friendly asset paths
- [x] Ensure sprite and expansion artwork loading works in both targets
- [x] Keep current browser file input and download fallback behavior intact
- [x] Add tests around the new platform abstraction where practical

Acceptance criteria:

- [x] `npm run build:web` still produces a working web build
- [x] No desktop-shell-specific logic leaks into core editor code paths
- [x] Web editor behavior is unchanged for existing users

## PR 2: Tauri Shell Integration

Goal: add the actual desktop wrapper and native file dialogs.

- [x] Add Tauri project scaffolding under `src-tauri/`
- [x] Add npm scripts for desktop development and packaging
- [x] Load the existing Vite frontend inside Tauri
- [x] Replace browser-only open/save flows with Tauri dialog/fs integration when
      running in desktop mode
- [x] Route external test links through the OS browser
- [ ] Confirm the app works with network disconnected after installation
- [x] Add desktop-specific documentation for local setup

Acceptance criteria:

- [ ] `tauri dev` launches the editor locally
- [ ] Desktop app opens `.dat` and `.json`
- [ ] Desktop app saves `.dat` reliably to user-selected paths
- [ ] Desktop app works offline after install

## PR 3: Distribution and Release Automation

Goal: produce downloadable artifacts for all supported desktop platforms.

- [x] Add GitHub Actions workflow for desktop builds
- [x] Build release artifacts on:
  - Windows
  - macOS
  - Linux
- [x] Configure Tauri bundling targets:
  - Windows: installer
  - macOS: DMG
  - Linux: AppImage
- [x] Configure Windows packaging for offline-capable WebView runtime handling
- [x] Upload artifacts to GitHub Releases
- [x] Document end-user download/install steps

Acceptance criteria:

- [ ] Tagged release produces downloadable desktop artifacts
- [ ] Artifacts launch on each target OS family
- [ ] Downloaded app works without requiring the GitHub Pages site

## PR 4: Polish and Trust Chain

Goal: improve distribution quality after the first downloadable release works.

- [x] Add app icons and polished bundle metadata
- [x] Add macOS signing/notarization
- [ ] Add Windows signing if certificates are available
- [x] Decide whether to add auto-update
- [x] Add release QA checklist

Acceptance criteria:

- [ ] Install flow is smooth on all supported platforms
- [ ] OS trust warnings are reduced as much as practical
- [ ] Release process is documented and repeatable

## PR 5: Zero-Touch Tagged Releases

Goal: remove the manual version/tag step while preserving tagged desktop
artifacts and keeping `main` free of automation-only release commits.

- [x] Make Tauri read its version from `package.json`
- [x] Add CI logic to infer the next release version from git history
- [x] Default every push to `main` to a release-safe `patch` bump
- [x] Allow optional `feat:` and breaking-change signals to produce `minor` and
      `major` versions
- [x] Create or reuse a `v*` tag automatically from CI
- [x] Reuse the existing desktop build workflow from the auto-release pipeline
- [x] Document the repo settings required for tag-push permissions

Acceptance criteria:

- [ ] Pushing to `main` creates or reuses a release tag without manual steps
- [ ] Desktop artifacts build from that computed tag
- [ ] Normal development on `main` does not require pulling bot-written release
      commits

## Implementation Notes

- [x] Keep the desktop app and web app on the same frontend codebase
- [x] Prefer a thin desktop shell over moving editor logic into Rust
- [x] Keep offline runtime assets bundled with the app
- [x] Avoid taking a dependency on a local backend process
- [x] Do not block the first release on auto-update or code signing

Verification note:

- `tauri dev` and `tauri build` still need Rust plus the Tauri OS prerequisites
  installed locally. This repo can typecheck and produce the web build without
  them, but the desktop shell itself cannot be launched from this machine yet.
- The desktop build still depends on GitHub-hosted runners for real packaging,
  signing, and release publication, so the release workflows are only locally
  linted and dry-run-tested here.
- PR 4 wires optional macOS signing/notarization into the desktop workflow, but
  it still requires repository secrets and a GitHub Actions run to verify.

## Risks / Open Items

- [x] Decide exact Windows bundling mode for the WebView runtime
- [ ] Decide whether Linux should also ship a `.deb`
- [ ] Decide how much native “open recent” or OS integration is worth in v1
- [x] Decide whether to add auto-update
      Decision: defer auto-update until signed installers and one successful tagged
      desktop release exist.
- [ ] Pick and configure the final Windows signing provider when a certificate
      is available
- [ ] Verify external play-test integrations should remain browser-only in the
      desktop app
- [ ] Confirm the first end-to-end automated desktop release on GitHub Actions
