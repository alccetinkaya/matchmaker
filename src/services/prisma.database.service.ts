import { IDatabase } from "../interfaces/database.interface";
import { UserData } from "../models/user.model";
import { PrismaClient, Prisma } from '@prisma/client'
import { GameData } from "../models/game.model";
import { FixtureData } from "../models/fixture.model";
import { PlayerData } from "../models/player.model";
import { LeagueData, LeagueInfoData } from "../models/league.model";

const prisma = new PrismaClient()

export class PrismaDatabaseService implements IDatabase {
    async createGame(game: GameData): Promise<boolean> {
        try {
            let rval = await prisma.game_info.create({
                data: {
                    name: game.name
                }
            });
            return rval ? true : false;
        } catch (error) {
            console.log(`Database service create game failed: ${error.message}`);
            throw error.message;
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
            if (rval.length > 1) throw new Error(`Select game returned more than one! Name: ${name}`);

            let result = rval.at(0);
            return {
                name: result.name
            }
        } catch (error) {
            console.log(`Database service select game failed: ${error.message}`);
            throw error.message;
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
            console.log(`Database service delete game failed: ${error.message}`);
            throw error.message;
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
            console.log(`Database service create user failed: ${error.message}`);
            throw error.message;
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
            if (rval.length > 1) throw new Error(`Select user returned more than one! Email: ${email}`);

            let result = rval.at(0);
            return {
                firstName: result.first_name,
                lastName: result.last_name,
                email: result.email,
                password: result.password,
                role: result.role
            }
        } catch (error) {
            console.log(`Database service select user failed: ${error.message}`);
            throw error.message;
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
            console.log(`Database service delete user failed: ${error.message}`);
            throw error.message;
        }
    }

    async createFixture(fixture: FixtureData): Promise<number> {
        try {
            let rval = await prisma.fixture.create({
                data: {
                    team_list: fixture.teamList,
                    game_id: fixture.gameId,
                    is_active: fixture.isActive
                }
            });
            return rval ? rval.id : 0;
        } catch (error) {
            console.log(`Database service create fixture failed: ${error.message}`);
            throw error.message;
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
            if (rval.length > 1) throw new Error(`Select fixture returned more than one! ID: ${id}`);

            let fixture = rval.at(0);
            return {
                teamList: fixture.team_list,
                winnerTeam: fixture.winner_team,
                gameId: fixture.game_id,
                isActive: fixture.is_active
            }
        } catch (error) {
            console.log(`Database service select fixture failed: ${error.message}`);
            throw error.message;
        }
    }

    async updateFixture(id: number, fixture: FixtureData): Promise<FixtureData> {
        try {
            let rval = await prisma.fixture.update({
                where: {
                    id: id
                },
                data: {
                    winner_team: fixture.winnerTeam,
                    is_active: fixture.isActive
                }
            });

            return {
                teamList: rval.team_list,
                winnerTeam: rval.winner_team,
                gameId: rval.game_id,
                isActive: rval.is_active
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
            console.log(`Database service delete fixture failed: ${error.message}`);
            throw error.message;
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
            console.log(`Database service create player failed: ${error.message}`);
            throw error.message;
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
            if (rval.length > 1) throw new Error(`Select player returned more than one! Name: ${name}`);

            let result = rval.at(0);
            return {
                name: result.name
            }
        } catch (error) {
            console.log(`Database service select player failed: ${error.message}`);
            throw error.message;
        }
    }

    async deletePlayer(player: PlayerData): Promise<boolean> {
        try {
            const rval = await prisma.player_list.deleteMany({
                where: {
                    name: player.name
                }
            });
            return rval.count ? true : false;
        } catch (error) {
            console.log(`Database service delete player failed: ${error.message}`);
            throw error.message;
        }
    }

    async createLeague(data: LeagueInfoData): Promise<boolean> {
        try {
            let rval = await prisma.league_info.create({
                data: {
                    id: data.id,
                    name: data.name,
                    point: data.point
                }
            });
            return rval ? true : false;
        } catch (error) {
            console.log(`Database service create league failed: ${error.message}`);
            throw error.message;
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
            if (rval.length > 1) throw new Error(`Select league returned more than one! Name: ${name}`);

            let result = rval.at(0);
            return {
                id: result.id,
                name: result.name,
                point: result.point
            }
        } catch (error) {
            console.log(`Database service select league failed: ${error.message}`);
            throw error.message;
        }
    }

    async updateLeague(data: LeagueInfoData): Promise<LeagueInfoData> {
        try {
            let rval = await prisma.league_info.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name,
                    point: data.point,
                }
            });

            return {
                id: rval.id,
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
            console.log(`Database service delete league failed: ${error.message}`);
            throw error.message;
        }
    }

    async createPlayerLeague(data: LeagueData): Promise<boolean> {
        try {
            let rval = await prisma.league.create({
                data: {
                    player_name: data.playerName,
                    point: data.point,
                    match_count: data.matchCount,
                    game_id: data.gameId,
                    league_id: data.leagueId
                }
            });
            return rval ? true : false;
        } catch (error) {
            console.log(`Database service create player league failed: ${error.message}`);
            throw error.message;
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
            if (rval.length > 1) throw new Error(`Select player league returned more than one! Name: ${name}`);

            let result = rval.at(0);
            return {
                playerName: result.player_name,
                point: result.point,
                matchCount: result.match_count,
                leagueId: result.league_id,
                gameId: result.game_id
            }
        } catch (error) {
            console.log(`Database service select player league failed: ${error.message}`);
            throw error.message;
        }
    }

    async updatePlayerLeague(data: LeagueData): Promise<LeagueData> {
        try {
            let rval = await prisma.league.update({
                where: {
                    player_name_game_id: {
                        player_name: data.playerName,
                        game_id: data.gameId
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
                leagueId: rval.league_id,
                gameId: rval.game_id
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
            console.log(`Database service delete player league failed: ${error.message}`);
            throw error.message;
        }
    }
} 