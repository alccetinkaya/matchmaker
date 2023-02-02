export enum GameID {
    FOOSBALL = 1
}

export const GameInfo = [
    { id: GameID.FOOSBALL, name: "Foosball" }
]

export interface GameData {
    name: string;
}