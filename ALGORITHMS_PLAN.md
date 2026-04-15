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

- `Perlin Noise`: smooth organic blobs, cave walls, coastlines, and landmass-style layouts.
- `Value Noise / Fractal Noise`: layered soft noise with octave controls for roughness and scale.
- `Worley / Cellular Noise`: crackle, cells, ridges, islands, and clustered chamber patterns.
- `Thresholded Gradient Noise`: soft directional bands that can create cliff, dune, or cloud-like walls.
- `Domain-Warped Noise`: warped Perlin/value fields for more chaotic natural formations.

### Symmetry And Ornament

- `Radial Symmetry`: rings, spokes, medallions, and cathedral-window style wall sets.
- `Kaleidoscope`: mirrored wedge-based layouts with rotational symmetry controls.
- `L-System / Turtle Patterns`: branching ornamental lines, vines, glyphs, and recursive motifs.
- `Rose Curves / Polar Patterns`: flowers, stars, petals, and circular emblem-style layouts.
- `Tileable Motif Repeater`: stamp a local motif across the map with jitter, rotation, and spacing controls.

### Rooms And Architecture

- `BSP Room Partitioner`: recursive room subdivision without requiring maze connectivity.
- `Corridor Grid`: Manhattan-style street blocks, office floors, or dungeon grid plans.
- `Room Scatter`: drop disconnected or loosely connected rooms with overlap, gap, and door controls.
- `Courtyard Generator`: nested rectangles, courtyards, cloisters, and fortress plans.
- `Blueprint Generator`: halls, pillars, chambers, and wing layouts with deliberate architectural bias.

### Cellular And Growth Systems

- `Game of Life Variants`: evolve binary seeds for unusual chamber and tunnel fields.
- `Diffusion-Limited Aggregation`: coral, lightning, tendrils, and crystal-growth silhouettes.
- `Reaction-Diffusion Approximation`: stripe, spot, and biological-looking wall distributions.
- `Voronoi Region Carver`: region boundaries and cell walls from seeded points.
- `Erosion / Dilation Pipeline`: start from a simple seed and repeatedly grow, shrink, smooth, and puncture it.

### Patterned And Geometric

- `Stripe / Plaid Generator`: horizontal, vertical, and woven band patterns.
- `Checker / Diamond / Lattice`: regular geometric tilings with phase and scale controls.
- `Concentric Boxes`: nested rectangles, stepped ziggurats, or target-like layouts.
- `Line Interference`: overlapping line fields at different angles for technical or abstract patterns.
- `Circle Packing`: packed discs or rounded cells turned into walls by thresholding overlaps.

### Chaotic And Procedural Art

- `Drunk Walk Painter`: multiple walkers leaving trails, rooms, and scribble-like structures.
- `Particle Flow Field`: agents follow a vector field and carve streamlines.
- `Stamp Brush Generator`: repeatedly place primitive stamps like squares, circles, crosses, and bars.
- `Cutout Collage`: boolean add/subtract of random primitives for bold poster-like layouts.
- `Glitch Blocks`: broken scanlines, offsets, striping, and corrupted-grid aesthetics.

### Good Early Picks

- `Perlin Noise`: highest-value next addition because it covers natural layouts that the current set does not.
- `Worley / Cellular Noise`: complements Perlin with chambered, clustered structure.
- `BSP Room Partitioner`: strong architectural contrast to the maze-heavy current catalog.
- `Radial Symmetry`: quickly adds iconic, highly star-worthy layouts.
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
