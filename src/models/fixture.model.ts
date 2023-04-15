export interface FixtureMatchInfo {
    teamList: object;
    winner: string;
    isActive: boolean;
}

export interface FixtureData {
    id: number;
    matchInfo: FixtureMatchInfo[];
    gameName: string;
}