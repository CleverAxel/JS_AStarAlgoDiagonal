import { Grid } from "./grid.js";
import { MinBinaryHeap } from "./MinBinaryHeap.js";
import { octileDistance } from "./utils.js";
import { Vector2 } from "./vector2.js";

const CELL_DIMENSION = 20;
const COLUMN_LENGTH = 40;
const ROW_LENGTH = 30;

const _CANVAS = document.querySelector("canvas");
const FPS_COUNTER = document.querySelector("#fps_counter");
const CTX = _CANVAS.getContext("2d");
const GRID = new Grid(COLUMN_LENGTH, ROW_LENGTH, CELL_DIMENSION, _CANVAS);

document.querySelector("button").addEventListener("click", () => {
    GRID.aStar.reset();
    const now = performance.now();
    GRID.aStar.scan();

    console.log(performance.now() - now);


})

let endTick = performance.now();
let timer = 0;
const timerLimit = 150;
function render(startTick) {
    const elapsed = startTick - endTick;
    const dT = elapsed / 1000;
    endTick = startTick;
    timer += elapsed;
    FPS_COUNTER.textContent = `${Math.floor(1 / dT)}`;

    CTX.clearRect(0, 0, _CANVAS.width, _CANVAS.height);

    // if(timer >= timerLimit) {
    //     timer -= timerLimit;
    // GRID.aStar.reset();
    // GRID.aStar.scan();
    // }
    GRID.render();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

