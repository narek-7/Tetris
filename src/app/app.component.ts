import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  HostListener,
} from '@angular/core';
import { Shape } from './shape';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  Rows = 20;
  Columns = 10;
  Size = 30;
  board = [];
  currentShape: Shape;
  score = 0;
  pause = false;
  start = 'isNotStarting';
  highScore;
  speed;
  timerId;
  nextScore;

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctxScore = this.canvasScore.nativeElement.getContext('2d');
    this.highScore = Number(localStorage.getItem('key'));
    this.drawScore();
    this.speed = 400;
    this.nextScore = 100;

    for (let i = 0; i < this.Rows; ++i) {
      this.board.push(new Array(this.Columns));
    }
    this.currentShape = Shape.createRandomShape(4, 0);
    this.draw();
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(ev) {
    if (ev.key == 'ArrowDown') {
      this.makeMove();
    }
    if (ev.key == 'ArrowUp') {
      this.onRotate();
    }
    if (ev.key == 'ArrowLeft') {
      this.onLeft();
    }
    if (ev.key == 'ArrowRight') {
      this.onRight();
    }
    if (ev.keyCode == '13') {
      this.onStart();
    }
    if (ev.keyCode == '32') {
      this.pauseGame();
    }
  }

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  @ViewChild('canvasScore', { static: true })
  canvasScore: ElementRef<HTMLCanvasElement>;
  private ctxScore: CanvasRenderingContext2D;

  draw() {
    for (let i = 0; i < this.Rows; i++) {
      for (let j = 0; j < this.Columns; j++) {
        if (this.board[i][j]) {
          this.ctx.fillStyle = 'rgb(15,105,255)';
          this.ctx.fillRect(
            j * this.Size + 1,
            i * this.Size + 1,
            this.Size - 2,
            this.Size - 2
          );
        } else {
          this.ctx.fillStyle = 'aliceblue';
          this.ctx.fillRect(
            j * this.Size + 1,
            i * this.Size + 1,
            this.Size - 2,
            this.Size - 2
          );
        }
      }
    }
    this.currentShape.draw(this.ctx, this.Size);
  }

  onStart() {
    if (this.start == 'isNotStarting') {
      this.start = 'IsRunnig';
      this.startTimer();
    }
  }

  startTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    console.log('SPEED: ' + this.speed);
    this.timerId = setInterval(() => this.makeMove(interval), this.speed);
  }

  makeMove(int?) {
    if (!this.pause && this.start == 'IsRunnig') {
      let stopped = this.currentShape.moveDown(this.board);
      if (stopped) {
        this.checkLines();
        this.currentShape = Shape.createRandomShape(4, 0);
        let inTheEnd = this.currentShape.isInBoard(this.board);
        if (!inTheEnd) {
          this.gameOver();
        }
      }
      this.draw();
    }
  }

  onLeft() {
    if (this.start == 'IsRunnig') {
      this.currentShape.moveLeft(this.board);
      this.draw();
    }
  }

  onRight() {
    if (this.start == 'IsRunnig') {
      this.currentShape.moveRight(this.board);
      this.draw();
    }
  }

  onRotate() {
    if (this.start == 'IsRunnig') {
      this.currentShape.rotate(this.board);
      this.draw();
    }
  }

  checkLine(line) {
    let count = 0;
    for (let j = 0; j < this.Columns; ++j) {
      if (this.board[line][j] === 1) {
        ++count;
      }
    }
    return count === this.Columns;
  }

  checkLines() {
    let deletedCount = 0;
    for (let i = this.Rows - 1; i >= 0; --i) {
      if (this.checkLine([i])) {
        this.board.splice(i, 1);
        this.board.unshift(new Array(this.Columns));
        ++deletedCount;
        ++i;
      }
    }
    if (deletedCount) {
      this.countScore(deletedCount);
      this.drawScore();
    }
  }

  pauseGame() {
    if (this.start == 'IsRunnig') {
      this.start = 'isOnPause';
      this.pause = !this.pause;
    } else {
      if (this.start == 'isOnPause') {
        this.start = 'IsRunnig';
        this.pause = !this.pause;
      }
    }
  }

  countScore(s) {
    if (s === 1) {
      s = 100;
    } else if (s === 2) {
      s = 300;
    } else if (s === 3) {
      s = 600;
    } else if (s === 4) {
      s = 1000;
    }
    this.score += s;
    if (this.score >= this.nextScore) {
      this.nextScore += 100;

      this.startTimer();
    }
  }

  drawScore() {
    let score: string = this.score.toString();
    let a = this.ctxScore;
    a.fillStyle = 'aliceblue';
    a.fillRect(0, 0, 200, 100);
    a.fillStyle = 'black';
    a.font = '30px Old English Text MT';
    a.fillText('T E T R I S', 15, 30);
    a.font = '18px Bahnschrift SemiBold';
    a.fillText('Live Score:', 20, 60);
    a.fillText('High Score:', 20, 90);
    a.fillStyle = 'red';
    a.fillText(score, 125, 62);
    a.fillStyle = 'rgb(15,105,255)';
    a.fillText(this.highScore, 126, 90);
  }

  gameOver() {
    let high;
    location.reload();
    if (this.score > this.highScore) {
      this.highScore = this.score;
      high = this.highScore.toString();
      localStorage.setItem('key', high);
      alert(`CONGRATS, YOU HAVE A NEW RECORD - ${this.highScore} !!! `);
    }
    setTimeout(() => {
      alert('Game Over');
    }, 0.7);
  }
}
