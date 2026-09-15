🚁 Drone Delivery Path Planner

A pathfinding project that simulates autonomous drone navigation on a grid while avoiding obstacles and finding an efficient route from a start point to a destination.

The project is implemented in two versions:

CLI Version — C-based implementation of pathfinding algorithms
Web Version — Interactive browser-based visualization using HTML, CSS, and JavaScript
📌 Project Overview

The Drone Delivery Path Planner demonstrates how classical pathfinding algorithms can be used to solve route-planning problems for autonomous drones.

The drone operates on a grid containing:

🟠 Start point (drone)
🔵 Destination
⬛ Obstacles
🟡 Path

The algorithms calculate a route from the start point to the destination while avoiding blocked cells.

🛠️ Project Versions
💻 1. CLI Version — C

The CLI version provides a command-line implementation of the pathfinding system using C.

Algorithms implemented:

Dijkstra's Algorithm
A* (A-star) Algorithm

Features:

Grid-based pathfinding, implemented entirely from scratch with no library support
Modular design — 8 separate functions covering grid input, distance initialization, minimum-cell selection, neighbor relaxation, and parent-tracked path back-tracing
Obstacle avoidance and out-of-boundary handling
Correctly reports when no path exists (disconnected grids)
Shortest-path calculation, visually marked on the output grid
Tested successfully on grids up to 20×20
Command-line execution

📁 Location:

text
cli/

Compilation:

bash
gcc cli/dijkstra.c -o dijkstra
./dijkstra

gcc cli/astar.c -o astar
./astar
🌐 2. Web Version — HTML, CSS, JavaScript

The web version extends the CLI concept into an interactive, browser-based visualizer — built to make the difference between algorithms visible instead of theoretical.

Algorithms implemented (all from scratch, no libraries):

Breadth-First Search (BFS)
Depth-First Search (DFS)
Dijkstra's Algorithm
A* (A-star) Search

Features:

Interactive HTML5 Canvas grid — click to draw obstacles, and place the drone (start) or destination anywhere
Animated pathfinding — watch each algorithm explore the grid cell-by-cell before tracing the final route
Adjustable animation speed
Compare all four mode — runs all four algorithms on the same grid at once and charts cells explored vs. path length using Chart.js
One-click maze generation using a recursive backtracker algorithm, for stress-testing each algorithm on a harder layout
Live flight telemetry panel — cells explored, path length, execution time, and whether a path was found

📁 Location:

text
web/

Running it locally:

No build step — it's a static site.

bash
cd web
python3 -m http.server 8000

Then visit http://localhost:8000, or simply open web/index.html directly in a browser.

🧠 Why Four Algorithms in the Web Version

The CLI version implements Dijkstra's and A* from scratch. The web version puts all four side by side on the same grid, so the practical difference between them is visible rather than theoretical:

DFS finds a path, but rarely the shortest one
BFS and Dijkstra's behave identically on this uniform-cost grid, since every step costs the same
A* consistently explores far fewer cells than either, by using a distance heuristic that guides the search toward the destination instead of expanding outward blindly
📂 Repository Structure
text
drone-path-planner/
├── cli/
│   ├── dijkstra.c
│   ├── astar.c
│   └── README.md
├── web/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── chart.umd.min.js
│   └── README.md
└── README.md   (this file)
🎯 Applications
Drone navigation and delivery route planning
Robotics path planning
Autonomous systems and route optimization
Teaching/demonstrating classical search algorithm behavior

✍️ Author

Vaishnavi Jaiswal