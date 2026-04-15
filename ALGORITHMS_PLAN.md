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
