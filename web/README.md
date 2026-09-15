# Drone Delivery Path Planner — Web Version

An interactive, browser-based extension of the [CLI drone delivery path planner](../drone-path-planner), visualizing grid-based route planning across four different search algorithms.

## What it does

- Draw obstacles directly on the grid, and place the drone (start) and destination (end) anywhere
- Plan a route using **BFS**, **DFS**, **Dijkstra's Algorithm**, or **A\*** — each implemented from scratch, no libraries
- Watch the search animate cell-by-cell, then trace the final flight path
- **Compare all four algorithms** on the same grid at once, with a live chart of cells explored vs. path length
- **Generate a maze** with one click (recursive backtracker algorithm) to stress-test each algorithm on a harder layout

## Why four algorithms

The CLI version implements Dijkstra's from scratch. This version puts it side by side with BFS, DFS, and A\* on the *same* grid, so the difference between them is visible rather than theoretical — DFS finds *a* path but rarely the shortest one, BFS and Dijkstra behave identically on this uniform-cost grid, and A\* consistently explores far fewer cells than either by using a distance heuristic toward the destination.

## Tech

- Vanilla JavaScript — no framework, so the algorithm implementations are the whole point, not hidden behind a library
- HTML5 Canvas for the grid rendering
- [Chart.js](https://www.chartjs.org/) for the comparison dashboard

## Running it locally

No build step — it's a static site.

```bash
git clone <this-repo-url>
cd drone-path-planner-web
```

Then just open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
```

and visit `http://localhost:8000`.

## Screenshot

_Add a screenshot or short GIF here of the grid mid-animation — this is the single most effective thing you can add to this README for anyone skimming your GitHub._
