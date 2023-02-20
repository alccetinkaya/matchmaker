export interface FixtureMatchInfo {
    teamList: object;
    winner: string;
    isActive: boolean;
}

export interface FixtureData {
    matchInfo: FixtureMatchInfo[];
    gameName: string;
}