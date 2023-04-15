import { IDatabase } from "../../interfaces/database.interface";
import { ApiRespData } from "../../models/api.model";
import { FixtureData } from "../../models/fixture.model";
import { FailCode, FailDetailCode, prepareFailureMsg, prepareSuccessMsg } from "../../utils/api.util";
import { findDuplicates } from "../../utils/util";
import { FixtureService } from "../fixture.service";

export class FixtureApiService {
    #dbSvc: IDatabase;

    constructor(dbSvc: IDatabase) {
        this.#dbSvc = dbSvc;
    }

    async validCreateRequest(req: any): Promise<ApiRespData> {
        // check request
        if (typeof req !== 'object') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Payload isn't an object"

            });
        }

        // check keys
        let keys = ["player_list", "player_count", "team_list", "game"];
        for (const key of keys) {
            if (!req.hasOwnProperty(key)) {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The payload is invalid",
                }, {
                    detailCode: FailDetailCode.REQUIRED_PROPERTY,
                    detailDescription: `Payload object doesn't have '${key}' property!`
                });
            }
        }

        // player list
        const playerList = req.player_list;
        // check if the list is array
        if (!Array.isArray(playerList)) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'player_list' property isn't array"
            });
        }
        // check list length
        if (!playerList.length) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'player_list' property is empty"
            });
        }
        // check if there are duplicate player name
        let duplicatePlayers = findDuplicates(playerList);
        if (duplicatePlayers.length != 0) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.PROPERTY_CHECK,
                detailDescription: `There are duplicate player(s): ${duplicatePlayers}`
            });
        }
        // check each player property
        for (const element of playerList) {
            if (typeof element !== 'string') {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The payload is invalid",
                }, {
                    detailCode: FailDetailCode.REQUIRED_PROPERTY,
                    detailDescription: `The 'player_list' property contains no-string element: ${element}`
                });
            }
            // check if player is valid in database
            try {
                if (!await this.#dbSvc.selectPlayer(element)) {
                    return prepareFailureMsg({
                        failCode: FailCode.VALIDATION_ERROR,
                        failDescription: "The payload is invalid",
                    }, {
                        detailCode: FailDetailCode.PROPERTY_CHECK,
                        detailDescription: `The '${element}' player couldn't found`
                    });
                }
            } catch (error) {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The payload is invalid",
                }, {
                    detailCode: FailDetailCode.PROPERTY_CHECK,
                    detailDescription: `The '${element}' player is invalid`
                });
            }
        }

        // player count
        const playerCnt = req.player_count;
        if (typeof playerCnt !== 'number') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'player_count' property isn't number"
            });
        }

        // team list
        const teamList = req.team_list;
        // check if the list is array
        if (!Array.isArray(teamList)) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'team_list' property isn't array"
            });
        }
        // check list length
        if (!teamList.length) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'team_list' property is empty"
            });
        }
        // check each team property
        for (const element of teamList) {
            if (typeof element !== 'string') {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The payload is invalid",
                }, {
                    detailCode: FailDetailCode.REQUIRED_PROPERTY,
                    detailDescription: `The 'team_list' property contains no-string element: ${element}`
                });
            }
        }

        // game
        const game = req.game;
        if (typeof game !== 'string') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'game' property isn't string"
            });
        }
        // check if game is valid in database
        try {
            if (!await this.#dbSvc.selectGame(game)) {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The payload is invalid",
                }, {
                    detailCode: FailDetailCode.PROPERTY_CHECK,
                    detailDescription: "The 'game' property value is invalid"
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.PROPERTY_CHECK,
                detailDescription: "The 'game' property value is invalid"
            });
        }

        return prepareSuccessMsg({});
    }

    validGetAndDelRequest(id: any): ApiRespData {
        if (id === null || id === undefined) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The query is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Query doesn't have 'id' property"

            });
        }

        if (Number.isNaN(id)) {
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

    async validPutRequest(req: any): Promise<ApiRespData> {
        // check request
        if (typeof req !== 'object') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Payload isn't an object"

            });
        }

        // check keys
        let keys = ["fixture_id", "match_index", "winner"];
        for (const key of keys) {
            if (!req.hasOwnProperty(key)) {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The payload is invalid",
                }, {
                    detailCode: FailDetailCode.REQUIRED_PROPERTY,
                    detailDescription: `Payload object doesn't have '${key}' property!`
                });
            }
        }

        // check fixture ID
        const fixId = req.fixture_id;
        if (typeof fixId !== 'number') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'fixture_id' property isn't number"
            });
        }
        // check if fixture ID is valid in database
        let fixture: FixtureData;
        try {
            fixture = await this.#dbSvc.selectFixture(fixId);
            if (!fixture) {
                return prepareFailureMsg({
                    failCode: FailCode.VALIDATION_ERROR,
                    failDescription: "The payload is invalid",
                }, {
                    detailCode: FailDetailCode.PROPERTY_CHECK,
                    detailDescription: "The 'fixture_id' property value is invalid"
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.PROPERTY_CHECK,
                detailDescription: "The 'fixture_id' property value is invalid"
            });
        }

        // check winner team
        const winner = req.winner;
        if (typeof winner !== 'string') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'winner' property isn't string"
            });
        }

        // check match index
        const matchInd = req.match_index;
        if (typeof matchInd !== 'number') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The 'match_index' property isn't number"
            });
        }
        if (matchInd < 0 || matchInd > fixture.matchInfo.length) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.PROPERTY_CHECK,
                detailDescription: "The 'match_index' property value is invalid"
            });
        }

        // check if match is active
        const match = fixture.matchInfo[matchInd];
        if (!match.isActive) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.PROPERTY_CHECK,
                detailDescription: "The match isn't active"
            });
        }

        // check winner team is valid in match
        if (!Object.keys(match.teamList).includes(winner)) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.PROPERTY_CHECK,
                detailDescription: "The 'winner' property value is invalid"
            });
        }

        return prepareSuccessMsg({});
    }

    async add(req: any): Promise<ApiRespData> {
        let valid = await this.validCreateRequest(req);
        if (valid.failure) return valid;

        const fixSvc = new FixtureService(this.#dbSvc, req.game, req.team_list, req.player_count, req.player_list);
        let rval = await fixSvc.create();
        if (!rval.status) {
            return prepareFailureMsg({
                failCode: FailCode.SERVICE_ERROR,
                failDescription: "Service error"
            }, {
                detailCode: FailDetailCode.SERVICE_RESPONSE,
                detailDescription: rval.failureText
            });
        }

        return prepareSuccessMsg({ data: rval.result });
    }

    async get(query: any): Promise<ApiRespData> {
        if (!Object.keys(query).length) {
            return prepareSuccessMsg({ data: await this.#dbSvc.selectAllFixture() });
        }

        let id = query.id;
        let valid = this.validGetAndDelRequest(id);
        if (valid.failure) return valid;

        let dbResp: FixtureData;
        try {
            id = parseInt(id);
            dbResp = await this.#dbSvc.selectFixture(id);
            if (!dbResp) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Fixture '${id}' couldn't found`,
                }, {
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Fixture '${id}' couldn't found`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({ data: dbResp });
    }

    async update(body: any): Promise<ApiRespData> {
        let valid = await this.validPutRequest(body);
        if (valid.failure) return valid;

        if (!await this.#dbSvc.updateFixture(body.fixture_id, body.match_index, body.winner)) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Fixture '${body.id}' couldn't be updated`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
            });
        }

        return prepareSuccessMsg({ data: `Fixture '${body.fixture_id}' has successfully updated` });
    }

    async del(id: any): Promise<ApiRespData> {
        let valid = this.validGetAndDelRequest(id);
        if (valid.failure) return valid;

        try {
            id = parseInt(id);
            let rval = await this.#dbSvc.deleteFixture(id);
            if (!rval) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Fixture '${id}' couldn't be deleted`,
                }, {
                    detailDescription: "Fixture couldn't found"
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Fixture '${id}' couldn't be deleted`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({ statusCode: 204 });
    }
}