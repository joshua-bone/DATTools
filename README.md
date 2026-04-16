# DATTools

Toolkit for Chip's Challenge DAT levelsets (multiple 32x32 levels per file).

This repo contains:

- TypeScript CLI
- Web DAT editor with palette painting, metadata editing, transforms, selection/copy/paste, undo, and DAT/3D level support
- Prettier/Typecheck/Tests enforced on commit
- GitHub Pages deploy

## Web editor

Local development:

```bash
npm install
npm run dev:web
```

Production build:

```bash
npm run build:web
```

GitHub Pages build:

```bash
npm run build:web:pages
```

## Desktop app (Tauri)

Local setup:

```bash
npm install
npm run dev:desktop
```

Desktop package build:

```bash
npm run build:desktop
```

Notes:

- Tauri requires Rust `1.77.2+` plus OS-specific system prerequisites.
- The desktop app uses the same frontend build as the web editor and bundles the
  static sprite/art assets for offline use.
- Native desktop open/save flows come from Tauri dialogs and filesystem APIs
  instead of browser file inputs/downloads.
- Regenerate desktop icons with `npm run generate:desktop-icon` after changing
  the source icon art.

## Desktop releases

GitHub Actions now cuts desktop releases automatically on every push to `main`.
The release flow computes the next version, tags it, and builds the installers
without requiring a manual version bump or tag push.

Release behavior:

- A release tag is always created for the build.
- If you use Conventional Commit signals, `feat:` bumps `minor` and `!:` or
  `BREAKING CHANGE:` bumps `major`.
- Any other commit subject still releases and defaults to a `patch` bump.
- The workflow creates or updates a published GitHub Release for that tag.
- Windows builds publish an NSIS installer with the offline WebView2 runtime
  bundled.
- macOS builds publish DMGs for both Intel and Apple Silicon targets.
- Linux builds publish an AppImage.

Current caveats:

- Tauri now reads its app version from `package.json`, and the auto-release
  workflow synthesizes a tagged release commit when it needs to bump that
  version.
- macOS builds are unsigned by default. Signing and notarization only activate
  when the Actions variable `MACOS_SIGNING_ENABLED=true` and the Apple secrets
  are configured.
- Windows signing is still a certificate-provider-specific follow-up and is not
  enabled by default in the repo.
- The desktop app checks GitHub for a newer published release, but updates are
  still manual.
- Full auto-update is intentionally deferred until signed releases and the
  release flow have stabilized.

See `DESKTOP_RELEASE_GUIDE.md` for signing requirements, the auto-update
decision, and the release QA checklist.

## GitHub Pages

The editor is intended to be served from:

- `https://joshua-bone.github.io/DATTools/`

For this repo, GitHub Pages must use `GitHub Actions` as its source. If the
URL shows the repository README instead of the editor, check:

- `Settings -> Pages`
- `Build and deployment -> Source = GitHub Actions`

CLI includes a `merge-voting-packs` command for combining a directory of
`*.dat` voting packs plus matching `Solutions/*-Lynx.tws` / `*-MS.tws` files
into one merged DAT and two merged TWS files.

## Reusable walls library

This repo now also publishes a stable walls library surface for sibling tools.

Supported import paths:

- `dattools/walls-core`
- `dattools/walls-dat`
- `dattools/walls-react`

Local cross-repo development:

```json
{
  "dependencies": {
    "dattools": "file:../DATTools"
  }
}
```

Pinned git dependency:

```json
{
  "dependencies": {
    "dattools": "git+https://github.com/joshua-bone/DATTools.git#<tag-or-commit>"
  }
}
```

Example imports:

```ts
import { wallMask32FromKey } from "dattools/walls-core";
import { datWallsHostAdapter } from "dattools/walls-dat";
import { BrowseWallsDialog, GenerateWallsDialog } from "dattools/walls-react";
```

Build the package artifacts with:

```bash
npm run build
```
