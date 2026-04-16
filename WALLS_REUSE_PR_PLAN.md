# Walls Reuse PR Plan

## Decision

Yes, `c2mTools` can piggyback on this repo, but not on the current module boundaries.

The default recommendation is:

1. Keep the shared source code in `DATTools`.
2. Turn `DATTools` into both:
   - the DAT app
   - a library package with stable exports for walls generation and walls browsing
3. Have `c2mTools` depend on `DATTools` as a package.

Short-term dependency options:

- Local development: `file:../DATTools`
- Cross-repo pinned dependency: git URL pinned to a tag or commit

Long-term option:

- Publish the shared surface from this repo under the existing `dattools` package name with explicit subpath exports

I do **not** recommend a full runtime plugin system yet. I **do** recommend an architecture pass that introduces:

- a format-agnostic walls core
- a host adapter interface
- an algorithm registry instead of central switchboards

That is enough to get Open/Closed behavior without overbuilding.

## Why The Current Shape Is Not Reusable Enough

Today the walls feature is split across DAT-specific and app-specific code:

- wall mask key encode/decode is mixed into `src/dat/wallsBank.ts`
- DAT import behavior lives in `applyWallMaskToLevel`
- `GenerateBrowserDialog` and `WallsBrowserDialog` import DAT wall helpers directly
- generated layouts are represented as 32x32 wall keys even when the logical concept is “a generated grid”
- starred generated items are persisted as 128-bit wall keys only

That works for DAT because DAT is always `32x32`.

It does **not** scale cleanly to C2M because:

- C2M maps can be `10x10` through `100x100`
- DAT import wants framed placement into a `32x32` board
- C2M import wants exact-size generation, plus crop/pad rules when importing fixed `32x32` bank items
- generated C2M layouts larger than `32x32` cannot be represented as a 128-bit wall key

## Core Design

### Shared Concepts

- `WallMask32`
  - canonical `32x32` / `128-byte` bank key format
  - used by the existing bank and by DAT import
- `WallGrid`
  - arbitrary-size wall/floor grid
  - used by generation internally
  - required for C2M exact-size generation
- `BankLayoutRecord`
  - existing bank item, still centered on `WallMask32`
- `GeneratedLayoutRecord`
  - should carry a `WallGrid`, not just a `wallKey`
- `GeneratedLayoutRecipe`
  - algorithm id + parameter values + width + height + invert
  - used for “More like this” and future persistence

### Host Adapter Interface

The shared package should not know about `DatLevelJson` or `C2mJsonV1`.

It should expose host hooks roughly like this:

```ts
type WallGrid = Readonly<{
  width: number;
  height: number;
  cells: Uint8Array;
}>;

type WallMask32 = Readonly<{
  bytes: Uint8Array;
  key: string;
}>;

type ImportPolicy = "exact" | "frame-into-32" | "center-crop-pad";

interface WallsHostAdapter<TDocument> {
  applyGeneratedGrid(doc: TDocument, grid: WallGrid): TDocument;
  applyBankMask32(doc: TDocument, mask: WallMask32): TDocument;
}
```

The actual interface details can vary, but the important rule is:

- shared walls code produces `WallGrid` and `WallMask32`
- each host decides how that becomes a level/map mutation

### Size Rules

#### DATTools

- generation runs on the requested logical `width x height`
- result is then framed into a `32x32` DAT map
- the framing policy remains:
  - one-tile wall border around the generated content
  - centered within the `32x32` board
  - remaining cells are floor
- bank browse remains native `32x32`

#### c2mTools

- generation runs on the requested logical `width x height`
- result is applied at exactly that size
- supported size range should be `10..100`
- no forced `32x32` framing for generated content

For bank browse in C2M, the bank stays `32x32`, so import needs an explicit policy.

Default recommendation:

- bank import targets the current C2M map size
- if the current map is smaller than `32x32`, center-crop the bank layout to fit
- if the current map is larger than `32x32`, center the bank layout and leave the uncovered area as floor

That keeps bank items usable in arbitrary map sizes without inventing fake extra walls.

## Packaging Recommendation

### Default

Keep the shared code in this repo and export it from the root package via subpath exports.

Target shape:

- `dattools/walls-core`
- `dattools/walls-react`
- `dattools/walls-dat`

Pros:

- satisfies “code lives here”
- `c2mTools` can depend on this repo directly
- simplest cross-repo ownership model

Cons:

- `c2mTools` will install the `dattools` package, not a tiny dedicated package
- the root package needs a cleaner library build than it has today

### Alternative

Create `packages/walls-kit` inside this repo and publish it separately.

Pros:

- cleaner package boundary
- less dependency bleed into consumers

Cons:

- more release and packaging work
- git-based subdirectory consumption is less convenient than consuming the repo root package

## Architecture Targets

### 1. Extract A Format-Agnostic Walls Core

Create a new shared area, for example:

- `src/walls-core/mask32.ts`
- `src/walls-core/grid.ts`
- `src/walls-core/bank.ts`
- `src/walls-core/generate/*`
- `src/walls-core/storage.ts`

Rules:

- no imports from `src/dat/*`
- no imports from `c2mTools`
- no direct React usage

### 2. Split React UI From Host Wiring

Create reusable dialog components that only accept data and callbacks:

- `src/walls-react/GenerateWallsDialog.tsx`
- `src/walls-react/BrowseWallsDialog.tsx`

These should not know:

- how a DAT level is updated
- how a C2M document is updated
- where local storage keys come from
- where the bank JSON URL comes from

They should only know:

- records to display
- selected/starred/hidden state
- callbacks for import/randomize/star/hide

### 3. Replace The Central Algorithm Switchboard

Today algorithms are effectively hard-coded in:

- a giant option list
- a giant builder switch
- a giant UI state/update matrix

Replace that with a registry model:

```ts
type AlgorithmDefinition<TControls, TParams> = {
  id: string;
  label: string;
  createDefaultControls(): TControls;
  randomizeControls(controls: TControls, rng: RNG): TParams;
  generate(params: TParams, size: { width: number; height: number }): WallGrid;
  summarize(params: TParams): string;
};
```

The UI can still render custom parameter panels, but the algorithm list and generation dispatch should come from registered definitions, not giant central switches.

### 4. Change Generated Star Persistence

Current generated stars only persist a `wallKey`.

That is insufficient once C2M can generate bigger-than-`32x32` layouts.

New persisted model should store either:

- full rendered grid bytes
- or full recipe + size + invert

Default recommendation:

- persist recipe + size + invert + resolved preview hash

That keeps storage smaller and preserves “More like this”.

Bank browse starred/hidden can remain key-based because bank entries are still fixed `32x32`.

## PR-by-PR Execution Plan

### PR 1: Extract `WallMask32` And Bank Core

Goal:

- move wall-key encode/decode and bank parsing/filtering into `src/walls-core`

Changes:

- extract `wallMaskKeyFromBytes` / `wallMaskBytesFromKey`
- extract bank schema/types/parser
- extract bank filtering, searching, random sampling
- leave DAT-specific `buildWallMaskBytes` and `applyWallMaskToLevel` in DAT-only modules

Acceptance criteria:

- no shared module imports `src/dat/*`
- `WallsBrowserDialog` and `generatedLayouts` stop importing DAT helpers directly
- existing DAT behavior is unchanged

### PR 2: Introduce `WallGrid` And Exact-Size Generation

Goal:

- make generation produce arbitrary-size grids first, then let each host transform them

Changes:

- add `WallGrid`
- make generators return `WallGrid`
- remove implicit dependence on fixed `32x32`
- remove ambient size globals in generation code

Acceptance criteria:

- generator output size is explicit
- DAT framing happens after generation, not inside core generators
- C2M can later request `10..100`

### PR 3: Add Algorithm Registry

Goal:

- stop requiring central switch edits for every algorithm

Changes:

- define algorithm registry
- move algorithm metadata/defaults/generation behind definitions
- keep existing UI behavior but drive the option list and dispatch from the registry

Acceptance criteria:

- the algorithm picker is registry-driven
- generation dispatch is registry-driven
- adding an algorithm requires adding a definition, not editing multiple switchboards

### PR 4: Separate Reusable React Dialogs From DAT App Wiring

Goal:

- make the dialogs reusable in another app shell

Changes:

- split DATTools app integration from dialog presentation
- move storage keys and bank URL out of dialog components
- introduce callback-based host contracts for import/star/hide/randomize

Acceptance criteria:

- dialogs can be rendered in DATTools without importing DAT level types
- dialogs are reusable by another React app shell

### PR 5: Add DAT Host Adapter

Goal:

- re-integrate DATTools through an explicit adapter

Changes:

- add DAT adapter that:
  - applies a `WallMask32` to a DAT level
  - frames a generated `WallGrid` into `32x32`
- rewire `web/src/App.tsx` to use the adapter instead of direct walls logic

Acceptance criteria:

- DAT app behavior remains unchanged
- import still works through undo history

### PR 6: Publish A Stable Library Surface From `DATTools`

Goal:

- make `c2mTools` able to depend on this repo cleanly

Changes:

- add library entry points to the build
- add `package.json` `exports`
- document supported import paths

Acceptance criteria:

- `c2mTools` can import shared walls modules from `dattools/...`
- local `file:../DATTools` consumption works
- git/tag-based consumption works

### PR 7: Add c2mTools Host Adapter And First Integration

Goal:

- consume the shared walls package from `c2mTools`

Changes:

- add `dattools` dependency in `c2mTools`
- add C2M host adapter
- wire `Generate Walls` and `Browse Walls` into the `c2mTools` UI
- implement C2M size rules:
  - exact-size generation for `10..100`
  - bank import using center-crop/pad behavior

Acceptance criteria:

- C2M generate works above `32x32`
- C2M import is undo-safe
- DAT and C2M both use the same shared generator/browse code

### PR 8: Move Generated Star Persistence To Recipes/Artifacts

Goal:

- make starring work for larger C2M layouts

Changes:

- replace key-only generated star storage
- persist recipe + size + invert + enough metadata to rebuild the layout
- add migration for existing DAT starred layouts if worth keeping

Acceptance criteria:

- DAT starred generated layouts still work
- C2M starred larger layouts work
- “More like this” works for persisted generated items

## Risks

- The current Generate dialog is very large; splitting it cleanly will take discipline.
- The biggest hidden coupling is not React, it is the assumption that generated items are always representable as `128` bytes.
- C2M cell layering means import policy must be explicit:
  - terrain only
  - or terrain plus clearing item/mob/thin-wall layers

## Open Questions

These should be answered before the C2M integration PR:

1. When importing into C2M, should we replace terrain only, or clear all non-terrain layers too?
2. For bank import into larger C2M maps, is “center with floor padding” the desired behavior?
3. Should generated stars persist recipes, full rendered grids, or both?

## Immediate Next Step

Start with PR 1:

- extract `WallMask32` and bank parsing/filtering into a new format-agnostic module
- remove direct `src/dat/wallsBank` imports from the React dialogs and generator core
