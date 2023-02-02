import { GameID } from "./game.model";

export enum LeagueID {
    PREMIER = 1,
    BAL,
    ASKO_KUSKO
}

export interface LeagueInfoData {
    id: number;
    name: string;
    point: number;
}

export interface LeagueData {
    playerName: string,
    point: number,
    matchCount: number,
    leagueId: LeagueID,
    gameId: GameID
}