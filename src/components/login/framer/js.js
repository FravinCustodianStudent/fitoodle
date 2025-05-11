import React, { useEffect } from 'react';

const tetrominos = [
    {
        colors: ['rgb(43,45,66)', 'rgb(148,155,228)', 'rgb(104,109,160)'],
        data: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
    },
    {
        colors: ['rgb(217,4,40)', 'rgb(241,108,107)', 'rgb(208,4,38)'],
        data: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
        ],
    },
];

class Tetris {
    constructor(x, y, width, height) {
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.unitSize = 20;

        this.bgCanvas = document.createElement('canvas');
        this.fgCanvas = document.createElement('canvas');
        this.bgCanvas.width = this.fgCanvas.width = width;
        this.bgCanvas.height = this.fgCanvas.height = height;

        [this.bgCanvas, this.fgCanvas].forEach((c) => {
            c.style.position = 'absolute';
            c.style.left = x + 'px';
            c.style.top = y + 'px';
            document.body.appendChild(c);
        });

        this.bgCtx = this.bgCanvas.getContext('2d');
        this.fgCtx = this.fgCanvas.getContext('2d');

        this.init();
    }


    init() {
        this.curPiece = { data: null, colors: [], x: 0, y: 0 };
        this.lastMove = Date.now();
        this.curSpeed = 50 + Math.random() * 50;
        this.linesCleared = 0;
        this.level = 0;
        this.loseBlock = 0;

        this.boardWidth = Math.floor(this.width / this.unitSize);
        this.boardHeight = Math.floor(this.height / this.unitSize);

        this.board = [];
        const halfH = this.boardHeight / 2;
        for (let x = 0; x < this.boardWidth; x++) {
            this.board[x] = [];
            for (let y = 0; y < this.boardHeight; y++) {
                let cell = { data: 0, colors: ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)'] };
                if (y > halfH && Math.random() > 0.15) {
                    cell = {
                        data: 1,
                        colors: tetrominos[Math.floor(Math.random() * tetrominos.length)].colors,
                    };
                }
                this.board[x][y] = cell;
            }
        }

        // collapse gaps down
        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = this.boardHeight - 1; y > 0; y--) {
                if (this.board[x][y].data === 0) {
                    for (let yy = y; yy > 0; yy--) {
                        if (this.board[x][yy - 1].data === 1) {
                            this.board[x][yy].data = 1;
                            this.board[x][yy].colors = this.board[x][yy - 1].colors;
                            this.board[x][yy - 1].data = 0;
                            this.board[x][yy - 1].colors = ['rgb(0,0,0)','rgb(0,0,0)','rgb(0,0,0)'];
                        }
                    }
                }
            }
        }

        window.addEventListener('keydown', (e) => {
            const p = this.curPiece;
            switch (e.keyCode) {
                case 37:
                    if (this.checkMovement(p, -1, 0)) p.x--;
                    break;
                case 39:
                    if (this.checkMovement(p, 1, 0)) p.x++;
                    break;
                case 40:
                    if (this.checkMovement(p, 0, 1)) p.y++;
                    break;
                case 32:
                case 38:
                    p.data = this.rotateTetrimono(p);
                    break;
            }
        });

        this.checkLines();
        this.renderBoard();
        this.newTetromino();
        this.update();
    }

    update() {
        const p = this.curPiece;
        if (!this.checkMovement(p, 0, 1)) {
            if (p.y < -1) {
                this.loseScreen();
                return;
            }
            this.fillBoard(p);
            this.newTetromino();
        } else if (Date.now() > this.lastMove) {
            this.lastMove = Date.now() + this.curSpeed;
            p.y++;
        }
        this.render();
        requestAnimationFrame(() => this.update());
    }

    renderBoard() {
        const ctx = this.bgCtx, us = this.unitSize;
        ctx.clearRect(0, 0, this.width, this.height);
        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                if (this.board[x][y].data) {
                    const [c1, c2, c3] = this.board[x][y].colors;
                    const px = x * us, py = y * us;
                    ctx.fillStyle = c1; ctx.fillRect(px, py, us, us);
                    ctx.fillStyle = c2; ctx.fillRect(px + 2, py + 2, us - 4, us - 4);
                    ctx.fillStyle = c3; ctx.fillRect(px + 4, py + 4, us - 8, us - 8);
                }
            }
        }
    }

    render() {
        const ctx = this.fgCtx, us = this.unitSize, p = this.curPiece;
        ctx.clearRect(0, 0, this.width, this.height);
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (p.data[x][y]) {
                    const px = (p.x + x) * us, py = (p.y + y) * us;
                    if (py >= 0) {
                        ctx.fillStyle = p.colors[0]; ctx.fillRect(px, py, us, us);
                        ctx.fillStyle = p.colors[1]; ctx.fillRect(px + 2, py + 2, us - 4, us - 4);
                        ctx.fillStyle = p.colors[2]; ctx.fillRect(px + 4, py + 4, us - 8, us - 8);
                    }
                }
            }
        }
    }

    checkMovement(piece, dx, dy) {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (piece.data[x][y]) {
                    const nx = piece.x + x + dx;
                    const ny = piece.y + y + dy;
                    if (nx < 0 || nx >= this.boardWidth || ny > this.boardHeight) return false;
                    if (ny >= 0 && this.board[nx][ny].data) return false;
                }
            }
        }
        return true;
    }

    checkLines() {
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            let full = true;
            for (let x = 0; x < this.boardWidth; x++) {
                if (!this.board[x][y].data) { full = false; break; }
            }
            if (full) {
                for (let yy = y; yy > 0; yy--) {
                    for (let x = 0; x < this.boardWidth; x++) {
                        this.board[x][yy] = {
                            data: this.board[x][yy - 1].data,
                            colors: this.board[x][yy - 1].colors.slice()
                        };
                    }
                }
                y++;
            }
        }
    }

    loseScreen() {
        const ctx = this.bgCtx, us = this.unitSize, w = this.boardWidth;
        const row = this.boardHeight - 1 - this.loseBlock;
        for (let x = 0; x < w; x++) {
            const px = x * us, py = row * us;
            ctx.fillStyle = 'rgb(80,80,80)'; ctx.fillRect(px, py, us, us);
            ctx.fillStyle = 'rgb(150,150,150)'; ctx.fillRect(px + 2, py + 2, us - 4, us - 4);
            ctx.fillStyle = 'rgb(100,100,100)'; ctx.fillRect(px + 4, py + 4, us - 8, us - 8);
        }
        if (this.loseBlock < this.boardHeight) {
            this.loseBlock++;
            requestAnimationFrame(() => this.loseScreen());
        } else this.init();
    }

    fillBoard(piece) {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (piece.data[x][y]) {
                    const px = piece.x + x;
                    const py = piece.y + y;
                    if (py >= 0) {
                        this.board[px][py].data = 1;
                        this.board[px][py].colors = piece.colors.slice();
                    }
                }
            }
        }
        this.checkLines();
        this.renderBoard();
    }

    rotateTetrimono(piece) {
        const size = 4;
        const r = Array.from({ length: size }, () => []);
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                r[x][y] = piece.data[size - 1 - y][x];
            }
        }
        return this.checkMovement({ data: r, x: piece.x, y: piece.y }, 0, 0)
            ? r
            : piece.data;
    }

    newTetromino() {
        const idx = Math.floor(Math.random() * tetrominos.length);
        this.curPiece.data = tetrominos[idx].data;
        this.curPiece.colors = tetrominos[idx].colors.slice();
        this.curPiece.x = Math.floor(Math.random() * (this.boardWidth - 4));
        this.curPiece.y = -4;
    }
}

export default function createTetris() {
    let canvases = [];

    function clearAll() {
        canvases.forEach(c => {
            if (c.parentNode) c.parentNode.removeChild(c);
        });
        canvases = [];
    }
    function start() {
        clearAll();
        const unitSize = 20;
        const boards   = 6;

        // 1) how many cells cover the full window?
        // never overshoot width, clamp both axes
        const totalCellsX = Math.floor(window.innerWidth / unitSize);
        const totalCellsY = Math.ceil(window.innerHeight / unitSize);

        const baseCells = Math.floor(totalCellsX / boards);
        const extraCells = totalCellsX % boards;

        let xOffsetCells = 0;

        for (let i = 0; i < boards; i++) {
            const cellsThisBoard = baseCells + (i < extraCells ? 1 : 0);
            const bWidthPx = cellsThisBoard * unitSize;
            const bHeightPx = totalCellsY * unitSize;
            const xPx = xOffsetCells * unitSize;

            const t = new Tetris(xPx, 0, bWidthPx, bHeightPx);
            // track both canvases
            canvases.push(t.bgCanvas, t.fgCanvas);

            xOffsetCells += cellsThisBoard;
        }
        window.addEventListener('resize', start);
    }

    return { start };
}
