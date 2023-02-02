import { GameID } from "./game.model";

export interface FixtureData {
    teamList: any;
    winnerTeam: string;
    gameId: GameID;
    isActive: boolean;
}