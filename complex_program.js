/*
Filename: complex_program.js
Content: A complex program that generates a random maze using prim's algorithm and solves it using depth-first search.
*/

// Utility function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Class representing a cell in the maze
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
  }
}

// Class representing the maze
class Maze {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];

    // Create the grid
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(new Cell(i, j));
      }
      this.grid.push(row);
    }

    // Generate the maze
    this.generateMaze();
    this.start = this.grid[0][0];
    this.end = this.grid[rows - 1][cols - 1];
  }

  // Generate the maze using Prim's algorithm
  generateMaze() {
    const stack = [this.grid[0][0]];
    while (stack.length > 0) {
      const current = stack.pop();
      current.visited = true;

      const neighbors = this.getUnvisitedNeighbors(current);
      if (neighbors.length > 0) {
        stack.push(current);
        const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.removeWall(current, neighbor);
        stack.push(neighbor);
      }
    }
  }

  // Get unvisited neighbors of a cell
  getUnvisitedNeighbors(cell) {
    const neighbors = [];
    const { row, col } = cell;

    if (row > 0 && !this.grid[row - 1][col].visited) {
      neighbors.push(this.grid[row - 1][col]);
    }
    if (col < this.cols - 1 && !this.grid[row][col + 1].visited) {
      neighbors.push(this.grid[row][col + 1]);
    }
    if (row < this.rows - 1 && !this.grid[row + 1][col].visited) {
      neighbors.push(this.grid[row + 1][col]);
    }
    if (col > 0 && !this.grid[row][col - 1].visited) {
      neighbors.push(this.grid[row][col - 1]);
    }

    shuffle(neighbors);
    return neighbors;
  }

  // Remove wall between two cells
  removeWall(cell1, cell2) {
    const rowDiff = cell1.row - cell2.row;
    if (rowDiff === 1) {
      cell1.walls.top = false;
      cell2.walls.bottom = false;
    } else if (rowDiff === -1) {
      cell1.walls.bottom = false;
      cell2.walls.top = false;
    }

    const colDiff = cell1.col - cell2.col;
    if (colDiff === 1) {
      cell1.walls.left = false;
      cell2.walls.right = false;
    } else if (colDiff === -1) {
      cell1.walls.right = false;
      cell2.walls.left = false;
    }
  }

  // Solve the maze using depth-first search
  solveMaze() {
    const stack = [this.start];
    while (stack.length > 0) {
      const current = stack.pop();
      current.visited = true;

      if (current === this.end) {
        return true;
      }

      const neighbors = this.getNeighborsWithWalls(current);
      for (let neighbor of neighbors) {
        if (!neighbor.visited) {
          stack.push(neighbor);
          neighbor.parent = current;
        }
      }
    }

    return false;
  }

  // Get neighbors with walls of a cell
  getNeighborsWithWalls(cell) {
    const neighbors = [];
    const { row, col } = cell;

    if (!cell.walls.top && row > 0) {
      neighbors.push(this.grid[row - 1][col]);
    }
    if (!cell.walls.right && col < this.cols - 1) {
      neighbors.push(this.grid[row][col + 1]);
    }
    if (!cell.walls.bottom && row < this.rows - 1) {
      neighbors.push(this.grid[row + 1][col]);
    }
    if (!cell.walls.left && col > 0) {
      neighbors.push(this.grid[row][col - 1]);
    }

    return neighbors;
  }
}

// Create a maze with 15 rows and 25 columns
const maze = new Maze(15, 25);

// Solve the maze
maze.solveMaze();
