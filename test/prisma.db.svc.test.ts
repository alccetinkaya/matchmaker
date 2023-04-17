import test from 'ava';
import { FixtureData } from '../src/models/fixture.model';
import { GameData } from '../src/models/game.model';
import { LeagueData, LeagueInfoData } from '../src/models/league.model';
import { PlayerData } from '../src/models/player.model';
import { UserData, UserRoleID } from '../src/models/user.model';
import { PrismaDatabaseService } from '../src/services/prisma.database.service';

const dbSvc = new PrismaDatabaseService();

// ############ game interface test ############
const validGame: GameData = {
    name: "unit_test"
}
const invalidGame: GameData = {
    name: "invalid"
}

test.serial('createGame', async t => {
    let rval = await dbSvc.createGame(validGame);
    t.deepEqual(rval, true);
});

test.serial('selectGame', async t => {
    let rval = await dbSvc.selectGame(validGame.name);
    t.deepEqual(rval.name, validGame.name);

    rval = await dbSvc.selectGame(invalidGame.name);
    t.deepEqual(rval, null);
});

test.serial('deleteGame', async t => {
    let rval = await dbSvc.deleteGame(validGame.name);
    t.deepEqual(rval, true);

    rval = await dbSvc.deleteGame(invalidGame.name);
    t.deepEqual(rval, false);
});

// ############ user interface test ############
const adminUser: UserData = {
    firstName: "test",
    lastName: "admin",
    email: "test@admin",
    password: "test",
    role: UserRoleID.ADMIN
}
const invalidUser: UserData = {
    firstName: "test",
    lastName: "admin",
    email: "test@invalid",
    password: "test",
    role: UserRoleID.ADMIN
}

test.serial('createUser', async t => {
    let rval = await dbSvc.createUser(adminUser);
    t.deepEqual(rval, true);
});

test.serial('selectUser', async t => {
    let rval = await dbSvc.selectUser(adminUser.email);
    t.deepEqual(rval.firstName, adminUser.firstName);
    t.deepEqual(rval.lastName, adminUser.lastName);

    rval = await dbSvc.selectUser(invalidUser.email);
    t.deepEqual(rval, null);
});

test.serial('deleteUser', async t => {
    let rval = await dbSvc.deleteUser(adminUser.email);
    t.deepEqual(rval, true);

    rval = await dbSvc.deleteUser(invalidUser.email);
    t.deepEqual(rval, false);
});

// ############ fixture interface test ############
let fixtureId: number = null;
const fixture: FixtureData = {
    id: null,
    matchInfo: [{teamList: {teamA: ["test1", "test2"], teamB: ["test3", "test4"]}, isActive: true, winner: ""}],
    gameName: validGame.name
}

///////////// create fixture test data /////////////
test.serial('createForFixtureTestData', async t => {
    let rval = await dbSvc.createGame(validGame);
    t.deepEqual(rval, true);
});
////////////////////////////////////////////////////

test.serial('createFixture', async t => {
    fixtureId = await dbSvc.createFixture(fixture);
    t.notDeepEqual(fixtureId, 0);
});

test.serial('selectFixture', async t => {
    let rval = await dbSvc.selectFixture(fixtureId);
    t.deepEqual(rval.matchInfo[0], fixture.matchInfo[0]);

    rval = await dbSvc.selectFixture(-1);
    t.deepEqual(rval, null);
});

test.serial('updateFixtureByWinner', async t => {
    let rval = await dbSvc.updateFixtureByWinner(fixtureId, 0, "teamA");
    t.deepEqual(rval.matchInfo[0].winner, "teamA");

    rval = await dbSvc.updateFixtureByWinner(-1, 0, "");
    t.deepEqual(rval, null);
});

test.serial('deleteFixture', async t => {
    let rval = await dbSvc.deleteFixture(fixtureId);
    t.deepEqual(rval, true);

    rval = await dbSvc.deleteFixture(-1);
    t.deepEqual(rval, false);
});

///////////// delete fixture test data /////////////
test.serial('deleteForFixtureTestData', async t => {
    let rval = await dbSvc.deleteGame(validGame.name);
    t.deepEqual(rval, true);
});
////////////////////////////////////////////////////

// ############ player interface test ############
const validPlayer: PlayerData = {
    name: "testPlayer"
}
const invalidPlayer: PlayerData = {
    name: "invalid"
}

test.serial('createPlayer', async t => {
    let rval = await dbSvc.createPlayer(validPlayer);
    t.deepEqual(rval, true);
});

test.serial('selectPlayer', async t => {
    let rval = await dbSvc.selectPlayer(validPlayer.name);
    t.deepEqual(rval.name, validPlayer.name);

    rval = await dbSvc.selectPlayer(invalidPlayer.name);
    t.deepEqual(rval, null);
});

test.serial('deletePlayer', async t => {
    let rval = await dbSvc.deletePlayer(validPlayer.name);
    t.deepEqual(rval, true);

    rval = await dbSvc.deletePlayer(invalidPlayer.name);
    t.deepEqual(rval, false);
});

// ############ league info interface test ############
const validLeagueInfo: LeagueInfoData = {
    name: "unit_test",
    point: 2
}
const invalidLeagueInfo: LeagueInfoData = {
    name: "invalid",
    point: 2
}

test.serial('createLeague', async t => {
    let rval = await dbSvc.createLeagueInfo(validLeagueInfo);
    t.deepEqual(rval, true);
});

test.serial('selectLeague', async t => {
    let rval = await dbSvc.selectLeagueInfo(validLeagueInfo.name);
    t.deepEqual(rval.name, validLeagueInfo.name);

    rval = await dbSvc.selectLeagueInfo(invalidLeagueInfo.name);
    t.deepEqual(rval, null);
});

test.serial('updateLeague', async t => {
    let data: LeagueInfoData = {
        name: validLeagueInfo.name,
        point: 4
    };
    let rval = await dbSvc.updateLeagueInfo(data);
    t.deepEqual(rval.point, data.point);

    rval = await dbSvc.updateLeagueInfo(invalidLeagueInfo);
    t.deepEqual(rval, null);
});

test.serial('deleteLeague', async t => {
    let rval = await dbSvc.deleteLeague(validLeagueInfo.name);
    t.deepEqual(rval, true);

    rval = await dbSvc.deleteLeague(invalidLeagueInfo.name);
    t.deepEqual(rval, false);
});

// ############ league interface test ############
const validLeague: LeagueData = {
    playerName: validPlayer.name,
    point: 1,
    matchCount: 1,
    leagueName: validLeagueInfo.name,
    gameName: "test"
}
const invalidLeague: LeagueData = {
    playerName: "invalidplayer",
    point: 10,
    matchCount: 10,
    leagueName: "invalidleague",
    gameName: "test"
}

///////////// create league test data /////////////
test.serial('createForPlayerLeagueTestData', async t => {
    let player = await dbSvc.createPlayer(validPlayer);
    t.deepEqual(player, true);

    let league = await dbSvc.createLeagueInfo(validLeagueInfo);
    t.deepEqual(league, true);

    let game = await dbSvc.createGame(validGame);
    t.deepEqual(game, true);
});
//////////////////////////////////////////////////////////

test.serial('createLeague', async t => {
    let rval = await dbSvc.createLeague(validLeague);
    t.deepEqual(rval, true);
});

test.serial('selectLeague', async t => {
    let rval = await dbSvc.selectLeagueByName(validLeague.playerName);
    t.deepEqual(rval.point, validLeague.point);
    t.deepEqual(rval.matchCount, validLeague.matchCount);

    rval = await dbSvc.selectLeagueByName(invalidLeague.playerName);
    t.deepEqual(rval, null);
});

test.serial('updateLeague', async t => {
    let data: LeagueData = {
        playerName: validLeague.playerName,
        point: 100,
        matchCount: 100,
        leagueName: validLeague.leagueName,
        gameName: validLeague.gameName
    };
    let rval = await dbSvc.updateLeague(data);
    t.deepEqual(rval.point, data.point);
    t.deepEqual(rval.matchCount, data.matchCount);

    rval = await dbSvc.updateLeague(invalidLeague);
    t.deepEqual(rval, null);
});

test.serial('deleteLeague', async t => {
    let rval = await dbSvc.deleteLeague(validLeague.playerName);
    t.deepEqual(rval, true);

    rval = await dbSvc.deleteLeague(invalidLeague.playerName);
    t.deepEqual(rval, false);
});

///////////// delete league test data /////////////
test.serial('deleteLeagueTestData', async t => {
    let player = await dbSvc.deletePlayer(validPlayer.name);
    t.deepEqual(player, true);

    let league = await dbSvc.deleteLeague(validLeagueInfo.name);
    t.deepEqual(league, true);

    let game = await dbSvc.deleteGame(validGame.name);
    t.deepEqual(game, true);
});
//////////////////////////////////////////////////////////