import { FixtureData, FixtureMatchInfo } from "../models/fixture.model";
import { MatchData } from "../models/match.model";
import { SvcRespData } from "../models/service.model";
import { prepareFailureMsg, prepareSuccessMsg } from "../utils/service.util";
import { generateUniqueRandomInt } from "../utils/util";

export class MatchService {
    #teamNames: string[];
    #teamCnt: number;
    #teamPlayerCnt: number;
    #playerList: string[];
    #generatedNums: number[];

    constructor(teamNames: string[], teamPlayerCnt: number, playerList: string[]) {
        this.#teamNames = teamNames;
        this.#teamCnt = this.#teamNames.length;
        this.#teamPlayerCnt = teamPlayerCnt;
        this.#playerList = playerList;
        this.#generatedNums = [];
    }

    getRandomPlayer() {
        return this.#playerList.at(generateUniqueRandomInt(this.#playerList.length, this.#generatedNums));
    }

    match(): SvcRespData {
        // check if there are enough players to create at least one match
        let matchCount = Math.floor(this.#playerList.length / (this.#teamCnt * this.#teamPlayerCnt));
        if (matchCount <= 0) {
            return prepareFailureMsg("There are not enough players");
        }

        let matches: FixtureMatchInfo[] = [];
        for (let i = 0; i < matchCount; i++) {
            // get player list as count of team and team player count
            let playerList: string[] = [];
            for (let j = 0; j < (this.#teamCnt * this.#teamPlayerCnt); j++) {
                playerList.push(this.getRandomPlayer());
            }

            let fixMatchInfo: FixtureMatchInfo = { teamList: {}, winner: "", isActive: true };
            // iterate for all teams to put players
            for (let k = 0; k < this.#teamCnt; k++) {
                let obj = {};
                // get team name
                let teamName = this.#teamNames.at(k);

                // put players to this team as count of team player
                let teamPlayers: string[] = [];
                for (let l = 0; l < this.#teamPlayerCnt; l++) {
                    teamPlayers.push(playerList.pop());
                }

                // add the team and team players as key-value to the object
                // obj[teamName] = teamPlayers;
                // fixMatchInfo.teamList.push(obj);
                fixMatchInfo.teamList[teamName] = teamPlayers;
            }

            // add to matches
            matches.push(fixMatchInfo);
        }

        return prepareSuccessMsg(matches);
    }


}