import { Cell, World, WorldLookup, Point, ColorRanking } from "../models";

export const MAX_X = 24;
export const MAX_Y = 24;

/**
 * Creates a lookup of living Cells by location
 * @param world 
 */
export function createLookup(world: World): WorldLookup {
    const set = new Map<string, Cell>(world.map(c => [encode(c), c]));
    return (p) => set.get(encode(p));
}

/**
 * Returns the String representation of a Point.
 */
export const encode = (cell: Point) => `${cell.x},${cell.y}`;

/**
 * Iterates through all Cells in the World
 */
export function *cells(world: World): IterableIterator<Point> {
    let {min, max} = range(world);
    for (let x = min.x; x <= max.x; ++x) {
        for (let y = min.y; y <= max.y; ++y) {
            yield {x, y};
        }
    }
}

/**
 * Reduces the World state into the minimum and maximum known cooridnates of living Cells.
 */
export function range(world: World): { min: Point, max: Point } {

    // aggregate min and max coordinates
    let {min, max} = world.reduce(({min, max}, cell) => ({ 
        min: { x: cell.x < min.x ? cell.x : min.x, y: cell.y < min.y ? cell.y : min.y },
        max: { x: cell.x > max.x ? cell.x : max.x, y: cell.y > max.y ? cell.y : max.y }
    }), { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } });

    // expand the edge of the world by 1 cell, this lets us detect dead cells on the edge
    min.x--;
    min.y--;
    max.x++;
    max.y++;

    return {min, max};
}

/**
 * Returns a string representation of a World grid.
 */
export function stringify(world: World, lookup: WorldLookup = createLookup(world)) {
    const {min, max} = range(world);
    const stringBuilder: string[] = [];
    for (let x = min.x; x <= max.x; ++x) {
        for (let y = min.y; y <= max.y; ++y) {
            stringBuilder.push((typeof lookup({x, y}) !== 'undefined') ? ' ⬛ ' : ' ⬜ ');
        }
        stringBuilder.push('\n');
    }
    return stringBuilder.join('');
}

/**
 * Returns a Boolean array representation of the World grid.
 */
export function toArray(world: World, lookup: WorldLookup = createLookup(world)): boolean[][] {
    const {min, max} = range(world);
    const grid: boolean[][] = [];
    for (let y = min.y; y <= max.y; ++y) {
        const row: boolean[] = [];
        for (let x = min.x; x <= max.x; ++x) {
            row.push(typeof lookup({x, y}) !== 'undefined');
        }
        grid.push(row);
    }
    return grid;
}

/**
 * Looks up a list of adjacent Cells
 */
export function lookupNeighbors(cell: Point, lookup: WorldLookup): Cell[] {
    const neighbors: Point[] = [
        { x: cell.x-1, y: cell.y-1 },   // top left
        { x: cell.x, y: cell.y-1 },     // top center
        { x: cell.x+1, y: cell.y-1 },   // top right
        { x: cell.x-1, y: cell.y },     // left
        { x: cell.x+1, y: cell.y },     // right
        { x: cell.x-1, y: cell.y+1 },   // bottom left
        { x: cell.x, y: cell.y+1 },     // bottom center
        { x: cell.x+1, y: cell.y+1 }    // bottom right
    ];
    return neighbors.map(lookup).filter(c => typeof c !== 'undefined').map(c => c as Cell);
}

/**
 * Adds or removes a Cell from the World 
 * @param world 
 * @param cell 
 * @param alive 
 */
export const setCell = (world: World, cell: Cell, alive: boolean) => 
    alive
        ? [...world, cell]
        : [...world].filter(({x, y}) => x !== cell.x || y !== cell.y);

/**
 * Adds Cells to the World
 * @param world 
 * @param cells 
 */
export const setCells = (world: World, cells: ReadonlyArray<Cell>): World => {
    const cellsLookup = createLookup(cells);
    return [...world.filter(cell => typeof cellsLookup(cell) === 'undefined'), ...cells];
};