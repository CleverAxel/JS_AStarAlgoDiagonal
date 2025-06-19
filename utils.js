import { Vector2 } from "./vector2.js";

/**
 * @param {number} width 
 * @param {Vector2} coordinate 
 */
export function coordinateToIndex(width, coordinate) {
    return coordinate.y * width + coordinate.x;
}

/**
 * @param {number} width 
 * @param {number} index 
 */
export function indexToCoordinate(width, index) {
    return new Vector2(index % width, Math.floor(index / width));
}

/**
 * @param {Vector2} a 
 * @param {Vector2} b 
 */
export function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * @param {Vector2} current 
 * @param {Vector2} goal 
 */
export function octileDistance(current, goal, D = 1, D2 = 1.4) {
    const dx = Math.abs(current.x - goal.x);
    const dy = Math.abs(current.y - goal.y);

    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
}