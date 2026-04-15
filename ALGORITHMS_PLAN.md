# Algorithms Plan

This file defines the maze-style wall generators we should add behind `File > Generate`.

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

## Generators To Implement

These are the upstream generation algorithms from `mazelib` that fit this modal.

| Priority | Algorithm              | Upstream params to expose             | Notes                                                                                                                |
| -------- | ---------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Done     | Backtracking Generator | start seed only                       | Implemented with seed, block size, and explicit start cell controls.                                                 |
| Done     | Growing Tree           | `backtrack_chance`                    | Implemented with seed, block size, explicit start cell controls, and backtrack chance.                               |
| Done     | Prim's                 | start seed only                       | Implemented with seed, block size, and explicit start cell controls.                                                 |
| Done     | Recursive Division     | bias mode / cut strategy              | Implemented with seed and block size. Bias/cut-strategy controls can still be added later if we want more variety.   |
| 2        | Kruskal's              | start seed only                       | Another strong baseline spanning-tree generator with a different texture.                                            |
| 2        | Sidewinder             | `skew`                                | Very cheap to generate and visually distinct.                                                                        |
| 2        | Binary Tree            | `skew` (`NW`, `NE`, `SE`, `SW`)       | Extremely simple and fast; useful even though it is intentionally biased.                                            |
| 2        | Hunt-and-Kill          | `hunt_order` (`random`, `serpentine`) | Good variety and fits the modal well.                                                                                |
| 2        | Wilson's               | `hunt_order` (`random`, `serpentine`) | Important unbiased generator, slower but high value.                                                                 |
| 3        | Aldous-Broder          | start seed only                       | Also unbiased, but slower; still worth having for completeness.                                                      |
| 3        | Eller's                | `xskew`, `yskew`                      | Good row-wise texture and useful for directional variation.                                                          |
| 3        | Cellular Automaton     | `complexity`, `density`               | Imperfect mazes are still valuable here because the modal is for harvesting wall patterns, not only “perfect” mazes. |
| 3        | Dungeon Rooms          | `rooms`, `grid`, `hunt_order`         | High-value once we define a local room-layout randomizer.                                                            |
| 3        | Trivial Maze           | `maze_type` (`spiral`, `serpentine`)  | Present in source, not in the main generator doc page. Good for iconic simple patterns.                              |

## Recommended Implementation Order

1. Keep `Random Noise` as the fast fallback and test harness.
2. Add the cheap directional set: `Binary Tree`, `Sidewinder`, `Eller's`.
3. Add the slower completeness set: `Kruskal's`, `Hunt-and-Kill`, `Wilson's`, `Aldous-Broder`.
4. Add the imperfect/specialized set: `Cellular Automaton`, `Dungeon Rooms`, `Trivial Maze`.

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
