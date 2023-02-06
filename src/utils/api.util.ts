import { ApiRespData } from "../models/api.model";

export enum FailCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    OPERATION_ERROR = "OPERATION_ERROR"
}

export enum FailDetailCode {
    REQUIRED_PROPERTY = "REQUIRED_PROPERTY",
    DATABASE_ERROR = "DATABASE_ERROR"
}

export function prepareSuccessMsg({ description = null, details = null, statusCode = 200 }): ApiRespData {
    return {
        statusCode: statusCode,
        successText: {
            description: description,
            details: details
        },
        failureText: null
    }
}

export function prepareFailureMsg(
    { failCode = null, failDescription = null, statusCode = 400 },
    { detailCode = null, detailDescription = null }): ApiRespData {
    return {
        statusCode: statusCode,
        successText: null,
        failureText: {
            code: failCode,
            description: failDescription,
            details: {
                code: detailCode,
                description: detailDescription
            }
        }
    }
}