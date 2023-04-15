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
    updateFixture(id: number, matchInd: number, winner: string): Promise<FixtureData>;
    deleteFixture(id: number): Promise<boolean>;

    // player interface
    createPlayer(player: PlayerData): Promise<boolean>;
    selectPlayer(name: string): Promise<PlayerData>;
    selectAllPlayer(): Promise<PlayerData[]>;
    deletePlayer(name: string): Promise<boolean>;

    // league interface
    createLeague(data: LeagueInfoData): Promise<boolean>;
    selectLeague(name: string): Promise<LeagueInfoData>;
    selectAllLeague(): Promise<LeagueInfoData[]>;
    updateLeague(data: LeagueInfoData): Promise<LeagueInfoData>;
    deleteLeague(name: string): Promise<boolean>;

    // player league interface
    createPlayerLeague(data: LeagueData): Promise<boolean>;
    selectPlayerLeague(name: string): Promise<LeagueData>;
    selectAllPlayerLeague(): Promise<LeagueData[]>;
    updatePlayerLeague(data: LeagueData): Promise<LeagueData>;
    deletePlayerLeague(name: string): Promise<boolean>;
}