import { ApiRespData } from "./src/models/api.model";
import { FixtureApiService } from "./src/services/api/fixture.api.service";
import { GameApiService } from "./src/services/api/game.api.service";
import { LeagueApiService } from "./src/services/api/league.api.service";
import { PlayerApiService } from "./src/services/api/player.api.service";
import { PrismaDatabaseService } from "./src/services/prisma.database.service";
import { removeEmptyKeys } from "./src/utils/util";

const express = require('express')
const app = express()

app.use(express.json());

const gameSvc = new GameApiService(new PrismaDatabaseService());
const playerSvc = new PlayerApiService(new PrismaDatabaseService());
const fixtureSvc = new FixtureApiService(new PrismaDatabaseService());
const leagueSvc = new LeagueApiService(new PrismaDatabaseService());

async function sendResult(res: any, data: ApiRespData) {
  res.status(data.statusCode);
  let respData = data.failure ? data.failure : data.success;
  res.send(await removeEmptyKeys(respData));
}

// ############ GAME API ############
app.post('/game', async (req, res) => {
  sendResult(res, await gameSvc.add(req.body));
})

app.get('/game', async (req, res) => {
  sendResult(res, await gameSvc.get(req.query));
})

app.delete('/game', async (req, res) => {
  sendResult(res, await gameSvc.del(req.query.name));
})

// ############ FIXTURE API ############
app.post('/fixture', async (req, res) => {
  sendResult(res, await fixtureSvc.add(req.body));
})

app.get('/fixture', async (req, res) => {
  sendResult(res, await fixtureSvc.get(req.query));
})

app.put('/fixture', async (req, res) => {
  sendResult(res, await fixtureSvc.update(req.body));
})

app.delete('/fixture', async (req, res) => {
  sendResult(res, await fixtureSvc.del(req.query.id));
})

// ############ PLAYER API ############
app.post('/player', async (req, res) => {
  sendResult(res, await playerSvc.add(req.body));
})

app.get('/player', async (req, res) => {
  sendResult(res, await playerSvc.get(req.query));
})

app.delete('/player', async (req, res) => {
  sendResult(res, await playerSvc.del(req.query.name));
})

// ############ LEAGUE API ############
app.post('/league', async (req, res) => {
  sendResult(res, await leagueSvc.add(req.body));
})

app.get('/league', async (req, res) => {
  sendResult(res, await leagueSvc.get(req.query));
})

app.put('/league', async (req, res) => {
  sendResult(res, await leagueSvc.update(req.body));
})

app.delete('/league', async (req, res) => {
  sendResult(res, await leagueSvc.del(req.query.name));
})

app.listen(3000, () => {
  console.log("Server listening on", 3000);
})