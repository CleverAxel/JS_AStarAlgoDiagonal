import { Grid } from "./grid.js";
import { octileDistance } from "./utils.js";
import { Vector2 } from "./vector2.js";

const CELL_DIMENSION = 30;
const COLUMN_LENGTH = 25;
const ROW_LENGTH = 25;

const _CANVAS = document.querySelector("canvas");
const CTX = _CANVAS.getContext("2d");
const GRID = new Grid(COLUMN_LENGTH, ROW_LENGTH, CELL_DIMENSION, _CANVAS);

document.querySelector("button").addEventListener("click", () => {
    const now = performance.now();
    GRID.aStar.scan();
    const after = performance.now();
    console.log(after - now);
    
})

function render() {
    CTX.clearRect(0, 0, _CANVAS.width, _CANVAS.height);
    GRID.render();
    requestAnimationFrame(render);
}



requestAnimationFrame(render);

