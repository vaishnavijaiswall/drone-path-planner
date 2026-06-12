# Drone Delivery Path Planner

A C-based pathfinding system that simulates drone navigation using **Dijkstra's Algorithm** and **A* Algorithm**. The project finds the shortest route between a source and destination while avoiding obstacles on a grid map.

## Features

* Dijkstra's shortest path algorithm
* A* shortest path algorithm
* Multiple route visualization using DFS
* User-defined route display limit
* Obstacle avoidance
* Shortest distance calculation
* Grid-based path visualization

## Project Structure

```text
drone-path-planner/
├── dijkstra.c
├── astar.c
└── README.md
```

## Grid Symbols

| Symbol | Meaning     |
| ------ | ----------- |
| S      | Start       |
| D      | Destination |
| X      | Obstacle    |
| .      | Free Path   |
| *      | Path        |

## Algorithms

### Dijkstra + DFS

* Finds the shortest path.
* Displays multiple possible routes.
* Allows the user to choose the number of routes displayed.

### A*

* Uses Manhattan Distance heuristic.
* Finds the optimal path efficiently.
* Suitable for larger search spaces.

## Compilation

```bash
gcc dijkstra.c -o dijkstra
./dijkstra

gcc astar.c -o astar
./astar
```

## Applications

* Drone navigation
* Route optimization
* Robotics path planning
* Autonomous systems

## Author

Vaishnavi Jaiswal
