import { FixtureData } from "../models/fixture.model";
import { GameData } from "../models/game.model";
import { LeagueData, LeagueInfoData } from "../models/league.model";
import { PlayerData } from "../models/player.model";
import { UserData } from "../models/user.model";

export interface IDatabase {
    // game interface
    createGame(game: GameData): Promise<boolean>;
    selectGame(name: string): Promise<GameData>;
    selectAllGame(): Promise<GameData[]>;
    deleteGame(name: string): Promise<boolean>;

    // user interface
    createUser(user: UserData): Promise<boolean>;
    selectUser(email: string): Promise<UserData>;
    selectAllUser(): Promise<UserData[]>;
    deleteUser(email: string): Promise<boolean>;

    // fixture interface
    createFixture(fixture: FixtureData): Promise<number>;
    selectFixture(id: number): Promise<FixtureData>;
    selectAllFixture(): Promise<FixtureData[]>;
    updateFixtureByWinner(id: number, matchInd: number, winner: string): Promise<FixtureData>;
    updateFixtureByActive(id: number, matchInd: number, active: boolean): Promise<FixtureData>;
    deleteFixture(id: number): Promise<boolean>;

    // player interface
    createPlayer(player: PlayerData): Promise<boolean>;
    selectPlayer(name: string): Promise<PlayerData>;
    selectAllPlayer(): Promise<PlayerData[]>;
    deletePlayer(name: string): Promise<boolean>;

    // league info interface
    createLeagueInfo(data: LeagueInfoData): Promise<boolean>;
    selectLeagueInfo(name: string): Promise<LeagueInfoData>;
    selectAllLeagueInfo(): Promise<LeagueInfoData[]>;
    updateLeagueInfo(data: LeagueInfoData): Promise<LeagueInfoData>;
    deleteLeagueInfo(name: string): Promise<boolean>;

    // league interface
    createLeague(data: LeagueData): Promise<boolean>;
    selectLeagueByName(name: string): Promise<LeagueData>;
    selectLeagueByGame(name: string): Promise<LeagueData[]>;
    selectAllLeague(): Promise<LeagueData[]>;
    updateLeague(data: LeagueData): Promise<LeagueData>;
    deleteLeague(name: string): Promise<boolean>;
}