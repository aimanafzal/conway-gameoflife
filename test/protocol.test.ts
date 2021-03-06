import { serializeMessage, deserializeMessage, readColor, writeColor } from "../common/protocol";
import { UpdateMessage, MessageType, World, SetCellMessage, Message, ColorMessage, NewColorMessage, PlayerCountMessage, DrawCellsMessage } from "../models";

const color = '#FFEEDD';

// glider
const world: World = [
    {x: 1, y: 0, color},
    {x: 2, y: 1, color},
    {x: 0, y: 2, color}, 
    {x: 1, y: 2, color},
    {x: 2, y: 2, color}
];

const serializeDeserialize = <T extends Message>(message: T) => {
    const data = serializeMessage(message);
    expect(data.length).toBeGreaterThan(0);
    const result = deserializeMessage(data);
    expect(result).toEqual(message);
};

describe('protocol', () => {
    test('Update', () => serializeDeserialize<UpdateMessage>({
        type: MessageType.Update,
        world
    }));
    test('SetCell', () => serializeDeserialize<SetCellMessage>({
        type: MessageType.SetCell,
        alive: true,
        cell: world[0]
    }));
    test('Color', () => serializeDeserialize<ColorMessage>({
        type: MessageType.Color,
        color
    }));
    test('NewColor', () => serializeDeserialize<NewColorMessage>({
        type: MessageType.NewColor
    }));
    test('PlayerCount', () => serializeDeserialize<PlayerCountMessage>({
        type: MessageType.PlayerCount,
        count: 5
    }));
    test('DrawCells', () => serializeDeserialize<DrawCellsMessage>({
        type: MessageType.DrawCells,
        color,
        cells: world.map(({x,y}) => ({ x, y }))
    }));
    test('writeReadColor', () => {
        const buffer = Buffer.alloc(12);
        writeColor(buffer, 0, color);
        const result = readColor(buffer, 0);
        expect(result).toEqual(color);
    });
});