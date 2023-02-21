import { IDatabase } from "../../interfaces/database.interface";
import { ApiRespData } from "../../models/api.model";
import { LeagueInfoData } from "../../models/league.model";
import { FailCode, FailDetailCode, prepareFailureMsg, prepareSuccessMsg } from "../../utils/api.util";

export class LeagueApiService {
    #dbSvc: IDatabase;

    constructor(dbSvc: IDatabase) {
        this.#dbSvc = dbSvc;
    }

    validAddAndUpdateRequest(req: any): ApiRespData {
        if (typeof req !== 'object') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "Payload isn't an object"

            });
        }

        let keys = ["name", "point"];
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

        let point = req.point;
        if (typeof point !== 'number') {
            return prepareFailureMsg({
                failCode: FailCode.VALIDATION_ERROR,
                failDescription: "The payload is invalid",
            }, {
                detailCode: FailDetailCode.REQUIRED_PROPERTY,
                detailDescription: "The payload's 'point' property isn't number"

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
                detailDescription: "Query 'name' property isn't string"

            });
        }

        return prepareSuccessMsg({});
    }

    async add(req: any): Promise<ApiRespData> {
        let valid = this.validAddAndUpdateRequest(req);
        if (valid.failureText) return valid;

        let leagueInfo: LeagueInfoData = {
            name: req.name,
            point: req.point
        }

        try {
            let rval = await this.#dbSvc.createLeague(leagueInfo);
            if (!rval) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `League '${leagueInfo.name}' couldn't be created`,
                    statusCode: 500
                }, {
                    detailCode: FailDetailCode.DATABASE_ERROR
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `League '${leagueInfo.name}' couldn't be created`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({
            description: `League '${leagueInfo.name}' has created`
        });
    }

    async get(name: any): Promise<ApiRespData> {
        let valid = this.validGetAndDelRequest(name);
        if (valid.failureText) return valid;

        let dbResp: LeagueInfoData;
        try {
            dbResp = await this.#dbSvc.selectLeague(name);
            if (!dbResp) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `League '${name}' couldn't found`,
                }, {});
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `League '${name}' couldn't found`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({
            details: dbResp,
        });
    }

    async update(req: any): Promise<ApiRespData> {
        let valid = this.validAddAndUpdateRequest(req);
        if (valid.failureText) return valid;

        let leagueInfo: LeagueInfoData = {
            name: req.name,
            point: req.point
        }

        if (!await this.#dbSvc.updateLeague(leagueInfo)) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `League '${leagueInfo.name}' couldn't be updated`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR
            });
        }

        return prepareSuccessMsg({
            details: `League '${leagueInfo.name}' has successfully updated`
        });
    }

    async del(name: string): Promise<ApiRespData> {
        let valid = this.validGetAndDelRequest(name);
        if (valid.failureText) return valid;

        try {
            let rval = await this.#dbSvc.deleteLeague(name);
            if (!rval) {
                return prepareFailureMsg({
                    failCode: FailCode.OPERATION_ERROR,
                    failDescription: `League '${name}' couldn't be deleted`,
                }, {
                    detailDescription: "League couldn't found"
                });
            }
        } catch (error) {
            return prepareFailureMsg({
                failCode: FailCode.OPERATION_ERROR,
                failDescription: `League '${name}' couldn't be deleted`,
                statusCode: 500
            }, {
                detailCode: FailDetailCode.DATABASE_ERROR,
                detailDescription: error
            });
        }

        return prepareSuccessMsg({ statusCode: 204 });
    }
}