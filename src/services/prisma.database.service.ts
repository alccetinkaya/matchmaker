import { IDatabase } from "../interfaces/database.interface";
import { UserData } from "../models/user.model";
import { PrismaClient, Prisma } from '@prisma/client'
import { GameData } from "../models/game.model";
import { FixtureData, FixtureMatchInfo } from "../models/fixture.model";
import { PlayerData } from "../models/player.model";
import { LeagueData, LeagueInfoData } from "../models/league.model";

const prisma = new PrismaClient()

export class PrismaDatabaseService implements IDatabase {
    getErrorMessage(error: any): string {
        let data = error.message.split("\n");
        return data[data.length - 1];
    }

    async createGame(game: GameData): Promise<boolean> {
        try {
            let rval = await prisma.game_info.create({
                data: {
                    name: game.name
                }
            });
            return rval ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async selectGame(name: string): Promise<GameData> {
        try {
            let rval = await prisma.game_info.findMany({
                where: {
                    name: name
                }
            });
            if (rval.length == 0) return null;
            if (rval.length > 1) throw `Select game returned more than one! Name: ${name}`;

            let result = rval.at(0);
            return {
                name: result.name
            }
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async deleteGame(name: string): Promise<boolean> {
        try {
            const rval = await prisma.game_info.deleteMany({
                where: {
                    name: name
                }
            });
            return rval.count ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async createUser(user: UserData): Promise<boolean> {
        try {
            const rval = await prisma.user_info.create({
                data: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    password: user.password,
                    role: user.role
                }
            });
            return rval ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async selectUser(email: string): Promise<UserData> {
        try {
            let rval = await prisma.user_info.findMany({
                where: {
                    email: email
                }
            });

            if (rval.length == 0) return null;
            if (rval.length > 1) throw `Select user returned more than one! Email: ${email}`;

            let result = rval.at(0);
            return {
                firstName: result.first_name,
                lastName: result.last_name,
                email: result.email,
                password: result.password,
                role: result.role
            }
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async deleteUser(email: string): Promise<boolean> {
        try {
            const rval = await prisma.user_info.deleteMany({
                where: {
                    email: email
                }
            });
            return rval.count ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async createFixture(fixture: FixtureData): Promise<number> {
        try {
            let rval = await prisma.fixture.create({
                data: {
                    match_info: (fixture.matchInfo as unknown) as Prisma.JsonArray,
                    game_name: fixture.gameName,
                }
            });
            return rval ? rval.id : 0;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async selectFixture(id: number): Promise<FixtureData> {
        try {
            let rval = await prisma.fixture.findMany({
                where: {
                    id: id
                }
            });

            if (rval.length == 0) return null;
            if (rval.length > 1) throw `Select fixture returned more than one! ID: ${id}`;

            let fixture = rval.at(0);
            return {
                matchInfo: (fixture.match_info as unknown) as FixtureMatchInfo[],
                gameName: fixture.game_name,
            }
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async updateFixture(id: number, matchInd: number, winner: string): Promise<FixtureData> {
        try {
            let fixture = await this.selectFixture(id);
            fixture.matchInfo[matchInd].winner = winner;

            let rval = await prisma.fixture.update({
                where: {
                    id: id
                },
                data: {
                    match_info: (fixture.matchInfo as unknown) as Prisma.JsonArray
                }
            });

            return {
                matchInfo: (rval.match_info as unknown) as FixtureMatchInfo[],
                gameName: rval.game_name,
            }
        } catch (error) {
            return null;
        }
    }

    async deleteFixture(id: number): Promise<boolean> {
        try {
            const rval = await prisma.fixture.deleteMany({
                where: {
                    id: id
                }
            });
            return rval.count ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async createPlayer(player: PlayerData): Promise<boolean> {
        try {
            let rval = await prisma.player_list.create({
                data: {
                    name: player.name
                }
            });
            return rval ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async selectPlayer(name: string): Promise<PlayerData> {
        try {
            let rval = await prisma.player_list.findMany({
                where: {
                    name: name
                }
            });

            if (rval.length == 0) return null;
            if (rval.length > 1) throw `Select player returned more than one! Name: ${name}`;

            let result = rval.at(0);
            return {
                name: result.name
            }
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async selectAllPlayer(): Promise<PlayerData[]> {
        try {
            return await prisma.player_list.findMany();
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async deletePlayer(name: string): Promise<boolean> {
        try {
            const rval = await prisma.player_list.deleteMany({
                where: {
                    name: name
                }
            });
            return rval.count ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async createLeague(data: LeagueInfoData): Promise<boolean> {
        try {
            let rval = await prisma.league_info.create({
                data: {
                    name: data.name,
                    point: data.point
                }
            });
            return rval ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async selectLeague(name: string): Promise<LeagueInfoData> {
        try {
            let rval = await prisma.league_info.findMany({
                where: {
                    name: name
                }
            });

            if (rval.length == 0) return null;
            if (rval.length > 1) throw `Select league returned more than one! Name: ${name}`;

            let result = rval.at(0);
            return {
                name: result.name,
                point: result.point
            }
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async updateLeague(data: LeagueInfoData): Promise<LeagueInfoData> {
        try {
            let rval = await prisma.league_info.update({
                where: {
                    name: data.name
                },
                data: {
                    point: data.point,
                }
            });

            return {
                name: rval.name,
                point: rval.point
            }
        } catch (error) {
            return null;
        }
    }

    async deleteLeague(name: string): Promise<boolean> {
        try {
            const rval = await prisma.league_info.deleteMany({
                where: {
                    name: name
                }
            });
            return rval.count ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async createPlayerLeague(data: LeagueData): Promise<boolean> {
        try {
            let rval = await prisma.league.create({
                data: {
                    player_name: data.playerName,
                    point: data.point,
                    match_count: data.matchCount,
                    game_name: data.gameName,
                    league_name: data.leagueName
                }
            });
            return rval ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async selectPlayerLeague(name: string): Promise<LeagueData> {
        try {
            let rval = await prisma.league.findMany({
                where: {
                    player_name: name
                }
            });

            if (rval.length == 0) return null;
            if (rval.length > 1) throw `Select player league returned more than one! Name: ${name}`;

            let result = rval.at(0);
            return {
                playerName: result.player_name,
                point: result.point,
                matchCount: result.match_count,
                leagueName: result.league_name,
                gameName: result.game_name
            }
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }

    async updatePlayerLeague(data: LeagueData): Promise<LeagueData> {
        try {
            let rval = await prisma.league.update({
                where: {
                    player_name_game_name: {
                        player_name: data.playerName,
                        game_name: data.gameName
                    }
                },
                data: {
                    point: data.point,
                    match_count: data.matchCount
                }
            });

            return {
                playerName: rval.player_name,
                point: rval.point,
                matchCount: rval.match_count,
                leagueName: rval.league_name,
                gameName: rval.game_name
            }
        } catch (error) {
            return null;
        }
    }

    async deletePlayerLeague(name: string): Promise<boolean> {
        try {
            const rval = await prisma.league.deleteMany({
                where: {
                    player_name: name
                }
            });
            return rval.count ? true : false;
        } catch (error) {
            throw this.getErrorMessage(error);
        }
    }
} 