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
