import { IDatabase } from "../../interfaces/database.interface";
import { ApiRespData } from "../../models/api.model";
import { PlayerData } from "../../models/player.model";
import { FailCode, FailDetailCode, prepareFailureMsg, prepareSuccessMsg } from "../../utils/api.util";


export class PlayerApiService {
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
                detailDescription: "The payload's 'name' property isn't string"

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
        if (valid.failureText) return valid;

        let player: PlayerData = {
            name: req.name
        };

        try {
            let rval = await this.#dbSvc.createPlayer(player);
            if (!rval) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Player '${player.name}' couldn't be created`,
                    statusCode: 500
                }, {
                    detailCode: FailDetailCode.DATABASE_ERROR
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Player '${player.name}' couldn't be created`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({
            description: `Player '${player.name}' has created`
        });
    }

    async get(name: string): Promise<ApiRespData> {
        let valid = this.validGetAndDelRequest(name);
        if (valid.failureText) return valid;

        let player: PlayerData = {
            name: name
        };

        let dbResp: PlayerData;
        try {
            dbResp = await this.#dbSvc.selectPlayer(player.name);
            if (!dbResp) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Player '${player.name}' couldn't found`,
                }, {
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Player '${player.name}' couldn't found`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({
            details: {
                name: dbResp.name
            },
        });
    }

    async del(name: string): Promise<ApiRespData> {
        let valid = this.validGetAndDelRequest(name);
        if (valid.failureText) return valid;

        let player: PlayerData = {
            name: name
        };

        try {
            let rval = await this.#dbSvc.deletePlayer(player.name);
            if (!rval) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `Player '${player.name}' couldn't be deleted`,
                }, {
                    detailDescription: "Player couldn't found"
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `Player '${player.name}' couldn't be deleted`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({ statusCode: 204 });
    }
}