# Algorithms Plan

This file defines the layout generators we should add behind `File > Generate`.

Source material:

- `john-science/mazelib` repository: https://github.com/john-science/mazelib
- Generator docs: https://github.com/john-science/mazelib/blob/main/docs/MAZE_GEN_ALGOS.md
- Generator source folder: https://github.com/john-science/mazelib/tree/main/mazelib/generate

## Scope

The Generate modal should eventually expose:

- `Any` as the default selector value
- one explicit choice per implemented generator
- per-card randomized parameters for the selected generator
- deterministic rerolls from a single seed
- starring by generated wall-mask key
- `Starred only`, which shows saved layouts and disables fresh generation

Currently implemented in the modal:

- `Random Noise` (local placeholder, not from mazelib)
- `Perlin Noise`
- `Value Noise / Fractal Noise`
- `Worley / Cellular Noise`
- `Thresholded Gradient Noise`
- `Domain-Warped Noise`
- `Radial Symmetry`
- `Kaleidoscope`
- `L-System / Turtle Patterns`
- `Rose Curves / Polar Patterns`
- `Tileable Motif Repeater`
- `BSP Room Partitioner`
- `Corridor Grid`
- `Room Scatter`
- `Courtyard Generator`
- `Blueprint Generator`
- `Stripe / Plaid Generator`
- `Checker / Diamond / Lattice`
- `Concentric Boxes`
- `Line Interference`
- `Circle Packing`
- `Game of Life Variants`
- `Diffusion-Limited Aggregation`
- `Reaction-Diffusion Approximation`
- `Voronoi Region Carver`
- `Erosion / Dilation Pipeline`
- `Backtracking Generator`
- `Growing Tree`
- `Prim's`
- `Recursive Division`
- `Kruskal's`
- `Sidewinder`
- `Binary Tree`
- `Hunt-and-Kill`
- `Wilson's`
- `Aldous-Broder`
- `Eller's`
- `Cellular Automaton`
- `Dungeon Rooms`
- `Trivial Maze`

## Generators To Implement

These are the upstream generation algorithms from `mazelib` that fit this modal.

| Priority | Algorithm              | Upstream params to expose             | Notes                                                                                                              |
| -------- | ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Done     | Backtracking Generator | start seed only                       | Implemented with seed, block size, and explicit start cell controls.                                               |
| Done     | Growing Tree           | `backtrack_chance`                    | Implemented with seed, block size, explicit start cell controls, and backtrack chance.                             |
| Done     | Prim's                 | start seed only                       | Implemented with seed, block size, and explicit start cell controls.                                               |
| Done     | Recursive Division     | bias mode / cut strategy              | Implemented with seed and block size. Bias/cut-strategy controls can still be added later if we want more variety. |
| Done     | Kruskal's              | start seed only                       | Implemented with seed and block size.                                                                              |
| Done     | Sidewinder             | `skew`                                | Implemented with seed, block size, and skew.                                                                       |
| Done     | Binary Tree            | `skew` (`NW`, `NE`, `SE`, `SW`)       | Implemented with seed, block size, and directional skew.                                                           |
| Done     | Hunt-and-Kill          | `hunt_order` (`random`, `serpentine`) | Implemented with seed, block size, and hunt order.                                                                 |
| Done     | Wilson's               | `hunt_order` (`random`, `serpentine`) | Implemented with seed, block size, and hunt order.                                                                 |
| Done     | Aldous-Broder          | start seed only                       | Implemented with seed and block size.                                                                              |
| Done     | Eller's                | `xskew`, `yskew`                      | Implemented with seed, block size, horizontal-merge skew, and vertical-carry skew.                                 |
| Done     | Cellular Automaton     | `complexity`, `density`               | Implemented with seed, block size, complexity, and density.                                                        |
| Done     | Dungeon Rooms          | `rooms`, `grid`, `hunt_order`         | Implemented with seed, block size, hunt order, randomized room count, and randomized room size.                    |
| Done     | Trivial Maze           | `maze_type` (`spiral`, `serpentine`)  | Implemented with seed, block size, and maze type.                                                                  |

## Recommended Implementation Order

1. Keep `Random Noise` as the fast fallback and test harness.
2. Add transmuters or generator-specific refinements only if we want more parameter depth later.

## Non-Maze Generator Ideas

These are good follow-up generators that are not primarily maze algorithms, but would still produce useful wall layouts for the bank.

### Noise And Terrain

- Done: `Perlin Noise`, with scale, octaves, threshold, invert, and block-size controls.
- Done: `Value Noise / Fractal Noise`, with scale, octaves, gain, threshold, invert, and block-size controls.
- Done: `Worley / Cellular Noise`, with cell-count, jitter, threshold, invert, and block-size controls.
- Done: `Thresholded Gradient Noise`, with band scale, angle, roughness, threshold, invert, and block-size controls.
- Done: `Domain-Warped Noise`, with scale, octaves, warp scale, warp strength, threshold, invert, and block-size controls.

### Symmetry And Ornament

- Done: `Radial Symmetry`, with fold, ring, twist, band-width, invert, and block-size controls.
- Done: `Kaleidoscope`, with segment, scale, threshold, invert, and block-size controls.
- Done: `L-System / Turtle Patterns`, with preset, iteration, turn-angle, stroke-width, invert, and block-size controls.
- Done: `Rose Curves / Polar Patterns`, with petal, harmonic, rotation, stroke-width, invert, and block-size controls.
- Done: `Tileable Motif Repeater`, with motif, spacing, size, jitter, rotation, invert, and block-size controls.

### Rooms And Architecture

- Done: `BSP Room Partitioner`, with split-depth, room-padding, corridor-width, invert, and block-size controls.
- Done: `Corridor Grid`, with column-spacing, row-spacing, wall-thickness, door-chance, invert, and block-size controls.
- Done: `Room Scatter`, with room-count, room-size, gap, connector-chance, invert, and block-size controls.
- Done: `Courtyard Generator`, with ring-count, ring-gap, gate-width, gate-offset, invert, and block-size controls.
- Done: `Blueprint Generator`, with wing-count, hall-width, pillar-spacing, chamber-depth, invert, and block-size controls.

### Cellular And Growth Systems

- Done: `Game of Life Variants`, with density, steps, variant, invert, and block-size controls.
- Done: `Diffusion-Limited Aggregation`, with walkers, stickiness, seed-mode, invert, and block-size controls.
- Done: `Reaction-Diffusion Approximation`, with spot-count, iterations, feed, kill, invert, and block-size controls.
- Done: `Voronoi Region Carver`, with site-count, ridge-width, jitter, invert, and block-size controls.
- Done: `Erosion / Dilation Pipeline`, with density, grow-steps, shrink-steps, puncture-chance, invert, and block-size controls.

### Patterned And Geometric

- Done: `Stripe / Plaid Generator`, with mode, spacing, band-width, offset, invert, and block-size controls.
- Done: `Checker / Diamond / Lattice`, with style, cell-size, line-width, phase, invert, and block-size controls.
- Done: `Concentric Boxes`, with ring-count, spacing, line-width, drift, invert, and block-size controls.
- Done: `Line Interference`, with angle-a, angle-b, spacing, stroke-width, invert, and block-size controls.
- Done: `Circle Packing`, with circle-count, min-radius, max-radius, outline, invert, and block-size controls.

### Chaotic And Procedural Art

- `Drunk Walk Painter`: multiple walkers leaving trails, rooms, and scribble-like structures.
- `Particle Flow Field`: agents follow a vector field and carve streamlines.
- `Stamp Brush Generator`: repeatedly place primitive stamps like squares, circles, crosses, and bars.
- `Cutout Collage`: boolean add/subtract of random primitives for bold poster-like layouts.
- `Glitch Blocks`: broken scanlines, offsets, striping, and corrupted-grid aesthetics.

### Good Early Picks

- `Stamp Brush Generator`: cheap to implement and can cover a lot of visual ground fast.

## Modal Mapping Rules

Each implemented generator should map into the UI the same way:

- one stable algorithm id
- one randomized parameter bundle per card
- one generated 32x32 wall/floor layout
- one wall-mask key derived from the layout

Recommended per-card metadata:

- algorithm label
- 1 to 3 compact parameter chips or a short summary line
- optional seed label for reproducibility/debugging

## Separate Later Work

`mazelib` also contains transmuters and solvers, but they should not be mixed into `File > Generate` yet.

Potential future non-generator work from upstream:

- Transmuters: `CuldeSacFiller`, `DeadEndFiller`, `Perturbation`
- Solvers: `BacktrackingSolver`, `Chain`, `Collision`, `RandomMouse`, `ShortestPath`, `ShortestPaths`, `Tremaux`
