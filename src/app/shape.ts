const xTemplates = [
  [0, 1, 0, 0],
  [0, 0, -1, 1],
  [0, -1, 0, 0],
  [0, 0, 0, 0],
  [0, 1, 0, 1],
  [0, -1, 0, 1],
  [0, 1, -1, 0],
];
const yTemplates = [
  [0, 0, 1, 2],
  [0, 1, 1, 1],
  [0, 0, 1, 2],
  [0, 1, 2, 3],
  [0, 0, 1, 1],
  [0, 0, 1, 1],
  [0, 0, 1, 1],
];

export class Shape {
  xTiles = new Array(4);
  yTiles = new Array(4);

  static createRandomShape(x, y): Shape {
    let randIndex = Math.floor(Math.random() * xTemplates.length);
    let shape = new Shape();
    let xTemplate = xTemplates[randIndex];
    let yTemplate = yTemplates[randIndex];
    for (let i = 0; i < 4; ++i) {
      shape.xTiles[i] = xTemplate[i] + x;
      shape.yTiles[i] = yTemplate[i] + y;
    }
    return shape;
  }

  draw(ctx, size) {
    for (let i = 0; i < 4; ++i) {
      ctx.fillStyle = 'rgb(15,125,245)';
      ctx.fillRect(
        this.xTiles[i] * size + 1,
        this.yTiles[i] * size + 1,
        size - 2,
        size - 2
      );
    }
  }

  mergeWithBoard(board) {
    for (let i = 0; i < 4; ++i) {
      board[this.yTiles[i]][this.xTiles[i]] = 1;
    }
  }

  moveUp(board) {
    for (let i = 0; i < 4; ++i) {
      this.yTiles[i]--;
    }
  }

  moveDown(board) {
    for (let i = 0; i < 4; ++i) {
      this.yTiles[i]++;
    }
    if (!this.isInBoard(board)) {
      this.moveUp(board);
      this.mergeWithBoard(board);
      return true;
    }
    return false;
  }

  moveLeft(board) {
    for (let i = 0; i < 4; ++i) {
      this.xTiles[i]--;
    }
    if (!this.isInBoard(board)) {
      this.moveRight(board);
    }
  }

  moveRight(board) {
    for (let i = 0; i < 4; ++i) {
      this.xTiles[i]++;
    }
    if (!this.isInBoard(board)) {
      this.moveLeft(board);
    }
  }

  isInBoard(board) {
    for (let i = 0; i < 4; ++i) {
      if (this.xTiles[i] < 0 || this.xTiles[i] >= 10) {
        return false;
      }
      if (this.yTiles[i] < 0 || this.yTiles[i] >= 20) {
        return false;
      }
      if (board[this.yTiles[i]][this.xTiles[i]] === 1) {
        return false;
      }
    }
    return true;
  }

  rotate(board) {
    let copyX = this.xTiles.slice();
    let copyY = this.yTiles.slice();
    let minX = Math.min(...this.xTiles);
    let minY = Math.min(...this.yTiles);
    let a = [];
    a.push(new Array(4));
    a.push(new Array(4));
    a.push(new Array(4));
    a.push(new Array(4));

    for (let i = 0; i < 4; ++i) {
      this.xTiles[i] -= minX;
      this.yTiles[i] -= minY;
      a[this.yTiles[i]][this.xTiles[i]] = 1;
    }

    let N = 4;
    for (let x = 0; x < 4 / 2; x++) {
      for (let y = x; y < 4 - x - 1; y++) {
        let temp = a[x][y];
        a[x][y] = a[y][N - 1 - x];
        a[y][N - 1 - x] = a[N - 1 - x][N - 1 - y];
        a[N - 1 - x][N - 1 - y] = a[N - 1 - y][x];
        a[N - 1 - y][x] = temp;
      }
    }

    let count = 0;
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (a[i][j] === 1) {
          this.xTiles[count] = j;
          this.yTiles[count] = i;
          ++count;
        }
      }
    }

    let minX2 = Math.min(...this.xTiles);
    let minY2 = Math.min(...this.yTiles);

    for (let i = 0; i < 4; ++i) {
      this.xTiles[i] += minX - minX2;
      this.yTiles[i] += minY - minY2;
    }

    if (!this.isInBoard(board)) {
      this.xTiles = copyX;
      this.yTiles = copyY;
    }
  }
}
