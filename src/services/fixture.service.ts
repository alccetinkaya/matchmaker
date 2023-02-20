import { IDatabase } from "../interfaces/database.interface";
import { FixtureData } from "../models/fixture.model";
import { SvcRespData } from "../models/service.model";
import { prepareFailureMsg, prepareSuccessMsg } from "../utils/service.util";
import { MatchService } from "./match.service";

export class FixtureService {
    #dbSvc: IDatabase;
    #gameName: string;
    #matchSvc: MatchService;

    constructor(dbSvc: IDatabase, gameName: string, teamNames: string[], teamPlayerCnt: number, playerList: string[]) {
        this.#dbSvc = dbSvc;
        this.#gameName = gameName;
        this.#matchSvc = new MatchService(teamNames, teamPlayerCnt, playerList);
    }

    async create(): Promise<SvcRespData> {
        let rval = this.#matchSvc.match();
        if (!rval.status) {
            return prepareFailureMsg(rval.failureText);
        }

        try {
            let fixData: FixtureData = { gameName: this.#gameName, matchInfo: rval.result };
            let id = await this.#dbSvc.createFixture(fixData);
            if (id == 0) {
                return prepareFailureMsg("Fixture couldn't be created");
            }

            return prepareSuccessMsg(`Fixture '${id}' has successfully created`);
        } catch (error) {
            return prepareFailureMsg(error);
        }
    }
}