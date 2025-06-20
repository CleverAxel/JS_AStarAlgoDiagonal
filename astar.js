import { MinBinaryHeap } from "./MinBinaryHeap.js";
import { coordinateToIndex, octileDistance } from "./utils.js";
import { Vector2 } from "./vector2.js";

export class AStarNode {
    constructor() {
        /**distance from starting node - calculated cost 1 up down left right & 1.4 in diagonal */
        this.gCost = 0;

        /**distance from end node - calculated with the manhattan/octile distance */
        this.hCost = 0;

        /**G cost + H cost */
        this.fCost = 0;

        /**index position on the grid */
        this.position = new Vector2(0, 0);

        /**@type {AStarNode|null} */
        this.parent = null;
    }

    /**
     * @param {number} displacementCost 
     * @param {Vector2} endPoint 
     */
    calculateCost(displacementCost, endPoint) {
        this.hCost = octileDistance(this.position, endPoint);

        if (this.parent == null) {
            throw new Error("unable to calculate g cost, the parent is null");
        }

        this.gCost = this.parent.gCost + displacementCost;
        this.fCost = this.hCost + this.gCost;
    }
}

export class AStar {
    constructor() {
        /**@type {Vector2[]} */
        this.obstacles = [];

        this.startPoint = new Vector2(30, 15);
        this.endPoint = new Vector2(3, 3);

        this.openList = new MinBinaryHeap();

        /**@type {Map<number, AStarNode>} */
        this.openListLookUp = new Map();

        /**@type {Set<number>} */
        this.closedList = new Set();

        /**@type {Vector2[]} */
        this.visited = [];

        this.upOffset = new Vector2(0, -1);
        this.downOffset = new Vector2(0, 1);
        this.leftOffset = new Vector2(-1, 0);
        this.rightOffset = new Vector2(1, 0);

        this.downLeftOffset = new Vector2(-1, 1);
        this.upLeftOffset = new Vector2(-1, -1);
        this.downRightOffset = new Vector2(1, 1);
        this.upRightOffset = new Vector2(1, -1);

        this.foundTarget = false;

        this.columnWidth = 0;
        this.rowHeight = 0;

        /**@type {AStarNode|null} only used to trace back the path if the target is found*/
        this.currentNode = null;

        /**@type {Vector2[]} */
        this.resolvedPath = []
    }

    /**
     * @param {number} displacementCost 
     * @param {Vector2} newPosition 
     * @param {AStarNode} currentNode 
     */
    checkOffset(displacementCost, newPosition, currentNode) {
        const indexPosition = coordinateToIndex(this.columnWidth, newPosition);
        if (this.isInBounds(newPosition) && !this.closedList.has(indexPosition)) {
            if (this.obstacles.find((p) => p.equals(newPosition))) {
                return true;
            }

            const isInOpenList = this.openListLookUp.get(indexPosition);
            if (isInOpenList) {
                const gCost = isInOpenList.gCost;
                if (currentNode.gCost + displacementCost < gCost) {
                    isInOpenList.parent = currentNode;
                    isInOpenList.calculateCost(displacementCost, this.endPoint);
                }
            } else {
                const newNode = new AStarNode();
                newNode.position = newPosition.clone();
                newNode.parent = currentNode;
                newNode.calculateCost(displacementCost, this.endPoint);
                this.openList.push(newNode);
                this.openListLookUp.set(indexPosition, newNode);
            }

            return false;

        }

        return true;
    }

    reset() {
        this.openList.heap = [];
        this.closedList.clear();
        this.openListLookUp.clear();
        this.foundTarget = false;
        this.currentNode = null;
        this.resolvedPath = []

        const newNode = new AStarNode();
        newNode.position = this.startPoint.clone();

        this.openListLookUp.set(coordinateToIndex(this.columnWidth, newNode.position), newNode);
        this.openList.push(newNode);
    }

    scan() {
        // reset called by the start button to not "falsify" the brut performance of the pathfinding algorithm
        // this.reset();
        while (!this.foundTarget) {
            const currentNode = this.getLowestNode();

            if (!currentNode) {
                console.warn("Target not found");
                break;
            }
            this.currentNode = currentNode;

            this.closedList.add(coordinateToIndex(this.columnWidth, currentNode.position));

            let upBlocked = false;
            let downBlocked = false;
            let rightBlocked = false;
            let leftBlocked = false;

            const normalCost = 1;
            const diagonalCost = 1.4;

            // Up
            let newPosition = new Vector2(this.upOffset.x + currentNode.position.x, this.upOffset.y + currentNode.position.y);
            if (newPosition.equals(this.endPoint)) {
                this.setResolvedPath();
                return;
            }
            upBlocked = this.checkOffset(normalCost, newPosition, currentNode);

            // Down
            newPosition.x = this.downOffset.x + currentNode.position.x;
            newPosition.y = this.downOffset.y + currentNode.position.y;
            if (newPosition.equals(this.endPoint)) {
                this.setResolvedPath();
                return;
            }
            downBlocked = this.checkOffset(normalCost, newPosition, currentNode);

            // Left
            newPosition.x = this.leftOffset.x + currentNode.position.x;
            newPosition.y = this.leftOffset.y + currentNode.position.y;
            if (newPosition.equals(this.endPoint)) {
                this.setResolvedPath();
                return;
            }
            leftBlocked = this.checkOffset(normalCost, newPosition, currentNode);

            // Right
            newPosition.x = this.rightOffset.x + currentNode.position.x;
            newPosition.y = this.rightOffset.y + currentNode.position.y;
            if (newPosition.equals(this.endPoint)) {
                this.setResolvedPath();
                return;
            }
            rightBlocked = this.checkOffset(normalCost, newPosition, currentNode);


            // Diagonal: Up-Right
            if (!upBlocked || !rightBlocked) {
                newPosition.x = this.upRightOffset.x + currentNode.position.x;
                newPosition.y = this.upRightOffset.y + currentNode.position.y;
                if (newPosition.equals(this.endPoint)) {
                    this.setResolvedPath();
                    return;
                }
                this.checkOffset(diagonalCost, newPosition, currentNode);
            }

            // Diagonal: Up-Left
            if (!upBlocked || !leftBlocked) {
                newPosition.x = this.upLeftOffset.x + currentNode.position.x;
                newPosition.y = this.upLeftOffset.y + currentNode.position.y;
                if (newPosition.equals(this.endPoint)) {
                    this.setResolvedPath();
                    return;
                }
                this.checkOffset(diagonalCost, newPosition, currentNode);
            }

            // Diagonal: Down-Right
            if (!downBlocked || !rightBlocked) {
                newPosition.x = this.downRightOffset.x + currentNode.position.x;
                newPosition.y = this.downRightOffset.y + currentNode.position.y;
                if (newPosition.equals(this.endPoint)) {
                    this.setResolvedPath();
                    return;
                }
                this.checkOffset(diagonalCost, newPosition, currentNode);
            }

            // Diagonal: Down-Left
            if (!downBlocked || !leftBlocked) {
                newPosition.x = this.downLeftOffset.x + currentNode.position.x;
                newPosition.y = this.downLeftOffset.y + currentNode.position.y;
                if (newPosition.equals(this.endPoint)) {
                    this.setResolvedPath();
                    return;
                }
                this.checkOffset(diagonalCost, newPosition, currentNode);
            }
        }
    }

    setResolvedPath() {
        // console.log("found target");

        this.foundTarget = true;
        while (this.currentNode != null && !this.currentNode.position.equals(this.startPoint)) {
            this.resolvedPath.push(this.currentNode.position.clone());
            this.currentNode = this.currentNode.parent;
        }

    }

    getLowestNode() {
        return this.openList.pop();
    }

    /**@param {Vector2} position  */
    isInBounds(position) {
        return position.x >= 0 && position.x < this.columnWidth && position.y >= 0 && position.y < this.rowHeight;
    }

    /**@param {Vector2} position  */
    isInClosedList(position) {
        for (let i = 0; i < this.closedList.length; i++) {
            if (this.closedList[i].position.equals(position)) {
                return true;
            }
        }

        return false;
    }
}