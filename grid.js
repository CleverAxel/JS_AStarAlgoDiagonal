import { AStar } from "./astar.js";
import { coordinateToIndex } from "./utils.js";
import { Vector2 } from "./vector2.js";

export class Grid {

    /**
     * @param {number} columnLength 
     * @param {number} rowLength 
     * @param {number} cellSize 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(columnLength, rowLength, cellSize, canvas) {
        this.columnWidth = columnLength;
        this.rowHeight = rowLength;
        this.cellSize = cellSize;

        this.isMouseDown = false;

        this.canvas = canvas;
        this.canvas.width = cellSize * columnLength;
        this.canvas.height = cellSize * rowLength;

        this.ctx = canvas.getContext("2d");

        this.oldPos = new Vector2(-1, -1);

        this.aStar = new AStar();
        this.aStar.columnWidth = this.columnWidth;
        this.aStar.rowHeight = this.rowHeight;

        this.initEventListeners();
    }

    initEventListeners() {
        this.canvas.addEventListener("mousedown", (e) => {
            this.isMouseDown = true;
            this.addObstacleToList(e, true);
        });

        this.canvas.addEventListener("mouseup", () => this.isMouseDown = false);
        this.canvas.addEventListener("mousemove", (e) => {
            this.addObstacleToList(e);
        });
    }

    render() {
        this.renderObstacles();
        this.renderResolvedPath();
        this.renderStartPoint();
        this.renderEndPoint();
        // this.renderGrid();
    }

    renderResolvedPath() {
        if (this.aStar.foundTarget) {
            for (let i = 1; i < this.aStar.resolvedPath.length; i++) {
                this.line(this.aStar.resolvedPath[i - 1], this.aStar.resolvedPath[i]);
            }
        }
    }

    renderVisited() {
        for (let i = 0; i < this.aStar.visited.length; i++) {
            const position = this.aStar.visited[i].position;
            this.ctx.fillStyle = "#a9b598";
            this.ctx.beginPath();
            this.ctx.rect(position.x * this.cellSize, position.y * this.cellSize, this.cellSize, this.cellSize);
            this.ctx.fill();
        }
    }

    /**@private */
    renderObstacles() {

        for (const obstacle of this.aStar.obstacles.values()) {
            this.ctx.fillStyle = "#787878";
            this.ctx.beginPath();
            this.ctx.rect(obstacle.x * this.cellSize, obstacle.y * this.cellSize, this.cellSize, this.cellSize);
            this.ctx.fill();
        }
    }

    /**@private */
    renderGrid() {
        for (let i = 1; i < this.columnWidth; i++) {
            this.ctx.strokeStyle = "black";
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize + 0.5, 0);
            this.ctx.lineTo(i * this.cellSize + 0.5, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 1; i < this.rowHeight; i++) {

            this.ctx.strokeStyle = "black";
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize + 0.5);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize + 0.5);
            this.ctx.stroke();
        }
    }

    renderStartPoint() {
        this.ctx.fillStyle = "#32a852";
        this.ctx.beginPath();
        this.ctx.rect(this.aStar.startPoint.x * this.cellSize, this.aStar.startPoint.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.fill();
    }

    renderEndPoint() {
        this.ctx.fillStyle = "#d15a32";
        this.ctx.beginPath();
        this.ctx.rect(this.aStar.endPoint.x * this.cellSize, this.aStar.endPoint.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.fill();
    }

    /**
     * @private
     * @param {MouseEvent} e 
     * @param {boolean} isClick 
     */
    addObstacleToList(e, isClick = false) {
        if (!this.isMouseDown)
            return;

        const pos = new Vector2(Math.floor(e.offsetX / this.cellSize), Math.floor(e.offsetY / this.cellSize));

        if (this.oldPos.equals(pos) && !isClick) {
            return;
        }

        this.oldPos = pos;
        const indexPosition = coordinateToIndex(this.columnWidth, pos);

        if (this.aStar.obstacles.has(indexPosition)) {
            this.aStar.obstacles.delete(indexPosition);
        } else {
            this.aStar.obstacles.set(indexPosition, pos);
        }
    }

    /**
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
    line(a, b) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#ed8cdb";
        this.ctx.moveTo(a.x * this.cellSize + this.cellSize / 2, a.y * this.cellSize + this.cellSize / 2);
        this.ctx.lineTo(b.x * this.cellSize + this.cellSize / 2, b.y * this.cellSize + this.cellSize / 2);
        this.ctx.stroke();
    }
}