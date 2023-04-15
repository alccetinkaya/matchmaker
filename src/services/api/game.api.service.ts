import { IDatabase } from "../../interfaces/database.interface";
import { ApiRespData } from "../../models/api.model";
import { GameData } from "../../models/game.model";
import { FailCode, FailDetailCode, prepareFailureMsg, prepareSuccessMsg } from "../../utils/api.util";

export class GameApiService {
    #dbSvc: IDatabase;

    constructor(dbSvc: IDatabase) {
        this.#dbSvc = dbSvc;
    }

    validAddRequest(req: any): ApiRespData {
        if (typeof req !== 'object') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Payload isn't an object"

            });
        }

        let keys = ["name"];
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

        let name = req.name;
        if (typeof name !== 'string') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The payload's name property isn't string"

            });
        }

        return prepareSuccessMsg({});
    }

    validGetAndDelRequest(name: any): ApiRespData {
        if (name === null || name === undefined) {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The query is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Query doesn't have 'name' property"

            });
        }

        if (typeof name !== 'string') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The query is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Query name property isn't string"

            });
        }

        return prepareSuccessMsg({});
    }

    async add(req: any): Promise<ApiRespData> {
        let valid = this.validAddRequest(req);
        if (valid.failure) return valid;

        let game: GameData = {
            name: req.name
        };

        try {
            let rval = await this.#dbSvc.createGame(game);
            if (!rval) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Game '${game.name}' couldn't be created`,
                    statusCode: 500
                }, {
                    detailCode: FailDetailCode.DATABASE_ERROR
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Game '${game.name}' couldn't be created`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({
            data: `Game '${game.name}' has created`
        });
    }

    async get(query: any): Promise<ApiRespData> {
        if (!Object.keys(query).length) {
            let dbResp = await this.#dbSvc.selectAllGame();
            return prepareSuccessMsg({ data: dbResp.map((element) => element.name)});
        }

        let name = query.name;
        let valid = this.validGetAndDelRequest(name);
        if (valid.failure) return valid;

        let game: GameData = {
            name: name
        };

        let dbResp: GameData;
        try {
            dbResp = await this.#dbSvc.selectGame(game.name);
            if (!dbResp) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Game '${game.name}' couldn't found`,
                }, {
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Game '${game.name}' couldn't found`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({ data: { name: dbResp.name } });
    }

    async del(name: string): Promise<ApiRespData> {
        let valid = this.validGetAndDelRequest(name);
        if (valid.failure) return valid;

        let game: GameData = {
            name: name
        };

        try {
            let rval = await this.#dbSvc.deleteGame(game.name);
            if (!rval) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Game '${game.name}' couldn't be deleted`,
                }, {
                    detailDescription: "Game couldn't found"
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Game '${game.name}' couldn't be deleted`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({ statusCode: 204 });
    }
}