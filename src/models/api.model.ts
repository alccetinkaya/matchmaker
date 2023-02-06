export interface ApiSuccessMsg {
    description: string;
    details: any;
}

export interface ApiFailureMsgDetail {
    code: string;
    description: string;
}

export interface ApiFailureMsg {
    code: string;
    description: string;
    details: ApiFailureMsgDetail;
}

export interface ApiRespData {
    statusCode: number;
    successText: ApiSuccessMsg;
    failureText: ApiFailureMsg;
}