// ===== Grid configuration =====
const COLS = 31;
const ROWS = 19;
const CELL = 26;

const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
canvas.width = COLS * CELL;
canvas.height = ROWS * CELL;

// grid[row][col] = 0 empty, 1 obstacle
let grid = createEmptyGrid();
let start = { r: 2, c: 2 };
let end = { r: ROWS - 3, c: COLS - 3 };
let visitedCells = [];
let pathCells = [];
let mode = 'obstacle';
let isMouseDown = false;

const algoDescriptions = {
  bfs: "Explores layer by layer outward from the drone. Guarantees the shortest path on an unweighted grid, but explores broadly in all directions.",
  dfs: "Dives deep along one direction before backtracking. Fast to code, but does not guarantee the shortest path — included here for comparison.",
  dijkstra: "Explores by cumulative distance from the drone. On a uniform-cost grid it behaves like BFS, but generalizes to weighted terrain.",
  astar: "Like Dijkstra, but guided by a heuristic estimate of remaining distance to the destination — usually explores far fewer cells."
};

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// ===== Rendering =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL, y = r * CELL;
      ctx.fillStyle = getCellColor(r, c);
      ctx.fillRect(x, y, CELL - 1, CELL - 1);
    }
  }
}

function getCellColor(r, c) {
  if (r === start.r && c === start.c) return '#F2B84B';
  if (r === end.r && c === end.c) return '#4AD9C0';
  if (grid[r][c] === 1) return '#2B3B57';
  if (pathCells.some(p => p.r === r && p.c === c)) return '#F2B84B';
  if (visitedCells.some(p => p.r === r && p.c === c)) return '#2E4A78';
  return '#16213A';
}

// ===== Mouse interaction =====
function cellFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  const c = Math.floor(x / CELL);
  const r = Math.floor(y / CELL);
  return { r, c };
}

function applyModeAt(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  if (mode === 'obstacle') {
    if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
    grid[r][c] = grid[r][c] === 1 ? 0 : 1;
  } else if (mode === 'start') {
    if (grid[r][c] === 1) return;
    start = { r, c };
  } else if (mode === 'end') {
    if (grid[r][c] === 1) return;
    end = { r, c };
  }
  clearResults();
  draw();
}

canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  const { r, c } = cellFromEvent(e);
  applyModeAt(r, c);
});
canvas.addEventListener('mousemove', (e) => {
  if (!isMouseDown || mode !== 'obstacle') return;
  const { r, c } = cellFromEvent(e);
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
  grid[r][c] = 1;
  draw();
});
window.addEventListener('mouseup', () => { isMouseDown = false; });

// ===== Mode buttons =====
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
  });
});

// ===== Algorithms =====
function neighbors(r, c) {
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const out = [];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] !== 1) {
      out.push({ r: nr, c: nc });
    }
  }
  return out;
}

function reconstructPath(cameFrom, endKey) {
  const path = [];
  let cur = endKey;
  while (cur) {
    const [r, c] = cur.split(',').map(Number);
    path.push({ r, c });
    cur = cameFrom[cur];
  }
  return path.reverse();
}

function bfs() {
  const startKey = `${start.r},${start.c}`;
  const endKey = `${end.r},${end.c}`;
  const queue = [start];
  const visited = new Set([startKey]);
  const cameFrom = {};
  const order = [];

  while (queue.length) {
    const cur = queue.shift();
    const curKey = `${cur.r},${cur.c}`;
    order.push(cur);
    if (curKey === endKey) return { path: reconstructPath(cameFrom, endKey), visited: order };
    for (const n of neighbors(cur.r, cur.c)) {
      const key = `${n.r},${n.c}`;
      if (!visited.has(key)) {
        visited.add(key);
        cameFrom[key] = curKey;
        queue.push(n);
      }
    }
  }
  return { path: null, visited: order };
}

function dfs() {
  const startKey = `${start.r},${start.c}`;
  const endKey = `${end.r},${end.c}`;
  const stack = [start];
  const visited = new Set([startKey]);
  const cameFrom = {};
  const order = [];

  while (stack.length) {
    const cur = stack.pop();
    const curKey = `${cur.r},${cur.c}`;
    if (order.length === 0 || order[order.length - 1].r !== cur.r || order[order.length - 1].c !== cur.c) {
      order.push(cur);
    }
    if (curKey === endKey) return { path: reconstructPath(cameFrom, endKey), visited: order };
    for (const n of neighbors(cur.r, cur.c)) {
      const key = `${n.r},${n.c}`;
      if (!visited.has(key)) {
        visited.add(key);
        cameFrom[key] = curKey;
        stack.push(n);
      }
    }
  }
  return { path: null, visited: order };
}

function dijkstra() {
  const startKey = `${start.r},${start.c}`;
  const endKey = `${end.r},${end.c}`;
  const dist = { [startKey]: 0 };
  const cameFrom = {};
  const visited = new Set();
  const order = [];
  // simple priority queue via array (grid is small enough this is fine)
  const pq = [{ key: startKey, r: start.r, c: start.c, d: 0 }];

  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const cur = pq.shift();
    if (visited.has(cur.key)) continue;
    visited.add(cur.key);
    order.push({ r: cur.r, c: cur.c });
    if (cur.key === endKey) return { path: reconstructPath(cameFrom, endKey), visited: order };
    for (const n of neighbors(cur.r, cur.c)) {
      const key = `${n.r},${n.c}`;
      const nd = cur.d + 1;
      if (dist[key] === undefined || nd < dist[key]) {
        dist[key] = nd;
        cameFrom[key] = cur.key;
        pq.push({ key, r: n.r, c: n.c, d: nd });
      }
    }
  }
  return { path: null, visited: order };
}

function astar() {
  const startKey = `${start.r},${start.c}`;
  const endKey = `${end.r},${end.c}`;
  const h = (r, c) => Math.abs(r - end.r) + Math.abs(c - end.c);
  const g = { [startKey]: 0 };
  const f = { [startKey]: h(start.r, start.c) };
  const cameFrom = {};
  const visited = new Set();
  const order = [];
  const open = [{ key: startKey, r: start.r, c: start.c }];

  while (open.length) {
    open.sort((a, b) => f[a.key] - f[b.key]);
    const cur = open.shift();
    if (visited.has(cur.key)) continue;
    visited.add(cur.key);
    order.push({ r: cur.r, c: cur.c });
    if (cur.key === endKey) return { path: reconstructPath(cameFrom, endKey), visited: order };
    for (const n of neighbors(cur.r, cur.c)) {
      const key = `${n.r},${n.c}`;
      const tentativeG = g[cur.key] + 1;
      if (g[key] === undefined || tentativeG < g[key]) {
        cameFrom[key] = cur.key;
        g[key] = tentativeG;
        f[key] = tentativeG + h(n.r, n.c);
        open.push({ key, r: n.r, c: n.c });
      }
    }
  }
  return { path: null, visited: order };
}

const algorithms = { bfs, dfs, dijkstra, astar };
const algoNames = { bfs: 'BFS', dfs: 'DFS', dijkstra: "Dijkstra's", astar: 'A*' };

// ===== Run / animate =====
function clearResults() {
  visitedCells = [];
  pathCells = [];
  document.getElementById('statExplored').textContent = '—';
  document.getElementById('statLength').textContent = '—';
  document.getElementById('statTime').textContent = '—';
  document.getElementById('statFound').textContent = '—';
}

function runAlgorithm(showAnimation = true) {
  const algo = document.getElementById('algoSelect').value;
  const t0 = performance.now();
  const result = algorithms[algo]();
  const t1 = performance.now();

  document.getElementById('statExplored').textContent = result.visited.length;
  document.getElementById('statTime').textContent = (t1 - t0).toFixed(2) + ' ms';
  document.getElementById('statFound').textContent = result.path ? 'Yes' : 'No';
  document.getElementById('statLength').textContent = result.path ? (result.path.length - 1) : '—';

  const statusEl = document.getElementById('statusText');
  if (!result.path) {
    statusEl.textContent = `${algoNames[algo]}: no route found — the destination is unreachable from here.`;
    visitedCells = result.visited;
    pathCells = [];
    draw();
    return;
  }

  statusEl.textContent = `${algoNames[algo]}: route found — ${result.path.length - 1} steps, ${result.visited.length} cells explored.`;

  if (!showAnimation) {
    visitedCells = result.visited;
    pathCells = result.path;
    draw();
    return;
  }

  animateResult(result);
}

function animateResult(result) {
  visitedCells = [];
  pathCells = [];
  const speed = 101 - Number(document.getElementById('speedRange').value);
  const delay = Math.max(1, speed / 4);
  let i = 0;

  function stepVisited() {
    if (i < result.visited.length) {
      visitedCells.push(result.visited[i]);
      i++;
      draw();
      setTimeout(stepVisited, delay);
    } else {
      let j = 0;
      function stepPath() {
        if (j < result.path.length) {
          pathCells.push(result.path[j]);
          j++;
          draw();
          setTimeout(stepPath, delay * 2);
        }
      }
      stepPath();
    }
  }
  stepVisited();
}

document.getElementById('btnRun').addEventListener('click', () => runAlgorithm(true));

document.getElementById('algoSelect').addEventListener('change', (e) => {
  document.getElementById('algoDesc').textContent = algoDescriptions[e.target.value];
});
document.getElementById('algoDesc').textContent = algoDescriptions['astar'];

// ===== Compare all four =====
let compareChartInstance = null;

document.getElementById('btnCompare').addEventListener('click', () => {
  const labels = [];
  const explored = [];
  const lengths = [];
  const times = [];

  for (const key of ['bfs', 'dfs', 'dijkstra', 'astar']) {
    const t0 = performance.now();
    const result = algorithms[key]();
    const t1 = performance.now();
    labels.push(algoNames[key]);
    explored.push(result.visited.length);
    lengths.push(result.path ? result.path.length - 1 : 0);
    times.push(Number((t1 - t0).toFixed(3)));
  }

  document.getElementById('chartBlock').classList.remove('hidden');
  const ctx2 = document.getElementById('compareChart').getContext('2d');
  if (compareChartInstance) compareChartInstance.destroy();

  compareChartInstance = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Cells explored', data: explored, backgroundColor: '#2E4A78' },
        { label: 'Path length', data: lengths, backgroundColor: '#F2B84B' }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#E7ECF5', font: { size: 11 } } },
        title: { display: true, text: 'Cells explored vs. path length, by algorithm', color: '#E7ECF5', font: { size: 12 } }
      },
      scales: {
        x: { ticks: { color: '#8494AD' }, grid: { color: '#223252' } },
        y: { ticks: { color: '#8494AD' }, grid: { color: '#223252' }, beginAtZero: true }
      }
    }
  });

  document.getElementById('statusText').textContent =
    `Compared all four algorithms on the current grid — see the chart for cells explored and path length.`;
});

// ===== Maze generation (recursive backtracker) =====
function generateMaze() {
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(1));

  function carve(r, c) {
    grid[r][c] = 0;
    const dirs = [[-2,0],[2,0],[0,-2],[0,2]];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && grid[nr][nc] === 1) {
        grid[r + dr / 2][c + dc / 2] = 0;
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);

  // ensure start and end are open
  grid[start.r][start.c] = 0;
  grid[end.r][end.c] = 0;
  // clear a small area around each so they're not boxed in
  for (const pt of [start, end]) {
    for (const [dr, dc] of [[0,0],[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = pt.r + dr, nc = pt.c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) grid[nr][nc] = 0;
    }
  }

  clearResults();
  document.getElementById('chartBlock').classList.add('hidden');
  document.getElementById('statusText').textContent = 'Maze generated — pick an algorithm and plan a route.';
  draw();
}

document.getElementById('btnMaze').addEventListener('click', generateMaze);

document.getElementById('btnClearObstacles').addEventListener('click', () => {
  grid = createEmptyGrid();
  clearResults();
  document.getElementById('chartBlock').classList.add('hidden');
  document.getElementById('statusText').textContent = 'Obstacles cleared.';
  draw();
});

document.getElementById('btnReset').addEventListener('click', () => {
  grid = createEmptyGrid();
  start = { r: 2, c: 2 };
  end = { r: ROWS - 3, c: COLS - 3 };
  clearResults();
  document.getElementById('chartBlock').classList.add('hidden');
  document.getElementById('statusText').textContent = 'Grid reset. Click the grid to place obstacles, then set the drone and destination.';
  draw();
});

// ===== Init =====
draw();
