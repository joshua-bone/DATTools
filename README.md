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

## Desktop releases

GitHub Actions now builds desktop release artifacts when a version tag is
pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Release behavior:

- The workflow creates or updates a draft GitHub Release for that tag.
- Windows builds publish an NSIS installer with the offline WebView2 runtime
  bundled.
- macOS builds publish DMGs for both Intel and Apple Silicon targets.
- Linux builds publish an AppImage.

Current caveats:

- PR 4 still covers signing and notarization, so early public builds may show
  OS trust warnings.
- Keep the Tauri app version in `src-tauri/tauri.conf.json` aligned with the
  tag you push.

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
