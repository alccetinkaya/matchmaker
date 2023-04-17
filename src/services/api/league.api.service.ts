import { IDatabase } from "../../interfaces/database.interface";
import { ApiRespData } from "../../models/api.model";
import { FixtureData } from "../../models/fixture.model";
import { LeagueData } from "../../models/league.model";
import { FailCode, FailDetailCode, prepareFailureMsg, prepareSuccessMsg } from "../../utils/api.util";

export class LeagueApiService {
    #dbSvc: IDatabase;

    constructor(dbSvc: IDatabase) {
        this.#dbSvc = dbSvc;
    }

    validUpdateRequest(query: any): ApiRespData {
        if (Number.isNaN(query.id)) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The query is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Query 'id' property isn't number"
            });
        }

        return prepareSuccessMsg({});
    }

    async makeDefaultLeague(playerName: string, gameName: string): Promise<LeagueData> {
        let leagues = await this.#dbSvc.selectAllLeagueInfo();
        let defaultLeague = leagues.sort((element1, element2) => element1.point - element2.point).at(0);
        return {
            playerName: playerName,
            point: 0,
            matchCount: 0,
            leagueName: defaultLeague.name,
            gameName: gameName
        };
    }

    async get(query: any) {
        if (!Object.keys(query).length) {
            try {
                return prepareSuccessMsg({ data: await this.#dbSvc.selectAllLeague() });
            } catch (error) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `All leagues couldn't found`,
                    statusCode: 500
                }, {
                    detailCode: FailDetailCode.DATABASE_ERROR,
                    detailDescription: error
                });
            }
        }

        try {
            if (query.hasOwnProperty("name")) {
                let rval = await this.#dbSvc.selectLeagueByName(query.name);
                if (rval == null) {
                    return prepareFailureMsg({
                        failCode: FailCode.OPERATION_ERROR,
                        failDescription: `League name '${query.name}' couldn't found`,
                    }, {});
                }
                return prepareSuccessMsg({ data: rval });
            } else if (query.hasOwnProperty("game")) {
                let rval = await this.#dbSvc.selectLeagueByGame(query.game);
                if (rval == null) {
                    return prepareFailureMsg({
                        failCode: FailCode.OPERATION_ERROR,
                        failDescription: `League game '${query.game}' couldn't found`,
                    }, {});
                }
                return prepareSuccessMsg({ data: rval });
            } else {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The query is invalid",
                }, {
                    detailCode: FailDetailCode.REQUIRED_PROPERTY,
                    detailDescription: "Query needs to include 'name' or 'game' property"

                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `League couldn't found`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }
    }

    async update(query: any): Promise<ApiRespData> {
        try {
            let fixture: FixtureData[] = [];
            if (Object.keys(query).length) {
                let valid = this.validUpdateRequest(query);
                if (valid.failure) return valid;
                fixture.push(await this.#dbSvc.selectFixture(parseInt(query.id)));
            } else {
                fixture = await this.#dbSvc.selectAllFixture();
            }

            if (fixture.length == 0) {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: `There is no any fixture`
                }, {});
            }

            let activeMatches: any[] = [];
            fixture.forEach((element) => {
                for (const [index, match] of element.matchInfo.entries()) {
                    if (match.isActive == true) {
                        activeMatches.push({
                            info: match,
                            fixtureId: element.id,
                            matchIndex: index,
                            gameName: element.gameName
                        });
                    }
                }
            });
            if (!activeMatches.length) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `There is no any active match`,
                }, {});
            }

            for (const activeMatch of activeMatches) {
                const match = activeMatch.info;
                const gameName = activeMatch.gameName;

                // check winner team name
                let teams = Object.keys(match.teamList);
                let winningTeam = match.winner;
                if (!teams.includes(winningTeam)) {
                    continue;
                }

                // get winning players
                let winningPlayerNames = [];
                for (const team of teams) {
                    if (team == winningTeam) {
                        winningPlayerNames.push(...match.teamList[team]);
                        break;
                    }
                }
                let winningPlayers: LeagueData[] = [];
                for (const playerName of winningPlayerNames) {
                    let league = await this.#dbSvc.selectLeagueByName(playerName);
                    if (league == null) {
                        winningPlayers.push(await this.makeDefaultLeague(playerName, gameName));
                    } else {
                        winningPlayers.push(league);
                    }
                }

                // get losing players
                let losingPlayerNames = [];
                teams.forEach(element => {
                    if (element === winningTeam) {
                        return;
                    }
                    losingPlayerNames.push(...match.teamList[element]);
                });
                let losingPlayers: LeagueData[] = [];
                for (const playerName of losingPlayerNames) {
                    let league = await this.#dbSvc.selectLeagueByName(playerName);
                    if (league == null) {
                        losingPlayers.push(await this.makeDefaultLeague(playerName, gameName));
                    } else {
                        losingPlayers.push(league);
                    }
                }

                // calculate the win points for the winners
                let winPoint = 0;
                for (const losingPlayer of losingPlayers) {
                    let league = await this.#dbSvc.selectLeagueInfo(losingPlayer.leagueName);
                    if (league != null) {
                        winPoint += league.point;
                    }
                }
                winPoint = winPoint / losingPlayers.length;

                // increase match count and add winpoints to winning players
                winningPlayers.map((element) => {
                    element.matchCount = element.matchCount + 1;
                    element.point = element.point + winPoint;
                });
                // increase match count losing players
                losingPlayers.map((element) => {
                    element.matchCount = element.matchCount + 1;
                });

                // update winning and losing players
                winningPlayers.forEach(async (element) => {
                    if (element.matchCount == 1) {
                        await this.#dbSvc.createLeague(element);
                    } else {
                        await this.#dbSvc.updateLeague(element)
                    }
                });
                losingPlayers.forEach(async (element) => {
                    if (element.matchCount == 1) {
                        await this.#dbSvc.createLeague(element);
                    } else {
                        await this.#dbSvc.updateLeague(element)
                    }
                });

                // update match as not active anymore
                await this.#dbSvc.updateFixtureByActive(activeMatch.fixtureId, activeMatch.matchIndex, false);
            }

            return prepareSuccessMsg({ data: await this.#dbSvc.selectAllLeague() });
        } catch (error) {
            let errMsg = error.hasOwnProperty("message") ? error.message : error;
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `League couldn't be updated`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: errMsg
            });
        }
    }
}