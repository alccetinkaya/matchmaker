import { SvcRespData } from "../models/service.model";

export function prepareSuccessMsg(result: any): SvcRespData {
    return {
        status: true,
        result: result,
        failureText: null
    }
}

export function prepareFailureMsg(text: string): SvcRespData {
    return {
        status: false,
        result: null,
        failureText: text
    }
}