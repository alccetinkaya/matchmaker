import test from 'ava';
import { FixtureData } from '../src/models/fixture.model';
import { GameData } from '../src/models/game.model';
import { LeagueData, LeagueID, LeagueInfoData } from '../src/models/league.model';
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

test.serial('updateFixture', async t => {
    let rval = await dbSvc.updateFixture(fixtureId, 0, "teamA");
    t.deepEqual(rval.matchInfo[0].winner, "teamA");

    rval = await dbSvc.updateFixture(-1, 0, "");
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

// ############ league interface test ############
const validLeagueInfo: LeagueInfoData = {
    id: LeagueID.ASKO_KUSKO,
    name: "test",
    point: 2
}
const invalidLeagueInfo: LeagueInfoData = {
    id: 11,
    name: "invalid",
    point: 2
}

test.serial('createLeague', async t => {
    let rval = await dbSvc.createLeague(validLeagueInfo);
    t.deepEqual(rval, true);
});

test.serial('selectLeague', async t => {
    let rval = await dbSvc.selectLeague(validLeagueInfo.name);
    t.deepEqual(rval.name, validLeagueInfo.name);

    rval = await dbSvc.selectLeague(invalidLeagueInfo.name);
    t.deepEqual(rval, null);
});

test.serial('updateLeague', async t => {
    let data: LeagueInfoData = {
        id: validLeagueInfo.id,
        name: validLeagueInfo.name,
        point: 4
    };
    let rval = await dbSvc.updateLeague(data);
    t.deepEqual(rval.point, data.point);

    rval = await dbSvc.updateLeague(invalidLeagueInfo);
    t.deepEqual(rval, null);
});

test.serial('deleteLeague', async t => {
    let rval = await dbSvc.deleteLeague(validLeagueInfo.name);
    t.deepEqual(rval, true);

    rval = await dbSvc.deleteLeague(invalidLeagueInfo.name);
    t.deepEqual(rval, false);
});

// ############ league interface test ############
const validPlayerLeague: LeagueData = {
    playerName: validPlayer.name,
    point: 1,
    matchCount: 1,
    leagueId: validLeagueInfo.id,
    gameName: "test"
}
const invalidPlayerLeague: LeagueData = {
    playerName: "invalidplayer",
    point: 10,
    matchCount: 10,
    leagueId: LeagueID.ASKO_KUSKO,
    gameName: "test"
}

///////////// create player league test data /////////////
test.serial('createForPlayerLeagueTestData', async t => {
    let player = await dbSvc.createPlayer(validPlayer);
    t.deepEqual(player, true);

    let league = await dbSvc.createLeague(validLeagueInfo);
    t.deepEqual(league, true);

    let game = await dbSvc.createGame(validGame);
    t.deepEqual(game, true);
});
//////////////////////////////////////////////////////////

test.serial('createPlayerLeague', async t => {
    let rval = await dbSvc.createPlayerLeague(validPlayerLeague);
    t.deepEqual(rval, true);
});

test.serial('selectPlayerLeague', async t => {
    let rval = await dbSvc.selectPlayerLeague(validPlayerLeague.playerName);
    t.deepEqual(rval.point, validPlayerLeague.point);
    t.deepEqual(rval.matchCount, validPlayerLeague.matchCount);

    rval = await dbSvc.selectPlayerLeague(invalidPlayerLeague.playerName);
    t.deepEqual(rval, null);
});

test.serial('updatePlayerLeague', async t => {
    let data: LeagueData = {
        playerName: validPlayerLeague.playerName,
        point: 100,
        matchCount: 100,
        leagueId: validPlayerLeague.leagueId,
        gameName: validPlayerLeague.gameName
    };
    let rval = await dbSvc.updatePlayerLeague(data);
    t.deepEqual(rval.point, data.point);
    t.deepEqual(rval.matchCount, data.matchCount);

    rval = await dbSvc.updatePlayerLeague(invalidPlayerLeague);
    t.deepEqual(rval, null);
});

test.serial('deletePlayerLeague', async t => {
    let rval = await dbSvc.deletePlayerLeague(validPlayerLeague.playerName);
    t.deepEqual(rval, true);

    rval = await dbSvc.deleteLeague(invalidPlayerLeague.playerName);
    t.deepEqual(rval, false);
});

///////////// delete player league test data /////////////
test.serial('deletePlayerLeagueTestData', async t => {
    let player = await dbSvc.deletePlayer(validPlayer.name);
    t.deepEqual(player, true);

    let league = await dbSvc.deleteLeague(validLeagueInfo.name);
    t.deepEqual(league, true);

    let game = await dbSvc.deleteGame(validGame.name);
    t.deepEqual(game, true);
});
//////////////////////////////////////////////////////////