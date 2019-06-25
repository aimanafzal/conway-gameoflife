import { Game } from "./game";
import { EventEmitter } from "events";
import { Cell, Point } from "../models";

declare interface IGameEvents {
    on(event: 'update', listener: (state: Game) => void): this;
    on(event: 'refresh', listener: () => void): this;
    on(event: 'stop', listener: () => void): this;
    on(event: 'setcell', listener: (cell: Cell, isAlive: boolean) => void): this;
    on(event: 'drawcells', listener: (color: string, cells: Point[]) => void): this;
}

/**
 * Handles changes in Game State 
 */
export class GameEvents extends EventEmitter implements IGameEvents {
    
    private _game = new Game(); // current state
    private _interval = setInterval(() => this.tick(), 1000);

    constructor() {
        super();
        this.on('setcell', this.setCell);
        this.on('drawcells', this.drawCells);
        this.on('refresh', this.refresh);
    }

    private setCell(cell: Cell, isAlive: boolean) {
        this._game = this._game.setCell(cell, isAlive);
    }

    private drawCells(color: string, cells: Point[]) {
        console.log({color, cells});
        this._game = this._game.drawCells(color, cells);
    }

    stop() {
        clearInterval(this._interval);
        this.emit('stop');
    }

    private refresh() {
        this.emit('update', this._game.world);
    }

    private tick() {
        this._game = this._game.tick();
        this.refresh();
    }
}
