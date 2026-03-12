# DATTools

Toolkit for Chip's Challenge DAT levelsets (multiple 32x32 levels per file).

This repo is scaffolded to match c2mTools:

- TypeScript CLI
- Web app (level sidebar + JSON/Image views + transforms)
- Prettier/Typecheck/Tests enforced on commit
- GitHub Pages deploy

CLI includes a `merge-voting-packs` command for combining a directory of
`*.dat` voting packs plus matching `Solutions/*-Lynx.tws` / `*-MS.tws` files
into one merged DAT and two merged TWS files.
