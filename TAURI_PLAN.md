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

- [ ] Add a small platform abstraction layer for:
  - open file
  - save DAT
  - save JSON
  - open external links
- [ ] Move current browser implementations behind that abstraction
- [ ] Split Vite config or build-time env handling so:
  - GitHub Pages keeps repo-base asset paths
  - desktop build uses local-friendly asset paths
- [ ] Ensure sprite and expansion artwork loading works in both targets
- [ ] Keep current browser file input and download fallback behavior intact
- [ ] Add tests around the new platform abstraction where practical

Acceptance criteria:

- [ ] `npm run build:web` still produces a working web build
- [ ] No desktop-shell-specific logic leaks into core editor code paths
- [ ] Web editor behavior is unchanged for existing users

## PR 2: Tauri Shell Integration

Goal: add the actual desktop wrapper and native file dialogs.

- [ ] Add Tauri project scaffolding under `src-tauri/`
- [ ] Add npm scripts for desktop development and packaging
- [ ] Load the existing Vite frontend inside Tauri
- [ ] Replace browser-only open/save flows with Tauri dialog/fs integration when
      running in desktop mode
- [ ] Route external test links through the OS browser
- [ ] Confirm the app works with network disconnected after installation
- [ ] Add desktop-specific documentation for local setup

Acceptance criteria:

- [ ] `tauri dev` launches the editor locally
- [ ] Desktop app opens `.dat` and `.json`
- [ ] Desktop app saves `.dat` reliably to user-selected paths
- [ ] Desktop app works offline after install

## PR 3: Distribution and Release Automation

Goal: produce downloadable artifacts for all supported desktop platforms.

- [ ] Add GitHub Actions workflow for desktop builds
- [ ] Build release artifacts on:
  - Windows
  - macOS
  - Linux
- [ ] Configure Tauri bundling targets:
  - Windows: installer
  - macOS: DMG
  - Linux: AppImage
- [ ] Configure Windows packaging for offline-capable WebView runtime handling
- [ ] Upload artifacts to GitHub Releases
- [ ] Document end-user download/install steps

Acceptance criteria:

- [ ] Tagged release produces downloadable desktop artifacts
- [ ] Artifacts launch on each target OS family
- [ ] Downloaded app works without requiring the GitHub Pages site

## PR 4: Polish and Trust Chain

Goal: improve distribution quality after the first downloadable release works.

- [ ] Add app icons and polished bundle metadata
- [ ] Add macOS signing/notarization
- [ ] Add Windows signing if certificates are available
- [ ] Decide whether to add auto-update
- [ ] Add release QA checklist

Acceptance criteria:

- [ ] Install flow is smooth on all supported platforms
- [ ] OS trust warnings are reduced as much as practical
- [ ] Release process is documented and repeatable

## Implementation Notes

- [ ] Keep the desktop app and web app on the same frontend codebase
- [ ] Prefer a thin desktop shell over moving editor logic into Rust
- [ ] Keep offline runtime assets bundled with the app
- [ ] Avoid taking a dependency on a local backend process
- [ ] Do not block the first release on auto-update or code signing

## Risks / Open Items

- [ ] Decide exact Windows bundling mode for the WebView runtime
- [ ] Decide whether Linux should also ship a `.deb`
- [ ] Decide how much native “open recent” or OS integration is worth in v1
- [ ] Verify external play-test integrations should remain browser-only in the
      desktop app
