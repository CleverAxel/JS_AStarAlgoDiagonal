import { Grid } from "./grid.js";
import { MinBinaryHeap } from "./MinBinaryHeap.js";
import { octileDistance } from "./utils.js";
import { Vector2 } from "./vector2.js";

const CELL_DIMENSION = 20;
const COLUMN_LENGTH = 50;
const ROW_LENGTH = 25;

const _CANVAS = document.querySelector("canvas");
const CTX = _CANVAS.getContext("2d");
const GRID = new Grid(COLUMN_LENGTH, ROW_LENGTH, CELL_DIMENSION, _CANVAS);

document.querySelector("button").addEventListener("click", () => {
    GRID.aStar.reset();
    const now = performance.now();
    GRID.aStar.scan();

    console.log(performance.now() - now);
    
    
})

function render() {
    CTX.clearRect(0, 0, _CANVAS.width, _CANVAS.height);
    GRID.render();
    requestAnimationFrame(render);
}

// const set = new Set();
requestAnimationFrame(render);

